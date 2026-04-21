// VideoFeed.jsx

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VideoFeed - Displays the live webcam stream from backend
 * Handles loading states and connection errors gracefully
 */
function VideoFeed({ videoUrl, isConnected, isStreaming }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isStreaming) {
      setIsLoading(true);
      setHasError(false);
    }
  }, [isStreaming]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <div className="glass-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Live Feed</h2>
            <p className="text-xs text-gray-400">Hand gesture detection</p>
          </div>
        </div>

        {/* Live indicator */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isConnected && isStreaming
                ? "bg-accent-success status-pulse"
                : "bg-gray-500"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              isConnected && isStreaming ? "text-accent-success" : "text-gray-500"
            }`}
          >
            {isConnected && isStreaming ? "LIVE" : "OFFLINE"}
          </span>
        </div>
      </div>

      {/* Video container */}
      <div className="video-container aspect-video bg-dark-800 relative">
        <AnimatePresence mode="wait">
          {/* Loading state */}
          {isLoading && isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-dark-800 rounded-xl"
            >
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-accent-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-gray-400 text-sm">Connecting to camera...</p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {hasError && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-dark-800 rounded-xl"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-accent-danger/20 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-accent-danger"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">
                  Connection Failed
                </p>
                <p className="text-gray-500 text-sm">
                  Unable to connect to video stream
                </p>
              </div>
            </motion.div>
          )}

          {/* Stopped state */}
          {!isStreaming && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-dark-800 rounded-xl"
            >
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-dark-600 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <p className="text-gray-300 font-medium mb-1">Camera Stopped</p>
                <p className="text-gray-500 text-sm">
                  Click Start to begin detection
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actual video stream */}
        {isStreaming && (
          <img
            src={videoUrl}
            // src={`${videoUrl}?t=${Date.now()}`}
            // src={`${videoUrl}?t=${frameKey}`}
            alt="Live hand gesture detection feed"
            className={`w-full h-full object-contain rounded-xl transition-opacity duration-300 ${
              isLoading || hasError ? "opacity-0" : "opacity-100"
            }`}
            onLoad={handleLoad}
            onError={handleError}
          />
        )}

        {/* Overlay decorations */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
          <div className="px-2 py-1 bg-black/50 backdrop-blur-sm rounded-md">
            <span className="text-xs text-white/70 font-mono">MediaPipe</span>
          </div>
        </div>

        {/* Corner brackets decoration */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-accent-primary/50 rounded-tl pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-accent-primary/50 rounded-tr pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-accent-primary/50 rounded-bl pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-accent-primary/50 rounded-br pointer-events-none" />
      </div>
    </div>
  );
}

export default VideoFeed;
