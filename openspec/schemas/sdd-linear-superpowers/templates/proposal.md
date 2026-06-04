---
linear_story_id: "<optional Linear issue id>"
linear_story_url: "<optional Linear issue URL>"
# --- metrics (collected per change, proposal -> archive; flat keys, parsed by scripts/collect-metrics.sh) ---
method: "sdd"          # sdd | human | vibe — label for your own analysis; not an experiment arm
started_at: null       # ISO8601, set at propose (e.g. 2026-06-04T09:00:00Z)
finished_at: null      # ISO8601, set at archive
session_ids: []        # Claude Code session ids for token attribution, inline list e.g. ["abc-123","def-456"]
---

## Why

<!-- Explain the motivation for this change. What problem does this solve? Why now? -->

## What Changes

<!-- Describe what will change. Be specific about new capabilities, modifications, or removals.
     Mark breaking changes with **BREAKING**. -->

## Capabilities

### New Capabilities

<!-- Capabilities being introduced. Replace <name> with kebab-case identifier
     (e.g., user-auth, data-export, api-rate-limiting).
     Each creates specs/<name>/spec.md with OpenSpec delta headers and Gherkin-style scenarios. -->

- `<name>`: <brief description of what this capability covers>

### Modified Capabilities

<!-- Existing capabilities whose behaviour is changing (not just implementation).
     Only list here if spec-level behaviour changes. Each needs a delta spec.md file.
     Use existing spec names from openspec/specs/. Leave empty if no requirement changes. -->

- `<existing-name>`: <what behaviour is changing>

## Impact

<!-- Affected code, APIs, dependencies, systems -->
