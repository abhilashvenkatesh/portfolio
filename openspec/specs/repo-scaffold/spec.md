# Capability: repo-scaffold

## Purpose

Establishes the runnable Next.js App Router project foundation: dependency set, TypeScript configuration, Tailwind v4 design tokens, content validation, and CI/CD pipeline.

## Requirements

### Requirement: Repository SHALL be a runnable Next.js App Router project with full dependency set

The repository SHALL be a runnable Next.js 15 App Router project with TypeScript, Tailwind CSS v4, and all portfolio-specific dependencies installed before any feature card is played.

#### Scenario: Fresh clone produces a working dev server

GIVEN the repository has been cloned from GitHub with no prior `npm install`
WHEN the developer runs `npm install && npm run dev`
THEN the Next.js dev server starts without errors
AND the root route responds with HTTP 200

#### Scenario: All required packages are declared

GIVEN `package.json` exists at the repo root
WHEN inspected
THEN it declares `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `gray-matter`, `next-mdx-remote`, `@mlc-ai/web-llm`, `zod`, and `tsx` as dependencies or devDependencies

---

### Requirement: TypeScript MUST be configured with strict mode for Next.js App Router

TypeScript MUST be configured with strict mode and paths that match the Next.js App Router conventions.

#### Scenario: Type-checking passes on a clean project

GIVEN `tsconfig.json` is present with strict mode enabled
WHEN `npm run typecheck` is run on the scaffold
THEN the command exits with code 0 and no type errors are reported

---

### Requirement: Tailwind CSS v4 SHALL declare all design tokens in the @theme block

The Tailwind v4 `@theme` block in `styles/globals.css` SHALL declare all CSS custom properties for the light (Sand) palette and dark overrides as specified in DESIGN.md.

#### Scenario: Design tokens are available as CSS variables

GIVEN `styles/globals.css` contains the `@theme` block
WHEN the application is built
THEN CSS custom properties `--color-primary`, `--color-secondary`, `--color-accent`, `--color-neutral`, `--color-surface`, `--color-surface-alt`, `--color-accent-dim` are present in the output stylesheet for the default (light) theme

#### Scenario: Dark mode overrides activate on data-theme attribute

GIVEN the `[data-theme="dark"]` selector block is present in `styles/globals.css`
WHEN the `<html>` element has `data-theme="dark"` set
THEN all colour CSS custom properties resolve to their dark-palette values

---

### Requirement: Content validation script MUST block CI on schema violations

The content validation script MUST exit non-zero when any required field is missing or mistyped in a content JSON file, preventing a broken deploy.

#### Scenario: Valid content files pass validation

GIVEN all content JSON files conform to the TypeScript interfaces in `lib/types.ts`
WHEN `npm run validate-content` is run
THEN the script exits with code 0

#### Scenario: Missing required field fails validation

GIVEN `content/identity.json` is missing the `name` field
WHEN `npm run validate-content` is run
THEN the script exits with a non-zero code
AND prints a message identifying the missing field

---

### Requirement: GitHub Actions CI pipeline SHALL gate all merges to main

A CI workflow SHALL run `typecheck → lint → design-lint → validate-content → build` on every push and pull request. If any step fails, the merge is blocked.

#### Scenario: All gates pass on a clean branch

GIVEN all source files type-check, lint cleanly, pass design lint, pass content validation, and build successfully
WHEN a push or pull request event triggers the CI workflow
THEN all steps complete with exit code 0 and the workflow reports success

#### Scenario: Type error blocks CI

GIVEN a TypeScript type error exists in the source
WHEN the CI workflow runs
THEN the `typecheck` step fails with a non-zero exit code
AND subsequent steps do not run

---

### Requirement: Vercel MUST auto-deploy main to production and generate preview URLs for PRs

Vercel MUST auto-deploy every merge to `main` to production, and MUST generate a unique preview URL for every pull request.

#### Scenario: Push to main produces production deployment

GIVEN the Vercel project is linked to the GitHub repository
WHEN a commit is pushed to the `main` branch
THEN Vercel triggers a build and, on success, updates the production URL

#### Scenario: Pull request generates preview URL

GIVEN the Vercel project is linked to the GitHub repository
WHEN a pull request is opened
THEN Vercel builds the branch and posts a unique preview URL to the PR
