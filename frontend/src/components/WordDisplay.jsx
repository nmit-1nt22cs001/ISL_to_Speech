// WordDisplay.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * WordDisplay - Shows the currently detected word/alphabet
 * Features highlight animation when a new word is detected
 */
function WordDisplay({ word, isHighlighted, confidence }) {
  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-success/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-accent-success"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-white">Detected Word</h3>
          <p className="text-xs text-gray-400">Current recognition</p>
        </div>
      </div>

      {/* Word display area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={word || "empty"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={`relative p-6 rounded-xl text-center transition-all duration-300 ${
            isHighlighted
              ? "bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/50"
              : "bg-dark-600/50 border border-white/5"
          }`}
        >
          {/* Glow effect when highlighted */}
          {isHighlighted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 rounded-xl bg-accent-primary/10 blur-xl"
            />
          )}

          <span
            className={`relative text-4xl font-bold font-mono tracking-wider transition-colors duration-300 ${
              word ? "gradient-text" : "text-gray-600"
            }`}
          >
            {word || "---"}
          </span>

          {/* Confidence indicator */}
          {confidence !== null && word && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 flex items-center justify-center gap-2"
            >
              <div className="h-1.5 w-24 bg-dark-500 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.5 }}
                  className={`h-full rounded-full ${
                    confidence > 80
                      ? "bg-accent-success"
                      : confidence > 50
                      ? "bg-accent-warning"
                      : "bg-accent-danger"
                  }`}
                />
              </div>
              <span className="text-xs text-gray-400 font-mono">
                {confidence.toFixed(0)}%
              </span>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default WordDisplay;
