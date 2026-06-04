#!/usr/bin/env bash
#
# collect-metrics.sh — deterministic per-change metrics for the SDD workflow.
#
# Reads a change folder (proposal → archive) plus its Claude Code session logs
# and emits openspec/changes/<change>/metrics.json. No number is invented:
# every value comes from git, the change artifacts, openspec validate, or the
# session JSONL token logs.
#
# Usage:
#   scripts/collect-metrics.sh <change-name> [base-ref]
#
#   <change-name>  folder under openspec/changes/ (or openspec/changes/archive/<dir>)
#   [base-ref]     optional base for the diff range (default: merge-base with main)
#
# Token attribution requires session_ids in the proposal frontmatter (approach B:
# one change = one or more dedicated Claude sessions). Missing ids → tokens are
# reported as attribution:"none" rather than guessed.
#
# Pricing (per-token, Opus 4.x defaults) is overridable via env:
#   RATE_INPUT RATE_OUTPUT RATE_CACHE_READ RATE_CACHE_WRITE_5M RATE_CACHE_WRITE_1H
set -euo pipefail

CHANGE="${1:?usage: collect-metrics.sh <change-name> [base-ref]}"
BASE_REF="${2:-}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# --- locate change folder (active or archived) ---
if [ -d "openspec/changes/$CHANGE" ]; then
  CHANGE_DIR="openspec/changes/$CHANGE"
elif [ -d "openspec/changes/archive/$CHANGE" ]; then
  CHANGE_DIR="openspec/changes/archive/$CHANGE"
else
  echo "error: change folder not found: openspec/changes/$CHANGE" >&2
  exit 1
fi
PROPOSAL="$CHANGE_DIR/proposal.md"
[ -f "$PROPOSAL" ] || { echo "error: $PROPOSAL missing" >&2; exit 1; }

# --- session log directory (sanitized cwd) ---
SESSION_DIR="$HOME/.claude/projects/$(echo "$REPO_ROOT" | sed 's#/#-#g')"

# --- pricing (per token) ---
RATE_INPUT="${RATE_INPUT:-0.000015}"
RATE_OUTPUT="${RATE_OUTPUT:-0.000075}"
RATE_CACHE_READ="${RATE_CACHE_READ:-0.0000015}"
RATE_CACHE_WRITE_5M="${RATE_CACHE_WRITE_5M:-0.00001875}"
RATE_CACHE_WRITE_1H="${RATE_CACHE_WRITE_1H:-0.00003}"

# --- frontmatter parse (flat YAML, controlled by our template) ---
read_meta() {
  python3 - "$PROPOSAL" <<'PY'
import sys, re, json
txt = open(sys.argv[1], encoding="utf-8").read()
m = re.match(r'^---\s*\n(.*?)\n---', txt, re.S)
fm = m.group(1) if m else ""
def scalar(key):
    mm = re.search(rf'^{key}:\s*(.*)$', fm, re.M)
    if not mm: return ""
    v = mm.group(1).strip()
    # Quoted value: take the quoted span (ignores any trailing inline comment).
    if v and v[0] in "\"'":
        q = v[0]
        end = v.find(q, 1)
        v = v[1:end] if end != -1 else v.strip(q)
    else:
        # Unquoted value: drop a trailing " # comment", then any stray quotes.
        v = re.sub(r'\s+#.*$', '', v).strip().strip('"').strip("'")
    return "" if v in ("null", "~", "") else v
def listval(key):
    mm = re.search(rf'^{key}:\s*\[(.*?)\]', fm, re.M)
    if not mm: return []
    return [x.strip().strip('"').strip("'") for x in mm.group(1).split(",") if x.strip()]
print(json.dumps({
    "method": scalar("method") or "unknown",
    "started_at": scalar("started_at"),
    "finished_at": scalar("finished_at"),
    "linear_story_id": scalar("linear_story_id"),
    "linear_story_url": scalar("linear_story_url"),
    "session_ids": listval("session_ids"),
}))
PY
}
META="$(read_meta)"
mval() { echo "$META" | jq -r ".$1 // empty"; }

