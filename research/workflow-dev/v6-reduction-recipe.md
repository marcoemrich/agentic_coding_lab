# hybrid-v1 Reduction Recipe — Preserved Steps for Re-Test on a Repaired Base

## Purpose

The original hybrid-v1 reduction chain (`exact-hybrid-v1-cc` → `v6.5-lean` → … → `v6.6-leaner`) was
largely **measured on a correctness-defective base**. RQ-regression
([5.1-correctness-regression](5.1-correctness-regression/findings.md), F-regression.1) locates
the break at the jump **exact-hybrid-v1-cc → v6.5-lean**: `verification_pct` on `claim-office-example-mapping`
drops from 1.00 to 0.38 (opus-4-7-no-thinking) and is not repaired by any subsequent iteration. All
v6.5.x quality wins are validly measured, but on a workflow that systematically produces
wrong results on novel code.

The new base **`exact-hybrid-v2-testlist-fix-cc`** = `exact-hybrid-v1-cc` + testlist-scope-fix (port
of the proven subagents-v1→subagents-v2 fix into the test-list, see [RQ-testlist-fix](5.2-exact-subagents-v2-testlist-fix-cc/findings.md)).
`exact-hybrid-v1-cc` itself stays active as the verified 1.00-correctness full form and source.

The scope fix of the new base affects two files (diff against `exact-hybrid-v1-cc`): `commands/test-list.md`
("cover every rule/example/❓ + expected values" instead of "base functionality ONLY") and `rules/tdd.md`
(two leftover "BASE FUNCTIONALITY ONLY" remnants removed, so that the phase description is consistent
with the test-list scope). The same two `tdd.md` remnants were also cleaned up in `exact-subagents-v2-testlist-fix-cc`
— the test-list agent there was scope-fixed, the `tdd.md` description was not.

This document preserves **every reduction step of the old chain as a re-applicable recipe**,
so that the steps can be tested again on the new base. The archived workflow files
live under `experiments/workflows/_archive/` and remain traceable via `diff` against the new base.

## Important precondition

Before re-applying any step: read `experiments/workflows/MARKERS.md`. All archived
steps have documented their marker integrity in their respective `CHANGES.md` — when rebuilding on
a new base, check again.

## Tension MARKERS.md ↔ RQ-regression (important)

`MARKERS.md` lists "Psychological Resistance" sections and "Why this discipline works" pep talks as
**decorative / safe to drop** (purely parser-side view: they drive no marker). RQ-regression
(F-regression.3), by contrast, suspects exactly the **why rewrites** in `tdd.md` / `red.md` Step 7 /
`green.md` as the correctness culprits (behaviour-side view). Both are right: the rewrites zero no
metric, but they change model behaviour on novel katas. Lesson: "parser-safe" ≠ "behaviour-neutral".

## Reduction steps (order = old chain)

Each step names: affected files + section headers, original measurement base, known effect (RQ),
and whether it was measured on the **defective** base.

### Single cuts (branches of exact-hybrid-v1-cc, one aspect each)

| Step | Files / section | Effect | RQ | Base |
|---|---|---|---|---|
| `-app` | `refactor.md` + `tdd.md`: APP (Absolute Priority Premise) mass heuristic removed | correctness 1.00 (no effect) | [RQ-app](2.1-app-effect/) | exact-hybrid-v1-cc (intact) |
| `-rules` | `refactor.md` + `tdd.md`: Four-Rules-of-Simple-Design block removed | correctness 1.00 (no effect) | [RQ-rules](2.2-rules-effect/) | exact-hybrid-v1-cc (intact) |
| `-pep` | `green.md` + `red.md`: "Psychological Resistance" pep talks removed | correctness 1.00 (no effect) | [RQ-pep](2.3-pep-effect/) | exact-hybrid-v1-cc (intact) |
| `-emoji` | **5 files** (`refactor/green/red/test-list/tdd`): emojis removed — **not a pure single cut** | marginal (0.93, n=3); no cross-model signal | [RQ-emoji](2.4-emoji-effect/), [RQ-emoji-cross-model](2.5-emoji-cross-model/) | exact-hybrid-v1-cc (intact) |

The four single cuts tested in isolation hold correctness on claim-office (opus-4-7) — they are
**not** the regression culprit (F-regression.2). They can be re-applied on the new base without
correctness risk.

