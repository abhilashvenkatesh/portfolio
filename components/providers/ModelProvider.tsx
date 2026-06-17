"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ModelState =
  | "unsupported"
  | "idle"
  | "loading"
  | "ready"
  | "error";

export interface StreamingEngine {
  chat: {
    completions: {
      create: (opts: unknown) => Promise<
        AsyncIterable<{ choices: { delta: { content?: string } }[] }>
      >;
    };
  };
}

interface ModelContextValue {
  modelState: ModelState;
  progress: number; // 0–100
  progressText: string;
  getActiveEngine: () => StreamingEngine | null;
}

const ModelContext = createContext<ModelContextValue | null>(null);

export function useModelContext(): ModelContextValue {
  const ctx = useContext(ModelContext);
  if (!ctx) throw new Error("useModelContext must be used within ModelProvider");
  return ctx;
}

const MODEL_1B = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
const MODEL_3B = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

export default function ModelProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [modelState, setModelState] = useState<ModelState>("idle");
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const engine1BRef = useRef<StreamingEngine | null>(null);
  const engine3BRef = useRef<StreamingEngine | null>(null);
  const activeEngineRef = useRef<StreamingEngine | null>(null);
  const initStartedRef = useRef(false);

  // Signals whether a chat completion is currently streaming — used to defer 3B swap.
  const thinkingRef = useRef(false);
  const pendingSwapRef = useRef(false);

  const getActiveEngine = useCallback(() => activeEngineRef.current, []);

  // Called by ChatProvider to notify that streaming started/stopped, so we
  // can defer the 3B engine swap until the current reply finishes.
  const setThinking = useCallback((thinking: boolean) => {
    thinkingRef.current = thinking;
    if (!thinking && pendingSwapRef.current && engine3BRef.current) {
      activeEngineRef.current = engine3BRef.current;
      pendingSwapRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    const hasWebGPU =
      typeof navigator !== "undefined" &&
      !!(navigator as Navigator & { gpu?: unknown }).gpu;
    if (!hasWebGPU) {
      queueMicrotask(() => setModelState("unsupported"));
      return;
    }

    let cancelled = false;
    queueMicrotask(() => setModelState("loading"));

    (async () => {
      try {
        const { CreateMLCEngine } = await import("@mlc-ai/web-llm");

        // Stage 1: boot 1B model first for fast first response.
        const engine1B = (await CreateMLCEngine(MODEL_1B, {
          initProgressCallback: (report: {
            progress: number;
            text: string;
          }) => {
            if (!cancelled) {
              setProgress(Math.round(report.progress * 50)); // 0–50% for 1B
              setProgressText(report.text || "");
            }
          },
        })) as unknown as StreamingEngine;

        if (cancelled) return;
        engine1BRef.current = engine1B;
        activeEngineRef.current = engine1B;
        setModelState("ready");

        // Stage 2: boot 3B in background; swap engine when done.
        const engine3B = (await CreateMLCEngine(MODEL_3B, {
          initProgressCallback: (report: {
            progress: number;
            text: string;
          }) => {
            if (!cancelled) {
              setProgress(50 + Math.round(report.progress * 50)); // 50–100% for 3B
              setProgressText(report.text || "");
            }
          },
        })) as unknown as StreamingEngine;

        if (cancelled) return;
        engine3BRef.current = engine3B;

        if (!thinkingRef.current) {
          activeEngineRef.current = engine3B;
        } else {
          pendingSwapRef.current = true;
        }
      } catch {
        if (!cancelled) setModelState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ModelContext.Provider
      value={{ modelState, progress, progressText, getActiveEngine }}
    >
      {/* Expose setThinking via a ref on context isn't clean — ChatProvider
          calls this via the exported hook below. */}
      <SetThinkingContext.Provider value={setThinking}>
        {children}
      </SetThinkingContext.Provider>
    </ModelContext.Provider>
  );
}

const SetThinkingContext = createContext<((thinking: boolean) => void) | null>(
  null,
);

export function useSetThinking() {
  const fn = useContext(SetThinkingContext);
  if (!fn) throw new Error("useSetThinking must be used within ModelProvider");
  return fn;
}
