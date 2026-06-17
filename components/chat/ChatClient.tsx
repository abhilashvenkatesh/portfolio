"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import ChatProvider, {
  useChatContext,
  WELCOME,
  type ChatMessageData,
} from "./ChatProvider";
import { useModelContext } from "@/components/providers/ModelProvider";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";
import ChatLoadingContent, { type LoadingContent } from "./ChatLoadingContent";
import UnsupportedFallback from "./UnsupportedFallback";

interface ChatClientProps {
  systemPrompt: string;
  chips: string[];
  email: string;
  linkedin: string;
  loadingContent: LoadingContent;
}

export default function ChatClient(props: ChatClientProps) {
  return (
    <Suspense fallback={<ChatShell />}>
      <ChatExperience {...props} />
    </Suspense>
  );
}

function ChatShell() {
  return <div className="h-[calc(100dvh-60px)]" aria-hidden="true" />;
}

function ChatExperience({
  systemPrompt,
  chips,
  email,
  linkedin,
  loadingContent,
}: ChatClientProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  const initialMessages = useMemo<ChatMessageData[]>(
    () =>
      q
        ? [{ role: "user", text: q }]
        : [{ role: "assistant", text: WELCOME }],
    [q],
  );

  return (
    <ChatProvider
      systemPrompt={systemPrompt}
      errorEmail={email}
      initialMessages={initialMessages}
    >
      <ChatInner
        chips={chips}
        email={email}
        linkedin={linkedin}
        loadingContent={loadingContent}
        handoffQuery={q}
      />
    </ChatProvider>
  );
}

function ChatInner({
  chips,
  email,
  linkedin,
  loadingContent,
  handoffQuery,
}: {
  chips: string[];
  email: string;
  linkedin: string;
  loadingContent: LoadingContent;
  handoffQuery: string;
}) {
  const { modelState, progress, progressText } = useModelContext();
  const { chatState, messages, pendingQueue, send, markApiAnswered } =
    useChatContext();

  const modelLoading = modelState === "loading" || modelState === "idle";
  const isThinking = chatState === "thinking";
  const queued = pendingQueue !== null;

  useEffect(() => {
    if (modelState === "ready") track("chat_started");
  }, [modelState]);

  useEffect(() => {
    if (modelState === "unsupported") track("chat_unsupported");
  }, [modelState]);

  // Track if we have any real assistant response in thread yet.
  const hasAssistantReply = messages.some(
    (m) => m.role === "assistant" && !m.pending && m.text !== WELCOME,
  );

  // API fallback for handoff query.
  const apiFiredRef = useRef(false);
  const [apiStreaming, setApiStreaming] = useState(false);
  const [apiReply, setApiReply] = useState<string | null>(null);

  useEffect(() => {
    if (!handoffQuery || !modelLoading || apiFiredRef.current) return;
    apiFiredRef.current = true;

    setApiStreaming(true);

    (async () => {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: handoffQuery }),
        });

        if (!res.ok || !res.body) {
          setApiStreaming(false);
          return;
        }

        markApiAnswered();

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setApiReply(acc);
        }
      } catch {
        // silent failure — normal queue-and-wait takes over
      } finally {
        setApiStreaming(false);
      }
    })();
  }, [handoffQuery, modelLoading, markApiAnswered]);

  if (modelState === "unsupported") {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <UnsupportedFallback email={email} linkedin={linkedin} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100dvh-60px)] w-full max-w-3xl flex-col px-4 pt-8 sm:px-6">
      {/* Header */}
      <div className="mb-5 border-b border-surface-alt pb-5">
        <div className="mb-2 flex items-center gap-3">
          <span
            className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent shadow-[0_0_0_4px_var(--color-accent-dim)]"
            aria-hidden="true"
          />
          <h1 className="text-xl font-semibold tracking-tight text-primary">
            Chat with my résumé
          </h1>
        </div>
        <p className="font-mono text-[13px] text-secondary">
          Ask anything about my work, skills, or experience · responses grounded
          in real CV data
        </p>
      </div>

      {/* Model load progress (task 6.1–6.2) */}
      {modelLoading && (
        <div className="mb-4" role="status" aria-live="polite">
          <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider text-secondary">
            <span>{progressText || "Loading model…"}</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Loading content cards (task 8.2) */}
      {modelLoading && !hasAssistantReply && !apiStreaming && (
        <ChatLoadingContent content={loadingContent} />
      )}

      <ChatThread
        messages={
          apiReply !== null
            ? [
                ...messages,
                {
                  role: "assistant" as const,
                  text: apiReply,
                  pending: apiStreaming,
                },
              ]
            : messages
        }
        chips={chips}
        onPickChip={send}
      />

      <ChatInput
        modelLoading={modelLoading}
        thinking={isThinking}
        queued={queued}
        onSend={send}
      />
    </div>
  );
}
