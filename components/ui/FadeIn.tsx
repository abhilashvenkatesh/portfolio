"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  /** Stagger delay in milliseconds before the reveal transition starts. */
  delay?: number;
  className?: string;
}

/**
 * Scroll-reveal wrapper. Starts hidden (opacity-0, nudged down 14px) and
 * transitions to visible over 500ms when it scrolls into view. Honours
 * prefers-reduced-motion by skipping the translate.
 */
export default function FadeIn({ children, delay = 0, className }: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-500 ease-out motion-reduce:translate-y-0 ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-[14px]"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
