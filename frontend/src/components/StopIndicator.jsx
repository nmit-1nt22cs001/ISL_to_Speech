// StopIndicator.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function StopIndicator({ stopActive, stopStartTime, stopBuffer }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval;

    if (stopActive && stopStartTime) {
      interval = setInterval(() => {
        const now = Date.now() / 1000;
        setElapsed(Math.floor(now - stopStartTime));
      }, 200);
    } else {
      setElapsed(0);
    }

    return () => clearInterval(interval);
  }, [stopActive, stopStartTime]);

  return (
    <motion.div
      className={`p-4 rounded-xl border ${
        stopActive
          ? "bg-red-500/20 border-red-500/40"
          : "bg-gray-800 border-gray-600"
      }`}
      animate={{ scale: stopActive ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <p className="text-sm text-gray-400">Stop Buffer</p>

      <p
        className={`text-lg font-semibold ${
          stopActive ? "text-red-400" : "text-gray-300"
        }`}
      >
        {stopActive ? "ACTIVE (Recording Word)" : "Inactive"}
      </p>

      {stopActive && (
        <>
          <p className="text-xs text-gray-400 mt-1">
            Duration: {elapsed}s
          </p>

          <div className="mt-3 p-3 rounded-lg bg-black/20 border border-white/10">
            <p className="text-xs text-gray-400 mb-1">Buffered Alphabets</p>
            <p className="text-lg font-mono text-white tracking-widest">
              {stopBuffer && stopBuffer.length > 0 ? stopBuffer.join("") : "---"}
            </p>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-300">Recording gestures...</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default StopIndicator;