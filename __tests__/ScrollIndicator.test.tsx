import { render, screen } from "@testing-library/react";
import ScrollIndicator from "@/components/home/ScrollIndicator";

describe("ScrollIndicator", () => {
  it("renders the scroll label", () => {
    render(<ScrollIndicator />);
    expect(screen.getByText("scroll")).toBeInTheDocument();
  });

  it("is decorative — marked aria-hidden", () => {
    const { container } = render(<ScrollIndicator />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute("aria-hidden", "true");
  });

  it("animates the indicator dot with the scroll-dot animation", () => {
    const { container } = render(<ScrollIndicator />);
    expect(container.querySelector(".animate-scroll-dot")).not.toBeNull();
  });
});
