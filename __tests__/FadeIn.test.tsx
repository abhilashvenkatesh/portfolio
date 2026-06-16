import { render, screen } from "@testing-library/react";
import FadeIn from "@/components/ui/FadeIn";

describe("FadeIn", () => {
  it("renders its children", () => {
    render(
      <FadeIn>
        <p>revealed content</p>
      </FadeIn>
    );
    expect(screen.getByText("revealed content")).toBeInTheDocument();
  });

  it("applies the stagger delay as an inline transition delay", () => {
    render(
      <FadeIn delay={100}>
        <span>delayed</span>
      </FadeIn>
    );
    const wrapper = screen.getByText("delayed").parentElement;
    expect(wrapper).toHaveStyle({ transitionDelay: "100ms" });
  });
});
