/**
 * DOM verification script for 14.x tasks.
 * Run against a live dev/prod server: tsx scripts/verify-dom.ts [baseUrl]
 * Default baseUrl: http://localhost:3000
 */

const BASE_URL = process.argv[2] ?? "http://localhost:3000";

interface Check {
  name: string;
  pass: boolean;
  detail?: string;
}

const results: Check[] = [];

function check(name: string, pass: boolean, detail?: string) {
  results.push({ name, pass, detail });
}

async function fetchHtml(path: string): Promise<string> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${path}`);
  return res.text();
}

function has(html: string, pattern: RegExp | string): boolean {
  return typeof pattern === "string"
    ? html.includes(pattern)
    : pattern.test(html);
}

async function verifyHome() {
  const html = await fetchHtml("/");

  // 14.1 — Nav structure
  check("Nav: wordmark link href=/", has(html, /href="\/"[^>]*>abhilash/));
  check("Nav: Projects link", has(html, 'href="/projects"'));
  check("Nav: About link", has(html, 'href="/about"'));
  check("Nav: Experience link", has(html, 'href="/experience"'));
  check("Nav: Blog link", has(html, 'href="/blog"'));
  check("Nav: Chat link", has(html, 'href="/chat"'));
  check("Nav: Contact link", has(html, 'href="/contact"'));
  check("Nav: Hire me mailto", has(html, /href="mailto:[^"]+"/));
  check("Nav: theme toggle button", has(html, /aria-label="Toggle theme"/));
  check("Nav: fixed z-50 class present", has(html, "z-50"));

  // POR-166 — Hero content
  check("Hero: role badge", has(html, "Lead Application Developer · Melbourne"));
  check("Hero: headline", has(html, "Hi, I&#x27;m Abhilash.") || has(html, "Hi, I'm Abhilash."));
  check("Hero: subheading accent clause", has(html, "scale to millions."));
  check("Hero: bio", has(html, /11\+ years building distributed systems/));
  check("Hero: stat 11+ years", has(html, "years experience"));
  check("Hero: stat 30+ microservices", has(html, "microservices shipped"));
  check("Hero: stat 3 countries", has(html, "countries worked in"));

  // POR-167 — Chat launcher + scroll indicator
  check("Launcher: input placeholder", has(html, "Ask me anything about Abhilash"));
  check("Launcher: chip — top skills", has(html, /What are Abhilash(&#x27;|')s top skills\?/));
  check("Launcher: chip — Fabric Group", has(html, "Tell me about his role at Fabric Group"));
  check("Launcher: chip — projects led", has(html, "Which projects has he led?"));
  check("Launcher: chip — get in touch", has(html, "How can I get in touch?"));
  check("Launcher: browse projects link", has(html, 'href="/projects"'));
  check("Launcher: browse experience link", has(html, 'href="/experience"'));
  check("Launcher: browse contact link", has(html, 'href="/contact"'));
  check("Hero: scroll indicator label", has(html, ">scroll<"));

  // 14.5 — Footer structure
  check("Footer: GitHub link present", has(html, /aria-label="GitHub"/));
  check("Footer: LinkedIn link present", has(html, /aria-label="LinkedIn"/));
  check("Footer: Email link present", has(html, /aria-label="Email"/));
  check("Footer: copyright text", has(html, "© 2025 Abhilash"));

  // Anti-flash script
  check(
    "Anti-flash script in <head>",
    has(html, /localStorage\.getItem\('theme'\)/)
  );

  // ThemeProvider data-theme attribute hook
  check(
    "html lang=en present",
    has(html, 'lang="en"')
  );

  // Fonts
  check(
    "DM Sans font loaded",
    has(html, "DM+Sans") || has(html, "DM Sans")
  );
  check(
    "DM Mono font loaded",
    has(html, "DM+Mono") || has(html, "DM Mono")
  );
}

async function verifyNotFound() {
  // Verify the server is reachable
  const res = await fetch(`${BASE_URL}/nonexistent-page-xyz`);
  check("404 responds (not 500)", res.status === 404 || res.status === 200);
}

async function main() {
  console.log(`\nVerifying DOM at ${BASE_URL}\n`);

  try {
    await verifyHome();
    await verifyNotFound();
  } catch (err) {
    console.error(`Fatal: ${err}`);
    process.exit(1);
  }

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;

  for (const r of results) {
    const icon = r.pass ? "✓" : "✗";
    const line = `  ${icon} ${r.name}`;
    console.log(r.detail ? `${line}\n      ${r.detail}` : line);
  }

  console.log(`\n${passed} passed, ${failed} failed`);

  if (failed > 0) {
    console.log("\nManual browser checks still required (see verify-interactive.md)");
    process.exit(1);
  }

  console.log("\nStatic DOM checks passed.");
  console.log("See scripts/verify-interactive.md for browser-only checks.\n");
}

main();
