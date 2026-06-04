import { render, screen } from "@testing-library/react";
import Footer from "@/components/layout/Footer";

describe("Footer", () => {
  const props = {
    email: "abhilashfeb30@gmail.com",
    linkedin: "https://linkedin.com/in/abhilash-venkatesh",
  };

  it("renders email link with mailto href", () => {
    render(<Footer {...props} />);
    const emailLink = screen.getByRole("link", { name: /email/i });
    expect(emailLink.getAttribute("href")).toContain("mailto:abhilashfeb30@gmail.com");
  });

  it("renders LinkedIn link", () => {
    render(<Footer {...props} />);
    const linkedinLink = screen.getByRole("link", { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute("href", props.linkedin);
  });

  it("renders GitHub link", () => {
    render(<Footer {...props} />);
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
  });

  it("renders copyright text", () => {
    render(<Footer {...props} />);
    expect(screen.getByText(/© 2025 Abhilash/)).toBeInTheDocument();
  });
});
