# Blueprint Audit: exact-coding-autonomous

Date: 2026-05-17
Auditor: `/blueprint-audit` (Claude Opus 4.7)

## Resolved

- **Top fix 1 / Finding 2 — Skill vs Slash-Command mismatch** —
  fixed in `d9ffec9`. commands/ moved to skills/<name>/SKILL.md
  with frontmatter; tdd.md mechanism now matches its invocations.
- **Top fix 3 / Finding 1 — missing static test suite** —
  scaffolded `tests/` with `blueprint_contracts.py` and 38
  static tests (file structure, agent + skill frontmatter,
  rule line length, caching compliance, settings sanity).
  `.claude/CLAUDE.md` intentionally omitted from contracts
  pending Top fix 2.
- **Top fix 4 / Finding 2 (workflow coupling) — refactor.md
  decoupled from TDD pipeline.** Description, mission, section
  headings, completion report, and red flags are now
  role-neutral (the requester / a refactoring pass) per
  `agent-design.md`. "Build and Tests" section dropped —
  already covered by `tdd_with_ts_and_vitest.md`.
- **Top fix 5 / Finding 2 (phantom HITL) — tdd-experiment-mode.md
  reframed.** Drops the "override HITL requirements" framing
  (no HITL workflow exists). The file now positively states
  the autonomous default and the measurement-pipeline reason
  for it. Marker "EXPERIMENT MODE:" in the refactor subagent
  prompt template removed.
- **Top fix 2 / Finding 4 (lead instructions missing) — decided
  against.** The blueprint runs inside an automated evaluation
  framework; the spec is supplied in the initial prompt and
  `tdd.md` is auto-loaded from `.claude/rules/`. A Lead
  CLAUDE.md would either duplicate `tdd.md` or contain
  user-interaction guidance that does not apply. The contracts
  file documents the omission so future contributors don't
  re-introduce the question.
- **Finding 4 (blueprint design reference missing) — added.**
  Authored `blueprints/exact-coding-autonomous/CLAUDE.md`
  modeled on the autonomous blueprint's design reference:
  overview, build/test, components table, conventions,
  references. Maintainer-facing only — not loaded at runtime.
- **Finding 4 (root docs do not reference blueprint) — added.**
  Root `README.md` gets blueprint row + "When to Use Which"
  entries + Quick Start variant + new "exact-coding-autonomous
  — Strict TDD for Evaluation" section. Root `CLAUDE.md` gets
  components-table row, build-and-test command, and a
  description section.
- **Finding 2 remainder — consistency cleanups.**
  - `red/SKILL.md`: `pnpm test:unit:basic` → `pnpm test`
    (matches `tdd.md` and `tdd-with-ts-and-vitest.md`).
  - `tdd_with_ts_and_vitest.md` → `tdd-with-ts-and-vitest.md`
    (hyphen naming convention). References in `tdd.md`,
    `CLAUDE.md`, `blueprint_contracts.py` updated.
  - `tdd-experiment-mode.md`: "Launch `refactor` Task subagent"
    → "Launch the `refactor` subagent via the Task tool"
    (terminology.md).
- **Finding 3 — rationale gaps closed.**
  - `refactor.md:12` "MUST attempt at least one refactoring"
    now cites the measurement-pipeline reason.
  - `refactor.md:98` "Make ONE improvement at a time" now
    cites bisectability.
  - `test-list/SKILL.md` Step 3 (simple → complex) now
    explains the green-phase generalization pattern.
- **Finding 7 — instruction gaps closed (7b skipped per
  decision).**
  - 7a: "no improvement possible" given a concrete bar
    in `refactor.md` Mission item 5 — name tightening,
    APP mass ≥1, or removable smell. Each path must be
    addressed before claiming exhaustion.
  - 7c: `red/SKILL.md` Steps 3 and 6 no longer carry a
    "STOP and explain" branch — wrong predictions are
    treated as data, not blockers, since this blueprint
    runs without human escalation. The "Prediction
    Failure Protocol" section is replaced by "Wrong
    Predictions Are Data", which forbids backfilling
    or rewriting a prediction after seeing the result.
  - 7d: `red/SKILL.md` gets a "Mandatory Procedure"
    preamble before Step 1 stating that all seven steps,
    including the prediction blocks, are required on
    every cycle and that the predictions are the measured
    signal.
- **Finding 8 — settings.json permission redundancy.**
  Removed `Bash(pnpm test:*)`, `Bash(pnpm install:*)`,
  `Bash(pnpm run:*)` — all already covered by
  `Bash(pnpm:*)`. The Skill-permission sub-finding was
  resolved automatically by Top fix 1 (skills now exist).
