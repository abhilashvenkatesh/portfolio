"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type ChatState =
  | "unsupported"
  | "idle"
  | "loading"
  | "ready"
  | "thinking"
  | "error";

export interface ChatMessageData {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
}

interface WebLLMContextValue {
  state: ChatState;
  progress: number; // 0–100
  messages: ChatMessageData[];
  send: (text: string) => void;
}

const MODEL_ID = "Llama-3.2-3B-Instruct-q4f16_1-MLC";

const WebLLMContext = createContext<WebLLMContextValue | null>(null);

export function useWebLLM(): WebLLMContextValue {
  const ctx = useContext(WebLLMContext);
  if (!ctx) throw new Error("useWebLLM must be used within WebLLMProvider");
  return ctx;
}

interface StreamingEngine {
  chat: {
    completions: {
      create: (opts: unknown) => Promise<
        AsyncIterable<{ choices: { delta: { content?: string } }[] }>
      >;
    };
  };
}

export default function WebLLMProvider({
  systemPrompt,
  errorEmail,
  initialMessages,
  children,
}: {
  systemPrompt: string;
  errorEmail: string;
  initialMessages: ChatMessageData[];
  children: React.ReactNode;
}) {
  const [state, setState] = useState<ChatState>("idle");
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);

  const engineRef = useRef<StreamingEngine | null>(null);
  const initStartedRef = useRef(false);
  const handoffDoneRef = useRef(false);

  // Mirror committed messages so `send` can read the prior thread without
  // relying on a setState-updater side effect (which may run stale or twice).
  const messagesRef = useRef<ChatMessageData[]>(initialMessages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Stream a reply for `userText`, given the thread state that preceded it.
  const runCompletion = useCallback(
    async (userText: string, history: ChatMessageData[]) => {
      const engine = engineRef.current;
      if (!engine) return;

      setState("thinking");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "", pending: true },
      ]);

      try {
        const apiMessages = [
          { role: "system", content: systemPrompt },
          ...history
            .filter((m) => !m.pending)
            .map((m) => ({ role: m.role, content: m.text })),
          { role: "user", content: userText },
        ];
        const stream = await engine.chat.completions.create({
          stream: true,
          messages: apiMessages,
          temperature: 0.6,
        });

        let acc = "";
        for await (const chunk of stream) {
          acc += chunk.choices[0]?.delta?.content ?? "";
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = {
              role: "assistant",
              text: acc,
              pending: true,
            };
            return copy;
          });
        }

        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", text: acc.trim() };
          return copy;
        });
      } catch {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            text: `Sorry, I couldn't process that. Try rephrasing, or reach Abhilash directly at ${errorEmail}.`,
          };
          return copy;
        });
      } finally {
        setState("ready");
      }
    },
    [systemPrompt, errorEmail],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text || !engineRef.current) return;
      const history = messagesRef.current;
      setMessages((prev) => [...prev, { role: "user", text }]);
      void runCompletion(text, history);
    },
    [runCompletion],
  );

  // Engine init — runs once.
  useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    // WebGPU gate — never import the heavy engine on unsupported browsers.
    const hasWebGPU =
      typeof navigator !== "undefined" &&
      !!(navigator as Navigator & { gpu?: unknown }).gpu;
    if (!hasWebGPU) {
      queueMicrotask(() => setState("unsupported"));
      return;
    }

    let cancelled = false;
    queueMicrotask(() => setState("loading"));

    (async () => {
      try {
        const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
        const engine = (await CreateMLCEngine(MODEL_ID, {
          initProgressCallback: (report: { progress: number }) => {
            if (!cancelled) setProgress(Math.round(report.progress * 100));
          },
        })) as unknown as StreamingEngine;
        if (cancelled) return;
        engineRef.current = engine;
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Home→chat handoff: if the thread was seeded with a trailing user message
  // (from ?q=), auto-answer it once the engine is ready. Runs at most once.
  useEffect(() => {
    if (state !== "ready" || handoffDoneRef.current) return;
    handoffDoneRef.current = true;
    const last = initialMessages[initialMessages.length - 1];
    if (last && last.role === "user") {
      queueMicrotask(() =>
        runCompletion(last.text, initialMessages.slice(0, -1)),
      );
    }
  }, [state, initialMessages, runCompletion]);

  return (
    <WebLLMContext.Provider value={{ state, progress, messages, send }}>
      {children}
    </WebLLMContext.Provider>
  );
}
