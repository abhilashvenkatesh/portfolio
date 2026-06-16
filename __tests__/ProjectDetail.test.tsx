import { render, screen } from "@testing-library/react";
import ProjectDetailPage from "@/app/projects/[slug]/page";
import { getProjectBySlug, getProjectBody } from "@/lib/content";

// A project without an MDX body, so the async component renders without MDXRemote.
const SLUG = "pulse-cli";

async function renderDetail(slug: string) {
  const ui = await ProjectDetailPage({ params: Promise.resolve({ slug }) });
  render(ui);
}

describe("ProjectDetailPage", () => {
  it("renders the structured case-study sections from content", async () => {
    const project = getProjectBySlug(SLUG)!;
    expect(project).toBeDefined();
    await renderDetail(SLUG);

    expect(
      screen.getByRole("heading", { level: 1, name: project.name })
    ).toBeInTheDocument();
    expect(screen.getByText(project.tagline)).toBeInTheDocument();
    expect(screen.getByText(project.problem)).toBeInTheDocument();
    expect(screen.getByText(project.impact)).toBeInTheDocument();
    for (const tech of project.stack) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });

  it("renders optional role and timeline when present", async () => {
    const project = getProjectBySlug(SLUG)!;
    await renderDetail(SLUG);
    if (project.role) expect(screen.getByText(project.role)).toBeInTheDocument();
    if (project.timeline)
      expect(screen.getByText(project.timeline)).toBeInTheDocument();
  });

  it("provides a back link to the projects listing", async () => {
    await renderDetail(SLUG);
    const back = screen.getByRole("link", { name: /projects/i });
    expect(back).toHaveAttribute("href", "/projects");
  });

  it("omits the live demo link when the project has no demo", async () => {
    expect(getProjectBySlug(SLUG)!.demo).toBeUndefined();
    await renderDetail(SLUG);
    expect(screen.queryByText("Live demo")).toBeNull();
  });

  it("renders structured sections even with no MDX body", async () => {
    expect(getProjectBody(SLUG)).toBeNull();
    await renderDetail(SLUG);
    expect(screen.getByText("Tech stack")).toBeInTheDocument();
  });
});
