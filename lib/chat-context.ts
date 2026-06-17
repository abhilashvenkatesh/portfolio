import {
  getIdentity,
  getExperience,
  getProjects,
  getSkills,
  getContactInfo,
} from "@/lib/content";
import type {
  Identity,
  ExperienceEntry,
  Project,
  SkillCategory,
  ContactInfo,
} from "@/lib/types";

interface ChatContextData {
  identity: Identity;
  experience: ExperienceEntry[];
  projects: Project[];
  skills: SkillCategory[];
  contact: ContactInfo;
}

/**
 * Serialise CV content into a single grounding system prompt. Pure — takes data
 * in, returns a string — so it can be unit-tested without build-time `fs`.
 */
export function buildChatContext(d: ChatContextData): string {
  const skills = d.skills
    .map((c) => `${c.name}: ${c.skills.join(", ")}`)
    .join("\n");

  const experience = d.experience
    .map(
      (e) =>
        `- ${e.title} at ${e.company} (${e.period})\n  ${e.bullets.join("\n  ")}`,
    )
    .join("\n");

  const projects = d.projects
    .map(
      (p) =>
        `- ${p.name} (${p.year}): ${p.tagline}. Problem: ${p.problem} Impact: ${p.impact} Stack: ${p.stack.join(", ")}`,
    )
    .join("\n");

  return `You are a chat assistant for ${d.identity.name}'s portfolio — ${d.identity.title} at ${d.identity.employer}, based in ${d.identity.location}.
Answer questions ONLY about ${d.identity.name}'s background, skills, experience, projects, and contact details, using only the information below.
Refer to ${d.identity.name} in the third person ("Abhilash" or "he") — never "I". Keep answers to 2-4 sentences, conversational and clear.
If a question is unrelated, gently redirect to what you can answer.

## Contact
Email: ${d.contact.email}
LinkedIn: ${d.contact.linkedin}
Phone: ${d.contact.phone}
Location: ${d.identity.location}

## Skills
${skills}

## Experience
${experience}

## Projects
${projects}`;
}

/** Build-time grounding prompt bundled into the chat page (no runtime `fs`). */
export const CHAT_SYSTEM_PROMPT = buildChatContext({
  identity: getIdentity(),
  experience: getExperience(),
  projects: getProjects(),
  skills: getSkills(),
  contact: getContactInfo(),
});