# --- git diff range ---
# Default base = parent of the commit that first added this change's proposal.md.
# This yields the change's true footprint whether it was committed on a feature
# branch OR directly on main (where `merge-base HEAD main` collapses to HEAD).
if [ -z "$BASE_REF" ]; then
  FIRST_COMMIT="$(git log --diff-filter=A --format=%H --reverse -- "$CHANGE_DIR/proposal.md" 2>/dev/null | head -1)"
  if [ -n "$FIRST_COMMIT" ] && git rev-parse --verify --quiet "${FIRST_COMMIT}^" >/dev/null; then
    BASE_REF="${FIRST_COMMIT}^"
  else
    BASE_REF="$(git merge-base HEAD main 2>/dev/null || git merge-base HEAD origin/main 2>/dev/null || true)"
  fi
fi
COMMITS=0; ADDED=0; DELETED=0; FILES=0
if [ -n "$BASE_REF" ]; then
  COMMITS="$(git rev-list --count "$BASE_REF"..HEAD 2>/dev/null || echo 0)"
  read -r ADDED DELETED FILES < <(
    git diff --numstat "$BASE_REF"..HEAD 2>/dev/null | awk '
      { a+=$1; d+=$2; f++ } END { printf "%d %d %d\n", a+0, d+0, f+0 }'
  ) || true
fi

# --- artifact phase timestamps (first commit that added each artifact) ---
phase_ts() { git log --diff-filter=A --format=%aI -- "$CHANGE_DIR/$1" 2>/dev/null | tail -1; }

# --- scope: tasks / requirements / scenarios ---
TASKS_FILE="$CHANGE_DIR/tasks.md"
TASKS_TOTAL=0; TASKS_DONE=0
if [ -f "$TASKS_FILE" ]; then
  TASKS_TOTAL="$(grep -cE '^\s*- \[[ xX]\]' "$TASKS_FILE" || true)"
  TASKS_DONE="$(grep -cE '^\s*- \[[xX]\]' "$TASKS_FILE" || true)"
fi
REQS="$(grep -rhcE '^### Requirement:' "$CHANGE_DIR/specs" 2>/dev/null | awk '{s+=$1} END{print s+0}')"
SCENARIOS="$(grep -rhcE '^#### Scenario:' "$CHANGE_DIR/specs" 2>/dev/null | awk '{s+=$1} END{print s+0}')"

# --- quality: verify + openspec validate ---
VERIFY_FILE="$CHANGE_DIR/verify.md"
VERIFY_PRESENT=false; VERIFY_FAIL=false
[ -f "$VERIFY_FILE" ] && VERIFY_PRESENT=true
if [ -f "$VERIFY_FILE" ] && grep -q '^- \[x\] ❌ FAIL' "$VERIFY_FILE"; then VERIFY_FAIL=true; fi
VERIFY_REWRITES="$(git log --oneline -- "$VERIFY_FILE" 2>/dev/null | wc -l | tr -d ' ')"
VALIDATE="not-run"
if command -v openspec >/dev/null 2>&1; then
  if openspec validate --all --json >/dev/null 2>&1; then VALIDATE="pass"; else VALIDATE="fail"; fi
fi

