# gesture_buffer.py

class GestureBuffer:
    def __init__(self):
        self.buffer = []
        self.recording = False

    def update(self, label):
        """
        Returns:
            result -> completed word OR normal label OR None
            stop_active -> whether STOP mode is active
        """

        if label == "STOP":
            if not self.recording:
                # First STOP -> start buffering
                self.recording = True
                self.buffer = []
                print("🟢 Buffer started...")
                return None, True
            else:
                # Second STOP -> stop & return word
                self.recording = False
                word = "".join(self.buffer)
                self.buffer = []
                print("🔴 Buffer stopped:", word)
                return word, False

        if self.recording:
            self.buffer.append(label)
            print("➕ Added to buffer:", label)
            return None, True

        return label, False

    def get_buffer(self):
        return self.buffer.copy()