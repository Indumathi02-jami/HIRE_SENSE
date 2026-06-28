import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SPEECH_GRACE_MS = 900;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const buildLiveConfidence = ({ activityRatio, averageVolume, pauseCount }) => {
  const raw =
    58 + clamp(activityRatio, 0, 1) * 28 + clamp(averageVolume, 0, 1) * 18 - pauseCount * 4;
  return clamp(Math.round(raw), 18, 98);
};

const createSpeechRecognition = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const Recognition =
    window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition;

  if (!Recognition) {
    return null;
  }

  const recognition = new Recognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  return recognition;
};

const useSpeechInterview = ({ onTranscriptChange, onError }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [bars, setBars] = useState(() => Array.from({ length: 18 }, () => 8));
  const [pauseCount, setPauseCount] = useState(0);
  const [liveConfidence, setLiveConfidence] = useState(52);
  const [speechDurationSeconds, setSpeechDurationSeconds] = useState(0);
  const [speechActivityRatio, setSpeechActivityRatio] = useState(0);
  const [averageVolume, setAverageVolume] = useState(0);

  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const startTimeRef = useRef(0);
  const activeFramesRef = useRef(0);
  const totalFramesRef = useRef(0);
  const volumeAccumulatorRef = useRef(0);
  const baseTranscriptRef = useRef("");
  const silenceStartRef = useRef(null);
  const pauseCountRef = useRef(0);
  const transcriptRef = useRef("");

  useEffect(() => {
    const recognition = createSpeechRecognition();
    recognitionRef.current = recognition;
    setIsSupported(Boolean(recognition && navigator.mediaDevices?.getUserMedia));

    return () => {
      recognitionRef.current?.stop?.();
    };
  }, []);

  const stopAudioGraph = useCallback(() => {
    if (animationFrameRef.current) {
      window.cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close();
    }

    audioContextRef.current = null;
    analyserRef.current = null;
  }, []);

  const stopRecording = useCallback(() => {
    recognitionRef.current?.stop?.();
    stopAudioGraph();
    setIsRecording(false);
    setIsSpeechActive(false);

    const durationSeconds = startTimeRef.current
      ? Number(((Date.now() - startTimeRef.current) / 1000).toFixed(1))
      : 0;
    const ratio =
      totalFramesRef.current > 0 ? activeFramesRef.current / totalFramesRef.current : 0;
    const average =
      totalFramesRef.current > 0 ? volumeAccumulatorRef.current / totalFramesRef.current : 0;

    setSpeechDurationSeconds(durationSeconds);
    setSpeechActivityRatio(Number(ratio.toFixed(2)));
    setAverageVolume(Number(average.toFixed(2)));
  }, [stopAudioGraph]);

  const reset = useCallback(() => {
    stopRecording();
    setTranscript("");
    transcriptRef.current = "";
    baseTranscriptRef.current = "";
    setPauseCount(0);
    pauseCountRef.current = 0;
    setSpeechDurationSeconds(0);
    setSpeechActivityRatio(0);
    setAverageVolume(0);
    setLiveConfidence(52);
    setBars(Array.from({ length: 18 }, () => 8));
    onTranscriptChange?.("");
  }, [onTranscriptChange, stopRecording]);

  const startAudioGraph = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 64;
    analyser.smoothingTimeConstant = 0.85;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    mediaStreamRef.current = stream;
    audioContextRef.current = audioContext;
    analyserRef.current = analyser;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      if (!analyserRef.current) {
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);
      const normalizedBins = Array.from(dataArray).map((value) => value / 255);
      const meanLevel =
        normalizedBins.reduce((sum, value) => sum + value, 0) / normalizedBins.length;
      const isActive = meanLevel > 0.08;

      totalFramesRef.current += 1;
      volumeAccumulatorRef.current += meanLevel;

      if (isActive) {
        activeFramesRef.current += 1;
        silenceStartRef.current = null;
      } else if (silenceStartRef.current === null) {
        silenceStartRef.current = Date.now();
      } else if (Date.now() - silenceStartRef.current > SPEECH_GRACE_MS) {
        pauseCountRef.current += 1;
        setPauseCount(pauseCountRef.current);
        silenceStartRef.current = Date.now() + 1000;
      }

      setIsSpeechActive(isActive);
      setBars(
        normalizedBins.map((value, index) =>
          Math.max(8, Math.round(value * 44 + ((index % 3) + 1) * 2))
        )
      );
      setLiveConfidence(
        buildLiveConfidence({
          activityRatio:
            totalFramesRef.current > 0 ? activeFramesRef.current / totalFramesRef.current : 0,
          averageVolume:
            totalFramesRef.current > 0
              ? volumeAccumulatorRef.current / totalFramesRef.current
              : 0,
          pauseCount: pauseCountRef.current
        })
      );

      animationFrameRef.current = window.requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const startRecording = useCallback(
    async (initialText = "") => {
      if (!isSupported || isRecording) {
        return;
      }

      const recognition = recognitionRef.current;

      if (!recognition) {
        onError?.("Speech recognition is not supported in this browser.");
        return;
      }

      try {
        baseTranscriptRef.current = initialText.trim();
        transcriptRef.current = initialText.trim();
        setTranscript(initialText.trim());
        setPauseCount(0);
        pauseCountRef.current = 0;
        activeFramesRef.current = 0;
        totalFramesRef.current = 0;
        volumeAccumulatorRef.current = 0;
        silenceStartRef.current = null;
        startTimeRef.current = Date.now();
        setIsRecording(true);
        setSpeechDurationSeconds(0);

        recognition.onresult = (event) => {
          let finalText = "";
          let interimText = "";

          for (let index = event.resultIndex; index < event.results.length; index += 1) {
            const snippet = event.results[index][0]?.transcript || "";
            if (event.results[index].isFinal) {
              finalText += ` ${snippet}`;
            } else {
              interimText += ` ${snippet}`;
            }
          }

          const cleanBase = baseTranscriptRef.current ? `${baseTranscriptRef.current} ` : "";
          const combined = `${cleanBase}${finalText || ""}${interimText || ""}`.trim();
          transcriptRef.current = combined;
          setTranscript(combined);
          onTranscriptChange?.(combined);
        };

        recognition.onerror = (event) => {
          if (event.error !== "aborted") {
            onError?.("Voice capture ran into a browser speech recognition issue.");
          }
          stopRecording();
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        await startAudioGraph();
        recognition.start();
      } catch (error) {
        setIsRecording(false);
        stopAudioGraph();
        onError?.("Microphone access is required for voice-based communication analysis.");
      }
    },
    [isRecording, isSupported, onError, onTranscriptChange, startAudioGraph, stopAudioGraph, stopRecording]
  );

  const communicationInput = useMemo(
    () => ({
      transcript: transcript.trim(),
      speechDurationSeconds,
      pauseCount,
      speechActivityRatio,
      averageVolume,
      transcriptSource: transcript.trim() ? "speech-recognition" : "manual"
    }),
    [averageVolume, pauseCount, speechActivityRatio, speechDurationSeconds, transcript]
  );

  return {
    isSupported,
    isRecording,
    isSpeechActive,
    transcript,
    bars,
    pauseCount,
    liveConfidence,
    communicationInput,
    startRecording,
    stopRecording,
    reset
  };
};

export default useSpeechInterview;
