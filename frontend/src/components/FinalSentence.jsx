// FinalSentence.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * FinalSentence - Displays the NLP-corrected English sentence
 * Animates when new sentence is generated
 */
function FinalSentence({ sentence, isHighlighted }) {
  return (
    <div className="glass-card p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-lg bg-accent-secondary/20 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-accent-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">
            Translated Sentence
          </h3>
          <p className="text-xs text-gray-400">Grammar-corrected English</p>
        </div>

        {/* NLP badge */}
        <div className="px-2 py-1 bg-accent-secondary/10 border border-accent-secondary/20 rounded-md">
          <span className="text-xs font-medium text-accent-secondary">NLP</span>
        </div>
      </div>

      {/* Sentence display area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={sentence || "empty"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`relative p-5 rounded-xl transition-all duration-500 ${
            isHighlighted
              ? "bg-gradient-to-r from-accent-secondary/20 via-accent-primary/10 to-accent-secondary/20 border border-accent-secondary/40"
              : "bg-dark-600/30 border border-white/5"
          }`}
        >
          {/* Animated glow */}
          {isHighlighted && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-accent-secondary/5 blur-2xl"
            />
          )}

          {sentence ? (
            <div className="relative">
              {/* Quote marks decoration */}
              <span className="absolute -top-2 -left-1 text-4xl text-accent-secondary/20 font-serif">
                "
              </span>
              <p className="text-xl font-medium text-white leading-relaxed pl-4">
                {sentence}
              </p>
              <span className="absolute -bottom-4 right-0 text-4xl text-accent-secondary/20 font-serif">
                "
              </span>
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">
              Completed sentences will appear here...
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Transformation indicator */}
      {sentence && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-4 flex items-center justify-center gap-3 text-xs"
        >
          <span className="text-gray-500">ISL Grammar</span>
          <svg
            className="w-4 h-4 text-accent-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          <span className="text-accent-success">Standard English</span>
        </motion.div>
      )}
    </div>
  );
}

export default FinalSentence;
