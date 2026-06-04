import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import MobileDrawer from "@/components/layout/MobileDrawer";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/blog", label: "Blog" },
  { href: "/chat", label: "Chat" },
  { href: "/contact", label: "Contact" },
];

function renderDrawer(props: Partial<React.ComponentProps<typeof MobileDrawer>> = {}) {
  const onClose = vi.fn();
  const toggleTheme = vi.fn();
  const utils = render(
    <MobileDrawer
      open
      onClose={onClose}
      links={LINKS}
      email="abhilashfeb30@gmail.com"
      theme="light"
      toggleTheme={toggleTheme}
      {...props}
    />
  );
  return { onClose, toggleTheme, ...utils };
}

describe("MobileDrawer", () => {
  it("renders nothing when closed", () => {
    render(
      <MobileDrawer
        open={false}
        onClose={() => {}}
        links={LINKS}
        email="abhilashfeb30@gmail.com"
        theme="light"
        toggleTheme={() => {}}
      />
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders all six links, Hire me, and theme toggle when open", () => {
    renderDrawer();
    const dialog = screen.getByRole("dialog");
    for (const { label } of LINKS) {
      expect(within(dialog).getByRole("link", { name: label })).toBeInTheDocument();
    }
    const hireMe = within(dialog).getByRole("link", { name: /hire me/i });
    expect(hireMe.getAttribute("href")).toContain("mailto:");
    expect(hireMe.getAttribute("href")).toContain("abhilashfeb30@gmail.com");
    expect(within(dialog).getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("exposes an accessible dialog", () => {
    renderDrawer();
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName();
  });

  it("calls onClose when Escape is pressed", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDrawer();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDrawer();
    await user.click(screen.getByTestId("drawer-backdrop"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when a link is selected", async () => {
    const user = userEvent.setup();
    const { onClose } = renderDrawer();
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("link", { name: "About" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("invokes toggleTheme from inside the drawer", async () => {
    const user = userEvent.setup();
    const { toggleTheme } = renderDrawer();
    const dialog = screen.getByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /toggle theme/i }));
    expect(toggleTheme).toHaveBeenCalled();
  });
});
