import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatLauncher from "@/components/home/ChatLauncher";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const SUGGESTIONS = [
  "What are Abhilash's top skills?",
  "Tell me about his role at Fabric Group",
  "Which projects has he led?",
  "How can I get in touch?",
];

describe("ChatLauncher", () => {
  beforeEach(() => push.mockClear());

  it("renders the input with its placeholder", () => {
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    expect(
      screen.getByPlaceholderText("Ask me anything about Abhilash…")
    ).toBeInTheDocument();
  });

  it("navigates to the encoded chat URL when the question is submitted with Enter", async () => {
    const user = userEvent.setup();
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    await user.type(
      screen.getByPlaceholderText("Ask me anything about Abhilash…"),
      "Who is Abhilash?{Enter}"
    );
    expect(push).toHaveBeenCalledWith("/chat?q=Who%20is%20Abhilash%3F");
  });

  it("navigates when the send button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    await user.type(
      screen.getByPlaceholderText("Ask me anything about Abhilash…"),
      "Hello"
    );
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(push).toHaveBeenCalledWith("/chat?q=Hello");
  });

  it("does not navigate when the input is empty or whitespace", async () => {
    const user = userEvent.setup();
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    await user.type(
      screen.getByPlaceholderText("Ask me anything about Abhilash…"),
      "   {Enter}"
    );
    await user.click(screen.getByRole("button", { name: /send/i }));
    expect(push).not.toHaveBeenCalled();
  });

  it("renders all four suggestion chips and navigates on click", async () => {
    const user = userEvent.setup();
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    for (const s of SUGGESTIONS) {
      expect(screen.getByRole("button", { name: s })).toBeInTheDocument();
    }
    await user.click(
      screen.getByRole("button", { name: "Which projects has he led?" })
    );
    expect(push).toHaveBeenCalledWith(
      "/chat?q=Which%20projects%20has%20he%20led%3F"
    );
  });

  it("renders accent browse links to the section pages", () => {
    render(<ChatLauncher suggestions={SUGGESTIONS} />);
    expect(screen.getByRole("link", { name: "projects" })).toHaveAttribute(
      "href",
      "/projects"
    );
    expect(screen.getByRole("link", { name: "experience" })).toHaveAttribute(
      "href",
      "/experience"
    );
    expect(screen.getByRole("link", { name: "contact" })).toHaveAttribute(
      "href",
      "/contact"
    );
  });
});
