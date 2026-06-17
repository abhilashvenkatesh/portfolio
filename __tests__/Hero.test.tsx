import { render, screen } from "@testing-library/react";
import Hero from "@/components/home/Hero";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

describe("Hero", () => {
  it("renders the role badge", () => {
    render(<Hero />);
    expect(
      screen.getByText("Lead Application Developer · Melbourne")
    ).toBeInTheDocument();
  });

  it("renders the headline as the level-1 heading", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1, name: /Hi, I'm Abhilash\./ })
    ).toBeInTheDocument();
  });

  it("renders the subheading including the accented clause", () => {
    render(<Hero />);
    expect(
      screen.getByRole("heading", { level: 1 }).textContent
    ).toContain("I architect systems that");
    expect(screen.getByText("scale to millions.")).toBeInTheDocument();
  });

  it("renders the bio paragraph", () => {
    render(<Hero />);
    expect(
      screen.getByText(/11\+ years building distributed systems/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Currently at Fabric Group, Melbourne\./)
    ).toBeInTheDocument();
  });

  it("renders all three statistics with values and labels", () => {
    render(<Hero />);
    expect(screen.getByText("11+")).toBeInTheDocument();
    expect(screen.getByText("years experience")).toBeInTheDocument();
    expect(screen.getByText("30+")).toBeInTheDocument();
    expect(screen.getByText("microservices shipped")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("countries worked in")).toBeInTheDocument();
  });

  it("marks decorative background layers as aria-hidden", () => {
    const { container } = render(<Hero />);
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it("mounts the chat launcher with chips from content", () => {
    render(<Hero />);
    expect(
      screen.getByPlaceholderText("Ask me anything about Abhilash Venkatesh…")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "What are the top skills?" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Tell me about the current role",
      })
    ).toBeInTheDocument();
  });

  it("mounts the scroll indicator", () => {
    render(<Hero />);
    expect(screen.getByText("scroll")).toBeInTheDocument();
  });
});
