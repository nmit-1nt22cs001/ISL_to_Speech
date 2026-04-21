// StatusIndicator.jsx

import React from "react";
import { motion } from "framer-motion";

/**
 * StatusIndicator - Shows current system state
 * Different colors and animations for each state
 */
function StatusIndicator({ status, isConnected }) {
  // Define status configurations
  const statusConfig = {
    "Detecting...": {
      color: "accent-primary",
      bgColor: "bg-accent-primary/20",
      borderColor: "border-accent-primary/40",
      icon: (
        <svg
          className="w-5 h-5 animate-pulse"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      description: "Scanning for hand gestures",
    },
    "Recording word...": {
      color: "accent-warning",
      bgColor: "bg-accent-warning/20",
      borderColor: "border-accent-warning/40",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth={2} />
          <circle cx="12" cy="12" r="3" fill="currentColor" />
        </svg>
      ),
      description: "Capturing gesture sequence",
    },
    "No hands detected": {
      color: "gray-400",
      bgColor: "bg-gray-500/20",
      borderColor: "border-gray-500/40",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
          />
        </svg>
      ),
      description: "Show your hands to the camera",
    },
    "Speaking...": {
      color: "accent-success",
      bgColor: "bg-accent-success/20",
      borderColor: "border-accent-success/40",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          />
        </svg>
      ),
      description: "Converting to speech output",
    },
    Idle: {
      color: "gray-500",
      bgColor: "bg-dark-600",
      borderColor: "border-white/10",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      description: "System ready",
    },
  };

  const config = statusConfig[status] || statusConfig["Idle"];

  return (
    <motion.div
      layout
      className={`flex items-center gap-4 p-4 rounded-xl ${config.bgColor} border ${config.borderColor} transition-all duration-300`}
    >
      {/* Status icon */}
      <div className={`text-${config.color}`}>{config.icon}</div>

      {/* Status text */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-${config.color}`}>
            {status || "Idle"}
          </span>
          {/* Animated dots for active states */}
          {(status === "Detecting..." || status === "Recording word...") && (
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className={`w-1 h-1 rounded-full bg-${config.color}`}
                />
              ))}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{config.description}</p>
      </div>

      {/* Connection status */}
      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isConnected ? "bg-accent-success" : "bg-accent-danger"
          } ${isConnected ? "status-pulse" : ""}`}
        />
        <span
          className={`text-xs ${
            isConnected ? "text-accent-success" : "text-accent-danger"
          }`}
        >
          {isConnected ? "Connected" : "Disconnected"}
        </span>
      </div>
    </motion.div>
  );
}

export default StatusIndicator;
