---
linear_story_id: "<optional Linear issue id>"
linear_story_url: "<optional Linear issue URL>"
sdd_experiment:
  method: "sdd"  # sdd | human | vibe — which approach drove this change
  comparator: "<human / vibe-coding / none>"
  accepted_at: null  # ISO date (YYYY-MM-DD) set at archive time when retrospective is complete
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
