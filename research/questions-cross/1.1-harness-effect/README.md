---
id: RQ-harness
question: "How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality and TDD discipline when model, workflow intention and prompt style are held constant?"
factors:
  workflow:
    - v6.2-with-why-cleaned
    - v6.2-with-why-cleaned-oc
    - v6.2-with-why-cleaned-pi
  kata_base:
    - claim-office
    - game-of-life
controls:
  model: opus-4-7-portkey-no-thinking
  prompt: example-mapping
outcomes:
  # primary: correctness (internal + external)
  - tests_passing
  - tests_total
  - verification_pct
  - verification_passed
  # code quality
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # TDD discipline (v6.2 cells only)
  - cycle_count
  - predictions_correct_rate
  - refactorings_applied
  # context
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-harness: Harness effect Claude Code vs OpenCode vs pi

## Motivation

Integrating OpenCode and pi as second and third harness immediately raises the question: does "the same run" behave measurably differently on all three harnesses? All three have different subagent/skill concepts, different tool choreography, different system-prompt libraries. A 1:1 translation of workflows between the harnesses is not possible.

This RQ measures the harness effect with full TDD mechanics: v6.2-with-why-cleaned (CC) vs v6.2-with-why-cleaned-oc (OC) vs v6.2-with-why-cleaned-pi (pi). Skills + subagent, prediction markers, refactor isolation — the harness-specific mechanics are active, and the effect should be maximally observable.

v1-oneshot variants were walking-skeleton material for the harness integration and are deliberately NOT included in this RQ — they say little about the interesting case (full TDD mechanics) and only ran in prose.

Same model (Opus 4.7 via Portkey-Vertex-EU, so that routing is identical as well), same prompt style (example-mapping), both katas (game-of-life for code quality, claim-office for correctness).

## Routing constancy (important point)

`controls.model: opus-4-7-portkey-no-thinking` means: **both harnesses route via Portkey-Vertex-EU**, with thinking disabled. The CC side does NOT run on the Direct Anthropic API, but on the same Portkey endpoint, so that the harness effect is not confounded with a routing effect (see memory [[opus-46-vs-47-not-equivalent]]).

Thinking is disabled because (a) the existing CC run base (n=8 on claim-office, n=9 on game-of-life) already runs on no-thinking and can be reused without a refill; (b) a first thinking smoke (n=3 per cell) showed a Claude Code harness glitch ("premature end_turn") that has to be investigated separately; (c) thinking has no discernible leverage for a harness comparison RQ.

All three workflows are testable on `opus-4-7-portkey-no-thinking` — no configuration in run-batch.sh needed, because the model is already listed in MODEL_CONFIGS and all three harnesses run via `.env`'s ANTHROPIC_CUSTOM_HEADERS resp. PORTKEY_API_KEY.

## Workflow triple

| CC workflow | OC workflow | pi workflow | Mechanics | TDD metrics? |
|---|---|---|---|---|
| v6.2-with-why-cleaned | v6.2-with-why-cleaned-oc | v6.2-with-why-cleaned-pi | Skills (test-list/red/green) + subagent (refactor) | Yes |

v6.2-with-why-cleaned-oc and -pi are structurally identical translations: test-list/red/green as skills (shared context), refactor as subagent (isolated context), same marker conventions, same why-blocks in green. The differences are only the harness syntax:

- **CC**: `.claude/commands/<name>.md` + `.claude/agents/refactor.md`, tools `Skill` and `Task`
- **OC**: `.opencode/skills/<name>/SKILL.md` + `.opencode/agents/refactor.md`, tools `skill` and `task`
- **pi**: `.pi/skills/<name>/SKILL.md` + `.pi/agents/refactor.md`. Tool `subagent` (via vendored extension) for refactor. **In pi, skills are auto-load documents, not tool calls** — the model reads SKILL.md once and then works freehand. Pi workflows therefore have to enforce **mandatory output markers** (`## Red`, `## Green`, `Red Phase Complete:` + prediction lines) in AGENTS.md, which the parser counts. See `experiments/workflows/MARKERS.md`.

## Existing data

None — all previous smokes ran on prose; this RQ runs on example-mapping. Skeleton smokes (v1-oneshot-*, v6.2-pi prose) remain in the pool as historical artifacts, but do not count for the selector.

6 cells (3 workflows × 2 katas), 5 replicates target → 30 runs entirely from scratch.

## Hypotheses

- **H1 (correctness harness-invariant)**: `tests_passing` and `verification_pct` show no systematic harness difference at constant model + workflow intention — if they do, that is a strong finding about harness bias beyond the system prompt.
- **H2 (token profile differentiated)**: `total_tokens` and `duration_seconds` show a harness difference — the system prompts and default tool choreography of the three harnesses differ in size and lead to measurable efficiency differences. **Precondition for interpreting H2**: pi workflows carry a structural token overhead because of the marker requirement in AGENTS.md (see notes below); it is *part* of the harness effect, but should remain identifiable in the diff.
- **H3 (Code Mass drift)**: `code_mass` and `cognitive_max` on game-of-life show a harness-typical style tendency (e.g. one harness consistently produces more compact/more expansive implementations).
- **H4 (TDD discipline harness-invariant)**: `cycle_count`, `predictions_correct_rate` and `refactorings_applied` in the v6.2 cells show no systematic harness difference — the marker conventions are translated structurally identically, and the parsers (`parse_opencode_transcript.py` with task detection, `parse_pi_transcript.py` with text-marker fallback) count the same events across all three harnesses.

## Methodological notes

- **Translation confound**: A "harness effect" in this RQ is always also a **prompt translation effect**. v6.2 has `.claude/commands/*.md` + `.claude/agents/refactor.md` + `.claude/rules/tdd.md`; v6.2-oc and v6.2-pi each have their `skills/*/SKILL.md` + `agents/refactor.md` + `AGENTS.md`. All three triples contain the same content, but every file is its own wording. If significant differences are found: diff the prompt files before interpreting and consider whether a word-choice drift explains the finding.
- **Subagent detection in the OC parser**: `parse_opencode_transcript.py` was extended to count `task` tool calls with a TDD-relevant `description`/`subagent_type` (e.g. `"refactor"`) as an equivalent skill invocation.
- **Skill and refactor detection in the pi parser**: pi skills are auto-load documents, not tool calls. `parse_pi_transcript.py` therefore counts `## Red`/`## Green`/`## Test List` markers in assistant texts as phases, and `subagent` tool calls with `agent: "refactor"` as refactorings. Mandatory output markers are stated in the respective AGENTS.md. If the markers are missing from the model output, `cycle_count` silently drops to 0 — spot-check per run before aggregation (see [[silent-zero-metric-bugs]]). The re-smoke on 2026-05-26 produced cycle_count=29 (=tests_total) and predictions_total=59, so marker discipline works on Opus 4.7. Before every new model on pi: smoke first, then fill.
- **Marker discipline costs tokens**: The v6.2-pi re-smoke under mandatory markers consumed 40 % more tokens and 21 % more wallclock than the first, marker-free smoke (~80 → 112 k tokens; ~22 → 26 min). In efficiency comparisons (H2), this writing overhead must be documented as a caveat — pi workflows carry it structurally, CC and OC do not.
- **TDD discipline metrics only for v6.2 cells**: v1 workflows deliver no TDD discipline metrics — `cycle_count`, `predictions_correct_rate` and `refactorings_applied` are 0/null there. The H4 hypothesis refers exclusively to the v6.2 comparison.
