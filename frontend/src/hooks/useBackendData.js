// useBackendData.js

import { useState, useEffect, useCallback, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export function useBackendData(pollingInterval = 500) {   // 500 ms is plenty
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

  const [isConnected, setIsConnected]   = useState(false);
  const [error, setError]               = useState(null);
  const [isPolling, setIsPolling]       = useState(false);
  const [wordChanged, setWordChanged]   = useState(false);
  const [sentenceChanged, setSentenceChanged] = useState(false);

  const prevWordRef     = useRef("");
  const prevSentenceRef = useRef("");
  const wordTimeoutRef     = useRef(null);
  const sentenceTimeoutRef = useRef(null);
  const intervalRef        = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/data`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(2000),   // abort stale requests
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const json = await response.json();

      // If the backend throttled, skip update
      if (json.throttled) return;

      if (json.word && json.word !== prevWordRef.current) {
        setWordChanged(true);
        prevWordRef.current = json.word;
        clearTimeout(wordTimeoutRef.current);
        wordTimeoutRef.current = setTimeout(() => setWordChanged(false), 500);
      }

      if (json.sentence && json.sentence !== prevSentenceRef.current) {
        setSentenceChanged(true);
        prevSentenceRef.current = json.sentence;
        clearTimeout(sentenceTimeoutRef.current);
        sentenceTimeoutRef.current = setTimeout(() => setSentenceChanged(false), 800);
      }

      setData({
        word:          json.word          || "",
        buffer:        json.buffer        || [],
        sentence:      json.sentence      || "",
        status:        json.status        || "Idle",
        confidence:    json.confidence    ?? null,
        fps:           json.fps           ?? null,
        stopActive:    json.stopActive    || false,
        stopStartTime: json.stopStartTime || null,
        stopBuffer:    json.stopBuffer    || [],
      });

      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError(err.message);
      setData(prev => ({ ...prev, fps: null, confidence: null, status: "Disconnected" }));
    }
  }, []);   // no deps – stable reference

  // Start / stop polling
  useEffect(() => {
    if (!isPolling) {
      clearInterval(intervalRef.current);
      return;
    }
    fetchData();
    intervalRef.current = setInterval(fetchData, pollingInterval);
    return () => clearInterval(intervalRef.current);
  }, [isPolling, fetchData, pollingInterval]);

  // Cleanup timeouts on unmount
  useEffect(() => () => {
    clearTimeout(wordTimeoutRef.current);
    clearTimeout(sentenceTimeoutRef.current);
    clearInterval(intervalRef.current);
  }, []);

  const startPolling = useCallback(() => setIsPolling(true),  []);
  const stopPolling  = useCallback(() => setIsPolling(false), []);

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

  const clearSentence = useCallback(async () => {
    try {
      await fetch(`${API_BASE_URL}/clear`, { method: "POST" });
      prevWordRef.current     = "";
      prevSentenceRef.current = "";
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


// // useBackendData.js

// import { useState, useEffect, useCallback, useRef } from "react";

// const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

// export function useBackendData(pollingInterval = 500) {   // 500 ms is plenty
//   const [data, setData] = useState({
//     word: "",
//     buffer: [],
//     sentence: "",
//     status: "Idle",
//     confidence: null,
//     fps: null,
//     stopActive: false,
//     stopStartTime: null,
//     stopBuffer: [],
//   });

//   const [isConnected, setIsConnected]   = useState(false);
//   const [error, setError]               = useState(null);
//   const [isPolling, setIsPolling]       = useState(false);
//   const [wordChanged, setWordChanged]   = useState(false);
//   const [sentenceChanged, setSentenceChanged] = useState(false);

//   const prevWordRef     = useRef("");
//   const prevSentenceRef = useRef("");
//   const wordTimeoutRef     = useRef(null);
//   const sentenceTimeoutRef = useRef(null);
//   const intervalRef        = useRef(null);

//   const fetchData = useCallback(async () => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/data`, {
//         method: "GET",
//         headers: { Accept: "application/json" },
//         signal: AbortSignal.timeout(2000),   // abort stale requests
//       });

//       if (!response.ok) throw new Error(`HTTP ${response.status}`);

//       const json = await response.json();

//       // If the backend throttled, skip update
//       if (json.throttled) return;

//       if (json.word && json.word !== prevWordRef.current) {
//         setWordChanged(true);
//         prevWordRef.current = json.word;
//         clearTimeout(wordTimeoutRef.current);
//         wordTimeoutRef.current = setTimeout(() => setWordChanged(false), 500);
//       }

//       if (json.sentence && json.sentence !== prevSentenceRef.current) {
//         setSentenceChanged(true);
//         prevSentenceRef.current = json.sentence;
//         clearTimeout(sentenceTimeoutRef.current);
//         sentenceTimeoutRef.current = setTimeout(() => setSentenceChanged(false), 800);
//       }

//       setData({
//         word:          json.word          || "",
//         buffer:        json.buffer        || [],
//         sentence:      json.sentence      || "",
//         status:        json.status        || "Idle",
//         confidence:    json.confidence    ?? null,
//         fps:           json.fps           ?? null,
//         stopActive:    json.stopActive    || false,
//         stopStartTime: json.stopStartTime || null,
//         stopBuffer:    json.stopBuffer    || [],
//       });

//       setIsConnected(true);
//       setError(null);
//     } catch (err) {
//       setIsConnected(false);
//       setError(err.message);
//       setData(prev => ({ ...prev, fps: null, confidence: null, status: "Disconnected" }));
//     }
//   }, []);   // no deps – stable reference

//   // Start / stop polling
//   useEffect(() => {
//     if (!isPolling) {
//       clearInterval(intervalRef.current);
//       return;
//     }
//     fetchData();
//     intervalRef.current = setInterval(fetchData, pollingInterval);
//     return () => clearInterval(intervalRef.current);
//   }, [isPolling, fetchData, pollingInterval]);

//   // Cleanup timeouts on unmount
//   useEffect(() => () => {
//     clearTimeout(wordTimeoutRef.current);
//     clearTimeout(sentenceTimeoutRef.current);
//     clearInterval(intervalRef.current);
//   }, []);

//   const startPolling = useCallback(() => setIsPolling(true),  []);
//   const stopPolling  = useCallback(() => setIsPolling(false), []);

//   const startStream = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/start`, { method: "POST" });
//       if (!res.ok) throw new Error("Start failed");
//     } catch (err) {
//       console.error("Failed to start stream:", err);
//     }
//   }, []);

//   const stopStream = useCallback(async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/stop`, { method: "POST" });
//       if (!res.ok) throw new Error("Stop failed");
//     } catch (err) {
//       console.error("Failed to stop stream:", err);
//     }
//   }, []);

//   const clearSentence = useCallback(async () => {
//     try {
//       await fetch(`${API_BASE_URL}/clear`, { method: "POST" });
//       prevWordRef.current     = "";
//       prevSentenceRef.current = "";
//     } catch (err) {
//       console.error("Failed to clear sentence:", err);
//     }
//   }, []);

//   const toggleSpeech = useCallback(async (enabled) => {
//     try {
//       await fetch(`${API_BASE_URL}/speech`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ enabled }),
//       });
//     } catch (err) {
//       console.error("Failed to toggle speech:", err);
//     }
//   }, []);

//   return {
//     data,
//     isConnected,
//     error,
//     isPolling,
//     wordChanged,
//     sentenceChanged,
//     startPolling,
//     stopPolling,
//     startStream,
//     stopStream,
//     clearSentence,
//     toggleSpeech,
//     videoUrl: `${API_BASE_URL}/video`,
//   };
// }

// export default useBackendData;
