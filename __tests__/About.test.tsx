import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";
import { getAboutBio, getSkills } from "@/lib/content";

describe("AboutPage", () => {
  it("renders the page header label and subtitle", () => {
    render(<AboutPage />);
    expect(screen.getByText("About me")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "11+ years building systems across 3 countries and 4 industries.",
      })
    ).toBeInTheDocument();
  });

  it("renders all three bio paragraphs from content", () => {
    render(<AboutPage />);
    const bio = getAboutBio();
    expect(bio).toHaveLength(3);
    for (const paragraph of bio) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
  });

  it("mentions the notable employers", () => {
    render(<AboutPage />);
    for (const employer of [
      "ThoughtWorks",
      "Rapido",
      "Australia Post",
      "Fabric Group",
    ]) {
      expect(
        screen.getByText(new RegExp(employer))
      ).toBeInTheDocument();
    }
  });

  it("renders the photo placeholder", () => {
    render(<AboutPage />);
    expect(screen.getByText("photo")).toBeInTheDocument();
  });

  it("links the résumé CTA to the PDF with a download attribute", () => {
    render(<AboutPage />);
    const resume = screen.getByText("Download résumé").closest("a");
    expect(resume).toHaveAttribute("href", "/resume.pdf");
    expect(resume).toHaveAttribute("download");
  });

  it("links the Blog CTA to the blog page", () => {
    render(<AboutPage />);
    const blog = screen.getByText("Blog →").closest("a");
    expect(blog).toHaveAttribute("href", "/blog");
  });

  it("renders the skills section heading", () => {
    render(<AboutPage />);
    expect(screen.getByText("What I work with")).toBeInTheDocument();
  });

  it("renders the four skill category labels", () => {
    render(<AboutPage />);
    for (const category of [
      "Languages",
      "Frameworks",
      "Data & Messaging",
      "Cloud & DevOps",
    ]) {
      expect(screen.getByText(category)).toBeInTheDocument();
    }
  });

  it("renders every category name and skill from content", () => {
    render(<AboutPage />);
    const skills = getSkills();
    expect(skills.length).toBeGreaterThan(0);
    for (const category of skills) {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      for (const skill of category.skills) {
        expect(screen.getAllByText(skill).length).toBeGreaterThan(0);
      }
    }
  });
});
