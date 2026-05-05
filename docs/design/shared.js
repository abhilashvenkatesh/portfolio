// shared.js — common data, components, theme logic
// loaded as <script type="text/babel" src="shared.js"> on every page

const { useState, useEffect, useRef } = React;

/* ── Data ────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1, name: "MCL Insurance Portal", tagline: "White-label serverless insurance platform on AWS", year: "2023",
    problem: "MCL's corporate insurance division needed a scalable, white-label portal to manage policy and claims workflows — built from scratch on modern cloud infrastructure.",
    impact: "Reduced claims processing time significantly through event-driven orchestration; system serves MCL's full corporate insurance division with high availability.",
    stack: ["AWS Lambda", "DynamoDB", "SQS", "Step Functions", "CloudFront", "API Gateway", "Splunk"],
    github: "#", demo: "#"
  },
  {
    id: 2, name: "Australia Post Event Platform", tagline: "Greenfield event management & reporting system on GCP", year: "2022",
    problem: "Australia Post's legacy event management infrastructure couldn't scale — a greenfield replacement was needed to handle high-volume event data in real time.",
    impact: "Replaced legacy infrastructure with a GCP-native microservices platform; Redis caching reduced API response times under peak load.",
    stack: ["Java", "Spring Boot", "GCP", "Cloud Spanner", "Redis", "Vue.js"],
    github: "#", demo: "#"
  },
  {
    id: 3, name: "Rapido Platform Core", tagline: "30+ microservices for India's largest bike-taxi platform", year: "2020",
    problem: "Rapido needed to scale its ride platform to millions of daily users across India, with sub-100ms API response times and zero tolerance for downtime.",
    impact: "40% improvement in system throughput; 30+ microservices handling millions of daily ride requests with sub-100ms p99 latency.",
    stack: ["Java", "Vert.x", "Node.js", "Kafka", "Elasticsearch", "Redis"],
    github: "#", demo: null
  },
  {
    id: 4, name: "Enterprise Learning Platform", tagline: "Digital learning & collaboration platform for a US networking giant", year: "2016",
    problem: "A leading US communications company needed a unified platform integrating e-learning, social networking, blogging, and expert discovery at enterprise scale.",
    impact: "Delivered over a 2+ year program; platform integrated 6+ distinct capabilities across a large distributed engineering team.",
    stack: ["Java", "Node.js", "MongoDB", "Kafka", "Elasticsearch", "Ember.js", "OrientDB"],
    github: "#", demo: "#"
  }
];

const SKILLS = {
  Languages:      ["Java", "Node.js", "TypeScript", "JavaScript", "Ruby", "Python"],
  Frameworks:     ["Spring Boot", "Vert.x", "React", "Vue.js", "Express", "Dropwizard", "RxJava"],
  "Data & Messaging": ["MySQL", "MongoDB", "Elasticsearch", "Redis", "Kafka", "DynamoDB", "Cloud Spanner"],
  "Cloud & DevOps": ["AWS", "GCP", "Docker", "Jenkins", "Ansible", "CI/CD", "Microservices"]
};

const BLOGS = [
  {
    id: "why-boring-systems-win",
    title: "Why Boring Systems Win",
    date: "April 18, 2025",
    readTime: "6 min read",
    tag: "Systems Design",
    summary: "The best infrastructure is the kind nobody talks about. A case for choosing predictable over clever when designing long-lived systems.",
    content: `
## The Quiet Power of Boring Systems

There's a phrase I keep coming back to: "boring technology is a feature." When you're on-call at 2am and something breaks, you want the kind of system you can reason about in five minutes — not one that requires re-reading the design doc to remember why a particular choice was made.

## What Makes a System Boring?

Boring systems share a few properties:

- **Predictable failure modes.** You know exactly what breaks when X goes wrong, and you've probably seen it before.
- **Minimal moving parts.** Every layer of abstraction is something that can go wrong. Boring systems have few layers.
- **Dull but reliable dependencies.** PostgreSQL, Redis, Kafka — tools that have been battle-tested over years and have enormous communities of people who've hit your exact problem.
- **Clear ownership.** Any engineer on the team can understand the system in a day.

## The Temptation of Clever

Early in my career, I loved clever. A bespoke caching strategy here, a custom protocol there. These were fun to build and impressive to demo. They were also, without exception, a nightmare to maintain.

The problem with clever is that it trades short-term complexity cost for long-term operational cost. The person who understands the trick leaves the team. The edge case the trick didn't handle shows up in production. The "temporary" workaround becomes load-bearing infrastructure.

## Boring in Practice

At Meridian Labs, we had a billing system that was embarrassingly simple: a PostgreSQL table with a double-entry ledger structure, a Celery worker to process events, and a Stripe webhook handler. No event sourcing, no CQRS, no distributed saga pattern.

It handled $2M+ MRR without incident for over a year. When something did go wrong, any engineer could diagnose it with a SQL query.

That's the win.

## The Principle

Choose boring technology. Resist the urge to solve interesting problems with interesting solutions. The most impressive system is the one that runs quietly for years while your team ships features instead of fighting fires.

*Save the clever for the product. Make the infrastructure dull.*
    `
  },
  {
    id: "go-concurrency-patterns",
    title: "Go Concurrency Patterns I Actually Use",
    date: "March 5, 2025",
    readTime: "8 min read",
    tag: "Go",
    summary: "After 3 years of production Go, here are the concurrency patterns I reach for again and again — and the ones I've learned to avoid.",
    content: `
## Go Concurrency Patterns I Actually Use

Go's concurrency model is elegant in theory and occasionally treacherous in practice. After shipping several high-throughput services in Go, I've settled on a small set of patterns that work reliably at scale.

## 1. The Worker Pool

The most useful pattern, period. When you have a bounded set of work to do concurrently:

\`\`\`go
func workerPool(jobs <-chan Job, results chan<- Result, workers int) {
    var wg sync.WaitGroup
    for i := 0; i < workers; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            for job := range jobs {
                results <- process(job)
            }
        }()
    }
    wg.Wait()
    close(results)
}
\`\`\`

The key insight: close the jobs channel when you're done sending, and let workers drain it naturally. Don't try to signal workers to stop — let the channel do it.

## 2. Context Cancellation Everywhere

If your goroutine does I/O, it takes a context. No exceptions.

\`\`\`go
func fetchData(ctx context.Context, id string) (Data, error) {
    req, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
    resp, err := http.DefaultClient.Do(req)
    if err != nil {
        return Data{}, fmt.Errorf("fetch: %w", err)
    }
    defer resp.Body.Close()
    // ...
}
\`\`\`

This seems obvious until you're debugging a goroutine leak because someone forgot to pass context down three layers.

## 3. errgroup for Fan-Out

When you need to run N things concurrently and collect errors:

\`\`\`go
g, ctx := errgroup.WithContext(ctx)
for _, item := range items {
    item := item // capture loop var
    g.Go(func() error {
        return process(ctx, item)
    })
}
if err := g.Wait(); err != nil {
    return err
}
\`\`\`

\`errgroup\` cancels the context on first error, which propagates cancellation to all running goroutines. Clean and composable.

## What I Avoid

- **Goroutines without lifetimes.** If I can't answer "when does this goroutine exit?", I don't start it.
- **Unbuffered channels as semaphores.** Use \`make(chan struct{}, n)\` explicitly.
- **Global state shared between goroutines.** Mutexes are fine; races are not.

## The Mental Model

Think of goroutines as employees and channels as the work queue. The employee pool pattern covers 80% of concurrent work. For the rest, \`errgroup\` and context cancellation cover most of what's left.
    `
  },
  {
    id: "postgres-performance-tuning",
    title: "PostgreSQL Performance Tuning: A Practical Checklist",
    date: "January 22, 2025",
    readTime: "10 min read",
    tag: "PostgreSQL",
    summary: "The same performance issues keep showing up in every codebase I've worked on. Here's the checklist I run through every time.",
    content: `
## PostgreSQL Performance Tuning: A Practical Checklist

Over the years I've worked on enough data-heavy systems to notice that the same five or six issues account for the vast majority of performance problems. This is the checklist I run through every time I'm handed a slow database.

## 1. Look at \`pg_stat_statements\` First

Before doing anything else:

\`\`\`sql
SELECT query, calls, mean_exec_time, total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 20;
\`\`\`

This tells you where time is actually being spent. Don't guess. Every optimization effort should start here.

## 2. Missing Indexes on Foreign Keys

Postgres does not automatically index foreign key columns. If you have a \`user_id\` FK column and you're joining on it frequently, add an index:

\`\`\`sql
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
\`\`\`

Note \`CONCURRENTLY\` — it builds the index without locking the table.

## 3. N+1 Queries in ORMs

The classic. You load 100 users, then for each user make a separate query to load their orders. Use \`EXPLAIN ANALYZE\` on your slow endpoints and look for repeated queries with slightly different parameters.

Fix: eager-load related data with JOINs or use \`IN\` clause batching.

## 4. Bloated Tables from Updates/Deletes

PostgreSQL uses MVCC — updates and deletes leave dead tuples behind. If you have a high-churn table (job queues, session tables), check:

\`\`\`sql
SELECT relname, n_dead_tup, n_live_tup,
       round(n_dead_tup::numeric/nullif(n_live_tup,0)*100, 2) AS dead_pct
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

If \`dead_pct\` is high, autovacuum isn't keeping up. Tune it or run \`VACUUM ANALYZE\` manually.

## 5. Connection Pool Misconfiguration

Postgres handles one process per connection. At scale, you want a connection pooler (PgBouncer in transaction mode) in front of Postgres, not 500 raw connections from your app servers.

A well-configured PgBouncer with 20-50 Postgres connections can handle thousands of app-side connections without issue.

## 6. \`SELECT *\` on Wide Tables

Fetching all columns when you need three is wasteful, especially on tables with \`jsonb\` or \`text\` columns. Always select the columns you need.

## The 80% Fix

In my experience, fixing missing indexes and N+1 queries resolves most performance problems. The rest of this list handles edge cases that appear at higher scale.

Run \`pg_stat_statements\`, find your top 5 queries by total time, and optimize those. Everything else is noise.
    `
  },
  {
    id: "api-design-lessons",
    title: "API Design Lessons From 5 Years of Breaking Things",
    date: "December 10, 2024",
    readTime: "7 min read",
    tag: "API Design",
    summary: "A collection of hard-won principles for designing APIs that don't make your consumers hate you — gathered from building and breaking many of them.",
    content: `
## API Design Lessons From 5 Years of Breaking Things

I've designed a lot of APIs. Some were good. Most taught me something important by being bad. Here's what I've learned.

## 1. Name Things After Resources, Not Actions

Bad: \`POST /createUser\`, \`GET /getUser?id=123\`
Good: \`POST /users\`, \`GET /users/123\`

This seems minor until you have 50 endpoints and your consumers can't remember any of them. REST conventions exist because they create a predictable mental model.

## 2. Return Consistent Error Shapes

Pick a shape and stick to it everywhere:

\`\`\`json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Email address is invalid",
    "field": "email"
  }
}
\`\`\`

Nothing is more frustrating than an API that returns \`{"error": "bad request"}\` from one endpoint and \`{"errors": [{"msg": "..."}]}\` from another.

## 3. Version from Day One

Even if you're only sure about v1, put \`/v1/\` in the path. It costs nothing now and saves enormous pain later when you need to make breaking changes.

## 4. Idempotency Keys for Mutations

Any endpoint that causes side effects (charge a card, send an email, create a record) should support idempotency keys:

\`\`\`
POST /v1/payments
Idempotency-Key: client-generated-uuid
\`\`\`

If the client retries due to a network timeout, the server returns the original response instead of charging twice. Stripe does this. You should too.

## 5. Pagination Defaults

Never return unbounded lists. Always paginate. Use cursor-based pagination (not offset) for large datasets — offset pagination breaks when records are inserted or deleted mid-page.

## 6. Be Boring with Auth

Use a standard: OAuth2, API keys, or JWT with standard claims. Don't invent your own authentication scheme. The security surface area of homegrown auth is enormous and the mistakes are severe.

## The Meta-Lesson

Good API design is mostly about empathy. Before shipping an endpoint, ask: "If I had never seen this codebase, would I know what this does and what to send it?" If the answer is no, keep iterating.
    `
  }
];

const EXPERIENCE = [
  {
    role: "Lead Application Developer", company: "Fabric Group", period: "Aug 2023 — Present",
    bullets: [
      "Technical lead and primary architect for MCL Insurance's white-label portal on AWS serverless infrastructure (Lambda, DynamoDB, SQS, Step Functions)",
      "Led and managed 6 software engineers across front-end and back-end workstreams, conducting performance reviews and technical mentoring",
      "Built event-driven workflows to orchestrate complex insurance policy and claims processing logic, reducing processing time and improving reliability",
      "Integrated Splunk for centralised logging and alerting; established CI/CD pipelines enabling repeatable deployments across dev, staging, and production"
    ]
  },
  {
    role: "Senior Consultant / Senior Software Engineer", company: "Braves Technologies", period: "Aug 2022 — Jul 2023",
    bullets: [
      "Architected microservices in Java and Spring Boot on GCP, processing high-volume event data for Australia Post with Cloud Spanner as the primary data store",
      "Built the Vue.js web platform enabling real-time event tracking for internal Australia Post operations teams",
      "Implemented Redis-based caching strategies to reduce API response times and improve throughput under peak load"
    ]
  },
  {
    role: "Lead Consultant / Software Architect", company: "Rapido (Roppen Transportation)", period: "Dec 2019 — Aug 2022",
    bullets: [
      "Managed and evolved 30+ microservices handling millions of daily ride requests with sub-100ms API response times",
      "Designed and built core platform services: Location Service, Order Management System, and Loyalty/Rewards Framework using Vert.x, Node.js, Kafka, and Elasticsearch",
      "Drove performance engineering initiatives achieving a 40% improvement in system throughput",
      "Managed, mentored, and upskilled 8 senior engineers in distributed systems design, code quality, and Agile delivery"
    ]
  },
  {
    role: "Senior Consultant / Senior Software Engineer", company: "ThoughtWorks", period: "Aug 2014 — Nov 2019",
    bullets: [
      "Built React and Node.js/Express CMS for a leading US supermarket chain managing product content and promotional campaigns nationwide",
      "Developed a microservices-based Health Information Exchange (HIE) deployed across hospitals in Bangladesh, automated with Ansible",
      "Contributed to a 2+ year enterprise learning platform program integrating e-learning, social networking, and expert discovery for a US networking company"
    ]
  }
];

/* ── Hooks ───────────────────────────────────────────────── */
function useInView(threshold = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    // Fallback: always become visible after 300ms in case observer doesn't fire
    const timer = setTimeout(() => setVisible(true), 300);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); clearTimeout(timer); obs.disconnect(); }
    }, { threshold: 0, rootMargin: "0px 0px -20px 0px" });
    if (ref.current) obs.observe(ref.current);
    return () => { obs.disconnect(); clearTimeout(timer); };
  }, []);
  return [ref, visible];
}

