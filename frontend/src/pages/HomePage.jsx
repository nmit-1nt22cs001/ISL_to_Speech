// pages/HomePage.jsx
import React from "react";
import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
    ),
    title: "Real-time Detection",
    desc: "Detects ISL hand gestures via webcam using MediaPipe landmark tracking.",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 3h6m-6 4h6M9 11h6m-3 4h.01M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5z" />
    ),
    title: "Word Buffering",
    desc: "Builds full sentences from signed letters and words, then speaks them aloud.",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M15.536 8.464a5 5 0 010 7.072M12 6v6m0 0v6m0-6h6m-6 0H6" />
    ),
    title: "Text-to-Speech",
    desc: "Converts recognised sentences to natural speech using gTTS.",
  },
  {
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    title: "MLP Classifier",
    desc: "A trained Multi-Layer Perceptron model classifies 84-dimensional hand vectors.",
  },
];

export default function HomePage({ onNavigate }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
            </svg>
          </div>
          <span className="font-bold text-white text-sm tracking-wide">ISL Check</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onNavigate("about")}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            About
          </button>
          <button
            onClick={() => onNavigate("app")}
            className="btn-primary text-sm py-2 px-5"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            Final Year Project · Real-time ISL Recognition
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Sign Language
            <br />
            <span className="gradient-text">To Speech</span>
          </h1>

          <p className="max-w-xl mx-auto text-gray-400 text-lg leading-relaxed mb-10">
            Bridging communication gaps — ISL Check translates Indian Sign Language
            gestures into spoken words in real time using computer vision and deep learning.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("app")}
              className="btn-primary text-base py-3 px-8 flex items-center gap-2 justify-center"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Detecting
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate("about")}
              className="btn-secondary text-base py-3 px-8 flex items-center gap-2 justify-center"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>

        {/* ── Feature cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl w-full"
        >
          {features.map((f, i) => (
            <div key={i} className="glass-card p-5 text-left">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-accent-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {f.icon}
                </svg>
              </div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-6 text-xs text-gray-600">
        Built with <span className="text-accent-primary">MediaPipe · OpenCV · TensorFlow · Flask · React</span>
      </footer>
    </div>
  );
}
