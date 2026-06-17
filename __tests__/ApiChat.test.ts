import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the 'ai' module before importing the route
vi.mock("ai", () => ({
  streamText: vi.fn(),
}));

// Mock lib/chat-context
vi.mock("@/lib/chat-context", () => ({
  CHAT_SYSTEM_PROMPT: "SYSTEM PROMPT",
}));

describe("/api/chat edge route", () => {
  let POST: (req: Request) => Promise<Response>;

  beforeEach(async () => {
    vi.resetModules();
    // Re-import after each reset to pick up fresh env state
    const mod = await import("@/app/api/chat/route");
    POST = mod.POST;
  });

  it("returns 503 when AI_GATEWAY_API_KEY is absent", async () => {
    delete process.env.AI_GATEWAY_API_KEY;
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "hello" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(503);
    const body = await res.json() as { error: string };
    expect(body.error).toBe("API fallback unavailable");
  });

  it("returns 400 when question is missing", async () => {
    process.env.AI_GATEWAY_API_KEY = "test-key";
    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("calls streamText with correct model and system prompt when key present", async () => {
    process.env.AI_GATEWAY_API_KEY = "test-key";
    const { streamText } = await import("ai");
    const mockResult = { toTextStreamResponse: () => new Response("OK", { status: 200 }) };
    vi.mocked(streamText).mockReturnValue(mockResult as ReturnType<typeof streamText>);

    const req = new Request("http://localhost/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: "What are his skills?" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(streamText).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "anthropic/claude-haiku-4-5-20251001",
        system: "SYSTEM PROMPT",
        messages: [{ role: "user", content: "What are his skills?" }],
      }),
    );
  });
});
