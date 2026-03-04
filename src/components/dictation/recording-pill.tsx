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

function RecordingVisualizer({ analyserNode, duration }: { analyserNode: AnalyserNode | null; duration: number }) {
  const barsRef = useRef<HTMLDivElement[]>([]);
  const squareRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef(0);
  const targetRotationSpeedRef = useRef(0);
  const currentRotationSpeedRef = useRef(0);
  const smoothedValuesRef = useRef<number[]>(new Array(12).fill(0));

  useEffect(() => {
    if (!analyserNode) return;

    const dataArray = new Uint8Array(analyserNode.frequencyBinCount);
    let animationId: number;
    let lastTime = performance.now();

    const renderFrame = (time: number) => {
      animationId = requestAnimationFrame(renderFrame);
      const deltaTime = time - lastTime;
      const dt = Math.min(deltaTime, 32);
      lastTime = time;

      analyserNode.getByteFrequencyData(dataArray);

      const numBars = 12;
      let sum = 0;

      for (let i = 0; i < numBars; i++) {
        // Focus on bins 1 to 13 (approx 187Hz to 2400Hz)
        const binIndex = i + 1;
        const value = dataArray[binIndex] || 0;
        sum += value;

        smoothedValuesRef.current[i] += (value - smoothedValuesRef.current[i]) * 0.3;

        const normalized = smoothedValuesRef.current[i] / 255;
        const minHeight = 4;
        const maxHeight = 20;
        const height = minHeight + Math.pow(normalized, 1.4) * (maxHeight - minHeight);

        if (barsRef.current[i]) {
          barsRef.current[i].style.height = `${height}px`;
        }
      }

      const avgVolume = sum / numBars;
      // When completely silent, avgVolume is near 0.
      if (avgVolume > 10) {
        // Rotate while speaking
        targetRotationSpeedRef.current = (1.5 + (avgVolume / 255) * 5);
      } else {
        // Slowly decay back to 0 rotation
        targetRotationSpeedRef.current = 0;
      }

      currentRotationSpeedRef.current += (targetRotationSpeedRef.current - currentRotationSpeedRef.current) * 0.1;

      rotationRef.current += currentRotationSpeedRef.current * (dt / 16);

      if (squareRef.current) {
        squareRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
      }
    };

    animationId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [analyserNode]);

  return (
    <div className="flex w-max items-center gap-3 pr-[4px]">
      <div
        ref={squareRef}
        className="h-[20px] w-[20px] bg-[#18181b] rounded-[7px] shadow-sm transform-gpu will-change-transform"
      />
      <div className="flex items-center gap-[3px] h-[24px] px-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) barsRef.current[i] = el;
            }}
            className="w-[3px] rounded-full bg-[#18181b] transform-gpu will-change-[height]"
            style={{ height: "4px" }}
          />
        ))}
      </div>
      <span className="font-sans text-[15px] font-medium text-zinc-500 w-[46px] tabular-nums tracking-wide text-right pl-1">
        {formatDuration(duration)}
      </span>
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
          className="flex h-full w-full items-center justify-start px-[15px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Microphone weight="regular" size={24} className="min-w-[24px] text-[#18181b]" />
        </motion.div>
      )}

      {state === "recording" && (
        <motion.div
          key="recording"
          className="flex h-full w-full items-center justify-start gap-4 px-[15px]"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <RecordingVisualizer analyserNode={analyserNode} duration={duration} />
        </motion.div>
      )}

      {state === "transcribing" && (
        <motion.div
          key="transcribing"
          className="flex h-full w-full items-center justify-start gap-3 px-[15px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div className="h-5 w-5 rounded-full bg-gradient-to-r from-zinc-300 via-zinc-100 to-zinc-300 bg-[length:200%_100%] animate-shimmer" />
          <span className="whitespace-nowrap text-sm font-medium text-zinc-400">
            Trascrizione...
          </span>
        </motion.div>
      )}

      {state === "success" && (
        <motion.div
          key="success"
          className="flex h-full w-full items-center justify-start gap-3 px-[15px]"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check weight="bold" size={20} className="min-w-[20px] text-accent-600" />
          <span className="whitespace-nowrap text-sm font-medium text-accent-600">
            Copiato negli appunti
          </span>
        </motion.div>
      )}

      {state === "error" && (
        <motion.div
          key="error"
          className="flex h-full w-full items-center justify-start gap-3 px-[15px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <WarningCircle weight="regular" size={20} className="min-w-[20px] text-red-500" />
          <span className="whitespace-nowrap truncate text-sm font-medium text-red-500">
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

  const pillRef = useRef<HTMLButtonElement>(null);

  // Auto-resize window to fit the pill (PWA standalone)
  useEffect(() => {
    const el = pillRef.current;
    if (!el) return;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;

    if (!isStandalone) return;

    const padding = 32; // breathing room around pill
    const titleBar = 38; // macOS standalone title bar

    const observer = new ResizeObserver(() => {
      const rect = el.getBoundingClientRect();
      const w = Math.ceil(rect.width) + padding;
      const h = Math.ceil(rect.height) + padding + titleBar;
      window.resizeTo(w, h);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
      ref={pillRef}
      layout
      onClick={handleClick}
      className={`relative inline-flex cursor-pointer items-center justify-start overflow-hidden rounded-full border bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] transition-colors will-change-[width] ${state === "idle"
        ? "h-[54px] w-[54px] border-zinc-200/60"
        : "h-[54px] w-auto " +
        (state === "recording"
          ? "border-zinc-200/60"
          : state === "error"
            ? "border-red-200"
            : state === "success"
              ? "border-accent-200"
              : "border-zinc-200/60")
        }`}
      style={{
        originX: 0, // Force scaling/expanding from the left side
      }}
      whileHover={
        state === "idle" || state === "recording" ? { scale: 1.02 } : undefined
      }
      whileTap={
        state === "idle" || state === "recording" ? { scale: 0.98 } : undefined
      }
      transition={{
        layout: {
          type: "spring",
          bounce: 0,
          duration: 1.0
        }
      }}
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
