import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import ChatMessage from "@/components/chat/ChatMessage";
import ChatInput from "@/components/chat/ChatInput";
import UnsupportedFallback from "@/components/chat/UnsupportedFallback";
import ChatClient from "@/components/chat/ChatClient";
import ModelProvider from "@/components/providers/ModelProvider";

// ---- Mock next/navigation useSearchParams ----
let currentQuery = "";
vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(currentQuery),
}));

// ---- Mock the WebLLM engine (no real model download in jsdom) ----
const create = vi.fn();
vi.mock("@mlc-ai/web-llm", () => ({
  CreateMLCEngine: vi.fn(
    async (
      _id: string,
      opts: { initProgressCallback?: (r: { progress: number; text: string; timeElapsed: number }) => void },
    ) => {
      opts.initProgressCallback?.({ progress: 1, text: "Ready", timeElapsed: 0 });
      return { chat: { completions: { create } } };
    },
  ),
}));

function streamOf(text: string) {
  return (async function* () {
    yield { choices: [{ delta: { content: text } }] };
  })();
}

const props = {
  ownerName: "Abhilash Venkatesh",
  ownerFirstName: "Abhilash",
  systemPrompt: "SYSTEM",
  chips: [
    "What are his top skills?",
    "Tell me about his role at Rapido",
    "Which projects has he led?",
    "How can I get in touch?",
    "What's his current role?",
    "What cloud platforms does he know?",
  ],
  email: "test@example.com",
  linkedin: "https://linkedin.com/in/test",
  loadingContent: {
    currentRole: "Lead engineer at Fabric Group",
    latestProject: "LedgerStream — Event-sourced ledger",
    topSkills: "Java, Node.js, TypeScript, JavaScript",
  },
};

function renderWithProvider(ui: React.ReactElement) {
  return render(<ModelProvider>{ui}</ModelProvider>);
}

beforeEach(() => {
  currentQuery = "";
  create.mockReset();
  create.mockResolvedValue(streamOf("Here's the answer."));
  Object.defineProperty(navigator, "gpu", {
    value: {},
    configurable: true,
  });
});

afterEach(() => {
  // @ts-expect-error cleanup test stub
  delete navigator.gpu;
});

// ----------------------------------------------------------------
// Presentational components
// ----------------------------------------------------------------

describe("ChatMessage", () => {
  it("renders an assistant message left-aligned labelled Abhilash", () => {
    render(<ChatMessage msg={{ role: "assistant", text: "Hello" }} ownerFirstName="Abhilash" />);
    expect(screen.getByText("Abhilash")).toBeInTheDocument();
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("shows a blinking cursor on a pending assistant message", () => {
    render(
      <ChatMessage msg={{ role: "assistant", text: "", pending: true }} ownerFirstName="Abhilash" />,
    );
    expect(screen.getByText("▍")).toBeInTheDocument();
  });

  it("renders a visitor message labelled you", () => {
    render(<ChatMessage msg={{ role: "user", text: "Hi" }} ownerFirstName="Abhilash" />);
    expect(screen.getAllByText("you").length).toBeGreaterThan(0);
  });
});

describe("ChatInput", () => {
  it("disables send when the input is empty", () => {
    render(<ChatInput modelLoading={false} thinking={false} queued={false} onSend={() => {}} />);
    expect(screen.getByLabelText("Send")).toBeDisabled();
  });

  it("shows the Thinking… placeholder while generating", () => {
    render(<ChatInput modelLoading={false} thinking={true} queued={false} onSend={() => {}} />);
    expect(screen.getByPlaceholderText("Thinking…")).toBeInTheDocument();
  });
});

describe("UnsupportedFallback", () => {
  it("renders direct contact links", () => {
    render(
      <UnsupportedFallback
        email="test@example.com"
        linkedin="https://linkedin.com/in/test"
        ownerName="Abhilash"
      />,
    );
    expect(
      screen.getByRole("link", { name: "test@example.com" }),
    ).toHaveAttribute("href", "mailto:test@example.com");
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByText(/reach Abhilash directly/i)).toBeInTheDocument();
  });
});

// ----------------------------------------------------------------
// ChatClient integration (mocked engine)
// ----------------------------------------------------------------

describe("ChatClient", () => {
  it("shows the welcome message and six suggestion chips on a fresh visit", async () => {
    renderWithProvider(<ChatClient {...props} />);
    expect(
      await screen.findByText(/I'm a chat layer over Abhilash Venkatesh's resume/),
    ).toBeInTheDocument();
    props.chips.forEach((chip) => {
      expect(screen.getByRole("button", { name: chip })).toBeInTheDocument();
    });
  });

  it("hides chips and answers after a chip is clicked", async () => {
    renderWithProvider(<ChatClient {...props} />);
    const chip = await screen.findByRole("button", {
      name: "What are his top skills?",
    });
    fireEvent.click(chip);

    expect(await screen.findByText("Here's the answer.")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Which projects has he led?" }),
    ).not.toBeInTheDocument();
  });

  it("seeds the question and skips the welcome on home handoff", async () => {
    currentQuery = "q=Tell%20me%20about%20Rapido";
    renderWithProvider(<ChatClient {...props} />);

    expect(await screen.findByText("Tell me about Rapido")).toBeInTheDocument();
    expect(await screen.findByText("Here's the answer.")).toBeInTheDocument();
    expect(
      screen.queryByText(/I'm a chat layer over Abhilash Venkatesh's resume/),
    ).not.toBeInTheDocument();
  });

  it("shows the error fallback when generation fails", async () => {
    create.mockRejectedValue(new Error("boom"));
    renderWithProvider(<ChatClient {...props} />);
    const chip = await screen.findByRole("button", {
      name: "How can I get in touch?",
    });
    fireEvent.click(chip);

    expect(
      await screen.findByText(/Sorry, I couldn't process that/),
    ).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
  });

  it("falls back to contact links when WebGPU is unavailable", async () => {
    // @ts-expect-error remove stub to simulate unsupported browser
    delete navigator.gpu;
    renderWithProvider(<ChatClient {...props} />);
    await waitFor(() =>
      expect(
        screen.getByRole("link", { name: "test@example.com" }),
      ).toBeInTheDocument(),
    );
    expect(
      screen.queryByPlaceholderText("Ask another question…"),
    ).not.toBeInTheDocument();
  });
});