function useTheme() {
  const [isDark, setIsDark] = useState(() => localStorage.getItem("portfolio-theme") === "dark");
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("portfolio-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("portfolio-theme", "light");
    }
  }, [isDark]);
  return [isDark, () => setIsDark(d => !d)];
}

/* ── Atoms ───────────────────────────────────────────────── */
function Tag({ label }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: "var(--mono)", fontSize: "11px",
      letterSpacing: "0.03em", padding: "3px 9px", borderRadius: "4px",
      background: "var(--bg3)", color: "var(--muted)", border: "1px solid var(--border)"
    }}>{label}</span>
  );
}

function AccentTag({ label }) {
  return (
    <span style={{
      display: "inline-block", fontFamily: "var(--mono)", fontSize: "11px",
      letterSpacing: "0.04em", padding: "3px 9px", borderRadius: "4px",
      background: "var(--accent-dim)", color: "var(--accent)", border: "1px solid var(--accent-border)"
    }}>{label}</span>
  );
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} style={{
      transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(14px)",
      willChange: "opacity, transform",
      ...style
    }}>{children}</div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
      <span style={{
        fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.1em",
        textTransform: "uppercase", color: "var(--accent)", flexShrink: 0
      }}>{children}</span>
      <div style={{ flex: 1, height: "1px", background: "var(--border)" }}></div>
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div style={{ textAlign: "center", padding: "100px clamp(20px,5vw,64px) 60px", position: "relative" }}>
      <div style={{
        position: "absolute", inset: 0, zIndex: 0,
        backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 70% 100% at 50% 0%, black 30%, transparent 100%)"
      }}></div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <AccentTag label={title} />
        <h1 style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 600, color: "var(--heading)", letterSpacing: "-0.03em", marginTop: "16px", lineHeight: 1.1 }}>
          {subtitle}
        </h1>
      </div>
    </div>
  );
}

