---
name: exact-coding-baseline-export
description: |
  Mint a new versioned exact-coding-baseline-YYYY-MM-DD snapshot under
  research/workflow-dev/export/. Captures the current best TDD workflow
  (v6.2-with-why-cleaned by default) with HITL re-enabled, autonomy-level
  switch, and consumer-facing README/VERSION inside .claude/ so the snapshot
  can be copied straight into a project. Trigger when the user says
  "exact-coding baseline export", "neue exact-coding baseline",
  "exact-coding-baseline-export", or asks to refresh the baseline snapshot.
---

# Skill: exact-coding-baseline-export

Mint a dated snapshot of the curated exact-coding TDD workflow into
`research/workflow-dev/export/exact-coding-baseline-<YYYY-MM-DD>/`.

The snapshot is the version of `v6.2-with-why-cleaned` that has been
re-shaped for **interactive human use** — autonomous-MUSS wording removed,
Human-in-the-Loop re-enabled as a single configurable rule, README+VERSION
shipped inside `.claude/` so the whole directory copies cleanly into a
consumer project.

## Scope

- **Single repo**: agentic_coding_lab_project. Skill writes only inside
  `research/workflow-dev/export/`. Does not touch source workflows under
  `experiments/workflows/`, sibling repos (exact-coding-book,
  exact-coding-exercises), or anything else.
- **Single artifact**: a new directory at
  `research/workflow-dev/export/exact-coding-baseline-<DATE>/`.
- **Idempotent within a date**: refuses to overwrite an existing
  same-date snapshot unless the user explicitly says "overwrite" or
  "force".

## Argument

- Optional date override in `YYYY-MM-DD` form (e.g. "2026-06-15"). If
  not given, use today's date (`date +%F`).

## Default flow — copy-from-latest

This is the common case. The most recent existing snapshot is the canonical
recipe; the skill just clones it under a new date.

1. **Resolve target date**:
   ```bash
   TARGET_DATE="${1:-$(date +%F)}"
   ```
   Validate format `YYYY-MM-DD`. Refuse on malformed input.

2. **Find latest snapshot** under
   `research/workflow-dev/export/exact-coding-baseline-*`:
   ```bash
   LATEST=$(ls -1d research/workflow-dev/export/exact-coding-baseline-* \
            2>/dev/null | sort | tail -1)
   ```
   If none exists → fall back to the **from-source flow** below.

3. **Refuse to clobber**:
   ```bash
   TARGET="research/workflow-dev/export/exact-coding-baseline-$TARGET_DATE"
   if [ -e "$TARGET" ]; then
     echo "Target $TARGET already exists. Pass 'overwrite' to replace."
     exit 1
   fi
   ```

4. **Clone latest → target**:
   ```bash
   cp -r "$LATEST" "$TARGET"
   ```

5. **Stamp new date** in two places:
   - `$TARGET/.claude/VERSION` — single line `<TARGET_DATE>\n`.
   - `$TARGET/.claude/README.md` — replace `Version: **<OLD_DATE>**` with
     `Version: **<TARGET_DATE>**` (sed/Edit; the line appears once under
     "## Version and updates"). Also replace title line
     `# Exact Coding TDD Baseline — Version <OLD_DATE>` at top.

6. **Validate** (see "Validation" below).

7. **Report** to the user: path written, files diff against latest
   (should be only README.md + VERSION), validation result.

## Fallback flow — from-source (rare)

Use this if **no previous snapshot exists** under `export/`, or the user
explicitly says "rebuild from source" / "from scratch". Source workflow
defaults to `experiments/workflows/v6.2-with-why-cleaned/`.

Steps:

1. **Resolve source workflow**:
   ```bash
   SRC=experiments/workflows/v6.2-with-why-cleaned/.claude
   ```
   If the user named a different source workflow, use that path.
   Confirm with the user before proceeding if the source is not v6.2.

2. **Create target skeleton**:
   ```bash
   TARGET=research/workflow-dev/export/exact-coding-baseline-$TARGET_DATE
   mkdir -p "$TARGET/.claude/agents" "$TARGET/.claude/commands" \
            "$TARGET/.claude/rules"
   ```

3. **Copy 1:1 files** from source:
   - `$SRC/settings.json`           → `$TARGET/.claude/settings.json`
   - `$SRC/rules/tdd-with-ts-and-vitest.md`
     → `$TARGET/.claude/rules/tdd-with-ts-and-vitest.md`

