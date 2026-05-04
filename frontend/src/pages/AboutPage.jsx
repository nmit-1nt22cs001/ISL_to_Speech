// pages/AboutPage.jsx
import React from "react";
import { motion } from "framer-motion";

const stack = [
  { name: "MediaPipe",   role: "Hand landmark detection (21 keypoints / hand)" },
  { name: "OpenCV",      role: "Webcam capture, frame processing & annotation" },
  { name: "TensorFlow",  role: "MLP model training & real-time inference" },
  { name: "Flask",       role: "REST API + MJPEG video stream server" },
  { name: "React + Vite","role": "Frontend SPA with Framer Motion animations" },
  { name: "gTTS + Pygame","role": "Text-to-speech playback pipeline" },
];

const steps = [
  { step: "1", title: "Capture", desc: "Webcam frame captured at 30 fps via OpenCV." },
  { step: "2", title: "Detect", desc: "MediaPipe locates up to 2 hands with 21 landmarks each." },
  { step: "3", title: "Extract", desc: "84 normalised (x, y) values form the feature vector." },
  { step: "4", title: "Classify", desc: "MLP predicts the ISL letter/word with confidence gating." },
  { step: "5", title: "Buffer", desc: "Stable gestures (≥1 s hold) are accumulated into a sentence." },
  { step: "6", title: "Speak", desc: "Completed sentence is converted to speech via gTTS." },
];

export default function AboutPage({ onNavigate }) {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <button onClick={() => onNavigate("home")} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>
        <button onClick={() => onNavigate("app")} className="btn-primary text-sm py-2 px-5">
          Launch App
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
            About <span className="gradient-text">ISL Check</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A real-time Indian Sign Language recognition system that converts hand
            gestures into speech, helping bridge communication between ISL users and
            the hearing world.
          </p>
        </motion.div>

        {/* Pipeline */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">How It Works</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="glass-card p-5 relative overflow-hidden">
                <span className="absolute top-3 right-3 text-5xl font-black text-white/5 select-none">{step}</span>
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-white text-xs font-bold mb-3">
                  {step}
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tech stack */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Technology Stack</h2>
          <div className="space-y-3">
            {stack.map(({ name, role }) => (
              <div key={name} className="glass-card px-5 py-4 flex items-center gap-4">
                <div className="w-2 h-2 rounded-full bg-accent-primary flex-shrink-0" />
                <span className="text-white font-semibold text-sm w-36 flex-shrink-0">{name}</span>
                <span className="text-gray-400 text-sm">{role}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Model details */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">Model Details</h2>
          <div className="glass-card p-6 space-y-4 text-sm text-gray-400 leading-relaxed">
            <p>The classifier is a <span className="text-white">Multi-Layer Perceptron (MLP)</span> trained on 84-dimensional feature vectors
              composed of normalised (x, y) coordinates for 21 landmarks on each of 2 hands.</p>
            <p>Predictions pass through a <span className="text-white">three-stage rejection filter</span>:
              confidence must exceed 0.92, the gap between the top-two probabilities must exceed 0.15,
              and hand movement (std-dev of landmarks) must be below 0.20 — preventing spurious
              detections during gesture transitions.</p>
            <p>A gesture must be <span className="text-white">held stable for ≥ 1 second</span> and confirmed by a majority vote
              over a rolling window of 4 frames before a word is committed to the sentence buffer.</p>
          </div>
        </motion.section>

        {/* Keyboard shortcuts */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="text-xl font-bold text-white mb-6">Keyboard Shortcuts</h2>
          <div className="glass-card p-6 flex flex-col sm:flex-row gap-6 text-sm">
            {[["Space", "Toggle camera on / off"], ["C", "Clear current sentence"]].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-3">
                <kbd className="px-3 py-1.5 bg-dark-600 border border-white/10 rounded-lg text-white font-mono text-xs">{key}</kbd>
                <span className="text-gray-400">{desc}</span>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
