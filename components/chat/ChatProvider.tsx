"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useModelContext, useSetThinking } from "@/components/providers/ModelProvider";
import type { ModelState } from "@/components/providers/ModelProvider";

export type ChatState = ModelState | "thinking";

export interface ChatMessageData {
  role: "user" | "assistant";
  text: string;
  pending?: boolean;
}

interface ChatContextValue {
  chatState: ChatState;
  messages: ChatMessageData[];
  pendingQueue: string | null;
  send: (text: string) => void;
  markApiAnswered: () => void;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider");
  return ctx;
}

const WELCOME =
  "Hey! I'm a chat layer over Abhilash's resume. Ask me about his experience, projects, skills, or how to get in touch.";

export default function ChatProvider({
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
  const { modelState, getActiveEngine } = useModelContext();
  const setThinking = useSetThinking();

  const [messages, setMessages] = useState<ChatMessageData[]>(initialMessages);
  const [isThinking, setIsThinking] = useState(false);
  const [pendingQueue, setPendingQueue] = useState<string | null>(null);

  // Derive chatState rather than maintaining a parallel state that needs syncing.
  const chatState: ChatState = isThinking ? "thinking" : modelState;

  const messagesRef = useRef<ChatMessageData[]>(initialMessages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Track whether the API fallback already answered the handoff question.
  const apiAnsweredRef = useRef(false);
  const markApiAnswered = useCallback(() => {
    apiAnsweredRef.current = true;
  }, []);


  const runCompletion = useCallback(
    async (userText: string, history: ChatMessageData[]) => {
      const engine = getActiveEngine();
      if (!engine) return;

      setIsThinking(true);
      setThinking(true);
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
          acc += (chunk as { choices: { delta: { content?: string } }[] }).choices[0]?.delta?.content ?? "";
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
        setIsThinking(false);
        setThinking(false);
      }
    },
    [systemPrompt, errorEmail, getActiveEngine, setThinking],
  );

  const send = useCallback(
    (raw: string) => {
      const text = raw.trim();
      if (!text) return;

      // Engine loading — queue the message (at most one queued at a time).
      if (modelState === "loading" || modelState === "idle") {
        if (pendingQueue === null) {
          setMessages((prev) => [...prev, { role: "user", text }]);
          setPendingQueue(text);
        }
        return;
      }

      if (!getActiveEngine() || chatState === "thinking") return;
      const history = messagesRef.current;
      setMessages((prev) => [...prev, { role: "user", text }]);
      void runCompletion(text, history);
    },
    [modelState, pendingQueue, getActiveEngine, chatState, runCompletion],
  );

  // Flush pending queue when engine becomes ready.
  useEffect(() => {
    if (modelState !== "ready" || pendingQueue === null) return;
    const queued = pendingQueue;
    queueMicrotask(() => {
      setPendingQueue(null);
      const history = messagesRef.current.filter(
        (m) => !(m.role === "user" && m.text === queued),
      );
      void runCompletion(queued, history);
    });
  }, [modelState, pendingQueue, runCompletion]);

  // Home→chat handoff: auto-answer trailing user message once ready,
  // unless the API fallback already answered it.
  useEffect(() => {
    if (modelState !== "ready") return;
    if (apiAnsweredRef.current) return;

    const last = initialMessages[initialMessages.length - 1];
    if (last?.role === "user") {
      apiAnsweredRef.current = true; // prevent double-send
      queueMicrotask(() => void runCompletion(last.text, initialMessages.slice(0, -1)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelState]);

  return (
    <ChatContext.Provider
      value={{ chatState, messages, pendingQueue, send, markApiAnswered }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export { WELCOME };
