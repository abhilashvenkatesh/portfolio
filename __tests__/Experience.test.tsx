import { render, screen } from "@testing-library/react";
import ExperiencePage from "@/app/experience/page";
import { getExperience } from "@/lib/content";

describe("ExperiencePage", () => {
  it("renders the page header label and subtitle", () => {
    render(<ExperiencePage />);
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Where I've worked" })
    ).toBeInTheDocument();
  });

  it("renders every role's title, company, and period from content", () => {
    render(<ExperiencePage />);
    const experience = getExperience();
    expect(experience.length).toBeGreaterThan(0);
    for (const role of experience) {
      expect(
        screen.getByRole("heading", { level: 3, name: role.title })
      ).toBeInTheDocument();
      expect(screen.getByText(role.company)).toBeInTheDocument();
      expect(screen.getByText(role.period)).toBeInTheDocument();
    }
  });

  it("renders every bullet from content", () => {
    render(<ExperiencePage />);
    for (const role of getExperience()) {
      for (const bullet of role.bullets) {
        expect(screen.getByText(bullet)).toBeInTheDocument();
      }
    }
  });

  it("orders entries most-recent-first matching the content file", () => {
    render(<ExperiencePage />);
    const experience = getExperience();
    const headings = screen
      .getAllByRole("heading", { level: 3 })
      .map((h) => h.textContent);
    expect(headings).toEqual(experience.map((r) => r.title));
  });

  it("distinguishes the most-recent role's marker with an accent ring", () => {
    render(<ExperiencePage />);
    const firstTitle = getExperience()[0].title;
    const entry = screen
      .getByRole("heading", { level: 3, name: firstTitle })
      .closest("div.relative") as HTMLElement;
    const dot = entry.querySelector("div[aria-hidden='true']");
    expect(dot?.className).toContain("bg-accent");
    expect(dot?.className).toContain("ring-accent-dim");
  });

  it("shows the bottom CTA card", () => {
    render(<ExperiencePage />);
    expect(screen.getByText("Want the full picture?")).toBeInTheDocument();
  });

  it("links the résumé CTA to the PDF with a download attribute", () => {
    render(<ExperiencePage />);
    const resume = screen.getByText("Download résumé").closest("a");
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download");
  });
});
