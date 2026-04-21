// SentenceBuffer.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SentenceBuffer - Displays the accumulated words forming the sentence
 * Shows words as animated bubbles/tags
 */
function SentenceBuffer({ buffer }) {
  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-warning/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-accent-warning"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">Word Buffer</h3>
          <p className="text-xs text-gray-400">
            {buffer.length} word{buffer.length !== 1 ? "s" : ""} collected
          </p>
        </div>

        {/* Word count badge */}
        <div className="px-3 py-1 bg-dark-600 rounded-full">
          <span className="text-xs font-mono text-accent-primary">
            {buffer.length}/∞
          </span>
        </div>
      </div>

      {/* Buffer display area */}
      <div className="min-h-[80px] p-4 bg-dark-600/30 rounded-xl border border-white/5">
        {buffer.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500 text-sm italic">
              Words will appear here as you sign...
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {buffer.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  layout
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                  className="word-bubble inline-flex items-center gap-1.5 px-3 py-1.5 
                           bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 
                           border border-accent-primary/30 rounded-lg"
                >
                  <span className="text-xs text-accent-primary/70 font-mono">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-white">{word}</span>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Visual hint */}
      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Use STOP gesture to complete a word</span>
      </div>
    </div>
  );
}

export default SentenceBuffer;
