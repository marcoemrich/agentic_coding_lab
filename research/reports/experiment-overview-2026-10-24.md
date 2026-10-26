# Experiment Overview: TDD Workflows × Models × Prompt Styles

As of: 2026-10-24. This report covers **45 research questions over 1330 distinct runs**. The lab's run pool holds 1985 runs in total, and the difference is two subtrees that are deliberately not reported here: `research/workflow-dev/` (25 questions, 562 runs), which develops the measuring apparatus itself — workflow variants, prompt reductions, refactor mechanics — and is hard to read without the workflow version history, and `research/kata-dev/` (3 questions, 48 runs), which validates the katas rather than using them. Together those two account for 399 runs that no question in this report selects; a further 256 runs in the pool belong to no research question at all. Both subtrees, with their questions and findings, are versioned in the repository under their own directories. The per-question data-basis lines in §4 sum to 1757 rather than 1330, because questions deliberately share runs — a single run can be a replicate in several questions at once, and re-using it instead of re-running it is what keeps the matrix affordable.

**Author:** [Marco Emrich](https://www.linkedin.com/in/marco-emrich) (codecentric AG) — co-initiator of [EXACT Coding](https://leanpub.com/exact-coding) together with Ferdinand Ade.

**Repository:** [github.com/marcoemrich/agentic_coding_lab](https://github.com/marcoemrich/agentic_coding_lab) — all scripts, workflow definitions, run artifacts and the stylesheet are publicly versioned there.

## About the Study

This lab is the empirical validation platform for [**EXACT Coding**](https://leanpub.com/exact-coding) — EXample-guided AI-Collaborative Test-driven Coding. The method makes two claims: that an AI agent produces better code when it is handed concrete input/output examples instead of prose, and when it is held to a test-driven cycle instead of left to implement freely. Both are testable, and the lab tests them by running the same coding tasks through a spectrum of agent workflows: from vibe-coding baselines that implement in one shot and add tests afterwards, through EXACT-conformant setups that decompose the work into an explicit test list and a red-green-refactor cycle, to a delayed-refactor control that vibe-codes first and cleans up once at the end. Every configuration runs repeatedly, and the resulting code is measured rather than judged.

This snapshot reports 45 research questions over 1330 distinct runs, as of 2026-10-24. Both core claims still hold, and they still hold on separate targets — concrete examples carry correctness, an enforced cleanup cadence carries code quality, and neither substitutes for the other. The research front has moved twice since the previous snapshot. First, the question of whether a newer model still needs the scaffolding has been answered in both directions: one model generation closed most of the gap on its own, and the one after it reopened it, writing more complex code and a markedly weaker test suite when left unscaffolded. Second, the study is no longer single-language: the same three-way comparison now runs on four target stacks, and that is what exposed the mechanism behind the whole quality effect — the workflow does not multiply quality, it imposes a floor, so its measured benefit is set by how good the model's untutored output already was.

### Scope

Everything below holds **for** a specific stack, and its three axes should be read before any number is carried elsewhere.

**Harness.** Four agent CLIs, each pinned in `experiments/docker/Dockerfile`: Claude Code `2.1.280`, OpenCode `1.15.10`, pi `0.81.1` and cursor-agent `2026.07.23-e383d2b`. All run **headless, with no human in the loop** — the agent receives the task once and works to completion or to its budget without ever asking a clarifying question. This is the one scope limit that never drifts, and it is worth more than a sentence. Several of the correctness losses documented below are failure modes a single human question would have caught: a run that stops early and declares itself done, a test list that silently omits a catalogue of cases, a CLI contract guessed wrong. The numbers therefore bound **unattended autonomy**. They are not a ceiling for supervised use, and nothing here should be read as a limit on what a developer and an agent reach together.

**Models.** Roughly fifty model configurations across a dozen provider families: Anthropic (Opus 4.6/4.7/4.8/5/5.5, Sonnet 4.6/5/5.5, Haiku 4.5, Fable 5/5.1), OpenAI (GPT-5.3 Codex Spark, GPT-5.6 Sol/Terra, GPT-6 Sol/Astra, GPT-6.1 Sol), Google (Gemini 3.5 Flash, Gemini 4 Argon), DeepSeek, Zhipu (GLM 5.1/5.2/5.3), Moonshot (Kimi K2.6/K2.7/K3), MiniMax, Mistral, xAI (Grok) and Alibaba (Qwen3), plus Cursor's own Composer 2.5. Most Anthropic configurations are covered with reasoning both enabled and disabled. Third-party models route through a gateway; the Anthropic models run natively or through the same gateway, and two research questions isolate what that routing itself costs.

**Target language.** Four stacks, each with a fixed toolchain: **TypeScript** (pnpm/tsx/Vitest/ESLint+SonarJS), **Java** (Maven/JUnit 5/PMD), **Python** (uv/pytest/ruff/complexipy) and **Rust** (Cargo/clippy/rust-code-analysis). The research questions in this snapshot cover all four — TypeScript carries the great majority and is the default a run inherits when it declares no stack, while Java, Python and Rust each carry one dedicated three-way comparison. Quality-tool output is **not comparable across stacks**: SonarJS, PMD, complexipy and clippy produce different finding populations, and the four mutation engines generate different mutant populations. Across stacks only directions and orderings are compared, never absolute values. Transfer to other target languages, and to interactive setups with a human in the loop, is open and outside this scope.

### AI Disclosure

This snapshot was produced with the `/build-overview` skill in **Claude Code**. Data-driven sections — the RQ overview table, coverage values, per-RQ finding lists, reproducibility and files tables — are generated deterministically from `research/{questions-*,workflow-dev}/*/{README,findings}.md` via `experiments/generate-snapshot-skeleton.py`. Synthesis sections (intro, per-RQ paragraphs, cross-RQ synthesis, limitations) are LLM-drafted and human-curated. The generation is therefore fully traceable.

## Key Findings

Seven key findings from the 45 research questions — details and evidence in §4, cross-RQ synthesis in §5. The through-line: the two building blocks of the method work, but on **separate targets** — concrete examples carry correctness, an enforced cleanup cadence carries code quality — and the size of the second effect is not a property of the method at all. It is set by how good the model's unaided output already was, which is why the same workflow can look transformative on one model and pointless on the next.

1. **Concrete examples carry correctness — when the tests are written does not.** On the novel kata, Correctness (external) sits at 0.21–0.28 whenever the spec is prose — whether the agent vibe-codes and adds tests afterwards or works test-first — and at ≥ 0.96 whenever the spec is example mapping, again whether the tests come before or after the implementation. The red-green-refactor cycle adds nothing to correctness here: even an agent told only "use TDD" reaches full correctness from an example-mapping spec, and test-first on a prose spec does not rescue it. Whether a test-writing phase matters at all cannot be isolated in this design, because every run writes tests. Practical consequence: on novel domains, concrete I/O examples are the correctness investment; the cycle earns its place through code quality, not through correctness.

2. **An enforced refactor cadence measurably improves code quality — the "TDD" label does not.** On the novel kata, a workflow with a periodic, isolated cleanup step reaches `cognitive_max` 5.7 and Smell Total 1.3, against 11.4–12.2 and 11.6–15.8 for vibe coding — about half the complexity peak and a tenth of the smells. Measured against the naive instruction instead, which lands at `cognitive_max` 19.8, it is under a third. That naive instruction is the point: an agent that only hears "use TDD" and structures the process itself produces the heaviest code in the entire matrix, worse than no TDD at all. Practical consequence: for long-lived code, a workflow with an enforced cleanup step per cycle pays off; a mere "do it in TDD" instruction does not.

3. **Example mapping is the dominant correctness lever on novel tasks — user story ≈ prose.** Example mapping raises Correctness (external) by +48–76 percentage points over prose on the strong models (Opus 4.7: 0.21 → 0.97; Opus 4.6: 0.23 → 0.87; Sonnet 4.6: 0.23 → 0.71), because concrete input/output pairs resolve the domain's ambiguities. User story performs practically identically to prose (Δ ≤ 8 pp, no consistent direction). Two boundaries: on a training-known kata the effect is nil, and the lever is model-gated — a model too weak for the task stays at 0.00 in every style and both reasoning modes. Practical consequence: when writing a spec for a novel domain, concrete I/O pairs are the most valuable investment; rewriting prose as user stories buys nothing.

4. **The model generation moves code quality as much as the entire workflow apparatus does.** Measured on the same architecture axis across two model generations: structureless TDD on the newer model reaches `cognitive_max` 5.3 on the novel kata — essentially the value the hybrid architecture needed on the previous generation (5.71) — and its Smell Total drops from 16.8 to 0.0 across all twelve runs. The architecture ranking still holds, but the margin it buys was shrinking while its price did not: the most elaborate configuration costs 36× the tokens and 17× the wallclock of the plain baseline. Practical consequence: re-measure how much structure your current model still needs instead of carrying a workflow forward on reputation — and read finding 5 before concluding which way the next re-measurement will go.

5. **That trend did not continue — on the following model generation the workflow's advantage grew back.** Holding the workflow constant and stepping one generation further, every quality axis that separates at all separates *more*: `cognitive_max` falls 7.60 → 2.00 under the method against 6.20 → 3.60 on the previous model, and Mutation Score rises 0.76 → 0.95 against 0.96 → 0.97. The hypothesis that a newer model needs the scaffolding less is refuted on this kata. Unscaffolded, the newer model is the weaker engineer of the two — more complex code and a far weaker suite — while being 2.6× faster and 2.7× cheaper, and the mechanism is step size: it writes four to eight failing tests at once where every structured cell writes exactly one. Practical consequence: model capability and workflow benefit are not on a single trend line, so "newer model, less process" is not a safe inference in either direction. Measure the pair you actually run.

6. **The workflow imposes a quality floor; it does not multiply quality — which is why its benefit looks language-dependent and is not.** Across four target stacks, two models and two katas, the structured column spans `cognitive_avg` 4.2–7.0, a factor of 1.7, while the unstructured column spans 5.0–21.8, a factor of 4.4. Sorted by effect size, the rows sort themselves by their unstructured baseline: the method pulls the hardest function down to roughly the same level wherever it starts, so it looks transformative where the model wrote complex code (3.5× on the older model and TypeScript) and does nothing measurable where the model already wrote simple code (0.9× on the strongest model and Python). Practical consequence: do not estimate what the method will buy you from someone else's headline ratio. Measure your own unaided baseline first — that number, not the language and not the method, predicts the gain.

7. **"Use TDD" does not produce TDD.** Under a bare instruction with no enforced phases, 70 of 71 runs do open with a test — but across the 55 runs in the factor grid only 22 % open with an increment of two cases or fewer, and 31 % never run the tests before implementing, so no red state is ever observed. Only one model of six works in genuine TDD-sized steps; four never refactor at all. Of 60 refactoring claims across every run, 14 survived hand validation. Practical consequence: an agent reporting that it worked test-first is reporting the file ordering, not the discipline — if the cycle matters to you, the workflow has to enforce it and the artifact has to be measured.

---

## 1. Research Questions Overview

### Research Questions (Claude Code)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-prompt-correctness](research/questions-claude/1.1-prompt-style-correctness/) | Does example mapping increase correctness compared to prose and user story — and is the effect model-dependent? |  | 24 | 24/24 (100 %) | 129 |
| 1.2 | [RQ-prompt-known-kata](research/questions-claude/1.2-prompt-style-known-kata/) | Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent? |  | 9 | 9/9 (100 %) | 45 |
| 2.1 | [RQ-model-quality](research/questions-claude/2.1-model-effect-code-quality/) | How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow? |  | 12 | 12/12 (100 %) | 44 |
| 2.2 | [RQ-model-novel](research/questions-claude/2.2-model-effect-novel-kata/) | How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life? |  | 5 | 5/5 (100 %) | 30 |
| 2.3 | [RQ-fable-vs-opus5](research/questions-claude/2.3-fable-vs-opus5-current-workflow/) | How do Fable 5, Fable 5.1, Opus 5 and Sonnet 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow? |  | 4 | 4/4 (100 %) | 20 |
| 2.4 | [RQ-opus55-current-workflow](research/questions-claude/2.4-opus55-current-workflow/) | Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction? |  | 6 | 6/6 (100 %) | 30 |
| 3.1 | [RQ-workflow-model](research/questions-claude/3.1-workflow-model-interaction/) | Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model? |  | 6 | 6/6 (100 %) | 49 |
| 4.1 | [RQ-tdd-quality](research/questions-claude/4.1-tdd-effect-code-quality/) | How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference? |  | 16 | 16/16 (100 %) | 103 |
| 4.2 | [RQ-tdd-correctness](research/questions-claude/4.2-tdd-effect-correctness/) | Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata? |  | 7 | 7/7 (100 %) | 36 |
| 4.3 | [RQ-context](research/questions-claude/4.3-tdd-context-engineering/) | Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality? |  | 4 | 4/4 (100 %) | 21 |
| 4.5 | [RQ-architecture-axis-opus5](research/questions-claude/4.5-architecture-axis-opus5/) | Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer? |  | 16 | 16/16 (100 %) | 111 |
| 4.6 | [RQ-sol-line-on-opus-cc](research/questions-claude/4.6-sol-line-on-opus-cc/) | Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the opus line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there? |  | 6 | 6/6 (100 %) | 31 |
| 4.7 | [RQ-external-tdd-workflows-opus5](research/questions-claude/4.7-external-tdd-workflows-opus5/) | Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline exact-hybrid-v2.4-lab-split-cc — on correctness, code quality, TDD discipline and cost. |  | 4 | 3/4 (75 %) | 15 |
| 4.8 | [RQ-tcr-variants-opus5](research/questions-claude/4.8-tcr-variants-opus5/) | How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement? |  | 4 | 4/4 (100 %) | 18 |
| 4.9 | [RQ-current-ptdd-vs-exact-opus-native](research/questions-claude/4.9-current-ptdd-vs-exact-opus-native/) | On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency? |  | 2 | 2/2 (100 %) | 28 |
| 4.10 | [RQ-test-list-dimensions-opus-native](research/questions-claude/4.10-test-list-dimensions-opus-native/) | On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality? |  | 2 | 2/2 (100 %) | 20 |
| 4.11 | [RQ-inline-refactor-operationalization-opus-native](research/questions-claude/4.11-inline-refactor-operationalization-opus-native/) | On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default? |  | 2 | 2/2 (100 %) | 15 |
| 4.12 | [RQ-old-vs-new-exact-line-opus55](research/questions-claude/4.12-old-vs-new-exact-line-opus55/) | On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line? |  | 4 | 4/4 (100 %) | 20 |
| 4.13 | [RQ-tdd-workflow-comparison-opus55](research/questions-claude/4.13-tdd-workflow-comparison-opus55/) | How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code. |  | 7 | 7/7 (100 %) | 35 |
| 5.1 | [RQ-stability](research/questions-claude/5.1-workflow-stability/) | How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count? |  | 6 | 5/6 (83 %) | 59 |

### Research Questions (OpenCode)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-oc](research/questions-opencode/1.1-model-quality-oc/) | How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow? |  | 6 | 6/6 (100 %) | 30 |
| 1.2 | [RQ-model-novel-oc](research/questions-opencode/1.2-model-novel-kata-oc/) | How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow? |  | 8 | 8/8 (100 %) | 40 |

### Research Questions (pi)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-pi](research/questions-pi/1.1-model-quality-pi/) | How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-hybrid-v4.2-phase-continuation-pi workflow? |  | 12 | 12/12 (100 %) | 60 |
| 1.2 | [RQ-model-novel-pi](research/questions-pi/1.2-model-novel-kata-pi/) | How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the exact-hybrid-v4-cleaned-pi workflow? |  | 18 | 18/18 (100 %) | 90 |
| 1.3 | [RQ-route-effect-pi](research/questions-pi/1.3-route-effect-pi/) | How do transport route and reasoning channel each affect code quality, TDD discipline, throughput and correctness for one and the same model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt style? |  | 3 | 3/3 (100 %) | 15 |
| 1.4 | [RQ-spark-vs-sol](research/questions-pi/1.4-spark-vs-sol/) | On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it? |  | 4 | 4/4 (100 %) | 20 |
| 1.5 | [RQ-astra-pi](research/questions-pi/1.5-astra-vs-pi-references/) | On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style? |  | 5 | 5/5 (100 %) | 25 |
| 1.6 | [RQ-astra-native-sol](research/questions-pi/1.6-astra-native-sol-line/) | Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol? |  | 8 | 8/8 (100 %) | 40 |
| 1.7 | [RQ-tcr-variants-sol](research/questions-pi/1.7-tcr-variants-sol/) | How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ? |  | 6 | 6/6 (100 %) | 30 |
| 1.8 | [RQ-test-list-dimensions-sol-pi](research/questions-pi/1.8-test-list-dimensions-sol-pi/) | On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality? |  | 2 | 2/2 (100 %) | 20 |
| 1.9 | [RQ-test-list-dimensions-multikata-sol-pi](research/questions-pi/1.9-test-list-dimensions-multikata-sol-pi/) | Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default? |  | 4 | 4/4 (100 %) | 20 |
| 1.10 | [RQ-gpt6-sol-vs-gpt56-sol](research/questions-pi/1.10-gpt6-sol-vs-gpt56-sol/) | Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost? |  | 4 | 4/4 (100 %) | 20 |
| 1.11 | [RQ-workflow-axis-gpt6-sol](research/questions-pi/1.11-workflow-axis-gpt6-sol/) | On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top? |  | 6 | 6/6 (100 %) | 30 |
| 1.12 | [RQ-workflow-axis-gpt61-sol](research/questions-pi/1.12-workflow-axis-gpt61-sol/) | On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top? |  | 6 | 6/6 (100 %) | 30 |

### Research Questions (Cursor CLI)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.1 | [RQ-model-quality-cursor](research/questions-cursor-cli/1.1-model-quality-cursor/) | How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping? |  | 3 | 2/3 (67 %) | 10 |

### Research Questions (cross-harness)

| Ch. | RQ | Question | Status | Cells | Coverage | n Runs |
|---|---|---|---|---:|---:|---:|
| 1.2 | [RQ-harness-requesty](research/questions-cross/1.2-harness-requesty/) | How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant? |  | 6 | 6/6 (100 %) | 30 |
| 1.3 | [RQ-cost-sol-pi-vs-opus-cc](research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/) | How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas? |  | 4 | 4/4 (100 %) | 20 |
| 1.4 | [RQ-model-quality-cc-vs-pi](research/questions-cross/1.4-opus-cc-vs-pi/) | Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (hybrid-v4)? |  | 4 | 4/4 (100 %) | 20 |
| 1.5 | [RQ-v3-emergent-tdd](research/questions-cross/1.5-v3-emergent-tdd/) | Under a bare 'use TDD' instruction that prescribes no phase markers (inline-tdd-v1), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated? |  | 10 | 10/10 (100 %) | 49 |
| 1.6 | [RQ-test-list-dimensions-replication](research/questions-cross/1.6-test-list-dimensions-replication/) | Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance? |  | 4 | 4/4 (100 %) | 40 |
| 1.8 | [RQ-exact-coding-java](research/questions-cross/1.8-exact-coding-java/) | On Java 17 with JUnit 5 and Maven, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |  | 12 | 12/12 (100 %) | 60 |
| 1.9 | [RQ-exact-coding-python](research/questions-cross/1.9-exact-coding-python/) | On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |  | 12 | 12/12 (100 %) | 60 |
| 1.10 | [RQ-exact-coding-typescript](research/questions-cross/1.10-exact-coding-typescript/) | On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |  | 6 | 6/6 (100 %) | 59 |
| 1.11 | [RQ-exact-coding-rust](research/questions-cross/1.11-exact-coding-rust/) | On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5? |  | 6 | 6/6 (100 %) | 30 |
| 1.12 | [RQ-current-models-ptdd](research/questions-cross/1.12-current-models-ptdd/) | How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route? |  | 10 | 10/10 (100 %) | 50 |

## 2. Experiment Design

### 2.1 Variables

**Workflow** — six generations (details: `research/workflow-dev/workflow-construction.md` — inventory):

| Workflow | Arm | Version | Harness | Status | Parent |
|---|---|---|---|---|---|
| `exact-subagents-v1-cc` | subagents | 1 | cc | superseded | — |
| `exact-subagents-v2-testlist-fix-cc` | subagents | 2 | cc | trunk | `exact-subagents-v1-cc` |
| `exact-subagents-v2-testlist-fix-pi` | subagents | 2 | pi | trunk | `exact-subagents-v2-testlist-fix-cc` |
| `exact-single-context-v1-cc` | single-context | 1 | cc | superseded | — |
| `exact-single-context-v2-testlist-fix-cc` | single-context | 2 | cc | trunk | `exact-single-context-v1-cc` |
| `exact-single-context-v2-testlist-fix-oc` | single-context | 2 | oc | trunk | `exact-single-context-v2-testlist-fix-cc` |
| `exact-single-context-v2-testlist-fix-pi` | single-context | 2 | pi | trunk | `exact-single-context-v2-testlist-fix-cc` |
| `exact-single-context-v3-no-subagent-cc` | single-context | 3 | cc | branch | `exact-hybrid-v8-no-end-refactor-cc` |
| `exact-hybrid-v1-cc` | hybrid | 1 | cc | superseded | — |
| `exact-hybrid-v2-testlist-fix-cc` | hybrid | 2 | cc | superseded | `exact-hybrid-v1-cc` |
| `exact-hybrid-v2-testlist-fix-pi` | hybrid | 2 | pi | trunk | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2-testlist-fix-oc` | hybrid | 2 | oc | trunk | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2-testlist-fix-cursor` | hybrid | 2 | cursor | trunk | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.1-no-pep-cc` | hybrid | 2.1 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.2-no-emoji-cc` | hybrid | 2.2 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.3-no-pep-no-emoji-cc` | hybrid | 2.3 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.4-lab-split-cc` | hybrid | 2.4 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.5-no-continuation-cc` | hybrid | 2.5 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.6-refactor-gate-cc` | hybrid | 2.6 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.7-continuation-guard-cc` | hybrid | 2.7 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.8-pure-split-cc` | hybrid | 2.8 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v2.9-stack-profile-cc` | hybrid | 2.9 | cc | branch | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v3-with-why-cc` | hybrid | 3 | cc | trunk | `exact-hybrid-v2-testlist-fix-cc` |
| `exact-hybrid-v4-cleaned-cc` | hybrid | 4 | cc | trunk | `exact-hybrid-v3-with-why-cc` |
| `exact-hybrid-v4-cleaned-oc` | hybrid | 4 | oc | trunk | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v4-cleaned-pi` | hybrid | 4 | pi | trunk | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v4.2-phase-continuation-pi` | hybrid | 4.2 | pi | branch | `exact-hybrid-v4-cleaned-pi` |
| `exact-hybrid-v4.2-phase-continuation-cursor` | hybrid | 4.2 | cursor | branch | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v4.3-audit-bundle-cc` | hybrid | 4.3 | cc | branch | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v4.4-metric-refactor-cc` | hybrid | 4.4 | cc | branch | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v5-end-refactor-cc` | hybrid | 5 | cc | trunk | `exact-hybrid-v4-cleaned-cc` |
| `exact-hybrid-v6-lab-split-cc` | hybrid | 6 | cc | trunk | `exact-hybrid-v5-end-refactor-cc` |
| `exact-hybrid-v6-lab-split-pi` | hybrid | 6 | pi | trunk | `exact-hybrid-v6-lab-split-cc` |
| `exact-hybrid-v6-lab-split-oc` | hybrid | 6 | oc | trunk | `exact-hybrid-v6-lab-split-cc` |
| `exact-hybrid-v6-lab-split-cursor` | hybrid | 6 | cursor | trunk | `exact-hybrid-v6-lab-split-cc` |
| `exact-hybrid-v7-app-subordinate-cc` | hybrid | 7 | cc | trunk | `exact-hybrid-v6-lab-split-cc` |
| `exact-hybrid-v7-app-subordinate-pi` | hybrid | 7 | pi | trunk | `exact-hybrid-v7-app-subordinate-cc` |
| `exact-hybrid-v8-no-end-refactor-cc` | hybrid | 8 | cc | trunk | `exact-hybrid-v7-app-subordinate-cc` |
| `exact-green-refactor-v1-cc` | green-refactor | 1 | cc | superseded | — |
| `exact-green-refactor-v2-testlist-fix-cc` | green-refactor | 2 | cc | trunk | `exact-green-refactor-v1-cc` |
| `exact-sol-v1-pi` | sol | 1 | pi | trunk | — |
| `exact-sol-v1-cc` | sol | 1 | cc | trunk | `exact-sol-v1-pi` |
| `exact-sol-v1.1-subagent-pi` | sol | 1.1 | pi | branch | `exact-sol-v1-pi` |
| `exact-sol-v1.2-app-pi` | sol | 1.2 | pi | branch | `exact-sol-v1-pi` |
| `exact-sol-v1.2.1-measured-model-pi` | sol | 1.2.1 | pi | branch | `exact-sol-v1.2-app-pi` |
| `exact-sol-v1.2.2-measured-eslint-pi` | sol | 1.2.2 | pi | branch | `exact-sol-v1.2-app-pi` |
| `exact-sol-v1.2.3-measured-tool-pi` | sol | 1.2.3 | pi | branch | `exact-sol-v1.2-app-pi` |
| `exact-sol-v1.3-stack-profile-pi` | sol | 1.3 | pi | branch | `exact-sol-v1-pi` |
| `exact-sol-v1.3.1-ponytail-pi` | sol | 1.3.1 | pi | branch | `exact-sol-v1.3-stack-profile-pi` |
| `exact-sol-v1.3.2-local-git-control-pi` | sol | 1.3.2 | pi | branch | `exact-sol-v1.3-stack-profile-pi` |
| `exact-sol-v1.4-domain-boundary-trial-pi` | sol | 1.4 | pi | branch | `exact-sol-v1.3.2-local-git-control-pi` |
| `exact-sol-v1.5-tcr-parity-domain-trial-pi` | sol | 1.5 | pi | superseded | `exact-tcr-v1.3-domain-boundary-trial-pi` |
| `exact-sol-v1.5-tcr-parity-domain-trial-cc` | sol | 1.5 | cc | superseded | `exact-sol-v1.5-tcr-parity-domain-trial-pi` |
| `exact-sol-v1.6-test-list-dimensions-pi` | sol | 1.6 | pi | superseded | `exact-sol-v1.5-tcr-parity-domain-trial-pi` |
| `exact-sol-v1.6-test-list-dimensions-cc` | sol | 1.6 | cc | superseded | `exact-sol-v1.6-test-list-dimensions-pi` |
| `exact-ptdd-v1-pi` | ptdd | 1 | pi | trunk | `exact-sol-v1.6-test-list-dimensions-pi` |
| `exact-ptdd-v1-cc` | ptdd | 1 | cc | trunk | `exact-ptdd-v1-pi` |
| `exact-ptdd-v1.1-refactor-subagent-pi` | ptdd | 1.1 | pi | branch | `exact-ptdd-v1-pi` |
| `exact-ptdd-v1.1-refactor-subagent-cc` | ptdd | 1.1 | cc | branch | `exact-ptdd-v1.1-refactor-subagent-pi` |
| `exact-ptdd-v1.2-verification-split-pi` | ptdd | 1.2 | pi | branch | `exact-ptdd-v1-pi` |
| `exact-ptdd-v1.2-verification-split-cc` | ptdd | 1.2 | cc | branch | `exact-ptdd-v1.2-verification-split-pi` |
| `exact-sol-v1.6.1-naming-refactor-trial-cc` | sol | 1.6.1 | cc | branch | `exact-sol-v1.6-test-list-dimensions-cc` |
| `exact-tcr-v1-pi` | tcr | 1 | pi | trunk | — |
| `exact-tcr-v1.1-srp-pi` | tcr | 1.1 | pi | branch | `exact-tcr-v1-pi` |
| `exact-tcr-v1.2-domain-responsibility-pi` | tcr | 1.2 | pi | branch | `exact-tcr-v1.1-srp-pi` |
| `exact-tcr-v1.3-domain-boundary-trial-pi` | tcr | 1.3 | pi | branch | `exact-tcr-v1.2-domain-responsibility-pi` |
| `exact-tcr-v1.4-domain-boundary-app-pi` | tcr | 1.4 | pi | branch | `exact-tcr-v1.3-domain-boundary-trial-pi` |
| `baseline-oneshot-v1-cc` | oneshot | 1 | cc | branch | — |
| `baseline-oneshot-v1-oc` | oneshot | 1 | oc | branch | `baseline-oneshot-v1-cc` |
| `baseline-oneshot-v1-pi` | oneshot | 1 | pi | branch | `baseline-oneshot-v1-cc` |
| `baseline-iterative-v1-cc` | iterative | 1 | cc | branch | — |
| `baseline-inline-tdd-v1-cc` | inline-tdd | 1 | cc | branch | — |
| `baseline-inline-tdd-v1-pi` | inline-tdd | 1 | pi | branch | `baseline-inline-tdd-v1-cc` |
| `baseline-inline-tdd-v1.1-local-git-cc` | inline-tdd | 1.1 | cc | branch | `baseline-inline-tdd-v1-cc` |
| `baseline-inline-tdd-v1.1-local-git-pi` | inline-tdd | 1.1 | pi | branch | `baseline-inline-tdd-v1.1-local-git-cc` |
| `baseline-end-refactor-only-v1-agent-cc` | end-refactor-only | 1 | cc | branch | `baseline-oneshot-v1-cc` |
| `baseline-end-refactor-only-v1-native-cc` | end-refactor-only | 1 | cc | branch | `baseline-oneshot-v1-cc` |
| `external-pocock-2026-09-04-cc` | pocock | 2026-09-04 | cc | vendored | — |
| `external-superpowers-2026-09-04-cc` | superpowers | 2026-09-04 | cc | vendored | — |
| `external-tcr-kentbeck-2026-09-14-cc` | tcr-kentbeck | 2026-09-14 | cc | vendored | — |
| `external-tcrdd-git-gamble-2026-09-14-cc` | tcrdd-gamble | 2026-09-14 | cc | vendored | — |
| `external-tcrdd-bsene-2026-09-14-cc` | tcrdd-bsene | 2026-09-14 | cc | vendored | — |
| `external-kesseler-2026-09-30-cc` | kesseler | 2026-09-30 | cc | vendored | — |
| `external-tcr-kentbeck-2026-09-14-pi` | tcr-kentbeck | 2026-09-14 | pi | vendored | `external-tcr-kentbeck-2026-09-14-cc` |
| `external-tcrdd-git-gamble-2026-09-14-pi` | tcrdd-gamble | 2026-09-14 | pi | vendored | `external-tcrdd-git-gamble-2026-09-14-cc` |
| `external-tcrdd-bsene-2026-09-14-pi` | tcrdd-bsene | 2026-09-14 | pi | vendored | `external-tcrdd-bsene-2026-09-14-cc` |
| `exact-subagents-v2.1-shared-context-cc` | subagents | 2.1 | cc | discarded | `exact-subagents-v2-testlist-fix-cc` |
| `exact-subagents-v2.1.1-fake-it-green-cc` | subagents | 2.1.1 | cc | discarded | `exact-subagents-v2.1-shared-context-cc` |
| `exact-single-context-v2.1-minimized-cc` | single-context | 2.1 | cc | discarded | `exact-single-context-v2-testlist-fix-cc` |
| `exact-hybrid-v4.1-refactor-vocab-cc` | hybrid | 4.1 | cc | discarded | `exact-hybrid-v4-cleaned-cc` |

Configuration: `experiments/workflows/<category>/<variant>/` — `.claude/`, `.opencode/`, `.cursor/` or `.pi/` depending on harness. Naming, lineage and status of every variant: `experiments/workflows/LINEAGE.yaml`. Discarded variants (exact-hybrid-v4.1-refactor-vocab-cc, exact-single-context-v2.1-minimized-cc, exact-subagents-v2.1-shared-context-cc, exact-subagents-v2.1.1-fake-it-green-cc) live under `experiments/workflows/_archive/`.

**Workflow mechanics in detail.** The six generations are not merely a scale of "more/less TDD", but a systematic variation of the EXACT Coding building blocks (test list, red, green, refactor) and their context architecture:

- **baseline-oneshot-v1-cc / baseline-iterative-v1-cc — vibe-coding baselines (no TDD).** A single agent reads the requirements and writes code in one step (oneshot) or with an explicit plan/checklist (iterative); tests are only added afterwards based on the example mapping. Serves as the yardstick for the value of TDD itself (see `experiments/workflows/baselines/baseline-oneshot-v1-cc/.claude/rules/experiment-mode.md`).
- **baseline-inline-tdd-v1-cc — minimal TDD without structure.** A single agent with the minimal instruction "use TDD" — no phase prompts, no subagents. Claude decides on its own how to structure the TDD process. Measures how far a bare request carries (`baseline-inline-tdd-v1-cc/.claude/rules/experiment-mode.md`).
- **exact-subagents-v1-cc / exact-subagents-v2-testlist-fix-cc — strict TDD, multi-context.** Every TDD phase runs as a specialized subagent in an **isolated context** (`Task(subagent_type: "red")` etc.): `test-list` → `red` → `green` → `refactor`. Hypothesis: isolated contexts enforce discipline, but can lose state between phases. subagents-v2 adds to the `test-list` subagent the obligation "Cover every spec example" — closing the dominant failure mode on novel katas (incomplete test list) on Opus 4.7.
- **exact-single-context-v1-cc / exact-single-context-v2-testlist-fix-cc — strict TDD, single-context.** Identical phase script to subagents, but all phases run in the **same context** as skill calls (`Skill(skill: "red")` etc.) instead of subagents. Hypothesis: shared context preserves state, but can lead to loss of discipline. single-context-v2 mirrors subagents-v2 with the identical test-list scope patch.
- **exact-hybrid-v1-cc / exact-hybrid-v2-testlist-fix-cc — hybrid with isolated refactor.** Red and green run inline as skills in the shared context (like single-context), refactor runs as an isolated subagent (like subagents). Hypothesis: combines the spec coherence of the single context with the discipline sharpening of subagent isolation at the most critical point (refactor). hybrid-v2 is the current default base and champion across several RQs. `exact-hybrid-v2.1-no-pep-cc` tests removing psychological rationales in red/green.
- **exact-green-refactor-v1-cc / v7.1-…-testlist-scope-fix — hybrid with isolated green + refactor.** In addition to the refactor isolation from hybrid, green also runs as an isolated subagent. Test list and red remain in the shared context. Tests whether more isolation is automatically better (Pareto-dominated by hybrid on game-of-life: saves tokens, loses quality and correctness).
- **baseline-end-refactor-only-v1-agent-cc / baseline-end-refactor-only-v1-native-cc — delayed-refactor control.** Three sequential phases without TDD cycles: (1) oneshot implementation, (2) tests added afterwards against `prompt.md` with a coverage obligation, (3) a single end refactor. end-refactor-only-agent uses a dedicated `refactor.md` subagent (APP + naming + mandatory attempt), end-refactor-only-native a native inline refactor in inline-tdd style without an agent. Serves as the control axis for the hypothesis "periodic TDD refactor beats end refactor after vibe coding".

Deeper mechanics discussion, the inventory of the active hybrid-v2 reduction line and the load-bearing RQ findings are in `research/workflow-dev/workflow-construction.md`. Which markers drive the parsing of the TDD metrics is documented in `experiments/workflows/MARKERS.md`. Lineage, status and former names of every variant: `experiments/workflows/LINEAGE.yaml`.

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
| oneshot, iterative | prose only | Test examples in example-mapping would be a hidden test gift for non-TDD workflows → unfair towards the TDD workflows. |
| inline-tdd, subagents(.1), single-context(.1), hybrid(.1), green-refactor(.1), v8a/b | all three | Examples serve as natural test cases — for TDD/refactor workflows that is the ideal form of the task. |

---

## 3. Methodology

The pipeline below is current as of this snapshot, with two corrections against the previous one: the harness pins have moved (Claude Code `2.1.170` → `2.1.280`, raised by each model generation as a hard API error rather than a silent fallback), and stack setup is no longer TypeScript-specific — a run installs its declared stack from `experiments/stacks/<slug>/install.sh`, and `analyze-run.sh` and `compute-mutation-score.py` dispatch on the `stack` field written into `metrics.json` when the run is created.

### 3.1 Run pipeline

1. Container image `docker-batch` (Node 22 slim, claude-code `2.1.280` / opencode `1.15.10` / pi `0.81.1` / cursor-agent `2026.07.23-e383d2b`) is started.
2. Run dir `runs/<timestamp>_<kata>_<workflow>_<model>/` is created; workflow config (`.claude/agents/`, `.claude/rules/`) and kata prompt (`prompt.md`) are copied into it, and the run's `stack` is written into `metrics.json`.
3. The declared stack is installed from `experiments/stacks/<slug>/install.sh` — one of `typescript-vitest`, `java-junit-maven`, `python-pytest` or `rust-cargo`, each bringing its own toolchain and its own TDD event reporter.
4. The harness runs headless, without HITL — the agent gets `prompt.md` once and works to completion or to its budget.
5. `analyze-run.sh` writes `metrics.json` and `analysis-report.md`, dispatching the quality tooling on the run's `stack`.
6. `compute-mutation-score.py` is run between batch and aggregation where the question opts into Mutation Score, picking its engine per run from the same field.
7. `aggregate-by-query.py <RQ>/` builds `runs.csv`, `summary.json` and `summary.md` per question.

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
| `production_loc` | Production LoC | Production LoC excluding tests, from the clean-code reporter | lower = better (at equal correctness) |
| `test_lines` | Test LoC | Number of lines of test code (Vitest) | informative |
| `tests_total` | — | Number of tests written by the agent | informative |

**Code quality (ESLint + SonarJS)**

| Metric | Term | What it measures | Direction |
|---|---|---|---|
| `longest_function` | — | Longest function in lines — proxy for the worst spot in the code | lower = better |
| `avg_loc_per_function` | — | Mean function size in lines | lower = better |
| `median_loc_per_function` | — | Median function size (robust against single long outliers) | lower = better |
| `functions` | — | Number of functions | informative |
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

## Overview: Correctness (external) by Model × Prompt Style × Thinking

| Model | Mode | prose | example-mapping | user-story |
|---|---|---|---|---|
| opus-4-7 | +thinking | 0.29 | **0.95** 🏆 | 0.21 |
| opus-4-7 | −thinking | 0.21 | **0.97** 🏆 | 0.28 |
| opus-4-6 | +thinking | 0.24 | **0.77** 🏆 | 0.22 |
| opus-4-6 | −thinking | 0.23 | **0.87** 🏆 | 0.18 |
| sonnet-4-6 | +thinking | 0.21 | **0.35** 🏆 | 0.19 |
| sonnet-4-6 | −thinking | 0.23 | **0.71** 🏆 | 0.17 |
| haiku-4-5 | +thinking | 0.00 | 0.00 | 0.01 |
| haiku-4-5 | −thinking | 0.00 | 0.00 | 0.00 |

Values: mean(`verification_pct`), n=5 each (opus-4-7 −thinking EM n=9; opus-4-6 user story n=7 (+thinking) and n=8 (−thinking)). Higher = better; 🏆 = best style per row (Haiku rows: no effect, all values ~0 → no winner). Routing: opus-4-7 Direct API, the rest Portkey (`controls.model`); one opus-4-6 run via Requesty (see Data basis).

**Findings**:

- **F-prompt-correctness.1** — Weak Models Fail Regardless of Prompt Style
- **F-prompt-correctness.2** — Example Mapping Raises Correctness Massively
- **F-prompt-correctness.3** — Thinking Hurts with Example Mapping (Sonnet > Opus)
- **F-prompt-correctness.4** — User Story ≈ Prose, No Measurable Effect on Correctness
- **F-prompt-correctness.5** — Spread with Example Mapping Is Model-Dependent

Example mapping raises Correctness (external) by 48–76 pp over prose on the strong models (Opus 4.7: 0.21 → 0.97; Opus 4.6: 0.23 → 0.87; Sonnet 4.6: 0.23 → 0.71), while user story sits within 8 pp of prose with no consistent direction — concrete input/output pairs resolve the domain's ambiguities and a reworded narrative does not. The lever is model-gated: Haiku 4.5 stays at 0.00 across all three styles and both reasoning modes in 30 runs, σ=0.00 in every cell, so a model below the task's capability threshold cannot be rescued by the spec. Details: [findings.md](research/questions-claude/1.1-prompt-style-correctness/findings.md).

#### 1.2 RQ-prompt-known-kata — Does the prompt style (prose/user-story/example-mapping) influence correctness and code quality on a training-known kata (Game of Life) — and is this effect model-dependent?

_Data basis: 45 runs · Coverage: 9/9 cells (100 %) at min_replicates=5._

## Overview: verification_pct by Prompt Style × Model

| Model | prose | user-story | example-mapping |
|---|---|---|---|
| opus-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| sonnet-4-6-portkey-no-thinking | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) | **1.00** 🏆 (σ=0) |
| haiku-4-5-portkey-no-thinking | 0.32 (σ=0.39) | 0.01 (σ=0.03) | **0.63** 🏆 (σ=0.51) |

Higher = better; 🏆 = best style per row (Opus/Sonnet: all three styles tied at 1.00 → ties, all 🏆).

**Findings**:

- **F-prompt-known-kata.1** — Opus and Sonnet Deliver Perfect Correctness Regardless of Style
- **F-prompt-known-kata.2** — Haiku Fails Due to Capacity, Not Style
- **F-prompt-known-kata.3** — H1 Confirmed: Prompt Style Does Not Differentiate on Strong Models
- **F-prompt-known-kata.4** — H4 Confirmed: The Ambiguity Mechanism Does Not Apply on a Training-Known Kata
- **F-prompt-known-kata.5** — H2 Cannot Be Assessed: Code Quality Comparable Only on Working Runs
- **F-prompt-known-kata.6** — RQ-prompt-correctness Prediction Confirmed: Prompt Style Does Not Differentiate on a Training-Known Kata
- **F-prompt-known-kata.7** — The Verification Adapter Eliminates Interface Artifacts

On the training-known kata the prompt style stops mattering: Opus 4.6 and Sonnet 4.6 reach Correctness (external) 1.00 in all 30 runs across every style, a spread of 0 pp. This is the boundary condition the correctness question predicted — the ambiguity mechanism that makes example mapping decisive on a novel domain has nothing to resolve where the model already knows the problem. Haiku's failures here are capacity rather than style. Code quality could not be compared across styles, because only working runs are comparable, so that hypothesis stays unassessed. Details: [findings.md](research/questions-claude/1.2-prompt-style-known-kata/findings.md).

#### 2.1 RQ-model-quality — How strongly do the available models (Sonnet 4.6, Opus 4.6, Opus 4.7, Opus 4.8, Fable 5 — each with/without thinking) differ in code quality on a training-known kata under the strongest workflow?

_Data basis: 44 runs · Coverage: 12/12 cells (100 %) at min_replicates=3._

## Overview: Code Quality by Model (means)

| Model | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `longest_function` | `verification_pct` | n |
|---|---:|---:|---:|---:|---:|---:|---:|
| opus-5 | 172.67 | **1.67** 🏆 | 3.00 | 2.00 | 6.33 | **1.00** 🏆 | 3 |
| opus-5-no-thinking | 149.33 | 2.67 | 2.67 | 1.67 | 5.33 | **1.00** 🏆 | 3 |
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

Best value per column in bold + 🏆. Lower = better (except `verification_pct`: higher = better). Quality trophies are correctness-gated: only cells with `verification_pct = 1.0` are trophy-eligible (sonnet-4-6-no-thinking with 0.73 excluded). `verification_pct`: eleven cells tied at 1.00 → ties, all 🏆. `smell_total`: opus-5 (with thinking) holds the lowest value at 1.67, though on a wide spread — σ 1.53 over runs of 2, 0 and 3. opus-5-no-thinking is tighter at 2.67 ± 0.58 but higher.

Opus 5 and Fable 5 share the complexity peak: Fable 5 (with thinking) holds `cognitive_max` 1.0 and `mccabe_max` 2.0 narrowly ahead of Opus 5, while Opus 5 sets the lowest Smell Total (1.67). Opus 4.8 (with thinking) remains the **most compact code** (`code_mass` 145.3, `longest_function` 4.3). Three complementary quality winners: Fable 5 / Opus 5 for the lowest complexity, Opus 4.8 for the lowest Code Mass.

**Findings**:

- **F-model-quality.1** — Correctness (internal + external) on subagents-v1 Is Almost Model-Independently Perfect
- **F-model-quality.2** — Model Ranking: Fable 5 and Opus 5 Lead on Complexity, Opus 4.8 on Code Mass; All Three Clearly Ahead of Opus 4.6 and Sonnet
- **F-model-quality.3** — Thinking Does Not Act Uniformly; Strong on Code Size for Opus 4.8, Neutral for Opus 4.6, Negative on cognitive_max for Sonnet
- **F-model-quality.4** — Token Costs: Sonnet 4.6 and Opus 4.6 the Cheapest, Opus 5 the Most Expensive; Wallclock Uniform
- **F-model-quality.5** — Contract Conformance Almost Fully Achieved Under an Explicit API Contract; One Sonnet Outlier Redefines `Cell` as an Object

Under an explicit API contract correctness stops discriminating — Correctness (internal) is 100 % across all twelve model cells and Correctness (external) is 1.00 in eleven of twelve — so the differentiation moves entirely to code shape. Fable 5 and Opus 5 lead on complexity, Opus 4.8 on Code Mass (APP), all three clearly ahead of Opus 4.6 and Sonnet. Reasoning does not act uniformly: strong on Opus 4.8's code size, neutral on Opus 4.6, negative on Sonnet's `cognitive_max`. One kata, one workflow. Details: [findings.md](research/questions-claude/2.1-model-effect-code-quality/findings.md).

#### 2.2 RQ-model-novel — How do Fable 5, Opus 4.8, Opus 4.7 and Opus 4.6 (each no-thinking) differ in correctness and code quality on a novel kata with ambiguities that differentiates more strongly than the training-known game-of-life?

_Data basis: 30 runs · Coverage: 5/5 cells (100 %) at min_replicates=5._

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better); secondary code quality (`cognitive_max`/`mccabe_max`/`smell_total`/`longest_function`, lower = better) and cost (`total_tokens`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | total_tokens ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| fable-5-no-thinking | 5 | 0.84 | 0.09 | 3.6 | 3.8 | 0.2 | 45.3 M ± 19.8 | 7267 |
| opus-5-no-thinking | 5 | **0.92** 🏆 | 0.07 | **2.6** 🏆 | **3.6** 🏆 | **0.2** 🏆 | 61.4 M ± 13.0 | 5249 |
| opus-4-8-no-thinking | 5 | **0.92** 🏆 | 0.09 | 7.4 | 7.0 | 1.2 | 62.0 M ± 8.8 | 5264 |
| opus-4-7-no-thinking | 10 | 0.67 | 0.36 | 10.5 | 7.9 | 1.8 | 36.1 M ± 7.9 | 3693 |
| opus-4-6-portkey-no-thinking ³ | 5 | **0.93** 🏆 | 0.08 | 25.0 | 13.4 | 7.0 | **26.9 M ± 12.4** 🏆 | **3411** 🏆 |

`verification_pct`: 4-6 (0.93), opus-5 (0.92) and 4-8 (0.92) are indistinguishable, all three within one σ → three 🏆. fable-5 (0.84) is in the midfield, 4-7 (0.67) falls clearly behind.

**Correctness gating (≥ 0.90) applies to every quality and cost column.** Eligible are opus-4-6, opus-5 and opus-4-8. A trophy is shared when the gap to the best value is smaller than the smaller σ of the two cells.
- **Quality:** opus-5 takes `cognitive_max` (2.6), `mccabe_max` (3.6) and Smell Total (0.2) alone — each gap to opus-4-8 (7.4 / 7.0 / 1.2) exceeds opus-5's σ. opus-4-6 is the most complex eligible cell (25.0 / 13.4 / 7.0). fable-5 matches opus-5 on Smell Total and comes close on the complexity columns, but sits below the gate at 0.84 and **never reaches a full implementation** (max 14/15). opus-4-7's low values come partly from *incomplete* implementations (bimodal, runs down to 3/15).
- **Cost:** opus-4-6 is the cheapest and fastest eligible cell (26.9 M `total_tokens`, 3411 s). Its lead does not rest on the replacement run³: the four Portkey runs alone average 32.1 M and 4170 s, still clearly below opus-5 (61.4 M, 5249 s) and opus-4-8 (62.0 M, 5264 s). opus-4-7 (36.1 M, 3693 s) is cheap too but gated out. fable-5 carries the largest token spread in the field (σ 19.8) and the longest wallclock (7267 s).

³ One of the five opus-4-6 runs is a replacement on the Requesty route (`opus-4-6-requesty-no-thinking`, see README "Routing caveat — Opus 4.6"). Its correctness (15/15) is in the cell's range, its process is not: 379 s, 6.0 M tokens and 13 suite invocations with 3 closed cycles for 38 tests, against 3385–4959 s and 26–38 M tokens for the four Portkey runs. Those ran on Claude Code 2.1.107, the replacement on 2.1.280, so route and harness version change together and cannot be separated at n=1. It pulls the cell's duration and token means down and widens their σ; read the cost columns of this cell with that in mind.

The token figures were re-derived after the subagent-token correction ([RQ-old-vs-new-exact-line-opus55 F-4.12.5](../4.12-old-vs-new-exact-line-opus55/findings.md)). `exact-subagents-v1-cc` isolates all four phases, so every cell was recorded short, and **not by the same factor**: 2.3× for opus-4-6 against 3.3× for fable-5, because the models differ in how much they delegate.

**Findings**:

- **F-model-novel.1** — opus-4-6, opus-4-8 and opus-5 Solve claim-office Reliably, fable-5 in the Midfield, opus-4-7 Does Not
- **F-model-novel.2** — The Workflow × Model Interaction Is the Dominating Effect
- **F-model-novel.3** — Correctness Differentiates More Strongly Than Code Quality
- **F-model-novel.4** — A More Precise Mechanism on opus-4-7: Test-List Completeness, Not Subagent Isolation
- **F-model-novel.5** — opus-4-8 Buys the Best Code Quality at ~2× the Token Cost
- **F-model-novel.6** — fable-5: The Cleanest, Most Thoroughly Tested Code — But Never the Full Spec

On the novel kata the models separate sharply where the training-known one could not tell them apart. Opus 4.6 (0.93), Opus 5 (0.92) and Opus 4.8 (0.92) cluster at the top with tight spread, Fable 5 follows at 0.84, and Opus 4.7 drops to 0.67 with a bimodal distribution — four perfect runs against six between 0.20 and 0.87. The mechanism behind that collapse is test-list completeness, not subagent isolation. Correctness differentiates these models far more than code quality does, and Opus 4.8 buys the best shape at roughly twice the token cost. Details: [findings.md](research/questions-claude/2.2-model-effect-novel-kata/findings.md).

#### 2.3 RQ-fable-vs-opus5 — How do Fable 5, Fable 5.1, Opus 5 and Sonnet 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

Primary outcome `verification_pct` (Correctness (external), higher = better); secondary code quality (`avg_loc_per_function`/`longest_function`/`cognitive_max`/`mccabe_max`/`smell_total`/`code_mass`, lower = better) and cost (`total_tokens`/`cost_usd`/`duration_seconds`, lower = better).

| Model | n | verification_pct ↑ | σ | avg_loc_per_function ↓ | longest_function ↓ | cognitive_max ↓ | mccabe_max ↓ | smell_total ↓ | code_mass ↓ | total_tokens ↓ | cost_usd ↓ | duration_s ↓ |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| opus-5-no-thinking | 5 | **0.95** 🏆 | 0.03 | **3.45** 🏆 | **13.6** 🏆 | 2.8 | **3.0** 🏆 | **0.0** 🏆 | 848.4 | 84.5 M | 58.86 | **2552** 🏆 |
| fable-5-1-no-thinking | 5 | **0.93** 🏆 | 0.08 | 3.63 | 14.4 | **2.6** 🏆 | 3.2 | 0.2 | **805.2** 🏆 | **66.9 M** 🏆 | **43.72** 🏆 | 4042 |
| fable-5-no-thinking | 5 | 0.87 | 0.12 | 4.79 | 17.6 | 3.2 | 3.8 | 0.6 | (659.0) | 75.0 M | 109.96 | 4950 |
| sonnet-5-native-no-thinking | 5 | 0.85 | 0.21 | 6.50 | 26.2 | 4.2 | 4.4 | 0.2 | 817.2 | 110.6 M | (28.28) | (2277) |

`verification_pct`: opus-5 (0.95) and fable-5-1 (0.93) differ by 0.02 — far below 1 σ of either cell → both 🏆. fable-5 (0.87) and sonnet-5-native (0.85) are not merely lower but fail *differently* (F-fable-vs-opus5.2), which is why they are treated as behind rather than as tied.

**Correctness gating of the quality trophies:** Quality and efficiency trophies go only to cells with mean `verification_pct` ≥ 0.90. opus-5 (0.95) and fable-5-1 (0.93) qualify; **fable-5 (0.87) and sonnet-5-native (0.85) do not** and therefore receive no quality or cost trophy, regardless of their raw values. The ceiling on this kata is 14/15 = 0.93, not 15/15, because `14-family-steinheim` fails deterministically for every model (RQ-1.19 F-1.19.4).

fable-5's `code_mass` of 659.0 is additionally **parenthesized** to mark why its leading number must not be read as parsimony: 3 of its 5 runs silently drop an entire class of scenarios (F-fable-vs-opus5.2), so the smaller Code Mass (APP) is missing coverage, not economy of expression.

sonnet-5-native's `cost_usd` (28.28) and `duration_seconds` (2277) are parenthesized for the opposite reason: both are the **best raw values in the field**, and the gate — not the numbers — is what withholds the trophy. Unlike fable-5's Code Mass (APP), they are not an artifact of unfinished work; both survive restricting the cell to its three perfect runs (F-fable-vs-opus5.9). Parentheses here mean "real, but not creditable while the cell misses the correctness gate", and that distinction is the whole point of reading the caveat rather than the table.

**Cost trophies are gated the same way.** `total_tokens` goes to fable-5-1 (66.9 M) ahead of opus-5 (84.5 M); `cost_usd` to fable-5-1 ($43.72) — but read F-fable-vs-opus5.7 before quoting the dollar figures, because on this workflow they are almost entirely a cache-read tariff, and sonnet-5-native is the proof: it consumes the **most** tokens of any cell (110.6 M, 1.3× opus-5) and still produces the lowest dollar figure. `duration_seconds` goes to opus-5 (2552 s), the fastest *eligible* cell — fable-5-1 needs 1.6× and fable-5 1.9× as long.

**Findings**:

- **F-fable-vs-opus5.1** — Only Opus 5 and Fable 5.1 Sit at the Kata Ceiling; Perfect-Run Share Ranks Cells Backwards
- **F-fable-vs-opus5.2** — Three Distinct Failure Modes, Each Confined to Its Own Model Line
- **F-fable-vs-opus5.3** — Decomposition Separates the Field Far More Sharply Than Correctness Does
- **F-fable-vs-opus5.4** — The CLI Bump Is Behaviourally Neutral, Except Possibly on Token Volume
- **F-fable-vs-opus5.5** — Fable 5.1 Is a Clear Improvement Over Fable 5 on Every Axis of This RQ
- **F-fable-vs-opus5.6** — Wallclock Splits by Model Family, Not by Capability
- **F-fable-vs-opus5.7** — On This Workflow Cost Is Almost Purely a Cache-Read Tariff, Not a Model Property
- **F-fable-vs-opus5.8** — Sonnet 5's Failures Are Invisible to Its Own Test Suite
- **F-fable-vs-opus5.9** — The Baseline Workflow Does Not Carry Sonnet 5 to the Frontier, But Its Speed and Cost Advantage Is Real

Opus 5 (0.95) and Fable 5.1 (0.93) are statistically indistinguishable at this kata's effective ceiling; Fable 5 (0.87) and Sonnet 5 (0.85) sit below it, and each model line fails in its own way rather than sharing a common mode. The consequential one: Sonnet 5's failures are invisible to its own suite, which stays green while external scenarios fail. Decomposition separates the field far more sharply than correctness does. Cost on this workflow is almost purely a cache-read tariff rather than a model property, and the CLI version bump is behaviourally neutral. Details: [findings.md](research/questions-claude/2.3-fable-vs-opus5-current-workflow/findings.md).

#### 2.4 RQ-opus55-current-workflow — Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Key result

**The workflow gap is larger on Opus 5.5 than on Opus 5.** Every quality axis that separates at all separates *more* between the minimal inline instruction and EXACT Coding on the newer model. Columns compare the inline arm against the better of the two Predictive-TDD arms on the same model.

| | Opus 5: Inline → EXACT | Opus 5.5: Inline → EXACT |
|---|---|---|
| `cognitive_max` ↓ | 6.20 → 3.60 (−42 %) | 7.60 → 2.00 (**−74 %**) |
| `mccabe_max` ↓ | 5.40 → 3.40 (−37 %) | 8.40 → 3.00 (**−64 %**) |
| `unit_size_avg` ↓ | 7.99 → 4.68 (−41 %) | 7.48 → 4.46 (−40 %) |
| `unit_count` ↑ | 16.6 → 38.8 (2.3×) | 12.4 → 34.4 (**2.8×**) |
| Mutation Score ↑ | 0.96 → 0.97 (+0.01) | 0.76 → 0.95 (**+0.19**) |

The scaffolding is worth **more** on the newer model, not less. Four consequences, each carried by its own finding:

- **Unscaffolded, Opus 5.5 is the weaker engineer of the two models** — more
  complex code, fewer and weaker tests — while being 2.6× faster and 2.7×
  cheaper (F-2.4.2).
- **The collapse is in the test suite, not only in the code.** The inline arm on
  Opus 5.5 lets 38.8 of 163 mutants survive, 20.0 of them never covered at all
  (F-2.4.3).
- **The mechanism is step size.** The minimal instruction writes 4–8 failing
  tests at once; every Predictive-TDD cell writes exactly one. The phase chain
  measures this on both models (F-2.4.6).
- **The model upgrade is cheaper in every arm** — 42 % to 64 % less list price
  for the same workflow — and it is what moves the isolated-subagent arm from
  the edge of the budget into its middle (F-2.4.4, F-2.4.7).

Scope: one kata (Claim Office), one prompt style (Example Mapping), one stack (TypeScript), CLI 2.1.280, n=5 `ok` runs per cell. Correctness (external) is 0.96–1.00 in every cell. The Opus 5 subagent arm needed seven attempts for its five `ok` runs: two hit the two-hour budget ceiling and are not replicates (F-2.4.7).

A reminder that outranks any single cell here: `exit_reason: ok` together with `completed_within_budget: True` does not establish that a run finished — only `experiment-done.txt` does. RQ-fable-vs-opus5 F-1.19.10 records the failure shape. In this run set the two incomplete attempts were honest timeouts and were classified as such.

## Overview

| Metric | Inline / O5 | PTDD-v1 / O5 | PTDD-v1.1 / O5 | Inline / O5.5 | PTDD-v1 / O5.5 | PTDD-v1.1 / O5.5 |
|---|---:|---:|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.99 ± 0.03 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 |
| Correctness (internal) | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 | 5/5 |
| `ok` runs / attempts — higher = better | **5/5** 🏆 | **5/5** 🏆 | 5/7 | **5/5** 🏆 | **5/5** 🏆 | **5/5** 🏆 |
| `cognitive_max` — lower = better | 6.20 ± 2.17 | 3.60 ± 1.34 | 3.60 ± 1.14 | 7.60 ± 2.07 | 2.40 ± 0.55 | **2.00 ± 0.00** 🏆 |
| `cognitive_avg` — lower = better | 2.39 ± 0.36 | 1.51 ± 0.24 | 1.44 ± 0.11 | 2.61 ± 0.34 | 1.43 ± 0.21 | **1.23 ± 0.12** 🏆 |
| `mccabe_max` — lower = better | 5.40 ± 1.52 | 3.40 ± 0.55 | 3.40 ± 0.55 | 8.40 ± 1.52 | 3.40 ± 0.55 | **3.00 ± 0.00** 🏆 |
| `mccabe_avg` — lower = better | 2.05 ± 0.22 | 1.54 ± 0.09 | **1.38 ± 0.09** 🏆 | 2.40 ± 0.13 | 1.44 ± 0.05 | **1.39 ± 0.08** 🏆 |
| `unit_count` — higher = better | 16.6 ± 0.9 | 27.0 ± 3.2 | **38.8 ± 6.8** 🏆 | 12.4 ± 1.5 | 22.8 ± 2.8 | 34.4 ± 9.9 |
| `unit_size_max` — lower = better | 24.8 ± 4.4 | 16.0 ± 4.0 | 14.0 ± 3.5 | 26.2 ± 2.0 | **13.0 ± 1.6** 🏆 | 14.2 ± 2.2 |
| `unit_size_avg` — lower = better | 7.99 ± 1.03 | 5.57 ± 0.15 | 4.68 ± 0.44 | 7.48 ± 0.45 | 4.81 ± 0.62 | **4.46 ± 0.40** 🏆 |
| `unit_size_median` — lower = better | 6.00 ± 1.00 | 4.50 ± 1.00 | **3.20 ± 0.45** 🏆 | 5.10 ± 0.82 | 3.80 ± 1.10 | 3.30 ± 0.67 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.40 ± 0.89 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 |
| **Production LoC** | 278 ± 28 | 316 ± 35 | 543 ± 60 | 224 ± 12 | 222 ± 24 | 310 ± 61 |
| **Code Mass (APP)** — lower = better | 720 ± 32 | 708 ± 80 | 920 ± 80 | 707 ± 37 | **632 ± 36** 🏆 | 655 ± 57 |
| **Test LoC** | 446 ± 77 | 694 ± 175 | 480 ± 68 | 254 ± 25 | 277 ± 38 | 259 ± 29 |
| `tests_total` | 50.6 ± 9.5 | 57.8 ± 7.5 | 53.4 ± 3.4 | 32.0 ± 2.3 | 47.8 ± 1.6 | 46.4 ± 2.3 |
| **Mutation Score** — higher = better | 0.96 ± 0.02 | **0.97 ± 0.01** 🏆 | 0.90 ± 0.06 | 0.76 ± 0.10 | 0.94 ± 0.05 | 0.95 ± 0.03 |
| `mutants_survived` — lower = better | 5.8 ± 3.4 | **4.4 ± 0.9** 🏆 | 17.2 ± 10.9 | 38.8 ± 15.0 | 7.8 ± 6.3 | 6.4 ± 3.9 |
| `mutants_no_coverage` — lower = better | 1.2 ± 1.6 | 1.2 ± 1.1 | 6.0 ± 7.1 | 20.0 ± 18.5 | 2.8 ± 3.8 | 2.0 ± 2.4 |
| `duration_seconds` — lower = better | 332 ± 63 | 1291 ± 128 | 4764 ± 1296 | **130 ± 14** 🏆 | 922 ± 80 | 2664 ± 433 |
| `total_tokens` — lower = better | 3.5 M ± 0.9 M | 22.6 M ± 3.3 M | 64.5 M ± 19.2 M | **1.4 M ± 0.3 M** 🏆 | 24.4 M ± 1.8 M | 55.3 M ± 7.6 M |
| `cost_usd` — lower = better | 3.60 ± 0.59 | 16.93 ± 2.24 | 63.24 ± 18.64 | **1.31 ± 0.17** 🏆 | 9.79 ± 0.49 | 28.34 ± 3.30 |

> **The Opus 5 subagent arm reached its five `ok` runs in seven attempts.** The
> other two hit the two-hour budget ceiling — one delivered nothing, one had
> solved the kata — and are not replicates. The five that count clear the
> correctness gate at 0.99, so the cell is trophy-eligible, but they average
> 4764 s, two-thirds of the budget. F-2.4.7.
>
> **Its `unit_count` and `unit_size_median` trophies come with the largest code
> base in the field** — 543 Production LoC, Code Mass (APP) 920, against 222–316
> in every other Predictive-TDD cell. More units partly means more code;
> `unit_size_avg` is the size-neutral column, and there Opus 5.5 with the
> subagent arm leads. The `mccabe_avg` co-trophy is a 0.01 difference, inside
> either cell's σ.
>
> **Correctness (internal) carries no trophy** — 5/5 in every cell, no contest.
>
> **The cost rows are won by the arm that does the least.** `Inline / O5.5` is
> the cheapest cell in the field and also the one with Mutation Score 0.76 and
> `cognitive_max` 7.60. It is above the correctness gate because the acceptance
> suite passes; the suite it writes for itself is what fails. Read the cost
> trophies against F-2.4.3 before quoting them.

### TDD discipline — within architecture group only

`tdd_discipline` is **not comparable between the inline arm and the Predictive-TDD arms** — the same test-list boundary documented in RQ-tdd-workflow-comparison-opus55 F-4.13.4. The PTDD workflows write a complete inactive test list up front, so a test that passes on activation is legitimate evidence under their contract and still counts as a `Skip`; the inline arm writes no list and has almost none. `skip_events` 38.0 against 1.4 is that difference, not a difference in rigour. The two groups are tabled apart.

**Group A — Predictive TDD** (test list up front)

| Metric | PTDD-v1 / O5 | PTDD-v1.1 / O5 | PTDD-v1 / O5.5 | PTDD-v1.1 / O5.5 |
|---|---:|---:|---:|---:|
| `tdd_discipline` — higher = better | 0.50 ± 0.04 | 0.59 ± 0.09 | **0.63 ± 0.01** 🏆 | 0.62 ± 0.03 |
| `tdd_discipline_test_first` | 0.37 ± 0.04 | 0.48 ± 0.12 | **0.51 ± 0.02** 🏆 | 0.50 ± 0.03 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `tdd_discipline_closure` | 0.35 ± 0.05 | 0.44 ± 0.10 | **0.49 ± 0.02** 🏆 | 0.48 ± 0.04 |
| `skip_events` — lower = better | 38.0 ± 7.1 | 26.2 ± 10.2 | **23.8 ± 1.3** 🏆 | 25.8 ± 2.9 |
| `red_batch_max` — lower = better | **1.00 ± 0.00** 🏆 | 1.80 ± 1.79 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `refactor_events` | 10.6 ± 1.9 | 60.6 ± 14.0 | 16.6 ± 2.4 | 30.6 ± 9.7 |
| `cycles_total` / `cycles_closed` | 58.8 / 20.2 | 47.2 / 20.0 | 49.6 / 24.2 | 52.0 / 25.0 |
| `chain_suite_runs` | 99.6 | 188.8 | 95.4 | 161.8 |

**Group B — minimal inline instruction** (no test list)

| Metric | Inline / O5 | Inline / O5.5 |
|---|---:|---:|
| `tdd_discipline` — higher = better | **0.55 ± 0.06** 🏆 | 0.42 ± 0.12 |
| `tdd_discipline_test_first` | 0.85 ± 0.07 | **0.92 ± 0.18** 🏆 |
| `tdd_discipline_step` — higher = better | **0.23 ± 0.04** 🏆 | 0.13 ± 0.01 |
| `tdd_discipline_closure` | 0.84 ± 0.07 | **0.90 ± 0.22** 🏆 |
| `red_batch_size` — lower = better | **4.40 ± 0.96** 🏆 | 7.75 ± 0.35 |
| `red_batch_max` — lower = better | **8.00 ± 2.45** 🏆 | 10.00 ± 2.83 |
| `skip_events` — lower = better | 1.40 ± 1.14 | **0.20 ± 0.45** 🏆 |
| `cycles_total` / `cycles_closed` | 11.4 / 9.6 | 3.4 / 3.0 |
| `chain_suite_runs` | 23.8 | 7.6 |

> The `PTDD-v1.1 / O5` `red_batch_max` of 1.80 comes from one run of five, which
> in four suite runs had three to five new tests failing at once. None of those
> tests had been green before, so it is a step-size lapse in that run, not a
> regression counted as a red batch. `red_batch_size` stays 1.00 in all four
> Predictive-TDD cells.
>
> The group B score is the clearest case in this RQ for why the consolidated
> number must never be read alone. The inline arm's `test_first` and `closure`
> components are the highest in the whole field (0.85–0.92 and 0.84–0.90) — and
> its step component is 0.13. It opens almost every cycle on a verified failure
> and closes almost all of them, because it only has 3.4 cycles and puts ~8 tests
> into each. F-2.4.6.

**Findings**:

- **F-2.4.1** — The workflow's quality advantage does not shrink on the newer model, it grows
- **F-2.4.2** — Unscaffolded, Opus 5.5 writes more complex code and a far weaker suite than Opus 5
- **F-2.4.3** — On Opus 5.5 the unscaffolded suite collapses; under the workflow it does not
- **F-2.4.4** — Opus 5.5 is cheaper in every arm, and the saving is tariff, not tokens
- **F-2.4.5** — The marker route does not survive Opus 5.5; the phase chain does
- **F-2.4.6** — The minimal instruction does not do TDD in step size, and that is what fails
- **F-2.4.7** — The isolated Refactor subagent runs at the edge of the budget on Opus 5 and well inside it on Opus 5.5

Holding the arm constant, the workflow's quality advantage grows on the newer model instead of shrinking: `cognitive_max` falls 7.60 → 2.00 on Opus 5.5 against 6.20 → 3.60 on Opus 5, and Mutation Score rises 0.76 → 0.95 against 0.96 → 0.97. The hypothesis that a newer model needs the scaffolding less is refuted on this kata. Unscaffolded, Opus 5.5 is the weaker engineer of the two — more complex code and a far weaker suite — while being 2.6× faster and 2.7× cheaper, and the mechanism is step size. One kata, one prompt style, one stack, n=5. Details: [findings.md](research/questions-claude/2.4-opus55-current-workflow/findings.md).

#### 3.1 RQ-workflow-model — Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model?

_Data basis: 49 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

All six cells at `min_replicates` (49 `ok` runs). Correctness (external) = `verification_pct`, higher = better; `tests_passing` = share of runs with a green internal suite, higher = better. 🏆 per model column, because the RQ asks whether the winner changes with the model.

| Workflow | Correctness (external), opus-4-7 | Correctness (external), opus-4-6 | `tests_passing`, opus-4-7 | `tests_passing`, opus-4-6 |
|---|---:|---:|---:|---:|
| exact-subagents-v1-cc | 0.67 ± 0.36 (n=10) | **0.93** ± 0.08 (n=5) 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| exact-single-context-v1-cc | 0.97 ± 0.09 (n=9) | 0.87 ± 0.30 (n=5) | **100 %** 🏆 | **100 %** 🏆 |
| exact-hybrid-v1-cc | **1.00** ± 0 (n=5) 🏆 | 0.68 ± 0.33 (n=15) | **100 %** 🏆 | 87 % |

Caveats:
- **Opus 4.6 cells mix two routes.** The column is `opus-4-6-portkey-no-thinking`; one replacement run (2026-10-20, cell exact-subagents-v1-cc) uses `opus-4-6-requesty-no-thinking` (Vertex via Requesty, see README "Routing caveat — Opus 4.6") and runs on Claude Code 2.1.280 instead of 2.1.107. Its Correctness (external) of 1.00 lies inside the cell's range, but its process does not: 379 s and 6.0 M tokens against 3385–4959 s and 26–38 M for the four Portkey runs, with 13 suite invocations and 3 closed cycles for 38 tests. With n=1, route and Claude Code version cannot be told apart. No statement here rests on duration, tokens or process metrics of that cell.
- **Cost is not compared.** The Portkey runs are priced at $15 / $75 per 1M input/output tokens, the Requesty run at $5.50 / $27.50; any cost figure for the Opus 4.6 subagents cell would mix two tariffs.

**Findings**:

- **F-workflow-model.1** — subagents-v1 and hybrid-v1 Swap Places Depending on the Model
- **F-workflow-model.2** — Mechanism: Orchestration Delegation vs. Explicit Subagent Prompt

The two architectures swap places depending on the model, which makes "best workflow" a model-relative claim rather than an absolute one. The mechanism is how the workflow hands work over: delegating orchestration against carrying an explicit subagent prompt. With two findings across six cells this question establishes the interaction rather than mapping it, and its practical consequence is procedural — re-measure a workflow on the model actually in use instead of inheriting a ranking from a different one. The stronger version of the same result appears on the Sol line comparison in §4. Details: [findings.md](research/questions-claude/3.1-workflow-model-interaction/findings.md).

#### 4.1 RQ-tdd-quality — How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference?

_Data basis: 103 runs · Coverage: 16/16 cells (100 %) at min_replicates=5._

## Overview — Code Quality per Workflow

All metrics in the tables: lower = better. 🏆 = best value per column (also multiple times in case of a tie). **Never averaged across katas** — game-of-life (~30–40 Production LoC) and claim-office (~150–320 Production LoC) are not comparable.

### Kata: game-of-life

| Workflow | n | `cognitive_max` | `mccabe_max` | `longest_function` | `smell_total` | `production_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-oneshot-v1-cc              | 10 | 18.8 | 12.8 | 31.7 | 4.8 | 33.6 | 155.0 |
| baseline-iterative-v1-cc            | 10 | 16.2 | 11.6 | 32.1 | 4.1 | 32.5 | 157.8 |
| baseline-inline-tdd-v1-cc            | 10 | 21.8 | 13.7 | 32.5 | 6.0 | 31.9 | 165.6 |
| exact-subagents-v2-testlist-fix-cc |  5 | **6.4** 🏆 | **5.0** 🏆 | 16.4 | **2.4** 🏆 | 32.0 | 156.6 |
| exact-single-context-v2-testlist-fix-cc |  5 | 17.6 | 10.2 | 20.8 | 4.8 | **26.6** 🏆 | 154.0 |
| v6.1-hybrid-…           | 10 | 6.5 | 5.2 | **14.2** 🏆 | **2.4** 🏆 | 29.2 | 153.7 |
| baseline-end-refactor-only-v1-agent-cc  |  5 | 10.6 | 7.4 | 17.6 | 3.0 | 31.2 | **142.0** 🏆 |
| baseline-end-refactor-only-v1-native-cc |  5 | 9.0 | 6.8 | 17.6 | **2.4** 🏆 | 31.0 | 145.8 |

### Kata: claim-office

| Workflow | n | `cognitive_max` | `mccabe_max` | `longest_function` | `smell_total` | `production_loc` | `code_mass` |
|---|---:|---:|---:|---:|---:|---:|---:|
| baseline-oneshot-v1-cc              |  5 | 12.2 | 8.4 | 40.4 | 11.6 | 269.4 | 835.4 |
| baseline-iterative-v1-cc            |  5 | 11.4 | 8.4 | 41.4 | 15.8 | 268.6 | 851.0 |
| baseline-inline-tdd-v1-cc            |  5 | 19.8 | 15.4 | 51.6 | 16.8 | 317.4 | 992.4 |
| exact-subagents-v2-testlist-fix-cc |  5 | 26.8 ⚠️ | 16.0 ⚠️ | 40.8 | 13.2 | **156.8** 🏆 | **621.6** 🏆 |
| exact-single-context-v2-testlist-fix-cc |  6 | 14.8 | 10.2 | 32.7 | 6.8 | 167.2 | 692.7 |
| v6.1-hybrid-…           |  7 | **5.7** 🏆 | **5.7** 🏆 | **18.1** 🏆 | **1.3** 🏆 | 191.1 | 861.3 |
| baseline-end-refactor-only-v1-agent-cc  |  5 | 7.4 | 6.6 | 28.4 | 4.0 | 245.6 | 813.8 |
| baseline-end-refactor-only-v1-native-cc |  5 | 11.0 | 8.0 | 35.8 | 6.2 | 238.8 | 780.2 |

⚠️ subagents-v2 claim-office is bimodal (`cognitive_max` σ=24, max=68) — occasional extreme misdirections. See F-tdd-quality.9.

Correctness **differs** between the two katas: on game-of-life all 8 workflows are at `verification_pct=1.00`. On claim-office it varies between 0.28 (oneshot-v1+iterative-v1, vibe coding on a prose spec) and 1.00 (inline-tdd-v1, single-context-v2, hybrid-v2, end-refactor-only-v1-agent) — see F-tdd-quality.4 and F-tdd-quality.8. `mutation_score` was collected only for oneshot-v1/iterative-v1/inline-tdd-v1 on game-of-life (0.95 ± 0.01 in all three).

**Findings**:

- **F-tdd-quality.1** — Strict Phase-Structured Workflows with a Refactor Phase Lower `cognitive_max` and `longest_function` Drastically
- **F-tdd-quality.2** — Naive "use TDD" (inline-tdd-v1) Brings No Complexity Advantage over Non-TDD (oneshot-v1/iterative-v1) on game-of-life
- **F-tdd-quality.3** — Single Context (single-context-v2) Loses the Complexity Advantage of the Phase-Isolated Subagents (subagents-v2) — But Only on game-of-life
- **F-tdd-quality.4** — Correctness Differs Only on the Novel Kata, and There It Tracks the Prompt Pairing, Not the Workflow
- **F-tdd-quality.5** — The Cost Range Between Workflows Spans an Order of Magnitude; Strict Workflows Are 5–50× More Expensive; Kata Complexity Scales Linearly
- **F-tdd-quality.6** — Vibe + End Refactoring Reaches the Volume Level of the Strict TDD Workflows at Non-TDD Cost; Branching Complexity Remains Weaker
- **F-tdd-quality.7** — The Subagent Mechanism for the End Refactor Beats the Slash Command on the Large Kata; Level on the Small Kata
- **F-tdd-quality.8** — Correctness on the Novel Kata Follows the Spec Style, Not the Presence or Timing of Tests
- **F-tdd-quality.9** — The hybrid-v2 Hybrid Is the Most Robust TDD Workflow Across Both Katas; subagents-v2 Is Kata-Unstable

The enforced refactor step, not the TDD label, carries code quality. Workflows with a dedicated cleanup phase reach `cognitive_max` ≈ 6–7 on the small kata against 16–22 for vibe coding and the naive instruction, and on the novel kata the hybrid reaches 5.7 with Smell Total 1.3 against 11.6–15.8. The naive "use TDD" instruction produces the heaviest code in the whole matrix — `cognitive_max` 19.8, `longest_function` 51.6 — worse than no TDD at all. Correctness differs only on the novel kata, and there it tracks the spec style rather than the workflow. Details: [findings.md](research/questions-claude/4.1-tdd-effect-code-quality/findings.md).

#### 4.2 RQ-tdd-correctness — Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata?

_Data basis: 36 runs · Coverage: 7/7 cells (100 %) at min_replicates=3._

## Overview — Correctness per Workflow

🏆 = best value per column (also multiple times in case of a tie). `verification_pct`/`tests_passing`: higher = better.

| Workflow | n | `verification_pct` (mean ± std) | `verification_passed` / 15 (min – max) | `tests_passing` |
|---|---:|---|---|---|
| baseline-inline-tdd-v1-cc                  | 5 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| exact-subagents-v2-testlist-fix-cc       | 5 | 0.96 ± 0.09        | 12 – 15 | **100 %** 🏆 |
| exact-single-context-v2-testlist-fix-cc       | 6 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v6.1-hybrid-…                 | 3 | **1.00 ± 0** 🏆    | 15 – 15 | **100 %** 🏆 |
| v7.1-hybrid-green-refactor-…  | 3 | 0.98 ± 0.04        | 14 – 15 | **100 %** 🏆 |

`completed_within_budget` is 100 % in all cells.

**Findings**:

- **F-tdd-correctness.1** — Three of Five TDD Workflows Solve claim-office Perfectly; subagents-v2 and green-refactor-v2 Lose Isolated Scenarios
- **F-tdd-correctness.2** — subagents-v2 Reaches Correctness Only via Drastically Higher Effort per Cycle
- **F-tdd-correctness.3** — The Predictions Rate Comparison Is Distorted by an Unequal Prediction Base
- **F-tdd-correctness.4** — The Wallclock Range Is 10×, the Token Range 12×; No Correlation with Correctness

Three of five TDD workflows reach the full fifteen-scenario acceptance suite in every run; the two with an isolated green phase lose isolated scenarios, one landing at 0.96 and one at 0.98. Reaching that correctness costs the isolated-subagent architecture drastically more effort per cycle. The wallclock range across the five workflows is tenfold and the token range twelvefold, with no correlation to correctness in either. The prediction-rate comparison is distorted by an unequal prediction base and must not be read as a discipline ranking. Details: [findings.md](research/questions-claude/4.2-tdd-effect-correctness/findings.md).

#### 4.3 RQ-context — Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality?

_Data basis: 21 runs · Coverage: 4/4 cells (100 %) at min_replicates=3._

## Overview — Code Quality, Correctness, Cost

🏆 = best value per column. Directions: `cognitive_max`/`mccabe_max`/`longest_function`/`smell_total`/`code_mass`/`production_loc`/`duration_seconds`/`total_tokens` lower = better; `verification_pct` higher = better. Where spreads are smaller than 1 σ, 🏆 is distributed across all nearby values.

| Workflow | n | `cognitive_max` | `mccabe_max` | `longest_function` | `smell_total` | `code_mass` | `production_loc` | `verification_pct` | `duration_seconds` | `total_tokens` |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| subagents-v2 (all isolated) | 5 | 26.8 ± 24.1 | 16.0 ± 9.0 | 40.8 ± 27.1 | 13.2 ± 7.5 | **621.6 ± 65.6** 🏆 | **156.8 ± 38.0** 🏆 | 0.96 ± 0.09 | 3 229 ± 920 | 34.87 M ± 6.07 |
| single-context-v2 (all shared) | 6 | 14.8 ± 4.2 | 10.2 ± 2.6 | 32.7 ± 10.2 | 6.8 ± 7.6 | 692.7 ± 78.8 | 167.2 ± 27.9 | **1.00 ± 0** 🏆 | **641 ± 122** 🏆 | **18.73 M ± 5.35** 🏆 |
| hybrid-v2 (refactor isolated) | 7 | **5.71 ± 2.87** 🏆 | **5.71 ± 2.36** 🏆 | **18.1 ± 5.1** 🏆 | **1.29 ± 1.50** 🏆 | 861.3 ± 74.5 | 191.1 ± 20.3 | **1.00 ± 0** 🏆 | 1 569 ± 519 | 37.88 M ± 13.45 |
| green-refactor-v2 (green + refactor isolated) | 3 | **5.00 ± 1.00** 🏆 | **4.67 ± 0.58** 🏆 | **19.3 ± 2.5** 🏆 | **2.33 ± 2.31** 🏆 | 801 ± 3.6 | 187.3 ± 29.2 | 0.98 ± 0.04 | 1 970 ± 715 | 35.74 M ± 10.51 |

`tests_passing` and `completed_within_budget` are 100 % in all four cells. `mutation_score` was not collected for this RQ.

Token figures count subagent consumption. Until 2026-09-30 they did not, and this RQ was the one most distorted by that: subagents-v2 isolates all four phases, so it was understated by 147 % and held the token trophy at 14.10 M while actually being the second most expensive arm. See [RQ-old-vs-new-exact-line-opus55 F-4.12.5](../4.12-old-vs-new-exact-line-opus55/findings.md).

On `longest_function` the subagents-v2 cell has a σ of 27.1, wide enough that its 40.8 would formally tie with hybrid-v2's 18.1 under the spread rule. It carries no trophy because that width is its own instability, not agreement with the hybrids — its five runs range from the field's best to far past its worst.

**Findings**:

- **F-context.1** — The Refactor Subagent Delivers the Complexity Advantage; Additional Green Isolation Does Not Change the Picture
- **F-context.2** — The Refactor Subagent Distributes Functionality Across More Building Blocks; Green Isolation Slows the More-Code Effect
- **F-context.3** — Correctness Does Not Distinguish the Architectures
- **F-context.4** — Four Very Different Cost Profiles
- **F-context.5** — Two Hybrid Positions with Similar Code Quality, Different Cost Profiles

The refactor subagent delivers the complexity advantage, and adding green isolation on top changes nothing measurable: the two hybrids reach `cognitive_max` 5.71 and 5.00 with `longest_function` 18.1 and 19.3, all pairwise differences inside their σ, while the fully shared context sits clearly above at 14.8. The refactor subagent distributes functionality across more building blocks; green isolation only slows the more-code effect. Correctness does not distinguish the four architectures at all, which turns the decision into a choice between four cost profiles. Details: [findings.md](research/questions-claude/4.3-tdd-context-engineering/findings.md).

#### 4.5 RQ-architecture-axis-opus5 — Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer?

_Data basis: 111 runs · Coverage: 16/16 cells (100 %) at min_replicates=5._

## Overview

**claim-office-example-mapping** (correctness kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | 0.79 | 0.96 | 0.94 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | higher = better |
| `avg_loc_per_function` | 8.90 | 5.89 | 3.81 | **3.19** 🏆 | 13.07 | 10.03 | 5.75 | 3.67 | lower = better |
| `cognitive_max` | 5.3 | 2.8 | 2.8 | **2.0** 🏆 | 19.8 | 14.83 | 5.71 | 3.2 | lower = better |
| `cognitive_avg` | 2.55 | 1.65 | 1.30 | **1.15** 🏆 | 5.77 | 4.62 | 2.32 | 1.35 | lower = better |
| `mccabe_max` | 5.3 | 3.4 | 3.4 | **2.8** 🏆 | 15.4 | 10.17 | 5.71 | 3.4 | lower = better |
| `longest_function` | 24.3 | 18.6 | 16.2 | 13.8 | 51.6 | 32.67 | 18.14 | **12.0** 🏆 | lower = better |
| Smell Total | **0.0** 🏆 | 0.2 | **0.0** 🏆 | **0.0** 🏆 | 16.8 | 6.83 | 1.29 | **0.0** 🏆 | lower = better |
| Code Mass (APP) | 758.2 | 569.0 | 859.5 | 997.0 | 992.4 | 692.7 | 861.3 | 796.0 | no 🏆 — see caveat |
| `cycle_count` † | 5.2 | 27.0 | 45.9 | 45.8 | 3.8 | 5.5 | 28.0 | 25.8 | — |
| `refactorings_applied` † | n/a | 12.2 | 21.3 | **44.5** 🏆 | n/a | 2.2 | 11.0 | 22.6 | higher = better |
| `predictions_correct_rate` | n/a | 99.6 % | 99.6 % | 98.9 % | n/a | **100 %** 🏆 | 96.4 % | 90.0 % | higher = better |
| `total_tokens` | 4.5 M | 82.6 M | 94.2 M | 161.6 M | **3.3 M** 🏆 | 18.7 M | 37.9 M | 75.6 M | lower = better |
| `duration_seconds` | 5.5 min | 23.1 min | 44.2 min | 91.9 min | **5.2 min** 🏆 | 10.7 min | 26.1 min | 75.9 min | lower = better |

**game-of-life-example-mapping** (code-quality kata)

| Metric | inline-tdd-v1/o5 | single-context-v2/o5 | hybrid-v2/o5 | hybrid-v6/o5 | inline-tdd-v1/o47 | single-context-v2/o47 | hybrid-v2/o47 | hybrid-v6/o47 | Direction |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | higher = better |
| `avg_loc_per_function` | 6.48 | 4.12 | 4.23 | **3.46** 🏆 | 16.52 | 9.58 | 6.56 | 3.62 | lower = better |
| `cognitive_max` | 7.2 | 1.8 | 1.8 | **1.2** 🏆 | 21.8 | 17.6 | 6.5 | 2.2 | lower = better |
| `cognitive_avg` | 5.33 | 1.60 | 1.58 | **1.17** 🏆 | 21.8 | 15.4 | 5.17 | 1.9 | lower = better |
| `mccabe_max` | 5.7 | 2.8 | 3.2 | **2.5** 🏆 | 13.7 | 10.2 | 5.2 | 3.2 | lower = better |
| `longest_function` | 14.5 | 8.0 | 10.2 | **7.5** 🏆 | 32.5 | 20.8 | 14.2 | 8.4 | lower = better |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | 1.0 | **0.0** 🏆 | 6.0 | 4.8 | 2.4 | **0.0** 🏆 | lower = better |
| Code Mass (APP) | 196.8 | 176.2 | 179.0 | 195.8 | 165.6 | 154.0 | 153.7 | 169.6 | no 🏆 — see caveat |
| `cycle_count` † | 3.7 | 7.2 | 10.3 | 10.3 | 1.5 | 7.6 | 8.7 | 9.2 | — |
| `refactorings_applied` † | n/a | 4.4 | 4.3 | 8.8 | n/a | 4.8 | 4.1 | **9.2** 🏆 | higher = better |
| `predictions_correct_rate` | n/a | **100 %** 🏆 | **100 %** 🏆 | 98.4 % | n/a | **100 %** 🏆 | 99.4 % | 98.9 % | higher = better |
| `total_tokens` | 2.1 M | 11.8 M | 9.2 M | 19.7 M | **0.8 M** 🏆 | 8.4 M | 8.1 M | 17.2 M | lower = better |
| `duration_seconds` | 2.8 min | 7.2 min | 9.7 min | 19.1 min | **1.3 min** 🏆 | 4.9 min | 8.5 min | 22.1 min | lower = better |

Caveats for reading the tables:

- **Correctness gating**: on claim-office, trophies for quality/efficiency metrics go only
  to cells at `verification_pct` 1.00. single-context-v2/o5 (0.79), hybrid-v6/o5 (0.95) and hybrid-v2/o5 (0.99)
  are exempt from the gate for the *quality* columns because their shortfall traces to a
  single acceptance scenario (F-1.4), not to stub implementations — but they carry no
  correctness trophy.
- **`cycle_count`, `refactorings_applied` and `predictions_correct_rate` are n/a for inline-tdd-v1**,
  not zero. inline-tdd-v1 prescribes no phase markers, so the parser has nothing to count. See
  MARKERS.md.
- **Code Mass (APP) carries no trophy.** It ranks the cells opposite to decomposition
  (F-1.6) and has no notion of nesting — established in RQ-architecture-axis-sol-pi F-1.9.
- `cycle_count` is ambivalent and carries no trophy.
- **† `cycle_count` and `refactorings_applied` are the retired spellings.** The marker
  parser that produced them is gone and the phase chain that replaced it wrote nothing
  for these runs, so neither metric appears in `runs.csv` or `summary.md`. The values
  themselves survive per run as `summary_metrics.legacy_cycle_count` and
  `summary_metrics.legacy_refactorings_applied` and are recomputed from there — they are
  current for this run set, not frozen. Their comparable successors on newer runs are
  `cycles_closed` and `refactor_events`. For inline-tdd-v1 both columns stay n/a rather
  than zero: without phase markers the parser falls back to a heuristic that over-counts,
  which RQ-v3-emergent-tdd quantified at 14 real refactorings out of 60 candidates.
- `cost_usd` is a list-price comparison, not an invoice: these runs went through the
  native Anthropic API on a subscription plan, where nothing is billed per token. On
  claim-office the four opus-5 cells read $3.89 / $47.56 / $61.94 / $109.59 along the
  axis, against $2.92 / $12.72 / $29.28 / $53.77 on opus-4-7.

**Findings**:

- **F-1.1** — H1 confirmed: the architecture ranking holds on opus-5, on both katas
- **F-1.2** — The model generation moves quality as much as the whole architecture does
- **F-1.3** — hybrid-v6 wins the quality axis on both katas and costs 6–36× the baseline
- **F-1.4** — One acceptance scenario fails across workflows and accounts for most of the correctness spread
- **F-1.5** — single-context-v2 is the least reliable architecture on opus-5, hybrid-v2 the most efficient compromise
- **F-1.6** — Code Mass (APP) ranks the cells opposite to decomposition, on this model too
- **F-1.7** — opus-5 writes more code than opus-4-7 under the same workflow

The architecture ranking holds on the newer model across both katas, monotone on `avg_loc_per_function` for the novel one. But the model generation moved the floor as much as the apparatus does: structureless TDD on Opus 5 reaches `cognitive_max` 5.3 where the previous generation needed the full hybrid architecture to reach 5.71, and Smell Total drops to 0.0 in all twelve runs against 16.8. The strongest configuration still wins every quality metric, at 36× the tokens and 17× the wallclock of the plain baseline. Read against the Opus 5.5 result, which reverses the trend. Details: [findings.md](research/questions-claude/4.5-architecture-axis-opus5/findings.md).

#### 4.6 RQ-sol-line-on-opus-cc — Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the opus line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there?

_Data basis: 31 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

Direction column applies to both model columns. Trophies compare **within a model**, i.e. per column pair, since the question is which workflow wins on a given model.

| Metric | inline-tdd-v1 · o4-8 | inline-tdd-v1 · o5 | sol-cc · o4-8 | sol-cc · o5 | hybrid-v4 · o4-8 | hybrid-v4 · o5 | Direction |
|---|---:|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | 80 % | 99 % | higher = better |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | higher = better |
| `avg_loc_per_function` | 8.81 ± 1.71 | 8.90 ± 1.65 | **6.65 ± 0.69** 🏆 | 7.86 ± 1.60 | 4.19 ± 0.73 | **4.40 ± 0.42** 🏆 | lower = better |
| `median_loc_per_function` | 7.70 | 7.17 | **6.00** 🏆 | 6.70 | 2.00 ± 0.00 | **2.00 ± 0.00** 🏆 | lower = better |
| `longest_function` | 23.4 | 24.3 | **19.4 ± 3.58** 🏆 | **22.4 ± 4.51** 🏆 | 21.2 | 23.4 | lower = better |
| `cognitive_max` | 7.0 ± 2.24 | 5.33 ± 1.86 | **4.6 ± 1.82** 🏆 | **3.4 ± 0.89** 🏆 | 3.4 ± 0.89 | 3.6 ± 1.14 | lower = better |
| `cognitive_avg` | 2.49 | 2.55 | **1.70 ± 0.38** 🏆 | 1.91 | 1.49 | **1.43 ± 0.24** 🏆 | lower = better |
| `mccabe_max` | 6.0 | 5.33 | **4.4** 🏆 | 4.0 ± 0.71 | 3.8 | **3.8 ± 0.84** 🏆 | lower = better |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | 1.0 | 0.2 | lower = better |
| Code Mass (APP) | 927.0 | 758.2 | 723.8 | 631.4 | 882.2 | 928.8 | no 🏆 — see caveat |
| `predictions_correct_rate` | n/a | n/a | 99.2 % | 98.3 % | 99.7 % | 99.5 % | no 🏆 — indistinguishable |
| `duration_seconds` | **365** 🏆 | **330** 🏆 | 958 | 1016 | 3196 | 3637 | lower = better |
| `cost_usd` | **$4.87** 🏆 | **$3.89** 🏆 | $17.80 | $17.37 | $71.05 | $76.31 | lower = better |

Caveats for reading the table:

- **Correctness gating at 90 %**: quality and efficiency trophies go only to cells at
  `verification_pct` ≥ 0.90. That admits `hybrid-v4 · o5` (99 %, one scenario short in one of
  five runs) and excludes `hybrid-v4 · o4-8` (80 %, one total failure in five) — its leading
  values on `avg_loc_per_function`, `median_loc_per_function`, `cognitive_max` and
  `mccabe_max` therefore carry no trophy. A single missed scenario is within this kata's
  normal variation, a zeroed run is not.
- **`predictions_correct_rate` is n/a for inline-tdd-v1**, not zero — inline-tdd-v1
  prescribes no predictions. Across the four predictive cells it spans 98.3–99.7 %, so it
  separates nothing.
- **Code Mass gets no trophy**: APP has no notion of nesting and rewards one long
  function (metric blind spot, RQ README). Here it is reported as the mechanism
  witness — see F-4.6.3.
- All cells are n=5, `inline-tdd-v1 · o5` n=6.

**Findings**:

- **F-4.6.1** — Workflow optimisation does not transfer across models
- **F-4.6.2** — On Opus the APP line decomposes best, reversing the Sol result
- **F-4.6.3** — Code Mass confirms the mechanism by failing to move
- **F-4.6.4** — The native line clears the inline-tdd-v1 floor on Opus, but not by the Sol margin
- **F-4.6.5** — hybrid-v4 is the only line with a correctness regression on Opus
- **F-4.6.6** — Cost separates the three lines by an order of magnitude
- **F-4.6.7** — The native line wins the duration/quality trade-off on both Opus generations

Workflow optimisation does not transfer across models, and this is the sharpest demonstration in the report: the ranking of three workflow lines inverts completely between two models at constant kata, prompt style and metric. The line built elsewhere decomposes best on Opus, reversing its own home result, and Code Mass (APP) confirms the mechanism by failing to move. The natively-built line clears the structureless floor on Opus but not by the margin it achieves on its home model, and one line shows an outright correctness regression. Details: [findings.md](research/questions-claude/4.6-sol-line-on-opus-cc/findings.md).

#### 4.7 RQ-external-tdd-workflows-opus5 — Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline exact-hybrid-v2.4-lab-split-cc — on correctness, code quality, TDD discipline and cost.

_Data basis: 15 runs · Coverage: 3/4 cells (75 %) at min_replicates=5._

## Overview

Primary outcome is Correctness (external); the decomposition metrics follow the binding quality metric from RQ-architecture-axis-opus5 F-1.6.

| Metric | `exact-hybrid-v2.4-lab-split-cc` (per-cycle, subagent) | `external-superpowers-2026-09-04-cc` (per-cycle, inline) | `external-pocock-2026-09-04-cc` (no refactor) |
|---|---:|---:|---:|
| **Correctness (external)** `verification_pct` — higher = better | 0.96 ± 0.04 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| perfect runs | 2/5 | **5/5** 🏆 | **5/5** 🏆 |
| Correctness (internal) `tests_passing` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `avg_loc_per_function` — lower = better | 4.49 ± 0.54 | 7.90 ± 1.15 | 10.41 ± 1.45 |
| `longest_function` — lower = better | 17.60 ± 4.39 | 23.40 ± 3.13 | 26.60 ± 4.22 |
| `cognitive_max` — lower = better | 2.80 ± 0.84 | 6.20 ± 2.17 | 6.60 ± 2.41 |
| `mccabe_max` — lower = better | 3.40 ± 0.55 | 5.20 ± 1.10 | 5.40 ± 1.14 |
| **Smell Total** — lower = better | 0.00 ± 0.00 | **0.00 ± 0.00** 🏆 | 0.20 ± 0.45 |
| **Code Mass (APP)** — lower = better | 821 ± 111 | 666 ± 26 | **600 ± 60** 🏆 |
| `duration_seconds` — lower = better | 3841 ± 1523 | **548 ± 57** 🏆 | **582 ± 66** 🏆 |
| `total_tokens` — lower = better | 140.9 M ± 46 M | **12.2 M ± 1.3 M** 🏆 | **12.6 M ± 1.4 M** 🏆 |
| `refactorings_applied` — design characteristic | 33.00 ± 14.27 | 4.20 ± 3.42 | 0.00 ± 0.00 |
| `test_blocks` | 48.40 ± 2.07 | 13.40 ± 2.51 | 19.00 ± 2.74 |
| `test_cases_total` | 49.00 ± 2.00 | 45.00 ± 11.51 | 36.80 ± 5.26 |
| `test_cases_first_block` | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `red_unverified` — lower = stricter | 0.00 ± 0.00 | 1.00 ± 1.73 | 0.20 ± 0.45 |

> **Why the quality rows carry no trophy.** The gating rule awards quality and
> cost trophies only to cells at `verification_pct = 1.0`. `hybrid-v2.4` sits at
> 0.96 with only 2/5 perfect runs — that is not a rounding remainder but a real
> correctness shortfall in 3 of 5 runs. `hybrid-v2.4` is therefore not
> trophy-eligible, yet it holds the best absolute values on all four
> decomposition metrics. Awarding a trophy to the best *eligible* cell would put
> it on the worse value of the row, which the convention excludes — so these rows
> stay trophy-free. For cost, `Code Mass (APP)` and `Smell Total` the conflict
> does not arise: there the best cell is eligible anyway.

> `refactorings_applied` carries no trophy: the three values are the cells'
> design characteristic, not a result. 33 / 4.2 / 0 is the axis itself.

**Findings**:

- **F-4.7.1** — The inner loop is substitutable without losing correctness
- **F-4.7.2** — Refactor position determines decomposition monotonically
- **F-4.7.3** — The isolated subagent architecture buys decomposition, and it is expensive
- **F-4.7.4** — The review stage costs more than the missing refactor saves
- **F-4.7.5** — Superpowers keeps cycle discipline but does not write tests in one block
- **F-4.7.6** — Little code is not a quality signal here

The inner red-green-refactor loop turns out to be substitutable without losing correctness: both externally authored workflows reach Correctness (external) 1.00 in 5/5 runs, above the internal baseline's 0.96. Refactor position then determines decomposition monotonically, and the isolated subagent architecture buys that decomposition expensively. A review stage costs more than the refactor it replaces saves. Little code is not a quality signal here. The question is closed at three of four cells, so one workflow is absent from the comparison and the ranking is three-way. Details: [findings.md](research/questions-claude/4.7-external-tdd-workflows-opus5/findings.md).

#### 4.8 RQ-tcr-variants-opus5 — How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement?

_Data basis: 18 runs · Coverage: 4/4 cells (100 %) at min_replicates=4._

## Overview

All cells are correctness-complete enough for quality and efficiency comparison (`verification_pct ≥ 0.90`). Direction: correctness **higher = better**; complexity, Code Mass (APP), duration, tokens, and cost **lower = better**. Ties within the observed spread share trophies. Process and Git-history metrics are descriptive rather than intrinsically directional, so they receive no trophies.

| Outcome | EXACT Coding | Classic TCR | Native-Git TCRDD | git-gamble TCRDD |
|---|---:|---:|---:|---:|
| Correctness (external) | 0.967 ± 0.039 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Test blocks | 50.0 ± 1.4 | 8.2 ± 3.7 | 28.0 ± 8.0 | 26.3 ± 1.7 |
| Test cases total | 50.5 ± 1.3 | 35.8 ± 16.7 | 44.2 ± 9.8 | 29.8 ± 5.7 |
| Test cases in first block | 1.0 ± 0.0 | 2.8 ± 0.4 | 1.0 ± 0.0 | 1.0 ± 0.0 |
| Verified RED | 50.0 ± 1.4 | 8.0 ± 3.4 | 28.0 ± 8.0 | 25.8 ± 1.7 |
| Unverified RED | 0.0 ± 0.0 | 0.2 ± 0.4 | 0.0 ± 0.0 | 0.5 ± 0.6 |
| Explicit TCRDD refactor steps | 0.0 ± 0.0 | 0.0 ± 0.0 | 4.2 ± 1.6 | 0.5 ± 1.0 |
| TCR method commits | 0.0 ± 0.0 | 11.0 ± 2.3 | 38.2 ± 34.1 | 35.0 ± 11.1 |
| Retained RED commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 15.6 ± 14.3 | 0.0 ± 0.0 |
| Retained GREEN commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 15.6 ± 14.3 | 0.0 ± 0.0 |
| Retained refactor commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 2.8 ± 2.8 | 0.0 ± 0.0 |
| `avg_loc_per_function` ↓ | **3.67 ± 0.30** 🏆 | 8.66 ± 2.33 | 8.60 ± 0.70 | 10.96 ± 2.46 |
| `longest_function` ↓ | **19.0 ± 3.7** 🏆 | **21.4 ± 3.0** 🏆 | **20.6 ± 3.0** 🏆 | 26.3 ± 2.1 |
| `cognitive_max` ↓ | **3.5 ± 1.9** 🏆 | 8.4 ± 0.9 | 6.0 ± 1.4 | 7.0 ± 1.4 |
| `mccabe_max` ↓ | **3.75 ± 0.96** 🏆 | 6.20 ± 0.45 | 5.60 ± 0.55 | 5.75 ± 0.50 |
| Smell Total ↓ | 0.50 ± 0.58 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.25 ± 0.50 |
| Code Mass (APP) ↓ | 881.5 ± 102.5 | 702.4 ± 53.6 | 643.0 ± 30.2 | **610.8 ± 54.0** 🏆 |
| Duration ↓ | 3653 ± 377 s | **280 ± 50 s** 🏆 | 834 ± 111 s | 685 ± 81 s |
| Total tokens ↓ | 63.2 M ± 2.7 M | **3.9 M ± 1.0 M** 🏆 | 19.8 M ± 3.3 M | 14.9 M ± 2.4 M |
| Cost per run ↓ | $58.07 ± $4.25 | **$3.38 ± $0.70** 🏆 | $13.68 ± $2.28 | $10.52 ± $1.52 |

Valid replicate counts are 4/5/5/4. One infrastructure-invalid EXACT Coding run and one method-invalid git-gamble run are excluded as documented in the RQ README.

**Findings**:

- **F-4.8.1** — All three TCR variants deliver perfect external correctness
- **F-4.8.2** — EXACT Coding buys decomposition and lower peak complexity
- **F-4.8.3** — Classic TCR is the efficiency winner
- **F-4.8.4** — Native-Git and git-gamble TCRDD differ more in audit representation than product outcome

All three TCR variants reach Correctness (external) 1.00 in every valid run, with the EXACT arm near-perfect at 0.967, so correctness does not separate them. EXACT Coding buys decomposition and a lower complexity peak; classic TCR is the efficiency winner. Tool-enforced execution and native-Git prompt enforcement differ more in the audit trail they leave than in the product they deliver — a reviewability difference rather than an artifact one. Four cells at n=4–5 on one kata, so read the orderings and not the margins. Details: [findings.md](research/questions-claude/4.8-tcr-variants-opus5/findings.md).

#### 4.9 RQ-current-ptdd-vs-exact-opus-native — On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency?

_Data basis: 28 runs · Coverage: 2/2 cells (100 %) at min_replicates=5._

## Overview

Both cells use `claim-office-example-mapping` with native `opus-5-no-thinking`. Lower is better for decomposition and efficiency metrics; higher is better for Correctness (external). Code Mass (APP) is shown as context without a trophy because lower mass can reflect either parsimony or omitted structure.

The PTDD cell pools ten runs from two batches on the same native route and Claude Code 2.1.267: five from this RQ's batch (2026-09-15) and five from the RQ-test-list-dimensions-opus-native batch (2026-09-16), which ran the identical workflow, model and kata. The default cell's 18 runs span 2026-08-10 to 2026-09-10.

| Outcome | `exact-sol-v1.5-tcr-parity-domain-trial-cc` (n=10) | `exact-hybrid-v2-testlist-fix-cc` (n=18) |
|---|---:|---:|
| Correctness (external) ↑ | **0.96 ± 0.08** 🏆 | **0.96 ± 0.03** 🏆 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Mean LoC/function ↓ | 5.53 ± 0.65 | **3.81 ± 0.64** 🏆 |
| Median LoC/function ↓ | 4.55 ± 1.12 | **2.00 ± 0.00** 🏆 |
| `longest_function` ↓ | 17.7 ± 6.25 | 16.22 ± 5.78 |
| `cognitive_max` ↓ | 2.80 ± 0.63 | 2.78 ± 1.35 |
| `cognitive_avg` ↓ | 1.52 ± 0.21 | 1.30 ± 0.29 |
| `mccabe_max` ↓ | 3.30 ± 0.95 | 3.39 ± 0.78 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 661.7 ± 26.47 | 859.5 ± 99.25 |
| Production LoC | 236.2 ± 22.5 | 264.5 ± 37.6 |
| Test LoC | 457.0 ± 131.8 | 765.4 ± 111.9 |
| TDD cycles | 54.3 ± 26.5 | 45.9 ± 4.9 |
| Refactor phases | 45.0 ± 11.2 | 21.3 ± 7.6 |
| Prediction accuracy ↑ | 97.1% | **99.6%** 🏆 |
| Duration ↓ | **23.9 ± 8.6 min** 🏆 | 44.2 ± 7.7 min |
| Tokens ↓ | **30.4 ± 26.0 M** 🏆 | 94.2 ± 17.6 M |
| List-price comparison ↓ | **$23.12 ± $17.33** 🏆 | $61.94 ± $10.74 |

Correctness is statistically indistinguishable at the cell-mean level, so both cells receive the trophy. The PTDD cell remains eligible for quality and efficiency comparison because its mean Correctness (external) is above the 0.90 gate, but its single 0.733 run is treated explicitly in the findings below. No trophy is awarded where the difference is within the observed spread, every cell ties, the metric is ambivalent, or the workflows measure process activity through different execution mechanisms. Production LoC, Test LoC, Code Mass (APP), cycle count, and refactor-phase count are therefore contextual rather than winner metrics. The PTDD cycle count is additionally noisy: one run records a single cycle alongside 132 predictions, a marker-count artefact rather than a one-cycle run.

**Findings**:

- **F-4.9.1** — The Opus default decomposes more strongly than the transferred PTDD workflow
- **F-4.9.2** — PTDD trades decomposition for lower runtime and token use
- **F-4.9.3** — Equal mean correctness hides a PTDD completeness failure
- **F-4.9.4** — Complexity peaks tie despite different code mass and test volume

On native Opus 5 the default workflow decomposes more strongly than the transferred one, clearly in both mean and median function size, while `longest_function` stays inside the broad run-level spread. The transferred workflow trades that decomposition for lower runtime and token use. The reading that matters is in the third finding: equal mean correctness hides a completeness failure on one side, so the two means are not evidence of equivalence. Complexity peaks tie despite different Code Mass (APP) and test volume. Two cells, 28 runs. Details: [findings.md](research/questions-claude/4.9-current-ptdd-vs-exact-opus-native/findings.md).

#### 4.10 RQ-test-list-dimensions-opus-native — On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality?

_Data basis: 20 runs · Coverage: 2/2 cells (100 %) at min_replicates=5._

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. The only treatment is the v1.6 independent-dimensions cross-check before the test list is declared complete. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

Each cell pools two batches of five runs on Claude Code 2.1.267: this RQ's own batch (v1.5 on 2026-09-15, v1.6 on the morning of 2026-09-16) and the replication batch of RQ-test-list-dimensions-replication, which runs the same workflow × model × kata cells (both arms on the afternoon of 2026-09-16).

| Outcome | v1.5 test list (n=10) | v1.6 dimensions cross-check (n=10) |
|---|---:|---:|
| Correctness (external) ↑ | 0.96 ± 0.08 | **0.99 ± 0.02** 🏆 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 52.0 ± 3.2 | 61.2 ± 6.7 |
| Test LoC | 457.0 ± 131.8 | 599.1 ± 258.6 |
| Mean LoC/function ↓ | 5.53 ± 0.65 | 5.95 ± 0.93 |
| Median LoC/function ↓ | 4.55 ± 1.12 | 4.70 ± 1.27 |
| `longest_function` ↓ | 17.7 ± 6.25 | 18.9 ± 5.26 |
| `cognitive_max` ↓ | 2.80 ± 0.63 | 2.80 ± 0.63 |
| `cognitive_avg` ↓ | 1.52 ± 0.21 | 1.47 ± 0.26 |
| `mccabe_max` ↓ | 3.30 ± 0.95 | 3.30 ± 0.48 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 661.7 ± 26.5 | 714.8 ± 70.1 |
| Production LoC | 236.2 ± 22.5 | 245.7 ± 32.9 |
| Refactor phases | 45.0 ± 11.2 | 51.5 ± 13.8 |
| Prediction accuracy ↑ | 97.1% (777/800) | **98.9%** (1033/1044) 🏆 |
| Duration ↓ | 23.9 ± 8.6 min | 20.1 ± 5.3 min |
| Tokens ↓ | 30.4 ± 26.0 M | 21.4 ± 7.1 M |
| List-price comparison ↓ | $23.12 ± $17.33 | $16.10 ± $4.28 |

The correctness trophy reflects the shallower lower tail: v1.6 has one run at 0.933 and nine perfect runs, whereas v1.5 has three imperfect runs down to 0.733. The efficiency means favour v1.6, but every difference lies within the v1.5 standard deviation and is carried by the first v1.5 batch's outliers, so no efficiency trophy is awarded. No trophy is awarded for test volume, process counts, Code Mass (APP), or code size because their direction is ambiguous. Static-quality differences remain within the observed spread and therefore receive no trophy. The reported `cycle_count` is omitted because the single-command parser path produced values incompatible with the refactor markers in several runs; it is not a valid treatment measure here.

**Findings**:

- **F-4.10.1** — The dimensions cross-check removes the catalogue-omission failure but not every completeness miss
- **F-4.10.2** — Completeness hardening costs no efficiency and narrows the run-to-run spread
- **F-4.10.3** — Product shape remains within the prior workflow's spread
- **F-4.10.4** — The cross-check expands test expression without creating a mechanical cross product

The independent-dimensions cross-check removes the catalogue-omission failure without removing every completeness miss: the refined workflow reaches full Correctness (external) in nine of ten runs against seven of ten, with all internal suites green and every run inside budget. The hardening costs no measurable efficiency and narrows the run-to-run spread. Product shape stays within the prior workflow's spread, and the cross-check widens test expression without producing a mechanical cross product. Two cells only — the platform-dependence of this result is settled by the replication question in §4. Details: [findings.md](research/questions-claude/4.10-test-list-dimensions-opus-native/findings.md).

#### 4.11 RQ-inline-refactor-operationalization-opus-native — On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default?

_Data basis: 15 runs · Coverage: 2/2 cells (100 %) at min_replicates=5._

## Overview

Both cells use `claim-office-example-mapping`, native `opus-5-no-thinking`, and the same single-context PTDD workflow. v1.6.1 adds naming-first review, a mandatory concrete inline refactoring trial, and helper extraction as an explicit option. The v1.6 cell pools two batches from 2026-09-16 (07:18–08:30 and 16:42–16:48, both Claude Code 2.1.267) that it shares with sister RQs on the same workflow × model × kata; the v1.6.1 cell is this RQ's own batch. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

| Outcome | v1.6 (n=10) | v1.6.1 operational trial (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 0.99 ± 0.02 | 0.99 ± 0.03 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Mean LoC/function ↓ | 5.95 ± 0.93 | 6.76 ± 0.59 |
| Median LoC/function ↓ | 4.70 ± 1.27 | 6.20 ± 0.84 |
| Longest function ↓ | 18.9 ± 5.26 | 22.2 ± 3.83 |
| Functions | 25.3 ± 4.42 | 21.8 ± 3.63 |
| `longest_function` ↓ | 18.9 ± 5.26 | 22.2 ± 3.83 |
| `cognitive_max` ↓ | 2.80 ± 0.63 | 3.00 ± 0.00 |
| `mccabe_max` ↓ | 3.30 ± 0.48 | 3.60 ± 0.55 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 714.8 ± 70.1 | 686.0 ± 27.0 |
| Production LoC | 245.7 ± 32.9 | 242.2 ± 14.2 |
| Duration ↓ | 20.1 ± 5.3 min | 18.8 ± 4.5 min |
| Tokens ↓ | 21.4 ± 7.1 M | 21.4 ± 10.8 M |
| List-price comparison ↓ | $16.10 ± $4.28 | $15.84 ± $6.40 |

No trophy is awarded: the treatment does not produce a resolved improvement beyond run-level spread. Test volume, function count, Code Mass (APP), Production LoC, and process counts have ambiguous direction. Correctness is tied (one external miss per cell), so the lower Code Mass (APP) of v1.6.1 comes with longer functions and cannot be read as a quality win.

**Findings**:

- **F-4.11.1** — Inline operationalization does not reproduce the Opus default's decomposition
- **F-4.11.2** — Mandatory inline trials are cost-neutral but not quality-improving
- **F-4.11.3** — Correctness is tied; the promotion fails on decomposition alone

Operationalizing refactoring inline — naming-first plus a mandatory trial — does not reproduce the isolated subagent's decomposition. Every typical-size indicator moves away from the intended direction, though the differences overlap the small-sample spread, so the honest reading is an absence of signal rather than a reversal. The mandatory trials are cost-neutral but not quality-improving, and correctness is tied. The promotion therefore fails on decomposition alone, on 15 runs across two cells — a negative result that keeps the cheaper inline option from replacing the expensive isolated one. Details: [findings.md](research/questions-claude/4.11-inline-refactor-operationalization-opus-native/findings.md).

#### 4.12 RQ-old-vs-new-exact-line-opus55 — On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

Decomposition is the axis on which the two lines separated on Opus 5 (RQ-current-ptdd-vs-exact-opus-native F-4.9.1). On TypeScript `longest_function` and `unit_size_max` are the same measure, as are `avg_loc_per_function` and `unit_size_avg`; only one of each pair is tabled.

| Metric | `ptdd-v1` | `ptdd-v1.1` +Sub | `hybrid-v2` +Sub | `single-context-v3` |
|---|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 | 0.96 ± 0.09 | **1.00 ± 0.00** 🏆 |
| perfect runs | **5/5** 🏆 | 4/5 | 4/5 | **5/5** 🏆 |
| Correctness (internal) | 5/5 | 5/5 | 5/5 | 5/5 |
| `completed_within_budget` | 5/5 | 5/5 | 5/5 | 5/5 |
| `avg_loc_per_function` — lower = better | 4.81 ± 0.62 | 4.46 ± 0.40 | **2.92 ± 0.46** 🏆 | 3.74 ± 0.68 |
| `median_loc_per_function` — lower = better | 3.80 ± 1.10 | 3.30 ± 0.67 | **2.00 ± 0.00** 🏆 | 2.40 ± 0.89 |
| `longest_function` — lower = better | **13.00 ± 1.58** 🏆 | 14.20 ± 2.17 | **11.00 ± 4.36** 🏆 | **13.00 ± 2.45** 🏆 |
| `unit_count` — higher = better | 22.80 ± 2.77 | **34.40 ± 9.86** 🏆 | **26.80 ± 3.19** 🏆 | 24.60 ± 6.19 |
| `cognitive_max` — lower = better | **2.40 ± 0.55** 🏆 | **2.00 ± 0.00** 🏆 | **2.40 ± 0.89** 🏆 | 4.00 ± 2.83 |
| `cognitive_avg` — lower = better | 1.43 ± 0.21 | **1.23 ± 0.12** 🏆 | **1.25 ± 0.17** 🏆 | 1.62 ± 0.42 |
| `mccabe_max` — lower = better | **3.40 ± 0.55** 🏆 | **3.00 ± 0.00** 🏆 | **3.20 ± 0.45** 🏆 | 4.20 ± 1.79 |
| `mccabe_avg` — lower = better | 1.44 ± 0.05 | **1.39 ± 0.08** 🏆 | **1.37 ± 0.07** 🏆 | 1.46 ± 0.14 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.80 ± 0.45 | 0.40 ± 0.55 |
| **Production LoC** | 222 ± 24 | 310 ± 61 | 223 ± 44 | 182 ± 25 |
| **Test LoC** | 277 ± 38 | 259 ± 29 | 313 ± 27 | 226 ± 19 |
| **Code Mass (APP)** — lower = better | **632 ± 36** 🏆 | **655 ± 57** 🏆 | 742 ± 62 | 714 ± 47 |
| **Mutation Score** — higher = better | 0.94 ± 0.05 | 0.95 ± 0.03 | **0.98 ± 0.02** 🏆 | **0.96 ± 0.02** 🏆 |
| `mutants_total` | 124.0 ± 4.9 | 135.2 ± 10.9 | 121.0 ± 3.7 | 121.4 ± 3.9 |
| `mutants_survived` — lower = better | 7.8 ± 6.3 | 6.4 ± 3.9 | **2.2 ± 2.2** 🏆 | **4.4 ± 2.9** 🏆 |
| `duration_seconds` — lower = better | **922 ± 80** 🏆 | 2664 ± 433 | 1117 ± 138 | **954 ± 173** 🏆 |
| `total_tokens` — lower = better | **24.4 M ± 1.8 M** 🏆 | 55.3 M ± 7.6 M | 51.0 M ± 5.2 M | 102.6 M ± 23.5 M |
| `cost_usd` — lower = better | **9.79 ± 0.49** 🏆 | 28.34 ± 3.30 | 18.35 ± 2.18 | 27.86 ± 5.94 |

> Every cell is at `verification_pct` ≥ 0.96 and within budget in 5/5 runs, so
> correctness-gating excludes nobody. Multiple trophies in a row mark values whose
> σ bands overlap, not a fabricated tie.
>
> **`Production LoC` and `Test LoC` carry no trophy** — less code is not better
> per se, and the row that matters for parsimony is Code Mass (APP).
>
> `cost_usd` is a list-price comparison value, not an invoice: these runs went
> over the native subscription route. Tariffs in `research/model-pricing.md`.

**Findings**:

- **F-4.12.1** — Finer decomposition is a property of the retired line, and it does not come from its subagent
- **F-4.12.2** — Isolating the Refactor step has opposite signs on cost and the same sign on quality
- **F-4.12.3** — The retired line costs 1.9× the maintained line
- **F-4.12.4** — The retired line without its subagent burns the most tokens and is the least stable cell measured

Finer decomposition is a property of the retired line rather than of its refactor architecture: both retired cells sit below both maintained cells on both size measures, isolated and shared alike, so the property belongs to the line. Isolating the refactor step has opposite signs on cost and the same sign on quality within each line. The retired line costs 1.9× the maintained one, and its shared-context variant burns the most tokens of any cell measured here while being the least stable. The Opus 5 answer carries over to Opus 5.5. Details: [findings.md](research/questions-claude/4.12-old-vs-new-exact-line-opus55/findings.md).

#### 4.13 RQ-tdd-workflow-comparison-opus55 — How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code.

_Data basis: 35 runs · Coverage: 7/7 cells (100 %) at min_replicates=5._

## Overview

Primary outcome is Correctness (external). The decomposition metrics follow the binding quality metric from RQ-architecture-axis-opus5 F-1.6. Cells are grouped by line: maintained lab, retired lab, vendor.

| Metric | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-subagent` | `exact-hybrid-v2-testlist-fix` | `exact-hybrid-v2.4-lab-split` | `external-kesseler` | `external-superpowers` | `external-pocock` |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Correctness (external)** — higher = better | **1.00 ± 0.00** 🏆 | 0.96 ± 0.09 | 0.96 ± 0.09 | 0.96 ± 0.09 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| perfect runs | **5/5** 🏆 | 4/5 | 4/5 | 4/5 | **5/5** 🏆 | **5/5** 🏆 | **5/5** 🏆 |
| Correctness (internal) | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % | 100 % |
| `avg_loc_per_function` — lower = better | 4.81 ± 0.62 | 4.46 ± 0.40 | **2.92 ± 0.46** 🏆 | **3.32 ± 0.27** 🏆 | 6.23 ± 1.51 | 6.48 ± 0.82 | 9.46 ± 1.11 |
| `longest_function` — lower = better, no winner | 13.00 ± 1.58 | 14.20 ± 2.17 | 11.00 ± 4.36 | 14.20 ± 6.38 | 14.80 ± 1.64 | 15.80 ± 1.30 | 19.20 ± 1.92 |
| `cognitive_max` — lower = better | **2.40 ± 0.55** 🏆 | **2.00 ± 0.00** 🏆 | **2.40 ± 0.89** 🏆 | **2.40 ± 1.14** 🏆 | 3.60 ± 1.34 | 4.00 ± 1.41 | 7.20 ± 3.42 |
| `mccabe_max` — lower = better | **3.40 ± 0.55** 🏆 | **3.00 ± 0.00** 🏆 | **3.20 ± 0.45** 🏆 | **3.20 ± 0.45** 🏆 | 4.40 ± 0.89 | 4.40 ± 0.55 | 6.40 ± 2.30 |
| **Smell Total** — lower = better | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 0.80 ± 0.45 | 0.80 ± 0.45 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 | 2.20 ± 3.35 |
| **Code Mass (APP)** — lower = better | 632 ± 36 | 655 ± 57 | 742 ± 62 | 733 ± 105 | **560 ± 13** 🏆 | 634 ± 30 | **585 ± 15** 🏆 |
| `duration_seconds` — lower = better | 922 ± 80 | 2664 ± 433 | 1117 ± 138 | 1217 ± 165 | 605 ± 59 | **372 ± 45** 🏆 | **310 ± 44** 🏆 |
| `total_tokens` — lower = better | 24.4 M ± 1.8 M | 55.3 M ± 7.6 M | 51.0 M ± 5.2 M | 54.0 M ± 12.5 M | 15.5 M ± 2.0 M | 7.3 M ± 0.8 M | **5.3 M ± 0.7 M** 🏆 |
| `cost_usd` — lower = better | 9.79 ± 0.49 | 28.34 ± 3.30 | 18.35 ± 2.18 | 20.16 ± 4.20 | 6.85 ± 0.84 | **3.45 ± 0.25** 🏆 | **2.97 ± 0.33** 🏆 |
| `refactor_events` — design characteristic | 16.6 ± 2.4 | 30.6 ± 9.7 | 24.8 ± 5.2 | 29.6 ± 6.5 | 7.2 ± 2.4 | 5.0 ± 2.6 | 0.6 ± 0.9 |

> **Correctness (internal) carries no trophy** — all seven cells are at 100 %, so
> the row has no contest.
>
> **Correctness-gating does not bind here.** Every cell is at
> `verification_pct` ≥ 0.96, so all seven are eligible for the quality and cost
> trophies. Multiple trophies in a row mark values that are indistinguishable at
> 1 σ, not a fabricated tie.
>
> **`longest_function` carries no trophy at all.** Six of the seven cells lie
> between 11.00 and 15.80 with overlapping σ bands — `hybrid-v2`'s band alone
> spans 6.64 to 15.36 and covers both `kesseler` and `superpowers`. The only
> separation in that row is `pocock` at the top end. Awarding a winner inside
> that band would be rounding noise.
>
> **Read Code Mass (APP) with the decomposition rows, never alone.** The two
> trophy cells sit at opposite ends of `avg_loc_per_function`: `kesseler` at
> 6.23 and `pocock` at 9.46, the worst in the field. Both solved the full
> specification (5/5 perfect), so neither is disqualified — but the low value
> means compacted, not parsimonious. F-4.13.6.
>
> `refactor_events` carries no trophy: 0.6 against 30.6 is the field's design
> axis, not a result.

### TDD discipline — within architecture group only

`tdd_discipline` is **not comparable across the test-list boundary** (F-4.13.4). Four workflows derive the next test from a test list written up front, three derive it ad hoc, and `skip_events` counts a test that passes on activation as a deviation — which the test-list contract explicitly permits. The two groups are therefore tabled apart and no trophy crosses between them.

**Group A — test-list workflows** (`test-list.md` command, inactive tests)

| Metric | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-subagent` | `exact-hybrid-v2-testlist-fix` | `exact-hybrid-v2.4-lab-split` |
|---|---:|---:|---:|---:|
| `tdd_discipline` — higher = better | 0.63 ± 0.01 | 0.62 ± 0.03 | **0.71 ± 0.02** 🏆 | 0.70 ± 0.01 |
| `tdd_discipline_test_first` | 0.51 ± 0.02 | 0.50 ± 0.03 | **0.61 ± 0.02** 🏆 | 0.59 ± 0.02 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `tdd_discipline_closure` | 0.49 ± 0.02 | 0.48 ± 0.04 | **0.59 ± 0.02** 🏆 | 0.58 ± 0.01 |
| `skip_events` — lower = better | 23.8 ± 1.3 | 25.8 ± 2.9 | **16.6 ± 1.1** 🏆 | **16.6 ± 1.3** 🏆 |
| `red_batch_max` — lower = better | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| `cycles_total` / `cycles_closed` | 49.6 / 24.2 | 52.0 / 25.0 | 42.4 / 25.2 | 41.8 / 24.2 |
| `chain_suite_runs` | 95.4 | 161.8 | 103.6 | 106.2 |

**Group B — ad-hoc workflows** (next test derived per cycle, no test list)

| Metric | `external-kesseler` | `external-superpowers` | `external-pocock` |
|---|---:|---:|---:|
| `tdd_discipline` — higher = better | **0.85 ± 0.06** 🏆 | **0.84 ± 0.04** 🏆 | **0.82 ± 0.07** 🏆 |
| `tdd_discipline_test_first` | **0.79 ± 0.09** 🏆 | 0.75 ± 0.04 | **0.80 ± 0.05** 🏆 |
| `tdd_discipline_step` | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | 0.90 ± 0.22 |
| `tdd_discipline_closure` | **0.78 ± 0.09** 🏆 | **0.80 ± 0.09** 🏆 | **0.80 ± 0.07** 🏆 |
| `skip_events` — lower = better | 8.2 ± 3.1 | **2.4 ± 1.3** 🏆 | **3.8 ± 1.6** 🏆 |
| `red_batch_max` — lower = better | **2.60 ± 0.89** 🏆 | 4.80 ± 0.84 | 4.40 ± 1.67 |
| `cycles_total` / `cycles_closed` | 39.4 / 30.4 | 23.2 / 18.6 | 18.8 / 15.0 |
| `chain_suite_runs` | 83.4 | 52.6 | 36.6 |

> The three `tdd_discipline` values in group B lie within 1 σ of each other — the
> reading is "indistinguishable", hence three trophies.

**Findings**:

- **F-4.13.1** — Every workflow solves the kata; the perfect-run split is 4/3
- **F-4.13.2** — Decomposition follows refactor frequency, and the lab contract leads
- **F-4.13.3** — The isolated refactor subagent buys a deterministic complexity floor at 2.9× the price
- **F-4.13.4** — `tdd_discipline` is not comparable across the test-list boundary
- **F-4.13.5** — One failing test at a time is universal; only the vendor skills ever batch
- **F-4.13.6** — Cost spans a factor of ten, and Code Mass (APP) runs opposite to decomposition
- **F-4.13.7** — The maintained line trades decomposition for correctness, smells and half the cost

All seven workflows solve the kata — every cell passes its own suite in 5/5 runs at Correctness (external) ≥ 0.96 — so the comparison lives entirely in shape, discipline and price. Decomposition follows refactor frequency, with the lab contract leading, and the isolated refactor subagent buys a deterministic complexity floor at 2.9× the price. Cost spans a factor of ten, and Code Mass (APP) runs opposite to decomposition throughout. One failing test at a time is universal; only the vendored skills ever batch. `tdd_discipline` is not comparable across the test-list boundary and is reported within groups. Details: [findings.md](research/questions-claude/4.13-tdd-workflow-comparison-opus55/findings.md).

#### 5.1 RQ-stability — How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count?

_Data basis: 59 runs · Coverage: 5/6 cells (83 %) at min_replicates=10._

## Overview: Code Quality by Workflow

| Workflow | `code_mass` | `smell_total` | `mccabe_max` | `cognitive_max` | `longest_function` | n |
|---|---:|---:|---:|---:|---:|---:|
| baseline-oneshot-v1-cc (prose) | 155.00 | 4.80 | 12.80 | 18.80 | 31.70 | 10 |
| baseline-iterative-v1-cc (prose) | 157.80 | 4.10 | 11.60 | 16.20 | 32.10 | 10 |
| baseline-inline-tdd-v1-cc (EM) | 165.60 | 6.00 | 13.70 | 21.80 | 32.50 | 10 |
| exact-subagents-v1-cc (EM) | 166.60 | 2.60 | **4.50** | **4.40** | **8.10** | 10 |
| exact-single-context-v1-cc (EM) | **154.44** | 4.33 | 9.00 | 15.11 | 17.11 | 9 |
| exact-hybrid-v1-cc (EM) | 158.60 | **2.20** | **4.50** | 5.20 | 13.10 | 10 |

Best value per column in bold. Lower = better.

**Findings**:

- **F-stability.1** — The Main RQ-tdd-quality Finding (subagents-v1 Dominates Code Complexity, inline-tdd-v1 Is Last) Replicates at n=10 with the Same Sign
- **F-stability.2** — Workflow Stability Is Not Uniform; subagents-v1 Has a 10 % Outlier Rate Despite a Low Typical Value; single-context-v1 Is the Broadest Workflow
- **F-stability.3** — At n=3 the Full Workflow Ranking Is Correct in Only ~25–60 % of Cases; subagents-v1 as the "Best" Is More Robust
- **F-stability.4** — Correctness Stays at 100 % Independently of Model/Workflow at n=10
- **F-stability.5** — Token Consumption Shows an Extremely High Spread for subagents-v1 and single-context-v1
- **F-stability.6** — TDD Discipline Forms Workflow-Characteristic Bands
- **F-stability.7** — Test Strength (`mutation_score`) Has Its Own Stability Profile; exact-hybrid-v1-cc Is the Most Stable Workflow, subagents-v1 the Least Stable

At n=10 the central code-quality result replicates with the same sign: the phase-isolated workflow stays clearly first on all four complexity outcomes and the naive instruction stays last, so that finding is not an n=3 artifact. Stability is not uniform, though — the leading workflow carries a 10 % outlier rate despite a low typical value. At n=3 the full six-workflow ranking is correct in only about 3–37 % of draws, while the weaker claim that one workflow leads is far more robust. Closed with one cell at 9 of 10 runs. Details: [findings.md](research/questions-claude/5.1-workflow-stability/findings.md).

### Research Questions (OpenCode)

#### 1.1 RQ-model-quality-oc — How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

Code quality as primary outcome (lower = better except where noted); correctness (`verification_pct`, higher = better) as gating precondition.

| Metric | Direction | opus-4-7-portkey | glm-5-1 | gemini-3-5-flash | kimi-k2-6 | deepseek-v4-flash-requesty | deepseek-v4-pro-requesty |
|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.57 | **1.00** 🏆 | **1.00** 🏆 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.40 | **0.00** 🏆 | **0.00** 🏆 |
| `tests_passing` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `completed_within_budget` (rate) | higher | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| `smell_total` (mean) | lower | 3.6 | 2.8 | 4.0 | 4.4 | **0.4** 🏆 | **0.8** 🏆 |
| `cognitive_max` (mean) | lower | 11.4 | 11.6 | 16.0 | 9.4 | **8.2** 🏆 | **9.6** 🏆 |
| `cognitive_avg` (mean) | lower | 8.03 | 7.8 | 14.07 | 8.4 | **5.23** 🏆 | **6.17** 🏆 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | **7.0** 🏆 | 10.4 | 7.6 | **7.6** 🏆 | **8.2** 🏆 |
| `mccabe_avg` (mean) | lower | **2.91** 🏆 | **3.39** 🏆 | 6.0 | 4.85 | **3.2** 🏆 | **3.35** 🏆 |
| `longest_function` (mean) | lower | **18.6** 🏆 | **19.8** 🏆 | **18.6** 🏆 | 15.2 | **15.2** 🏆 | 20.8 |
| `avg_loc_per_function` (mean) | lower | **7.59** 🏆 | 10.05 | 15.63 | 9.9 | 12.52 | 12.0 |
| `median_loc_per_function` (mean) | lower | **3.3** 🏆 | 8.5 | 14.9 | 8.3 | 11.8 | 11.6 |
| `code_mass` (mean) | lower (at equal correctness) | **160.4** 🏆 | 193.4 | 200.0 | 111.0 | 177.6 | **171.6** 🏆 |
| `lines_of_code` (mean) | lower (at equal correctness) | **38.2** 🏆 | 46.4 | 52.2 | 22.4 | **39.0** 🏆 | **40.0** 🏆 |
| `tests_total` (mean) | higher | **9.4** 🏆 | **9.8** 🏆 | 8.4 | 7.0 | **9.0** 🏆 | **9.8** 🏆 |
| `cycle_count` (legacy, mean) | — | 3.0 | 2.2 | 7.0 | 5.0 | —¹ | —¹ |
| `refactorings_applied` (legacy, mean) | — | 1.6 | 2.4 | 3.6 | 3.4 | —¹ | —¹ |
| `predictions_total` (mean) | higher (skill compliance) | **4.8** 🏆 | **4.4** 🏆 | 0.4 | 2.0 | **5.8** 🏆 | 1.8 |
| `duration_seconds` (mean) | lower | 231 | 835 | 153 | 1083 | 407 | **126** 🏆 |
| `total_tokens` (mean) | lower | **1.82 M** 🏆 | 2.96 M | 2.80 M | 2.28 M | 2.45 M | **1.62 M** 🏆 |
| `cost_usd` (mean, $/run) | lower (at equal correctness) | $1.84 | $0.74 | $1.06 | $1.06 | **$0.24** 🏆 | $0.81 |
| `cost_usd` (mean, $/perfect-run) | lower | $1.84 | $0.74 | $1.06 | $2.65 | **$0.24** 🏆 | $0.81 |

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics go only to models with mean `verification_pct ≥ 0.90`. Kimi-K2 drops out of the pool at 0.57 mean (3 of 5 runs below 0.5) — its low `cognitive_max` (9.4), low `lines_of_code` (22.4), low `code_mass` (111.0) and short functions are partly stub artifacts (too few tests).

**Tie rule**: a cell shares the trophy when its gap to the row's best value is smaller than the smaller of the two cells' σ. That is why several rows carry three or four 🏆 — on `mccabe_max`, `mccabe_avg` and `longest_function` the eligible field is not separable.

¹ The DeepSeek runs carry only the phase-chain metrics; the legacy counters `cycle_count` and `refactorings_applied` are not written for them. Both are ambivalent anyway (more cycles ≠ better, depending on skill compliance) — no trophy. `predictions_total` is exceptionally noted with a direction here: it measures compliance with the single-context-v2 skill format.

**DeepSeek route**: both DeepSeek cells run through Requesty with backprovider `tensorx`. On that route `deepseek-v4-pro` emits no reasoning tokens in any of its five runs, while `deepseek-v4-flash` reasons (17.0 k reasoning tokens per run on average). The pro cell is therefore a non-reasoning configuration — see F-1.8.

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens; `reasoning` tokens are billed at the output rate. `cost_usd` is not a declared outcome of this RQ, so these values are computed here, not taken from `runs.csv`. The price sources differ by model and date: Anthropic pricing page (Opus), OpenRouter API (GLM/Kimi) and Vertex Standard (Gemini Flash) as of 2026-05-28; the Requesty model list (tensorx) as of 2026-10-19 for both DeepSeek cells (`research/model-pricing.md`).

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| deepseek-v4-flash (Requesty tensorx) | $0.25 | $0.30 | $0.06 |
| deepseek-v4-pro (Requesty tensorx) | $1.75 | $3.50 | $0.44 |

No gateway markup included.

**Cost breakdown per mean run** (tokens as mean over n=5):

| Model | input → cost | output (+reasoning) → cost | cache_read → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 116 k × $5.00 = $0.58 | 16.9 k × $25.00 = $0.42 | 1.68 M × $0.50 = $0.84 | **$1.84** |
| glm-5-1 | 144 k × $0.98 = $0.14 | 30.9 k × $3.08 = $0.10 | 2.79 M × $0.18 = $0.50 | **$0.74** |
| kimi-k2-6 | 371 k × $0.73 = $0.27 | 27.7 k × $3.49 = $0.10 | 1.88 M × $0.37 = $0.70 | **$1.06** |
| gemini-3-5-flash | 400 k × $1.50 = $0.60 | 11.2 k × $9.00 = $0.10 | 2.39 M × $0.15 = $0.36 | **$1.06** |
| deepseek-v4-flash-requesty | 430 k × $0.25 = $0.11 | 33.9 k × $0.30 = $0.01 | 1.99 M × $0.06 = $0.12 | **$0.24** |
| deepseek-v4-pro-requesty | 39.4 k × $1.75 = $0.07 | 12.9 k × $3.50 = $0.05 | 1.57 M × $0.44 = $0.69 | **$0.81** |

`$/perfect-run` scales with the share of runs with `verification_pct = 1.0`: Kimi $1.06/run × (5/2 verified) = **$2.65** per correct solution. Other models 5/5 verified → unchanged.

The pro cell's cost is dominated by cache reads (1.57 M tokens at $0.44): it sends little fresh input (39.4 k against 430 k for flash) but pays 7× flash's cache-read rate.

**Findings**:

- **F-1.1** — Opus 4.7 writes the smallest functions
- **F-1.2** — GLM 5.1 holds the Opus level in complexity
- **F-1.3** — Kimi-K2 writes too few tests, fails external verification
- **F-1.4** — Gemini 3.5 Flash: fast, but the most complex code
- **F-1.5** — Skill-tool compliance is model-dependent
- **F-1.6** — DeepSeek-V4-Flash: cheapest path to the correct solution
- **F-1.8** — DeepSeek-V4-Pro on tensorx runs without reasoning: fastest cell, weakest skill compliance among the DeepSeek cells
- **F-1.9** — The DeepSeek cells write the least smelly and least complex code

Opus 4.7 writes the smallest functions at full Correctness (external), but it is not separable from the DeepSeek cells on overall size — Production LoC level with both (38.2 against 39.0 and 40.0) and Code Mass (APP) within one σ. One open-weight model holds the Opus complexity level outright. The cheapest path to a correct solution is a DeepSeek cell, and the DeepSeek cells also write the least smelly and least complex code. One model writes too few tests and fails external verification, and skill-tool compliance proves model-dependent rather than uniform. Details: [findings.md](research/questions-opencode/1.1-model-quality-oc/findings.md).

#### 1.2 RQ-model-novel-oc — How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow?

_Data basis: 40 runs · Coverage: 8/8 cells (100 %) at min_replicates=5._

## Overview

Correctness (external) (`verification_pct`, higher = better) as primary outcome; code-quality metrics secondary (lower = better except where noted).

| Metric | Direction | opus-4-7-portkey | glm-5-1 | deepseek-v4-pro-requesty | mistral-medium-3-5 | kimi-k2-6 | gemini-3-5-flash | deepseek-v4-flash-requesty | minimax-m2-7 |
|---|---|---|---|---|---|---|---|---|---|
| `verification_pct` (mean) | higher | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | 0.95 | 0.84 | 0.80 | 0.55 | 0.04 |
| `verification_pct` (std) | lower | **0.00** 🏆 | **0.00** 🏆 | **0.00** 🏆 | 0.09 | 0.26 | 0.45 | 0.51 | 0.09 |
| `smell_total` (mean) | lower | **0.8** 🏆 | 4.0 | 8.2 | 23.8 | 20 | 18 | 0 | 10.2 |
| `cognitive_max` (mean) | lower | **9.8** 🏆 | 12.2 | 18.0 | 77.6 | 21.8 | 40.2 | 5.2 | 11.4 |
| `mccabe_max` (mean) | lower | **7.6** 🏆 | 9.2 | 9.4 | 34.6 | 17.6 | 23.4 | 4.4 | 7.6 |
| `longest_function` (mean) | lower | **25.4** 🏆 | 28.8 | 34.6 | 122.8 | 54.4 | 98.4 | 15.6 | 30.0 |
| `code_mass` (mean) | lower (at comparable correctness) | 759.6 | 816 | **695.4** 🏆 | **721.8** 🏆 | 741 | 526 | 407.2 | 364.4 |
| `total_tokens` (mean) | lower (at comparable correctness) | 8.06 M | 10.97 M | **3.59 M** 🏆 | 15.84 M | 6.67 M | 7.05 M | 6.10 M | 8.52 M |
| `cost_usd` (mean, $/run) | lower (at comparable correctness) | $5.90 | **$2.10** 🏆 | **$1.75** 🏆 ‡ | $23.03 † | $2.78 | $2.23 | $0.49 ‡ | $2.40 |
| `predictions_total` (mean) | — | 2.4 | 4.0 | 1.6 | 1.6 | 0.4 | 0.4 | 16.0 | 2.6 |
| `duration_seconds` (mean) | lower | 664 | 1726 | **242** 🏆 | 5747 | 1811 | 395 | 767 | 1428 |

`predictions_total` is ambivalent without a clear direction — no trophy. For `code_mass`, `total_tokens` and `cost_usd` less is better, but only meaningful at comparable correctness: MiniMax's low values are a stub artifact (verification 0.04), Gemini Flash's values are pulled by the 3-LoC abort run (see F-1.2), DeepSeek V4 Flash's low complexity and Code Mass (APP) are pulled by two runs that stopped after 14 s and 242 s with nearly nothing written (F-1.8), and Kimi (0.84), Gemini Flash (0.80) and DeepSeek V4 Flash (0.55) lie below the gating threshold — hence no trophy in each of those cases. Cost efficiency at actually usable correctness: see F-1.6.

‡ DeepSeek costs are priced at the Requesty/tensorx list rates, the other models at the rates in the table below. For DeepSeek V4 Pro 88 % of the cost is cache reads (3.51 M × $0.44 = $1.54 of $1.75).

† Mistral cost is dominated by missing OpenCode prompt caching (no `prompt_cache_key`); with caching active the value would be ~$3.00/run instead of $23.03. Details in the cost section and F-1.7.

**Trophy rule on correctness gating**: Trophies for quality/efficiency metrics (`smell_*`, `cognitive_*`, `mccabe_*`, clean-code metrics (`production_loc`, `functions`, `longest_function`, `avg_loc_per_function`, `median_loc_per_function`), `duration_seconds`, `total_tokens`, `cost_usd`, `code_mass`) are awarded only to cells with mean `verification_pct ≥ 0.90`. Rationale: low complexity / short duration / low cost with a non-correct implementation does not measure what the metric claims to measure, but stub or abort artifacts. The threshold admits Opus 4.7 (1.00), GLM 5.1 (1.00), DeepSeek V4 Pro (1.00) and Mistral Medium 3.5 (0.95). Trophy allocation within this pool: Opus wins smells and complexity; DeepSeek V4 Pro wins `total_tokens` and wallclock outright. Two rows carry shared trophies because the gap lies inside the spread: Code Mass (APP) (DeepSeek V4 Pro 695.4 ± 101.5, Mistral 721.8 ± 133.3) and cost (DeepSeek V4 Pro $1.75 ± $0.66 per run, GLM 5.1 $2.10). The Mistral Code Mass (APP) value is not a coverage artifact: its 12/15 run carries the cell's largest Code Mass (APP) (923), so the low mean does not come from dropped scenarios. Mistral's complexity values remain the worst of the whole field — see F-1.7.

**Cost calculation**: per run from `transcript-metrics.json.total_tokens` × pricing per 1M tokens. Sources 2026-05-26: Anthropic pricing page (Opus), OpenRouter API `/api/oneshot-v1/models` (GLM/Kimi/MiniMax), Vertex Standard (Gemini Flash), Mistral Docs model card (Mistral Medium 3.5); 2026-10-19: Requesty model list (DeepSeek on tensorx).

| Model | input | output | cache_read |
|---|---|---|---|
| opus-4-7 (via Vertex EU) | $5.00 | $25.00 | $0.50 (10%) |
| glm-5-1 (OpenRouter) | $0.98 | $3.08 | $0.18 |
| kimi-k2-6 (OpenRouter) | $0.73 | $3.49 | $0.37 |
| gemini-3-5-flash (Vertex Standard) | $1.50 | $9.00 | $0.15 |
| minimax-m2-7 (OpenRouter) | $0.279 | $1.20 | $0.279 (no cache rate listed by OpenRouter → input rate as a conservative upper bound) |
| mistral-medium-3-5 (Mistral Direct) | $1.50 | $7.50 | $0.15 (10% of the input rate, per the Mistral docs [Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)) |
| deepseek-v4-flash-requesty (Requesty tensorx) | $0.25 | $0.30 | $0.06 |
| deepseek-v4-pro-requesty (Requesty tensorx) | $1.75 | $3.50 | $0.44 |

Requesty rates also in `research/model-pricing.md`. Portkey markup not included (Portkey lists no model-specific surcharge, gateway plan costs are separate tier flat rates).

**Cost breakdown per mean run** (tokens as mean over n=5, cost columns = tokens × rate):

| Model | input (mean) → cost | output (mean) → cost | cache_read (mean) → cost | total |
|---|---|---|---|---|
| opus-4-7-portkey | 143 k × $5.00 = $0.71 | 50.2 k × $25.00 = $1.25 | 7.86 M × $0.50 = $3.93 | **$5.90** |
| glm-5-1 | 143 k × $0.98 = $0.14 | 7.7 k × $3.08 = $0.02 | 10.77 M × $0.18 = $1.94 | **$2.10** |
| kimi-k2-6 | 649 k × $0.73 = $0.47 | 26.8 k × $3.49 = $0.09 | 5.97 M × $0.37 = $2.21 | **$2.78** |
| gemini-3-5-flash | 635 k × $1.50 = $0.95 | 35.7 k × $9.00 = $0.32 | 6.35 M × $0.15 = $0.95 | **$2.23** |
| minimax-m2-7 | 234 k × $0.279 = $0.07 | 38.4 k × $1.20 = $0.05 | 8.21 M × $0.279 = $2.29 | **$2.40** |
| mistral-medium-3-5 | 15.00 M × $1.50 = $22.49 | 56.2 k × $7.50 = $0.42 | 0.79 M × $0.15 = $0.12 | **$23.03** |
| deepseek-v4-flash-requesty | 633 k × $0.25 = $0.16 | 34.9 k × $0.30 = $0.01 | 5.42 M × $0.06 = $0.33 | **$0.49** |
| deepseek-v4-pro-requesty | 51.9 k × $1.75 = $0.09 | 32.0 k × $3.50 = $0.11 | 3.51 M × $0.44 = $1.54 | **$1.75** |

Note: the `total_tokens` field in the overview table is misleading about cost — e.g. Opus' "8 M tokens" are ~97 % `cache_read`, which under Anthropic pricing costs only 10 % of the input price (cache hit ↔ 0.1×). Real input per Opus run is ~140 k tokens; the cache tokens come from repeatedly loaded system prompts/tool definitions, which in the skill workflow are traversed multiple times over several skill calls per run. For the OpenRouter models the cache ratio is similar, but the cache rate varies per provider (GLM $0.18, Kimi $0.37, MiniMax no cache rate listed → input rate as a conservative upper bound). The same holds for DeepSeek V4 Pro on tensorx: the fewest tokens in the field (3.59 M), but a cache rate of $0.44 per 1M, so cache reads make up 88 % of its cost.

**The Mistral cost outlier is an OpenCode integration artifact, not Mistral pricing**: Mistral Medium 3.5 falls massively out of the range at $23.03/run (3.9× Opus, 11× GLM). The cause is not the model pricing rate ($1.50/$7.50 is comparable to Gemini Flash), but the **caching behavior of the OpenCode-Mistral integration**. Token distribution for Mistral: 95 % `input`, 5 % `cache_read`. For Opus: 1.4 % `input`, 98 % `cache_read`. Mistral does indeed have a prompt cache rate of 10 % of the input rate ($0.15/M), but caching is explicitly **opt-in via `prompt_cache_key`** in the Mistral API ([Mistral Docs / Prompt caching](https://docs.mistral.ai/studio-api/conversations/advanced/prompt-caching)). OpenCode, or rather the `@ai-sdk/openai-compatible` provider NPM it uses, does not set this key — hence only the ~5 % of tokens that Mistral recognizes automatically via KV-cache prefix match end up in the cache.

Hypothetical scenarios with `prompt_cache_key` active (same token volume, but 99 % cache hit as with Opus on Anthropic):

| Scenario | Cache hit rate | Mistral cost/run | Comparison |
|---|---|---|---|
| As-measured (OpenCode status quo) | ~5 % | $23.03 | 3.9× Opus |
| With moderate caching | ~70 % | $9.18 | 1.6× Opus, 4.4× GLM |
| With aggressive caching (Anthropic level) | ~99 % | $3.00 | ~half of Opus, ~40 % above GLM |

In a model comparison that holds the OpenCode harness constant, the status-quo value ($23.03) is the relevant figure — because that is what a production OpenCode pipeline actually costs today. But: **the cost result is therefore not a robust model finding about Mistral**, it hangs on the integration detail. With the Mistral direct API plus a `prompt_cache_key` patch, or with another harness with native caching support, Mistral would land in the GLM/Sonnet cost range.

For non-cacheable workloads (CI/CD pipelines that reset containers without a cache, multi-tenant without a shared cache) the status-quo value would by contrast be the realistic one — there Opus' 12× cost advantage from the cache_read trick also disappears.

n_cost basis: all cost values are computed on n=5 per cell from `transcript-metrics.json` token buckets × the rates above.

**Findings**:

- **F-1.1** — Opus 4.7, GLM 5.1 and DeepSeek V4 Pro reach full correctness; trade-off code quality ↔ cost and speed
- **F-1.2** — Kimi K2.6 and Gemini 3.5 Flash: top correctness with a variance tail
- **F-1.3** — MiniMax M2.7: stable spec misunderstanding, not an isolated case
- **F-1.4** — Prediction-format compliance is NOT predictive of correctness
- **F-1.5** — Code Mass spread within a model: Flash and MiniMax bimodal/wide
- **F-1.6** — Cost efficiency per perfect run: DeepSeek V4 Pro and GLM 5.1 deterministic AND cheap
- **F-1.7** — Mistral Medium 3.5: high correctness against high complexity and highest cost
- **F-1.8** — DeepSeek V4 Flash: early stops dominate over spec comprehension; Pro is deterministic

Three models reach perfect Correctness (external) across all five replicates, and choosing among them is a clean trade-off between code quality on one side and cost and speed on the other. Two more reach top correctness with a variance tail, and one carries a stable spec misunderstanding rather than an isolated slip — a reproducible misreading, not noise. Prediction-format compliance is not predictive of correctness, which rules out the cheap proxy. Two cells are bimodal or wide on Code Mass (APP), and the most accurate expensive model pays in complexity. Details: [findings.md](research/questions-opencode/1.2-model-novel-kata-oc/findings.md).

### Research Questions (pi)

#### 1.1 RQ-model-quality-pi — How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-hybrid-v4.2-phase-continuation-pi workflow?

_Data basis: 60 runs · Coverage: 12/12 cells (100 %) at min_replicates=5._

## Overview — code quality, lower = better (only cells with `tests_passing` = 100 %)

| Model | `smell_total` | `cognitive_max` | `mccabe_max` | `code_mass` | `longest_function` | `tests_passing` |
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

Direction: all five quality metrics **lower = better** (`smell_total` = **Smell Total**, `code_mass` = **Code Mass (APP)**, `longest_function`). Trophies only among the correctness-complete cells (`tests_passing` = 100 %). `opus-5-requesty` takes three of the five axes outright. **Smell Total** stays with glm-5-2 (1.0 against 2.0), though the margin is soft: glm-5-2's runs range 0–3 at σ = 1.41 while every Opus 5 run landed on exactly 2 (σ = 0). At `code_mass` gpt-5-6-sol leads (134.8); opus-5-requesty is mid-field there (151.8) — it writes an ordinary amount of code, but structures it far more simply.

**Findings**:

- **F-1.1** — opus-5 breaks the complexity field, glm-5-2 holds the smell crown
- **F-1.2** — deepseek and gpt-5-6-sol solve the kata correctly, but with high complexity
- **F-1.3** — Correctness clusters at the top, with qwen as total fail
- **F-1.4** — TDD discipline varies strongly without correlating with correctness
- **F-1.5** — Cost spreads by a factor of 5.2 at comparable quality
- **F-1.6** — The kimi version jump improves every quality axis, at 65 % higher cost
- **F-1.7** — The Anthropic version jump is the cleanest intra-family comparison and the largest
- **F-1.8** — qwen3-235b rewrote the refactor agent instead of refactoring, and the edit escaped the run

Opus 5 breaks the complexity field, taking all three axes by a wide margin — `cognitive_max` 2.4 against 6.6 for the next-best correctness-complete cell, `longest_function` 5.8 against 15.0 — undercutting a band of 6.6–14.0 by nearly a factor of three, while an open-weight model holds the Smell Total crown. Correctness clusters at the top with one total failure. TDD discipline varies strongly without tracking correctness, and cost spreads by a factor of 5.2 at comparable quality. One run rewrote the refactor agent instead of refactoring, and the edit escaped the run. Details: [findings.md](research/questions-pi/1.1-model-quality-pi/findings.md).

#### 1.2 RQ-model-novel-pi — How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the exact-hybrid-v4-cleaned-pi workflow?

_Data basis: 90 runs · Coverage: 18/18 cells (100 %) at min_replicates=5._

## Overview — Correctness (external), higher = better

| Model | `verification_pct` mean | σ | `tests_passing` rate | n |
|---|---|---|---|---:|
| opus-4-8-no-thinking | **1.00** 🏆 | 0.00 | 100 % | 5 |
| glm-5-2 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| gpt-5-6-sol | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k2-7 | **1.00** 🏆 | 0.00 | 100 % | 5 |
| kimi-k3-sference | **0.99** 🏆 | 0.03 | 100 % | 5 |
| opus-4-8 | **0.99** 🏆 | 0.03 | 100 % | 5 |
| minimax-m3-no-thinking | 0.97 | 0.06 | 80 % | 5 |
| opus-5-requesty | 0.96 | 0.09 | 100 % | 5 |
| opus-5-requesty-no-thinking | 0.96 | 0.09 | 100 % | 5 |
| sonnet-5-no-thinking | 0.84 | 0.15 | 100 % | 5 |
| deepseek-v4-pro-no-thinking | 0.80 | 0.45 | 80 % | 5 |
| minimax-m3 | 0.76 | 0.43 | 100 % | 5 |
| kimi-k2-7-no-thinking | 0.73 | 0.42 | 80 % | 5 |
| sonnet-5 | 0.72 | 0.19 | 100 % | 5 |
| gpt-5-6-terra | 0.69 | 0.42 | 80 % | 5 |
| deepseek-v4-pro | 0.60 | 0.55 | 100 % | 5 |
| qwen3-235b | 0.00 | 0.00 | 0 % | 5 |
| qwen3-235b-no-thinking | 0.00 | 0.00 | 0 % | 5 |

🏆 for the six models with `verification_pct ≥ 0.99` at σ ≤ 0.03 (reproducibly perfect). The near-perfect cells (0.96–0.97) and the graded middle (0.60–0.84) carry no trophy — there the spread within σ is not separable from neighbors.

**Findings**:

- **F-1.1** — Correctness clusters dichotomously, with a graded middle zone
- **F-1.2** — qwen3-235b drops out at the phase transition; `verification_pct = 0` is not a model statement
- **F-1.3** — TDD discipline and correctness do not correlate
- **F-1.4** — The reasoning switch does not shift correctness
- **F-1.5** — High correctness at widely differing cost

Correctness clusters dichotomously with a graded middle: a tight, reproducible perfect cluster at mean ≈ 1.00 and σ ≤ 0.03, and an unstable middle band between 0.60 and 0.84 with high spread. One cell never reached the measurement at all, and its 0.00 is a phase-transition dropout rather than a model statement — precisely the reading a cell mean conceals. TDD discipline and correctness do not correlate, the reasoning switch does not shift correctness, and high correctness is reached at widely differing cost across eighteen cells. Details: [findings.md](research/questions-pi/1.2-model-novel-kata-pi/findings.md).

#### 1.3 RQ-route-effect-pi — How do transport route and reasoning channel each affect code quality, TDD discipline, throughput and correctness for one and the same model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt style?

_Data basis: 15 runs · Coverage: 3/3 cells (100 %) at min_replicates=5._

## Overview

Median per cell. Direction per column; ties get a trophy on every winning cell.

| Cell | Route | Reasoning | Throughput (tok/s) higher = better | Duration (s) lower = better | `cognitive_max` lower = better | Smell Total lower = better | Production LoC lower = better | Correctness (external) higher = better |
|---|---|---|---:|---:|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | Requesty | off | **3379** 🏆 | **251** 🏆 | 8.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-reasoning` | Requesty | ON | 2899 | 304 | 9.0 | 2.0 | **28** 🏆 | **100 %** 🏆 |
| `gpt-5-6-sol-codex-no-thinking` | OpenAI subscription | ON | 2074 | 614 | **4.0** 🏆 | **0.0** 🏆 | 41 | **100 %** 🏆 |
| _subscription route without reasoning_ | OpenAI subscription | — | _not constructible — see F-1.3.5_ | | | | | |

**Findings**:

- **F-1.3.1** — Requesty delivers 1.63× the throughput, and it is a transport effect
- **F-1.3.2** — The subscription cell produces the structurally cleaner artefact — on game-of-life
- **F-1.3.3** — More TDD cycles and refactorings in the subscription cell
- **F-1.3.4** — Correctness is invariant across every cell
- **F-1.3.5** — Reasoning is coupled to the route and cannot be switched off on the subscription route
- **F-1.3.6** — The subscription-route quality advantage is a route effect, not a reasoning effect

The subscription route's quality advantage is a route effect rather than a reasoning effect — switching reasoning on for the gateway route does not reproduce the subscription profile on any quality metric, which is the comparison this question was rebuilt to make. The gateway delivers 1.63× the throughput, and that too is transport. Correctness is invariant across every cell. One confound is worth naming rather than burying: reasoning is coupled to the route and cannot be switched off on the subscription side, so the two factors are not fully separable here. Details: [findings.md](research/questions-pi/1.3-route-effect-pi/findings.md).

#### 1.4 RQ-spark-vs-sol — On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

Primary outcome is Correctness (external) — the 16-scenario acceptance suite the agent never sees. Everything below it is gated on that result.

| Metric | Direction | Sol / inline | Sol / subagent | Spark / inline | Spark / subagent |
|---|---|---:|---:|---:|---:|
| **Correctness (external)** | higher = better | **0.99** 🏆 | 0.96 | 0.78 | 0.84 |
| Correctness (internal) | higher = better | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| completed_within_budget | higher = better | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (cognitive) | lower = better | 1.8 | **1.6** 🏆 | 3.4 | 4.2 |
| `cognitive_max` (mccabe) | lower = better | 2.8 | **2.6** 🏆 | 4.2 | 4.4 |
| `longest_function` | lower = better | **13.2** 🏆 | 16.2 | 22.8 | 21.2 |
| `avg_loc_per_function` | lower = better | **13.2** 🏆 | 15.9 | 19.2 | 19.3 |
| Smell Total | lower = better | **0** 🏆 | **0** 🏆 | 1.0 | 0.4 |
| Code Mass (APP) | — | 129.2 | 136.0 | 159.6 | 151.8 |
| `predictions_correct_rate` | higher = better | **100 %** 🏆 | **100 %** 🏆 | 80.5 % | 80.5 % |
| duration_seconds | lower = better | 440 | 946 | 321 | 630 |
| total_tokens | lower = better | **1.6 M** 🏆 | 2.5 M | 5.1 M | 6.2 M |

**Correctness-gating applies to every quality and cost row.** No Spark cell reaches `verification_pct = 1.0`, so no Spark cell is eligible for a 🏆 on complexity, mass, duration or tokens — even where its raw number is lower. Spark/inline is the fastest cell in the field at 321 s, and that is precisely the artifact the rule guards against: it is fast because it ships a smaller, wrong rule set. The same holds for its `cycle_count` mean of 10.0, which includes one run that stopped after 3 cycles.

`duration_seconds` therefore carries **no** trophy: the fastest cell in the row is Spark/inline, which gating excludes, and the fastest eligible cell (Sol/inline, 440 s) is not the row's best value. Gating narrows a field of competitors; it never moves a trophy onto a worse number. `total_tokens` does keep its trophy — there Sol/inline is both eligible and the row's lowest value.

Code Mass (APP) carries no trophy at all — see the metric blind spot noted in RQ-1.14: APP has no notion of nesting and rewards a single long function.

`cost_usd` is deliberately absent. Both models bill against the flat-rate subscription and are wired without per-token prices, so the field is a constant 0 for all four cells; a row of zeros would read as a tie rather than as an unmeasured quantity.

**Findings**:

- **F-1.4.1** — Spark does not hold Correctness on this kata
- **F-1.4.2** — Spark pays in code quality on every structural metric
- **F-1.4.3** — Prediction discipline degrades on Spark, and the marker count is unreliable
- **F-1.4.4** — The workflow axis is real but smaller than the model axis

The cheaper-tier model does not hold Correctness (external) on this kata, losing against the larger model on both workflows by a margin far outside the replicate spread — while internal tests stay green in 20 of 20 runs, so the gap is invisible from inside the run and surfaces only against the external suite. It also pays on every structural metric. Prediction discipline degrades and the marker count becomes unreliable, so discipline columns should not be read for that cell. The workflow axis is real but smaller than the model axis. Details: [findings.md](research/questions-pi/1.4-spark-vs-sol/findings.md).

#### 1.5 RQ-astra-pi — On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style?

_Data basis: 25 runs · Coverage: 5/5 cells (100 %) at min_replicates=5._

## Overview

Means per cell. Direction is stated per row.

| Metric | `astra` subs | `sol` subs | `sol` Requesty | `sol` Req. reasoning | `opus-5` Requesty |
|---|---:|---:|---:|---:|---:|
| `cognitive_max` — lower = better | 7.0 | 4.4 | 9.0 | 10.6 | **2.4** 🏆 |
| `cognitive_avg` — lower = better | 2.96 | 2.47 | 4.87 | 5.62 | **2.2** 🏆 |
| `mccabe_max` — lower = better | 4.6 | 4.6 | 6.8 | 8.0 | **3.4** 🏆 |
| `longest_function` — lower = better | 19.4 | 20.8 | 18.8 | 21.6 | **5.8** 🏆 |
| `avg_loc_per_function` — lower = better | 18.0 | 11.53 | 14.14 | 15.3 | **2.62** 🏆 |
| Smell Total — lower = better | 2.4 | **0.6** 🏆 | 2.4 | 2.8 | 2.0 |
| `smell_complexity` — lower = better | 0.2 | **0.0** 🏆 | 0.8 | 0.8 | **0.0** 🏆 |
| Production LoC — lower = better | **22.4** 🏆 | 41.6 | 30.6 | 27.2 | 39.8 |
| Code Mass (APP) — no trophy, see F-1.5.3 | 99.4 | 153.2 | 138.8 | 126.4 | 151.8 |
| Correctness (external) — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| Correctness (internal) — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| `completed_within_budget` — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| `cycle_count` — ambivalent, no trophy | 14.0 | 9.8 | 8.4 | 8.4 | 10.2 |
| `refactorings_applied` — higher = better | 4.0 | **7.0** 🏆 | 5.0 | 4.4 | 3.8 |
| `predictions_correct_rate` — higher = better | 96.7 % | 98.5 % | **100 %** 🏆 | 97.7 % | **100 %** 🏆 |
| `duration_seconds` — lower = better | 496.2 | 615.6 | **252.8** 🏆 | 286.0 | 436.2 |
| `total_tokens` — lower = better | 970.7 k | 1.26 M | 855.4 k | **823.1 k** 🏆 | 2.22 M |

**Reading the table.** Three rows are saturated at the ceiling across all five cells and carry no trophy — there is no contest to win. `cycle_count` gets none because more cycles is not per se better. Code Mass (APP) gets none for the reason in F-1.5.3. Cross-route rows conflate model and transport: RQ-route-effect-pi established that the subscription route alone improves structural metrics on this exact kata and workflow, so a Requesty cell winning a structural row is winning *against* its transport, and a subscription cell winning is not proof of the model. F-1.5.4 bounds how small a difference may be read at all.

**Findings**:

- **F-1.5.1** — Astra does not reach Sol on the shared subscription route
- **F-1.5.2** — Opus 5 wins the structural axis outright, against the transport
- **F-1.5.3** — Astra writes the least code and the least decomposed code, and Code Mass (APP) rewards it for both
- **F-1.5.4** — The noise floor of `cognitive_max` is route-dependent, and on Requesty it exceeds most between-cell differences
- **F-1.5.5** — Astra runs the most cycles and logs the most predictions, with the fewest refactorings of the GPT branch
- **F-1.5.6** — Correctness, budget and the reasoning channel are invisible on this kata

The cleanest comparison available — same route, same vendor, same workflow, no transport confound — goes against the newer model on every structural metric, and the strongest reference wins the structural axis outright against the transport. The newer model writes the least code and the least decomposed code, and Code Mass (APP) rewards it for both, which is exactly where that metric inverts against decomposition. One caveat bounds the whole comparison: the noise floor of `cognitive_max` is route-dependent and on the gateway exceeds most between-cell differences. Details: [findings.md](research/questions-pi/1.5-astra-vs-pi-references/findings.md).

#### 1.6 RQ-astra-native-sol — Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol?

_Data basis: 40 runs · Coverage: 8/8 cells (100 %) at min_replicates=5._

## Overview

Claim Office, example-mapping, pi harness and OpenAI subscription route. Eight cells × five runs = 40 runs. Floor = `baseline-inline-tdd-v1-pi`; Inline = `exact-sol-v1-pi`; Isolated = `exact-sol-v1.1-subagent-pi`; EXACT = `exact-hybrid-v4.2-phase-continuation-pi`. Astra = `gpt-6-astra-codex-no-thinking`; Sol = `gpt-5-6-sol-codex`, with the README's documented equivalent labels. All cells have 100% internal correctness and completion within budget.

### Astra

| Outcome | Floor | Inline | Isolated | EXACT |
|---|---:|---:|---:|---:|
| Correctness (external) | 100% | 100% | 100% | 100% |
| `avg_loc_per_function` | 27.93 | 6.17 | 7.34 | 12.83 |
| `median_loc_per_function` | 26.8 | 4.8 | 6.9 | 11.8 |
| `longest_function` | 32.6 | 13.4 | 14.0 | 19.8 |
| `cognitive_max` | 13.8 | 3.2 | 4.0 | 5.2 |
| `cognitive_avg` | 6.10 | 2.36 | 2.48 | 2.64 |
| `mccabe_max` | 8.6 | 4.2 | 5.0 | 6.2 |
| Smell Total, lower is better | 16.6 | **0.0** 🏆 | **0.0** 🏆 | 15.4 |
| Production LoC | 59.4 | 73.6 | 72.2 | 58.0 |
| Code Mass (APP) | 367.6 | 426.2 | 440.4 | 348.2 |
| `functions` | 1.8 | 7.4 | 5.6 | 2.8 |
| `cycle_count` | n/a | 40.4 | 39.4 | 42.4 |
| Refactor markers | n/a | 40.4 | 39.4 | 23.6 |
| Prediction accuracy, pooled | n/a | 98.7% | 99.2% | 99.7% |
| Duration, seconds (lower is better) | **343.8** 🏆 | 1801.6 | 4186.2 | 2565.4 |
| Tokens (lower is better) | **0.529 M** 🏆 | 7.459 M | 12.230 M | 7.163 M |

### Sol

| Outcome | Floor | Inline | Isolated | EXACT |
|---|---:|---:|---:|---:|
| Correctness (external) | 100% | 100% | 93% | 100% |
| `avg_loc_per_function` | 8.45 | 7.42 | 7.75 | 9.52 |
| `median_loc_per_function` | 6.1 | 4.5 | 5.9 | 6.0 |
| `longest_function` | 27.0 | 20.8 | 18.4 | 24.0 |
| `cognitive_max` | 11.4 | 4.8 | 4.8 | 8.2 |
| `cognitive_avg` | 3.40 | 2.10 | 2.33 | 3.55 |
| `mccabe_max` | 9.8 | 5.6 | 5.0 | 6.2 |
| Smell Total | 4.2 | 0.0 | 0.0 | 9.6 |
| Production LoC | 164.0 | 117.6 | 161.0 | 110.4 |
| Code Mass (APP) | 750.0 | 562.6 | 618.0 | 492.4 |
| `functions` | 14.2 | 8.4 | 11.6 | 6.6 |
| `cycle_count` | n/a | 33.4 | 33.2 | 28.0 |
| Refactor markers | n/a | 33.2 | 32.2 | 14.2 |
| Prediction accuracy, pooled | n/a | 99.3% | 99.4% | 99.3% |
| Duration, seconds (lower is better) | **218.2** 🏆 | 1083.8 | 2397.2 | 1265.6 |
| Tokens (lower is better) | **0.272 M** 🏆 | 4.869 M | 7.126 M | 4.610 M |

Means; all sample SDs and ranges appear in [summary.md](summary.md). Trophies compare workflows within each model, not an implicit eight-cell contest. Only clear contrasts are marked; ties at a universal ceiling are not crowned. All cells meet the standard 0.90 correctness gate, including Sol Isolated, though its failure matters for the RQ's stricter recommendation criterion. Code Mass, function counts and marker counts are not quality rankings. Low Production LoC can accompany very weak decomposition, so it carries no trophy here.

**Cohort limitation:** Astra's cells are September 5 runs; Sol Inline consists of September 13 fresh-comparison runs, while the remaining Sol cells are August runs. Date/environment confounds all cross-model contrasts and also Sol's within-model Inline contrasts. Astra's within-model comparisons retain their shared cohort. No new experiments or analysis-pipeline reruns were performed for this update; existing metrics were reaggregated and costs recomputed.

**Findings**:

- **F-1.6.1** — The native inline arm has better observed quality means than EXACT
- **F-1.6.2** — Low APP mass accompanies weaker structure in both EXACT samples
- **F-1.6.3** — Astra's floor concentrates the task into very few counted functions
- **F-1.6.4** — Astra isolation adds substantial time without a clear quality gain
- **F-1.6.5** — Astra correctness saturates across all four workflows
- **F-1.6.6** — Astra uses more observed time and tokens at every workflow
- **F-1.6.7** — Astra uses fewer Production LoC across the observed workflows

Correctness is perfect in all four cells, so the line transfers in the sense that matters least. On quality the natively-built inline arm shows better observed means than the transferred line, and the cognitive-peak difference is clearer than the noisy function-length contrast. But these are bundled workflow contrasts: they do not identify a single mechanism as the cause, and the reference comparison carries a cohort limitation on top. The newer model concentrates the task into very few counted functions and spends more time and tokens at every workflow. Details: [findings.md](research/questions-pi/1.6-astra-native-sol-line/findings.md).

#### 1.7 RQ-tcr-variants-sol — How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

All six cells achieved perfect external and internal correctness. Direction: correctness and completion **higher = better**; complexity, Code Mass (APP), duration, and tokens **lower = better**. Quality and efficiency trophies are correctness-gated; every cell is eligible. Process and Git-history metrics are descriptive rather than intrinsically directional, so they receive no trophies.

| Outcome | Basic TDD | SOL Predictive TDD | First-party EXACT TCR | Classic TCR | Native-Git TCRDD | git-gamble TCRDD |
|---|---:|---:|---:|---:|---:|---:|
| Correctness (external) | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 | **1.000 ± 0.000** 🏆 |
| Correctness (internal) | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Completed within budget | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 | **100%** 🏆 |
| Test blocks | 3.8 ± 0.8 | 25.2 ± 8.7 | 37.0 ± 1.6 | 7.8 ± 2.5 | 17.2 ± 1.9 | 12.2 ± 3.6 |
| Test cases total | 12.4 ± 3.2 | 29.8 ± 6.4 | 36.4 ± 2.6 | 26.0 ± 7.6 | 29.0 ± 7.7 | 19.8 ± 9.4 |
| Test cases in first block | 2.8 ± 2.5 | 1.0 ± 0.0 | 0.0 ± 0.0 | 1.8 ± 1.1 | 1.0 ± 0.0 | 0.8 ± 0.4 |
| Verified RED | 2.8 ± 1.3 | 9.8 ± 7.3 | 36.8 ± 1.8 | 6.2 ± 3.1 | 17.2 ± 1.9 | 12.2 ± 3.6 |
| Unverified RED | 1.0 ± 0.7 | 15.4 ± 2.3 | 0.2 ± 0.4 | 1.6 ± 3.1 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Explicit TCRDD refactor steps | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.6 ± 4.2 | 0.0 ± 0.0 | 6.6 ± 2.6 | 2.8 ± 0.8 |
| TCR method commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 58.8 ± 7.7 | 10.4 ± 1.9 | 1.0 ± 0.0 | 24.8 ± 6.4 |
| Retained RED commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 17.2 ± 3.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Retained GREEN commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 35.4 ± 2.0 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| Retained refactor commits | 0.0 ± 0.0 | 0.0 ± 0.0 | 5.2 ± 3.4 | 0.0 ± 0.0 | 0.0 ± 0.0 | 0.0 ± 0.0 |
| `avg_loc_per_function` ↓ | 7.29 ± 1.23 | **6.80 ± 0.39** 🏆 | 8.00 ± 2.13 | 8.00 ± 1.14 | 9.81 ± 2.85 | 8.31 ± 1.35 |
| `longest_function` ↓ | 20.2 ± 3.3 | **16.2 ± 1.3** 🏆 | 18.2 ± 6.9 | 22.0 ± 6.4 | 18.6 ± 2.6 | 17.4 ± 1.7 |
| `cognitive_max` ↓ | 6.6 ± 2.1 | 4.0 ± 1.2 | **3.2 ± 0.8** 🏆 | 6.8 ± 0.8 | 5.4 ± 1.5 | 6.2 ± 1.8 |
| `mccabe_max` ↓ | 8.4 ± 3.6 | 4.8 ± 1.3 | **4.0 ± 0.7** 🏆 | 7.4 ± 1.1 | 5.6 ± 0.9 | 6.2 ± 0.4 |
| Smell Total ↓ | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 | **0.0 ± 0.0** 🏆 |
| Code Mass (APP) ↓ | 770.2 ± 73.7 | 574.2 ± 34.3 | 553.6 ± 29.1 | 819.2 ± 58.8 | **505.0 ± 60.3** 🏆 | 556.6 ± 24.3 |
| Duration ↓ | **278 ± 41 s** 🏆 | 1388 ± 303 s | 1082 ± 141 s | 460 ± 77 s | 708 ± 172 s | 558 ± 84 s |
| Total tokens ↓ | **0.34 M ± 0.07 M** 🏆 | 5.48 M ± 1.26 M | 6.29 M ± 0.65 M | 0.75 M ± 0.13 M | 2.32 M ± 0.41 M | 1.71 M ± 0.75 M |

The retained-commit rows describe final-history shape, not an adherence rank. Native-Git external TCRDD deliberately squashes its phase commits at completion, whereas first-party EXACT TCR retains phase-specific commits. RED verification is a TDD construct and is not a fidelity criterion for Classic TCR. `test_cases_first_block` does not count the first-party workflow's inactive up-front test list as an executable test block. `tcr_refactor_steps` counts only explicit TCRDD protocol executions; it does not claim that the controls performed no structural cleanup.

**Findings**:

- **F-1.7.1** — Every method delivers complete correctness
- **F-1.7.2** — TCRDD makes RED verification and refactoring explicit
- **F-1.7.3** — Structured methods improve different aspects of code shape at high cost
- **F-1.7.4** — Composition and tooling determine the audit trail

All six workflows complete within budget, pass their internal suites and score Correctness (external) 1.00 in every replicate, so correctness does not separate the methods at all here. The TCRDD variants make red verification and refactoring explicit, and the structured methods improve different aspects of code shape at high cost — a trade rather than a ranking. Composition and tooling determine the audit trail, which makes the choice between native-Git and tool-enforced execution a reviewability decision rather than a product one. Details: [findings.md](research/questions-pi/1.7-tcr-variants-sol/findings.md).

#### 1.8 RQ-test-list-dimensions-sol-pi — On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality?

_Data basis: 20 runs · Coverage: 2/2 cells (100 %) at min_replicates=5._

## Overview

Both cells use `claim-office-example-mapping` with `gpt-5-6-sol-codex` through pi 0.81.1. v1.6 adds only the independent-dimensions test-list cross-check. Higher is better for Correctness (external) and prediction accuracy; lower is better for decomposition and efficiency metrics.

**Data basis.** Each cell pools every matching run in the pool, n=10 per cell. The v1.5 cell combines this RQ's 2026-09-15 batch with five runs from 2026-09-16 16:24, which also count toward RQ-test-list-dimensions-replication and RQ-tcr-ptdd-parity-claim-sol. The v1.6 cell combines this RQ's 2026-09-16 11:59 batch with five runs from 2026-09-16 16:33–16:54, which also count toward RQ-test-list-dimensions-replication. All runs share the same model, route and harness version.

| Outcome | v1.5 SOL default (n=10) | v1.6 dimensions cross-check (n=10) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 35.8 ± 1.55 | 42.0 ± 3.59 |
| Test LoC | 218.3 ± 47.8 | 220.6 ± 71.3 |
| Mean LoC/function ↓ | 5.72 ± 0.52 | 6.42 ± 1.24 |
| Median LoC/function ↓ | 4.35 ± 0.58 | 5.30 ± 1.96 |
| `longest_function` ↓ | 16.8 ± 1.69 | 18.4 ± 2.37 |
| `cognitive_max` ↓ | 3.70 ± 0.95 | 3.90 ± 1.10 |
| `mccabe_max` ↓ | 4.30 ± 1.16 | 5.00 ± 1.56 |
| Smell Total ↓ | 0 | 0 |
| Code Mass (APP) | 578.2 ± 35.7 | 633.1 ± 94.7 |
| Production LoC | 150.2 ± 27.2 | 152.4 ± 28.1 |
| Prediction accuracy ↑ | 98.9% (713/721) | 99.6% (809/812) |
| Duration ↓ | 21.1 ± 5.9 min | 24.8 ± 7.9 min |
| Tokens ↓ | 6.58 ± 2.24 M | 6.88 ± 4.14 M |
| List-price comparison ↓ | $4.78 ± $1.43 | $4.76 ± $2.55 |

No trophy is awarded. Correctness is exactly tied, and every quality and efficiency difference stays within the larger cell's standard deviation. Test volume, code size, Code Mass (APP), function count, and process counts have ambiguous direction.

**Findings**:

- **F-1.8.1** — The dimensions cross-check adds tests without improving SOL correctness
- **F-1.8.2** — The added review has no established efficiency cost
- **F-1.8.3** — Product quality remains broadly tied

Both workflows pass every external scenario in every run, so the cross-check adds about one sixth more executable tests without improving correctness on this platform. The added review has no established efficiency cost, and product quality remains broadly tied. This is the mirror image of the Opus result: the mechanism that empties the sub-0.90 band there has nothing to remove here, because the floor already sits at the ceiling. Two cells and 20 runs, which is enough to establish the absence of the effect but not to bound it tightly. Details: [findings.md](research/questions-pi/1.8-test-list-dimensions-sol-pi/findings.md).

#### 1.9 RQ-test-list-dimensions-multikata-sol-pi — Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

All cells use `gpt-5-6-sol-codex` through pi and the example-mapping prompt. Tables are split by kata so trophies never compare task sizes. Higher is better for Correctness (external); lower is better for decomposition and efficiency metrics.

### Game of Life

| Outcome | v1.5 SOL default (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 10.6 ± 0.55 | 10.8 ± 0.84 |
| Test LoC | 55.0 ± 6.7 | 58.2 ± 8.5 |
| Mean LoC/function ↓ | 5.55 ± 1.07 | 5.91 ± 1.35 |
| Median LoC/function ↓ | 4.20 ± 0.84 | 4.70 ± 0.97 |
| `longest_function` ↓ | 10.8 ± 1.92 | 11.8 ± 3.90 |
| `cognitive_max` ↓ | 5.00 ± 2.00 | 4.20 ± 1.64 |
| Smell Total ↓ | 0 | 0 |
| Duration ↓ | 8.5 ± 1.0 min | 8.9 ± 0.8 min |
| Tokens ↓ | 1.03 ± 0.45 M | 1.39 ± 0.25 M |
| List-price comparison ↓ | $1.07 ± $0.49 | $1.36 ± $0.23 |

No Game of Life trophy is awarded because all differences remain within the observed spread and Correctness (external) is exactly tied.

### Sphinx Score

| Outcome | v1.5 SOL default (n=5) | v1.6 dimensions cross-check (n=5) |
|---|---:|---:|
| Correctness (external) ↑ | 0.99 ± 0.03 | 0.99 ± 0.03 |
| Internal tests passing | 100% | 100% |
| Completed within budget | 100% | 100% |
| Executable tests | 11.8 ± 0.45 | 12.0 ± 1.00 |
| Test LoC | 117.4 ± 8.0 | 118.8 ± 9.8 |
| Mean LoC/function ↓ | 4.71 ± 0.50 | 5.34 ± 0.73 |
| Median LoC/function ↓ | 4.60 ± 1.14 | 5.20 ± 0.84 |
| `longest_function` ↓ | 7.20 ± 1.64 | 8.20 ± 1.30 |
| `cognitive_max` ↓ | 1.00 ± 0.00 | 1.00 ± 0.00 |
| Smell Total ↓ | 0 | 0 |
| Duration ↓ | 11.9 ± 1.3 min | 10.7 ± 1.0 min |
| Tokens ↓ | 2.25 ± 0.18 M | **1.92 ± 0.28 M** 🏆 |
| List-price comparison ↓ | $2.12 ± $0.15 | $1.86 ± $0.30 |

The Sphinx token trophy marks the only contrast exceeding the standard deviation of both cells. Duration and list-price means point in the same direction but still overlap the observed spread. Test volume, code size, Code Mass (APP), function count, and process counts receive no trophy because their direction is ambiguous.

**Findings**:

- **F-1.9.1** — The dimensions cross-check produces no multikata correctness advantage on SOL/pi
- **F-1.9.2** — v1.6 overhead is kata-dependent rather than systematic
- **F-1.9.3** — Test volume and static product shape remain effectively tied
- **F-1.9.4** — One maintained workflow is not supported by the cross-platform evidence

Across two katas the workflows tie exactly within each: both complete all scenarios on the first, and each cell on the second holds four perfect runs plus one at 0.9375. The cross-check therefore produces no multikata correctness advantage on this platform, and its overhead is kata-dependent rather than systematic. Test volume and static product shape remain effectively tied. The practical consequence is the one the question was opened to settle: a single maintained workflow is not supported by the cross-platform evidence, so the choice has to stay platform-aware. Details: [findings.md](research/questions-pi/1.9-test-list-dimensions-multikata-sol-pi/findings.md).

#### 1.10 RQ-gpt6-sol-vs-gpt56-sol — Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Key result

**GPT-6 Sol matches GPT-5.6 Sol on the canonical Predictive TDD workflow and wins on price.** Both models reach full Correctness (external) on both katas in every one of the ten runs each, and no code-quality axis separates them beyond one standard deviation on Claim Office. What does separate them is cost and wall-clock:

| | Claim Office | Game of Life |
|---|---|---|
| `cost_usd` ↓ | $1.24 vs $4.49 (**−72 %**) | $0.49 vs $1.49 (**−67 %**) |
| `duration_seconds` ↓ | 1301 vs 1750 (−26 %) | 573 vs 727 (**−21 %**) |
| Correctness (external) | 1.00 vs 1.00 | 1.00 vs 1.00 |

The answer to the RQ is therefore yes on all three axes, but the gain is **efficiency, not quality**: the workflow produces the same code for a third of the money.

Two measurement caveats shape how the tables below may be read, each carried by its own finding: Mutation Score is unmeasurable in two Claim Office runs whose suites drive only a spawned CLI (F-1.10.2), and `tests_total` undercounts table-driven suites (F-1.10.3). Neither is a model defect and neither may be quoted as one.

Scope: one workflow (`exact-ptdd-v1-pi`), one prompt style (Example Mapping), one stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **G6** is `gpt-6-sol-codex`, **G5.6** is `gpt-5-6-sol-codex`; both on `exact-ptdd-v1-pi` / Example Mapping / TypeScript.

**The two katas are reported separately and never share a row.** Claim Office (~600 Code Mass (APP), ~35 cycles) against Game of Life (~170, ~13) differ in task size far more than the two models differ in anything, so a row spanning both would rank the kata rather than the model. Within each kata the only thing that varies is the model, which is the contest the trophies describe.

Bold + 🏆 marks the winner of a row; both cells carry it when the gap is smaller than the larger of the two standard deviations, so a shared trophy reads as "no difference". All four cells sit at Correctness (external) 1.00 and therefore clear the 0.90 gate for the quality and cost trophies.

### Claim Office

Mutation Score higher = better; every other row lower = better.

| | G6 | G5.6 |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score (n=3 / n=5) | **0.77 ± 0.20** 🏆 | **0.87 ± 0.04** 🏆 |
| Code Mass (APP) | **655.6 ± 272.4** 🏆 | **583.2 ± 65.7** 🏆 |
| Production LoC | **112.8 ± 31.0** 🏆 | **143.2 ± 33.9** 🏆 |
| `cognitive_max` | **4.6 ± 1.52** 🏆 | **4.4 ± 1.52** 🏆 |
| `cognitive_avg` | **2.10 ± 0.28** 🏆 | **1.93 ± 0.32** 🏆 |
| `mccabe_max` | **4.4 ± 0.55** 🏆 | **4.2 ± 1.10** 🏆 |
| `longest_function` | **20.0 ± 10.3** 🏆 | **16.6 ± 3.85** 🏆 |
| `duration_seconds` | **1301 ± 589** 🏆 | **1750 ± 537** 🏆 |
| `cost_usd` | **$1.24 ± 0.56** 🏆 | $4.49 ± 3.04 |

Correctness carries no trophy: both cells are at 1.00 with σ 0, so the row is saturated and settles nothing. It is shown to document that the quality and cost trophies are not being awarded to a cell that skipped work.

`cost_usd` is the only row on this kata where the gap exceeds the larger standard deviation. Every other row is a tie by the stated rule — on a kata this size, at n=5, the two models are doing the same job to the same standard.

The Mutation Score row is over **three** G6 runs, not five: two are structurally unmeasurable (F-1.10.2). The shared trophy reflects that 0.10 is well inside the 0.20 spread of those three; it is not a claim that the suites are equally strong.

### Game of Life

Same directions.

| | G6 | G5.6 |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 |
| Mutation Score | **0.948 ± 0.031** 🏆 | **0.947 ± 0.012** 🏆 |
| Code Mass (APP) | **154.0 ± 15.9** 🏆 | 183.6 ± 22.4 |
| Production LoC | **37.0 ± 4.30** 🏆 | 43.8 ± 4.15 |
| `cognitive_max` | **6.0 ± 0.71** 🏆 | **4.6 ± 1.82** 🏆 |
| `cognitive_avg` | **2.77 ± 0.38** 🏆 | **2.80 ± 1.08** 🏆 |
| `mccabe_max` | **4.2 ± 0.45** 🏆 | **4.6 ± 0.55** 🏆 |
| `avg_loc_per_function` | **6.83 ± 1.03** 🏆 | **5.81 ± 0.81** 🏆 |
| `longest_function` | **12.2 ± 2.17** 🏆 | **12.8 ± 1.10** 🏆 |
| `duration_seconds` | **573 ± 38** 🏆 | 727 ± 33 |
| `cost_usd` | **$0.49 ± 0.05** 🏆 | $1.49 ± 0.15 |

Four rows separate here where none but cost did on Claim Office: G6 writes less code (Production LoC, Code Mass (APP)) and is faster and cheaper. The quality rows stay tied — including `cognitive_max`, where G6's higher mean (6.0 vs 4.6) sits inside G5.6's 1.82 spread and so is not a difference.

**Shape and discipline** — context, deliberately no trophies. Test counts and unit counts have no unambiguous direction, and `tests_total` is unreliable here (F-1.10.3).

| | G6 / Claim | G5.6 / Claim | G6 / GoL | G5.6 / GoL |
|---|---:|---:|---:|---:|
| Smell Total | 0 ± 0 | 0 ± 0 | 0 ± 0 | 0 ± 0 |
| `functions` | 12.2 ± 3.96 | 16.4 ± 5.27 | 4.8 ± 1.10 | 6.4 ± 1.34 |
| `tests_total` | 34.6 ± 18.9 | 39.6 ± 2.51 | 14.0 ± 0.71 | 11.2 ± 0.84 |
| Test LoC | 93.2 ± 53.3 | 211.6 ± 99.5 | 56.2 ± 3.27 | 58.2 ± 4.38 |
| `cycle_count` | 31.0 ± 18.0 | 39.8 ± 2.49 | 14.0 ± 0.71 | 11.2 ± 0.84 |
| `refactorings_applied` | 28.0 ± 16.6 | 40.0 ± 2.92 | 14.0 ± 0.71 | 11.4 ± 1.14 |
| `predictions_correct_rate` | 99.6 % | 99.5 % | 100 % | 99.1 % |
| `total_tokens` | 4.20 M ± 2.25 M | 6.41 M ± 4.62 M | 1.45 M ± 0.13 M | 1.45 M ± 0.13 M |
| `mutants_total` | 180.3 ± 116.0 | 122.6 ± 11.6 | 59.2 ± 15.2 | 56.6 ± 5.46 |
| `mutants_survived` | 57.0 ± 75.4 | 16.2 ± 4.09 | 3.4 ± 3.13 | 3.0 ± 0.71 |
| `mutants_no_coverage` | 32.7 ± 48.8 | 4.0 ± 1.22 | 0 ± 0 | 0 ± 0 |

Smell Total is 0 in all 20 runs. On these katas that is its established value, so it is not evidence of anything here.

`cost_usd` is a list-price comparison value, not an invoice — nothing is billed per token on the OpenAI subscription route.

**Findings**:

- **F-1.10.1** — GPT-6 Sol matches GPT-5.6 Sol on output and beats it on price
- **F-1.10.2** — Mutation testing is blind to suites that drive only a spawned CLI
- **F-1.10.3** — `tests_total` counts `it(` literals, so table-driven suites read as one test
- **F-1.10.4** — The TDD markers survive on the pi/Sol route at full strength

Across 20 runs the two model generations are indistinguishable in what they produce and clearly separated in what they spend: correctness is saturated, all 20 runs pass the external suite in full with a green internal suite, and no quality row separates them by more than the larger standard deviation on the novel kata. The newer model wins on price. Two measurement limits surfaced here and matter well beyond this question — a suite that drives only a spawned CLI cannot be mutation-scored, and `tests_total` counts literals, so a table-driven suite reads as a single test. Details: [findings.md](research/questions-pi/1.10-gpt6-sol-vs-gpt56-sol/findings.md).

#### 1.11 RQ-workflow-axis-gpt6-sol — On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Key result

**On GPT-6 Sol the workflow does not decide whether the kata is solved — it decides what the solution looks like.** All three arms reach Correctness (external) 1.00 in all 30 runs, on both katas. What separates them is structure and price:

| Claim Office | inline TDD | EXACT PTDD | + isolated Refactor |
|---|---:|---:|---:|
| `cognitive_max` | 35.4 | 4.6 | 5.2 |
| Smell Total | 23.4 | 0.0 | 0.0 |
| `cost_usd` | $0.21 | $1.24 | $2.12 |

The inline-TDD baseline produces a working monolith: 2.2 functions, an average function of 22.5 lines, a `cognitive_max` of 35.4, and 23.4 ESLint/SonarJS findings — at a sixth of the price. The EXACT arms produce a decomposed product with zero findings and single-digit complexity.

Isolating the Refactor phase in a subagent does **not** reproduce the structural gain it showed on GPT-5.6 Sol and native Opus. On Claim Office it lands inside one standard deviation of inline PTDD on every structural axis while costing 71 % more; on Game of Life it wins the per-function axes modestly at 2.9× the cost.

Two measurement limits shape the tables below: Mutation Score is structurally unmeasurable for CLI-driven suites, which removes the whole Claim Office subagent cell (F-1.11.5), and Claim Office execution splits into two modes whose spread exceeds every between-arm difference on that kata (F-1.11.4).

Scope: one model (`gpt-6-sol-codex`), one prompt style (Example Mapping), one stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **B** is `baseline-inline-tdd-v1-pi`, **P** is `exact-ptdd-v1-pi`, **P+S** is `exact-ptdd-v1.1-refactor-subagent-pi`.

**The two katas are reported separately and never share a row.** Claim Office (~550 Code Mass (APP) across the field) against Game of Life (~159) differ in task size far more than the arms differ in anything, even though both carry 15 external acceptance scenarios.

Bold + 🏆 marks the winner of a row; cells share it when the gap is smaller than the larger of the two standard deviations, so a shared trophy reads as "no difference". All six cells sit at Correctness (external) 1.00 and therefore clear the 0.90 gate for the quality and cost trophies. Rows in *italics* have no unambiguous direction — they describe the shape of the product, not its quality, and carry no trophy.

### Claim Office

Mutation Score higher = better; every other trophied row lower = better.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 23.4 ± 7.83 | **0.0 ± 0** 🏆 | **0.0 ± 0** 🏆 |
| `cognitive_max` | 35.4 ± 11.2 | **4.6 ± 1.52** 🏆 | **5.2 ± 1.79** 🏆 |
| `cognitive_avg` | 12.41 ± 9.27 | **2.10 ± 0.28** 🏆 | **2.38 ± 0.46** 🏆 |
| `mccabe_max` | 14.4 ± 3.65 | **4.4 ± 0.55** 🏆 | **5.4 ± 1.67** 🏆 |
| `avg_loc_per_function` | 22.5 ± 10.7 | **5.57 ± 0.69** 🏆 | **5.97 ± 1.24** 🏆 |
| `median_loc_per_function` | 19.3 ± 14.6 | **3.6 ± 1.08** 🏆 | **4.2 ± 1.10** 🏆 |
| `longest_function` | 36.0 ± 6.16 | **20.0 ± 10.3** 🏆 | **19.4 ± 2.61** 🏆 |
| Mutation Score | **0.94 ± 0.03** 🏆 *(n=5)* | **0.77 ± 0.20** 🏆 *(n=3)* | not measurable *(n=0)* |
| `duration_seconds` | **221 ± 34** 🏆 | 1301 ± 589 | 1825 ± 1839 |
| `total_tokens` | **435 k** 🏆 | 4.20 M | 5.11 M |
| `cost_usd` | **$0.21 ± 0.03** 🏆 | $1.24 ± 0.56 | $2.12 ± 2.42 |
| *Production LoC* | 70.2 ± 10.3 | 112.8 ± 31.0 | 119.8 ± 27.2 |
| *Code Mass (APP)* | 414.6 ± 17.7 | 655.6 ± 272.4 | 580.6 ± 101.3 |
| *`functions`* | 2.2 ± 0.84 | 12.2 ± 3.96 | 13.6 ± 8.26 |
| *Test LoC* | 123.4 ± 17.2 | 93.2 ± 53.3 | 114.0 ± 28.8 |
| *`cycle_count`* | 6.8 ± 1.79 | 31.0 ± 18.0 | 13.0 ± 17.7 |
| *`refactorings_applied`* | 0.6 ± 0.55 | 28.0 ± 16.6 | 13.4 ± 17.4 |
| *`predictions_correct_rate`* | — | 99.6 % | 98.5 % |
| *`mutants_total` / survived* | 101.8 / 6.2 | 180.3 / 57.0 *(n=3)* | — |

Correctness carries no trophy: all three cells are at 1.00 with σ 0, so the row is saturated and settles nothing. It is shown to document that the quality and cost trophies are not going to a cell that skipped work.

The Mutation Score row is over the measurable runs only. Seven of the fifteen EXACT runs on this kata — two in P, all five in P+S — produce a suite that drives the CLI through `spawnSync` and imports no domain module, so every mutant survives by construction and the score reads 0.0 (F-1.11.5). Those runs are excluded rather than averaged in; the P+S cell has nothing left to report. The shared trophy between B and P reflects that the 0.17 gap sits inside P's σ 0.20 at n=3 — it is not a claim that the suites are equally strong.

`predictions_correct_rate` is not a contest: only the EXACT arms emit prediction markers, and both sit at ceiling.

### Game of Life

Same directions.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 3.0 ± 2.74 | **0.0 ± 0** 🏆 | **0.0 ± 0** 🏆 |
| `cognitive_max` | 14.6 ± 8.02 | **6.0 ± 0.71** 🏆 | **5.0 ± 1.87** 🏆 |
| `cognitive_avg` | 12.00 ± 9.43 | **2.77 ± 0.38** 🏆 | **2.23 ± 0.96** 🏆 |
| `mccabe_max` | 7.8 ± 3.56 | **4.2 ± 0.45** 🏆 | **4.0 ± 0.71** 🏆 |
| `avg_loc_per_function` | 13.10 ± 7.21 | 6.83 ± 1.03 | **5.09 ± 0.62** 🏆 |
| `median_loc_per_function` | 13.1 ± 7.21 | **5.8 ± 2.68** 🏆 | **3.8 ± 0.84** 🏆 |
| `longest_function` | 17.8 ± 9.68 | **12.2 ± 2.17** 🏆 | **10.8 ± 1.79** 🏆 |
| Mutation Score | **0.95 ± 0.00** 🏆 | **0.95 ± 0.03** 🏆 | **0.95 ± 0.02** 🏆 |
| `duration_seconds` | **118 ± 33** 🏆 | 573 ± 38 | 1258 ± 89 |
| `total_tokens` | **158 k** 🏆 | 1.45 M | 3.03 M |
| `cost_usd` | **$0.09 ± 0.03** 🏆 | $0.49 ± 0.05 | $1.41 ± 0.12 |
| *Production LoC* | 24.2 ± 3.70 | 37.0 ± 4.30 | 45.2 ± 3.77 |
| *Code Mass (APP)* | 154.2 ± 24.2 | 154.0 ± 15.9 | 168.8 ± 14.8 |
| *`functions`* | 1.6 ± 0.55 | 4.8 ± 1.10 | 8.4 ± 1.14 |
| *Test LoC* | 67.2 ± 9.31 | 56.2 ± 3.27 | 51.0 ± 7.58 |
| *`cycle_count`* | 6.4 ± 2.70 | 14.0 ± 0.71 | 12.4 ± 1.34 |
| *`refactorings_applied`* | 0.2 ± 0.45 | 14.0 ± 0.71 | 12.4 ± 1.34 |
| *`predictions_correct_rate`* | — | 100 % | 100 % |
| *`mutants_total` / survived* | 42.4 / 2.0 | 59.2 / 3.4 | 65.4 / 3.2 |

**Findings**:

- **F-1.11.1** — The workflow decides the shape of the solution, not whether there is one
- **F-1.11.2** — What the baseline actually produces is one large function
- **F-1.11.3** — Isolating the Refactor phase does not replicate on GPT-6 Sol
- **F-1.11.4** — Claim Office execution splits into two modes, and the spread swallows the arms
- **F-1.11.5** — A CLI-driven suite cannot be mutation-scored, and it took out a whole cell
- **F-1.11.6** — Suite strength does not follow workflow structure

Every cell solves its kata — 30 of 30 runs at Correctness (external) 1.00, all suites green, all inside budget — so on a model this capable the workflow decides the shape of the solution, not whether there is one. What the plain baseline actually produces is one large function. Isolating the refactor phase does not replicate on this model, which is a negative result against a mechanism that works elsewhere. Execution on the novel kata splits into two modes whose spread swallows the arms, and suite strength does not follow workflow structure. Details: [findings.md](research/questions-pi/1.11-workflow-axis-gpt6-sol/findings.md).

#### 1.12 RQ-workflow-axis-gpt61-sol — On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Key result

**On GPT-6.1 Sol the EXACT arms still decide the shape of the solution, but the plain inline-TDD baseline is no monolith any more.** All 30 runs reach Correctness (external) 1.00 on both katas. The baseline on Claim Office writes 12.4 functions with a `cognitive_max` of 9.0 — four of its five runs carry no Smell Total finding at all. What still separates the arms:

| Claim Office | inline TDD | EXACT PTDD | + isolated Refactor |
|---|---:|---:|---:|
| `cognitive_avg` | 3.23 | 1.47 | 1.33 |
| `longest_function` | 20.4 | 12.0 | 14.2 |
| Mutation Score | 0.71 | 0.90 *(n=3)* | 0.91 *(n=3)* |
| `red_batch_max` | 9.8 | 1.0 | 1.0 |
| `cost_usd` | $0.33 | $1.47 | $4.44 |

Three consequences, each carried by its own finding:

- **Structure still buys smaller units and a stronger suite on Claim Office**
  (F-1.12.1, F-1.12.4). The baseline lets 53.2 of 181.8 mutants survive; the
  EXACT arms about 11 of 115–123.
- **The mechanism differs by kata.** On Claim Office the baseline writes 7–13
  failing tests at once; on Game of Life it writes one at a time, like the EXACT
  arms, and still ends with a larger `cognitive_max` — there the difference is
  that it never refactors (F-1.12.3).
- **The isolated Refactor subagent adds little** — inside the noise of inline
  PTDD on most axes, at 3.0× (Claim Office) and 2.8× (Game of Life) the price
  (F-1.12.2).

Scope: one model (`gpt-6-1-sol-codex`), one prompt style (Example Mapping), one stack (TypeScript), one route (pi provider `openai-codex`), n=5 per cell.

## Overview

Cell means ± standard deviation. **B** is `baseline-inline-tdd-v1-pi`, **P** is `exact-ptdd-v1-pi`, **P+S** is `exact-ptdd-v1.1-refactor-subagent-pi`.

**The two katas are reported separately and never share a row.** Claim Office (~590 Code Mass (APP)) and Game of Life (~165) differ in task size far more than the arms differ in anything.

Bold + 🏆 marks the winner of a row; cells share it when the gap is smaller than the larger of the two standard deviations, so a shared trophy reads as "no difference". This is the same rule as in RQ-workflow-axis-gpt6-sol. All six cells sit at Correctness (external) 1.00 and therefore clear the 0.90 gate for the quality and cost trophies. Rows in *italics* have no unambiguous direction and carry no trophy.

`tdd_discipline`, `skip_events` and the other columns that do not compare across the test-list boundary are not shown: B writes no test list, P and P+S do. `red_batch_max` and `tdd_discipline_step` compare everywhere.

### Claim Office

Mutation Score and `tdd_discipline_step` higher = better; every other trophied row lower = better.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | **3.80 ± 8.50** 🏆 | **0.00 ± 0** 🏆 | **0.00 ± 0** 🏆 |
| `cognitive_max` | **9.00 ± 6.63** 🏆 | **3.00 ± 1.41** 🏆 | **2.40 ± 0.55** 🏆 |
| `cognitive_avg` | 3.23 ± 0.91 | **1.47 ± 0.32** 🏆 | **1.33 ± 0.15** 🏆 |
| `mccabe_max` | 6.40 ± 1.95 | **3.80 ± 1.10** 🏆 | **3.20 ± 0.45** 🏆 |
| `avg_loc_per_function` | 7.55 ± 0.94 | **4.56 ± 0.41** 🏆 | **4.36 ± 0.26** 🏆 |
| `median_loc_per_function` | 6.20 ± 1.60 | **3.50 ± 0.61** 🏆 | **3.20 ± 0.45** 🏆 |
| `longest_function` | 20.40 ± 4.93 | **12.00 ± 1.87** 🏆 | **14.20 ± 3.03** 🏆 |
| Mutation Score | 0.706 ± 0.093 *(n=5)* | **0.898 ± 0.024** 🏆 *(n=3)* | **0.910 ± 0.017** 🏆 *(n=3)* |
| `red_batch_max` | 9.80 ± 2.68 | **1.00 ± 0** 🏆 | **1.00 ± 0** 🏆 |
| `tdd_discipline_step` | 0.18 ± 0.03 | **1.00 ± 0** 🏆 | **1.00 ± 0** 🏆 |
| `duration_seconds` | **450 ± 40** 🏆 | 2171 ± 190 | 4683 ± 633 |
| `total_tokens` | **960 k** 🏆 | 8.97 M | 16.27 M |
| `cost_usd` | **$0.33 ± 0.02** 🏆 | $1.47 ± 0.58 | $4.44 ± 0.35 |
| *Production LoC* | 142.2 ± 13.1 | 130.2 ± 8.0 | 150.6 ± 8.8 |
| *Code Mass (APP)* | 615.8 ± 19.8 | 561.2 ± 18.1 | 582.0 ± 14.9 |
| *`functions`* | 12.4 ± 2.3 | 18.6 ± 2.0 | 25.2 ± 2.6 |
| *`tests_total`* | 24.2 ± 3.0 | 48.8 ± 1.1 | 42.4 ± 0.5 |
| *Test LoC* | 185.2 ± 34.1 | 148.2 ± 54.7 | 186.8 ± 19.3 |
| *`mutants_total` / survived* | 181.8 / 53.2 | 114.3 / 11.7 *(n=3)* | 122.7 / 11.0 *(n=3)* |
| *of those uncovered* | 20.6 ± 29.1 | 3.0 ± 0 *(n=3)* | 3.0 ± 0 *(n=3)* |
| *`refactor_events`* | 0.8 ± 0.4 | 19.6 ± 3.4 | 31.0 ± 5.1 |
| *`cycles_closed`* | 10.2 ± 1.3 | 25.0 ± 1.0 | 22.6 ± 2.9 |
| *`chain_suite_runs`* | 21.6 ± 2.1 | 123.6 ± 11.9 | 171.0 ± 25.3 |

Two shared rows need reading. **Smell Total** and **`cognitive_max`** give B a trophy only because one of its runs carries 19 findings and a `cognitive_max` of 20; the other four sit at 0 findings and 4–10. The rule shares the trophy because that one run inflates B's σ past the gap — read both rows as "B is not reliably worse here", not as "B is as good".

The Mutation Score row is over the measurable runs only. Four of the ten EXACT runs — two in P, two in P+S — produce a suite that drives the CLI through `spawnSync` and imports no domain module, so every mutant survives by construction and the score reads 0.0 (F-1.12.5). Those runs are excluded rather than averaged in.

### Game of Life

Same directions.

| | B | P | P+S |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| Correctness (internal) | 100 % | 100 % | 100 % |
| Smell Total | 3.20 ± 1.79 | **0.00 ± 0** 🏆 | **0.00 ± 0** 🏆 |
| `cognitive_max` | 15.20 ± 4.02 | **7.00 ± 0** 🏆 | **5.40 ± 1.95** 🏆 |
| `cognitive_avg` | 15.10 ± 4.25 | 3.40 ± 0.72 | **2.49 ± 0.59** 🏆 |
| `mccabe_max` | 10.40 ± 1.34 | 5.00 ± 0 | **4.20 ± 0.45** 🏆 |
| `avg_loc_per_function` | 17.53 ± 6.51 | **6.00 ± 1.10** 🏆 | **5.38 ± 0.69** 🏆 |
| `median_loc_per_function` | 17.20 ± 6.98 | **5.00 ± 2.55** 🏆 | **4.10 ± 0.74** 🏆 |
| `longest_function` | 23.80 ± 2.17 | **10.60 ± 1.67** 🏆 | **10.40 ± 2.19** 🏆 |
| Mutation Score | **0.954 ± 0.001** 🏆 | **0.947 ± 0.014** 🏆 | **0.944 ± 0.013** 🏆 |
| `red_batch_max` | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| `tdd_discipline_step` | 1.00 ± 0 | 1.00 ± 0 | 1.00 ± 0 |
| `duration_seconds` | **195 ± 13** 🏆 | 649 ± 36 | 1405 ± 160 |
| `total_tokens` | **269 k** 🏆 | 1.51 M | 2.65 M |
| `cost_usd` | **$0.13 ± 0.02** 🏆 | $0.39 ± 0.03 | $1.10 ± 0.09 |
| *Production LoC* | 26.4 ± 4.5 | 40.6 ± 3.4 | 48.2 ± 3.8 |
| *Code Mass (APP)* | 149.8 ± 9.0 | 171.4 ± 10.3 | 172.2 ± 17.3 |
| *`functions`* | 1.8 ± 0.8 | 6.0 ± 0.7 | 8.8 ± 1.5 |
| *`tests_total`* | 13.0 ± 0.7 | 15.2 ± 0.4 | 13.8 ± 1.1 |
| *Test LoC* | 93.4 ± 4.3 | 72.4 ± 5.9 | 69.2 ± 4.2 |
| *`mutants_total` / survived* | 43.6 / 2.0 | 49.4 / 2.6 | 63.0 / 3.6 |
| *of those uncovered* | 0 | 0 | 0 |
| *`refactor_events`* | 0.0 ± 0 | 5.2 ± 1.5 | 8.6 ± 2.3 |
| *`cycles_closed`* | 3.8 ± 0.4 | 3.4 ± 0.5 | 3.0 ± 0.7 |
| *`chain_suite_runs`* | 15.6 ± 1.5 | 36.6 ± 0.5 | 54.0 ± 5.9 |

`red_batch_max` and `tdd_discipline_step` carry no trophy on Game of Life: all three cells sit at the same value, so there is no contest. The Mutation Score row is a three-way tie — on this kata the suites are equally strong.

**Findings**:

- **F-1.12.1** — Structure still buys smaller units, but the baseline is no longer a monolith
- **F-1.12.2** — The isolated Refactor subagent adds little at three times the price
- **F-1.12.3** — Step size explains Claim Office; on Game of Life the difference is refactoring
- **F-1.12.4** — The baseline suite is weak on Claim Office and equal on Game of Life
- **F-1.12.5** — Four of ten EXACT suites on Claim Office cannot be mutation-scored
- **F-1.12.6** — The EXACT arms cost 3.1× to 13.6× the baseline

Structure still buys smaller units, but the baseline is no longer a monolith: both structured arms beat it on every per-function measure across both katas, with the gap large on the smaller one — `cognitive_avg` 15.10 against 3.40 and 2.49, a baseline of 1.8 counted functions against 6.0 and 8.8. The isolated refactor subagent adds little at three times the price. Step size explains the novel kata; on the smaller one the difference is refactoring. The baseline suite is weak on the novel kata and equal on the other, and the structured arms cost 3.1× to 13.6×. Details: [findings.md](research/questions-pi/1.12-workflow-axis-gpt61-sol/findings.md).

### Research Questions (Cursor CLI)

#### 1.1 RQ-model-quality-cursor — How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping?

_Data basis: 10 runs · Coverage: 2/3 cells (67 %) at min_replicates=5._

## Overview

Code-quality metrics **lower = better**; correctness and TDD-discipline metrics **higher = better**. All cells reach 100 % correctness, so quality trophies are not correctness-gated here.

| Metric (direction) | composer-cursor | grok-cursor | opus-cursor |
|---|---:|---:|---:|
| Code Mass (APP) `code_mass` (↓) | 211.2 | **151.6** 🏆 | pending |
| Production LoC `lines_of_code` (↓) | 68.2 | **39.2** 🏆 | pending |
| `cognitive_max` (↓) | **7.8** 🏆 | 9.2 | pending |
| `cognitive_avg` (↓) | **4.97** 🏆 | 7.9 | pending |
| `mccabe_max` (↓) | **6.2** 🏆 | 7.8 | pending |
| `mccabe_avg` (↓) | **2.4** 🏆 | 3.47 | pending |
| `longest_function` (↓) | 25.4 | **21.8** 🏆 | pending |
| `median_loc_per_function` (↓) | **3.3** 🏆 | 8.2 | pending |
| Smell Total `smell_total` (↓) | **3.0** 🏆 | **2.8** 🏆 | pending |
| Correctness (internal) `tests_passing` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| Correctness (external) `verification_pct` (↑) | **100 %** 🏆 | **100 %** 🏆 | pending |
| `refactorings_applied` (↑) | 3.6 | **5.0** 🏆 | pending |
| `duration_seconds` (↓) | **331** 🏆 | 585 | pending |
| `total_tokens` (↓) | **1.13 M** 🏆 | 1.33 M | pending |

`smell_total` carries two trophies: 3.0 vs 2.8 at σ ≈ 0.7–0.8 is well inside one σ — no meaningful winner. `cost_usd` is empty for all runs; the cursor-cli path (Cursor subscription) reports no per-run cost.

**Findings**:

- **F-1.1** — Parsimony and low complexity come apart, and they swap sides
- **F-1.2** — Grok refactors more, and both models are perfectly correct
- **F-1.3** — Composer under-uses the prediction markers; its 100 % rate is a ceiling artifact

Parsimony and low complexity come apart here, and the two models swap sides: one wins code volume decisively while the other wins the complexity axis only weakly, with `cognitive_avg` inside one σ. Both are perfectly correct, and the model that refactors more is not the one with the flatter code. The prediction-rate reading is a ceiling artifact — one model under-uses the markers, so its 100 % rate measures marker usage rather than accuracy. Closed at two of three cells on 10 runs after the cursor-cli line was discontinued; treat as indicative. Details: [findings.md](research/questions-cursor-cli/1.1-model-quality-cursor/findings.md).

### Research Questions (cross-harness)

#### 1.2 RQ-harness-requesty — How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

Primary outcome **Correctness (external)** `verification_pct` (higher = better) + core cost metric `cost_usd` (lower = better), per harness × kata.

### claim-office (CLI kata, Correctness external counts)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | 0.93 | 0.88 | **0.99** 🏆 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cost_usd` $ (lower) | 41.09 | 22.30 | **14.43** 🏆 |
| `total_tokens` (lower) | 54.7 M | 34.1 M | **13.8 M** 🏆 |
| `duration_seconds` (lower) | 3149 | 2393 | **1884** 🏆 |
| `code_mass` (lower) | 862.8 | 920.6 | **782.0** 🏆 |
| `cognitive_max` (lower) | **3.0** 🏆 | 4.6 | 3.6 |
| `mccabe_max` (lower) | **3.8** 🏆 | 4.4 | **3.8** 🏆 |
| `longest_function` (lower) | **15.0** 🏆 | 18.4 | 22.0 |
| `smell_total` (lower) | **0.0** 🏆 | 0.2 | 0.4 |
| `refactorings_applied` (higher) | **28.0** 🏆 | 23.2 | 19.4 |

### game-of-life (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | CC | OC | pi |
|---|---:|---:|---:|
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 | **1.0** 🏆 |
| `cost_usd` $ (lower) | 5.53 | 1.99 | **1.78** 🏆 |
| `total_tokens` (lower) | 5.21 M | 1.96 M | **1.07 M** 🏆 |
| `cognitive_max` (lower) | **5.0** 🏆 | 12.6 | 11.0 |
| `mccabe_max` (lower) | **4.6** 🏆 | 8.8 | 8.0 |
| `longest_function` (lower) | **11.6** 🏆 | 21.8 | 17.8 |
| `smell_total` (lower) | **2.2** 🏆 | 3.2 | 3.4 |
| `code_mass` (lower) | 158.6 | 154.2 | **150.8** 🏆 |
| `refactorings_applied` (higher) | **8.8** 🏆 | 3.2 | 2.8 |
| `duration_seconds` (lower) | 719 | 350 | **326** 🏆 |

Trophy gating: `verification_pct` is pure correctness → ungated. Quality and cost trophies on claim-office are strictly gated at `verification_pct` = 1.0, and **no cell reaches it** (CC 0.93, OC 0.88, pi 0.99). The trophies there are therefore awarded pragmatically to the closest cell: pi at 0.99 ± 0.03 misses a single scenario in one of five runs, so its cost and speed lead is not an artifact of an unfinished implementation. Read the claim-office trophies as "best among three cells that are all near-complete", not as a clean win. On game-of-life all three cells are fully green and trophies are awarded normally.

`mccabe_max` on claim-office is a genuine tie (CC 3.8 ± 0.45, pi 3.8 ± 1.3) → both 🏆. `cognitive_max` CC 3.0 vs pi 3.6 sits inside 1 σ (CC σ=1.0, pi σ=1.34); the trophy goes to CC on points, the difference is not resolved at n=5.

**Findings**:

- **F-1.1** — Correctness is harness-invariant
- **F-1.2** — pi is the cheapest and fastest harness, by a factor of 2.8 on the expensive kata
- **F-1.3** — Claude Code delivers the leanest `longest_function` on game-of-life, and it buys that with refactor volume
- **F-1.4** — TDD discipline is structurally equal across all harnesses, except refactor intensity

Correctness is harness-invariant: Correctness (internal) is 100 % in all six cells and Correctness (external) is uniformly 1.0 on the small kata, with the three harnesses sitting closely together on the novel one. What the harness does change is price and speed — pi is cheapest and fastest, by a factor of 2.8 on the expensive kata — and the leanest `longest_function` on the small kata belongs to Claude Code, which buys it with refactor volume. TDD discipline is structurally equal across all three harnesses except in refactor intensity. Details: [findings.md](research/questions-cross/1.2-harness-requesty/findings.md).

#### 1.3 RQ-cost-sol-pi-vs-opus-cc — How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

Primary outcome **cost** `cost_usd` (lower = better) + Correctness (external) `verification_pct` (higher = better), per bundle × kata.

### claim-office (CLI kata, high token load)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **2.13** 🏆 | 41.09 |
| `total_tokens` (lower) | **2.09 M** 🏆 | 54.7 M |
| `duration_seconds` (lower) | **503** 🏆 | 3149 |
| `verification_pct` (higher) | **1.00** 🏆 | 0.93 |
| `tests_passing` rate (higher) | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` (lower) | 9.2 | **3.0** 🏆 |
| `mccabe_max` (lower) | 6.8 | **3.8** 🏆 |
| `smell_total` (Smell Total, lower) | 15.4 | **0.0** 🏆 |

### game-of-life (code-quality kata, all cells `verification_pct` = 1.0)

| Metric (direction) | sol-pi | opus-cc |
|---|---:|---:|
| `cost_usd` $ (lower) | **0.91** 🏆 | 5.53 |
| `total_tokens` (lower) | **0.66 M** 🏆 | 5.21 M |
| `duration_seconds` (lower) | **240** 🏆 | 719 |
| `verification_pct` (higher) | **1.0** 🏆 | **1.0** 🏆 |
| `cognitive_max` (lower) | 13.4 | **5.0** 🏆 |
| `mccabe_max` (lower) | 9.4 | **4.6** 🏆 |
| `smell_total` (Smell Total, lower) | 3.6 | **2.2** 🏆 |

Trophy gating: cost/correctness trophies go to the better bundle in each case; quality trophies only among cells with full correctness — on both katas both bundles satisfy `tests_passing` = 100 % (and on game-of-life both `verification_pct` = 1.0), so they are awarded normally.

**Findings**:

- **F-1.1** — sol-pi is drastically cheaper on both katas — ~19× on the expensive kata
- **F-1.2** — The price advantage costs no correctness — on claim-office sol-pi is even more accurate
- **F-1.3** — Cheaper does not mean cleaner: sol-pi carries higher complexity and more smells throughout

The cost advantage of the cheaper model-and-harness pairing scales with the kata's token load: about 6.1× on the small kata and about 19× on the token-heavy one. The price advantage costs no correctness — on the novel kata the cheaper configuration is even more accurate. It is not free, though: it carries higher complexity and more smells throughout. The trade is therefore price against code shape, not price against working software, which is the distinction that decides whether the saving is worth taking on long-lived code. Details: [findings.md](research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/findings.md).

#### 1.4 RQ-model-quality-cc-vs-pi — Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (hybrid-v4)?

_Data basis: 20 runs · Coverage: 4/4 cells (100 %) at min_replicates=5._

## Overview

Complexity/code quality (all **lower = better**). All cells 100 % correct → quality trophies not correctness-gated.

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

`cost_usd`: all cells via Requesty (values in `summary.md`).

**Findings**:

- **F-1.1** — The harness effect on complexity dominates the thinking effect
- **F-1.2** — Thinking does not reliably reduce code complexity on either harness
- **F-1.3** — pi is more parsimonious and faster, CC less complex and more smell-stable

For one and the same model, the harness effect on complexity dominates the reasoning effect: Claude Code writes less complex code than pi — `cognitive_max` around 5 against 8–10 — and that difference is larger and more consistent than switching reasoning on or off within either harness. Reasoning does not reliably reduce complexity on either side. pi is more parsimonious and faster, Claude Code less complex and more stable on smells. The harness and its workflow path, not the reasoning level, is the stronger driver of the quality profile. Details: [findings.md](research/questions-cross/1.4-opus-cc-vs-pi/findings.md).

#### 1.5 RQ-v3-emergent-tdd — Under a bare 'use TDD' instruction that prescribes no phase markers (inline-tdd-v1), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated?

_Data basis: 49 runs · Coverage: 10/10 cells (100 %) at min_replicates=3._

## Overview — which model actually does TDD, and which refactors

Two independent axes. **Test-first TDD** asks whether the model works in small steps and observes a red state; **refactoring** asks whether it improves working code unprompted. Both are measured from the tool sequence and hand-validated; neither is derivable from `cycle_count` alone.

| Model (harness) | n | **Test-first TDD** | 1st cycle | ≤2 cases | red verified | **Refactoring** | validated | in runs |
|---|---:|:---:|---:|---:|---:|:---:|---:|---:|
| **gpt-5-6-sol** (pi) | 10 | ✅ **yes** 🏆 | **1** 🏆 | **8/10** 🏆 | 9/10 | ✅ **yes** | 3 | 3/10 |
| **opus-5-no-thinking** (CC) | 18 | ⚠️ partial | 13 | 2/18 | **17/18** 🏆 | ✅ **yes** 🏆 | **11** 🏆 | **8/18** 🏆 |
| opus-4-7-no-thinking (CC) | 17 | ❌ no | 13 | 0/17 | 7/17 | ❌ no | 0 | 0/17 |
| sonnet-4-6 (CC) | 11 | ❌ no | 10 | 2/11 | 2/11 | ❌ no | 0 | 0/11 |
| haiku-4-5 (CC) | 11 | ❌ no | 15 | 1/11 | 4/11 | ❌ no | 0 | 0/11 |
| opus-4-6 (CC) | 4 | ❌ no | 42 | 0/4 | 2/4 | ❌ no | 0 | 0/4 |

**Column definitions** — each one is a count from the tool sequence, not a score:

| Column | What it counts | Why it matters |
|---|---|---|
| **1st cycle** | Median number of `it(` / `test(` cases the model writes **before its first line of implementation**. | The defining TDD step. 1–2 means one behaviour at a time; 13 means a test suite was authored up front. Lower = better. |
| **≤2 cases** | Runs whose first cycle held at most two test cases. | How often the model actually took a TDD-sized step, rather than the median hiding the spread. |
| **red verified** | Runs where a test run happened **between** writing the test and writing the implementation. | Without it the model never saw the test fail — no red state was ever observed, so the test proves nothing about the code that follows. |
| **validated** | Hand-checked **real** refactorings, out of the raw candidate count the heuristic produces (60 candidates across all runs → 14 real). | The raw count also captures bugfixes, lint fixes and brand-new untested files. Only the validated number supports a refactoring claim — see F-1.2. |
| **in runs** | Runs containing at least one validated refactoring. | Distinguishes "one run refactored a lot" from "refactoring is habitual". |

The two verdict columns are mechanical, not judgement calls:

- **Test-first TDD** — *small steps* = a majority of runs open with ≤2 cases;
  *red* = at least ⅔ of runs verify red. Both → ✅, one → ⚠️, neither → ❌.
- **Refactoring** — ✅ if the model produced at least one validated refactoring.

`opus-4-6` sits closest to a boundary: 2 of 4 runs verify red, which is below the ⅔ threshold but on n=4 is barely more than a coin flip. Its verdict rests on the step size (median 42 cases, 0 of 4 runs ≤2), which is unambiguous.

**The verdicts in one line each:**

- **`gpt-5-6-sol` — the only model doing textbook TDD.** One case per cycle, red
  verified, and it refactors. Nothing else in the set comes close on step size.
- **`opus-5` — a working red/green loop at the wrong granularity.** It verifies
  red more reliably than any other model (17/18) but commits to ~13 expectations
  before implementing. Strongest refactorer by a wide margin.
- **`opus-4-7` — test-first ordering only.** Large increments, red unverified in
  more than half the runs, and of 16 refactor candidates **not one** is a
  refactoring.
- **`sonnet-4-6` — the shape of TDD without the loop.** 8 of 11 runs write the
  entire suite in one block; red verified in 2 of 11. Never refactors.
- **`haiku-4-5` / `opus-4-6` — neither.** Suites up front (opus-4-6: median 42
  cases), red mostly unverified, no refactorings.

**Scope of this table: all 71 inline-tdd-v1 example-mapping runs**, which is why `n` exceeds the `runs.csv` cell size (opus-5 18 vs. 12, opus-4-7 17 vs. 15) and why `opus-4-6` appears at all — it has no cell in the factor grid.

Restricting to the grid leaves every verdict intact **except haiku-4-5**, which moves ❌ → ⚠️: on its 6 grid runs 4 verify red (67 %, just over the ⅔ line), against 4 of 11 across all its runs. Its step size is unaffected (median 14 cases, 1 of 6 runs ≤2), so the "no TDD" reading holds on substance; the flag is a threshold artefact on a small cell. Per-scope figures are in F-1.5 and F-1.2.

### Secondary outcomes

| Model (harness) | test-first ordering (↑) | `cycle_count` (↑) | refac raw | Correctness ext. (↑) |
|---|---:|---:|---:|---:|
| opus-5-no-thinking (CC) | **100 %** 🏆 | **4.4** 🏆 | 14 | **1.00** 🏆 |
| gpt-5-6-sol (pi) | **100 %** 🏆 | 3.9 | 7 | **1.00** 🏆 |
| opus-4-7-no-thinking (CC) | **100 %** 🏆 | 2.3 | 10 | **1.00** 🏆 |
| sonnet-4-6-no-thinking (CC) | **100 %** 🏆 | 2.0 | 0 | 0.96 |
| haiku-4-5-no-thinking (CC) | 83 % | 3.5 | 3 | 0.87 |

**Test-first ordering is nearly universal and says almost nothing.** Four of five models reach 100 %, including the ones that never observe a red state. Quote the verdict table above, not this column. `cycle_count` and raw refactor counts carry no cross-workflow meaning — see the measurement notes. Correctness (external) is `verification_pct` on claim-office; game-of-life is 1.00 throughout.

**Findings**:

- **F-1.1** — Test-first *ordering* survives without any scaffolding
- **F-1.2** — Refactoring does not survive, and only two models do it at all
- **F-1.3** — Test-first discipline stops at the core algorithm
- **F-1.4** — The measurement, not the behaviour, was missing
- **F-1.5** — Test-first ordering is not TDD: only one model works in small verified steps

Test-first ordering survives without any scaffolding — 70 of 71 runs open with a test, across six model families, two harnesses and four katas — but ordering is not TDD. Among the 55 runs in the factor grid only 22 % open with an increment of two cases or fewer, and 31 % never run the tests before implementing, so no red state is ever observed. Refactoring does not survive at all: of 60 candidates, 14 were real after hand validation, and only two models refactor unprompted. One model of six works in genuine TDD-sized steps. Details: [findings.md](research/questions-cross/1.5-v3-emergent-tdd/findings.md).

#### 1.6 RQ-test-list-dimensions-replication — Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance?

_Data basis: 40 runs · Coverage: 4/4 cells (100 %) at min_replicates=10._

## Overview

Cell means ± standard deviation at n=10 per cell. **v1.5** is the PTDD workflow without the independent-dimensions cross-check in the test-list phase; **v1.6** adds it and changes nothing else.

The two platforms are separate tables and are never compared with each other. Absolute duration, token and cost levels differ by harness and route, so only the within-platform contrast is causal. Trophies are awarded **within a table**.

Complexity, unit size, duration, cost and missed mutants are lower = better; Correctness, Mutation Score and prediction accuracy are higher = better. Production LoC, Code Mass (APP), function count, test count, Test LoC, `mutants_total` and the refactoring count have no unambiguous direction and receive no trophy; they appear as context.

**Correctness guard — passed.** All four cells clear the 0.90 gate. Correctness (internal) and completion within budget are 100 % in all four.

`mutants_survived` is split into its two parts. A **Survived** mutant means a test ran the mutated line and still passed — a weak assertion. An **uncovered** one means no test reaches the line at all — untested code.

### Native Opus 5 / Claude Code

| Metric | v1.5 (n=10) | v1.6 with cross-check (n=10) |
|---|---:|---:|
| Correctness (external) | 0.96 ± 0.08 | **0.99 ± 0.02** 🏆 |
| Worst run | 0.73 | **0.93** 🏆 |
| `cognitive_max` | 2.8 ± 0.63 | 2.8 ± 0.63 |
| `cognitive_avg` | **1.52 ± 0.21** 🏆 | **1.47 ± 0.26** 🏆 |
| `mccabe_max` | 3.3 ± 0.95 | 3.3 ± 0.48 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `avg_loc_per_function` | **5.53 ± 0.65** 🏆 | **5.95 ± 0.93** 🏆 |
| `median_loc_per_function` | **4.55 ± 1.12** 🏆 | **4.70 ± 1.27** 🏆 |
| `longest_function` | **17.7 ± 6.25** 🏆 | **18.9 ± 5.26** 🏆 |
| Mutation Score | **0.96 ± 0.03** 🏆 | 0.92 ± 0.06 |
| `predictions_correct_rate` | 97.1 % | **98.9 %** 🏆 |
| `duration_seconds` | **1434.6 ± 518.4** 🏆 | **1206.1 ± 318.1** 🏆 |
| `cost_usd` | 23.12 ± 17.33 | **16.10 ± 4.28** 🏆 |
| *`tests_total`* | 52.0 ± 3.16 | 61.2 ± 6.70 |
| *Test LoC* | 457.0 ± 131.8 | 599.1 ± 258.6 |
| *Production LoC* | 236.2 ± 22.5 | 245.7 ± 32.9 |
| *Code Mass (APP)* | 661.7 ± 26.5 | 714.8 ± 70.1 |
| *`functions`* | 25.4 ± 3.03 | 25.3 ± 4.42 |
| *`mutants_total` / survived* | 126 / 4.5 | 134 / 10.4 |
| *of those uncovered* | 1.9 ± 3.14 | 5.8 ± 6.61 |
| *`total_tokens`* | 30.4 M | 21.4 M |

### GPT-5.6 SOL / pi

| Metric | v1.5 (n=10) | v1.6 with cross-check (n=10) |
|---|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 |
| `cognitive_max` | **3.7 ± 0.95** 🏆 | **3.9 ± 1.10** 🏆 |
| `cognitive_avg` | **1.87 ± 0.48** 🏆 | **1.83 ± 0.37** 🏆 |
| `mccabe_max` | **4.3 ± 1.16** 🏆 | **5.0 ± 1.56** 🏆 |
| Smell Total | 0.0 ± 0.00 | 0.0 ± 0.00 |
| `avg_loc_per_function` | **5.72 ± 0.52** 🏆 | 6.42 ± 1.24 |
| `median_loc_per_function` | **4.35 ± 0.58** 🏆 | 5.30 ± 1.96 |
| `longest_function` | **16.8 ± 1.69** 🏆 | **18.4 ± 2.37** 🏆 |
| Mutation Score | **0.89 ± 0.05** 🏆 | **0.86 ± 0.05** 🏆 *(n=9)* |
| `predictions_correct_rate` | 98.9 % | **99.6 %** 🏆 |
| `duration_seconds` | **1263.4 ± 351.0** 🏆 | **1486.0 ± 476.7** 🏆 |
| `cost_usd` | **4.78 ± 1.43** 🏆 | **4.76 ± 2.55** 🏆 |
| *`tests_total`* | 35.8 ± 1.55 | 42.0 ± 3.59 |
| *Test LoC* | 218.3 ± 47.8 | 220.6 ± 71.3 |
| *Production LoC* | 150.2 ± 27.2 | 152.4 ± 28.1 |
| *Code Mass (APP)* | 578.2 ± 35.7 | 633.1 ± 94.7 |
| *`functions`* | 15.3 ± 4.03 | 13.7 ± 4.06 |
| *`mutants_total` / survived* | 117 / 13.3 | 133 / 18.3 *(n=9)* |
| *of those uncovered* | 3.8 ± 1.55 | 5.4 ± 2.70 *(n=9)* |
| *`total_tokens`* | 6.58 M | 6.88 M |

Rows where the two columns are identical (`cognitive_max` and `mccabe_max` on Opus, Smell Total on both) carry no trophy: there is no contest to win.

The SOL v1.6 Mutation Score is reported at n=9. One run in that cell scored 0.00 with 112 of 112 mutants surviving against a green suite at perfect external correctness — an instrument failure rather than a measurement of the suite, and excluded here. `summary.md` carries the unfiltered n=10 figure of 0.78 ± 0.28, which the σ alone marks as describing two populations.

**Findings**:

- **F-1.6.1** — The platform interaction replicates, and it lives in the correctness floor
- **F-1.6.2** — The cross-check also halves cost variance on Opus
- **F-1.6.3** — Product structure is untouched on Opus and slightly worse on SOL
- **F-1.6.4** — More tests, weaker suites: the cross-check lowers test strength on both platforms

The platform interaction replicates at n=10 per cell, and it lives in the correctness floor rather than the mean. On Opus the cross-check lifts the worst run from 0.73 to 0.93 and empties the sub-0.90 band, cutting the standard deviation by a factor of four while the mean moves only 0.03 — a reader of means alone would miss the effect entirely, which is the methodological point as much as the result. It also halves cost variance on Opus. Product structure is untouched there and slightly worse on the other platform, and test strength falls on both. Details: [findings.md](research/questions-cross/1.6-test-list-dimensions-replication/findings.md).

#### 1.8 RQ-exact-coding-java — On Java 17 with JUnit 5 and Maven, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?

_Data basis: 60 runs · Coverage: 12/12 cells (100 %) at min_replicates=5._

## Overview

All values are cell means at `n=5`. Comparisons are only within the same model and kata; the three methods are the columns. **Inline** is the minimal inline-TDD instruction, **EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same workflow with the Refactor step delegated to an isolated subagent.

Correctness and budget completion are higher = better; complexity, method size, duration, and cost are lower = better. Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap to the best cell is smaller than that cell's own standard deviation; three trophies in a row therefore read as "no effect".

### Correctness and budget

| Model | Kata | Correctness (external) Inline | EXACT v1 | EXACT v1.1 | Within budget Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| GPT-5.6 SOL | Claim Office | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| Opus 5 | Game of Life | **1.00** 🏆 | **1.00** 🏆 | **1.00** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| Opus 5 | Claim Office | **1.00** 🏆 | 0.97 | 0.97 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |

### `cognitive_max`

| Model | Kata | Cognitive max Inline | EXACT v1 | EXACT v1.1 | McCabe max Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 9.8 | **5.8** 🏆 | **6.0** 🏆 | 8.2 | **4.2** 🏆 | **4.4** 🏆 |
| GPT-5.6 SOL | Claim Office | 9.8 | **5.8** 🏆 | 7.8 | 10.4 | **7.4** 🏆 | **7.8** 🏆 |
| Opus 5 | Game of Life | **5.0** 🏆 | **4.6** 🏆 | **7.0** 🏆 | **3.8** 🏆 | **3.8** 🏆 | **4.8** 🏆 |
| Opus 5 | Claim Office | 6.6 | 4.4 | **3.2** 🏆 | 6.2 | **4.4** 🏆 | **4.4** 🏆 |

### Method size (NCSS)

| Model | Kata | NCSS max Inline | EXACT v1 | EXACT v1.1 | NCSS avg Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 14.0 | **7.4** 🏆 | **7.0** 🏆 | 7.26 | **3.84** 🏆 | **3.62** 🏆 |
| GPT-5.6 SOL | Claim Office | 32.6 | **24.4** 🏆 | **27.8** 🏆 | 7.75 | 5.64 | **3.71** 🏆 |
| Opus 5 | Game of Life | **7.0** 🏆 | **7.0** 🏆 | **7.6** 🏆 | **3.65** 🏆 | **3.60** 🏆 | **4.08** 🏆 |
| Opus 5 | Claim Office | 19.4 | 12.6 | **9.4** 🏆 | 4.89 | 4.05 | **3.29** 🏆 |

### Efficiency

| Model | Kata | Duration Inline | EXACT v1 | EXACT v1.1 | Cost Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | **195 s** 🏆 | 916 s | 2,256 s | **$0.42** 🏆 | $2.21 | $5.92 |
| GPT-5.6 SOL | Claim Office | **296 s** 🏆 | 1,996 s | 6,072 s | **$0.58** 🏆 | $5.25 | $17.78 |
| Opus 5 | Game of Life | **251 s** 🏆 | 756 s | 2,652 s | **$1.41** 🏆 | $5.88 | $27.49 |
| Opus 5 | Claim Office | **347 s** 🏆 | 1,313 s | 5,445 s | **$2.88** 🏆 | $15.33 | $78.12 |

### Test strength (Mutation Score)

Higher = better. PIT against the run's own JUnit 5 suite, `n=5` per cell.

| Model | Kata | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 0.86 | **0.90** 🏆 | **0.94** 🏆 |
| GPT-5.6 SOL | Claim Office | 0.81 | 0.91 | **0.94** 🏆 |
| Opus 5 | Game of Life | 0.91 | **0.92** 🏆 | **0.93** 🏆 |
| Opus 5 | Claim Office | 0.88 | 0.93 | **0.96** 🏆 |

Unnoticed behaviour changes per run — mutants the suite let through. Lower = better.

| Model | Kata | Inline | EXACT v1 | EXACT v1.1 |
|---|---|---:|---:|---:|
| GPT-5.6 SOL | Game of Life | 5.0 | 3.0 | **1.8** 🏆 |
| GPT-5.6 SOL | Claim Office | 17.8 | 6.0 | **4.6** 🏆 |
| Opus 5 | Game of Life | **2.0** 🏆 | **2.4** 🏆 | **2.2** 🏆 |
| Opus 5 | Claim Office | 8.0 | **5.4** 🏆 | **3.6** 🏆 |

The Opus Game of Life row spans 0.4 mutants and is a tie, not a contest.

Code Mass (APP), Production LoC, Test LoC, test count, method count, and process-marker counts have ambiguous direction and therefore receive no trophy. Smell Total is zero in every cell and has no winner. Every cell clears the correctness gate, so all quality and efficiency rows are eligible. "Within budget" is `ok` runs over runs in the pool: every cell holds five `ok` runs and nothing else. Timed-out attempts are not replicates and are removed from the pool; Opus Claim Office EXACT v1.1 needed one such attempt that hit the 7200 s budget (removed in commit `117868cdc`), so its 100 % is five of six attempts.

**Findings**:

- **F-1.8.1** — Neither EXACT Coding variant improves correctness on the Java tasks
- **F-1.8.2** — EXACT Coding lowers Java `cognitive_max`; the isolated Refactor subagent adds nothing beyond it
- **F-1.8.3** — The isolated Refactor subagent grows the codebase, most sharply on Opus Claim Office
- **F-1.8.4** — Each layer of structure multiplies the efficiency premium
- **F-1.8.5** — PMD threshold smells do not discriminate these Java cells
- **F-1.8.6** — The isolated Refactor subagent trades many small methods for a lower typical method size
- **F-1.8.7** — Predictive accuracy is unaffected by where the Refactor step runs
- **F-1.8.8** — `refactorings_applied` counts different units in the two EXACT arms and must not be compared across them
- **F-1.8.9** — Mutation Score rises with every layer of workflow structure
- **F-1.8.10** — Counted in absolute terms, the test gap closes on three of four cells and not at all on the fourth
- **F-1.8.11** — On Claim Office, inline TDD's test gap is bimodal, and the structured workflows remove the bad mode
- **F-1.8.12** — The Claim Office correctness misses come from suites that are stronger than average, not weaker
- **F-1.8.13** — On Claim Office the Refactor subagent is an Opus-specific gain

Neither structured variant improves correctness on the Java tasks, because correctness is already saturated under inline TDD — and on the novel kata inline Opus is perfect while both structured variants miss one of fifteen scenarios in two of five runs each. The method does lower Java `cognitive_max`, with the isolated refactor subagent adding nothing beyond it, and each layer of structure multiplies the efficiency premium. Mutation Score is the one dimension where both layers pay off, rising in all four model × kata combinations from 0.811–0.913 to 0.933–0.959. Details: [findings.md](research/questions-cross/1.8-exact-coding-java/findings.md).

#### 1.9 RQ-exact-coding-python — On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?

_Data basis: 60 runs · Coverage: 12/12 cells (100 %) at min_replicates=5._

## Overview

All values are cell means ± standard deviation at `n=5` unless a cell states otherwise. Comparisons are only ever within one kata and one model; the three methods are the columns. **Inline** is the minimal inline-TDD instruction, **EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same workflow with the Refactor step delegated to an isolated subagent.

Complexity and cost are lower = better, Mutation Score higher = better. Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap to the best cell is smaller than **the best cell's** own standard deviation, so three trophies in a row read as "no effect".

`unit_size_max`, `code_mass`, Production LoC and the process-marker counts have no unambiguous direction and receive no trophy; they appear in the individual findings as context.

**This table shows Claim Office only.** Game of Life is training-known, and under a minimal instruction both models already produce low-complexity code on it, so its cells separate almost nowhere and would pad the overview without adding to it. The kata remains part of the RQ and its cells are reported in the findings below, where they serve as the control that shows the effect depends on the specification being novel.

**Correctness guard — passed.** Every one of the twelve cells clears the 0.90 gate, so every quality row below is eligible. Correctness (internal) and completion within budget are 100 % everywhere; Correctness (external) is 1.00 ± 0.00 in eleven cells. The single deviation is Opus 5 on Claim Office under EXACT v1.1 at 0.97 ± 0.04, which misses one of fifteen scenarios in two of five runs — worth watching, since it is the only place in this RQ where adding workflow costs a scenario, but not enough to disqualify the cell.

### Cognitive Complexity, hardest function (`cognitive_max`), lower = better

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | 14.2 ± 3.6 | **5.0 ± 1.0** 🏆 | **4.8 ± 1.3** 🏆 |
| Opus 5 | 6.2 ± 1.6 | 7.0 ± 0.7 | **4.6 ± 1.3** 🏆 |

### Mutation Score, higher = better

`n` differs by cell; see [Mutation Score coverage](README.md#mutation-score-coverage).

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | 0.738 ± 0.093 | **0.914 ± 0.004** 🏆 *(n=2)* | — *(n=0)* |
| Opus 5 | **0.916 ± 0.009** 🏆 | **0.938 ± 0.025** 🏆 | **0.925 ± 0.019** 🏆 |

### List-price cost per run, lower = better

| Model | Inline | EXACT v1 | EXACT v1.1 |
|---|---:|---:|---:|
| GPT-5.6 SOL | **$0.52** 🏆 | $4.60 | $14.61 |
| Opus 5 | **$2.70** 🏆 | $17.55 | $38.76 |

**Findings**:

- **F-1.9.1** — The complexity benefit appears only where the inline baseline is weak
- **F-1.9.2** — Python reproduces the Java pattern; the TypeScript magnitude belonged to an older model
- **F-1.9.3** — The Java Mutation Score ordering does not reproduce
- **F-1.9.4** — One cell carries a broad, large benefit: Claim Office with GPT-5.6 SOL
- **F-1.9.5** — The workflow costs eight to twenty-eight times inline TDD for the same correctness
- **F-1.9.6** — On Claim Office, the SOL ports write end-to-end suites, and that is measurable
- **F-1.9.7** — EXACT v1.1 decomposes further without a matching quality gain
- **F-1.9.8** — Python's missed mutants are weak assertions, not untested code

The complexity benefit appears only where the inline baseline is weak, and the decisive quantity is the starting point rather than the workflow — the single most portable result in this report. Sorted by effect size the rows sort themselves by their inline baseline: the structured column spans 4.2–7.0 across every stack, model and kata, a factor of 1.7, while the inline column spans 5.0–21.8, a factor of 4.4. The method pulls the hardest function down to roughly the same level wherever it starts, and costs eight to twenty-eight times inline TDD for the same correctness. Details: [findings.md](research/questions-cross/1.9-exact-coding-python/findings.md).

#### 1.10 RQ-exact-coding-typescript — On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5?

_Data basis: 59 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

Cell means ± standard deviation. **Inline** is the minimal inline-TDD instruction, **EXACT v1** the shared-context Predictive TDD workflow, **EXACT v1.1** the same workflow with the per-cycle Refactor step delegated to an isolated subagent. Kata is Claim Office, prompt is Example Mapping.

The two models are separate tables and are never compared with each other: they run on different harnesses and routes, so absolute duration, token and cost levels are not causal comparisons. Trophies are awarded **within a table**.

Complexity, unit size, duration and cost are lower = better; Mutation Score is higher = better. Bold values with 🏆 mark the winner of that row. A trophy is shared when the gap to the best cell is smaller than the best cell's own standard deviation, so several trophies in a row read as "no effect".

Production LoC, Code Mass (APP), Test LoC, test count, unit count and `mutants_total` have no unambiguous direction and receive no trophy; they appear below as context.

`mutants_survived` is split into its two parts. A **Survived** mutant means a test ran the mutated line and still passed — a weak assertion. An **uncovered** one (`mutants_no_coverage`) means no test reaches the line at all — untested code. Mutation Score cannot tell them apart, and on Opus they separate arms whose scores are identical (F-1.10.8).

**Data basis — pooled cells.** Aggregation is query-based, so every run in the pool with the same workflow, model and kata counts. Four cells pool more than one batch:

| Cell | Runs | Batches |
|---|---:|---|
| Opus Inline | 10 | 5 from this RQ (Claude Code 2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| Opus EXACT v1 | 15 | 10 from the earlier Opus RQs (2.1.267) + 5 from the RQ-opus55-current-workflow refill (2.1.280) |
| Opus EXACT v1.1 | 9 | 4 from this RQ (2.1.267) + 3 from the RQ-opus55-current-workflow refill (2.1.280) + 2 from the 2026-10-19 fill (2.1.280) |
| SOL EXACT v1 | 15 | 10 from the earlier SOL RQs + 5 from the GPT-5.6 reference arm of RQ-gpt6-sol-vs-gpt56-sol (all pi 0.81.1) |

The other two SOL cells hold one batch of five each. The Opus cells therefore mix two Claude Code versions; see Caveats for where the two halves differ.

**TDD discipline is not an outcome of this RQ and cannot become one.** The six marker- and transcript-derived columns it used to declare were retired in 2026-10; the phase chain that replaced them exists only for runs made after the stack reporter landed, which covers the refilled Opus halves and none of the gpt-5-6-sol-codex cells. Neither family of columns spans this RQ's central comparison, so no discipline claim is made here.

**Correctness guard — all six cells pass.** Every cell reaches `verification_pct` ≥ 0.99 and is eligible for every quality and cost trophy. Correctness (internal) is 100 % in all six cells. Only `ok` runs count as replicates, so the Opus EXACT v1.1 cell describes its nine finished runs; the three attempts that hit the two-hour budget ceiling are not in it and appear only in the "Completed within budget" row (9 of 12 attempts, F-1.10.4).

### Opus 5 — native Claude Code

| Metric | Inline (n=10) | EXACT v1 (n=15) | EXACT v1.1 (n=9) |
|---|---:|---:|---:|
| Correctness (external) | **1.00 ± 0.00** 🏆 | **1.00 ± 0.02** 🏆 | **0.99 ± 0.02** 🏆 |
| Completed within budget (`ok` / attempts) | **100 %** 🏆 | **100 %** 🏆 | 75 % (9/12) |
| `cognitive_max` | 6.10 ± 1.91 | **3.07 ± 0.96** 🏆 | **3.00 ± 1.12** 🏆 |
| `cognitive_avg` | 2.46 ± 0.37 | **1.48 ± 0.24** 🏆 | **1.30 ± 0.19** 🏆 |
| `mccabe_max` | 5.30 ± 1.16 | **3.33 ± 0.49** 🏆 | **3.22 ± 0.44** 🏆 |
| `mccabe_avg` | 2.02 ± 0.18 | 1.57 ± 0.11 | **1.36 ± 0.09** 🏆 |
| Smell Total | 0.10 ± 0.32 | **0.00 ± 0.00** 🏆 | **0.00 ± 0.00** 🏆 |
| `unit_size_max` | 24.30 ± 4.14 | 17.93 ± 4.93 | **14.11 ± 3.06** 🏆 |
| `unit_size_avg` | 7.80 ± 0.78 | 5.82 ± 0.78 | **4.69 ± 0.36** 🏆 |
| `unit_size_median` | 5.45 ± 0.96 | 4.63 ± 1.16 | **3.22 ± 0.36** 🏆 |
| Mutation Score | **0.93 ± 0.05** 🏆 | **0.94 ± 0.05** 🏆 | 0.88 ± 0.08 |
| `duration_seconds` | **298.40 ± 68.09** 🏆 | 1234.40 ± 267.31 | 4901.56 ± 1191.11 |
| `cost_usd` | **3.47 ± 0.85** 🏆 | 16.38 ± 3.65 | 64.39 ± 16.32 |
| *Production LoC* | 293.90 ± 41.20 | 308.27 ± 36.23 | 575.33 ± 93.19 |
| *Code Mass (APP)* | 721.10 ± 43.97 | 712.67 ± 70.77 | 920.89 ± 103.10 |
| *Test LoC* | 424.90 ± 62.45 | 630.60 ± 232.13 | 451.33 ± 61.09 |
| *`unit_count`* | 16.20 ± 1.62 | 25.87 ± 4.03 | 39.00 ± 5.70 |
| *`mutants_total` / survived* | 133.30 / 9.80 | 135.20 / 8.40 | 160.44 / 19.11 |
| *of those uncovered* | 1.00 ± 1.33 | 4.27 ± 5.79 | 11.56 ± 11.77 |
| *`total_tokens`* | 3.05 M | 21.77 M | 68.44 M |

`cognitive_max`, `cognitive_avg` and `mccabe_max` carry two trophies: the gap between EXACT v1 and EXACT v1.1 (0.07, 0.18, 0.11) is smaller than EXACT v1.1's own standard deviation, so those rows read as no effect between the two EXACT arms. On `mccabe_avg` and the three unit-size rows the gap exceeds it, and EXACT v1.1 wins alone. Mutation Score is shared by Inline and EXACT v1 (0.93 and 0.94); EXACT v1.1 at 0.88 trails EXACT v1 by more than EXACT v1's standard deviation.

### GPT-5.6 SOL — pi

| Metric | Inline (n=5) | EXACT v1 (n=15) | EXACT v1.1 (n=5) |
|---|---:|---:|---:|
| Correctness (external) | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 | **1.00 ± 0.00** 🏆 |
| Completed within budget | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 |
| `cognitive_max` | 6.60 ± 2.07 | 4.07 ± 1.22 | **2.60 ± 0.89** 🏆 |
| `cognitive_avg` | 2.77 ± 0.74 | 1.86 ± 0.35 | **1.24 ± 0.29** 🏆 |
| `mccabe_max` | 8.40 ± 3.58 | 4.73 ± 1.44 | **3.60 ± 0.55** 🏆 |
| `mccabe_avg` | 2.91 ± 0.50 | 1.74 ± 0.27 | **1.37 ± 0.09** 🏆 |
| Smell Total | 0.00 ± 0.00 | 0.00 ± 0.00 | 0.00 ± 0.00 |
| `unit_size_max` | 20.20 ± 3.27 | **17.80 ± 2.93** 🏆 | **15.80 ± 3.56** 🏆 |
| `unit_size_avg` | 7.29 ± 1.23 | 6.14 ± 1.09 | **4.21 ± 0.40** 🏆 |
| `unit_size_median` | 6.70 ± 2.54 | 5.00 ± 1.66 | **3.00 ± 0.00** 🏆 |
| Mutation Score | 0.77 ± 0.04 | **0.863 ± 0.045** 🏆 *(n=14)* | **0.88 ± 0.02** 🏆 *(n=4)* |
| `duration_seconds` | **278.20 ± 40.71** 🏆 | 1573.93 ± 495.01 | 4927.00 ± 610.52 |
| `cost_usd` | **0.60 ± 0.09** 🏆 | 4.67 ± 2.62 | 18.27 ± 3.05 |
| *Production LoC* | 197.00 ± 14.23 | 169.00 ± 34.15 | 265.20 ± 32.51 |
| *Code Mass (APP)* | 770.20 ± 73.72 | 616.47 ± 87.10 | 685.40 ± 63.25 |
| *Test LoC* | 122.60 ± 27.31 | 217.60 ± 78.21 | 266.40 ± 70.77 |
| *`unit_count`* | 16.40 ± 4.83 | 14.60 ± 4.50 | 32.20 ± 4.66 |
| *`mutants_total` / survived* | 204.00 / 47.60 | 128.00 / 17.6 *(n=14)* | 143.00 / 16.8 *(n=4)* |
| *of those uncovered* | 12.20 ± 8.07 | 4.9 *(n=14)* | 4.00 ± 1.41 *(n=4)* |
| *`total_tokens`* | 0.34 M | 6.72 M | 17.52 M |

Smell Total is identical at 0.00 in all three GPT-5.6 SOL cells. There is no contest in that row, so it carries no trophy.

Mutation Score reaches fewer replicates than every other metric in two SOL cells. Both gaps are instrument failures, not workflow outcomes — see [F-1.10.6](#f-1106--two-mutation-cells-lose-replicates-to-the-instrument-not-to-the-workflow).

**Findings**:

- **F-1.10.1** — EXACT Coding lowers complexity and unit size on both models
- **F-1.10.2** — The isolated Refactor subagent buys flatness by producing more code, not simpler code
- **F-1.10.3** — The second structural step is worth more on SOL than on Opus
- **F-1.10.4** — Isolation's budget cost falls only on Opus
- **F-1.10.5** — Cost separates the three methods far more sharply than quality does
- **F-1.10.6** — Two mutation cells lose replicates to the instrument, not to the workflow
- **F-1.10.7** — Mutation Score does not order the methods the same way on both models
- **F-1.10.8** — On Opus the arms miss mutants for opposite reasons

On TypeScript the method lowers complexity and unit size for both models, monotone across the three variants. The isolated refactor subagent buys that flatness by producing more code rather than simpler code, and its second structural step is worth more on the GPT model than on Opus — where isolation's budget cost falls almost entirely. Cost separates the three methods far more sharply than quality does. Mutation Score does not order the methods the same way on both models, and two mutation cells lost replicates to the instrument rather than to the workflow, which bounds how far the test-strength reading travels. Details: [findings.md](research/questions-cross/1.10-exact-coding-typescript/findings.md).

#### 1.11 RQ-exact-coding-rust — On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5?

_Data basis: 30 runs · Coverage: 6/6 cells (100 %) at min_replicates=5._

## Overview

Primary outcome is code quality. Correctness is a guard: a quality number from a cell that failed verification is meaningless, because low complexity is what a stub looks like. Results are reported **separately by model** — the factor is paired (`model_x_workflow`), so a trophy awarded across the model boundary would measure the model, not the method.

**Trophy rules applied here.** Quality and efficiency trophies go only to cells with mean Correctness (external) ≥ 0.90; all six cells clear that gate (lowest: 0.97), so every cell competes. A cell shares the trophy when its gap to the row's best value is below the smaller σ of the two cells. `functions` and `mutants_total` are ambivalent in direction and carry no trophy. `smell_total` on Opus is identically 0 in all three arms: no contest, so no winner.

### Opus 5 (no extended thinking), via Claude Code

| Outcome | direction | `baseline-inline-tdd-v1-cc` | `exact-ptdd-v1-cc` | `exact-ptdd-v1.1-refactor-subagent-cc` |
|---|---|---|---|---|
| Correctness (external) | higher = better | 0.97 | **1.00** 🏆 | 0.99 |
| Code Mass (APP) | lower = better | 1059.6 | **929.2** 🏆 | 1152.0 |
| `cognitive_max` | lower = better | 4.6 | **3.0** 🏆 | **3.4** 🏆 |
| `cognitive_avg` | lower = better | 0.78 | 0.63 | **0.48** 🏆 |
| `mccabe_max` | lower = better | 8.6 | **8.0** 🏆 | **7.2** 🏆 |
| `mccabe_avg` | lower = better | 2.96 | 2.56 | **2.20** 🏆 |
| `longest_function` | lower = better | **28.2** 🏆 | **24.6** 🏆 | **27.8** 🏆 |
| `avg_loc_per_function` | lower = better | 8.75 | 7.93 | **6.84** 🏆 |
| `median_loc_per_function` | lower = better | 7.0 | **6.8** 🏆 | **6.3** 🏆 |
| `functions` | ambivalent | 33.2 | 36.0 | 51.6 |
| Smell Total | lower = better | 0 | 0 | 0 |
| Mutation Score | higher = better | **0.96** 🏆 | **0.98** 🏆 | **0.98** 🏆 |
| `mutants_total` | ambivalent | 101.0 | 117.2 | 128.4 |
| `mutants_survived` | lower = better | **4.0** 🏆 | **3.0** 🏆 | **2.8** 🏆 |
| `duration_seconds` | lower = better | **489.8** 🏆 | 1500 | 6234 |
| `total_tokens` | lower = better | **3.59 M** 🏆 | 27.2 M | 104.7 M |
| `cost_usd` | lower = better | **$3.84** 🏆 | $20.44 | $93.35 |

Rows with three trophies (`longest_function`, Mutation Score, `mutants_survived`) mean "no effect" on Opus: every gap to the best value is below the smaller σ (`longest_function` σ 4.44–7.46, Mutation Score σ 0.01–0.03, `mutants_survived` σ 1.92–3.94). Correctness (external) has σ 0 in `exact-ptdd-v1-cc`, so its 1.00 stands alone even though the other two arms are within 0.03.

### GPT-6 SOL, via pi (openai-codex route)

All three cells sit at Correctness (external) 1.00, so none is gated. That row carries no trophy: three identical values are not a contest, and correctness is a guard rather than an outcome to win.

| Outcome | direction | `baseline-inline-tdd-v1-pi` | `exact-ptdd-v1-pi` | `exact-ptdd-v1.1-refactor-subagent-pi` |
|---|---|---|---|---|
| Correctness (external) | gate, not a result | 1.00 | 1.00 | 1.00 |
| Code Mass (APP) | lower = better | **517.4** 🏆 | 595.2 | 605.6 |
| `cognitive_max` | lower = better | 11.8 | **4.8** 🏆 | 5.4 |
| `cognitive_avg` | lower = better | 4.33 | **2.03** 🏆 | **1.96** 🏆 |
| `mccabe_max` | lower = better | **12.0** 🏆 | **11.8** 🏆 | **13.6** 🏆 |
| `mccabe_avg` | lower = better | 8.24 | **5.72** 🏆 | **5.78** 🏆 |
| `longest_function` | lower = better | **28.6** 🏆 | **25.8** 🏆 | **27.4** 🏆 |
| `avg_loc_per_function` | lower = better | 18.04 | **10.52** 🏆 | **10.72** 🏆 |
| `median_loc_per_function` | lower = better | 18.4 | **8.9** 🏆 | **10.0** 🏆 |
| `functions` | ambivalent | 5.6 | 11.4 | 11.4 |
| Smell Total | lower = better | 0.6 | **0** 🏆 | 0.4 |
| Mutation Score | higher = better | **0.99** 🏆 | **0.98** 🏆 | **0.99** 🏆 |
| `mutants_total` | ambivalent | 77.0 | 101.4 | 86.2 |
| `mutants_survived` | lower = better | **1.0** 🏆 | 2.0 | **1.2** 🏆 |
| `duration_seconds` | lower = better | **281.6** 🏆 | 684.4 | 1430.4 |
| `total_tokens` | lower = better | **318 k** 🏆 | 2.84 M | 2.07 M |
| `cost_usd` | lower = better | **$0.19** 🏆 | $0.94 | $1.04 |

Rows with three trophies (`mccabe_max`, `longest_function`, Mutation Score) mean "no effect": the widest gap in the row is smaller than one σ, so the table's message is that the three arms are indistinguishable on that column. For `longest_function` that gap is 2.8 lines against σ 2.39–3.58.

### Comparability constraints

- **`tdd_discipline` and its Skip-fed columns are not reported across the arms.**
  A Skip is compliance in a test-list workflow and a deviation in an ad-hoc one,
  so `tdd_discipline`, `tdd_discipline_test_first`, `tdd_discipline_closure`,
  `test_first_rate`, `skip_events`, `cycles_total` and `chain_deviations` measure
  the architecture rather than the discipline. The four `exact-ptdd-*` arms write
  a test list up front; the two `baseline-inline-tdd-*` controls do not. Only
  boundary-safe columns are used below: `tdd_discipline_step`, `red_batch_max`,
  `red_batch_size`, `green_batch_size`, `refactor_events`, `cycles_closed`,
  `chain_suite_runs`.
- **Rust quality values do not compare with other stacks.** clippy findings are
  not ruff, PMD or ESLint/SonarJS findings; cargo-mutants scores are not mutmut,
  PIT or Stryker scores. Against the sister RQs only directions and orderings
  are read, never numbers.
- Claim Office only. The sister RQs ran Game of Life as a second kata, so every
  finding below rests on one kata.
- The pi arm runs GPT-6 SOL where the sister RQs ran GPT-5.6 SOL. On the Opus
  arm a direction differing from the sister RQs is a stack effect; on the SOL
  arm it can be a stack effect or a model-generation effect, and this RQ alone
  cannot separate them.

**Findings**:

- **F-1.11.1** — EXACT Coding halves function size on SOL and barely moves Opus
- **F-1.11.2** — The isolated Refactor subagent decomposes further on Opus and not on SOL
- **F-1.11.3** — Isolation's budget cost falls almost entirely on Opus
- **F-1.11.5** — clippy does not separate the methods on this kata
- **F-1.11.6** — Mutation Score is saturated; the mutant population carries what signal there is
- **F-1.11.7** — One test at a time holds in all four EXACT arms and in neither control
- **F-1.11.8** — Three subagent-pi runs lost their phase chain to the recorder, not to the workflow

The structural effect depends on how decomposed the model's untutored output already is. On the GPT model the inline control writes five large functions and the method roughly halves every size and complexity measure; on Opus the control already writes 33 functions and the same method buys a few percent. The isolated refactor subagent decomposes further on Opus and not on the GPT model, and its budget cost falls almost entirely on Opus. clippy does not separate the methods on this kata, and Mutation Score is saturated, so the mutant population carries what signal there is. Details: [findings.md](research/questions-cross/1.11-exact-coding-rust/findings.md).

#### 1.12 RQ-current-models-ptdd — How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route?

_Data basis: 50 runs · Coverage: 10/10 cells (100 %) at min_replicates=5._

## Overview

### Correctness (external) — primary outcome

| Cell | Route | Correctness (external) | σ | the five runs | `tests_passing` |
|---|---|---:|---:|---|---:|
| `opus-5-5-no-thinking` | Anthropic subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `sonnet-5-5-no-thinking` | Anthropic subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `gpt-6-1-sol-codex` | OpenAI subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `gemini-4-argon` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `glm-5-3` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `qwen3-8` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `qwen3-8-flash-next` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `kimi-k3-sference` | Requesty | 0.99 | 0.03 | 0.933, 1.00 × 4 | 5/5 |
| `deepseek-v4-1-flash` | Requesty | 0.80 | 0.45 | **0.00**, 1.00 × 4 | 4/5 |
| `minimax-m3` | Requesty | 0.77 | 0.44 | **0.00**, 0.867, 1.00 × 3 | 5/5 |

Higher = better. Seven trophies are the reading: the field is saturated on this kata. The two cell means below 0.90 are each produced by a **single** failed run out of five — see F-1.12.1 and F-1.12.2, and never quote those two means without the run values beside them.

### Code quality

Means over 5 runs. Lower = better in every column. Correctness-gated: `deepseek-v4-1-flash` (0.80) and `minimax-m3` (0.77) are below the 0.90 gate and take no quality trophy.

| Cell | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `longest_function` | Production LoC | Code Mass (APP) | Smell Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| `opus-5-5-no-thinking` | **2.4** 🏆 | 1.43 | **3.4** 🏆 | 13.0 | 184.8 | 632.4 | 0.0 |
| `sonnet-5-5-no-thinking` | 2.6 | **1.33** 🏆 | 3.6 | 12.6 | 219.8 | 645.4 | 0.0 |
| `gpt-6-1-sol-codex` | 3.0 | 1.47 | 3.8 | **12.0** 🏆 | **130.2** 🏆 | **561.2** 🏆 | 0.0 |
| `qwen3-8-flash-next` | 4.6 | 1.78 | 4.8 | 24.0 | 264.4 | 706.6 | 0.0 |
| `gemini-4-argon` | 4.8 | 1.85 | 4.6 | 23.2 | 325.8 | 713.4 | 0.0 |
| `qwen3-8` | 6.8 | 2.60 | 6.0 | 19.8 | 254.6 | 761.4 | 0.0 |
| `kimi-k3-sference` | 8.6 | 3.46 | 6.8 | 21.8 | 184.8 | 586.8 | 0.0 |
| `glm-5-3` | 9.0 | 3.10 | 8.0 | 24.2 | 273.4 | 819.0 | 0.0 |
| `deepseek-v4-1-flash` | 4.8 | 1.82 | 4.4 | 20.0 | 244.8 | 680.0 | 0.0 |
| `minimax-m3` | 6.8 | 2.60 | 6.0 | 22.8 | 269.0 | 699.0 | 0.0 |

**Smell Total gets no trophy**: it is 0.0 at σ = 0.00 in all ten cells, so there is no contest in that row. On `typescript-vitest` `unit_size_max` is the same measurement as `longest_function` and carries the same numbers in every cell — it is not independent evidence.

**Mutation Score is in `summary.md` but carries no trophy here.** It spans 0.70 to 0.97, and that order tracks how much of each cell's domain its suite reaches in the test process (`mutants_no_coverage` 0.0 to 24.0) as much as how strongly it asserts. Two cells also mix two measurement modes. F-1.12.6 has the counts, the two cells that were measurement artifacts until the instrument was fixed, and the one run that must be excluded from the column outright.

`minimax-m3`'s quality row is not a model profile: one of its five runs stopped after implementing 5 of 48 test-list entries (45 Production LoC, Code Mass 98), which pulls every column of that row toward a stub it never finished. Its σ on Production LoC is 132.05 and on Code Mass 342.93. See F-1.12.2.

### Effort and cost

Means over 5 runs. Same correctness gate.

| Cell | `cycles_closed` ↑ | `refactor_events` ↑ | `tests_total` | duration ↓ | `total_tokens` ↓ | `cost_usd` ↓ |
|---|---:|---:|---:|---:|---:|---:|
| `opus-5-5-no-thinking` | 24.2 | 16.6 | 47.8 | **15.4 min** 🏆 | 24.4 M | $9.79 |
| `sonnet-5-5-no-thinking` | **29.6** 🏆 | 15.2 | 57.6 | 20.0 min | 49.3 M | $14.59 |
| `gpt-6-1-sol-codex` | 25.0 | 19.6 | 48.8 | 36.2 min | 9.0 M | $1.47 |
| `gemini-4-argon` | 25.0 | **20.8** 🏆 | 40.4 | 61.3 min | 13.5 M | $3.48 |
| `kimi-k3-sference` | 17.8 | 5.4 | 40.0 | 20.6 min | **6.0 M** 🏆 | $3.61 |
| `glm-5-3` | 17.0 | 6.2 | 45.4 | 16.5 min | 10.1 M | $3.08 |
| `qwen3-8` | 13.2 | 4.2 | 45.2 | 16.7 min | 11.5 M | $7.80 |
| `qwen3-8-flash-next` | 16.8 | 9.6 | 40.2 | 24.6 min | 16.3 M | **$0.90** 🏆 |
| `deepseek-v4-1-flash` | 20.4 | 9.0 | 44.2 | 20.3 min | 9.6 M | $0.86 |
| `minimax-m3` | 7.6 | 6.0 | 54.6 | 30.1 min | 8.2 M | $0.92 |

`tests_total` carries no trophy — neither direction is better, and the column spans 5 to 91 at run level.

### Confounds (binding on every finding below)

Three axes vary jointly with the model; the RQ README holds the full argument.

1. **Harness and workflow port.** Two cells run Claude Code with
   `exact-ptdd-v1-cc`, eight run pi with `exact-ptdd-v1-pi`. A difference between
   an Anthropic cell and a pi cell is the sum of model, harness and port effect.
2. **The route has a demonstrated quality effect of its own.**
   `RQ-route-effect-pi` F-1.3.6 measured one model (GPT-5.6 Sol) at constant
   harness, workflow, kata and prompt across the OpenAI subscription and Requesty
   at `cognitive_max` 4.0 against 8.0, and showed it is not a reasoning effect.
   The three subscription cells here carry that effect on top of the model effect.
   The commercial-against-open comparison that is free of it runs **within** the
   Requesty route: `gemini-4-argon` against the five open-weight cells (F-1.12.4).
3. **`cost_usd` is a list-price comparison value, never an invoice.** Nothing is
   billed per token on either subscription, and the Requesty cells carry the
   catalogue tariff without workspace discounts. Read `total_tokens` first.

All ten cells run Predictive TDD, so they sit on the **same** side of the test-list boundary and the Skip-fed discipline columns stay comparable within this RQ. They remain incomparable to any ad-hoc-TDD RQ.

**Findings**:

- **F-1.12.1** — Correctness on claim-office is dichotomous per run, not graded per cell
- **F-1.12.2** — The two zero runs are two different drop modes, and `tests_passing` detects neither
- **F-1.12.3** — The workflow flattens the smell axis completely and the complexity axis not at all
- **F-1.12.4** — Within the Requesty route there is no commercial-against-open structure gap
- **F-1.12.5** — `predictions_*` is not a discipline metric on this model generation
- **F-1.12.6** — Mutation Score here measures test architecture as much as suite strength
- **F-1.12.7** — Refactoring frequency splits commercial from open-weight inside the Requesty route
- **F-1.12.8** — The cheapest cell that reaches 1.00 costs a sixteenth of the most expensive one
- **F-1.12.9** — Within one family and one provider, a twelfth of the price loses nothing on this kata
- **F-1.12.10** — `minimax-m3` has no representative mean in any column
- **F-1.12.11** — `tdd_discipline_step` is saturated here; `tdd_discipline` tracks test-list granularity

Correctness here is dichotomous per run, not graded per cell: of 50 runs, 46 score 1.00, one 0.933, one 0.867 and two exactly 0.00, with nothing between 0.00 and 0.867. Cell means below the gate are therefore failure rates rather than capability ceilings — the most available misreading in the whole report. The workflow flattens the smell axis completely and the complexity axis not at all. Price does not order the structure column: the cheapest cell reaching 1.00 costs a sixteenth of the most expensive, and within one family on one provider a twelfth of the price loses nothing. Details: [findings.md](research/questions-cross/1.12-current-models-ptdd/findings.md).

## 5. Cross-RQ Synthesis

1. **Workflow benefit is a function of the baseline, not of the workflow — and that single mechanism reconciles three results that look contradictory.** §4 contains what reads as a flat disagreement: the architecture axis shows a newer model closing most of the quality gap unaided (RQ-architecture-axis-opus5), the following generation shows the gap widening again (RQ-opus55-current-workflow), and the four stack comparisons show effects from 3.5× down to 0.9× (RQ-exact-coding-typescript/java/python/rust). The Python RQ supplies the resolution: the structured column is nearly constant across every stack, model and kata, while the unstructured column varies by a factor of 4.4. There is no language effect and no straightforward model-generation trend — there is a floor, and the distance to it is whatever the model happened to leave on the table. Every one of the three results is a different starting distance.

2. **Correctness saturates almost everywhere, so it is the wrong metric to choose a workflow with — and the metric that replaces it depends on the kata.** Across RQ-tcr-variants-opus5, RQ-tcr-variants-sol, RQ-harness-requesty, RQ-workflow-axis-gpt6-sol, RQ-exact-coding-java and RQ-tdd-workflow-comparison-opus55, every arm reaches Correctness (external) at or near 1.00; in several the internal suite is green in 20 of 20 or 30 of 30 runs. Where correctness does still separate, it does so as a failure *rate* rather than a capability ceiling: RQ-current-models-ptdd finds 46 of 50 runs at exactly 1.00 and two at exactly 0.00, with nothing in between. A cell mean of 0.80 there means one run in five collapsed, not that the model is 80 % capable — and reading it as the latter is the single most available misreading in this report.

3. **The internal suite is a poor witness for the external one, and that gap is where unattended autonomy actually fails.** RQ-fable-vs-opus5 finds one model line whose failures are invisible to its own tests; RQ-spark-vs-sol finds internal tests green in 20 of 20 runs while external correctness drops by a margin far outside the replicate spread; RQ-exact-coding-java finds a suite at Mutation Score 0.811, the weakest in that RQ, whose fifteen acceptance scenarios nevertheless all pass. The direction of the error runs both ways, which is the point: a green suite is not evidence of a correct program, and a passing acceptance run is not evidence of a suite worth keeping. Any single-signal gate — internal only, external only — misses one of the two failure modes documented here.

4. **Price and quality are close to orthogonal, and the expensive axis is isolation rather than capability.** RQ-cost-sol-pi-vs-opus-cc finds a 19× price gap at equal or better correctness on the token-heavy kata; RQ-current-models-ptdd finds a 16× span among cells that all reach 1.00, with price failing to order the structure column at all, and a twelfth of the price losing nothing within one model family on one provider. What does cost reliably is structure: the isolated refactor subagent runs at 2.9× (RQ-tdd-workflow-comparison-opus55), 3× (RQ-workflow-axis-gpt61-sol) and up to 36× the baseline tokens (RQ-architecture-axis-opus5), and RQ-context shows that the second isolation step buys nothing measurable on top of the first. The money goes into context isolation, and only the first isolation step is paid for by a result.

5. **Nothing transfers: not the workflow ranking across models, not the metric ordering across stacks, not the test-list refinement across platforms.** RQ-sol-line-on-opus-cc inverts the ranking of three workflow lines completely between two models at constant kata, prompt style and metric. RQ-workflow-model has two architectures swapping places by model. RQ-test-list-dimensions-replication finds a refinement that empties the sub-0.90 correctness band on one platform, while RQ-test-list-dimensions-sol-pi and RQ-test-list-dimensions-multikata-sol-pi find the same refinement adding a sixth more tests and no correctness on another. RQ-exact-coding-java finds Mutation Score ordering the three methods cleanly in all four combinations, and RQ-exact-coding-python and RQ-exact-coding-typescript find that ordering not reproducing. The practical rule this report can defend most strongly is also its least convenient: a result holds for the model, harness, stack and kata it was measured on, and every transfer is a hypothesis.

---

## 6. Limitations

- **Headless, with no human in the loop.** Every run receives its task once and works to completion or to its budget without asking a single question. Several documented correctness losses — premature self-termination, an incomplete test list, a mis-guessed CLI contract — are exactly the failures one clarifying question would prevent. These numbers bound unattended autonomy and are not a ceiling for supervised use.
- **Synthetic katas, four of them.** Game of Life (training-known, library-shaped), Claim Office (novel, CLI-shaped, deliberately ambiguous), Sphinx Score and Mars Rover. None is a long-lived codebase with existing structure, legacy constraints or a build nobody understands, and the code-quality findings in particular are measured on greenfield code of 30 to 320 Production LoC.
- **Quality values are not comparable across stacks.** SonarJS, PMD, complexipy and clippy produce different finding populations, and Stryker, PIT, mutmut and cargo-mutants generate different mutant populations — PIT's default mutator set being the narrowest. Only directions and orderings are compared across stacks; absolute values are not.
- **Thin cells, and a replicate floor that varies by question.** Most cells hold n=5; `min_replicates` ranges from 3 to 10 across the 45 questions. RQ-stability measured what this costs: at n=3 the full six-workflow ranking is correct in only about 3–37 % of draws, while the weaker claim that one particular workflow leads is far more robust. Treat per-cell means as locating a band, not a value.
- **Four questions are closed with an accepted gap** and are reported at partial coverage: RQ-external-tdd-workflows-opus5 (3 of 4 cells), RQ-stability (5 of 6), RQ-model-quality-cursor (2 of 3, and the cursor-cli line was discontinued), plus RQ-why-block-effect-v6.1 outside this snapshot's scope. Their findings stand on the cells that were filled.
- **`cost_usd` is a list-price comparison, not an invoice.** It answers "what would this have cost via the API" and is computed from token counts at published rates. Several configurations here run on flat-rate subscriptions where nothing is billed per token, and long-context rate steps are deliberately not modelled, making the figures a consistent lower bound.
- **`tdd_discipline` and its relatives are not comparable across the test-list boundary.** A test that arrives already passing is compliance in a test-list workflow and a restart signal in an ad-hoc one, so the metric penalises test-list completeness rather than measuring slack. Those columns are reported within an architecture group only; `tdd_discipline_step`, `red_batch_max`, `refactor_events` and `cycles_closed` are comparable throughout.
- **Routing is a live confound in places.** Third-party models reach the lab through a gateway, and RQ-route-effect-pi shows transport alone moving throughput by 1.63× and the structural profile with it, while reasoning cannot be switched off on one of the two routes. RQ-astra-pi adds that the noise floor of `cognitive_max` is itself route-dependent and on the gateway exceeds most between-cell differences.

---

## 7. Reproducibility

All data and analysis scripts live in the repo:

- `research/questions-{claude,opencode,pi,cursor-cli,cross}/*/README.md` — the research-question definitions reported here (frontmatter with factors/controls/outcomes); `research/{workflow-dev,kata-dev}/*/README.md` holds the two subtrees this report leaves out
- `research/questions-*/*/findings.md` — the persistent finding lists this report's §4 quotes from, and `research/{workflow-dev,kata-dev}/*/findings.md` those of the omitted subtrees
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
| `research/questions-claude/2.3-fable-vs-opus5-current-workflow/findings.md` | RQ-fable-vs-opus5 — How do Fable 5, Fable 5.1, Opus 5 and Sonnet 5 (each no-thinking, on the Claude Max subscription) differ in correctness and code quality on the novel claim-office kata under the current exact-coding baseline workflow? |
| `research/questions-claude/2.3-fable-vs-opus5-current-workflow/runs.csv` | RQ-fable-vs-opus5 aggregated run metrics |
| `research/questions-claude/2.4-opus55-current-workflow/findings.md` | RQ-opus55-current-workflow — Does the maintained EXACT Coding Predictive TDD workflow still change code quality on Opus 5.5 the way it does on Opus 5, and does Opus 5.5 still need it at all compared with a minimal inline-TDD instruction? |
| `research/questions-claude/2.4-opus55-current-workflow/runs.csv` | RQ-opus55-current-workflow aggregated run metrics |
| `research/questions-claude/3.1-workflow-model-interaction/findings.md` | RQ-workflow-model — Does the quality of a TDD workflow depend on the model — is there a universally best workflow, or do different workflows swap places depending on the model? |
| `research/questions-claude/3.1-workflow-model-interaction/runs.csv` | RQ-workflow-model aggregated run metrics |
| `research/questions-claude/4.1-tdd-effect-code-quality/findings.md` | RQ-tdd-quality — How does the workflow structure (from oneshot through iterative to strict TDD with subagents) affect code quality, and does TDD strictness make a difference? |
| `research/questions-claude/4.1-tdd-effect-code-quality/runs.csv` | RQ-tdd-quality aggregated run metrics |
| `research/questions-claude/4.2-tdd-effect-correctness/findings.md` | RQ-tdd-correctness — Does external correctness (verification_pct) differ between TDD workflow variants on the novel claim-office kata? |
| `research/questions-claude/4.2-tdd-effect-correctness/runs.csv` | RQ-tdd-correctness aggregated run metrics |
| `research/questions-claude/4.3-tdd-context-engineering/findings.md` | RQ-context — Which form of context structuring — isolated subagent contexts per TDD phase (subagents-v2), a shared, accumulated single context (single-context-v2), a hybrid with skill-based red/green in the shared context and an isolated refactor subagent (hybrid-v2), or a hybrid with isolated green and refactor subagents alongside a shared-context test list/red (green-refactor-v2) — leads to better code quality? |
| `research/questions-claude/4.3-tdd-context-engineering/runs.csv` | RQ-context aggregated run metrics |
| `research/questions-claude/4.5-architecture-axis-opus5/findings.md` | RQ-architecture-axis-opus5 — Does the TDD architecture axis (inline-tdd-v1 structureless / single-context-v2 single context / hybrid-v2 hybrid / hybrid-v6 current generation) still rank the same way on opus-5 as it does on opus-4-7 — and does the decomposition metric change the answer? |
| `research/questions-claude/4.5-architecture-axis-opus5/runs.csv` | RQ-architecture-axis-opus5 aggregated run metrics |
| `research/questions-claude/4.6-sol-line-on-opus-cc/findings.md` | RQ-sol-line-on-opus-cc — Is the native Sol workflow line (basic-sol-tdd, Predictive TDD, Four Rules refactor) better only on Sol/pi, or does it also beat the opus line on Opus with native Claude Code — and does the APP effect that suppresses decomposition on Sol reproduce there? |
| `research/questions-claude/4.6-sol-line-on-opus-cc/runs.csv` | RQ-sol-line-on-opus-cc aggregated run metrics |
| `research/questions-claude/4.7-external-tdd-workflows-opus5/findings.md` | RQ-external-tdd-workflows-opus5 — Can the inner TDD loop of EXACT Coding be substituted by an externally authored TDD workflow, and what does the substitution cost or buy? Example mapping stays the entry point; only the implement/test/refactor loop is exchanged. Measured on claim-office-example-mapping against the current exact-coding baseline exact-hybrid-v2.4-lab-split-cc — on correctness, code quality, TDD discipline and cost. |
| `research/questions-claude/4.7-external-tdd-workflows-opus5/runs.csv` | RQ-external-tdd-workflows-opus5 aggregated run metrics |
| `research/questions-claude/4.8-tcr-variants-opus5/findings.md` | RQ-tcr-variants-opus5 — How do classic TCR and TCRDD variants affect correctness, code quality, development behavior, and efficiency in autonomous coding agents, and—within TCRDD—does tool-enforced execution with git-gamble differ from native-Git prompt enforcement? |
| `research/questions-claude/4.8-tcr-variants-opus5/runs.csv` | RQ-tcr-variants-opus5 aggregated run metrics |
| `research/questions-claude/4.9-current-ptdd-vs-exact-opus-native/findings.md` | RQ-current-ptdd-vs-exact-opus-native — On native Opus 5, how does the current SOL Predictive-TDD workflow compare with the default EXACT Coding workflow on correctness, decomposition, development behavior, and efficiency? |
| `research/questions-claude/4.9-current-ptdd-vs-exact-opus-native/runs.csv` | RQ-current-ptdd-vs-exact-opus-native aggregated run metrics |
| `research/questions-claude/4.10-test-list-dimensions-opus-native/findings.md` | RQ-test-list-dimensions-opus-native — On native Opus 5, does an independent-dimensions cross-check in the SOL PTDD test-list phase improve external completeness without sacrificing the workflow's efficiency advantage or code quality? |
| `research/questions-claude/4.10-test-list-dimensions-opus-native/runs.csv` | RQ-test-list-dimensions-opus-native aggregated run metrics |
| `research/questions-claude/4.11-inline-refactor-operationalization-opus-native/findings.md` | RQ-inline-refactor-operationalization-opus-native — On native Opus 5, can naming-first and a mandatory inline refactoring trial improve SOL PTDD v1.6 decomposition without paying the isolated-subagent cost of the Opus default? |
| `research/questions-claude/4.11-inline-refactor-operationalization-opus-native/runs.csv` | RQ-inline-refactor-operationalization-opus-native aggregated run metrics |
| `research/questions-claude/4.12-old-vs-new-exact-line-opus55/findings.md` | RQ-old-vs-new-exact-line-opus55 — On Opus 5.5, does the retired EXACT Coding Opus line still decompose more strongly than the maintained Predictive-TDD line, and does isolating the Refactor step into a subagent help or hurt within each line? |
| `research/questions-claude/4.12-old-vs-new-exact-line-opus55/runs.csv` | RQ-old-vs-new-exact-line-opus55 aggregated run metrics |
| `research/questions-claude/4.13-tdd-workflow-comparison-opus55/findings.md` | RQ-tdd-workflow-comparison-opus55 — How do seven TDD workflows compare on correctness, TDD discipline, code quality and cost? Three lines meet on one kata: the maintained EXACT Coding Predictive-TDD pair (with and without an isolated refactor subagent), the retired Opus hybrid pair, and three vendored third-party TDD skills — measured on claim-office-example-mapping × opus-5-5-no-thinking × Claude Code. |
| `research/questions-claude/4.13-tdd-workflow-comparison-opus55/runs.csv` | RQ-tdd-workflow-comparison-opus55 aggregated run metrics |
| `research/questions-claude/5.1-workflow-stability/findings.md` | RQ-stability — How stable are code quality and TDD discipline per workflow across replicates, and under which conditions is n=3 a sufficient replicate count? |
| `research/questions-claude/5.1-workflow-stability/runs.csv` | RQ-stability aggregated run metrics |
| `research/questions-opencode/1.1-model-quality-oc/findings.md` | RQ-model-quality-oc — How do five models reachable via the OpenCode harness (Opus 4.7 via Portkey + four non-Anthropic models from the Portkey catalog) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow? |
| `research/questions-opencode/1.1-model-quality-oc/runs.csv` | RQ-model-quality-oc aggregated run metrics |
| `research/questions-opencode/1.2-model-novel-kata-oc/findings.md` | RQ-model-novel-oc — How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the exact-single-context-v2-testlist-fix-oc workflow? |
| `research/questions-opencode/1.2-model-novel-kata-oc/runs.csv` | RQ-model-novel-oc aggregated run metrics |
| `research/questions-pi/1.1-model-quality-pi/findings.md` | RQ-model-quality-pi — How do the models reachable via the pi harness (Requesty routing) differ in code quality and TDD discipline on game-of-life-example-mapping with the exact-hybrid-v4.2-phase-continuation-pi workflow? |
| `research/questions-pi/1.1-model-quality-pi/runs.csv` | RQ-model-quality-pi aggregated run metrics |
| `research/questions-pi/1.2-model-novel-kata-pi/findings.md` | RQ-model-novel-pi — How do the models reachable via the pi harness (Requesty routing) differ in correctness and TDD discipline on claim-office-example-mapping with the exact-hybrid-v4-cleaned-pi workflow? |
| `research/questions-pi/1.2-model-novel-kata-pi/runs.csv` | RQ-model-novel-pi aggregated run metrics |
| `research/questions-pi/1.3-route-effect-pi/findings.md` | RQ-route-effect-pi — How do transport route and reasoning channel each affect code quality, TDD discipline, throughput and correctness for one and the same model (GPT-5.6 Sol), at constant harness, workflow, kata and prompt style? |
| `research/questions-pi/1.3-route-effect-pi/runs.csv` | RQ-route-effect-pi aggregated run metrics |
| `research/questions-pi/1.4-spark-vs-sol/findings.md` | RQ-spark-vs-sol — On the OpenAI subscription route, how does GPT-5.3 Codex Spark compare to GPT-5.6 Sol on the two native Sol workflows — does the smaller, cheaper-tier model hold correctness and code quality, or does it only look competitive because the workflow carries it? |
| `research/questions-pi/1.4-spark-vs-sol/runs.csv` | RQ-spark-vs-sol aggregated run metrics |
| `research/questions-pi/1.5-astra-vs-pi-references/findings.md` | RQ-astra-pi — On the OpenAI subscription route, how does GPT-6 Astra compare to the strongest references reachable on the pi harness — Sol on the same route, Sol on Requesty in both reasoning states, and Opus 5 on Requesty — at constant harness, workflow, kata and prompt style? |
| `research/questions-pi/1.5-astra-vs-pi-references/runs.csv` | RQ-astra-pi aggregated run metrics |
| `research/questions-pi/1.6-astra-native-sol-line/findings.md` | RQ-astra-native-sol — Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol? |
| `research/questions-pi/1.6-astra-native-sol-line/runs.csv` | RQ-astra-native-sol aggregated run metrics |
| `research/questions-pi/1.7-tcr-variants-sol/findings.md` | RQ-tcr-variants-sol — How do first-party EXACT Coding TCR, classic TCR, and external TCRDD variants affect correctness, code quality, development behavior, and efficiency for SOL on pi, and how do their native-Git and tool-enforced execution strategies differ? |
| `research/questions-pi/1.7-tcr-variants-sol/runs.csv` | RQ-tcr-variants-sol aggregated run metrics |
| `research/questions-pi/1.8-test-list-dimensions-sol-pi/findings.md` | RQ-test-list-dimensions-sol-pi — On GPT-5.6 SOL via pi, does the independent-dimensions test-list cross-check improve the current SOL PTDD default's external completeness without sacrificing its efficiency or product quality? |
| `research/questions-pi/1.8-test-list-dimensions-sol-pi/runs.csv` | RQ-test-list-dimensions-sol-pi aggregated run metrics |
| `research/questions-pi/1.9-test-list-dimensions-multikata-sol-pi/findings.md` | RQ-test-list-dimensions-multikata-sol-pi — Across Game of Life and Sphinx Score on GPT-5.6 SOL/pi, does the v1.6 independent-dimensions test-list cross-check justify its overhead relative to the v1.5 SOL default? |
| `research/questions-pi/1.9-test-list-dimensions-multikata-sol-pi/runs.csv` | RQ-test-list-dimensions-multikata-sol-pi aggregated run metrics |
| `research/questions-pi/1.10-gpt6-sol-vs-gpt56-sol/findings.md` | RQ-gpt6-sol-vs-gpt56-sol — Does GPT-6 Sol match or beat GPT-5.6 Sol on the canonical Predictive TDD workflow (exact-ptdd-v1-pi) — in correctness, code quality and cost? |
| `research/questions-pi/1.10-gpt6-sol-vs-gpt56-sol/runs.csv` | RQ-gpt6-sol-vs-gpt56-sol aggregated run metrics |
| `research/questions-pi/1.11-workflow-axis-gpt6-sol/findings.md` | RQ-workflow-axis-gpt6-sol — On GPT-6 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top? |
| `research/questions-pi/1.11-workflow-axis-gpt6-sol/runs.csv` | RQ-workflow-axis-gpt6-sol aggregated run metrics |
| `research/questions-pi/1.12-workflow-axis-gpt61-sol/findings.md` | RQ-workflow-axis-gpt61-sol — On GPT-6.1 Sol, what does EXACT Coding Predictive TDD buy over a plain inline-TDD baseline, and does isolating the Refactor phase in a subagent add anything on top? |
| `research/questions-pi/1.12-workflow-axis-gpt61-sol/runs.csv` | RQ-workflow-axis-gpt61-sol aggregated run metrics |
| `research/questions-cursor-cli/1.1-model-quality-cursor/findings.md` | RQ-model-quality-cursor — How do the models reachable via the cursor-cli harness (Opus 4.8 medium, Composer 2.5, Grok 4.5 medium) differ in code quality and TDD discipline on game-of-life-example-mapping? |
| `research/questions-cursor-cli/1.1-model-quality-cursor/runs.csv` | RQ-model-quality-cursor aggregated run metrics |
| `research/questions-cross/1.2-harness-requesty/findings.md` | RQ-harness-requesty — How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant? |
| `research/questions-cross/1.2-harness-requesty/runs.csv` | RQ-harness-requesty aggregated run metrics |
| `research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/findings.md` | RQ-cost-sol-pi-vs-opus-cc — How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas? |
| `research/questions-cross/1.3-cost-sol-pi-vs-opus-cc/runs.csv` | RQ-cost-sol-pi-vs-opus-cc aggregated run metrics |
| `research/questions-cross/1.4-opus-cc-vs-pi/findings.md` | RQ-model-quality-cc-vs-pi — Does the code-quality profile of Opus (opus-4-8) differ between the Claude Code and the pi harness, each with and without thinking, at a constant workflow generation (hybrid-v4)? |
| `research/questions-cross/1.4-opus-cc-vs-pi/runs.csv` | RQ-model-quality-cc-vs-pi aggregated run metrics |
| `research/questions-cross/1.5-v3-emergent-tdd/findings.md` | RQ-v3-emergent-tdd — Under a bare 'use TDD' instruction that prescribes no phase markers (inline-tdd-v1), do models actually work test-first and refactor — and how far apart do the models sit once the evidence is hand-validated? |
| `research/questions-cross/1.5-v3-emergent-tdd/runs.csv` | RQ-v3-emergent-tdd aggregated run metrics |
| `research/questions-cross/1.6-test-list-dimensions-replication/findings.md` | RQ-test-list-dimensions-replication — Does the apparent platform interaction between PTDD v1.5 and v1.6 replicate at n=10 per cell on Claim Office, or was it driven by small-sample variance? |
| `research/questions-cross/1.6-test-list-dimensions-replication/runs.csv` | RQ-test-list-dimensions-replication aggregated run metrics |
| `research/questions-cross/1.8-exact-coding-java/findings.md` | RQ-exact-coding-java — On Java 17 with JUnit 5 and Maven, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |
| `research/questions-cross/1.8-exact-coding-java/runs.csv` | RQ-exact-coding-java aggregated run metrics |
| `research/questions-cross/1.9-exact-coding-python/findings.md` | RQ-exact-coding-python — On Python with pytest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |
| `research/questions-cross/1.9-exact-coding-python/runs.csv` | RQ-exact-coding-python aggregated run metrics |
| `research/questions-cross/1.10-exact-coding-typescript/findings.md` | RQ-exact-coding-typescript — On TypeScript with Vitest, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness and code quality for GPT-5.6 SOL and Opus 5? |
| `research/questions-cross/1.10-exact-coding-typescript/runs.csv` | RQ-exact-coding-typescript aggregated run metrics |
| `research/questions-cross/1.11-exact-coding-rust/findings.md` | RQ-exact-coding-rust — On Rust with Cargo, how do inline TDD, shared-context EXACT Coding Predictive TDD, and EXACT Coding with an isolated Refactor subagent compare on correctness, TDD discipline and code quality for GPT-6 SOL and Opus 5? |
| `research/questions-cross/1.11-exact-coding-rust/runs.csv` | RQ-exact-coding-rust aggregated run metrics |
| `research/questions-cross/1.12-current-models-ptdd/findings.md` | RQ-current-models-ptdd — How do the current commercial and open-weight coding models differ in correctness and code quality on claim-office under the maintained EXACT Coding Predictive TDD workflow, each reached over its own native route? |
| `research/questions-cross/1.12-current-models-ptdd/runs.csv` | RQ-current-models-ptdd aggregated run metrics |
| `experiments/runs/` | All run directories with source, transcript, metrics |

