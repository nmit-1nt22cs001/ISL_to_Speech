# inference_mlp.py

import pickle
import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model
from gtts import gTTS
import pygame
import threading
import queue
import tempfile
import os
import time
import sys
from collections import deque
from gesture_buffer2 import GestureBuffer
import atexit


current_word = ""
word_buffer = []
final_sentence = ""
detection_status = "Idle"
confidence_score = 0
current_fps = 0
frame_global = None
streaming = False
frame_lock = threading.Lock()

unknown_counter = 0
UNKNOWN_LIMIT = 3

stop_active = False
stop_start_time = None

#==========================
# Load MLP model + encoder
# =========================
model = load_model("gesture_mlp.h5")
encoder = pickle.load(open("label_encoder.p", "rb"))

THRESHOLD = 0.98  # 🔥 Strong rejection
SPEECH_THRESHOLD = 0.95  # 🔥 stricter than detection

# =========================
# Sentence timing
# =========================
NO_HANDS_TIMEOUT = 2.0
last_hand_time = time.time()


# =========================
# Sentence Buffer + NLP
# =========================
sentence_buffer = []

def convert_to_english(words):
    sentence = " ".join(words)

    rules = {
        "YOUR NAME WHAT": "What is your name?",
        "MY KNOW DON'T": "I don't know.",
    }

    return rules.get(sentence, sentence.capitalize())

# =========================
# Stability Buffers
# =========================
confidence_buffer = deque(maxlen=5)
label_buffer = deque(maxlen=5)

fps_buffer = deque(maxlen=10)

# =========================
# Gesture Buffer
# =========================
buffer_controller = GestureBuffer()

# =========================
# Audio setup
# =========================
pygame.mixer.init()
speech_queue = queue.Queue()
exit_event = threading.Event()

def speech_worker():
    while not exit_event.is_set():
        try:
            text = speech_queue.get(timeout=0.5)
        except queue.Empty:
            continue

        if text == "_EXIT_":
            break

        try:
            temp_path = os.path.join(tempfile.gettempdir(), f"{time.time()}.mp3")
            tts = gTTS(text=text, lang='en')
            tts.save(temp_path)

            pygame.mixer.music.load(temp_path)
            pygame.mixer.music.play()

            while pygame.mixer.music.get_busy():
                if exit_event.is_set():
                    pygame.mixer.music.stop()
                    break
                time.sleep(0.05)

            pygame.mixer.music.unload()
            os.remove(temp_path)

        except Exception as e:
            print("TTS Error:", e)

        speech_queue.task_done()

tts_thread = threading.Thread(target=speech_worker, daemon=True)
tts_thread.start()

# =========================
# MediaPipe setup (ONLY HANDS)
# =========================
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils

hands = mp_hands.Hands(
    static_image_mode=False,
    max_num_hands=2,
    min_detection_confidence=0.6
)

# =========================
# Webcam
# =========================
cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

GESTURE_HOLD_TIME = 1.0
MIN_REPEAT_INTERVAL = 1.0
prev_label = None
gesture_start_time = None
last_spoken_time = 0
final_confidence = 0
speech_enabled = True

