import { streamText } from "ai";
import { CHAT_SYSTEM_PROMPT } from "@/lib/chat-context";

export async function POST(req: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return Response.json(
      { error: "API fallback unavailable" },
      { status: 503 },
    );
  }

  let question: string;
  try {
    const body = (await req.json()) as { question?: string };
    question = typeof body.question === "string" ? body.question.trim() : "";
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!question) {
    return Response.json({ error: "question is required" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: "anthropic/claude-haiku-4-5-20251001",
      system: CHAT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: question }],
    });

    return result.toTextStreamResponse();
  } catch {
    return Response.json(
      { error: "API fallback unavailable" },
      { status: 502 },
    );
  }
}
