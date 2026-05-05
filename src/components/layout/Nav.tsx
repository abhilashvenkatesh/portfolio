import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/experience', label: 'Experience' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

interface NavProps {
  currentPath: string;
}

export default function Nav({ currentPath }: NavProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('portfolio-theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = stored ?? (prefersDark ? 'dark' : 'light');
    setTheme(resolved);
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('portfolio-theme', next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  const normalizedPath = currentPath.endsWith('/') && currentPath !== '/'
    ? currentPath.slice(0, -1)
    : currentPath;

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Site name */}
          <a
            href="/"
            className="text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            Abhilash Venkatesh
          </a>

          {/* Desktop links + theme toggle */}
          <div className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive = normalizedPath === href;
              return (
                <a
                  key={href}
                  href={href}
                  className={[
                    'py-3 min-w-[44px] text-center text-sm font-medium transition-colors',
                    isActive
                      ? 'text-indigo-600 dark:text-indigo-400 underline underline-offset-4'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                  ].join(' ')}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {label}
                </a>
              );
            })}
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu — grid height animation */}
        <div className={[
          'md:hidden grid overflow-hidden transition-[grid-template-rows] duration-200',
          menuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
        ].join(' ')}>
          <div className="min-h-0">
            <div className="border-t border-gray-200 dark:border-gray-800 py-2">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = normalizedPath === href;
                return (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={[
                      'block px-2 py-3 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100',
                    ].join(' ')}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ThemeToggle({ theme, onToggle }: { theme: 'light' | 'dark' | null; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="p-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 012.25 12c0-4.67 3.3-8.573 7.748-9.452.518-.1.97.374.738.857A7.5 7.5 0 0019.5 12c0 1.456-.414 2.816-1.133 3.967a.61.61 0 00.04.712.612.612 0 00.662.179c.636-.2 1.253-.462 1.841-.778a.75.75 0 01.842 1.222z" />
        </svg>
      )}
    </button>
  );
}