### The bundle jump (source of the regression)

| Step | Files / section | Effect | RQ | Base |
|---|---|---|---|---|
| **`-why-rewrites`** | `tdd.md` (checklist + "Core TDD Principles" + "Remember" removed, "Why skills required" block added), `red.md` Step 7 (why block + parser rationale), `green.md` ("Minimal Implementation Strategies" + "Psychological Resistance" → "Why minimality matters") | **correctness culprit** — 1.00 → 0.38 on claim-office | [RQ-regression](5.1-correctness-regression/) F-regression.3 | exact-hybrid-v1-cc → **v6.5-lean** |
| `-project-standards` | `refactor.md`: hexagonal / DI / named-exports block removed | **never tested in isolation** | (open) | inside the v6.5-lean bundle |

`v6.5-lean` bundled all four single cuts **plus** these two skill-creator structural rewrites into
**one** step. Since the single cuts are uncritical, the why rewrites (prime suspect) and
the never-isolated project-standards cut remain as causes. **When rebuilding on the new base: test the why rewrites and
the project-standards cut individually and with a claim-office smoke run, do not bundle them again.**

### Optimisation chain after the break (all measured on the defective base!)

| Step | Files / section | Effect (on game-of-life) | RQ | Base |
|---|---|---|---|---|
| commands→skills | `commands/{red,green,test-list}.md` → `skills/<name>/SKILL.md` + frontmatter; mandatory-procedure preamble; "Wrong Predictions Are Data"; refactor decoupling; rationale additions | audit alignment; **fixed a latent marker-1 bug** (Skill tool did not find commands/) | [RQ-audit](3.1-orchestration-audit/) | v6.5-lean → v6.5.1 |
| `-bullets` (all 3) | `refactor.md` "Remember" + "Important Guidelines" DO/DON'T, `red/SKILL.md` DO/DON'T removed | quality ↑ (cognitive_max −29 %), cost −15 %, but discipline σ ↑ | [RQ-bullets](3.2-bullets-cut/) | v6.5.1 → v6.5.2 |
| targeted (2 of 3) | like bullets, but `refactor.md` "Remember" **kept** (floor-anchor candidate) | quality win + floor back, but pred rate 95.8 % | [RQ-targeted](3.3-targeted-cuts/) | v6.5.1 → v6.5.3 |
| refactor-cut (only 10b) | only `refactor.md` mid-file DO/DON'T removed; "Remember" + `red/SKILL.md` DO/DON'T kept | isolated quality win without floor/pred loss → default quality champion | [RQ-refactor-cut](3.4-refactor-cut-only/) | v6.5.1 → v6.5.4 |
| skills→commands revert + trim | `skills/` back to `commands/`; AUDIT.md/CHANGES.md removed; `red.md` 138→124, `test-list.md` 110→71, `refactor.md` 254→249 | leanest variant | [RQ-lean](2.6-lean-validation/) | v6.5.4 → hybrid-v6 |

**Critical limitation:** The entire chain from v6.5.1 onwards was measured only on game-of-life (no
external verification suite, F-regression.4). Its quality/discipline findings are valid as measurements,
but the workflow was correctness-defective. On the new base these steps are to be repeated **with a
claim-office correctness smoke run** before any "champion" is crowned (F-regression.5).

## Re-test order (proposal, not yet triggered)

1. Verify the new base `exact-hybrid-v2-testlist-fix-cc` on claim-office-EM × opus-4-7 (target ≈ 1.0).
2. Why rewrites in isolation on the new base (the suspect step first).
3. Project-standards cut in isolation (never tested before).
4. Remaining optimisation steps (bullets/targeted/refactor-cut), each with a claim-office n=3 smoke run.

For each step the methodology lesson from F-regression.5 applies: **at least one correctness sample on
a kata with an external verification suite**, even if the RQ primarily investigates code quality.

## Archive references

All old workflow files: `experiments/workflows/_archive/v6.1-no-app … v6.6-leaner`. The step documentation
additionally lives in the respective `CHANGES.md` / `AUDIT.md` (v6.5.1–v6.5.4). Existing runs of the old
variants remain analysable in `experiments/runs/` (they carry their `.claude/` definition copied in).
