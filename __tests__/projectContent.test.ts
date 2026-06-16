import { projectSlug, getProjectBySlug, getProjectBody } from "@/lib/content";

describe("project content helpers", () => {
  it("derives a URL-safe slug from an id", () => {
    expect(projectSlug("ledger-stream")).toBe("ledger-stream");
    expect(projectSlug("Pulse CLI")).toBe("pulse-cli");
    expect(projectSlug("My__Cool!!Project")).toBe("my-cool-project");
  });

  it("looks up a project by its derived slug", () => {
    const project = getProjectBySlug("ledger-stream");
    expect(project?.id).toBe("ledger-stream");
  });

  it("returns undefined for an unknown slug", () => {
    expect(getProjectBySlug("does-not-exist")).toBeUndefined();
  });

  it("returns the MDX body string when a file exists, null otherwise", () => {
    expect(typeof getProjectBody("ledger-stream")).toBe("string");
    expect(getProjectBody("pulse-cli")).toBeNull();
  });
});
