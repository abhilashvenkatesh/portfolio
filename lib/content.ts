import fs from "fs";
import path from "path";
import type {
  Identity,
  Project,
  SkillCategory,
  ExperienceEntry,
  ContactInfo,
  HomeContent,
} from "@/lib/types";

const CONTENT = path.join(process.cwd(), "content");

const readJSON = <T>(file: string): T =>
  JSON.parse(fs.readFileSync(path.join(CONTENT, file), "utf8")) as T;

export const getIdentity = (): Identity => readJSON<Identity>("identity.json");

export const getProjects = (): Project[] => readJSON<Project[]>("projects.json");

/** Derive a URL-safe slug from a project id. Near-identity for kebab-case ids. */
export const projectSlug = (id: string): string =>
  id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const getProjectBySlug = (slug: string): Project | undefined =>
  getProjects().find((p) => projectSlug(p.id) === slug);

/**
 * Read a project's optional long-form case-study body at build time.
 * Returns null when no `content/projects/<slug>.mdx` file exists.
 */
export const getProjectBody = (slug: string): string | null => {
  const file = path.join(CONTENT, "projects", `${slug}.mdx`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
};

export const getSkills = (): SkillCategory[] =>
  readJSON<SkillCategory[]>("skills.json");

export const getExperience = (): ExperienceEntry[] =>
  readJSON<ExperienceEntry[]>("experience.json");

export const getContactInfo = (): ContactInfo =>
  readJSON<ContactInfo>("contact.json");

export const getHomeContent = (): HomeContent =>
  readJSON<HomeContent>("home.json");

export const getAboutBio = (): string[] => readJSON<string[]>("about.json");

export const getChatChips = (): string[] =>
  readJSON<string[]>("chat-chips.json");
