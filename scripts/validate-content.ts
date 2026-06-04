import { z } from "zod";
import fs from "fs";
import path from "path";

const CONTENT = path.join(process.cwd(), "content");

const IdentitySchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  employer: z.string().min(1),
  location: z.string().min(1),
});

const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  year: z.number().int(),
  problem: z.string().min(1),
  impact: z.string().min(1),
  stack: z.array(z.string()),
  github: z.string(),
  demo: z.string().optional(),
});

const SkillCategorySchema = z.object({
  name: z.string().min(1),
  skills: z.array(z.string()),
});

const ExperienceEntrySchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  period: z.string().min(1),
  bullets: z.array(z.string()),
});

const ContactInfoSchema = z.object({
  email: z.string().email(),
  linkedin: z.string().url(),
  phone: z.string(),
  availability: z.object({
    show: z.boolean(),
    message: z.string(),
  }),
});

const HomeContentSchema = z.object({
  roleBadge: z.string().min(1),
  headline: z.string().min(1),
  subheading: z.string().min(1),
  bio: z.string().min(1),
  stats: z.array(z.object({ value: z.string(), label: z.string() })).length(3),
  suggestions: z.array(z.string()).length(4),
});

const BlogFrontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  readTime: z.number().int().positive(),
  tag: z.string().min(1),
  summary: z.string().min(1),
});

let hasErrors = false;

function validate<T>(
  file: string,
  schema: z.ZodType<T>,
  arrayAllowed = false
): void {
  const filePath = path.join(CONTENT, file);
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (arrayAllowed && Array.isArray(raw) && raw.length === 0) return;
    const result = schema.safeParse(raw);
    if (!result.success) {
      console.error(`❌ ${file}:`);
      for (const issue of result.error.issues) {
        console.error(`   ${issue.path.join(".")} — ${issue.message}`);
      }
      hasErrors = true;
    } else {
      console.log(`✓ ${file}`);
    }
  } catch (e) {
    console.error(`❌ ${file}: ${(e as Error).message}`);
    hasErrors = true;
  }
}

function validateArray<T>(file: string, schema: z.ZodType<T>): void {
  const filePath = path.join(CONTENT, file);
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (!Array.isArray(raw)) {
      console.error(`❌ ${file}: expected array`);
      hasErrors = true;
      return;
    }
    for (let i = 0; i < raw.length; i++) {
      const result = schema.safeParse(raw[i]);
      if (!result.success) {
        console.error(`❌ ${file}[${i}]:`);
        for (const issue of result.error.issues) {
          console.error(`   ${issue.path.join(".")} — ${issue.message}`);
        }
        hasErrors = true;
      }
    }
    if (!hasErrors) console.log(`✓ ${file}`);
  } catch (e) {
    console.error(`❌ ${file}: ${(e as Error).message}`);
    hasErrors = true;
  }
}

function validateBlogFrontmatter(): void {
  const blogDir = path.join(CONTENT, "blog");
  if (!fs.existsSync(blogDir)) {
    console.error("❌ content/blog/ directory missing");
    hasErrors = true;
    return;
  }
  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) {
    console.error("❌ content/blog/: no .mdx files found");
    hasErrors = true;
    return;
  }
  for (const file of files) {
    const content = fs.readFileSync(path.join(blogDir, file), "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      console.error(`❌ blog/${file}: missing frontmatter`);
      hasErrors = true;
      continue;
    }
    const lines = match[1].split("\n");
    const fm: Record<string, unknown> = {};
    for (const line of lines) {
      const colon = line.indexOf(":");
      if (colon === -1) continue;
      const key = line.slice(0, colon).trim();
      const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
      fm[key] = key === "readTime" ? Number(val) : val;
    }
    const result = BlogFrontmatterSchema.safeParse(fm);
    if (!result.success) {
      console.error(`❌ blog/${file}:`);
      for (const issue of result.error.issues) {
        console.error(`   ${issue.path.join(".")} — ${issue.message}`);
      }
      hasErrors = true;
    } else {
      console.log(`✓ blog/${file}`);
    }
  }
}

validate("identity.json", IdentitySchema);
validate("contact.json", ContactInfoSchema);
validate("home.json", HomeContentSchema);
validateArray("projects.json", ProjectSchema);
validateArray("skills.json", SkillCategorySchema);
validateArray("experience.json", ExperienceEntrySchema);
validateBlogFrontmatter();

if (hasErrors) {
  console.error("\nContent validation failed.");
  process.exit(1);
} else {
  console.log("\nAll content valid.");
}
