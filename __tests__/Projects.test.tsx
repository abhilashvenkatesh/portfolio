import { render, screen } from "@testing-library/react";
import ProjectsPage from "@/app/projects/page";
import { getProjects, projectSlug } from "@/lib/content";

describe("ProjectsPage (listing bridge)", () => {
  it("renders the page header label and subtitle", () => {
    render(<ProjectsPage />);
    expect(screen.getByText("Projects")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Things I've built" })
    ).toBeInTheDocument();
  });

  it("renders a card per project linking to its detail page", () => {
    render(<ProjectsPage />);
    const projects = getProjects();
    expect(projects.length).toBeGreaterThan(0);
    for (const project of projects) {
      const heading = screen.getByRole("heading", { level: 2, name: project.name });
      expect(heading).toBeInTheDocument();
      expect(screen.getByText(project.tagline)).toBeInTheDocument();
      const link = heading.closest("a");
      expect(link).toHaveAttribute("href", `/projects/${projectSlug(project.id)}`);
    }
  });

  it("shows a demo link only for projects that define a demo", () => {
    render(<ProjectsPage />);
    for (const project of getProjects()) {
      const demoLink = screen.queryByLabelText(`${project.name} live demo`);
      if (project.demo) {
        expect(demoLink).toHaveAttribute("href", project.demo);
      } else {
        expect(demoLink).toBeNull();
      }
    }
  });

  it("shows a GitHub link for every project", () => {
    render(<ProjectsPage />);
    for (const project of getProjects()) {
      expect(
        screen.getByLabelText(`${project.name} on GitHub`)
      ).toHaveAttribute("href", project.github);
    }
  });
});
