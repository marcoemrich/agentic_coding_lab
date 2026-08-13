# Experiment Overview: TDD Workflows × Models × Prompt Styles

As of: 2026-08-13. This report covers **20 research questions and 973 runs**. The lab's run pool holds 1323 runs in total; the difference is the `research/workflow-dev/` subtree (15 questions, 375 runs), which is deliberately not reported here — it develops the measuring apparatus itself (workflow variants, prompt reductions, refactor mechanics) and is hard to read without the workflow version history. Those questions and their findings are versioned in the repository under `research/workflow-dev/`.

**Author:** [Marco Emrich](https://www.linkedin.com/in/marco-emrich) (codecentric AG) — co-initiator of [EXACT Coding](https://leanpub.com/exact-coding) together with Ferdinand Ade.

**Repository:** [github.com/marcoemrich/agentic_coding_lab](https://github.com/marcoemrich/agentic_coding_lab) — all scripts, workflow definitions, run artifacts and the stylesheet are publicly versioned there.

## About the Study

This lab is the empirical validation platform for [**EXACT Coding**](https://leanpub.com/exact-coding) — EXample-guided AI-Collaborative Test-driven Coding. The method's claim is that an AI agent produces better code when it is given concrete input/output examples rather than prose, and when it is held to a test-driven cycle rather than left to implement freely. That claim is testable, and the lab tests it by running the same coding tasks through a spectrum of agent workflows: from vibe-coding baselines that implement in one shot and add tests afterwards, through EXACT-conformant setups that decompose the work into an explicit test list and a red-green-refactor cycle, to a delayed-refactor control that vibe-codes first and cleans up once at the end. Every configuration is run repeatedly, and the resulting code is measured — not judged.

This snapshot reports 20 research questions over 973 runs, as of 2026-08-13. The two core claims of the method hold, but on separate targets: concrete examples and a test-writing phase carry correctness, while an enforced refactor cadence carries code quality — neither substitutes for the other. The current research front has moved from *whether* structure helps to *how much of it is still worth paying for*: the newest model generation reaches, without any workflow structure at all, complexity levels that the previous generation needed the full architecture to achieve. A second open front is the agent CLI itself — the same model, prompt and workflow now run across four different CLIs, and they differ by more than a factor of two in cost at indistinguishable correctness.

### Scope

Everything below holds **for** a specific stack, and the three axes of that stack should be read before any number is transferred elsewhere.

**Harness.** Four agent CLIs, each pinned in `experiments/docker/Dockerfile`: Claude Code `2.1.170`, OpenCode `1.15.10`, pi `0.81.1`, and cursor-agent `2026.07.23-e383d2b`. All run **headless, with no human in the loop** — the agent receives the task once and works to completion or to its budget without a single clarifying question.

**Models.** About forty model configurations across ten provider families: Anthropic (Opus 4.6/4.7/4.8/5, Sonnet 4.6/5, Haiku 4.5, Fable 5), OpenAI (GPT-5.6 sol/terra), Google (Gemini 3.5 Flash), DeepSeek, Zhipu (GLM 5.1/5.2), Moonshot (Kimi K2.6/K2.7/K3), MiniMax, Mistral, xAI (Grok) and Alibaba (Qwen3), plus Cursor's own Composer 2.5. Most are covered with reasoning both enabled and disabled. Routing is via Requesty for the third-party models; the Anthropic models run natively or via the same gateway.

**Target language.** Exclusively **TypeScript**, with an identical per-run stack: pnpm, tsx, Vitest, ESLint with the SonarJS plugin. Every complexity and smell figure in this report is produced by that toolchain.

Two limits follow directly and are worth stating up front. First, transfer to other target languages is untested — a cognitive-complexity threshold that separates workflows on TypeScript may not separate them on Python or Java. Second, and more consequential: **these numbers bound unattended autonomy, not supervised use.** Several of the correctness losses documented below are failure modes that a single human question would have caught — an agent stopping early while convinced it was done, a test list that silently omitted half the specification, a CLI contract guessed rather than confirmed. A developer working interactively with the same model and the same prompt would very likely not lose those scenarios. Read the correctness figures as a floor for what an agent does when nobody is watching, not as a ceiling for what it can do with someone watching.

### AI Disclosure

This snapshot was produced with the `/build-overview` skill in **Claude Code**. Data-driven sections — the RQ overview table, coverage values, per-RQ finding lists, reproducibility and files tables — are generated deterministically from `research/questions-*/*/{README,findings}.md` via `experiments/generate-snapshot-skeleton.py`. Synthesis sections (intro, per-RQ paragraphs, cross-RQ synthesis, limitations) are LLM-drafted and human-curated. The generation is therefore fully traceable.

## Key Findings

Five key findings from the 20 research questions — details and evidence in §4, cross-RQ synthesis in §5. The through-line: the two core building blocks of the method work, but on **separate targets** — concrete examples and a test-writing phase carry correctness, an enforced refactor cadence carries code quality, and neither substitutes for the other. Both levers are now being renegotiated from underneath, because the newest model generation supplies for free much of what the workflow apparatus was built to enforce.

1. **EXACT Coding works — the combination of example mapping and tests-against-spec
measurably beats vibe coding.** On the novel kata, Correctness (external) falls from ≥ 0.96 to 0.28 as soon as work proceeds by vibe coding without a test-writing phase; example mapping as a spec style raises it by a further +48–76 percentage points over prose. Both correctness levers are the *specification* (concrete I/O examples) and the *formulation as tests against that specification* — not the red-green-refactor cycle itself, since even an agent told only "use TDD" reaches full correctness once it writes tests. Practical consequence: on novel domains, concrete I/O examples plus a test-writing phase are the most valuable correctness investment.

2. **An enforced refactor cadence measurably improves code quality — the "TDD" label does
not.** On the novel kata, a workflow with a periodic, isolated refactor step lowers the complexity peak to ~⅓ and the Smell Total to ~1/10 of vibe coding (`cognitive_max` 5.7 against 11–12, Smell Total 1.3 against 12–16). The lever is the cadence, not the name: an agent that only hears "use TDD" and structures the process itself produces the heaviest code in the entire matrix (`cognitive_max` 19.8) — worse than no TDD at all. Practical consequence: for long-lived code, a workflow with an enforced cleanup step per cycle pays off; a mere "do it in TDD" instruction does not.

3. **Example mapping is the dominant correctness lever on novel tasks — user story ≈
prose.** Example mapping raises `verification_pct` by +48–76 percentage points over prose on the strong models (Opus 4.7: 0.21 → 0.97; Opus 4.6: 0.23 → 0.87; Sonnet 4.6: 0.23 → 0.71), because concrete input/output pairs resolve the domain ambiguities. User story performs practically identically to prose (Δ ≤ 8 pp, no consistent direction). Two boundaries: on a training-known kata the effect is nil, and the lever is model-gated — a model too weak for the task stays at 0 % in every style. Practical consequence: when writing a spec for a novel domain, concrete I/O pairs are the most valuable investment; rewriting prose as user stories buys nothing.

4. **The model generation now moves code quality as much as the entire workflow apparatus
does.** Measured on the same architecture axis across two model generations: structureless TDD on the newer model reaches `cognitive_max` 5.4 on the novel kata — essentially the value the hybrid architecture needed on the previous generation (5.71) — and its Smell Total drops from 16.8 to 0.0 across all ten runs. The architecture ranking still holds, but the margin it buys is shrinking while its price does not: the most elaborate configuration costs 34× the tokens and 19× the wallclock of the plain baseline. Practical consequence: re-measure how much structure your current model still needs instead of carrying a workflow forward on reputation.

5. **"Use TDD" does not produce TDD.** Under a bare instruction with no enforced phases,
70 of 71 runs do open with a test — but only one model of six works in genuine TDD-sized steps, four never refactor at all, and in 31 % of runs the tests are never executed before the implementation exists, so no red state is ever observed. The typical run writes ~13 expectations before its first line of code. Of 60 refactoring claims, 14 survived hand validation. Practical consequence: an agent reporting that it worked test-first is reporting the ordering, not the discipline — if the cycle matters to you, the workflow has to enforce it and the artifact has to be measured.

---

## 1. Research Questions Overview

### Research Questions (Claude Code)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-prompt-correctness](research/questions-claude/1.1-prompt-style-correctness/) | Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent? | aktiv | 24 | 24/24 (100 %) | 129 |
| 1.2 | [RQ-prompt-known-kata](research/questions-claude/1.2-prompt-style-known-kata/) | Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent? | aktiv | 9 | 9/9 (100 %) | 45 |
| 2.1 | [RQ-model-quality](research/questions-claude/2.1-model-effect-code-quality/) | How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow? | aktiv | 12 | 12/12 (100 %) | 44 |
| 2.2 | [RQ-model-novel](research/questions-claude/2.2-model-effect-novel-kata/) | How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life? | aktiv | 5 | 5/5 (100 %) | 30 |
| 3.1 | [RQ-workflow-model](research/questions-claude/3.1-workflow-model-interaction/) | Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model? | aktiv | 6 | 6/6 (100 %) | 49 |
| 4.1 | [RQ-tdd-quality](research/questions-claude/4.1-tdd-effect-code-quality/) | How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference? | aktiv | 16 | 16/16 (100 %) | 103 |
| 4.2 | [RQ-tdd-correctness](research/questions-claude/4.2-tdd-effect-correctness/) | Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata? | aktiv | 7 | 7/7 (100 %) | 36 |
| 4.3 | [RQ-context](research/questions-claude/4.3-tdd-context-engineering/) | Which form of context structuring — isolated subagent contexts per TDD phase (v4.1), a shared, accumulated single context (v5.1), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (v6.1), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (v7.1) — leads to better code quality? | aktiv | 4 | 4/4 (100 %) | 21 |
| 4.4 | [RQ-pocock-vs-v62](research/questions-claude/4.4-external-tdd-pocock-vs-v62/) | How does the external Matt Pocock TDD skill (v9-pocock-tdd: single skill, inline phases, tail refactor) perform on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned (multi-command + refactor subagent, per-cycle refactor) — on correctness, code quality, TDD discipline and cost? | aktiv | 2 | 2/2 (100 %) | 11 |
| 4.5 | [RQ-architecture-axis-opus5](research/questions-claude/4.5-architecture-axis-opus5/) | Does the TDD architecture axis (v3 structureless / v5.1 single context / v6.1 hybrid / v6.6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer? | open | 16 | 16/16 (100 %) | 97 |
| 5.1 | [RQ-stability](research/questions-claude/5.1-workflow-stability/) | How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count? | aktiv | 6 | 5/6 (83 %) | 59 |

### Research Questions (OpenCode)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-oc](research/questions-opencode/1.1-model-quality-oc/) | How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the v5.1-testlist-scope-fix-oc workflow? | aktiv | 6 | 6/6 (100 %) | 30 |
| 1.2 | [RQ-model-novel-oc](research/questions-opencode/1.2-model-novel-kata-oc/) | How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the v5.1-testlist-scope-fix-oc workflow? | aktiv | 8 | 8/8 (100 %) | 40 |

### Research Questions (pi)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-pi](research/questions-pi/1.1-model-quality-pi/) | How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the v6.2.1-phase-continuation-pi workflow? | aktiv | 12 | 12/12 (100 %) | 60 |
| 1.2 | [RQ-model-novel-pi](research/questions-pi/1.2-model-novel-kata-pi/) | How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the v6.2-with-why-cleaned-pi workflow? | aktiv | 18 | 18/18 (100 %) | 90 |

### Research Questions (Cursor CLI)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-cursor](research/questions-cursor-cli/1.1-model-quality-cursor/) | How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping? | aktiv | 3 | 2/3 (67 %) | 10 |

### Research Questions (cross-harness)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.2 | [RQ-harness-requesty](research/questions-cross/1.2-harness-requesty/) | How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant? | aktiv | 6 | 6/6 (100 %) | 30 |
| 1.3 | [RQ-cost-sol-pi-vs-opus-cc](research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/) | How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas? | aktiv | 4 | 4/4 (100 %) | 20 |
| 1.4 | [RQ-model-quality-cc-vs-pi](research/questions-cross/1.4-opus-cc-vs-pi/) | Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (v6.2)? | aktiv | 4 | 4/4 (100 %) | 20 |
| 1.5 | [RQ-v3-emergent-tdd](research/questions-cross/1.5-v3-emergent-tdd/) | Under a bare 'use TDD' instruction that prescribes no phase markers (v3), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated? | open | 10 | 10/10 (100 %) | 49 |

---

## 2. Experiment Design

### 2.1 Variables

**Workflow** — six generations (details: `research/workflow-dev/workflow-construction.md` — inventory):

| Workflow | Structure | TDD strictness |
|---|---|---|
| v1-oneshot                              | "Implement X." | none |
| v2-iterative                            | "Plan step by step, then implement." | none |
| v3-basic-tdd                            | Inline TDD, no skill/subagent (self-reporting) | minimal |
| v4-exact-subagents                      | Dedicated subagent per phase (predictor + red/green/refactor), fresh context | strict, multi-context |
| v4.1-testlist-scope-fix                 | v4 with test-list scope patch | strict, multi-context |
| v5-exact-single-context                 | All phases in one conversation, same phase script | strict, single-context |
| v5.1-testlist-scope-fix                 | v5 with test-list scope patch (aligned with v4.1) | strict, single-context |
| v6-hybrid                               | Hybrid: inline TDD + only refactor as subagent | strict, hybrid |
| v6.1-hybrid-testlist-scope-fix          | v6-hybrid with test-list scope patch (current default base) | strict, hybrid |
| v6.1-no-pep                             | v6.1 without pep talks (RQ-pep replication) | strict, hybrid |
| v7-hybrid-green-refactor                | Like v6, but green *and* refactor as subagent | strict, more isolation |
| v7.1-hybrid-green-refactor-testlist-scope-fix | v7 with test-list scope patch | strict, more isolation |
| v8a-delayed-refactor-agent              | Oneshot → tests added afterwards → single end-refactor agent (`refactor.md` from v6.5.4) | delayed-refactor |
| v8b-delayed-refactor-native             | Like v8a, but native inline refactor in v3 style, no agent | delayed-refactor |

Configuration: `experiments/workflows/<variant>/.claude/agents/` and `.claude/rules/`. Archived variants (v5.1-minimized, v6.2–v6.6, v6.5.x audits) live under `experiments/workflows/_archive/`.

**Workflow mechanics in detail.** The six generations are not merely a scale of "more/less TDD", but a systematic variation of the EXACT Coding building blocks (test list, red, green, refactor) and their context architecture:

- **v1-oneshot / v2-iterative — vibe-coding baselines (no TDD).** A single agent reads the requirements and writes code in one step (v1) or with an explicit plan/checklist (v2); tests are only added afterwards based on the example mapping. Serves as the yardstick for the value of TDD itself (see `experiments/workflows/v1-oneshot/.claude/rules/experiment-mode.md`).
- **v3-basic-tdd — minimal TDD without structure.** A single agent with the minimal instruction "use TDD" — no phase prompts, no subagents. Claude decides on its own how to structure the TDD process. Measures how far a bare request carries (`v3-basic-tdd/.claude/rules/experiment-mode.md`).
- **v4-exact-subagents / v4.1-testlist-scope-fix — strict TDD, multi-context.** Every TDD phase runs as a specialized subagent in an **isolated context** (`Task(subagent_type: "red")` etc.): `test-list` → `red` → `green` → `refactor`. Hypothesis: isolated contexts enforce discipline, but can lose state between phases. v4.1 adds to the `test-list` subagent the obligation "Cover every spec example" — closing the dominant failure mode on novel katas (incomplete test list) on Opus 4.7.
- **v5-exact-single-context / v5.1-testlist-scope-fix — strict TDD, single-context.** Identical phase script to v4, but all phases run in the **same context** as skill calls (`Skill(skill: "red")` etc.) instead of subagents. Hypothesis: shared context preserves state, but can lead to loss of discipline. v5.1 mirrors v4.1 with the identical test-list scope patch.
- **v6-hybrid / v6.1-hybrid-testlist-scope-fix — hybrid with isolated refactor.** Red and green run inline as skills in the shared context (like v5), refactor runs as an isolated subagent (like v4). Hypothesis: combines the spec coherence of the single context with the discipline sharpening of subagent isolation at the most critical point (refactor). v6.1 is the current default base and champion across several RQs. `v6.1-no-pep` tests removing psychological rationales in red/green.
- **v7-hybrid-green-refactor / v7.1-…-testlist-scope-fix — hybrid with isolated green + refactor.** In addition to the refactor isolation from v6, green also runs as an isolated subagent. Test list and red remain in the shared context. Tests whether more isolation is automatically better (Pareto-dominated by v6 on game-of-life: saves tokens, loses quality and correctness).
- **v8a-delayed-refactor-agent / v8b-delayed-refactor-native — delayed-refactor control.** Three sequential phases without TDD cycles: (1) oneshot implementation, (2) tests added afterwards against `prompt.md` with a coverage obligation, (3) a single end refactor. v8a uses the `refactor.md` subagent from v6.5.4 (APP + naming + mandatory attempt), v8b a native inline refactor in v3 style without an agent. Serves as the control axis for the hypothesis "periodic TDD refactor beats end refactor after vibe coding".

Deeper mechanics discussion, the inventory of the active v6.1 reduction line and the load-bearing RQ findings are in `research/workflow-dev/workflow-construction.md`. Which markers drive the parsing of the TDD metrics is documented in `experiments/workflows/MARKERS.md`. The archived v6.5.x line lives in `experiments/workflows/_archive/`.

**Model × thinking** (lab variant IDs from `MODEL_CONFIGS` in `experiments/docker/run-batch.sh`):

| Lab variant ID | API ID | Thinking | Routing |
|---|---|---|---|
| `opus-4-7`                       | `claude-opus-4-7`                              | Adaptive | Direct |
| `opus-4-7-no-thinking`           | `claude-opus-4-7`                              | off      | Direct |
| `sonnet-4-6`                     | `claude-sonnet-4-6`                            | Extended | Direct |
| `sonnet-4-6-no-thinking`         | `claude-sonnet-4-6`                            | off      | Direct |
| `haiku-4-5`                      | `claude-haiku-4-5-20251001`                    | Extended | Direct |
| `haiku-4-5-no-thinking`          | `claude-haiku-4-5-20251001`                    | off      | Direct |
| `opus-4-7-portkey`               | `@vertex-eu-global/anthropic.claude-opus-4-7`  | Adaptive | Portkey |
| `opus-4-7-portkey-no-thinking`   | `@vertex-eu-global/anthropic.claude-opus-4-7`  | off      | Portkey |
| `opus-4-6-portkey`               | `@vertex-ai/anthropic.claude-opus-4-6`         | Adaptive | Portkey |
| `opus-4-6-portkey-no-thinking`   | `@vertex-ai/anthropic.claude-opus-4-6`         | off      | Portkey |
| `sonnet-4-6-portkey`             | `@vertex-ai/anthropic.claude-sonnet-4-6`       | Extended | Portkey |
| `sonnet-4-6-portkey-no-thinking` | `@vertex-ai/anthropic.claude-sonnet-4-6`       | off      | Portkey |
| `haiku-4-5-portkey`              | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | Extended | Portkey |
| `haiku-4-5-portkey-no-thinking`  | `@vertex-ai/anthropic.claude-haiku-4-5@20251001` | off      | Portkey |

Direct and Portkey routings of the same model are separate variants and only count as a shared cell via an explicit `controls.model: {any: [...]}` clause per RQ.

**Kata × prompt style** (active katas in `experiments/katas/`):

| Kata base | Prompt styles | Verification suite | Note |
|---|---|---|---|
| game-of-life      | prose, example-mapping, user-story | no   | Code quality, large (~40 LoC), vitest-based |
| game-of-life-cli  | prose, example-mapping, user-story | yes  | CLI variant with external acceptance suite |
| mars-rover        | prose, example-mapping, user-story | no   | medium (~30 LoC), vitest-based |
| claim-office      | prose, example-mapping, user-story | yes  | Correctness, novel insurance domain (HPSMV/MHPCO), 15 scenarios |
| claim-office-lite | prose, example-mapping, user-story | yes  | Reduced claim-office variant (10 scenarios) for code-quality research |

Prompt styles:
- **prose**: description of the rules in prose, no test examples.
- **example-mapping**: rule + 1–3 concrete input/output examples per rule.
- **user-story**: "As X I want Y so that Z" — description without examples.

### 2.2 Workflow → prompt mapping

For methodological symmetry (see top-level `README.md`, section 'Methodology constraints'):

| Workflow | Allowed prompt styles | Rationale |
|---|---|---|
| v1, v2 | prose only | Test examples in example-mapping would be a hidden test gift for non-TDD workflows → unfair towards the TDD workflows. |
| v3, v4(.1), v5(.1), v6(.1), v7(.1), v8a/b | all three | Examples serve as natural test cases — for TDD/refactor workflows that is the ideal form of the task. |

---

## 3. Methodology

The pipeline below was verified against `experiments/docker/Dockerfile`, `experiments/analyze-run.sh` and `experiments/aggregate-by-query.py` on 2026-08-13 and is current. One clarification on step 4: the headless invocation shown is the Claude Code form; the other three harnesses are invoked through their own CLIs with the same prompt and the same run directory. Mutation testing is deliberately **not** part of `analyze-run.sh` — it is expensive (minutes per run) and runs as a separate opt-in step via `experiments/compute-mutation-score.py`, only for research questions that declare `mutation_score` as an outcome.

### 3.1 Run pipeline

1. Container image `docker-batch` (Node 22 slim, claude-code 2.1.170 / opencode 1.15.10 / pi 0.81.1 / cursor-agent pinned) is started.
2. Run dir `runs/<timestamp>_<kata>_<workflow>_<model>/` is created; workflow config (`.claude/agents/`, `.claude/rules/`) and kata prompt (`prompt.md`) are copied into it.
3. pnpm workspace set up with TypeScript, Vitest, ESLint+SonarJS.
4. `claude --print "$(< prompt.md)"` runs headless, without HITL.
5. `analyze-run.sh` writes `metrics.json` and `analysis-report.md`.
6. `aggregate-by-query.py <RQ>/` builds `runs.csv` and `summary.md` per RQ.

### 3.2 Collected metrics

Binding terms (column "Term") are defined in the top-level `README.md` — alternative synonyms are forbidden because they collide or are ambiguous. Full metric table including external references (Stryker, SonarJS, McCabe paper etc.) in the README section "Metrics".

**Correctness**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `tests_passing` | Correctness (internal) | Boolean: do the Vitest tests written by the agent pass at the end of the run? | `true` = better |
| `verification_pct` | Correctness (external) | Share of passed verification scenarios from an external acceptance suite the agent never gets to see (0.0–1.0). Only for CLI katas with a `<basename>-verification/` directory. | higher = better |

**Efficiency**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `duration_seconds` | — | Wallclock seconds of the `claude --print` run including all subagent spawns | lower = better |
| `total_tokens` | — | Sum of all tokens (input + output + cache) across all subagent spawns | lower = better |
| `context_utilization_pct` | — | Final context-window utilization in the main context, in percent | informative |

**Code Mass & size**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `code_mass` | Code Mass (APP) | Weighted sum of production-code constructs (constants, invocations, conditionals, loops, assignments — graded weights by complexity) per the *Absolute Priority Premise* (Micah Martin). Compares implementations more objectively than raw LoC. | lower = better |
| `cc_loc` | Production LoC | Production LoC excluding tests, from the clean-code reporter | lower = better (at equal correctness) |
| `test_lines` | Test LoC | Number of lines of test code (Vitest) | informative |
| `tests_total` | — | Number of tests written by the agent | informative |

**Code quality (ESLint + SonarJS)**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `cc_longest_function` | Complexity Peak | Longest function in lines — proxy for the worst spot in the code | lower = better |
| `cc_avg_loc_per_function` | — | Mean function size in lines | lower = better |
| `cc_median_loc_per_function` | — | Median function size (robust against single long outliers) | lower = better |
| `cc_functions` | — | Number of functions | informative |
| `mccabe_max` / `mccabe_avg` / `mccabe_high_count` | — | McCabe cyclomatic complexity per function: maximum, mean, count above threshold. Classic branching metric. | lower = better |
| `cognitive_max` / `cognitive_avg` / `cognitive_high_count` | — | SonarSource cognitive complexity per function: weights nesting and control-flow breaks more heavily than McCabe, closer to humanly perceived complexity. The diagnostically load-bearing main metric of this study. | lower = better |
| `smell_total` | Smell Total | Aggregated number of ESLint+SonarJS violations across all rules | lower = better |
| `smell_complexity` | — | Subset of `smell_total`: cognitive-complexity, max-depth, max-lines-per-function, max-params, no-nested-switch | lower = better |
| `smell_magic_numbers` | — | Subset: ESLint `no-magic-numbers` violations | lower = better |
| `smell_duplication` | — | Subset: SonarJS `no-duplicate-string` and related duplication rules | lower = better |
| `smell_code_quality` | — | Subset: SonarJS `no-collapsible-if`, `no-redundant-jump` etc., plus ESLint `no-unreachable` | lower = better |
| `coverage_statements_pct` | — | Statement coverage of the tests written by the agent (in %) | higher = better |
| `coverage_branches_pct` | — | Branch coverage of the tests written by the agent (in %) | higher = better |

**Test strength**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `mutation_score` | Mutation Score | Share of Stryker mutants killed by the agent's test suite (0.0–1.0): `(Killed + Timeout) / (Killed + Survived + Timeout + NoCoverage)`. Hidden metric — appears in no workflow prompt and is therefore Goodhart-resistant. Opt-in per RQ, only for `tests_passing = true`. | higher = better |

**TDD discipline** (from `transcript.jsonl` + `transcript-subagents/`; driven by four markers in `experiments/workflows/MARKERS.md` — if a marker is missing, the corresponding metric silently drops to zero)

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `cycle_count` | — | Number of red-green-refactor cycles per run | informative (higher = more finely decomposed) |
| `refactorings_applied` | — | Number of explicitly applied refactoring steps | higher = better (for TDD workflows) |
| `predictions_correct` / `predictions_total` | — | Red-phase predictions about compile/runtime failure: correct vs. total. Depth of the agent's code understanding. 1–2 predictions per cycle depending on workflow. | ratio higher = better |
| `tests_passed_immediately` | — | Number of tests already green in the red phase — indicator of over-implementation in previous green phases | lower = better |
| `avg_red_seconds` / `avg_green_seconds` / `avg_refactor_seconds` | — | Mean phase duration per cycle | informative |

### 3.3 Evaluation principles

- **Correctness first**: a run with `tests_passing=false` does not count as an equivalent solution.
- **Aggregate per kata**: workflow×model tables are formed exclusively per kata.
- **Effect threshold**: at n=1 per cell, only differences with a factor ≥ 2 or clearly separated σ bands are considered robust.

---

## 4. Results

### Research Questions (Claude Code)

#### 1.1 RQ-prompt-correctness — Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent?

_Data basis: 129 runs · Coverage: 24/24 cells (100 %) at min_replicates=5._

**Correctness (external) by Model × Prompt Style × Thinking** — values are mean `verification_pct`, higher = better; 🏆 = best style per row (Haiku rows: no effect, all values ~0 → no winner).

| Model | Mode | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.13 |
| opus-4-6 | +thinking | 0.24 | **0.72** 🏆 | 0.22 |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | — |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |

n=5 each (opus-4-6 EM n=4; opus-4-7 −thinking EM n=9). Routing: opus-4-7 Direct API, the rest Portkey.

**Findings**:

- **F-prompt-correctness.1** — Weak Models Fail Regardless of Prompt Style
- **F-prompt-correctness.2** — Example Mapping Raises Correctness Massively
- **F-prompt-correctness.3** — Thinking Hurts with Example Mapping (Sonnet > Opus)
- **F-prompt-correctness.4** — User Story ≈ Prose, No Measurable Effect on Correctness
- **F-prompt-correctness.5** — Spread with Example Mapping Is Model-Dependent

Example mapping is the single largest correctness lever measured anywhere in this study: on the novel kata it lifts `verification_pct` by 48–76 percentage points over prose (Opus 4.7: 0.21 → 0.97). Concrete input/output pairs resolve the domain ambiguities that prose leaves open. User story behaves like prose (Δ ≤ 8 pp, no consistent direction) — the "As X I want Y" framing adds no examples, so it adds no correctness. The lever is model-gated: Haiku 4.5 stays at 0.00 in all six cells, so a model too weak for the task cannot be prompted into solving it. Details: [findings.md](research/questions-claude/1.1-prompt-style-correctness/findings.md).

#### 1.2 RQ-prompt-known-kata — Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent?

_Data basis: 45 runs · Coverage: 9/9 cells (100 %) at min_replicates=5._

**Correctness (external) by Prompt Style × Model** — higher = better; 🏆 = best style per row (Opus/Sonnet: all three styles tied at 1.00 → ties, all 🏆).

| Model | prose | user-story | example-mapping |
|---|---|---|---|
| opus-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| sonnet-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| haiku-4-5-portkey-no-thinking | 0.24 (σ=0.43) | 0.00 (σ=0) | **0.63** 🏆 (σ=0.51) |

**Findings**:

- **F-prompt-known-kata.1** — Opus and Sonnet Deliver Perfect Correctness Regardless of Style
- **F-prompt-known-kata.2** — Haiku Fails Due to Capacity, Not Style
- **F-prompt-known-kata.3** — H1 Confirmed: Prompt Style Does Not Differentiate on Strong Models
- **F-prompt-known-kata.4** — H4 Confirmed: The Ambiguity Mechanism Does Not Apply on a Training-Known Kata
- **F-prompt-known-kata.5** — H2 Cannot Be Assessed: Code Quality Comparable Only on Working Runs
- **F-prompt-known-kata.6** — RQ-prompt-correctness Prediction Confirmed: Prompt Style Does Not Differentiate on a Training-Known Kata
- **F-prompt-known-kata.7** — The Verification Adapter Eliminates Interface Artifacts

The prompt-style effect disappears entirely on a task the models already know. Opus and Sonnet reach `verification_pct` 1.00 in all three styles across 30 runs, with zero spread — Game of Life carries no ambiguity for examples to resolve. This is the control that makes the previous question interpretable: example mapping is not a general improvement, it is an ambiguity remedy, and it only pays where ambiguity exists. Haiku's 63 % under example mapping is a capacity artifact, not style sensitivity: its runs split into immediate quitters and completers, and examples merely raise the chance of engaging at all. Details: [findings.md](research/questions-claude/1.2-prompt-style-known-kata/findings.md).

#### 2.1 RQ-model-quality — How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow?

_Data basis: 44 runs · Coverage: 12/12 cells (100 %) at min_replicates=3._

**Code quality by model (means)** — lower = better, except `verification_pct` (higher = better). Quality trophies are correctness-gated: only cells at `verification_pct` = 1.0 are eligible.

| Model | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| opus-5 | 172.67 | 1.67 | 3.00 | 2.00 | 6.33 | **1.00** 🏆 | 3 |
| opus-5-no-thinking | 149.33 | **1.67** 🏆 | 2.67 | 1.67 | 5.33 | **1.00** 🏆 | 3 |
| fable-5 | 163.00 | 3.00 | **2.00** 🏆 | **1.00** 🏆 | 8.33 | **1.00** 🏆 | 3 |
| fable-5-no-thinking | 163.33 | 2.33 | 2.67 | 1.67 | 6.67 | **1.00** 🏆 | 3 |
| opus-4-8 | **145.33** 🏆 | 2.67 | 4.33 | 5.33 | **4.33** 🏆 | **1.00** 🏆 | 3 |
| opus-4-8-no-thinking | 190.50 | 3.00 | 4.25 | 4.75 | 11.50 | **1.00** 🏆 | 4 |
| opus-4-7 | 159.00 | 2.33 | 3.33 | 3.00 | 7.00 | **1.00** 🏆 | 3 |
| opus-4-7-no-thinking | 166.60 | 2.60 | 4.50 | 4.40 | 8.10 | **1.00** 🏆 | 10 |
| opus-4-6-portkey | 173.00 | 4.33 | 6.67 | 12.00 | 19.33 | **1.00** 🏆 | 3 |
| opus-4-6-portkey-no-thinking | 175.67 | 4.33 | 7.67 | 13.00 | 18.67 | **1.00** 🏆 | 3 |
| sonnet-4-6 | 178.00 | 5.67 | 6.33 | 11.00 | 21.67 | **1.00** 🏆 | 3 |
| sonnet-4-6-no-thinking | 166.67 | 3.33 | 6.00 | 5.00 | 15.00 | 0.73 | 3 |

**Findings**:

- **F-model-quality.1** — Correctness (internal + external) on v4 Is Almost Model-Independently Perfect
- **F-model-quality.2** — Model Ranking: Fable 5 and Opus 5 Lead on Complexity, Opus 4.8 on Code Mass; All Three Clearly Ahead of Opus 4.6 and Sonnet
- **F-model-quality.3** — Thinking Does Not Act Uniformly; Strong on Code Size for Opus 4.8, Neutral for Opus 4.6, Negative on cognitive_max for Sonnet
- **F-model-quality.4** — Token Costs: Fable 5 and Sonnet/Opus 4.7 the Cheapest, Opus 4.8 the Most Expensive; Wallclock Uniform
- **F-model-quality.5** — Contract Conformance Almost Fully Achieved Under an Explicit API Contract; One Sonnet Outlier Redefines `Cell` as an Object

Under a strong workflow the model choice moves code quality by an order of magnitude while leaving correctness untouched: eleven of twelve cells reach `verification_pct` 1.00, but `cognitive_max` spans 1.0 (Fable 5) to 13.0 (Opus 4.6 no-thinking). Three complementary winners rather than one: Fable 5 and Opus 5 take the complexity axes, Opus 4.8 the Code Mass (APP) and Complexity Peak. Thinking does not act uniformly — it cuts Opus 4.8's Code Mass by 45 points but doubles Sonnet's `cognitive_max`, so it cannot be treated as a general quality switch. Caveat: n=3 per cell, one kata, one workflow. Details: [findings.md](research/questions-claude/2.1-model-effect-code-quality/findings.md).

#### 2.2 RQ-model-novel — How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life?

_Data basis: 30 runs · Coverage: 5/5 cells (100 %) at min_replicates=5._

**Correctness (external) as primary outcome** (higher = better), code quality and cost secondary (lower = better). Parenthesised values lead numerically but carry no trophy — their cell never reaches a full implementation.

| Model | n | verification_pct ↑ | σ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | total_tokens ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| fable-5-no-thinking | 5 | 0.83 | 0.10 | (4.0) | (4.2) | (0.2) | **13.4 M** 🏆 | 7826 |
| opus-5-no-thinking | 5 | 0.88 | 0.11 | **2.8** 🏆 | 3.8 | **0.2** 🏆 | 24.6 M | 5931 |
| opus-4-8-no-thinking | 5 | **0.92** 🏆 | 0.09 | 7.4 | **7.0** 🏆 | 1.2 | 31.0 M | 5264 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 | 10.5 | 7.9 | 1.8 | 13.7 M | **3693** 🏆 |
| opus-4-6-portkey-no-thinking | 5 | **0.93** 🏆 | 0.08 | 22.2 | 10.6 | 5.6 | 15.1 M | 4416 |

**Findings**:

- **F-model-novel.1** — opus-4-8 and opus-4-6 Solve claim-office Reliably, opus-5 and fable-5 in the Midfield, opus-4-7 Does Not
- **F-model-novel.2** — The Workflow × Model Interaction Is the Dominating Effect
- **F-model-novel.3** — Correctness Differentiates More Strongly Than Code Quality
- **F-model-novel.4** — A More Precise Mechanism on opus-4-7: Test-List Completeness, Not Subagent Isolation
- **F-model-novel.5** — opus-4-8 Buys the Best Code Quality at ~2× the Token Cost
- **F-model-novel.6** — fable-5: The Cleanest, Most Thoroughly Tested Code — But Never the Full Spec

On a novel kata the models separate far more sharply on correctness than on code quality: `verification_pct` ranges 0.67 to 0.93 while `tests_passing` stays at 100 % everywhere — the agents' own tests pass regardless, so internal green says nothing about whether the specification was met. Opus 4.7 is the instructive failure: bimodal at σ=0.36, with four perfect runs and six between 0.20 and 0.87. Its mechanism was isolated to test-list completeness, not context architecture — adding a "cover every spec example" obligation lifted it from 0.67 to 0.96. Fable 5 writes the cleanest code but never once completes the full spec. Details: [findings.md](research/questions-claude/2.2-model-effect-novel-kata/findings.md).

#### 3.1 RQ-workflow-model — Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model?

_Data basis: 49 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

**Correctness (external) per workflow × model** — higher = better; 🏆 per model column. The point of the table is precisely that the winner changes with the model.

| Workflow | opus-4-7 (n) | opus-4-6 (n) |
|---|---:|---:|
| v4-exact-subagents | 0.67 (10) | **0.93** (5) 🏆 |
| v5-exact-single-context | 0.97 (9) | 0.87 (5) |
| v6-hybrid | **1.00** (5) 🏆 | 0.68 (15) |

**Findings**:

- **F-workflow-model.1** — v4 and v6 Swap Places Depending on the Model
- **F-workflow-model.2** — Mechanism: Orchestration Delegation vs. Explicit Subagent Prompt

There is no universally best workflow. The hybrid architecture is the optimum on Opus 4.7 (1.00) and among the weakest on Opus 4.6 (0.68); the fully phase-isolated variant does the reverse (0.67 vs 0.93). The same configuration therefore swings by 33 percentage points depending only on which model runs it. The single-context workflow is the least model-sensitive and the only one above 0.85 on both. The mechanism behind Opus 4.6's hybrid failure is specific and diagnosable: in roughly 40 % of runs it drops the claim half of the specification entirely, while its self-written tests stay green because they only cover the other half. Details: [findings.md](research/questions-claude/3.1-workflow-model-interaction/findings.md).

#### 4.1 RQ-tdd-quality — How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference?

_Data basis: 103 runs · Coverage: 16/16 cells (100 %) at min_replicates=5._

All metrics lower = better; 🏆 = best value per column (also multiple times on a tie). **Never averaged across katas** — game-of-life (~30–40 Production LoC) and claim-office (~150–320 Production LoC) are not comparable.

**Kata: game-of-life**

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| v2-iterative            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| v3-basic-tdd            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| v4.1-testlist-scope-fix |  5 | **6.4** 🏆 | **5.0** 🏆 | 16.4 | **2.4** 🏆 | 32.0 | 156.6 |
| v5.1-testlist-scope-fix |  5 | 17.6 | 10.2 | 20.8 | 4.8 | **26.6** 🏆 | 154.0 |
| v6.1-hybrid-…           | 10 | 6.5 | 5.2 | **14.2** 🏆 | **2.4** 🏆 | 29.2 | 153.7 |
| v8a-delayed-refactor-agent  |  5 | 10.6 | 7.4 | 17.6 | 3.0 | 31.2 | **142.0** 🏆 |
| v8b-delayed-refactor-native |  5 | 9.0 | 6.8 | 17.6 | **2.4** 🏆 | 31.0 | 145.8 |

**Kata: claim-office**

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `cc_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| v1-oneshot              |  5 | 12.2 | 8.4 | 40.4 | 11.6 | 269.4 | 835.4 |
| v2-iterative            |  5 | 11.4 | 8.4 | 41.4 | 15.8 | 268.6 | 851.0 |
| v3-basic-tdd            |  5 | 19.8 | 15.4 | 51.6 | 16.8 | 317.4 | 992.4 |
| v4.1-testlist-scope-fix |  5 | 26.8 ⚠️ | 16.0 ⚠️ | 40.8 | 13.2 | **156.8** 🏆 | **621.6** 🏆 |
| v5.1-testlist-scope-fix |  6 | 14.8 | 10.2 | 32.7 | 6.8 | 167.2 | 692.7 |
| v6.1-hybrid-…           |  7 | **5.7** 🏆 | **5.7** 🏆 | **18.1** 🏆 | **1.3** 🏆 | 191.1 | 861.3 |
| v8a-delayed-refactor-agent  |  5 | 7.4 | 6.6 | 28.4 | 4.0 | 245.6 | 813.8 |
| v8b-delayed-refactor-native |  5 | 11.0 | 8.0 | 35.8 | 6.2 | 238.8 | 780.2 |

⚠️ v4.1 claim-office is bimodal (`cognitive_max` σ=24, max=68) — occasional extreme misdirections. Correctness **differs** between the katas: on game-of-life all 8 workflows are at `verification_pct` = 1.00; on claim-office it varies between 0.28 (v1+v2, vibe-coding without tests) and 1.00 (v3, v5.1, v6.1, v8a).

**Findings**:

- **F-tdd-quality.1** — Strict Phase-Structured Workflows with a Refactor Phase Lower the Complexity Peaks Drastically
- **F-tdd-quality.2** — Naive "use TDD" (v3) Brings No Complexity Advantage over Non-TDD (v1/v2) on game-of-life
- **F-tdd-quality.3** — Single Context (v5.1) Loses the Complexity Advantage of the Phase-Isolated Subagents (v4.1) — But Only on game-of-life
- **F-tdd-quality.4** — Correctness Is Workflow-Dependent on a Novel Kata; v1/v2 Vibe-Coding Collapses on claim-office
- **F-tdd-quality.5** — The Cost Range Between Workflows Spans an Order of Magnitude; Strict Workflows Are 5–50× More Expensive; Kata Complexity Scales Linearly
- **F-tdd-quality.6** — Vibe + End Refactoring Reaches the Volume Level of the Strict TDD Workflows at Non-TDD Cost; Branching Complexity Remains Weaker
- **F-tdd-quality.7** — The Subagent Mechanism for the End Refactor Beats the Slash Command on the Large Kata; Level on the Small Kata
- **F-tdd-quality.8** — A Test-Writing Phase Rescues Correctness on a Novel Kata; Pure Vibe-Coding Fails
- **F-tdd-quality.9** — The v6.1 Hybrid Is the Most Robust TDD Workflow Across Both Katas; v4.1 Is Kata-Unstable

This is the question that separates the two levers. Workflows with an enforced refactor step per cycle cut the complexity peak to roughly a third of vibe coding on both katas (claim-office `cognitive_max` 5.7 against 11–12, Smell Total 1.3 against 12–16). But the lever is the refactor cadence, not the TDD label: a single agent told only "use TDD" and left to structure the process itself produces the heaviest code in the entire matrix (19.8 on claim-office, 21.8 on game-of-life) — worse than no TDD at all. Correctness is a different story: vibe coding collapses to 0.28 on the novel kata, and every workflow with a test-writing phase — including that same naive one — recovers to ≥ 0.96. Details: [findings.md](research/questions-claude/4.1-tdd-effect-code-quality/findings.md).

#### 4.2 RQ-tdd-correctness — Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata?

_Data basis: 36 runs · Coverage: 7/7 cells (100 %) at min_replicates=3._

**Correctness per workflow** — 🏆 = best value per column (also multiple times on a tie); `verification_pct` / `tests_passing`: higher = better.

| Workflow | n | `verification_pct` (mean ± std) | `verification_passed` / 15 (min – max) | `tests_passing` |
|---|---:|---|---|---|
| v3-basic-tdd                  | 5 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v4.1-testlist-scope-fix       | 5 | 0.96 ± 0.09        | 12 – 15 | **100 %** 🏆 |
| v5.1-testlist-scope-fix       | 6 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v6.1-hybrid-…                 | 3 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v7.1-hybrid-green-refactor-…  | 3 | 0.98 ± 0.04        | 14 – 15 | **100 %** 🏆 |

`completed_within_budget` is 100 % in all cells.

**Findings**:

- **F-tdd-correctness.1** — Three of Five TDD Workflows Solve claim-office Perfectly; v4.1 and v7.1 Lose Isolated Scenarios
- **F-tdd-correctness.2** — v4.1 Reaches Correctness Only via Drastically Higher Effort per Cycle
- **F-tdd-correctness.3** — The Predictions Rate Comparison Is Distorted by an Unequal Prediction Base
- **F-tdd-correctness.4** — The Wallclock Range Is 10×, the Token Range 9×; No Correlation with Correctness

This is the counter-cell that keeps the two levers apart. Once a test-writing phase exists, the workflow architecture stops mattering for correctness: the naive "use TDD" run reaches 15/15 in every replicate, exactly like the two structured workflows. Effort does not buy accuracy either — the phase-isolated variant runs 44.6 cycles and 54 minutes per run against 3.8 cycles and 5 minutes for the naive one, and is the only setup with an outlier (12/15). Notably, both workflows with an isolated green subagent carry one correctness outlier while the three with green in shared context are perfect, suggesting isolation costs edge cases. Caveat: n=3 in two cells. Details: [findings.md](research/questions-claude/4.2-tdd-effect-correctness/findings.md).

#### 4.3 RQ-context — Which form of context structuring — isolated subagent contexts per TDD phase (v4.1), a shared, accumulated single context (v5.1), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (v6.1), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (v7.1) — leads to better code quality?

_Data basis: 21 runs · Coverage: 4/4 cells (100 %) at min_replicates=3._

🏆 = best value per column. Directions: complexity, mass, duration and tokens lower = better; `verification_pct` higher = better. Where spreads are smaller than 1 σ, 🏆 is distributed across all nearby values.

| Workflow | n | `cognitive_max` | `mccabe_max` | `cc_longest_function` | `smell_total` | `code_mass` | `cc_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| v4.1 (all isolated) | 5 | 26.8 ± 24.1 | 16.0 ± 9.0 | 40.8 ± 27.1 | 13.2 ± 7.5 | **621.6 ± 65.6** 🏆 | **156.8 ± 38.0** 🏆 | 0.96 ± 0.09 | 3 229 ± 920 | **14.10 M ± 2.99** 🏆 |
| v5.1 (all shared) | 6 | 14.8 ± 4.2 | 10.2 ± 2.6 | 32.7 ± 10.2 | 6.8 ± 7.6 | 692.7 ± 78.8 | 167.2 ± 27.9 | **1.00 ± 0** 🏆 | **641 ± 122** 🏆 | 18.73 M ± 5.35 |
| v6.1 (refactor isolated) | 3 | **4.3 ± 1.5** 🏆 | **5.0 ± 1.7** 🏆 | **16.7 ± 6.7** 🏆 | **1.3 ± 1.2** 🏆 | 920.7 ± 55.2 | 184.3 ± 4.9 | **1.00 ± 0** 🏆 | 1 424 ± 781 | 30.16 M ± 18.56 |
| v7.1 (green + refactor isolated) | 3 | **5.0 ± 1.0** 🏆 | **4.67 ± 0.58** 🏆 | **19.3 ± 2.5** 🏆 | **2.3 ± 2.3** 🏆 | 801 ± 3.6 | 187.3 ± 29.2 | 0.98 ± 0.04 | 1 970 ± 715 | 26.11 M ± 6.20 |

`tests_passing` and `completed_within_budget` are 100 % in all four cells.

**Findings**:

- **F-context.1** — The Refactor Subagent Delivers the Complexity Advantage; Additional Green Isolation Does Not Change the Picture
- **F-context.2** — The Refactor Subagent Distributes Functionality Across More Building Blocks; Green Isolation Slows the More-Code Effect
- **F-context.3** — Correctness Does Not Distinguish the Architectures
- **F-context.4** — Four Very Different Cost Profiles
- **F-context.5** — Two Hybrid Positions with Similar Code Quality, Different Cost Profiles

Isolating the refactor phase into its own subagent is what produces the complexity advantage — and isolating more phases adds nothing. The two architectures with an isolated refactor land at `cognitive_max` 4.3 and 5.0; sharing all phases in one context gives 14.8, isolating all of them 26.8 with a σ of 24. The intuitive ordering "more isolation is better" is falsified outright. There is a trade-off, though: the isolated refactor distributes the same functionality across more building blocks, so Code Mass (APP) rises by 48 % while smells fall by an order of magnitude. Caveat: n=3 in the two hybrid cells. Details: [findings.md](research/questions-claude/4.3-tdd-context-engineering/findings.md).

#### 4.4 RQ-pocock-vs-v62 — How does the external Matt Pocock TDD skill (v9-pocock-tdd: single skill, inline phases, tail refactor) perform on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned (multi-command + refactor subagent, per-cycle refactor) — on correctness, code quality, TDD discipline and cost?

_Data basis: 11 runs · Coverage: 2/2 cells (100 %) at min_replicates=3._

| Axis | v6.2-with-why-cleaned (n=8) | v9-pocock-tdd (n=3) | Winner |
|---|---:|---:|---|
| **Correctness** `verification_pct` (higher = better) | 0.96 ± 0.09 | **1.00 ± 0** 🏆 | Pocock slightly |
| `tests_passing` rate | 100 % | 100 % | Tie 🏆🏆 |
| **Code quality** `cognitive_max` (lower = better) | **5.00 ± 1.77** 🏆 | 14.33 ± 1.53 | v6.2 |
| `mccabe_max` (lower = better) | **4.50 ± 0.76** 🏆 | 11.67 ± 0.58 | v6.2 |
| `cc_longest_function` (lower = better) | **12.38 ± 1.41** 🏆 | 32.33 ± 1.53 | v6.2 |
| `smell_total` (lower = better) | **0.38 ± 0.74** 🏆 | 6.67 ± 8.96 | v6.2 |
| `code_mass` (lower = better) | 878.5 ± 91 | **748.3 ± 62** 🏆 | Pocock |
| **Cost** `duration_seconds` (lower = better) | 2530 ± 401 | **570 ± 106** 🏆 | Pocock |
| `total_tokens` (lower = better) | 44.4 M ± 3.4 M | **13.1 M ± 4.6 M** 🏆 | Pocock |
| **Discipline** `refactorings_applied` | 24.88 ± 6.90 | 0 ± 0 | different by design |
| `cycle_count` | 37.38 ± 1.60 | 14.00 ± 3.46 | different by design |
| `tests_passed_immediately` (lower = stricter) | 15.12 ± 5.84 | **2.33 ± 4.04** 🏆 | Pocock |
| `predictions_correct_rate` (higher = better) | **97.2 %** 🏆 | 89.9 % | v6.2 |

> **Caveat on trophy gating:** The convention awards quality/cost trophies only at
> `verification_pct` = 1.0. v6.2 is at 0.96 (1× 0.73 outlier out of 8). A strict reading
> would give v6.2 no quality trophies — awarded pragmatically here, because 7/8 v6.2 runs
> are perfect.

> **Caveat n=3** for Pocock: n=3 is unreliable for ranking. The effect sizes here are so
> clear (>3 σ in all quality/cost metrics) that the direction of the statement is stable;
> precise σ comparisons need n≥8.

**Findings**:

- **F-4.4.1** — Pocock and v6.2 Are Equally Correct
- **F-4.4.2** — v6.2 Produces Cleaner Code, Pocock More Compact Code
- **F-4.4.3** — Pocock ~70–78 % Cheaper
- **F-4.4.4** — The Tail Refactor Does Not Trigger on claim-office
- **F-4.4.5** — Pocock Takes Fewer, Larger Steps
- **F-4.4.6** — Pocock Skips Less Often

An externally authored TDD skill provides a natural test of where the refactor cadence sits. Both setups are equally correct, but the external skill places refactoring at the tail — "after all tests pass, look for candidates" — and that instruction never fires: `refactorings_applied` is 0 in 3 of 3 runs, against 24.9 for the per-cycle baseline. The consequence is visible immediately in the code: `cognitive_max` 14.3 against 5.0, longest function 32 against 12. The trade is real, though, and large: the tail-refactor variant costs 70–78 % less (13 M against 44 M tokens, 570 s against 2530 s). Caveat: n=3. Details: [findings.md](research/questions-claude/4.4-external-tdd-pocock-vs-v62/findings.md).

#### 4.5 RQ-architecture-axis-opus5 — Does the TDD architecture axis (v3 structureless / v5.1 single context / v6.1 hybrid / v6.6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer?

_Data basis: 97 runs · Coverage: 16/16 cells (100 %) at min_replicates=5._

**claim-office-example-mapping** (correctness kata)

| Metric | v3/o5 | v5.1/o5 | v6.1/o5 | v6.6/o5 | v3/o47 | v5.1/o47 | v6.1/o47 | v6.6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | 0.79 | 0.99 | 0.95 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | höher = besser |
| `cc_avg_loc_per_function` | 9.18 | 5.89 | 4.04 | **3.21** 🏆 | 13.07 | 10.03 | 5.75 | 3.67 | kleiner = besser |
| `cognitive_max` | 5.4 | 2.8 | 2.4 | **2.2** 🏆 | 19.8 | 14.83 | 5.71 | 3.2 | kleiner = besser |
| `cognitive_avg` | 2.53 | 1.65 | 1.34 | **1.18** 🏆 | 5.77 | 4.62 | 2.32 | 1.35 | kleiner = besser |
| `mccabe_max` | 5.4 | 3.4 | 3.2 | **3.0** 🏆 | 15.4 | 10.17 | 5.71 | 3.4 | kleiner = besser |
| Complexity Peak | 24.2 | 18.6 | 17.0 | 14.6 | 51.6 | 32.67 | 18.14 | **12.0** 🏆 | kleiner = besser |
| Smell Total | **0.0** 🏆 | 0.2 | **0.0** 🏆 | **0.0** 🏆 | 16.8 | 6.83 | 1.29 | **0.0** 🏆 | kleiner = besser |
| Code Mass (APP) | 759.2 | 569.0 | 861.6 | 1002.8 | 992.4 | 692.7 | 861.3 | 796.0 | kein 🏆 — s. Caveat |
| `cycle_count` | 4.8 | 27.0 | 42.8 | 45.0 | 3.8 | 5.5 | 28.0 | 25.8 | — |
| `refactorings_applied` | n/a | 12.2 | 17.4 | **43.4** 🏆 | n/a | 2.2 | 11.0 | 22.6 | höher = besser |
| `predictions_correct_rate` | n/a | 99.6 % | **100 %** 🏆 | 98.7 % | n/a | **100 %** 🏆 | 96.4 % | 90.0 % | höher = besser |
| `total_tokens` | 4 M | 83 M | 82 M | 137 M | **3 M** 🏆 | 19 M | 35 M | 60 M | kleiner = besser |
| `duration_seconds` | 5 min | 23 min | 44 min | 93 min | **5 min** 🏆 | 11 min | 26 min | 76 min | kleiner = besser |

**game-of-life-example-mapping** (code-quality kata)

| Metric | v3/o5 | v5.1/o5 | v6.1/o5 | v6.6/o5 | v3/o47 | v5.1/o47 | v6.1/o47 | v6.6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | höher = besser |
| `cc_avg_loc_per_function` | 6.69 | 4.12 | 4.54 | **3.57** 🏆 | 16.52 | 9.58 | 6.56 | 3.62 | kleiner = besser |
| `cognitive_max` | 7.6 | 1.8 | 1.8 | **1.2** 🏆 | 21.8 | 17.6 | 6.5 | 2.2 | kleiner = besser |
| `cognitive_avg` | 5.73 | 1.6 | 1.5 | **1.2** 🏆 | 21.8 | 15.4 | 5.17 | 1.9 | kleiner = besser |
| `mccabe_max` | 6.0 | 2.8 | 3.2 | **2.4** 🏆 | 13.7 | 10.2 | 5.2 | 3.2 | kleiner = besser |
| Complexity Peak | 14.6 | 8.0 | 10.8 | **7.4** 🏆 | 32.5 | 20.8 | 14.2 | 8.4 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 1.2 | **0.0** 🏆 | 6.0 | 4.8 | 2.4 | **0.0** 🏆 | kleiner = besser |
| Code Mass (APP) | 193.0 | 176.2 | 181.8 | 194.4 | 165.6 | 154.0 | 153.7 | 169.6 | kein 🏆 — s. Caveat |
| `cycle_count` | 3.8 | 7.2 | 10.4 | 10.4 | 1.5 | 7.6 | 8.7 | 9.2 | — |
| `refactorings_applied` | n/a | 4.4 | 4.4 | **8.6** 🏆 | n/a | 4.8 | 4.1 | 9.2 | höher = besser |
| `predictions_correct_rate` | n/a | **100 %** 🏆 | **100 %** 🏆 | 99.1 % | n/a | **100 %** 🏆 | 99.4 % | 98.9 % | höher = besser |
| `total_tokens` | 2 M | 12 M | 8 M | 15 M | **1 M** 🏆 | 8 M | 7 M | 12 M | kleiner = besser |
| `duration_seconds` | 3 min | 7 min | 10 min | 19 min | **1 min** 🏆 | 5 min | 8 min | 22 min | kleiner = besser |

Caveats: on claim-office, quality trophies are gated at `verification_pct` 1.00 — the three opus-5 cells below it are exempt for the *quality* columns because their shortfall traces to a single acceptance scenario, not to stub implementations, but they carry no correctness trophy. `cycle_count`, `refactorings_applied` and `predictions_correct_rate` are **n/a for v3**, not zero: v3 prescribes no phase markers, so the parser has nothing to count. Code Mass (APP) carries no trophy — it ranks the cells opposite to decomposition and has no notion of nesting.

**Findings**:

- **F-1.1** — H1 confirmed: the architecture ranking holds on opus-5, on both katas
- **F-1.2** — The model generation moves quality as much as the whole architecture does
- **F-1.3** — v6.6 wins the quality axis on both katas and costs 4–34× the baseline
- **F-1.4** — One acceptance scenario fails across workflows and accounts for most of the correctness spread
- **F-1.5** — v5.1 is the least reliable architecture on opus-5, v6.1 the most efficient compromise
- **F-1.6** — Code Mass (APP) ranks the cells opposite to decomposition, on this model too
- **F-1.7** — opus-5 writes more code than opus-4-7 under the same workflow

The architecture ranking survives the model generation change — more structure still means better decomposition on both katas — but its *size* collapses. Structureless TDD on opus-5 reaches `cognitive_max` 5.4 on claim-office, essentially the value the hybrid architecture needed on opus-4-7 (5.71); Smell Total falls to 0.0 in all ten of those unstructured runs against 16.8 on the older model. The model generation moves quality as far as the entire workflow apparatus does. What structure still buys is bought expensively: the current generation costs 34× the tokens and 19× the wallclock of the baseline for 2.9× better decomposition — and at 0.95 instead of 1.00 correctness. Details: [findings.md](research/questions-claude/4.5-architecture-axis-opus5/findings.md).

#### 5.1 RQ-stability — How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count?

_Data basis: 59 runs · Coverage: 5/6 cells (83 %) at min_replicates=10._

**Code quality by workflow (n=10)** — best value per column in bold, lower = better.

| Workflow | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `cc_longest_function` | n |
|---|---:|---:|---:|---:|---:|---:|
| v1-oneshot (prose) | 155.00 | 4.80 | 12.80 | 18.80 | 31.70 | 10 |
| v2-iterative (prose) | 157.80 | 4.10 | 11.60 | 16.20 | 32.10 | 10 |
| v3-basic-tdd (EM) | 165.60 | 6.00 | 13.70 | 21.80 | 32.50 | 10 |
| v4-exact-subagents (EM) | 166.60 | 2.60 | **4.50** | **4.40** | **8.10** | 10 |
| v5-exact-single-context (EM) | **152.60** | 4.10 | 8.90 | 14.50 | 17.40 | 10 |
| v6-hybrid (EM) | 158.60 | **2.20** | **4.50** | 5.20 | 13.10 | 10 |

**Findings**:

- **F-stability.1** — The Main RQ-tdd-quality Finding (v4 Dominates Code Complexity, v3 Is Last) Replicates at n=10 with the Same Sign
- **F-stability.2** — Workflow Stability Is Not Uniform; v4 Has a 10 % Outlier Rate Despite a Low Typical Value; v5 Is the Broadest Workflow
- **F-stability.3** — At n=3 the Full Workflow Ranking Is Correct in Only ~25–60 % of Cases; v4 as the "Best" Is More Robust
- **F-stability.4** — Correctness Stays at 100 % Independently of Model/Workflow at n=10
- **F-stability.5** — Token Consumption Shows an Extremely High Spread for v4 and v5
- **F-stability.6** — TDD Discipline Forms Workflow-Characteristic Bands
- **F-stability.7** — Test Strength (`mutation_score`) Has Its Own Stability Profile; v6-hybrid Is the Most Stable Workflow, v4 the Least Stable

This question calibrates how much the rest of the study can be trusted. At n=10 the main ranking replicates with the same sign — phase-isolated subagents lead on complexity, naive TDD comes last — but the middle of the field reorders. The sobering number is reproducibility at n=3: drawing three replicates recovers the full six-workflow ranking in only 16–63 % of cases depending on the metric. Single winners are far more robust than complete orderings. Stability is also workflow-specific: the phase-isolated variant has a 10 % outlier rate despite a low typical value, while the hybrid stays inside a narrow band across all ten runs. Details: [findings.md](research/questions-claude/5.1-workflow-stability/findings.md).

### Research Questions (OpenCode)

#### 1.1 RQ-model-quality-oc — How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the v5.1-testlist-scope-fix-oc workflow?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

Code quality as primary outcome (lower = better except where noted); Correctness (external) as gating precondition. Trophies for quality/efficiency go only to models at `verification_pct` = 1.0 — Kimi-K2 (0.57) and DeepSeek-V4-Pro (0.85) drop out of the pool, so their low complexity and small code size are stub/timeout artifacts rather than wins.

| Metric | Direction | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 | deepseek-v4-flash | deepseek-v4-pro |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 | **1.00** 🏆 | 0.85 |
| `tests_passing` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | 80% |
| `smell_total` (mean) | lower | 3.6 | **2.8** 🏆 | 4.0 | 4.4 | 4.0 | 4.2 |
| `cognitive_max` (mean) | lower | **11.4** 🏆 | **11.6** 🏆 | 16.0 | 9.4 | 13.2 | 11.4 |
| `mccabe_max` (mean) | lower | 7.6 | **7.0** 🏆 | 10.4 | 7.6 | 9.4 | 8.6 |
| `cc_longest_function` (mean) | lower | **18.6** 🏆 | 19.8 | **18.6** 🏆 | 15.2 | 27.6 | 15.0 |
| `cc_avg_loc_per_function` (mean) | lower | **7.59** 🏆 | 10.05 | 15.63 | 9.9 | 13.10 | 9.53 |
| `lines_of_code` (mean) | lower | **38.2** 🏆 | 46.4 | 52.2 | 22.4 | 44.8 | 24.6 |
| `tests_total` (mean) | higher | **9.4** 🏆 | **9.8** 🏆 | 8.4 | 7.0 | **9.2** 🏆 | 8.6 |
| `predictions_total` (mean) | higher (skill compliance) | **4.8** 🏆 | 4.4 | 0.4 | 2.0 | 1.4 | **6.2** 🏆 |
| `duration_seconds` (mean) | lower | 231 | 835 | **153** 🏆 | 1083 | 612 | 2381 |
| `total_tokens` (mean) | lower | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M | 2.71 M | 2.82 M |
| `cost_usd` (mean, $/perfect-run) | lower | $1.84 | $0.74 | $1.06 | $2.65 | **$0.10** 🏆 | $0.46 |

**Findings**:

- **F-1.1** — Opus 4.7 writes the most compact implementation
- **F-1.2** — GLM 5.1 holds the Opus level in complexity
- **F-1.3** — Kimi-K2 writes too few tests, fails external verification
- **F-1.4** — Gemini 3.5 Flash: fast, but the most complex code
- **F-1.5** — Skill-tool compliance is model-dependent
- **F-1.6** — DeepSeek-V4-Flash: cheapest path to the correct solution
- **F-1.7** — DeepSeek-V4-Pro: skill-compliance champion, but tail risk in duration

Four of six models reach full external correctness on the training-known kata, so the question becomes what the correct solutions cost and how they are built. GLM 5.1 holds the Opus complexity level (`cognitive_max` 11.6 vs 11.4, Smell Total 2.8 vs 3.6) at 40 % of the price, and DeepSeek-V4-Flash reaches the same correctness at $0.10 per run — 18× cheaper than Opus, at a modest code-size premium. Skill-tool compliance turns out to be a model property in its own right: prediction markers per run range from 0.4 to 6.2 across models, and where models do write them they are ~100 % accurate — the gap is format compliance, not comprehension. Details: [findings.md](research/questions-opencode/1.1-model-quality-oc/findings.md).

#### 1.2 RQ-model-novel-oc — How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the v5.1-testlist-scope-fix-oc workflow?

_Data basis: 40 runs · Coverage: 8/8 cells (100 %) at min_replicates=5._

Correctness (external) as primary outcome (higher = better); code quality secondary (lower = better). Quality/efficiency trophies gated at `verification_pct` = 1.0 — only Opus and GLM 5.1 qualify; low values in the other columns reflect stubs or aborts.

| Metric | Direction | opus-4-7-portkey | glm-5-1 | mistral-medium-3-5 | kimi-k2-6 | gemini-3-5-flash | deepseek-v4-flash | deepseek-v4-pro | minimax-m2-7 |
|---|---|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | 0.95 | 0.84 | 0.80 | 0.60 | 0.60 | 0.04 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | 0.09 | 0.26 | 0.45 | 0.55 | 0.55 | 0.09 |
| `smell_total` (mean) | lower | **0.8** 🏆 | 4.0 | 23.6 | 20 | 18 | 13.4 | 16.6 | 10.2 |
| `cognitive_max` (mean) | lower | **9.8** 🏆 | 12.2 | 74.8 | 21.8 | 40.2 | 11.6 | 17.4 | 11.4 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | 9.2 | 33.6 | 17.6 | 23.4 | 9.2 | 11.0 | 7.6 |
| `cc_longest_function` (mean) | lower | **25.4** 🏆 | 28.8 | 120 | 54.4 | 98.4 | 31.6 | 42.2 | 30.0 |
| `code_mass` (mean) | lower | **759.6** 🏆 | 816 | 712.6 | 741 | 526 | 566.2 | 554.6 | 364.4 |
| `total_tokens` (mean) | lower | **8.06 M** 🏆 | 10.97 M | 13.65 M | 6.65 M | 7.02 M | 6.77 M | 4.46 M | 8.48 M |
| `cost_usd` (mean, $/run) | lower | $5.90 | **$2.10** 🏆 | $24.69 † | $2.78 | $2.23 | $0.28 | $0.11 | $2.40 |
| `duration_seconds` (mean) | lower | **664** 🏆 | 1726 | 4051 | 1811 | 395 | 1279 | 956 | 1428 |

† The Mistral cost outlier is an integration artifact, not Mistral pricing: the OpenCode provider does not set the opt-in `prompt_cache_key`, so only ~5 % of tokens hit the cache. With Anthropic-level caching the same run would cost ~$3.25.

**Findings**:

- **F-1.1** — Opus 4.7 and GLM 5.1 reach full correctness; trade-off code quality ↔ cost
- **F-1.2** — Kimi K2.6 and Gemini 3.5 Flash: top correctness with a variance tail
- **F-1.3** — MiniMax M2.7: stable spec misunderstanding, not an isolated case
- **F-1.4** — Prediction-format compliance is NOT predictive of correctness
- **F-1.5** — Code Mass spread within a model: Flash and MiniMax bimodal/wide
- **F-1.6** — Cost efficiency per perfect run: GLM 5.1 deterministic AND cheap
- **F-1.7** — Mistral Medium 3.5: high correctness against high complexity and highest cost
- **F-1.8** — DeepSeek V4 (flash + pro): workflow-compat drop dominates over spec comprehension

The novel kata separates this model field far more sharply than the known one: correctness runs from 1.00 down to 0.04, and complexity spans an order of magnitude (`cognitive_max` 9.8 to 74.8). Two models are deterministically perfect — Opus and GLM 5.1, the latter at a third of the cost. The instructive failures are structural rather than random: MiniMax misunderstands the specification the same way in 4 of 5 runs while its own tests stay green, and both DeepSeek variants fail on mechanical CLI-contract violations, not on comprehension. Prediction-marker compliance again fails to predict correctness. Details: [findings.md](research/questions-opencode/1.2-model-novel-kata-oc/findings.md).

### Research Questions (pi)

#### 1.1 RQ-model-quality-pi — How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the v6.2.1-phase-continuation-pi workflow?

_Data basis: 60 runs · Coverage: 12/12 cells (100 %) at min_replicates=5._

**Code quality, lower = better** (only cells with `tests_passing` = 100 % are trophy-eligible).

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` | `cc_longest_function` | `tests_passing` |
|---|---|---|---|---|---|---|
| opus-5-requesty | 2.0 | **2.4** 🏆 | **3.4** 🏆 | 151.8 | **5.8** 🏆 | 100 % |
| glm-5-2 | **1.0** 🏆 | 7.8 | 6.6 | 178.2 | 22.6 | 100 % |
| sonnet-5 | 2.2 | 6.6 | 5.0 | 183.0 | 19.6 | 100 % |
| kimi-k3-sference | 2.4 | 7.0 | 5.8 | 143.8 | 15.0 | 100 % |
| kimi-k2-7 | 3.0 | 10.8 | 7.2 | 150.4 | 21.6 | 100 % |
| glm-5-1 | 3.2 | 9.6 | 7.6 | 183.2 | 27.2 | 100 % |
| opus-4-8 | 3.4 | 9.6 | 6.8 | 149.2 | 17.4 | 100 % |
| gpt-5-6-sol | 3.6 | 13.4 | 9.4 | **134.8** 🏆 | 21.2 | 100 % |
| deepseek-v4-pro | 4.0 | 14.0 | 10.2 | 158.4 | 25.4 | 100 % |
| minimax-m3 | 8.4 | 6.6 | 5.2 | 212.2 | 15.0 | 100 % |
| — 80 %/0 % (no trophy) | | | | | | |
| gpt-5-6-terra | 6.0 | 7.8 | 6.0 | 136.4 | 23.2 | 80 % |
| qwen3-235b | 1.8 | 6.4 | 3.4 | 248.0 | 46.6 | 0 % |

Smell Total stays with glm-5-2 (1.0 against 2.0) though the margin is soft: glm-5-2's runs range 0–3 at σ = 1.41 while every Opus 5 run landed on exactly 2 (σ = 0).

**Findings**:

- **F-1.1** — opus-5 breaks the complexity field, glm-5-2 holds the smell crown
- **F-1.2** — deepseek and gpt-5-6-sol solve the kata correctly, but with high complexity
- **F-1.3** — Correctness clusters at the top, with qwen as total fail
- **F-1.4** — TDD discipline varies strongly without correlating with correctness
- **F-1.5** — Cost spreads by a factor of 5.2 at comparable quality
- **F-1.6** — The kimi version jump improves every quality axis at the same price
- **F-1.7** — The Anthropic version jump is the cleanest intra-family comparison and the largest
- **F-1.8** — qwen3-235b rewrote the refactor agent instead of refactoring, and the edit escaped the run

Twelve models on one harness, and the complexity field is not close: opus-5 takes all three complexity axes with `cognitive_max` 2.4 against 6.6 for the next-best correct cell, at σ = 0 on Smell Total. The cleanest comparison in the table is the intra-family jump — opus-5 against opus-4-8 improves every quality axis by roughly a factor of two to three (`cognitive_max` 2.4 vs 9.6, Complexity Peak 5.8 vs 17.4) at 55 % higher cost and essentially unchanged Code Mass (APP). Cost across correctness-complete models spreads by a factor of 5.2, so quality and price are only loosely coupled. Details: [findings.md](research/questions-pi/1.1-model-quality-pi/findings.md).

#### 1.2 RQ-model-novel-pi — How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the v6.2-with-why-cleaned-pi workflow?

_Data basis: 90 runs · Coverage: 18/18 cells (100 %) at min_replicates=5._

**Correctness (external), higher = better.** 🏆 for the six models at `verification_pct` ≥ 0.99 with σ ≤ 0.03 (reproducibly perfect). The graded middle (0.60–0.84) carries no trophy — there the within-σ spread is not separable from neighbours.

| Model | `verification_pct` mean | σ | `tests_passing` rate | n |
|---|---|---|---|---:|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % | 5 |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k2-7 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k3-sference | **0.99** 🏆 | 0.03 | 100 % | 5 |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % | 5 |
| opus-5-requesty | 0.96 | 0.09 | 100 % | 5 |
| opus-5-requesty-no-thinking | 0.96 | 0.09 | 100 % | 5 |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % | 5 |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % | 5 |
| minimax-m3-no-thinking | 0.77 | 0.44 | 80 % | 5 |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % | 5 |
| sonnet-5 | 0.72 | 0.19 | 100 % | 5 |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % | 5 |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % | 5 |
| minimax-m3 | 0.20 | 0.45 | 100 % | 5 |
| qwen3-235b | 0.00 | 0.00 | 0 % | 5 |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % | 5 |

Coverage caveat: both `minimax-m3` arms reach n=5 but only 2 resp. 4 runs finish without a timeout, so their high σ is partly a timeout artifact rather than model variance.

**Findings**:

- **F-1.1** — Correctness clusters dichotomously, with a graded middle zone
- **F-1.2** — qwen3-235b drops out at the phase transition; `verification_pct = 0` is not a model statement
- **F-1.3** — TDD discipline and correctness do not correlate
- **F-1.4** — The reasoning switch does not shift correctness
- **F-1.5** — Perfect correctness at widely differing cost

Correctness on the novel kata clusters dichotomously: six models are reproducibly perfect (≥ 0.99 at σ ≤ 0.03), then a graded middle from 0.84 down to 0.20, then two total failures. The reasoning switch turns out not to be a correctness lever at all — on the two models where it is demonstrably active the delta is 0.00 and +0.01, and elsewhere it scatters without direction. Cost among the perfect cells still spreads by a factor of 5.7, so "correct" and "expensive" are separable choices. One caveat worth carrying: qwen's `verification_pct` = 0 is not a model statement but a phase-transition dropout — it writes a complete test list, then implements almost none of it. Details: [findings.md](research/questions-pi/1.2-model-novel-kata-pi/findings.md).

### Research Questions (Cursor CLI)

#### 1.1 RQ-model-quality-cursor — How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping?

_Data basis: 10 runs · Coverage: 2/3 cells (67 %) at min_replicates=5._

Model IDs: `composer-cursor` → `composer-2.5`, `grok-cursor` → `cursor-grok-4.5-medium`, `opus-cursor` → `claude-opus-4-8-medium` (pending). **Coverage is partial**: the Opus cell is empty because the Cursor Pro plan's monthly Opus allowance was exhausted on 2026-07-28. Code-quality metrics lower = better; correctness and discipline higher = better. All cells reach 100 % correctness, so quality trophies are not correctness-gated here.

| Metric (direction) | composer-cursor | grok-cursor | opus-cursor |
|---|---:|---:|---:|
| Code Mass (APP) `code_mass` (↓) | 211.2 | **151.6** 🏆 | pending |
| Production LoC `lines_of_code` (↓) | 68.2 | **39.2** 🏆 | pending |
| `cognitive_max` (↓) | **7.8** 🏆 | 9.2 | pending |
| `cognitive_avg` (↓) | **4.97** 🏆 | 7.9 | pending |
| `mccabe_max` (↓) | **6.2** 🏆 | 7.8 | pending |
| `cc_longest_function` (Complexity Peak, ↓) | 25.4 | **21.8** 🏆 | pending |
| `cc_median_loc_per_function` (↓) | **3.3** 🏆 | 8.2 | pending |
| Smell Total `smell_total` (↓) | **3.0** 🏆 | **2.8** 🏆 | pending |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| Correctness (external) `verification_pct` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| `refactorings_applied` (↑) | 3.6 | **5.0** 🏆 | pending |
| `duration_seconds` (↓) | **331** 🏆 | 585 | pending |
| `total_tokens` (↓) | **1.13 M** 🏆 | 1.33 M | pending |

`smell_total` carries two trophies: 3.0 vs 2.8 at σ ≈ 0.7–0.8 is well inside one σ. `cost_usd` is empty for all runs — the cursor path reports no per-run cost.

**Findings**:

- **F-1.1** — Parsimony and low complexity come apart, and they swap sides
- **F-1.2** — Grok refactors more, and both models are perfectly correct
- **F-1.3** — Composer under-uses the prediction markers; its 100 % rate is a ceiling artifact

With currently 2 of 3 cells populated, the readable result is that parsimony and low complexity come apart and land on opposite models: Grok writes markedly less code (Production LoC 39.2 against 68.2, Code Mass 151.6 against 211.2, both beyond 2 σ), while Composer distributes what it writes into smaller units (`cc_median_loc_per_function` 3.3 against 8.2). Both are perfectly correct on both measures. The complexity differences between them sit inside 1 σ and should be treated as unresolved. The Anthropic anchor cell is missing, so no cross-harness model comparison follows from this question yet. Details: [findings.md](research/questions-cursor-cli/1.1-model-quality-cursor/findings.md).

### Research Questions (cross-harness)

#### 1.2 RQ-harness-requesty — How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

**claim-office** (CLI kata, Correctness external counts)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | 0.93 | 0.88 | **0.99** 🏆 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (lower) | 32.89 | 22.30 | **14.43** 🏆 |
| `total_tokens` (lower) | 49.9 M | 34.1 M | **13.8 M** 🏆 |
| `duration_seconds` (lower) | 3149 | 2393 | **1884** 🏆 |
| `code_mass` (lower) | 862.8 | 920.6 | **782.0** 🏆 |
| `cognitive_max` (lower) | **3.0** 🏆 | 4.6 | 3.6 |
| `mccabe_max` (lower) | **3.8** 🏆 | 4.4 | **3.8** 🏆 |
| `cc_longest_function` (lower) | **15.0** 🏆 | 18.4 | 22.0 |
| `smell_total` (lower) | **0.0** 🏆 | 0.2 | 0.4 |
| `refactorings_applied` (higher) | **28.0** 🏆 | 23.2 | 19.4 |

**game-of-life** (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (lower) | 3.45 | 1.99 | **1.78** 🏆 |
| `total_tokens` (lower) | 4.09 M | 1.96 M | **1.07 M** 🏆 |
| `cognitive_max` (lower) | **5.0** 🏆 | 12.6 | 11.0 |
| `mccabe_max` (lower) | **4.6** 🏆 | 8.8 | 8.0 |
| `cc_longest_function` (lower) | **11.6** 🏆 | 21.8 | 17.8 |
| `smell_total` (lower) | **2.2** 🏆 | 3.2 | 3.4 |
| `code_mass` (lower) | 158.6 | 154.2 | **150.8** 🏆 |
| `refactorings_applied` (higher) | **8.8** 🏆 | 3.2 | 2.8 |
| `duration_seconds` (lower) | 719 | 350 | **326** 🏆 |

Trophy gating on claim-office: no cell reaches `verification_pct` = 1.0 (CC 0.93, OC 0.88, pi 0.99), so the trophies there are awarded pragmatically to the closest cell — read them as "best among three near-complete cells", not as a clean win.

**Findings**:

- **F-1.1** — Correctness is harness-invariant
- **F-1.2** — pi is the cheapest and fastest harness, by a factor of 2.3 on the expensive kata
- **F-1.3** — Claude Code delivers the leanest Complexity Peak on game-of-life, and it buys that with refactor volume
- **F-1.4** — TDD discipline is structurally equal across all harnesses, except refactor intensity

Holding model, workflow and prompt constant and changing only the agent CLI leaves correctness alone but moves cost by a factor of 2.3: on claim-office the same task costs $32.89 through Claude Code and $14.43 through pi, at 3.6× the token footprint. Since all three arms use the same model on the same route and tariff, this is a pure harness effect — the CLIs differ in how much context they push through per cycle. Quality does not follow cost: Claude Code produces by far the leanest Complexity Peak on game-of-life (`cognitive_max` 5.0 against 11.0–12.6) and buys it with ~2.8× the refactorings. Details: [findings.md](research/questions-cross/1.2-harness-requesty/findings.md).

#### 1.3 RQ-cost-sol-pi-vs-opus-cc — How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

**claim-office** (CLI kata, high token load)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **2.54** 🏆 | 32.89 |
| `total_tokens` (lower) | **2.09 M** 🏆 | 49.9 M |
| `duration_seconds` (lower) | **503** 🏆 | 3149 |
| `verification_pct` (higher) | **1.00** 🏆 | 0.93 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (lower) | 9.2 | **3.0** 🏆 |
| `mccabe_max` (lower) | 6.8 | **3.8** 🏆 |
| `smell_total` (Smell Total, lower) | 15.4 | **0.0** 🏆 |

**game-of-life** (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **1.09** 🏆 | 3.45 |
| `total_tokens` (lower) | **0.66 M** 🏆 | 4.09 M |
| `duration_seconds` (lower) | **240** 🏆 | 719 |
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 |
| `cognitive_max` (lower) | 13.4 | **5.0** 🏆 |
| `mccabe_max` (lower) | 9.4 | **4.6** 🏆 |
| `smell_total` (Smell Total, lower) | 3.6 | **2.2** 🏆 |

**Findings**:

- **F-1.1** — sol-pi is drastically cheaper on both katas — ~13× on the expensive kata
- **F-1.2** — The price advantage costs no correctness — on claim-office sol-pi is even more accurate
- **F-1.3** — Cheaper does not mean cleaner: sol-pi carries higher complexity and more smells throughout

The cheapest bundle is 13× cheaper on the expensive kata ($2.54 against $32.89) and loses nothing on correctness — on claim-office it is in fact more accurate (1.00 ± 0.00 against 0.93 with an outlier at 0.73). What it costs is maintainability: the cheap bundle carries higher complexity and vastly more smells on both katas (Smell Total 15.4 against 0.0 on claim-office, `cognitive_max` 9.2 against 3.0). The practical reading is a straight trade, not a free lunch: for throughput-oriented work where the code is short-lived, the saving is real; for code that will be maintained, the complexity premium is the price. Details: [findings.md](research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/findings.md).

#### 1.4 RQ-model-quality-cc-vs-pi — Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (v6.2)?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

Complexity and code quality, all **lower = better**. All cells 100 % correct → quality trophies not correctness-gated.

| Metric (direction) | CC thinking | CC no-think | pi thinking | pi no-think |
|---|---:|---:|---:|---:|
| `cognitive_max` (↓) | **5.0** 🏆 | 5.6 | 9.6 | 8.2 |
| `cognitive_avg` (↓) | **3.17** 🏆 | 3.87 | 5.57 | 7.4 |
| `mccabe_avg` (↓) | 2.16 | **2.11** 🏆 | 2.9 | 3.13 |
| Smell Total `smell_total` (↓) | 2.2 | 2.0 | 3.4 | **1.2** 🏆 |
| Production LoC `lines_of_code` (↓) | 44.6 | 40.0 | **35.2** 🏆 | 42.2 |
| Code Mass (APP) `code_mass` (↓) | 158.6 | 171.8 | **149.2** 🏆 | 159.6 |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `duration_seconds` (↓) | 718.6 | 579.2 | 339.4 | **318** 🏆 |

**Findings**:

- **F-1.1** — The harness effect on complexity dominates the thinking effect
- **F-1.2** — Thinking does not reliably reduce code complexity on either harness
- **F-1.3** — pi is more parsimonious and faster, CC less complex and more smell-stable

Two factors are varied at once here, and they turn out to be unequal: the harness moves complexity more than the thinking switch does. `cognitive_max` is 5.0/5.6 on Claude Code against 9.6/8.2 on pi — the gap between harnesses is larger and more consistent than the gap between thinking modes within either. Thinking does not reliably reduce complexity on either side; on pi, disabling it actually worsens `cognitive_avg` from 5.57 to 7.4 while tripling the spread. The two harnesses trade profiles rather than dominating: pi is more parsimonious and about twice as fast, Claude Code less complex and more smell-stable. Caveat: harness and workflow line are not fully separable here. Details: [findings.md](research/questions-cross/1.4-opus-cc-vs-pi/findings.md).

#### 1.5 RQ-v3-emergent-tdd — Under a bare 'use TDD' instruction that prescribes no phase markers (v3), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated?

_Data basis: 49 runs · Coverage: 10/10 cells (100 %) at min_replicates=3._

**Which model actually does TDD, and which refactors.** Two independent axes, both read from the tool sequence and hand-validated. *Test-first TDD* asks whether the model works in small steps and observes a red state; *Refactoring* asks whether it improves working code unprompted. Scope of this table is all 71 unstructured example-mapping runs, which is why n exceeds the factor-grid cell sizes.

| Model (harness) | n | **Test-first TDD** | 1st cycle | ≤2 cases | red verified | **Refactoring** | validated | in runs |
|---|---:|:---:|---:|---:|---:|:---:|---:|---:|
| **gpt-5-6-sol** (pi) | 10 | ✅ **yes** 🏆 | **1** 🏆 | **8/10** 🏆 | 9/10 | ✅ **yes** | 3 | 3/10 |
| **opus-5-no-thinking** (CC) | 18 | ⚠️ partial | 13 | 2/18 | **17/18** 🏆 | ✅ **yes** 🏆 | **11** 🏆 | **8/18** 🏆 |
| opus-4-7-no-thinking (CC) | 17 | ❌ no | 13 | 0/17 | 7/17 | ❌ no | 0 | 0/17 |
| sonnet-4-6 (CC) | 11 | ❌ no | 10 | 2/11 | 2/11 | ❌ no | 0 | 0/11 |
| haiku-4-5 (CC) | 11 | ❌ no | 15 | 1/11 | 4/11 | ❌ no | 0 | 0/11 |
| opus-4-6 (CC) | 4 | ❌ no | 42 | 0/4 | 2/4 | ❌ no | 0 | 0/4 |

**1st cycle** = median number of test cases written *before the first line of implementation* (lower = better; 1–2 means one behaviour at a time, 13 means a suite was authored up front). **red verified** = runs where the tests were actually executed between writing them and implementing — without it the model never saw the test fail. **validated** = hand-checked real refactorings out of the raw candidates the heuristic produces (60 candidates across all runs → 14 real).

**Findings**:

- **F-1.1** — Test-first *ordering* survives without any scaffolding
- **F-1.2** — Refactoring does not survive, and only two models do it at all
- **F-1.3** — Test-first discipline stops at the core algorithm
- **F-1.4** — The measurement, not the behaviour, was missing
- **F-1.5** — Test-first ordering is not TDD: only one model works in small verified steps

Told only "use TDD", models comply with the *ordering* and almost nothing else. 70 of 71 runs open with a test — but only one model of six works in genuine TDD steps, and four never refactor at all. The typical run writes ~13 expectations before its first line of implementation, and in 31 % of runs the tests are never executed before the code exists, so no red state is ever observed. Only 14 of 60 refactor candidates survive hand validation. This is what "the agent said it used TDD" is worth without enforced structure: test-first ordering, not test-driven development. Details: [findings.md](research/questions-cross/1.5-v3-emergent-tdd/findings.md).

---

## 5. Cross-RQ Synthesis

1. **Two levers, two outcomes — and they do not substitute for each other.** §4.1 and
§4.2 form a natural experiment. Vibe coding without a test phase collapses to 0.28 correctness on the novel kata; every workflow with a test-writing phase recovers to ≥ 0.96, *including* the unstructured one that never refactors. The same unstructured workflow produces the worst code in the entire matrix (`cognitive_max` 19.8 against 5.7). So the specification and the test phase carry correctness, the refactor cadence carries quality, and a workflow that has one but not the other reliably fails on the other axis. Any single sentence of the form "TDD makes code correct and clean" fuses two different mechanisms.

2. **Internal green is not evidence.** Across §2.2, §4.1, §1.1-oc and §1.2-pi,
`tests_passing` sits at 100 % in cells whose external correctness ranges from 0.04 to 1.00. Agents write tests that pass against their own understanding of the task — MiniMax misreads the spec identically in 4 of 5 runs with 30 self-written green tests each. Only a suite the agent never sees separates comprehension from self-consistency. For practice this means an agent's own test suite cannot serve as the acceptance gate, no matter how thorough it looks.

3. **The model generation is closing the gap the architecture was built to close.** §4.5
measures the same architecture axis on two model generations: unstructured TDD on the newer model reaches `cognitive_max` 5.4, essentially the value the hybrid architecture achieved on the older one (5.71), with Smell Total falling from 16.8 to 0.0. §2.1 points the same way — the model spread on complexity is an order of magnitude under a constant workflow. The workflow apparatus is not obsolete, but the amount it still buys shrinks with each generation, while its cost does not.

4. **The agent CLI is an unexamined cost factor.** §1.2-cross holds model, workflow and
prompt constant and varies only the CLI: correctness is unchanged, cost moves by 2.3× and token footprint by 3.6×. §1.3 pushes further — a different model on a different CLI is 13× cheaper at equal or better correctness, paying in complexity. Harness choice is usually made on ergonomics and rarely measured, yet it moves the budget more than most workflow decisions do.

5. **What the agent reports about its own process is not measurement.** §1.5 hand-validated
every refactoring claim under an unstructured prompt: 14 of 60 candidates were real, and four of six models never refactored despite an instruction to run the full cycle. §1.1-oc and §1.2-oc add the complement — prediction-marker compliance varies 15-fold across models and does not correlate with correctness at all. Process markers measure format adherence; only the artifact measures the work.

---

## 6. Limitations

- **Headless, without a human in the loop.** This is the sharpest limit. Several
documented correctness losses — an agent stopping while convinced it was done, a test list omitting half the specification, a CLI contract guessed rather than confirmed — are failure modes a single clarifying question would prevent. The numbers bound unattended autonomy, not supervised use.

- **Synthetic katas only.** Two tasks carry most of the load: a training-known algorithmic
exercise (~30–40 Production LoC) and a novel insurance-domain CLI (~150–320). Neither has a legacy codebase, an existing architecture, unclear ownership, or a build that breaks for unrelated reasons. Transfer to work on real systems is untested.

- **TypeScript only.** Every complexity and smell figure comes from one toolchain
(ESLint + SonarJS on TypeScript). Thresholds that separate workflows here may not separate them on Python, Go or Java.

- **Replicate counts are small, and the study measures how small.** Most cells are n=5,
some n=3. §5.1 quantifies the consequence: at n=3 the complete workflow ranking is recovered in only 16–63 % of draws depending on the metric. Single winners are robust, full orderings are not — read every ranking below the top position with that in mind.

- **Model coverage is broad but uneven.** About forty configurations across ten provider
families are covered, but not on the same questions: the workflow-architecture axis is measured almost entirely on Anthropic models, while the third-party models appear mostly in model-comparison questions at a fixed workflow. A statement like "this workflow ranking holds across models" is supported for two Anthropic generations and one GPT model — not across the whole field.

- **Cost figures are list-price baselines, not invoices.** No harness returns an inline
per-run cost on the current routing, so every `cost_usd` is token count × published tariff. That makes comparisons internally consistent but not billing-accurate, and tariff changes invalidate the absolute numbers while leaving the ratios intact.

- **Two known coverage gaps.** The cursor-cli question is at 2 of 3 cells — its Anthropic
anchor is missing because the plan allowance was exhausted — so no cross-harness model comparison follows from it. The stability question is at 5 of 6 cells at n=10.

- **Mutation score is opt-in and sparsely collected.** Only a few questions declare it as
an outcome, so test *strength* is far less well covered than test *presence* — a suite that passes may still be weak, and this report can only say so where the metric was run.

---

## 7. Reproducibility

All data and analysis scripts live in the repo:

- `research/questions-{claude,opencode,pi,cursor-cli,cross}/*/README.md` — RQ definitions of the questions reported here (frontmatter with factors/controls/outcomes); `research/workflow-dev/*/README.md` holds the workflow-development questions not reported in this snapshot
- `research/{questions-claude,questions-opencode,questions-cross,workflow-dev}/*/findings.md` — persistent finding lists
- `experiments/runs/*/metrics.json` — raw data per run
- `experiments/aggregate-by-query.py` — RQ-specific aggregation
- `experiments/batch-plan-from-rq.py` — batch-plan generation from RQ frontmatter
- `experiments/docker/Dockerfile` + `run-batch.sh` + `batch.sh` — container pipeline
- `experiments/analyze-run.sh` + `analyze_transcript.py` — run analysis

Container pins: `claude-code@2.1.170`, `opencode-ai@1.15.10`, `@earendil-works/pi-coding-agent@0.81.1`, `pnpm@9.15.9` (see `experiments/docker/Dockerfile`).

---

## 8. Files

| Path | Content |
|---|---|
| `research/questions-claude/1.1-prompt-style-correctness/findings.md` | RQ-prompt-correctness — Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent? |
| `research/questions-claude/1.1-prompt-style-correctness/runs.csv` | RQ-prompt-correctness aggregated run metrics |
| `research/questions-claude/1.2-prompt-style-known-kata/findings.md` | RQ-prompt-known-kata — Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent? |
| `research/questions-claude/1.2-prompt-style-known-kata/runs.csv` | RQ-prompt-known-kata aggregated run metrics |
| `research/questions-claude/2.1-model-effect-code-quality/findings.md` | RQ-model-quality — How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow? |
| `research/questions-claude/2.1-model-effect-code-quality/runs.csv` | RQ-model-quality aggregated run metrics |
| `research/questions-claude/2.2-model-effect-novel-kata/findings.md` | RQ-model-novel — How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life? |
| `research/questions-claude/2.2-model-effect-novel-kata/runs.csv` | RQ-model-novel aggregated run metrics |
| `research/questions-claude/3.1-workflow-model-interaction/findings.md` | RQ-workflow-model — Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model? |
| `research/questions-claude/3.1-workflow-model-interaction/runs.csv` | RQ-workflow-model aggregated run metrics |
| `research/questions-claude/4.1-tdd-effect-code-quality/findings.md` | RQ-tdd-quality — How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference? |
| `research/questions-claude/4.1-tdd-effect-code-quality/runs.csv` | RQ-tdd-quality aggregated run metrics |
| `research/questions-claude/4.2-tdd-effect-correctness/findings.md` | RQ-tdd-correctness — Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata? |
| `research/questions-claude/4.2-tdd-effect-correctness/runs.csv` | RQ-tdd-correctness aggregated run metrics |
| `research/questions-claude/4.3-tdd-context-engineering/findings.md` | RQ-context — Which form of context structuring — isolated subagent contexts per TDD phase (v4.1), a shared, accumulated single context (v5.1), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (v6.1), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (v7.1) — leads to better code quality? |
| `research/questions-claude/4.3-tdd-context-engineering/runs.csv` | RQ-context aggregated run metrics |
| `research/questions-claude/4.4-external-tdd-pocock-vs-v62/findings.md` | RQ-pocock-vs-v62 — How does the external Matt Pocock TDD skill (v9-pocock-tdd: single skill, inline phases, tail refactor) perform on claim-office-example-mapping against the internal default baseline v6.2-with-why-cleaned (multi-command + refactor subagent, per-cycle refactor) — on correctness, code quality, TDD discipline and cost? |
| `research/questions-claude/4.4-external-tdd-pocock-vs-v62/runs.csv` | RQ-pocock-vs-v62 aggregated run metrics |
| `research/questions-claude/4.5-architecture-axis-opus5/findings.md` | RQ-architecture-axis-opus5 — Does the TDD architecture axis (v3 structureless / v5.1 single context / v6.1 hybrid / v6.6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer? |
| `research/questions-claude/4.5-architecture-axis-opus5/runs.csv` | RQ-architecture-axis-opus5 aggregated run metrics |
| `research/questions-claude/5.1-workflow-stability/findings.md` | RQ-stability — How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count? |
| `research/questions-claude/5.1-workflow-stability/runs.csv` | RQ-stability aggregated run metrics |
| `research/questions-opencode/1.1-model-quality-oc/findings.md` | RQ-model-quality-oc — How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the v5.1-testlist-scope-fix-oc workflow? |
| `research/questions-opencode/1.1-model-quality-oc/runs.csv` | RQ-model-quality-oc aggregated run metrics |
| `research/questions-opencode/1.2-model-novel-kata-oc/findings.md` | RQ-model-novel-oc — How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the v5.1-testlist-scope-fix-oc workflow? |
| `research/questions-opencode/1.2-model-novel-kata-oc/runs.csv` | RQ-model-novel-oc aggregated run metrics |
| `research/questions-pi/1.1-model-quality-pi/findings.md` | RQ-model-quality-pi — How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the v6.2.1-phase-continuation-pi workflow? |
| `research/questions-pi/1.1-model-quality-pi/runs.csv` | RQ-model-quality-pi aggregated run metrics |
| `research/questions-pi/1.2-model-novel-kata-pi/findings.md` | RQ-model-novel-pi — How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the v6.2-with-why-cleaned-pi workflow? |
| `research/questions-pi/1.2-model-novel-kata-pi/runs.csv` | RQ-model-novel-pi aggregated run metrics |
| `research/questions-cursor-cli/1.1-model-quality-cursor/findings.md` | RQ-model-quality-cursor — How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping? |
| `research/questions-cursor-cli/1.1-model-quality-cursor/runs.csv` | RQ-model-quality-cursor aggregated run metrics |
| `research/questions-cross/1.2-harness-requesty/findings.md` | RQ-harness-requesty — How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant? |
| `research/questions-cross/1.2-harness-requesty/runs.csv` | RQ-harness-requesty aggregated run metrics |
| `research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/findings.md` | RQ-cost-sol-pi-vs-opus-cc — How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas? |
| `research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/runs.csv` | RQ-cost-sol-pi-vs-opus-cc aggregated run metrics |
| `research/questions-cross/1.4-opus-cc-vs-pi/findings.md` | RQ-model-quality-cc-vs-pi — Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (v6.2)? |
| `research/questions-cross/1.4-opus-cc-vs-pi/runs.csv` | RQ-model-quality-cc-vs-pi aggregated run metrics |
| `research/questions-cross/1.5-v3-emergent-tdd/findings.md` | RQ-v3-emergent-tdd — Under a bare 'use TDD' instruction that prescribes no phase markers (v3), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated? |
| `research/questions-cross/1.5-v3-emergent-tdd/runs.csv` | RQ-v3-emergent-tdd aggregated run metrics |
| `experiments/runs/` | All run directories with source, transcript, metrics |

