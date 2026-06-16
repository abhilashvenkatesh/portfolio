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

async function verifyAbout() {
  const html = await fetchHtml("/about");

  // POR-168 — page header (ABOUT-1)
  check("About: header label", has(html, ">About me<"));
  check(
    "About: header subtitle",
    has(html, "11+ years building systems across 3 countries and 4 industries.")
  );

  // Bio (ABOUT-2) — employers must appear
  check("About: bio employer ThoughtWorks", has(html, "ThoughtWorks"));
  check("About: bio employer Rapido", has(html, "Rapido"));
  check("About: bio employer Australia Post", has(html, "Australia Post"));
  check("About: bio employer Fabric Group", has(html, "Fabric Group"));

  // Photo placeholder (ABOUT-3)
  check("About: photo placeholder caption", has(html, ">photo<"));

  // Résumé CTA (ABOUT-4)
  check(
    "About: résumé download link",
    has(html, /href="\/resume\.pdf"[^>]*download/) ||
      has(html, /download[^>]*href="\/resume\.pdf"/)
  );

  // Blog cross-link (ABOUT-5)
  check("About: blog link", has(html, 'href="/blog"'));

  // Skills section (POR-169)
  check("About: skills section label", has(html, "What I work with"));
  check("About: skills category Languages", has(html, ">Languages<"));
  check("About: skills category Frameworks", has(html, ">Frameworks<"));
  check("About: skills category Data & Messaging", has(html, /Data &(amp;|) Messaging/));
  check("About: skills category Cloud & DevOps", has(html, /Cloud &(amp;|) DevOps/));
}

async function verifyExperience() {
  const html = await fetchHtml("/experience");

  // POR-172 — page header (EXP-1)
  check("Experience: header label", has(html, ">Experience<"));
  check("Experience: header subtitle", has(html, "Where I&#x27;ve worked") || has(html, "Where I've worked"));

  // Role entries (EXP-3) — current role + an earlier role
  check("Experience: role Fabric Group", has(html, "Fabric Group"));
  check("Experience: role Australia Post", has(html, "Australia Post"));
  check("Experience: role Rapido", has(html, "Rapido"));
  check("Experience: role ThoughtWorks", has(html, "ThoughtWorks"));
  check("Experience: period pill present", has(html, "Present"));

  // Current-role marker distinguished (EXP-2)
  check(
    "Experience: current-role marker ring",
    has(html, /bg-accent[^"]*ring-4[^"]*ring-accent-dim/) ||
      has(html, /ring-accent-dim/)
  );

  // Bottom CTA (EXP-5 / XC-4)
  check("Experience: CTA heading", has(html, "Want the full picture?"));
  check(
    "Experience: résumé download link",
    has(html, /href="\/resume\.pdf"[^>]*download/) ||
      has(html, /download[^>]*href="\/resume\.pdf"/)
  );
}

async function verifyProjects() {
  const list = await fetchHtml("/projects");

  // POR-170 — full listing page header
  check("Projects: header label", has(list, "Featured Projects"));
  check("Projects: header subtitle", has(list, "Things I&#x27;ve built") || has(list, "Things I've built"));

  // Cards link to detail pages
  check("Projects: card links to LedgerStream detail", has(list, 'href="/projects/ledger-stream"'));
  check("Projects: card links to Pulse CLI detail", has(list, 'href="/projects/pulse-cli"'));
  check("Projects: card name LedgerStream", has(list, "LedgerStream"));
  check("Projects: demo link present (project with demo)", has(list, /aria-label="LedgerStream live demo"/));
  check("Projects: IMPACT callout present", has(list, ">IMPACT<"));
  check("Projects: Problem label present", has(list, ">Problem<"));
  check("Projects: stack tag present (Kotlin)", has(list, "Kotlin"));

  // Detail page with an MDX body
  const detail = await fetchHtml("/projects/ledger-stream");
  check("Detail: back link to /projects", has(detail, 'href="/projects"'));
  check("Detail: project name heading", has(detail, "LedgerStream"));
  check("Detail: Problem section", has(detail, ">Problem<"));
  check("Detail: Impact section", has(detail, ">Impact<"));
  check("Detail: Tech stack section", has(detail, "Tech stack"));
  check("Detail: role rendered", has(detail, "Lead Application Developer"));
  check("Detail: MDX body rendered", has(detail, "Approach") && has(detail, "append-only"));
  check("Detail: live demo link present", has(detail, /href="https:\/\/ledger-stream\.demo\.dev"/));

  // Detail page WITHOUT an MDX body still renders structured sections (graceful)
  const bodyless = await fetchHtml("/projects/pulse-cli");
  check("Detail (no body): structured Problem section", has(bodyless, ">Problem<"));
  check("Detail (no body): tech stack present", has(bodyless, "Tech stack"));
  check("Detail (no body): no live demo link", !has(bodyless, "Live demo"));
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
    await verifyAbout();
    await verifyExperience();
    await verifyProjects();
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
