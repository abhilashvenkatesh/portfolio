import fs from "fs";
import path from "path";

const DESIGN_MD = path.join(process.cwd(), "documentation", "DESIGN.md");

const ALLOWED_HEX = new Set([
  // Light palette
  "#0c0a09",
  "#78716c",
  "#c0612b",
  "#f5f0e8",
  "#fdfaf4",
  "#ede8de",
  "#efdfd1",
  // Dark palette
  "#f0f0f2",
  "#6b6b72",
  "#080809",
  "#0f0f11",
  "#161618",
  // Design-system extras documented in DESIGN.md
  "#8b4320", // tertiary-on-light
  "#e8e8ea", // dark mode text (documentation reference)
  // Prototype scheme backgrounds (non-production, documented only)
  "#0c0c0e",
  "#0d1210",
  "#100c0e",
  // Neutrals
  "#ffffff",
  "#000000",
  "#fff",
  "#000",
]);

const ALLOWED_FONT_WEIGHTS = new Set([300, 400, 500, 600]);

const ALLOWED_RADIUS_VALUES = new Set([
  "4px",
  "6px",
  "8px",
  "10px",
  "12px",
  "14px",
  "100px",
  "0",
]);

let hasErrors = false;

function err(msg: string): void {
  console.error(`❌ ${msg}`);
  hasErrors = true;
}

const content = fs.readFileSync(DESIGN_MD, "utf8");
const lines = content.split("\n");

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const lineNum = i + 1;

  const hexMatches = line.match(/#[0-9a-fA-F]{3,8}\b/g);
  if (hexMatches) {
    for (const hex of hexMatches) {
      const normalized = hex.toLowerCase();
      if (!ALLOWED_HEX.has(normalized)) {
        err(`Line ${lineNum}: disallowed hex colour '${hex}' — use a design token`);
      }
    }
  }

  const weightMatches = line.match(/font-weight:\s*(\d+)/g);
  if (weightMatches) {
    for (const match of weightMatches) {
      const weight = parseInt(match.replace(/font-weight:\s*/, ""), 10);
      if (!ALLOWED_FONT_WEIGHTS.has(weight)) {
        err(`Line ${lineNum}: disallowed font-weight ${weight} — max 600`);
      }
    }
  }

  const radiusMatches = line.match(/border-radius:\s*([\w.]+)/g);
  if (radiusMatches) {
    for (const match of radiusMatches) {
      const val = match.replace(/border-radius:\s*/, "").trim();
      if (!ALLOWED_RADIUS_VALUES.has(val)) {
        err(`Line ${lineNum}: arbitrary border-radius '${val}' — use a radius token`);
      }
    }
  }
}

if (hasErrors) {
  console.error("\nDesign lint failed.");
  process.exit(1);
} else {
  console.log("Design lint passed.");
}
