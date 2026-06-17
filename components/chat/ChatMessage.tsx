import type { ChatMessageData } from "./ChatProvider";

export default function ChatMessage({
  msg,
  ownerFirstName,
}: {
  msg: ChatMessageData;
  ownerFirstName: string;
}) {
  const isUser = msg.role === "user";

  return (
    <div
      className={`flex gap-3 px-1 py-4 ${
        isUser ? "flex-row-reverse" : "flex-row"
      }`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-semibold ${
          isUser
            ? "border border-surface-alt bg-surface-alt text-secondary"
            : "bg-accent text-white"
        }`}
        aria-hidden="true"
      >
        {isUser ? "you" : "A"}
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={`mb-1.5 font-mono text-[11px] uppercase tracking-wider text-secondary ${
            isUser ? "text-right" : "text-left"
          }`}
        >
          {isUser ? "you" : ownerFirstName}
        </div>
        <div
          className={`whitespace-pre-wrap break-words rounded-xl border px-4 py-3 text-[15px] leading-relaxed ${
            isUser
              ? "border-accent-border bg-accent-dim text-accent"
              : "border-surface-alt bg-surface-alt text-primary"
          }`}
        >
          {msg.text}
          {msg.pending && (
            <span className="ml-1 inline-block animate-pulse" aria-hidden="true">
              ▍
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