4. **Copy with customization** (read source, append HITL block, write):
   - `agents/refactor.md` — copy verbatim, then **append** the
     "Step 8: Apply HITL Checkpoint" block (template in this skill,
     "Snippet: Refactor Step 8").
   - `commands/test-list.md` — copy verbatim through Step 5, then
     **append** "Step 6: Apply HITL Checkpoint" (Snippet: Test-List Step 6).
     Adjust the "Completion" section to defer to HITL.
   - `commands/red.md` — copy verbatim through Step 7 (the verbatim
     `🔴 Red Phase Complete` block MUST be preserved exactly), then
     **append** "Step 8: Apply HITL Checkpoint" (Snippet: Red Step 8).
     Adjust the "Why this format matters" paragraph in Step 7 to use
     generic wording (Snippet: Red Step 7 why-block — replaces the
     experiment-pipeline-specific text). Adjust "Prediction Failure
     Protocol" to reference HITL recovery. Adjust "Completion" section.
   - `commands/green.md` — copy verbatim; **append** an HITL note in the
     "Completion" section (Snippet: Green HITL note).

5. **Replace source files** with new templates:
   - `rules/tdd-experiment-mode.md` from source is **dropped**.
     Write the new file `rules/tdd-execution-mode.md` from template
     (Snippet: tdd-execution-mode).
   - `rules/tdd.md` — rewrite using template (Snippet: tdd.md). The
     source version contains autonomy-MUSS wording and a reference to
     `tdd-experiment-mode.md` that must not propagate.

6. **Write new files**:
   - `rules/human-in-the-loop.md` from template (Snippet: HITL rule).
   - `.claude/README.md` from template (Snippet: README), substituting
     `<TARGET_DATE>` and source-workflow lineage info.
   - `.claude/VERSION` — single line `<TARGET_DATE>\n`.

7. **Validate** (see below).

8. **Report** the snapshot path and validation result.

## Validation

After either flow, run all four checks. Any failure means the snapshot is
broken — report immediately and do not claim success.

1. **File set**: exactly these 11 files exist (no more, no less):
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

