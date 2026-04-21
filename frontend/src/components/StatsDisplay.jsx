// StatsDisplay.jsx

import React from "react";
import { motion } from "framer-motion";

/**
 * StatsDisplay - Shows optional performance metrics
 * FPS and confidence indicators
 */
function StatsDisplay({ fps, confidence, isConnected }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-dark-700/40 rounded-xl border border-white/5">
      {/* FPS Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-dark-600 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            FPS
          </p>
          <motion.p
            key={fps}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-mono font-semibold ${
              fps !== null
                ? fps > 20
                  ? "text-accent-success"
                  : fps > 10
                  ? "text-accent-warning"
                  : "text-accent-danger"
                : "text-gray-500"
            }`}
          >
            {fps !== null ? fps.toFixed(0) : "--"}
          </motion.p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-white/10" />

      {/* Confidence Indicator */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-dark-600 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">
            Confidence
          </p>
          <motion.p
            key={confidence}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            className={`text-sm font-mono font-semibold ${
              confidence !== null
                ? confidence > 80
                  ? "text-accent-success"
                  : confidence > 50
                  ? "text-accent-warning"
                  : "text-accent-danger"
                : "text-gray-500"
            }`}
          >
            {confidence !== null ? `${confidence.toFixed(0)}%` : "--%"}
          </motion.p>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-8 bg-white/10" />

      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-accent-success status-pulse" : "bg-accent-danger"
          }`}
        />
        <span
          className={`text-xs font-medium ${
            isConnected ? "text-accent-success" : "text-accent-danger"
          }`}
        >
          {isConnected ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
}

export default StatsDisplay;
