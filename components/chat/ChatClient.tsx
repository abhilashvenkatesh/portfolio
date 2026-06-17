"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import WebLLMProvider, {
  useWebLLM,
  type ChatMessageData,
} from "./WebLLMProvider";
import ChatThread from "./ChatThread";
import ChatInput from "./ChatInput";
import UnsupportedFallback from "./UnsupportedFallback";

const WELCOME =
  "Hey! I'm a chat layer over Abhilash's resume. Ask me about his experience, projects, skills, or how to get in touch.";

interface ChatClientProps {
  systemPrompt: string;
  chips: string[];
  email: string;
  linkedin: string;
}

export default function ChatClient(props: ChatClientProps) {
  return (
    <Suspense fallback={<ChatShell />}>
      <ChatExperience {...props} />
    </Suspense>
  );
}

// Empty shell rendered while useSearchParams suspends.
function ChatShell() {
  return <div className="h-[calc(100dvh-60px)]" aria-hidden="true" />;
}

function ChatExperience({ systemPrompt, chips, email, linkedin }: ChatClientProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.trim() ?? "";

  // Handoff seeds the visitor's question (welcome skipped); otherwise welcome only.
  const initialMessages = useMemo<ChatMessageData[]>(
    () =>
      q
        ? [{ role: "user", text: q }]
        : [{ role: "assistant", text: WELCOME }],
    [q],
  );

  return (
    <WebLLMProvider
      systemPrompt={systemPrompt}
      errorEmail={email}
      initialMessages={initialMessages}
    >
      <ChatInner chips={chips} email={email} linkedin={linkedin} />
    </WebLLMProvider>
  );
}

function ChatInner({
  chips,
  email,
  linkedin,
}: {
  chips: string[];
  email: string;
  linkedin: string;
}) {
  const { state, progress, messages, send } = useWebLLM();

  if (state === "unsupported") {
    return (
      <div className="mx-auto max-w-3xl px-4">
        <UnsupportedFallback email={email} linkedin={linkedin} />
      </div>
    );
  }

  const loading = state === "loading" || state === "idle";

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

      {/* Model load progress */}
      {loading && (
        <div className="mb-4" role="status" aria-live="polite">
          <div className="mb-1.5 flex justify-between font-mono text-[11px] uppercase tracking-wider text-secondary">
            <span>Loading model…</span>
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

      <ChatThread messages={messages} chips={chips} onPickChip={send} />

      <ChatInput
        disabled={state !== "ready"}
        thinking={state === "thinking"}
        onSend={send}
      />
    </div>
  );
}
