// App.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import HomePage  from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";

import VideoFeed       from "./components/VideoFeed";
import WordDisplay     from "./components/WordDisplay";
import SentenceBuffer  from "./components/SentenceBuffer";
import FinalSentence   from "./components/FinalSentence";
import StatusIndicator from "./components/StatusIndicator";
import ControlPanel    from "./components/ControlPanel";
import StatsDisplay    from "./components/StatsDisplay";
import StopIndicator   from "./components/StopIndicator";

import useBackendData from "./hooks/useBackendData";

function ThemeToggle({ theme, onToggle }) {
  return (
    <button onClick={onToggle} aria-label="Toggle colour theme"
      className="w-8 h-8 rounded-lg bg-dark-600 border border-white/10 flex items-center justify-center hover:bg-dark-500 transition-colors">
      {theme === "dark" ? (
        <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
}

function AppView({ onNavigate, theme, onToggleTheme }) {
  const [isStreaming, setIsStreaming] = useState(false);

  const {
    data, isConnected, error,
    wordChanged, sentenceChanged,
    startPolling, stopPolling,
    startStream, stopStream,
    clearSentence, toggleSpeech,
    videoUrl,
  } = useBackendData(500);

  const handleStartStream = useCallback(async () => {
    if (isStreaming) return;
    await startStream();
    setIsStreaming(true);
    startPolling();
  }, [isStreaming, startPolling, startStream]);

  const handleStopStream = useCallback(async () => {
    if (!isStreaming) return;
    await stopStream();
    setIsStreaming(false);
    stopPolling();
  }, [isStreaming, stopPolling, stopStream]);

  useEffect(() => () => { stopStream(); stopPolling(); }, [stopStream, stopPolling]);

  const handleClearSentence = useCallback(() => clearSentence(), [clearSentence]);
  const handleToggleSpeech  = useCallback((e) => toggleSpeech(e), [toggleSpeech]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.code === "Space") { e.preventDefault(); isStreaming ? handleStopStream() : handleStartStream(); }
      else if (e.code === "KeyC") { handleClearSentence(); }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isStreaming, handleStartStream, handleStopStream, handleClearSentence]);

  return (
    <div className="app-shell bg-grid h-screen overflow-hidden flex flex-col">
      <div className="fixed inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />

      {/* Compact top bar */}
      <header className="relative z-10 flex items-center justify-between px-4 py-2 border-b border-white/5 bg-dark-800/60 backdrop-blur flex-shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate("home")} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Home
          </button>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
              </svg>
            </div>
            <span className="text-white font-semibold text-sm">ISL to Speech</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatsDisplay fps={data.fps} confidence={data.confidence} isConnected={isConnected} />
          {error && <span className="text-red-400 text-xs hidden sm:block">{error}</span>}
          <button onClick={() => onNavigate("about")} className="text-xs text-gray-500 hover:text-gray-300 transition-colors hidden sm:block">About</button>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        </div>
      </header>

      {/* Main content */}
      <div className="relative flex-1 min-h-0 overflow-auto">
        <div className="max-w-7xl mx-auto px-3 py-3 h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">

            {/* Left col: video + bottom row */}
            <div className="lg:col-span-3 flex flex-col gap-2">
              <VideoFeed videoUrl={videoUrl} isConnected={isConnected} isStreaming={isStreaming} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <SentenceBuffer buffer={data.buffer} />
                <FinalSentence  sentence={data.sentence} isHighlighted={sentenceChanged} />
              </div>
            </div>

            {/* Right col: controls */}
            <div className="lg:col-span-2 flex flex-col gap-2">
              <StatusIndicator
                status={!isConnected ? "Disconnected" : isStreaming ? data.status : "Idle"}
                isConnected={isConnected}
              />
              <WordDisplay word={data.word} isHighlighted={wordChanged} confidence={data.confidence} />
              <StopIndicator stopActive={data.stopActive} stopStartTime={data.stopStartTime} stopBuffer={data.stopBuffer} />
              <ControlPanel
                isStreaming={isStreaming}
                onStartStream={handleStartStream}
                onStopStream={handleStopStream}
                onClearSentence={handleClearSentence}
                onToggleSpeech={handleToggleSpeech}
              />
              <p className="text-center text-[10px] text-gray-600 pb-1">
                Built with <span className="text-accent-primary">MediaPipe · OpenCV · MLP</span>
              </p>
            </div>

          </div>
        </div>
      </div>

      <AnimatePresence>
        {!isConnected && isStreaming && (
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center gap-2 px-4 py-2 bg-accent-danger/20 border border-accent-danger/40 rounded-xl backdrop-blur-xl">
              <div className="w-2 h-2 rounded-full bg-accent-danger animate-pulse" />
              <span className="text-sm text-accent-danger font-medium">Connection lost. Attempting to reconnect...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  const [page, setPage]   = useState("home");
  const [theme, setTheme] = useState(() => localStorage.getItem("isl-theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("isl-theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

  return (
    <AnimatePresence mode="wait">
      <motion.div key={page} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
        {page === "home"  && <HomePage  onNavigate={setPage} />}
        {page === "about" && <AboutPage onNavigate={setPage} />}
        {page === "app"   && <AppView   onNavigate={setPage} theme={theme} onToggleTheme={toggleTheme} />}
      </motion.div>
    </AnimatePresence>
  );
}

export default App;


// // App.jsx

// import React, { useState, useEffect, useCallback } from "react";
// import { motion, AnimatePresence } from "framer-motion";

// // Pages
// import HomePage  from "./pages/HomePage";
// import AboutPage from "./pages/AboutPage";

// // Components
// import VideoFeed       from "./components/VideoFeed";
// import WordDisplay     from "./components/WordDisplay";
// import SentenceBuffer  from "./components/SentenceBuffer";
// import FinalSentence   from "./components/FinalSentence";
// import StatusIndicator from "./components/StatusIndicator";
// import ControlPanel    from "./components/ControlPanel";
// import StatsDisplay    from "./components/StatsDisplay";
// import StopIndicator   from "./components/StopIndicator";

// // Hook
// import useBackendData from "./hooks/useBackendData";

// // ── Theme toggle button ────────────────────────────────────────────────────
// function ThemeToggle({ theme, onToggle }) {
//   return (
//     <button
//       onClick={onToggle}
//       aria-label="Toggle colour theme"
//       className="w-9 h-9 rounded-xl bg-dark-600 border border-white/10 flex items-center justify-center
//                  hover:bg-dark-500 transition-colors"
//     >
//       {theme === "dark" ? (
//         <svg className="w-4 h-4 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
//           <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 011.414-1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
//         </svg>
//       ) : (
//         <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
//         </svg>
//       )}
//     </button>
//   );
// }

// // ── Main app view ──────────────────────────────────────────────────────────
// function AppView({ onNavigate, theme, onToggleTheme }) {
//   const [isStreaming, setIsStreaming] = useState(false);

//   const {
//     data, isConnected, error,
//     wordChanged, sentenceChanged,
//     startPolling, stopPolling,
//     startStream, stopStream,
//     clearSentence, toggleSpeech,
//     videoUrl,
//   } = useBackendData(500);

//   const handleStartStream = useCallback(async () => {
//     if (isStreaming) return;
//     await startStream();
//     setIsStreaming(true);
//     startPolling();
//   }, [isStreaming, startPolling, startStream]);

//   const handleStopStream = useCallback(async () => {
//     if (!isStreaming) return;
//     await stopStream();
//     setIsStreaming(false);
//     stopPolling();
//   }, [isStreaming, stopPolling, stopStream]);

//   useEffect(() => () => { stopStream(); stopPolling(); }, [stopStream, stopPolling]);

//   const handleClearSentence = useCallback(() => clearSentence(), [clearSentence]);
//   const handleToggleSpeech  = useCallback((e) => toggleSpeech(e), [toggleSpeech]);

//   useEffect(() => {
//     const handleKeyPress = (e) => {
//       if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
//       if (e.code === "Space") {
//         e.preventDefault();
//         isStreaming ? handleStopStream() : handleStartStream();
//       } else if (e.code === "KeyC") {
//         handleClearSentence();
//       }
//     };
//     window.addEventListener("keydown", handleKeyPress);
//     return () => window.removeEventListener("keydown", handleKeyPress);
//   }, [isStreaming, handleStartStream, handleStopStream, handleClearSentence]);

//   return (
//     <div className="app-shell bg-grid">
//       <div className="fixed inset-0 bg-gradient-to-br from-accent-primary/5 via-transparent to-accent-secondary/5 pointer-events-none" />

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Header */}
//         <motion.header
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//           className="app-header-card"
//         >
//           <div className="flex items-center justify-between mb-3">
//             <button
//               onClick={() => onNavigate("home")}
//               className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
//             >
//               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//               </svg>
//               Home
//             </button>

//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => onNavigate("about")}
//                 className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
//               >
//                 About
//               </button>
//               <ThemeToggle theme={theme} onToggle={onToggleTheme} />
//             </div>
//           </div>

//           <div className="inline-flex items-center gap-3 mb-3">
//             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-lg shadow-accent-primary/25">
//               <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
//                   d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
//               </svg>
//             </div>
//             <div className="text-left">
//               <h1 className="text-2xl sm:text-3xl font-bold text-white">ISL to Speech</h1>
//               <p className="text-sm text-gray-400">Indian Sign Language to Speech Translator</p>
//             </div>
//           </div>

//           {error && <div className="text-red-400 text-sm text-center mb-4">{error}</div>}

//           <div className="flex justify-center mt-4">
//             <StatsDisplay fps={data.fps} confidence={data.confidence} isConnected={isConnected} />
//           </div>
//         </motion.header>

//         {/* Main grid */}
//         <div className="dashboard-grid">
//           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="video-panel">
//             <VideoFeed videoUrl={videoUrl} isConnected={isConnected} isStreaming={isStreaming} />
//           </motion.div>

//           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="side-panel">
//             <StatusIndicator
//               status={!isConnected ? "Disconnected" : isStreaming ? data.status : "Idle"}
//               isConnected={isConnected}
//             />
//             <StopIndicator stopActive={data.stopActive} stopStartTime={data.stopStartTime} stopBuffer={data.stopBuffer} />
//             <WordDisplay word={data.word} isHighlighted={wordChanged} confidence={data.confidence} />
//             <ControlPanel
//               isStreaming={isStreaming}
//               onStartStream={handleStartStream}
//               onStopStream={handleStopStream}
//               onClearSentence={handleClearSentence}
//               onToggleSpeech={handleToggleSpeech}
//             />
//           </motion.div>
//         </div>

//         {/* Bottom section */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="bottom-panel">
//           <SentenceBuffer buffer={data.buffer} />
//           <FinalSentence sentence={data.sentence} isHighlighted={sentenceChanged} />
//         </motion.div>

//         <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }} className="mt-8 text-center">
//           <p className="text-xs text-gray-500">
//             Built with <span className="text-accent-primary">MediaPipe • OpenCV • MLP</span> | Final Year Project
//           </p>
//         </motion.footer>
//       </div>

//       {/* Connection lost toast */}
//       <AnimatePresence>
//         {!isConnected && isStreaming && (
//           <motion.div
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 50 }}
//             className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
//           >
//             <div className="flex items-center gap-3 px-4 py-3 bg-accent-danger/20 border border-accent-danger/40 rounded-xl backdrop-blur-xl">
//               <div className="w-2 h-2 rounded-full bg-accent-danger animate-pulse" />
//               <span className="text-sm text-accent-danger font-medium">Connection lost. Attempting to reconnect...</span>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }

// // ── Root router ────────────────────────────────────────────────────────────
// function App() {
//   const [page, setPage]   = useState("home");   // "home" | "app" | "about"
//   const [theme, setTheme] = useState(() =>
//     localStorage.getItem("isl-theme") || "dark"
//   );

//   useEffect(() => {
//     document.documentElement.setAttribute("data-theme", theme);
//     localStorage.setItem("isl-theme", theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme(t => t === "dark" ? "light" : "dark");

//   return (
//     <AnimatePresence mode="wait">
//       <motion.div
//         key={page}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         transition={{ duration: 0.2 }}
//       >
//         {page === "home"  && <HomePage  onNavigate={setPage} />}
//         {page === "about" && <AboutPage onNavigate={setPage} />}
//         {page === "app"   && (
//           <AppView onNavigate={setPage} theme={theme} onToggleTheme={toggleTheme} />
//         )}
//       </motion.div>
//     </AnimatePresence>
//   );
// }

// export default App;
