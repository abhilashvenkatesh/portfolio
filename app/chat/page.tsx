import type { Metadata } from "next";
import {
  getChatChips,
  getContactInfo,
  getExperience,
  getIdentity,
  getProjects,
  getSkills,
} from "@/lib/content";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-context";
import ChatClient from "@/components/chat/ChatClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

// Static shell: build-time data is read here and handed to the client island.
// All WebLLM logic runs in the browser inside ChatClient.
export default function ChatPage() {
  const identity = getIdentity();
  const contact = getContactInfo();
  const experience = getExperience();
  const projects = getProjects();
  const skills = getSkills();

  const loadingContent = {
    currentRole: experience[0]?.bullets[0] ?? "",
    latestProject: projects[0]
      ? `${projects[0].name} — ${projects[0].tagline}`
      : "",
    topSkills: skills[0]?.skills.slice(0, 4).join(", ") ?? "",
  };

  return (
    <ChatClient
      ownerName={identity.name}
      ownerFirstName={identity.firstName}
      systemPrompt={CHAT_SYSTEM_PROMPT}
      chips={getChatChips()}
      email={contact.email}
      linkedin={contact.linkedin}
      loadingContent={loadingContent}
    />
  );
}