- **Finding 10 — behavior-preserving cuts: deferred.**
  Three candidates were identified (refactor.md "Remember"
  and "Important Guidelines"; red/SKILL.md DO/DON'T).
  Each duplicates content from Mission/Process/Rules but
  the redundancy is mild and removing the bullet lists
  reduces redundancy for human readers at the cost of
  losing the "checklist at a glance" entry points agents
  often pattern-match against. To be evaluated as an
  isolated experiment.

## Deferred

- **Finding 11 — handoff coverage: deferred for evaluation.**
  Re-assessment in the automated-framework context:
  - 11a (spec completeness before `/test-list`) — out of
    blueprint scope; the framework supplies the spec.
  - 11b (predictions actually recorded in parsed format)
    — real but limited-value gap. A PostToolUse hook
    would detect cycle breaks after the fact, not prevent
    them; defer until empirical need is shown.
  - 11c (green-phase minimality) — real gap with
    measurement impact: over-implementation collapses the
    APP-mass-drop signal the refactor cycle is meant to
    show. Fix candidate: extend the refactor-subagent
    prompt template to flag unjustified code rather than
    refactor it.
  - 11d (`experiment-done.txt` timing) — real gap. Fix
    candidate: gate the marker write on a fresh
    `pnpm test` run confirming zero `it.todo` and all
    tests passing.
  Deferred to a separate change that can validate 11c
  and 11d against a real experiment run.

## Scorecard

Score: 2/11 clean

| # | Check | Result |
|---|---|---|
| 1 | Static tests | no tests/ directory — suite missing |
| 2 | Cross-file consistency | 6 findings |
| 3 | Rationale completeness | 3 gaps |
| 4 | Documentation alignment | 3 mismatches (blueprint CLAUDE.md and root mentions absent) |
| 5 | Agent tool coherence | clean |
| 6 | Workflow-agent alignment | n/a (no workflows/) |
| 7 | Instruction gap audit | 4 gaps |
| 8 | Configuration coupling | 1 violation + redundancy |
| 9 | Rule file length | clean |
| 10 | Behavior-preserving cuts | 3 candidates |
| 11 | Handoff coverage | 4 gaps |

## Findings

### 1 — Static tests

```
blueprints/exact-coding-autonomous/tests/             fail
  issue: directory does not exist; no blueprint_contracts.py,
         no static suite. CLAUDE.md "Session Checklist" requires
         `uv run pytest blueprints/<name>/tests/ -m static -v`.
  fix:   scaffold tests/ mirroring blueprints/autonomous/tests/
         with a contract for: required files, agent frontmatter
         (name lowercase-hyphenated), rule line-length, caching
         compliance (no dynamic content), settings.json schema.
```

### 2 — Cross-file consistency

```
blueprints/exact-coding-autonomous/.claude/rules/tdd.md:11-18                fail
  issue: prescribes `Skill({ skill: "test-list" })` /
         `Skill({ skill: "red" })` / `Skill({ skill: "green" })`,
         but the files live under .claude/commands/ (slash
         commands), not .claude/skills/. Mechanism mismatch —
         the Skill tool will not find them, and the metric
         pipeline this file describes will silently produce zero.
  fix:   either move test-list/red/green to
         .claude/skills/<name>/SKILL.md (with frontmatter), or
         change tdd.md to invoke them as /test-list, /red, /green
         slash commands and update settings.json (drop "Skill"
         permission if unused).

blueprints/exact-coding-autonomous/.claude/commands/red.md:54,85              fail
  issue: uses `pnpm test:unit:basic`; tdd.md:57 and
         tdd_with_ts_and_vitest.md:13 use `pnpm test`. Two
         different test commands for the same pipeline.
  fix:   pick one (likely `pnpm test`) and use it consistently;
         if the granular variant is needed, document why in
         tdd_with_ts_and_vitest.md.

blueprints/exact-coding-autonomous/.claude/rules/tdd-experiment-mode.md:3-7   fail
  issue: claims to "override human-in-the-loop requirements" —
         but no HITL workflow is defined anywhere in the
         blueprint. Phantom reference. Reader can't tell what
         is being overridden.
  fix:   either add the HITL baseline workflow this overrides,
         or rephrase as the default and remove the "override"
         framing.

blueprints/exact-coding-autonomous/.claude/rules/tdd_with_ts_and_vitest.md    warn
  issue: filename uses underscores; tdd.md / tdd-experiment-mode.md
         use hyphens. Naming convention drift.
  fix:   rename to tdd-with-ts-and-vitest.md and update the
         @-reference in tdd.md:57.

blueprints/exact-coding-autonomous/.claude/agents/refactor.md:3,156           fail
  issue: agent file encodes workflow facts: "After Green phase",
         "Proceeding to the next test", "Skipping refactoring
         phase entirely" as a red flag. Per agent-design.md,
         agent files define role/capability only — sequencing
         belongs in tdd.md.
  fix:   strip phase references from description and Step 6;
         use role-neutral language ("after receiving a request
         to refactor", "report back to the requester").

blueprints/exact-coding-autonomous/.claude/rules/tdd.md:11-18                 warn
  issue: terminology drift around the refactor subagent.
         Per terminology.md, the verb for subagents is "launch".
         tdd-experiment-mode.md:14 says "Launch refactor Task
         subagent" which conflates Task tool name with action.
  fix:   normalize on "launch the refactor subagent via the
         Task tool" everywhere.
```

### 3 — Rationale completeness

```
blueprints/exact-coding-autonomous/.claude/agents/refactor.md:13              warn
  issue: "MUST attempt at least one refactoring - mandatory, not
         optional" has no rationale. Without it, the agent forces
         a no-op rename when no genuine improvement exists.
  fix:   add one-line rationale (e.g. "the run-level metric
         counts refactorings_applied; a missing attempt drops
         the cycle's signal to zero — see tdd.md").

blueprints/exact-coding-autonomous/.claude/agents/refactor.md:101             warn
  issue: "Make ONE improvement at a time" — no rationale.
  fix:   add "so that a test break can be bisected to the single
         change that caused it."

blueprints/exact-coding-autonomous/.claude/commands/test-list.md:42           warn
  issue: "Order tests simple → complex" — no rationale.
  fix:   add "early tests force minimal implementations;
         later tests build pressure that drives generalization
         only when concrete cases demand it."
```

### 4 — Documentation alignment

```
blueprints/exact-coding-autonomous/CLAUDE.md                                  fail
  issue: missing entirely. autonomous/ and workflow/ both have a
         design-reference CLAUDE.md (Build/Test, Components,
         Conventions, References). This is the file the
         "Session Checklist" in /CLAUDE.md expects.
  fix:   create blueprints/exact-coding-autonomous/CLAUDE.md mirroring the
         autonomous template.

blueprints/exact-coding-autonomous/.claude/CLAUDE.md                          fail
  issue: missing — no lead instructions. The session starting in
         a target project has no entry point telling it when to
         enter the TDD loop, how to clarify, or how to interpret
         tdd-experiment-mode.md vs. the (missing) HITL path.
  fix:   author a Lead Instructions file analogous to
         autonomous/.claude/CLAUDE.md, scoped to TDD entry,
         clarification, and dispatch into /test-list.

README.md, /CLAUDE.md                                              fail
  issue: neither references the exact-coding-autonomous blueprint. Both
         describe only autonomous + workflow.
  fix:   add an exact-coding-autonomous row to the blueprint tables and a
         short "When to Use" entry.
```

### 7 — Instruction gap audit

```
blueprints/exact-coding-autonomous/.claude/agents/refactor.md:18              warn (7a)
  issue: "If no improvement is possible, explicitly document why"
         — no concrete bar for "improvement possible". With a
         strict "MUST attempt" rule and a fuzzy escape ("not
         possible"), the agent either rationalizes no-ops as
         done or forces cosmetic renames.
  fix:   define the bar: e.g. "improvement possible" iff naming
         can be tightened OR APP mass drops by ≥1 OR a clear
         smell (duplication, mutable state) is removable.

blueprints/exact-coding-autonomous/.claude/rules/tdd.md (whole file)          warn (7b)
  issue: workflow is described as a startup sequence (Test List →
         Red → Green → Refactor) without an explicit per-feature
         re-entry contract. After one feature, does the lead
         re-enter test-list for the next? Not stated.
  fix:   add "Per-feature gate: each new feature/kata re-runs
         /test-list before any /red invocation."

blueprints/exact-coding-autonomous/.claude/commands/red.md:54,85              warn (7c)
  issue: prediction-failure protocol (lines 119-130) says "STOP
         and explain discrepancy" but doesn't define who breaks
         the loop. Agent under pressure self-explains and
         continues.
  fix:   add "do not continue to Step 4 (or Green) unless the
         prediction matched. A failed prediction is a blocker,
         not a retry."

blueprints/exact-coding-autonomous/.claude/commands/red.md (whole)            warn (7d)
  issue: 7-step procedure where Step 1 produces observable state
         (test activated). An agent could skip predictions
         (Steps 2,5) if the test already fails as expected.
         Steps 2/5 use "state your prediction" — no "always" /
         "unconditional" marker. The file itself (line 93)
         acknowledges this drops the metric to zero.
  fix:   add a top-of-file preamble: "All seven steps are
         mandatory on every cycle. Predictions are not optional
         even when the failure looks obvious — they are the
         measured signal."
```

### 8 — Configuration coupling

```
blueprints/exact-coding-autonomous/.claude/settings.json:9-12                 warn
  issue: `Bash(pnpm:*)` already covers `pnpm test:*`,
         `pnpm install:*`, `pnpm run:*`. Three subordinate
         allow-entries are dead. If the broad rule is later
         narrowed, the narrow ones give a false sense of safety.
  fix:   drop the three sub-entries OR remove `pnpm:*` and keep
         only the narrow ones (preferred per least-privilege).

blueprints/exact-coding-autonomous/.claude/settings.json:17                   warn
  issue: "Skill" permission listed but no .claude/skills/
         directory exists in this blueprint. Permission is for
         a mechanism the blueprint doesn't use (see Finding 2,
         tdd.md).
  fix:   either add skills or drop the permission once the
         Skill-vs-Command mismatch is resolved.
```

### 10 — Behavior-preserving cuts

```
blueprints/exact-coding-autonomous/.claude/agents/refactor.md:258-265         info
  issue: "Remember" section restates Mission and Important
         Guidelines verbatim. Pure echo — passes all four
         sub-tests.
  fix:   delete the "Remember" section (~8 lines saved).

blueprints/exact-coding-autonomous/.claude/agents/refactor.md:158-172         info
  issue: "What to DO" / "What NOT to do" lists duplicate the
         Process section (Step 1-6) and Critical Project Context.
  fix:   delete; the process is the contract (~15 lines saved).

blueprints/exact-coding-autonomous/.claude/commands/red.md:106-117            info
  issue: "DO / DON'T" repeats Red Phase Rules (lines 14-20)
         almost verbatim.
  fix:   delete the DO/DON'T block (~12 lines saved).
```

### 11 — Handoff coverage

```
guarantee: feature is fully specified before /red begins
  verifier:    none — gap. /test-list takes $ARGUMENTS but no
               agent verifies the spec is non-trivial,
               unambiguous, or covers acceptance criteria.
  input gap:   no clarification step or user gate.
  fix:         add a clarification step in the (missing) lead
               CLAUDE.md before invoking /test-list.

guarantee: predictions are actually recorded in the parsed format
  verifier:    none — gap. red.md asks for them; no agent or
               hook validates the block after the cycle.
  input gap:   parser runs out-of-band (metric pipeline).
  fix:         add a PostToolUse hook on Edit of *.spec.ts (or
               a SessionStop hook) that greps the cycle's stdout
               for the expected two prediction lines.

guarantee: green-phase implementation is minimal (no future-test
            code)
  verifier:    /green Step 4 is self-policed; refactor subagent
               sees only current state and can't know what was
               over-implemented.
  input gap:   refactor agent doesn't get the "Recent Green
               summary" required by tdd.md template, in a form
               it can use to detect bloat.
  fix:         either an explicit reviewer step between Green
               and Refactor, or extend the refactor prompt with
               "flag any code not justified by the currently
               passing tests."

guarantee: experiment-done.txt is written exactly when "all tests
            are implemented and passing"
  verifier:    none — gap. tdd-experiment-mode.md:35 instructs
               it but nothing checks the count of passing tests
               vs. the test list before writing the marker.
  fix:         add a final check: re-run pnpm test, parse the
               passing count, compare to the test-list length
               captured at start; only then write DONE.
```

## Top fixes

1. **`blueprints/exact-coding-autonomous/.claude/rules/tdd.md:11-18`** — fix
   the Skill vs. Slash-Command mismatch (move files into
   `.claude/skills/` OR change invocations to `/test-list`, `/red`,
   `/green`).
   *Why:* the file claims the measurement pipeline parses these
   tool calls — wrong mechanism = silent zero metric across every
   run.

2. **`blueprints/exact-coding-autonomous/.claude/CLAUDE.md` (create)** —
   author lead instructions modeled on
   `autonomous/.claude/CLAUDE.md`.
   *Why:* without it, the blueprint has no entry point; nothing
   tells a session when to start the TDD loop, how to clarify, or
   how to choose experiment vs. HITL mode.

3. **`blueprints/exact-coding-autonomous/tests/` (create)** — scaffold a
   static test suite with `blueprint_contracts.py`.
   *Why:* the project-level Session Checklist mandates it; without
   it, every other check here regresses silently on the next edit.

4. **`blueprints/exact-coding-autonomous/.claude/agents/refactor.md:3,156`** —
   strip workflow coupling ("After Green phase", "Proceeding to
   next test"); use role-neutral language.
   *Why:* per `agent-design.md`, agent files must be reusable; the
   current refactor agent only works inside this exact TDD pipeline.

5. **`blueprints/exact-coding-autonomous/.claude/rules/tdd-experiment-mode.md:3`** —
   remove the phantom HITL override OR add the HITL workflow it
   claims to override.
   *Why:* the override framing is non-falsifiable today; a future
   reader can't tell which behaviors are baseline and which are
   experiment-only.
