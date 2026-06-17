import { describe, it, expect } from "vitest";
import { buildChatContext } from "@/lib/chat-context";

const sample = {
  identity: {
    name: "Abhilash Venkatesh",
    title: "Lead Application Developer",
    employer: "Rapido",
    location: "Melbourne, Australia",
  },
  experience: [
    {
      title: "Lead Application Developer",
      company: "Rapido",
      period: "2022 — Present",
      bullets: ["Led the payments platform rewrite", "Scaled to 1M rides/day"],
    },
  ],
  projects: [
    {
      id: "ledger",
      name: "Ledger",
      tagline: "Double-entry accounting engine",
      year: 2023,
      problem: "Manual reconciliation was slow",
      impact: "Cut close time by 80%",
      stack: ["Go", "Postgres"],
      github: "https://github.com/x/ledger",
    },
  ],
  skills: [{ name: "Cloud", skills: ["AWS", "GCP"] }],
  contact: {
    email: "abhilashfeb30@gmail.com",
    linkedin: "https://linkedin.com/in/abhilash-venkatesh",
    github: "https://github.com/abhilash-venkatesh",
    phone: "+61 484 192 055",
    availability: { show: true, message: "Available" },
  },
};

describe("buildChatContext", () => {
  it("includes identity, experience, projects, skills, and contact details", () => {
    const ctx = buildChatContext(sample);
    expect(ctx).toContain("Abhilash Venkatesh");
    expect(ctx).toContain("Lead Application Developer");
    expect(ctx).toContain("Rapido");
    expect(ctx).toContain("Led the payments platform rewrite");
    expect(ctx).toContain("Ledger");
    expect(ctx).toContain("Cut close time by 80%");
    expect(ctx).toContain("AWS");
    expect(ctx).toContain("abhilashfeb30@gmail.com");
  });

  it("instructs the model to answer only from CV data in the third person", () => {
    const ctx = buildChatContext(sample).toLowerCase();
    expect(ctx).toContain("third person");
    expect(ctx).toMatch(/only/);
    expect(ctx).toContain("abhilash");
  });
});