2. **MARKERS intact** (these four are tracked in
   `experiments/workflows/MARKERS.md`; the snapshot must preserve them or
   the workflow's measurement and discipline collapse):
   ```bash
   grep -q 'Skill({ skill: "test-list"' "$TARGET/.claude/rules/tdd.md"
   grep -q '🔴 Red Phase Complete'        "$TARGET/.claude/commands/red.md"
   grep -q 'MUST attempt at least one refactoring' \
                                          "$TARGET/.claude/agents/refactor.md"
   grep -q 'APP\|Absolute Priority Premise' \
                                          "$TARGET/.claude/agents/refactor.md"
   ```
   Plus the verbatim two-line prediction block in `red.md`:
   ```bash
   grep -c 'Prediction.*✅ Correct\|Prediction.*❌ Incorrect\|Prediction.*Correct$' \
        "$TARGET/.claude/commands/red.md"
   ```
   should print ≥ 2.

3. **HITL referenced from every phase file**:
   ```bash
   for f in test-list.md red.md green.md; do
     grep -q 'human-in-the-loop.md' "$TARGET/.claude/commands/$f"
   done
   grep -q 'human-in-the-loop.md' "$TARGET/.claude/agents/refactor.md"
   ```

4. **Autonomy Level switch present** in HITL file:
   ```bash
   grep -q 'Autonomy Level' "$TARGET/.claude/rules/human-in-the-loop.md"
   grep -q 'full-hitl'      "$TARGET/.claude/rules/human-in-the-loop.md"
   ```

5. **VERSION matches**:
   ```bash
   grep -qx "$TARGET_DATE" "$TARGET/.claude/VERSION"
   grep -q  "Version: \*\*$TARGET_DATE\*\*" "$TARGET/.claude/README.md"
   ```

## What this skill explicitly does NOT do

- Does **not** push, commit, or `git add` anything. The user does git
  operations afterwards.
- Does **not** copy the snapshot into sibling repos (exact-coding-book,
  exact-coding-exercises). The user does that explicitly when needed.
- Does **not** edit `experiments/workflows/v6.2-with-why-cleaned/` or any
  other source workflow. Source workflows are immutable from this skill's
  perspective.
- Does **not** edit `HUMAN-IN-THE-LOOP.md` in the repo root. That file
  is the methodology reference; the export's HITL file is the consumable.
  They are kept in sync manually.
- Does **not** prompt for changelog entries or substantive content
  changes. If the workflow has changed since the last snapshot, the user
  edits the latest snapshot dir **before** invoking this skill, then the
  skill mints the new date.

## When to use the fallback (from-source) flow

- The `export/` directory has no existing baseline (clean repo state).
- The user explicitly wants to verify "what the customization recipe
  actually is" by rebuilding from source.
- The default source workflow has drifted substantially and the existing
  baseline no longer reflects it. (In this case, prefer manually editing
  the latest baseline first and re-running the default flow — easier to
  review.)

---

## Snippets (used by the from-source flow)

These are the canonical chunks that customize source files for human
consumption. They live here so a Claude executing the from-source flow
can produce a snapshot bit-identical (modulo source-file evolution) to a
copy-from-latest snapshot.

### Snippet: Refactor Step 8

Append to `agents/refactor.md` after the existing Step 7 ("Report Completion"):

```markdown
### Step 8: Apply HITL Checkpoint

After returning the report to the requester, the requesting context will
consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
includes a stop after Refactor (the default `full-hitl` does), the requester
will present the checkpoint template and wait for explicit user approval
before proceeding to the next Red phase. This step is the requester's
responsibility, not yours — your job ends with the Step 7 report.
```

### Snippet: Test-List Step 6

Append after the existing Step 5 ("Provide Summary"):

```markdown
### Step 6: Apply HITL Checkpoint

Consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
includes a stop after Test-List (the default `full-hitl` does), present the
checkpoint template from that file and wait for explicit user approval
before proceeding to the first Red phase. If the level does not stop after
Test-List, proceed directly to Red.
```

Adjust the trailing "Completion" section so it acknowledges Step 6 before
proceeding.

### Snippet: Red Step 7 why-block

Replace the source's experiment-pipeline-specific paragraph with this
generic version (the verbatim format block below it stays exactly as it is
— it is a MARKER):

```markdown
**Why this format matters:** The block is mechanically parsed by tooling to
verify the Guessing Game discipline. The parser expects two lines matching
`(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation
prediction, one for the runtime prediction. Collapsing them into a single
line, summarizing them as "both correct", or skipping the block entirely
loses the signal. Format consistency here matters even outside batch runs:
it makes the prediction quality visible to you and any future reader.
```

### Snippet: Red Step 8

Append after the (preserved) Step 7 block:

```markdown
### Step 8: Apply HITL Checkpoint

Consult `@.claude/rules/human-in-the-loop.md`. If the current Autonomy Level
includes a stop after Red phase, present the checkpoint template from that
file and wait for explicit user approval before proceeding to Green. If the
level does not stop after Red, proceed directly to Green phase.
```

Adjust the "Prediction Failure Protocol" section: after the
"❌ Prediction Failed:" block, add:

```markdown
Then apply the **Prediction Failure Recovery** procedure in
`@.claude/rules/human-in-the-loop.md`. In every Autonomy Level except
`autonomous`, this is a hard stop — the human decides whether you continue
or investigate first.
```

### Snippet: Green HITL note

Append at the end of the "Completion" section in `commands/green.md`:

```markdown
> **HITL note:** Green has no human checkpoint by default — the default
> Autonomy Level (`full-hitl`) skips it because Green is the most mechanical
> phase and stops here mostly produce "yes, continue" with no review value.
> To enable a Green checkpoint, see `@.claude/rules/human-in-the-loop.md`.
```

### Snippet: tdd-execution-mode

Write `rules/tdd-execution-mode.md` from this template (replaces the
source's `tdd-experiment-mode.md` entirely):

````markdown
# TDD Execution Mode

This workflow runs the TDD cycle as a sequence of Skill invocations
(`/test-list`, `/red`, `/green`) and one Task subagent (`refactor`). Whether
the cycle pauses for human approval between phases is controlled by
`@.claude/rules/human-in-the-loop.md` (the Autonomy Level setting at the top
of that file).

## Workflow Sequence

1. **Test List Phase** → Invoke `/test-list` skill (main context)
2. **For each test:**
   - **Red Phase** → Invoke `/red` skill (main context)
   - **Green Phase** → Invoke `/green` skill (main context)
   - **Refactor Phase** → Launch the `refactor` subagent via the Task tool
     (isolated context)
3. **Continue** until all tests are implemented
4. At each phase boundary, consult
   `@.claude/rules/human-in-the-loop.md` to decide whether to stop or
   continue

## Required Prompt Context for the Refactor Subagent

The refactor subagent has no memory of the red/green phases. Pass everything
it needs:

```
Test file: [path]
Implementation file: [path]
Passing tests: [count]
Recent changes: [one-line summary of the Green phase]
```

After the subagent returns, read its summary, then consult HITL before
proceeding to the next Red phase.

## Optional Done Marker

For unattended batch runs (e.g. CI pipelines or automation harnesses), it can
be useful to signal task completion mechanically. If your runner expects one,
write a file `experiment-done.txt` with the single word `DONE` as its only
content when all tests are implemented and passing.

In interactive use this marker is unnecessary; the human sees the final
Refactor checkpoint and ends the session normally.
````

### Snippet: tdd.md

Write `rules/tdd.md` from the source's structure with these changes:

- Header line `# TDD Rules — Hybrid (v6)` →
  `# TDD Rules — Hybrid (v6, exact-coding baseline)`.
- Drop any sentence claiming the workflow is "autonomous", "for batch
  experiments", or referencing `predictions_correct_rate` /
  `refactorings_applied` as metrics. Substitute the generic motivation
  (architectural separation of red/green/refactor) — see the latest
  snapshot's `tdd.md` for the exact wording.
- In the Step 4 (Refactor) `Task({...})` prompt example, **remove** the
  line `EXPERIMENT MODE: Run autonomously, return when done.` Leave the
  rest of the prompt as in source.
- Append the "Overview" paragraph with one sentence: *This baseline
  supports configurable human-in-the-loop checkpoints — see
  `@.claude/rules/human-in-the-loop.md` for the Autonomy Level setting
  and stop behavior.*
- Add a new top-level section `## Human-in-the-Loop` after "Core TDD
  Principles", deferring to the HITL file for stop behavior.
- Replace `@.claude/rules/tdd-experiment-mode.md` references with
  `@.claude/rules/tdd-execution-mode.md`.
- In the final "Remember" list, add: *Consult
  `@.claude/rules/human-in-the-loop.md` at every phase boundary*.

Use the latest snapshot's `rules/tdd.md` as the canonical reference if any
detail above is ambiguous.

### Snippet: HITL rule

Write `rules/human-in-the-loop.md` from the latest snapshot's version
verbatim. The HITL file is fully self-contained — no source-workflow
substitutions are needed. The file ships with `full-hitl` as the default
Autonomy Level, six configurable levels (`full-hitl`, `refactor-only`,
`red-only`, `every-n-tests N`, `task-end`, `autonomous`), per-phase
checkpoint templates, and the Prediction Failure Recovery procedure.

If for any reason no previous snapshot exists, the structural requirements
of the HITL file are:

1. Front-loaded "Autonomy Level" section with the current setting on its
   own line, plus the six-level table.
2. Explanation of why Green is exempt by default.
3. Checkpoint templates for Test-List, Red, Refactor, and (disabled-by-
   default) Green.
4. Prediction Failure Recovery section.
5. "Switching levels mid-task" note (apply from next phase boundary, no
   retroactive triggering).

### Snippet: README

Write `.claude/README.md` from the latest snapshot's version with these
substitutions:

- Title: `# Exact Coding TDD Baseline — Version <TARGET_DATE>`
- "Version and updates" → `Version: **<TARGET_DATE>**`
- If the source workflow changed from v6.2-with-why-cleaned, update the
  "Tested parameters" section's findings (verification_pct, refactorings,
  σ) and the "Original name and lineage" tree to match the new source.
  Otherwise keep both sections verbatim.

The README must keep these sections (their headings are load-bearing for
consumers): "What it is", "Tested parameters", "Original name and
lineage", "HITL adaptation", "Installation", "File layout", "Version and
updates", "License".

The "File layout" section must show README.md and VERSION **inside**
`.claude/` — not at the snapshot root.

---

## Quick reference

| Trigger phrase | Action |
|---|---|
| "exact-coding baseline export" | Default flow, date = today |
| "exact-coding baseline export YYYY-MM-DD" | Default flow, custom date |
| "rebuild exact-coding baseline from source" | Fallback flow, today |
| "overwrite today's exact-coding baseline" | Default flow + skip clobber-refuse |

Single output: a new directory at
`research/workflow-dev/export/exact-coding-baseline-<DATE>/`. Validation
must pass before reporting success.
