#create_dataset.py script

import os
import pickle
import cv2
import mediapipe as mp

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,
    min_detection_confidence=0.5
)

DATA_DIR = './data'
OUTPUT_FILE = 'data.pickle'

data, labels = [], []

for gesture in os.listdir(DATA_DIR):
    gesture_path = os.path.join(DATA_DIR, gesture)
    if not os.path.isdir(gesture_path):
        continue

    gesture_label = gesture.upper()
    count = 0

    for img_name in os.listdir(gesture_path):
        if not img_name.lower().endswith(('.jpg', '.png', '.jpeg')):
            continue

        img_path = os.path.join(gesture_path, img_name)
        img = cv2.imread(img_path)
        if img is None:
            continue

        img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        results = hands.process(img_rgb)

        if not results.multi_hand_landmarks:
            continue

        data_aux = []

        # ✅ Extract up to 2 hands
        for hand_landmarks in results.multi_hand_landmarks[:2]:
            x_, y_ = [], []

            for lm in hand_landmarks.landmark:
                x_.append(lm.x)
                y_.append(lm.y)

            for lm in hand_landmarks.landmark:
                data_aux.append(lm.x - min(x_))
                data_aux.append(lm.y - min(y_))

        # ✅ If only 1 hand detected → pad second hand with zeros
        if len(results.multi_hand_landmarks) == 1:
            data_aux.extend([0] * 42)

        # ✅ Final safety check (must always be 84)
        if len(data_aux) == 84:
            data.append(data_aux)
            labels.append(gesture_label)
            count += 1

    print(f"✔ Processed {count} samples for '{gesture_label}'")

with open(OUTPUT_FILE, 'wb') as f:
    pickle.dump({'data': data, 'labels': labels}, f)

print(f"\n✅ Saved {len(data)} samples to '{OUTPUT_FILE}'")
