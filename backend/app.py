# app.py

from flask import Flask, Response, jsonify, request
from flask_cors import CORS
import threading
import inference_mlp as infer

app = Flask(__name__)
CORS(app)

@app.route('/video')
def video_feed():
    print("📡 Video stream requested")
    return Response(
        infer.generate_frames(),
        mimetype='multipart/x-mixed-replace; boundary=frame',
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"}
    )

@app.route('/data')
def get_data():
    return jsonify({
        'word': infer.current_word,
        'buffer': infer.word_buffer,
        'sentence': infer.final_sentence,
        'status': infer.detection_status,
        'confidence': infer.confidence_score,
        'fps': infer.current_fps,
        'stopActive': infer.stop_active,
        'stopStartTime': infer.stop_start_time,
        'stopBuffer': infer.buffer_controller.get_buffer()
    })

@app.route('/start', methods=['POST'])
def start():
    infer.streaming = True
    return jsonify({"status": "started"})

@app.route('/stop', methods=['POST'])
def stop():
    infer.streaming = False
    return jsonify({"status": "stopped"})

@app.route('/clear', methods=['POST'])
def clear_sentence():
    infer.word_buffer.clear()
    infer.sentence_buffer.clear()
    infer.current_word = ""
    infer.final_sentence = ""
    infer.stop_active = False
    infer.stop_start_time = None
    infer.buffer_controller.buffer = []
    infer.buffer_controller.recording = False
    return jsonify({'success': True})

@app.route('/speech', methods=['POST'])
def toggle_speech():
    data = request.json
    infer.speech_enabled = data.get('enabled', True)
    return jsonify({'success': True})

if __name__ == '__main__':
    detection_thread = threading.Thread(target=infer.run_detection, daemon=True)
    detection_thread.start()

    app.run(host='0.0.0.0', port=5000, threaded=True)