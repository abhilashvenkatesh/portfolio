"use client";

import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";
import SuggestionChips from "./SuggestionChips";
import type { ChatMessageData } from "./ChatProvider";

export default function ChatThread({
  messages,
  chips,
  onPickChip,
}: {
  messages: ChatMessageData[];
  chips: string[];
  onPickChip: (chip: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the newest message whenever the thread changes.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const showChips =
    messages.length === 1 && messages[0].role === "assistant";

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto pb-4">
      {messages.map((m, i) => (
        <ChatMessage key={i} msg={m} />
      ))}
      {showChips && <SuggestionChips chips={chips} onPick={onPickChip} />}
    </div>
  );
}
