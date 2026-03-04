"use client";

import { useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Microphone,
  Stop,
  Check,
  WarningCircle,
} from "@phosphor-icons/react";
import { useAudioRecorder } from "@/hooks/use-audio-recorder";
import type { RecorderState } from "@/hooks/use-audio-recorder";

function formatDuration(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function WaveformDots({ analyserNode }: { analyserNode: AnalyserNode | null }) {
  // Simple animated dots as waveform indicator
  return (
    <div className="flex items-center gap-[3px]">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-zinc-800"
          animate={{
            scale: [1, 1.8, 1],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function PillContent({
  state,
  duration,
  error,
  analyserNode,
}: {
  state: RecorderState;
  duration: number;
  error: string;
  analyserNode: AnalyserNode | null;
}) {
  return (
    <AnimatePresence mode="wait">
      {state === "idle" && (
        <motion.div
          key="idle"
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Microphone weight="fill" size={20} className="text-accent-600" />
          <span className="text-sm font-medium text-zinc-500">
            Premi per registrare
          </span>
        </motion.div>
      )}

      {state === "recording" && (
        <motion.div
          key="recording"
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Stop weight="fill" size={20} className="text-zinc-900" />
          <WaveformDots analyserNode={analyserNode} />
          <span className="font-mono text-sm font-medium text-red-500">
            {formatDuration(duration)}
          </span>
        </motion.div>
      )}

      {state === "transcribing" && (
        <motion.div
          key="transcribing"
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="h-5 w-5 rounded-full bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300 bg-[length:200%_100%] animate-shimmer" />
          <span className="text-sm font-medium text-zinc-400">
            Trascrizione...
          </span>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
          className="flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check weight="bold" size={20} className="text-accent-600" />
          <span className="text-sm font-medium text-accent-600">
            Copiato negli appunti
          </span>
        </motion.div>
      )}

      {state === "error" && (
        <motion.div
          key="error"
          className="flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <WarningCircle weight="regular" size={20} className="text-red-500" />
          <span className="max-w-[200px] truncate text-sm font-medium text-red-500">
            {error || "Errore"}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function RecordingPill() {
  const {
    state,
    transcript,
    error,
    duration,
    analyserNode,
    startRecording,
    stopRecording,
    reset,
  } = useAudioRecorder();

  // Auto-reset after success (2s) or error (3s)
  useEffect(() => {
    if (state === "success") {
      const timer = setTimeout(reset, 2000);
      return () => clearTimeout(timer);
    }
    if (state === "error") {
      const timer = setTimeout(reset, 3000);
      return () => clearTimeout(timer);
    }
  }, [state, reset]);

  // Option (Alt) key: double-tap to start, single tap to stop
  const lastAltRef = useRef(0);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key !== "Alt") return;

      const currentState = stateRef.current;

      // Ignore during transcribing/success/error
      if (
        currentState === "transcribing" ||
        currentState === "success" ||
        currentState === "error"
      )
        return;

      if (currentState === "recording") {
        // Single tap stops recording
        stopRecording();
        return;
      }

      // Idle: detect double-tap (2 keyups within 400ms)
      const now = Date.now();
      if (now - lastAltRef.current < 400) {
        // Double-tap detected → start recording
        lastAltRef.current = 0; // reset to avoid triple-tap
        startRecording();
      } else {
        lastAltRef.current = now;
      }
    }

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, [startRecording, stopRecording]);

  const handleClick = useCallback(() => {
    if (state === "idle") {
      startRecording();
    } else if (state === "recording") {
      stopRecording();
    } else if (state === "error") {
      reset();
    }
  }, [state, startRecording, stopRecording, reset]);

  return (
    <motion.button
      onClick={handleClick}
      className={`inline-flex cursor-pointer items-center rounded-full border bg-white px-5 py-3 shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors ${
        state === "recording"
          ? "border-red-200"
          : state === "error"
            ? "border-red-200"
            : state === "success"
              ? "border-accent-200"
              : "border-zinc-200/60"
      }`}
      whileHover={
        state === "idle" || state === "recording"
          ? { scale: 1.02 }
          : undefined
      }
      whileTap={
        state === "idle" || state === "recording"
          ? { scale: 0.98 }
          : undefined
      }
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <PillContent
        state={state}
        duration={duration}
        error={error}
        analyserNode={analyserNode}
      />
    </motion.button>
  );
}
