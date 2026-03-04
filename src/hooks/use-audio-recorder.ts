"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderState =
  | "idle"
  | "recording"
  | "transcribing"
  | "success"
  | "error";

export interface UseAudioRecorderReturn {
  state: RecorderState;
  transcript: string;
  error: string;
  duration: number;
  analyserNode: AnalyserNode | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  reset: () => void;
}

function negotiateMimeType(): string {
  const types = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  for (const type of types) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

function getExtension(mimeType: string): string {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("ogg")) return "ogg";
  if (mimeType.includes("wav")) return "wav";
  return "webm";
}

export function useAudioRecorder(): UseAudioRecorderReturn {
  const [state, setState] = useState<RecorderState>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");
  const [duration, setDuration] = useState(0);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mimeTypeRef = useRef<string>("");

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setAnalyserNode(null);
    mediaRecorderRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const sendToApi = useCallback(async (blob: Blob) => {
    setState("transcribing");

    try {
      const formData = new FormData();
      const ext = getExtension(mimeTypeRef.current);
      formData.append("audio", blob, `recording.${ext}`);

      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.text) {
        setTranscript(data.text);
        // Auto-copy to clipboard and return to previous app
        try {
          await navigator.clipboard.writeText(data.text);
          window.blur();
        } catch {
          // Fallback: silent fail, transcript is still available
        }
        setState("success");
      } else {
        setError(data.error || "Errore durante la trascrizione. Riprova.");
        setState("error");
      }
    } catch {
      setError("Errore di rete. Controlla la connessione.");
      setState("error");
    }
  }, []);

  const startRecording = useCallback(async () => {
    setTranscript("");
    setError("");
    setDuration(0);

    if (!navigator.mediaDevices?.getUserMedia) {
      setError(
        "Il browser non supporta la registrazione audio. Usa un browser moderno con HTTPS."
      );
      setState("error");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      });

      streamRef.current = stream;

      // Setup Web Audio API for visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      setAnalyserNode(analyser);

      // Setup MediaRecorder
      mimeTypeRef.current = negotiateMimeType();
      const options: MediaRecorderOptions = {};
      if (mimeTypeRef.current) {
        options.mimeType = mimeTypeRef.current;
      }

      const recorder = new MediaRecorder(stream, options);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeTypeRef.current || "audio/webm",
        });
        cleanup();
        sendToApi(blob);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();

      // Start duration timer
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      setState("recording");
    } catch (err) {
      cleanup();

      if (err instanceof DOMException) {
        if (err.name === "NotAllowedError") {
          setError(
            "Permesso microfono negato. Consenti l'accesso nelle impostazioni del browser."
          );
        } else if (err.name === "NotFoundError") {
          setError("Nessun microfono trovato.");
        } else {
          setError("Errore nell'accesso al microfono.");
        }
      } else {
        setError("Errore nell'accesso al microfono.");
      }
      setState("error");
    }
  }, [cleanup, sendToApi]);

  const stopRecording = useCallback(() => {
    if (state !== "recording" || !mediaRecorderRef.current) return;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    mediaRecorderRef.current.stop();
  }, [state]);

  const reset = useCallback(() => {
    cleanup();
    setState("idle");
    setTranscript("");
    setError("");
    setDuration(0);
  }, [cleanup]);

  return {
    state,
    transcript,
    error,
    duration,
    analyserNode,
    startRecording,
    stopRecording,
    reset,
  };
}
