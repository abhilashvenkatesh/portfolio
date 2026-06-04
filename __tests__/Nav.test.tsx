import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Nav from "@/components/layout/Nav";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

function renderNav(email = "abhilashfeb30@gmail.com") {
  return render(
    <ThemeProvider>
      <Nav email={email} />
    </ThemeProvider>
  );
}

describe("Nav", () => {
  it("renders the wordmark as a home link", () => {
    renderNav();
    const wordmark = screen.getByRole("link", { name: /abhilash/i });
    expect(wordmark).toHaveAttribute("href", "/");
  });

  it("renders all 6 page links", () => {
    renderNav();
    const labels = ["Projects", "About", "Experience", "Blog", "Chat", "Contact"];
    for (const label of labels) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("renders the Hire me button with mailto href", () => {
    renderNav();
    const hireMe = screen.getByRole("link", { name: /hire me/i });
    expect(hireMe.getAttribute("href")).toContain("mailto:");
    expect(hireMe.getAttribute("href")).toContain("abhilashfeb30@gmail.com");
  });

  it("renders the theme toggle button", () => {
    renderNav();
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });
});