/* ── Nav ─────────────────────────────────────────────────── */
function Nav({ active, isDark, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Projects",   href: "projects.html" },
    { label: "About",      href: "about.html" },
    { label: "Experience", href: "experience.html" },
    { label: "Blog",       href: "blog.html" },
    { label: "Contact",    href: "contact.html" }
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      padding: "0 clamp(20px, 5vw, 64px)", height: "60px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      background: scrolled ? "var(--nav-bg)" : "var(--nav-bg)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      transition: "all 0.3s ease"
    }}>
      {/* Logo */}
      <a href="index.html" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "14px", color: "var(--accent)", letterSpacing: "0.05em" }}>abhilash</span>
      </a>

      {/* Desktop links */}
      <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
        {links.map(l => {
          const isActive = active === l.label.toLowerCase();
          return (
            <a key={l.label} href={l.href} style={{
              fontSize: "14px", padding: "6px 12px", borderRadius: "6px",
              color: isActive ? "var(--accent)" : "var(--muted)",
              background: isActive ? "var(--accent-dim)" : "transparent",
              textDecoration: "none", transition: "all 0.2s",
              fontWeight: isActive ? 500 : 400
            }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.color = "var(--text)"; e.currentTarget.style.background = "var(--bg3)"; }}}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.background = "transparent"; }}}
            >{l.label}</a>
          );
        })}
        <div style={{ width: "1px", height: "20px", background: "var(--border)", margin: "0 8px" }}></div>
        <a href="mailto:abhilash@example.com" style={{
          fontSize: "13px", fontFamily: "var(--mono)", color: "var(--accent)",
          border: "1px solid var(--accent-border)", padding: "7px 16px", borderRadius: "6px",
          textDecoration: "none", transition: "background 0.2s"
        }}
          onMouseEnter={e => e.target.style.background = "var(--accent-dim)"}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >Hire me</a>

        {/* Theme toggle */}
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle theme"
          style={{ marginLeft: "8px" }}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer style={{
      padding: "24px clamp(20px, 5vw, 64px)",
      borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      flexWrap: "wrap", gap: "8px", marginTop: "auto"
    }}>
      <span style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)" }}>© 2025 Abhilash</span>
      <div style={{ display: "flex", gap: "20px" }}>
        {[
          { label: "GitHub", href: "#" },
          { label: "LinkedIn", href: "#" },
          { label: "Email", href: "mailto:abhilash@example.com" }
        ].map(l => (
          <a key={l.label} href={l.href} style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => e.target.style.color = "var(--accent)"}
            onMouseLeave={e => e.target.style.color = "var(--muted)"}
          >{l.label}</a>
        ))}
      </div>
    </footer>
  );
}

// Export to window so other babel scripts can use
Object.assign(window, {
  PROJECTS, SKILLS, EXPERIENCE, BLOGS,
  useInView, useTheme,
  Tag, AccentTag, FadeIn, SectionLabel, PageHeader,
  Nav, Footer
});
