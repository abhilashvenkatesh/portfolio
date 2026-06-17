import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// ContactCard is a Server Component — render directly (no async, no RSC wrapper needed)
import ContactCard from "@/components/contact/ContactCard";
import AvailabilityBanner from "@/components/contact/AvailabilityBanner";

// Mock FadeIn so animations don't interfere
vi.mock("@/components/ui/FadeIn", () => ({
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock getContactInfo for page-level smoke test
vi.mock("@/lib/content", () => ({
  getContactInfo: () => ({
    email: "test@example.com",
    linkedin: "https://linkedin.com/in/test",
    github: "https://github.com/test",
    phone: "+61 400 000 000",
    availability: {
      show: true,
      message: "Currently available — open to full-time and contract roles starting immediately.",
    },
  }),
}));

// Page import after mocks
import ContactPage from "@/app/contact/page";

// ----------------------------------------------------------------
// ContactCard
// ----------------------------------------------------------------

const emailIcon = (
  <svg aria-label="email icon" />
);

describe("ContactCard", () => {
  it("renders the channel label in uppercase monospace", () => {
    render(
      <ContactCard
        label="Email"
        value="test@example.com"
        href="mailto:test@example.com"
        description="Best for work enquiries"
        icon={emailIcon}
      />
    );
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
  });

  it("renders the contact value", () => {
    render(
      <ContactCard
        label="Email"
        value="test@example.com"
        href="mailto:test@example.com"
        description="Best for work enquiries"
        icon={emailIcon}
      />
    );
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });

  it("renders the channel description", () => {
    render(
      <ContactCard
        label="Email"
        value="test@example.com"
        href="mailto:test@example.com"
        description="Best for work enquiries"
        icon={emailIcon}
      />
    );
    expect(screen.getByText("Best for work enquiries")).toBeInTheDocument();
  });

  it("wraps the card in an anchor with the correct href", () => {
    render(
      <ContactCard
        label="Email"
        value="test@example.com"
        href="mailto:test@example.com"
        description="Best for work enquiries"
        icon={emailIcon}
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "mailto:test@example.com");
  });

  it("LinkedIn card opens in new tab", () => {
    render(
      <ContactCard
        label="LinkedIn"
        value="linkedin.com/in/test"
        href="https://linkedin.com/in/test"
        description="Professional history"
        icon={<svg aria-label="linkedin icon" />}
        newTab
      />
    );
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });
});

// ----------------------------------------------------------------
// AvailabilityBanner
// ----------------------------------------------------------------

describe("AvailabilityBanner", () => {
  it("renders the message when show is true", () => {
    render(
      <AvailabilityBanner
        show={true}
        message="Currently available — open to full-time and contract roles starting immediately."
      />
    );
    expect(
      screen.getByText(
        "Currently available — open to full-time and contract roles starting immediately."
      )
    ).toBeInTheDocument();
  });

  it("renders nothing when show is false", () => {
    const { container } = render(
      <AvailabilityBanner show={false} message="some message" />
    );
    expect(container.firstChild).toBeNull();
  });
});

// ----------------------------------------------------------------
// ContactPage — smoke test
// ----------------------------------------------------------------

async function renderPage() {
  const ui = await ContactPage();
  render(ui);
}

describe("ContactPage", () => {
  it("renders page header label", async () => {
    await renderPage();
    expect(screen.getByText("Get in touch")).toBeInTheDocument();
  });

  it("renders opening statement", async () => {
    await renderPage();
    expect(
      screen.getByText(/I'm currently open to full-time roles/)
    ).toBeInTheDocument();
  });

  it("renders all three channel labels", async () => {
    await renderPage();
    expect(screen.getByText("EMAIL")).toBeInTheDocument();
    expect(screen.getByText("LINKEDIN")).toBeInTheDocument();
    expect(screen.getByText("PHONE")).toBeInTheDocument();
  });

  it("renders availability banner", async () => {
    await renderPage();
    expect(
      screen.getByText(
        "Currently available — open to full-time and contract roles starting immediately."
      )
    ).toBeInTheDocument();
  });
});
