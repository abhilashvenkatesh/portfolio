## Context

`src/pages/about.astro` is currently a stub (heading only). The design prototype (`docs/design/about.html`) specifies the full layout: two-column header (bio text left, avatar right), résumé + blog CTAs, then a skills grid below. Skills data is defined in `docs/design/shared.js` as `SKILLS` — four categories, each with a list of tech tags.

`src/data/index.ts` is currently empty (no exports exist). The architecture specifies it as the home for typed data arrays (projects, experience, skills).

## Goals / Non-Goals

**Goals:**
- Implement the full `/about` page matching the design prototype
- Add typed `skills` data to `src/data/index.ts`
- Render bio, avatar, résumé CTA, and skills grid as static Astro (zero client JS for this page)
- Apply `ScrollReveal` to the skills section per existing spec

**Non-Goals:**
- Profile photo — placeholder SVG used until a real photo is provided
- Animated skill tag hover effects (no interactive React island needed)
- Filterable/searchable skills (static grid only)

## Decisions

### Decision: Pure Astro page — no React island for about content

**Chosen**: Implement `about.astro` entirely in Astro. Bio paragraphs, skill tags, and the avatar are static — no interactivity needed. Only `ScrollReveal` (existing React island, `client:visible`) is used for the skills section animation.

**Alternative considered**: React island for the whole page. Rejected — adds hydration cost with zero UX benefit. No interactivity required.

### Decision: Skills data in `src/data/index.ts`

**Chosen**: Add a `SkillGroup` type and `skills` export to `src/data/index.ts`. The about page imports directly — no fetch, no CMS.

```ts
export interface SkillGroup {
  name: string;
  items: string[];
}

export const skills: SkillGroup[] = [
  { name: "Languages", items: ["Java", "Node.js", "TypeScript", "JavaScript", "Ruby", "Python"] },
  { name: "Frameworks", items: ["Spring Boot", "Vert.x", "React", "Vue.js", "Express", "Dropwizard", "RxJava"] },
  { name: "Data & Messaging", items: ["MySQL", "MongoDB", "Elasticsearch", "Redis", "Kafka", "DynamoDB", "Cloud Spanner"] },
  { name: "Cloud & DevOps", items: ["AWS", "GCP", "Docker", "Jenkins", "Ansible", "CI/CD", "Microservices"] },
];
```

**Alternative considered**: Inline data in `about.astro`. Rejected — data belongs in `src/data/index.ts` per architecture convention.

### Decision: Avatar placeholder SVG, not a broken `<img>`

**Chosen**: Render a styled `<div>` with an SVG silhouette when `public/avatar.jpg` is absent. The placeholder matches the design prototype's placeholder style. When the real photo is added to `public/`, swap the placeholder for `<img src="/avatar.jpg" alt="Abhilash Venkatesh" />`.

**Why**: A broken image tag degrades the page visually and in accessibility tools. A placeholder is better until the asset exists.

### Decision: Layout — CSS Grid two-column, Tailwind utilities

**Chosen**: `grid grid-cols-1 md:grid-cols-[1fr_auto]` for bio + avatar. Skills grid uses `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`. No custom CSS — Tailwind 4.x utilities only.

## Risks / Trade-offs

- **Avatar asset missing**: `public/avatar.jpg` doesn't exist yet. → Placeholder SVG used; real photo is a manual step before launch.
- **Bio content hardcoded**: Paragraphs are strings in the `.astro` file, not from a CMS. → Acceptable for v1; editing requires a code change.
- **`src/data/index.ts` currently empty**: Adding `skills` here is safe — no existing exports to break.
