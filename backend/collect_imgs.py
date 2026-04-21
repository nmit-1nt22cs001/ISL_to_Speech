#collect_imgs.py script

import os
import cv2
import time

# ========= CONFIGURATION =========
DATA_DIR = "./data"
IMAGES_PER_CLASS = 400

GESTURES = [
    # # Words
    # "HELLO", "SORRY", "THANK YOU", "PLEASE", "MY", "NAME IS", "NAME",  "INDIA", "WOMAN", "MAN",
    # "KNOW", "DON'T"
    # "YOUR", "WHAT"

    # # Alphabets
    # "A", "B", "T",

    # # Special Sign
    # "STOP"

    # "Invalid_gesture"
]

# ========= CREATE MAIN DATA FOLDER =========
os.makedirs(DATA_DIR, exist_ok=True)

# ========= OPEN WEBCAM =========
cap = cv2.VideoCapture(0)
cap.set(3, 640)
cap.set(4, 480)

if not cap.isOpened():
    print("❌ Webcam not detected!")
    exit()

print("\n✅ Webcam connected successfully.")

# ========= DATA COLLECTION LOOP =========
for gesture in GESTURES:
    gesture_path = os.path.join(DATA_DIR, gesture)
    os.makedirs(gesture_path, exist_ok=True)

    existing_count = len(os.listdir(gesture_path))
    if existing_count >= IMAGES_PER_CLASS:
        print(f"✅ '{gesture}' already has {existing_count} images. Skipping...")
        continue

    print(f"\n📸 Collecting data for: {gesture}")
    print("Press 'Q' to start capturing | Press 'ESC' to quit anytime")

    # -------- READY SCREEN --------
    while True:
        ret, frame = cap.read()
        if not ret:
            print("⚠ Camera read error.")
            break

        cv2.putText(frame, f"Gesture: {gesture}",
                    (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)

        cv2.putText(frame, "Press 'Q' to START | ESC to EXIT",
                    (30, 100), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 255), 2)

        cv2.imshow("ISL Data Collection", frame)

        key = cv2.waitKey(1) & 0xFF
        if key == ord('q'):
            break
        elif key == 27:
            cap.release()
            cv2.destroyAllWindows()
            exit()

    # -------- COUNTDOWN --------
    for sec in [3, 2, 1]:
        ret, frame = cap.read()
        if not ret:
            break

        cv2.putText(frame, str(sec),
                    (280, 240), cv2.FONT_HERSHEY_SIMPLEX, 4,
                    (0, 0, 255), 6)

        cv2.imshow("ISL Data Collection", frame)
        cv2.waitKey(1000)

    # -------- IMAGE CAPTURE --------
    counter = existing_count
    while counter < IMAGES_PER_CLASS:
        ret, frame = cap.read()
        if not ret:
            break

        cv2.imshow("ISL Data Collection", frame)
        cv2.imwrite(os.path.join(gesture_path, f"{counter}.jpg"), frame)

        counter += 1

        # Capture control (safe speed for i5 + NVIDIA)
        if cv2.waitKey(20) & 0xFF == 27:
            break

    print(f"✅ Completed: {gesture} ({counter} images saved)")

# ========= CLEANUP =========
cap.release()
cv2.destroyAllWindows()
print("\n🎉 ALL DATA COLLECTION FINISHED SUCCESSFULLY!")
