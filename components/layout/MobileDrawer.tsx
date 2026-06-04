"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Sun, Moon, X } from "lucide-react";

type Theme = "light" | "dark";

interface NavLink {
  href: string;
  label: string;
}

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
  email: string;
  theme: Theme;
  toggleTheme: () => void;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function MobileDrawer({
  open,
  onClose,
  links,
  email,
  theme,
  toggleTheme,
}: MobileDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to close + focus trap while open.
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock body scroll while open; always restore on cleanup.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Move focus into the panel on open; restore to the trigger on close.
  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;
    const firstFocusable = panel?.querySelector<HTMLElement>(FOCUSABLE);
    firstFocusable?.focus();
    return () => {
      trigger?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="sm:hidden">
      <div
        data-testid="drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-neutral/60 backdrop-blur-sm motion-safe:animate-[fadeIn_150ms_ease-out]"
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={[
          "fixed top-0 right-0 z-[60] h-full w-4/5 max-w-[320px]",
          "bg-surface border-l border-surface-alt shadow-xl",
          "flex flex-col p-6",
          "motion-safe:transition-transform motion-safe:duration-200",
        ].join(" ")}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-mono text-sm text-accent tracking-tight">
            abhilash
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="text-secondary hover:text-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className="text-base px-3 py-2.5 rounded-sm text-secondary hover:bg-accent-dim hover:text-accent transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center gap-3 pt-6">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="text-secondary hover:text-primary transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a
            href={`mailto:${email}`}
            onClick={onClose}
            className="flex-1 text-center bg-accent text-black text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-85 transition-opacity"
          >
            Hire me
          </a>
        </div>
      </div>
    </div>
  );
}
