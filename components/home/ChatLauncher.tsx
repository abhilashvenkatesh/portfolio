"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

export default function ChatLauncher({
  suggestions,
}: {
  suggestions: string[];
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  // useSyncExternalStore: returns null on server (no hydration mismatch),
  // real value on client — avoids setState-in-effect.
  const gpuSupported = useSyncExternalStore(
    () => () => {},
    () => !!(navigator as Navigator & { gpu?: unknown }).gpu,
    () => null,
  );

  const go = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    router.push(`/chat?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="mx-auto mt-10 w-full max-w-xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          go(value);
        }}
        className="flex items-center gap-2 rounded-xl border border-surface-alt bg-surface-alt/40 py-2 pl-4 pr-2 shadow-sm transition-colors focus-within:border-accent"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-secondary"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask me anything about Abhilash…"
          aria-label="Ask me anything about Abhilash"
          className="flex-1 bg-transparent py-2 text-base text-primary outline-none placeholder:text-secondary"
        />
        <button
          type="submit"
          aria-label="Send"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-accent text-white transition-opacity hover:opacity-85"
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

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => go(s)}
            className="rounded-full border border-surface-alt px-3.5 py-1.5 font-mono text-xs text-secondary transition-colors hover:border-accent hover:bg-accent-dim hover:text-accent"
          >
            {s}
          </button>
        ))}
      </div>

      {gpuSupported === true && (
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider">
          <span className="rounded-full bg-accent-dim px-2.5 py-1 text-accent">
            Works in your browser
          </span>
        </p>
      )}
      {gpuSupported === false && (
        <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider">
          <span className="rounded-full bg-surface-alt px-2.5 py-1 text-secondary">
            Requires Chrome or Edge 113+
          </span>
        </p>
      )}

      <p className="mt-3.5 font-mono text-xs tracking-wide text-secondary">
        or browse ·{" "}
        <Link href="/projects" className="text-accent hover:underline">
          projects
        </Link>{" "}
        ·{" "}
        <Link href="/experience" className="text-accent hover:underline">
          experience
        </Link>{" "}
        ·{" "}
        <Link href="/contact" className="text-accent hover:underline">
          contact
        </Link>
      </p>
    </div>
  );
}
