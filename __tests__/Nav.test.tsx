import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("Nav mobile drawer", () => {
  it("renders a hamburger trigger with expanded state wiring", () => {
    renderNav();
    const trigger = screen.getByRole("button", { name: /menu/i });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveAttribute("aria-controls");
  });

  it("collapses the desktop links behind the sm breakpoint", () => {
    renderNav();
    const projects = screen.getByRole("link", { name: "Projects" });
    const linkContainer = projects.parentElement as HTMLElement;
    expect(linkContainer.className).toContain("sm:flex");
    expect(linkContainer.className).toContain("hidden");
  });

  it("opens the drawer when the hamburger is activated", async () => {
    const user = userEvent.setup();
    renderNav();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    const trigger = screen.getByRole("button", { name: /menu/i });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(within(dialog).getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });
});
