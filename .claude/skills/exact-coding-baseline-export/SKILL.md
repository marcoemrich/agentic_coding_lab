---
name: exact-coding-baseline-export
description: |
  Mint a new exact-coding-baseline-YYYY-MM-DD snapshot under
  research/workflow-dev/export/. Detects the current best correctness-
  oriented workflow from research/workflow-dev/workflow-construction.md
  (or takes an explicit source-workflow argument), copies it, applies the
  HITL transformation using the canonical template in this skill, and
  writes README + VERSION inside .claude/ so the snapshot can be dropped
  straight into a consumer project. Trigger when the user says
  "exact-coding baseline export", "neue exact-coding baseline",
  "exact-coding-baseline-export", or asks to refresh the baseline snapshot.
---

# Skill: exact-coding-baseline-export

Mint a dated, HITL-enabled snapshot of the current best TDD workflow into
`research/workflow-dev/export/exact-coding-baseline-<YYYY-MM-DD>/`.

This is a **true transformation skill** — it reads a source workflow
(immutable), applies HITL re-enablement on top of it, and writes the result
as a new snapshot. The skill is self-contained: the HITL consumable template
and the README template live alongside this file under `templates/`.

## Scope

- **Single repo**: agentic_coding_lab_project. Writes only inside
  `research/workflow-dev/export/`. Does not touch source workflows under
  `experiments/workflows/`, sibling repos, or anything else.
- **Single artifact**: a new directory at
  `research/workflow-dev/export/exact-coding-baseline-<DATE>/`.
- **Idempotent within a date**: refuses to overwrite an existing
  same-date snapshot unless the user explicitly says "overwrite" / "force".

## Arguments

Two positional, both optional:

1. **Date** in `YYYY-MM-DD` form. Default: today (`date +%F`).
2. **Source workflow name** (e.g. `v6.2-with-why-cleaned`). Default:
   auto-detect (see "Source detection" below).

If the user passes "from v6.4 today" or similar, parse the source name and
use today's date. If only one argument looks like a date, that's the date;
if only one looks like a workflow name, that's the source.

## Source detection

When no explicit source is given, find the current correctness-critical
default from `research/workflow-dev/workflow-construction.md`. The
recommendation lives in the "Aktuelle Front" section and starts with the
prefix **"Default für korrekheits-kritische Arbeit"** (note the typo
"korrekheits" in the source — keep it in the grep).

