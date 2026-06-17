import { getChatChips, getContactInfo } from "@/lib/content";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-context";
import ChatClient from "@/components/chat/ChatClient";

// Static shell: build-time data is read here and handed to the client island.
// All WebLLM logic runs in the browser inside ChatClient.
export default function ChatPage() {
  const contact = getContactInfo();

  return (
    <ChatClient
      systemPrompt={CHAT_SYSTEM_PROMPT}
      chips={getChatChips()}
      email={contact.email}
      linkedin={contact.linkedin}
    />
  );
}
