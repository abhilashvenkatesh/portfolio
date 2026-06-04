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