```bash
SRC_NAME=$(grep -E '\*\*Default für korre[kt]+heits-kritische Arbeit' \
             research/workflow-dev/workflow-construction.md \
           | head -1 \
           | sed -E 's/.*`([^`]+)`.*/\1/')
```

The first backtick-quoted workflow name on that line is the recommendation.
Verify the directory exists:

```bash
SRC_DIR="experiments/workflows/$SRC_NAME"
[ -d "$SRC_DIR/.claude" ] || { echo "Source $SRC_DIR missing"; exit 1; }
```

If the grep fails (the recommendation line moved or got renamed), **ask the
user** which workflow to use. Do not silently fall back to a hardcoded name
— a stale fallback is the whole reason this skill was rewritten away from
clone-from-latest.

Print the resolved source to the user before proceeding, so a wrong
detection can be aborted.

## Target

```bash
TARGET="research/workflow-dev/export/exact-coding-baseline-$DATE"
[ -e "$TARGET" ] && { echo "Exists; pass 'overwrite' to replace"; exit 1; }
mkdir -p "$TARGET/.claude/agents" "$TARGET/.claude/commands" \
         "$TARGET/.claude/rules"
```

## Transformation steps

### Step 1: copy source files

For each file, copy 1:1 from `$SRC_DIR/.claude/` to `$TARGET/.claude/`:

- `settings.json`
- `rules/tdd-with-ts-and-vitest.md` (some older source workflows used
  `tdd_with_ts_and_vitest.md` — if present, rename to hyphen form in target)
- `agents/refactor.md`
- `commands/test-list.md`
- `commands/red.md`
- `commands/green.md`
- `rules/tdd.md`

Do **not** copy `rules/tdd-experiment-mode.md` if present in source — it is
replaced by the consumable `tdd-execution-mode.md` from this skill's
templates.

### Step 2: write fresh files from skill templates

Copy verbatim from `.claude/skills/exact-coding-baseline-export/templates/`:

- `templates/human-in-the-loop.md` → `$TARGET/.claude/rules/human-in-the-loop.md`
- `templates/tdd-execution-mode.md` → `$TARGET/.claude/rules/tdd-execution-mode.md`

### Step 3: render README from template

Take `templates/README.template.md`. Substitute placeholders:

- `{{DATE}}` → `$DATE` (both occurrences: title and "Version" line)
- `{{SOURCE_WORKFLOW}}` → `$SRC_NAME` (two occurrences in "Tested
  parameters" and "Original name and lineage")

Write to `$TARGET/.claude/README.md`.

### Step 4: write VERSION

```bash
echo "$DATE" > "$TARGET/.claude/VERSION"
```

### Step 5: HITL inject into copied phase files

The copied source files reference experiment-mode wording or lack HITL
references. Apply the **HITL Patches** (next section) to each of the four
phase files plus `rules/tdd.md`.

Use the `Edit` tool for surgical changes; do not rewrite whole files unless
the surgical change would be larger than the file.

## HITL Patches

Each patch is described as: file → location → replacement / addition. The
exact target strings are taken from `v6.2-with-why-cleaned`; for other
source workflows the strings might differ — in that case, use the nearest
structural anchor (e.g. "after the last numbered Step") and report any
patch that could not be applied verbatim.

### Patch A — `rules/tdd.md`

1. **Header rename** (top of file):

   - From: `# Test-Driven Development (TDD) Rules — Hybrid (v6)` (or
     whatever header the source uses)
   - To: `# TDD Rules — Hybrid (v6, exact-coding baseline)`

2. **Drop experiment-pipeline justification** in the "🚨 CRITICAL" intro
   paragraph. The source typically has a sentence like *"The experiment's
   measurement pipeline parses these tool calls to compute `cycle_count`,
   `predictions_correct_rate`, and `refactorings_applied`."* — remove the
   pipeline/metric reference and replace with the generic architectural
   justification:

   > If you write test code, implementation code, or refactorings directly
   > in the main context instead of delegating, the workflow loses the
   > architectural separation that makes the hybrid work.

3. **Drop the `EXPERIMENT MODE: Run autonomously, return when done.` line**
   from the Step 4 Refactor `Task({...})` prompt example.

4. **Append to the Overview section** (after the architectural description,
   before "TDD Workflow"):

   > This baseline supports **configurable human-in-the-loop checkpoints**
   > between phases. See `@.claude/rules/human-in-the-loop.md` for the
   > Autonomy Level setting and stop behavior.

5. **Replace reference** `@.claude/rules/tdd-experiment-mode.md`
   → `@.claude/rules/tdd-execution-mode.md`.

6. **Insert section** `## Human-in-the-Loop` after "Core TDD Principles":

   ```markdown
   ## Human-in-the-Loop

   Between phases, the workflow consults `@.claude/rules/human-in-the-loop.md`
   to decide whether to pause for human approval. The default Autonomy Level
   is `full-hitl`, which stops after Test-List, Red, and Refactor (not Green)
   and on prediction failures. Switch levels by editing the setting at the
   top of the HITL file — see that file for the full table.

   For unattended batch runs, set the level to `autonomous` to disable all
   stops.
   ```

7. **Append to "Remember" list**:

   > Consult `@.claude/rules/human-in-the-loop.md` at every phase boundary

### Patch B — `commands/red.md`

1. **Step 7 "Why this format matters"**: the source paragraph refers to
   `predictions_correct_rate` and "the experiment measures". Replace with:

   ```markdown
   **Why this format matters:** The block is mechanically parsed by tooling to
   verify the Guessing Game discipline. The parser expects two lines matching
   `(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation
   prediction, one for the runtime prediction. Collapsing them into a single
   line, summarizing them as "both correct", or skipping the block entirely
   loses the signal. Format consistency here matters even outside batch runs:
   it makes the prediction quality visible to you and any future reader.
   ```

   The verbatim `🔴 Red Phase Complete:` block that follows **MUST stay
   exactly as in source** — it is one of the four MARKERS.

2. **Step 3 / Step 6 STOP lines**: source has *"❌ Prediction wrong → STOP
   and explain discrepancy"*. Replace `STOP and explain discrepancy` with
   `follow the Prediction Failure Protocol below` (the Prediction Failure
   Protocol section is updated in step B.4).

3. **Append Step 8** after the Step 7 block:

   ```markdown
   ### Step 8: Apply HITL Checkpoint

   Consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
   includes a stop after Red phase, present the checkpoint template from that
   file and wait for explicit user approval before proceeding to Green. If the
   level does not stop after Red, proceed directly to Green phase.
   ```

4. **Prediction Failure Protocol section**: after the existing
   `❌ Prediction Failed:` code block, append:

   ```markdown
   Then apply the **Prediction Failure Recovery** procedure in
   `@.claude/rules/human-in-the-loop.md`. In every Autonomy Level except
   `autonomous`, this is a hard stop — the human decides whether you continue
   or investigate first.
   ```

5. **Completion section** at the end: replace whatever closing prose source
   has with:

   ```markdown
   After Step 8 (HITL checkpoint), proceed to Green phase if approved or if
   the Autonomy Level does not require a stop:

   ```
   🔴 Red Phase Complete. Proceeding to Green phase.
   ```
   ```

### Patch C — `commands/green.md`

Append at the end of the "Completion" section:

```markdown
> **HITL note:** Green has no human checkpoint by default — the default
> Autonomy Level (`full-hitl`) skips it because Green is the most mechanical
> phase and stops here mostly produce "yes, continue" with no review value.
> To enable a Green checkpoint, see `@.claude/rules/human-in-the-loop.md`.
```

### Patch D — `commands/test-list.md`

Append after Step 5 ("Provide Summary"):

```markdown
### Step 6: Apply HITL Checkpoint

Consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
includes a stop after Test-List (the default `full-hitl` does), present the
checkpoint template from that file and wait for explicit user approval
before proceeding to the first Red phase. If the level does not stop after
Test-List, proceed directly to Red.
```

Adjust the trailing "Completion" section's prose to acknowledge Step 6.

### Patch E — `agents/refactor.md`

Append after Step 7 ("Report Completion"):

```markdown
### Step 8: Apply HITL Checkpoint

After returning the report to the requester, the requesting context will
consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
includes a stop after Refactor (the default `full-hitl` does), the requester
will present the checkpoint template and wait for explicit user approval
before proceeding to the next Red phase. This step is the requester's
responsibility, not yours — your job ends with the Step 7 report.
```

## Validation

Run all checks after Step 5. Any failure means the snapshot is broken —
report immediately, do not claim success.

1. **File set**: exactly these 11 files exist:

   ```bash
   find "$TARGET" -type f | sort
   ```

   Expected:
   ```
   .claude/README.md
   .claude/VERSION
   .claude/agents/refactor.md
   .claude/commands/{green,red,test-list}.md
   .claude/rules/{human-in-the-loop,tdd,tdd-execution-mode,tdd-with-ts-and-vitest}.md
   .claude/settings.json
   ```

2. **Source workflow files copied** (size sanity — none of the source
   files dropped below 500 bytes during patching, which would indicate a
   destroyed file):

   ```bash
   find "$TARGET/.claude" -type f -name '*.md' -size -500c
   ```
   Must print nothing.

3. **MARKERS intact** (cross-reference
   `experiments/workflows/MARKERS.md`):

   ```bash
   grep -q 'Skill({ skill: "test-list"' "$TARGET/.claude/rules/tdd.md"
   grep -q '🔴 Red Phase Complete'        "$TARGET/.claude/commands/red.md"
   grep -q 'MUST attempt at least one refactoring' \
                                          "$TARGET/.claude/agents/refactor.md"
   grep -q 'Absolute Priority Premise\|APP.*Mass' \
                                          "$TARGET/.claude/agents/refactor.md"
   ```

   Plus the verbatim two-line prediction block in `red.md`:
   ```bash
   grep -cE '(Compilation|Runtime) Prediction.*✅ Correct' \
        "$TARGET/.claude/commands/red.md"
   ```
   Must print `2`.

4. **No experiment-mode wording leaked into the snapshot**:
   ```bash
   grep -r 'tdd-experiment-mode\|EXPERIMENT MODE\|predictions_correct_rate\|refactorings_applied\b' \
        "$TARGET/.claude" && echo "FAIL: experiment wording leaked"
   ```
   Must print no matches.

5. **HITL referenced from every phase file**:
   ```bash
   for f in test-list.md red.md green.md; do
     grep -q 'human-in-the-loop.md' "$TARGET/.claude/commands/$f" \
       || echo "FAIL: HITL missing from $f"
   done
   grep -q 'human-in-the-loop.md' "$TARGET/.claude/agents/refactor.md"
   ```

6. **Autonomy Level switch present**:
   ```bash
   grep -q 'Autonomy Level' "$TARGET/.claude/rules/human-in-the-loop.md"
   grep -q 'full-hitl'      "$TARGET/.claude/rules/human-in-the-loop.md"
   ```

7. **VERSION + README version line match the requested date**:
   ```bash
   grep -qx "$DATE" "$TARGET/.claude/VERSION"
   grep -q  "Version \*\*$DATE\*\*\|Version: \*\*$DATE\*\*" \
        "$TARGET/.claude/README.md"
   ```

8. **README placeholders fully substituted**:
   ```bash
   grep -F '{{' "$TARGET/.claude/README.md" \
     && echo "FAIL: unsubstituted placeholders"
   ```
   Must print no matches.

## Report to the user

After successful validation:

1. Echo the resolved source workflow name and target snapshot path.
2. Print the file tree.
3. Note that the skill did NOT commit/push — the user does git operations
   afterwards.
4. Mention the sibling repos (`exact-coding-book`,
   `exact-coding-exercises`) explicitly: the snapshot has NOT been copied
   into them; if a copy is desired, the user requests it as a separate
   action.

## What this skill explicitly does NOT do

- Does **not** push, commit, or `git add` anything.
- Does **not** copy the snapshot into sibling repos.
- Does **not** edit source workflows under `experiments/workflows/`.
- Does **not** edit `workflow-construction.md` or any RQ findings — those
  belong in their own RQ-driven flows.
- Does **not** prompt for substantive content changes. If the source
  workflow's content has drifted in a way that the surgical patches in
  this skill no longer apply cleanly, the patches above need to be
  updated in this SKILL.md first.

## Related files

- `templates/human-in-the-loop.md` — canonical HITL consumable, copied
  verbatim into every snapshot.
- `templates/tdd-execution-mode.md` — replaces source's
  `tdd-experiment-mode.md`.
- `templates/README.template.md` — README with `{{DATE}}` and
  `{{SOURCE_WORKFLOW}}` placeholders.
- `HUMAN-IN-THE-LOOP.md` (in this skill's directory) — methodology
  reference describing the HITL design rationale and re-enablement steps.
  Useful for understanding **why** the templates look the way they do, but
  not consumed by the export flow itself.

## Quick reference

| Invocation | Action |
|---|---|
| `/exact-coding-baseline-export` | Auto-detect source, date = today |
| `/exact-coding-baseline-export 2026-06-15` | Auto-detect source, custom date |
| `/exact-coding-baseline-export v6.4-some-variant` | Explicit source, today |
| `/exact-coding-baseline-export 2026-06-15 v6.4-some-variant` | Both explicit |
| `/exact-coding-baseline-export overwrite` | Same as default, but allow clobber |

Single output: a new directory at
`research/workflow-dev/export/exact-coding-baseline-<DATE>/`. Validation
must pass before reporting success.
