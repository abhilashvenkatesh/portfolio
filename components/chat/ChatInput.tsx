"use client";

import { useState } from "react";

export default function ChatInput({
  modelLoading,
  thinking,
  queued,
  onSend,
}: {
  modelLoading: boolean;
  thinking: boolean;
  queued: boolean;
  onSend: (text: string) => void;
}) {
  const [value, setValue] = useState("");

  const canSend = !thinking && !queued && value.trim().length > 0;

  const placeholder = thinking
    ? "Thinking…"
    : queued
      ? "Message queued — waiting for model…"
      : modelLoading
        ? "Ask a question (will send when model is ready)…"
        : "Ask another question…";

  const submit = () => {
    if (!canSend) return;
    onSend(value);
    setValue("");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="mb-5 flex items-center gap-2 rounded-2xl border border-surface-alt bg-surface-alt/40 py-2 pl-[18px] pr-2 shadow-sm transition-colors focus-within:border-accent"
    >
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={thinking || queued}
        placeholder={placeholder}
        aria-label="Ask a question"
        className="flex-1 bg-transparent py-2.5 text-[15px] text-primary outline-none placeholder:text-secondary disabled:cursor-not-allowed"
      />
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Send"
        className={`inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] transition-opacity ${
          canSend
            ? "bg-accent text-white hover:opacity-85"
            : "cursor-not-allowed bg-surface-alt text-secondary"
        }`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