# --- tokens: dedup by message.id across the change's session files ---
SESSION_IDS="$(echo "$META" | jq -r '.session_ids[]?' 2>/dev/null || true)"
TOKENS_JSON='{"attribution":"none","sessions":0}'
if [ -n "$SESSION_IDS" ]; then
  FILES_FOUND=(); MISSING=0
  while IFS= read -r sid; do
    [ -z "$sid" ] && continue
    if [ -f "$SESSION_DIR/$sid.jsonl" ]; then FILES_FOUND+=("$SESSION_DIR/$sid.jsonl"); else MISSING=$((MISSING+1)); fi
  done <<< "$SESSION_IDS"
  if [ "${#FILES_FOUND[@]}" -gt 0 ]; then
    ATTR="exact"; [ "$MISSING" -gt 0 ] && ATTR="partial"
    TOKENS_JSON="$(
      jq -s \
        --argjson ri "$RATE_INPUT" --argjson ro "$RATE_OUTPUT" --argjson rr "$RATE_CACHE_READ" \
        --argjson r5 "$RATE_CACHE_WRITE_5M" --argjson r1 "$RATE_CACHE_WRITE_1H" \
        --arg attr "$ATTR" --argjson sessions "${#FILES_FOUND[@]}" '
        map(select(.type=="assistant" and .message.usage))
        | group_by(.message.id) | map(.[0].message.usage)
        | {
            input:          (map(.input_tokens // 0)                              | add // 0),
            output:         (map(.output_tokens // 0)                             | add // 0),
            cache_read:     (map(.cache_read_input_tokens // 0)                   | add // 0),
            cache_write_5m: (map(.cache_creation.ephemeral_5m_input_tokens // 0)  | add // 0),
            cache_write_1h: (map(.cache_creation.ephemeral_1h_input_tokens // 0)  | add // 0)
          }
        | . + {
            total_tokens: (.input + .output + .cache_read + .cache_write_5m + .cache_write_1h),
            cost_usd: ((.input*$ri) + (.output*$ro) + (.cache_read*$rr) + (.cache_write_5m*$r5) + (.cache_write_1h*$r1) | .*1000000 | round / 1000000),
            attribution: $attr,
            sessions: $sessions
          }
      ' "${FILES_FOUND[@]}"
    )"
  fi
fi

# --- assemble metrics.json ---
OUT="$CHANGE_DIR/metrics.json"
jq -n \
  --arg change "$CHANGE" \
  --arg generated_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --argjson meta "$META" \
  --arg base "$BASE_REF" \
  --argjson commits "${COMMITS:-0}" \
  --argjson added "${ADDED:-0}" --argjson deleted "${DELETED:-0}" --argjson files "${FILES:-0}" \
  --arg ts_proposal "$(phase_ts proposal.md)" \
  --arg ts_specs "$(ls "$CHANGE_DIR"/specs/**/spec.md 2>/dev/null | head -1 | xargs -I{} git log --diff-filter=A --format=%aI -- {} 2>/dev/null | tail -1)" \
  --arg ts_design "$(phase_ts design.md)" \
  --arg ts_tasks "$(phase_ts tasks.md)" \
  --arg ts_verify "$(phase_ts verify.md)" \
  --arg ts_retro "$(phase_ts retrospective.md)" \
  --argjson tasks_total "${TASKS_TOTAL:-0}" --argjson tasks_done "${TASKS_DONE:-0}" \
  --argjson reqs "${REQS:-0}" --argjson scenarios "${SCENARIOS:-0}" \
  --argjson verify_present "$VERIFY_PRESENT" --argjson verify_fail "$VERIFY_FAIL" \
  --argjson verify_rewrites "${VERIFY_REWRITES:-0}" \
  --arg validate "$VALIDATE" \
  --argjson tokens "$TOKENS_JSON" \
  '{
    change: $change,
    generated_at: $generated_at,
    method: $meta.method,
    linear: { id: $meta.linear_story_id, url: $meta.linear_story_url },
    time: {
      started_at: $meta.started_at,
      finished_at: $meta.finished_at,
      phase_timestamps: {
        proposal: $ts_proposal, specs: $ts_specs, design: $ts_design,
        tasks: $ts_tasks, verify: $ts_verify, retrospective: $ts_retro
      }
    },
    size: { base: $base, commits: $commits, added: $added, deleted: $deleted, files: $files },
    scope: { tasks_total: $tasks_total, tasks_done: $tasks_done, requirements: $reqs, scenarios: $scenarios },
    quality: {
      verify_present: $verify_present, verify_fail: $verify_fail,
      verify_rewrites: $verify_rewrites, openspec_validate: $validate
    },
    tokens: $tokens
  }' > "$OUT"

echo "wrote $OUT"
jq . "$OUT"
