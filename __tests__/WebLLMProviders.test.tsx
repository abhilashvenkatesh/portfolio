import { render, screen, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ModelProvider, { useModelContext } from "@/components/providers/ModelProvider";
import ChatProvider, { useChatContext } from "@/components/chat/ChatProvider";
import ChatLoadingContent from "@/components/chat/ChatLoadingContent";
import ChatInput from "@/components/chat/ChatInput";

// ---- Helpers ----

type ProgressReport = { progress: number; text: string; timeElapsed: number };
let progressCallback: ((r: ProgressReport) => void) | undefined;

const mockEngine = {
  chat: {
    completions: {
      create: vi.fn(async () => ({
        [Symbol.asyncIterator]() {
          return {
            next: vi.fn()
              .mockResolvedValueOnce({
                done: false,
                value: { choices: [{ delta: { content: "hi" } }] },
              })
              .mockResolvedValueOnce({ done: true, value: undefined }),
          };
        },
      })),
    },
  },
};

// Deferred promise so we control when the engine "finishes loading".
let resolveEngine: ((e: typeof mockEngine) => void) | undefined;

vi.mock("@mlc-ai/web-llm", () => ({
  CreateMLCEngine: vi.fn(
    async (
      _id: string,
      opts: { initProgressCallback?: (r: ProgressReport) => void },
    ) => {
      progressCallback = opts.initProgressCallback;
      return new Promise<typeof mockEngine>((resolve) => {
        resolveEngine = resolve;
      });
    },
  ),
}));

// ---- ModelProvider tests ----

function ModelStateDisplay() {
  const { modelState, progress, progressText } = useModelContext();
  return (
    <div>
      <span data-testid="state">{modelState}</span>
      <span data-testid="progress">{progress}</span>
      <span data-testid="text">{progressText}</span>
    </div>
  );
}

describe("ModelProvider", () => {
  beforeEach(() => {
    progressCallback = undefined;
    resolveEngine = undefined;
    Object.defineProperty(navigator, "gpu", {
      value: {},
      configurable: true,
      writable: true,
    });
  });

  it("transitions idle → loading → ready and surfaces progress text", async () => {
    render(
      <ModelProvider>
        <ModelStateDisplay />
      </ModelProvider>,
    );

    // Starts idle
    expect(screen.getByTestId("state").textContent).toBe("idle");

    // Becomes loading
    await waitFor(() =>
      expect(screen.getByTestId("state").textContent).toBe("loading"),
    );

    // Fire progress callback with text
    await act(async () => {
      progressCallback?.({ progress: 0.5, text: "Loading weights 56/112", timeElapsed: 1 });
    });
    expect(screen.getByTestId("text").textContent).toBe("Loading weights 56/112");

    // Resolve engine → becomes ready
    await act(async () => {
      resolveEngine?.(mockEngine);
    });
    await waitFor(() =>
      expect(screen.getByTestId("state").textContent).toBe("ready"),
    );
  });

  it("sets unsupported when navigator.gpu is absent", async () => {
    Object.defineProperty(navigator, "gpu", {
      value: undefined,
      configurable: true,
      writable: true,
    });

    render(
      <ModelProvider>
        <ModelStateDisplay />
      </ModelProvider>,
    );

    await waitFor(() =>
      expect(screen.getByTestId("state").textContent).toBe("unsupported"),
    );
  });
});

// ---- ChatProvider type-during-load queue tests ----

function QueueHarness() {
  const { chatState, messages, pendingQueue, send } = useChatContext();
  return (
    <div>
      <span data-testid="chatState">{chatState}</span>
      <span data-testid="queued">{pendingQueue ?? ""}</span>
      <ul>
        {messages.map((m, i) => (
          <li key={i} data-testid={`msg-${i}`}>{m.text}</li>
        ))}
      </ul>
      <button onClick={() => send("hello from queue")}>send</button>
    </div>
  );
}

describe("ChatProvider — type-during-load queue", () => {
  beforeEach(() => {
    progressCallback = undefined;
    resolveEngine = undefined;
    Object.defineProperty(navigator, "gpu", {
      value: {},
      configurable: true,
      writable: true,
    });
  });

  it("queues message while model is loading and auto-sends when ready", async () => {
    render(
      <ModelProvider>
        <ChatProvider
          ownerName="Abhilash Venkatesh"
          systemPrompt="SYSTEM"
          errorEmail="test@example.com"
          initialMessages={[{ role: "assistant", text: "Hey!" }]}
        >
          <QueueHarness />
        </ChatProvider>
      </ModelProvider>,
    );

    // Wait for loading state (engine deferred, hasn't resolved yet)
    await waitFor(() =>
      expect(screen.getByTestId("chatState").textContent).toBe("loading"),
    );

    // Send while loading — should queue
    await act(async () => {
      screen.getByRole("button", { name: "send" }).click();
    });

    expect(screen.getByTestId("queued").textContent).toBe("hello from queue");

    // Resolve engine → ready → queue flushes
    await act(async () => {
      resolveEngine?.(mockEngine);
    });

    await waitFor(() =>
      expect(screen.getByTestId("queued").textContent).toBe(""),
    );
  });
});

// ---- ChatLoadingContent tests ----

describe("ChatLoadingContent", () => {
  const content = {
    currentRole: "Lead engineer at Fabric Group",
    latestProject: "LedgerStream — Event-sourced ledger",
    topSkills: "Java, Node.js, TypeScript, JavaScript",
  };

  it("renders all three content cards", () => {
    render(<ChatLoadingContent content={content} />);
    expect(screen.getByText(content.currentRole)).toBeInTheDocument();
    expect(screen.getByText(content.latestProject)).toBeInTheDocument();
    expect(screen.getByText(content.topSkills)).toBeInTheDocument();
  });

  it("renders the loading header", () => {
    render(<ChatLoadingContent content={content} />);
    expect(
      screen.getByText(/while the model loads/i),
    ).toBeInTheDocument();
  });
});

// ---- ChatInput queue-mode tests ----

describe("ChatInput — queue mode", () => {
  it("is enabled when modelLoading and no message queued", () => {
    render(
      <ChatInput
        modelLoading={true}
        thinking={false}
        queued={false}
        onSend={() => {}}
      />,
    );
    const input = screen.getByRole("textbox");
    expect(input).not.toBeDisabled();
  });

  it("is disabled when a message is already queued", () => {
    render(
      <ChatInput
        modelLoading={true}
        thinking={false}
        queued={true}
        onSend={() => {}}
      />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("shows queued placeholder when message is queued", () => {
    render(
      <ChatInput
        modelLoading={true}
        thinking={false}
        queued={true}
        onSend={() => {}}
      />,
    );
    expect(
      screen.getByPlaceholderText("Message queued — waiting for model…"),
    ).toBeInTheDocument();
  });

  it("shows loading placeholder when model loading with no queue", () => {
    render(
      <ChatInput
        modelLoading={true}
        thinking={false}
        queued={false}
        onSend={() => {}}
      />,
    );
    expect(
      screen.getByPlaceholderText("Ask a question (will send when model is ready)…"),
    ).toBeInTheDocument();
  });
});
