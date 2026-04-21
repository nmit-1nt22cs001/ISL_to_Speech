// useBackendData.js

import { useState, useEffect, useCallback, useRef } from "react";

// Backend API base URL - change this to match your Flask server
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

/**
 * Custom hook to fetch and manage backend data
 * Polls the /data endpoint at specified intervals
 */
export function useBackendData(pollingInterval = 300) {
  const [data, setData] = useState({
    word: "",
    buffer: [],
    sentence: "",
    status: "Idle",
    confidence: null,
    fps: null,
    stopActive: false,
    stopStartTime: null,
    stopBuffer: [],
  });

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  // Track previous values for change detection
  const prevWordRef = useRef("");
  const prevSentenceRef = useRef("");

  const wordTimeoutRef = useRef(null);
  const sentenceTimeoutRef = useRef(null);

  // Flags for UI highlighting
  const [wordChanged, setWordChanged] = useState(false);
  const [sentenceChanged, setSentenceChanged] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();

      // Detect word changes
      if (jsonData.word && jsonData.word !== prevWordRef.current) {
        setWordChanged(true);
        prevWordRef.current = jsonData.word;
        // Reset highlight after animation
        if (wordTimeoutRef.current) {
          clearTimeout(wordTimeoutRef.current);
        }

        wordTimeoutRef.current = setTimeout(() => {
          setWordChanged(false);
        }, 500);
      }

      // Detect sentence changes
      if (jsonData.sentence && jsonData.sentence !== prevSentenceRef.current) {
        setSentenceChanged(true);
        prevSentenceRef.current = jsonData.sentence;
        if (sentenceTimeoutRef.current) {
          clearTimeout(sentenceTimeoutRef.current);
        }

        sentenceTimeoutRef.current = setTimeout(() => {
          setSentenceChanged(false);
        }, 800);
      }

      setData({
        word: jsonData.word || "",
        buffer: jsonData.buffer || [],
        sentence: jsonData.sentence || "",
        status: jsonData.status || "Idle",
        confidence: jsonData.confidence ?? null,
        fps: jsonData.fps ?? null,
        stopActive: jsonData.stopActive || false,
        stopStartTime: jsonData.stopStartTime || null,
        stopBuffer: jsonData.stopBuffer || [],
      });

      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err.message);

      // 👇 ADD THIS PART
      setData((prev) => ({
        ...prev,
        fps: null,
        confidence: null,
        status: "Disconnected",
      }));

      console.error("Failed to fetch backend data:", err);
    }
  }, []);

  // Polling effect
  useEffect(() => {
    if (!isPolling) return;

    // Initial fetch
    fetchData();

    // Set up polling interval
    const intervalId = setInterval(fetchData, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchData, pollingInterval, isPolling]);

  // Control functions
  const startPolling = useCallback(() => setIsPolling(true), []);
  const stopPolling = useCallback(() => setIsPolling(false), []);


  const startStream = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/start`, { method: "POST" });
      if (!res.ok) throw new Error("Start failed");
    } catch (err) {
      console.error("Failed to start stream:", err);
    }
  }, []);

  const stopStream = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/stop`, { method: "POST" });
      if (!res.ok) throw new Error("Stop failed");
    } catch (err) {
      console.error("Failed to stop stream:", err);
    }
  }, []);

  // API action functions
  const clearSentence = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/clear`, { method: "POST" });
    } catch (err) {
      console.error("Failed to clear sentence:", err);
    }
  }, []);

  const toggleSpeech = useCallback(async (enabled) => {
    try {
      await fetch(`${API_BASE_URL}/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
    } catch (err) {
      console.error("Failed to toggle speech:", err);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (wordTimeoutRef.current) {
        clearTimeout(wordTimeoutRef.current);
      }
      if (sentenceTimeoutRef.current) {
        clearTimeout(sentenceTimeoutRef.current);
      }
    };
  }, []);

  return {
    data,
    isConnected,
    error,
    isPolling,
    wordChanged,
    sentenceChanged,
    startPolling,
    stopPolling,
    startStream,     
    stopStream,
    clearSentence,
    toggleSpeech,
    videoUrl: `${API_BASE_URL}/video`,
  };
}

export default useBackendData;
