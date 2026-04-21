// App.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import VideoFeed from "./components/VideoFeed";
import WordDisplay from "./components/WordDisplay";
import SentenceBuffer from "./components/SentenceBuffer";
import FinalSentence from "./components/FinalSentence";
import StatusIndicator from "./components/StatusIndicator";
import ControlPanel from "./components/ControlPanel";
import StatsDisplay from "./components/StatsDisplay";
import StopIndicator from "./components/StopIndicator";
// Custom hook
import useBackendData from "./hooks/useBackendData";

function App() {
  // State for streaming control
  const [isStreaming, setIsStreaming] = useState(false);

  // Backend data hook
  const {
    data,
    isConnected,
    error,
    wordChanged,
    sentenceChanged,
    startPolling,
    stopPolling,
    startStream,     
    stopStream,
    clearSentence,
    toggleSpeech,
    videoUrl,
  } = useBackendData(300); // Poll every 300ms

  // Handlers
  const handleStartStream = useCallback(async () => {
    if (isStreaming) return; // ✅ prevent duplicate
    await startStream();
    setIsStreaming(true);
    startPolling();
  }, [isStreaming, startPolling, startStream]);

  const handleStopStream = useCallback(async () => {
    if (!isStreaming) return; // ✅ prevent duplicate
    await stopStream();
    setIsStreaming(false);
    stopPolling();
  }, [isStreaming, stopPolling, stopStream]);

  useEffect(() => {
    return () => {
      if (isStreaming) {
        stopStream();
      }
    };
  }, [isStreaming, stopStream]);

  const handleClearSentence = useCallback(() => {
    clearSentence();
  }, [clearSentence]);

  const handleToggleSpeech = useCallback(
    (enabled) => {
      toggleSpeech(enabled);
    },
    [toggleSpeech]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        if (isStreaming) {
          handleStopStream();
        } else {
          handleStartStream();
        }
      } else if (e.code === "KeyC") {
        handleClearSentence();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isStreaming, handleStartStream, handleStopStream, handleClearSentence]);

  return (
    <div className="min-h-screen bg-grid">
      {/* Gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />

      {/* Main container */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/25">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                />
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                ISL to Speech
              </h1>
              <p className="text-sm text-gray-400">
                Indian Sign Language to Speech Translator
              </p>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Stats bar */}
          <div className="flex justify-center mt-4">
            <StatsDisplay
              fps={data.fps}
              confidence={data.confidence}
              isConnected={isConnected}
            />
          </div>
        </motion.header>

        {/* Main grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Video feed */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <VideoFeed
              videoUrl={videoUrl}
              isConnected={isConnected}
              isStreaming={isStreaming}
            />
          </motion.div>

          {/* Right column - Controls and word display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            {/* Status indicator */}
            <StatusIndicator
              status={
                !isConnected
                  ? "Disconnected"
                  : isStreaming
                  ? data.status
                  : "Idle"
              }
              isConnected={isConnected}
            />
            <StopIndicator
              stopActive={data.stopActive}
              stopStartTime={data.stopStartTime}
              stopBuffer={data.stopBuffer}
            />
            
            {/* Current word display */}
            <WordDisplay
              word={data.word}
              isHighlighted={wordChanged}
              confidence={data.confidence}
            />

            {/* Control panel */}
            <ControlPanel
              isStreaming={isStreaming}
              onStartStream={handleStartStream}
              onStopStream={handleStopStream}
              onClearSentence={handleClearSentence}
              onToggleSpeech={handleToggleSpeech}
            />
          </motion.div>
        </div>

        {/* Bottom section - Buffer and sentence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6"
        >
          {/* Sentence buffer */}
          <SentenceBuffer buffer={data.buffer} />

          {/* Final sentence */}
          <FinalSentence
            sentence={data.sentence}
            isHighlighted={sentenceChanged}
          />
        </motion.div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            Built with{" "}
            <span className="text-accent-primary">
              MediaPipe • OpenCV • MLP
            </span>{" "}
            | Final Year Project
          </p>
        </motion.footer>
      </div>

      {/* Connection lost toast */}
      <AnimatePresence>
        {!isConnected && isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-3 px-4 py-3 bg-accent-danger/20 border border-accent-danger/40 rounded-xl backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-accent-danger animate-pulse" />
              <span className="text-sm text-accent-danger font-medium">
                Connection lost. Attempting to reconnect...
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
