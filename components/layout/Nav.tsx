"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { ThemeContext } from "@/components/providers/ThemeProvider";

const NAV_LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/chat", label: "Chat" },
  { href: "/contact", label: "Contact" },
];

interface NavProps {
  email: string;
}

export default function Nav({ email }: NavProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 40);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={[
        "fixed top-0 left-0 right-0 z-50 h-[60px] flex items-center px-6",
        "border-b border-surface-alt transition-all duration-200",
        scrolled
          ? "backdrop-blur-md bg-neutral/90"
          : "bg-surface",
      ].join(" ")}
    >
      <Link
        href="/"
        className="font-mono text-sm text-accent tracking-tight mr-8 shrink-0"
      >
        abhilash
      </Link>

      <div className="hidden sm:flex items-center gap-1 flex-1">
        {NAV_LINKS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "text-sm px-3 py-1.5 rounded-sm transition-colors duration-150",
                active
                  ? "bg-surface-alt text-primary font-medium"
                  : "text-secondary hover:bg-accent-dim hover:text-accent",
              ].join(" ")}
            >
              {label}
            </Link>
          );
        })}
      </div>

      {/* TODO POR-165: mobile hamburger */}
      <div className="flex sm:hidden flex-1" />

      <div className="flex items-center gap-3 ml-auto shrink-0">
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="text-secondary hover:text-primary transition-colors"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <a
          href={`mailto:${email}`}
          className="bg-accent text-black text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-85 transition-opacity"
        >
          Hire me
        </a>
      </div>
    </nav>
  );
}