# =========================
# Main Loop
# =========================
def run_detection():
    global current_word, word_buffer, final_sentence, final_confidence
    global detection_status, confidence_score, current_fps, frame_global, streaming
    global last_hand_time, prev_label, gesture_start_time, last_spoken_time, unknown_counter
    global stop_active, stop_start_time
    
    while True:
        if not streaming:
            if cap.isOpened():
                cap.release()
            time.sleep(0.1)
            continue

        # Ensure camera is opened when streaming starts
        if not cap.isOpened():
            cap.open(0)
            
        start_time = time.time()
        stop_flag = stop_active

        ret, frame = cap.read()
        if not ret:
            print("❌ Camera read failed, retrying...")
            cap.release()
            time.sleep(0.5)
            cap.open(0)
            continue


        H, W, _ = frame.shape
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(frame_rgb)

        # =========================
        # No-hand detection
        # =========================
        if not results.multi_hand_landmarks:
            if time.time() - last_hand_time > NO_HANDS_TIMEOUT:
                if sentence_buffer:
                    print("⏱ No hands → Sentence trigger")

                    filtered = [w for w in sentence_buffer if w != "UNKNOWN"]
                    if not filtered:
                        sentence_buffer.clear()
                        continue

                    print("🧠 Raw:", filtered)

                    if len(filtered) == 1:
                        final_sentence = filtered[0].capitalize()
                    else:
                        final_sentence = convert_to_english(filtered)

                    print("🗣 Speaking sentence:", final_sentence)
                    if speech_enabled:
                        if speech_queue.qsize() < 2:
                            speech_queue.put(final_sentence)

                    sentence_buffer.clear()

                last_hand_time = time.time()

        else:
            last_hand_time = time.time()

        detected_label = None
        detection_status = "Idle"

        if results.multi_hand_landmarks:
            data_aux, x_, y_ = [], [], []

            for hand_landmarks in results.multi_hand_landmarks[:2]:
                mp_drawing.draw_landmarks(
                    frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                for lm in hand_landmarks.landmark:
                    x_.append(lm.x)
                    y_.append(lm.y)

                for lm in hand_landmarks.landmark:
                    data_aux.append(lm.x - min(x_))
                    data_aux.append(lm.y - min(y_))

            # Pad if only 1 hand
            if len(results.multi_hand_landmarks) == 1:
                data_aux.extend([0] * 42)

            hand_size = (max(x_) - min(x_)) * (max(y_) - min(y_))

            if hand_size < 0.02:
                detected_label = "UNKNOWN"
                confidence_buffer.clear()
                label_buffer.clear()
                continue

            if len(data_aux) == 84:

                # probs = model.predict(np.asarray([data_aux]), verbose=0)[0]
                input_data = np.array([data_aux], dtype=np.float32)
                probs = model(input_data, training=False).numpy()[0]

                sorted_probs = np.sort(probs)[::-1]
                max_prob = sorted_probs[0]
                second_prob = sorted_probs[1]

                confidence_gap = max_prob - second_prob
                predicted_class = np.argmax(probs)

                raw_label = encoder.inverse_transform([predicted_class])[0]

                if raw_label == "Invalid_gesture":
                    raw_label = "UNKNOWN"

                if max_prob < 0.92 or confidence_gap < 0.15:
                    raw_label = "UNKNOWN"


                movement = np.std(data_aux)
                if movement > 0.20:
                    raw_label = "UNKNOWN"

                if raw_label == "UNKNOWN":
                    unknown_counter += 1
                    if unknown_counter < UNKNOWN_LIMIT and prev_label is not None:
                        raw_label = prev_label
                else:
                    unknown_counter = 0

                if raw_label == "UNKNOWN":
                    confidence_buffer.clear()
                    label_buffer.clear()

                confidence_buffer.append(max_prob)
                label_buffer.append(raw_label)

                if len(label_buffer) == 5:
                    most_common_label = max(set(label_buffer), key=label_buffer.count)

                    if label_buffer.count(most_common_label) == 5:
                        avg_conf = sum(confidence_buffer) / len(confidence_buffer)
                        final_confidence = avg_conf

                        if most_common_label != "UNKNOWN" and avg_conf >= 0.95:
                            detected_label = most_common_label
                        else:
                            detected_label = "UNKNOWN"
                    else:
                        detected_label = "UNKNOWN"

                x1, y1 = int(min(x_) * W) - 10, int(min(y_) * H) - 10
                x2, y2 = int(max(x_) * W) + 10, int(max(y_) * H) + 10

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)

                display_label = "..."

                if detected_label:
                    display_label = f"{detected_label} ({int(final_confidence*100)}%)"
                elif raw_label:
                    display_label = f"{raw_label} (~)"

                cv2.putText(frame, display_label,
                            (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX,
                            1.0,
                            (255, 255, 0), 2)
                

        if detected_label and detected_label != "UNKNOWN":
            detection_status = "Detecting..."
        elif results.multi_hand_landmarks:
            detection_status = "Processing..."
        else:
            detection_status = "No hands detected"

        # =========================
        # Gesture Timing + Speech
        # =========================
        current_time = time.time()

        if detected_label != prev_label or detected_label == "UNKNOWN":
            gesture_start_time = current_time
            prev_label = detected_label

        elif detected_label and detected_label != "UNKNOWN" and (current_time - gesture_start_time) >= GESTURE_HOLD_TIME:
            if (current_time - last_spoken_time) >= MIN_REPEAT_INTERVAL:

                result, stop_flag = buffer_controller.update(detected_label)

                stop_active = stop_flag
                if stop_flag and stop_start_time is None:
                    stop_start_time = time.time()
                elif not stop_flag:
                    stop_start_time = None

                if result and result != "UNKNOWN" and final_confidence >= SPEECH_THRESHOLD:
                    if result not in ["STOP"]:
                        if not sentence_buffer or (
                            sentence_buffer[-1] != result or
                            (current_time - last_spoken_time) > 1.5
                        ):
                            sentence_buffer.append(result)

                        current_word = result
                        word_buffer = sentence_buffer.copy()
                        detection_status = "Detecting..."
                        confidence_score = int(final_confidence * 100) if detected_label else 0

                    last_spoken_time = current_time

            gesture_start_time = current_time

        # =========================
        # STOP overlay
        # =========================
        if stop_active:
            cv2.putText(
                frame,
                "STOP MODE ACTIVE",
                (50, 50),
                cv2.FONT_HERSHEY_SIMPLEX,
                1.2,
                (0, 0, 255),
                3
            )

        # =========================
        # Frame global update
        # =========================
        with frame_lock:
            frame_global = frame.copy()

        # =========================
        # FPS
        # =========================
        delta = time.time() - start_time
        if delta > 0:
            fps_buffer.append(1 / delta)
            current_fps = int(sum(fps_buffer) / len(fps_buffer))

def generate_frames():
    global frame_global, streaming

    while True:
        if not streaming:
            time.sleep(0.1)
            continue

        with frame_lock:
            if frame_global is None:
                time.sleep(0.05)
                continue
            frame_copy = frame_global.copy()

        ret, buffer = cv2.imencode('.jpg', frame_copy)
        if not ret:
            continue

        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
        

def cleanup():
    if cap.isOpened():
        cap.release()
    exit_event.set()
    try:
        tts_thread.join(timeout=1)
    except:
        pass
    pygame.mixer.quit()

atexit.register(cleanup)