import type { ReactNode } from "react";

interface ContactCardProps {
  label: string;
  value: string;
  href: string;
  description: string;
  icon: ReactNode;
  newTab?: boolean;
}

export default function ContactCard({
  label,
  value,
  href,
  description,
  icon,
  newTab,
}: ContactCardProps) {
  return (
    <a
      href={href}
      {...(newTab
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group flex items-center gap-5 rounded-xl border border-surface-alt bg-surface-alt/40 p-5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:bg-accent/5"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-accent/30 bg-accent/10 text-accent">
        {icon}
      </div>
      <div className="flex-1">
        <p className="mb-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-accent">
          {label.toUpperCase()}
        </p>
        <p className="mb-0.5 text-[15px] font-medium text-primary">{value}</p>
        <p className="text-[13px] text-secondary">{description}</p>
      </div>
      <svg
        className="shrink-0 text-secondary"
        width="14"
        height="14"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2 10l8-8M4 2h6v6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
