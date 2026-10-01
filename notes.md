# Notes

## v6.5 correctness setback (optimization chain 16.-18.05.2026, rebuild 22.05.2026)

A long quality optimization chain **exact-hybrid-v1-cc → v6.5-lean → v6.5.1-audited → v6.5.2-bullets-cut → v6.5.3-targeted-cuts → v6.5.4-refactor-cut-only** (with v6.6-leaner) ran from **16.05. to 18.05.2026** on game-of-life and improved code quality continuously — v6.5.4 became the "quality champion" (cognitive_max −29 %, 100 % pred rate).

**The setback (discovered 18.05.2026):** The first claim-office verification of v6.5-lean × opus-4-7 showed a `verification_pct` collapse from **1.00 (exact-hybrid-v1-cc) to 0.38 (v6.5-lean)**, broken across the entire follow-up chain (0.36–0.73). The ~5 iterations of quality tuning ran on a workflow that systematically produced wrong results on novel code. Debugging on claim-office was necessary to find the problem at all — measuring the chain on game-of-life only had hidden the break for two days.

### Culprit 1 — skill-creator SKILL

v6.5-lean was rewritten with the `skill-creator` skill (goal: Theory-of-Mind instead of imperatives). Concretely removed/reworded:

- `⚠️ CRITICAL: Skill + Subagent Usage is MANDATORY` → "Why skills are required" rationale block
- `MUST verbatim` instruction for predictions → Why-block on the parser mechanics
- `🚨 INVOKE SKILL` / `DO NOT write...` → plain invoke instructions
- Checklist + "Remember" section + TDD pep removed
- Four Rules of Simple Design + Integration-with-Project-Standards removed from refactor.md

Parser-wise everything safe (no markers destroyed). Behavior-wise: break. **Lesson: "parser-safe" ≠ "behavior-neutral".**

### Culprit 2 (independent) — test-list-scope-fix

In parallel, v4 vs v4.1 had shown that `commands/test-list.md` with the scope "base functionality ONLY / 3-6 tests" enforces too little coverage; v4.1 uses "cover every rule/example/❓ + expected values". The same fix had to be ported into the new v6 base (`exact-hybrid-v2-testlist-fix-cc`) — otherwise a fixed-vs-unfixed confound in RQ 4.x.

### Cleanup run (new long optimization run)

- Old v6.5 chain → `experiments/workflows/_archive/` (lookup ignores the `_` prefix)
- Old RQs (2.x/3.x) → `research/_archive/workflow-dev-v1/` (this archive was deleted on 2026-08-11 in `953841cb`; only reachable via the Git history)
- New base `exact-hybrid-v2-testlist-fix-cc` = exact-hybrid-v1-cc + test-list-scope-fix (diff = only 2 files: `test-list.md` + two "BASE FUNCTIONALITY ONLY" leftovers in `tdd.md`)
- Recipe of every old cut in `research/workflow-dev/v6-reduction-recipe.md` for re-application on the repaired base
- New RQs `1.1-pep-effect-v6.1` … `1.5-why-block-effect-v6.1` re-validate the cuts in isolation on the new base, **with** claim-office smoke (started 23.-24.05.2026)

### Lessons

1. **Do not let skill-creator loose on workflow prompts blindly.** "MUST"/"CRITICAL"/imperatives act as behavior-bearing in TDD workflows, not just as pep — removing them can destroy correctness on novel code without markers or game-of-life metrics noticing anything.
2. **Avoid bundle jumps.** v6.5-lean bundled 4 individual cuts + Why rewrites + the Project-Standards cut in **one** step → culprits only isolatable through re-testing. Roll them out one at a time.
3. **Every reduction iteration needs a claim-office smoke (n≥3)**, even if the RQ primarily studies code quality. Game-of-life only is methodologically insufficient.

## Opus 4.6 ≠ Opus 4.7 on workflows (forced switch from ~16.05.2026, RQ 3.1 evaluated 22.05.2026)

The working assumption was: Opus 4.6 and 4.7 deliver fundamentally the same results on the workflows, just shifted (4.7 stronger). Hence a temporary model switch should not have distorted the workflow findings.

**Not true** (RQ 3.1 / `research/questions/3.1-workflow-model-interaction/`, F-workflow-model.1): v4 and v6 **swap places depending on the model** on `verification_pct` (claim-office-example-mapping):

| Workflow | opus-4-7 | opus-4-6 |
|---|---:|---:|
| exact-subagents-v1-cc | 0.67 | **0.93** |
| exact-single-context-v1-cc | 0.87 | 0.87 |
| exact-hybrid-v1-cc | **1.00** | 0.68 |

Mechanism (F-workflow-model.2): exact-hybrid-v1-cc delegates orchestration to the model (skill invocation in the shared context) — 4.7 masters that, 4.6 loses the claim half in ~40 % of runs. v4 gives each phase an explicit subagent prompt — supports 4.6, makes 4.7 "overcreative" on ambiguities.

**Why the switch was necessary at all:** Portkey only had 4.6 available at that time. My Direct-API 4.7 account was used up by the **weekly rate limit** after 2-3 days of active v6.5 optimization work (15.-18.05.) — first Portkey 4.6 runs started on 16.05., full switch from 19.05. (claim-office verification ran only on Portkey 4.6). 4.7 access only again from ~22.05. Workflow work under time pressure forced the switch.

**Consequence:** A model switch within a workflow optimization chain is **not a free substitution**. Pinning the model belongs to the methodology of these RQs; a forced switch must be documented as a confound, not as "keep working with the second-strongest Opus". Practical recommendation per model is now in `research/workflow-dev/model-recommendation-matrix.md`.

**Lesson for capacity planning:** The weekly rate limit on Direct-API 4.7 is real and hits within 2-3 days when actively reducing/optimizing. For workflow work that strictly needs 4.7: either plan a capacity buffer or clarify in advance whether Portkey offers the required model version — otherwise the situation forces methodology compromises.

## n=3 too small, "reliable from n=?" (consolidation from RQ-stability of 15.05.2026)

Practical observation: n=3 is **not conclusive** in many cells — means flip between repetitions, individual runs dominate the statistics. n=5 is considerably better, but still not robust everywhere.

**What the data from RQ-stability (`research/questions/5.1-workflow-stability/`, n=10 per cell, opus-4-7-no-thinking, game-of-life) say:**

- **F-stability.3:** At n=3, the *full* workflow ranking matches the n=10 truth in only **15-62 %** of cases (1000 trials subsampling):
  - `code_mass` 15.9 %, `smell_total` 25.2 %, `cc_longest_function` 23.6 %, `mccabe_max` 62.5 %, `cognitive_max` 50.5 %.
  - v4 as "best" is robustly detectable (>90 %), the middle field (v1/v2/v5) cannot be separated with n=3.
- **F-stability.5:** For tail characterization (P95/P99 of tokens/wallclock) even n=10 is too tight; **n=30+** would be needed.
- **F-stability.7:** `mutation_score` σ small enough that n=5-7 suffices; v5 is an outlier (σ=0.036, range 0.84-0.97 → n≥10).

**Rule of thumb (from the existing subsampling data, GoL/4-7):**

| Claim type | Required n |
|---|---|
| "Workflow A is the winner" with a large gap (factor ≥3 in μ) | n=3 suffices |
| Three-workflow comparison, middle field | n≥7 |
| Full ranking over 5+ workflows | n=10 already shows residual uncertainty |
| Tail quantiles (P95/P99, worst-case budget) | n≥30 |
| High-σ workflows (v5 on tokens, v5 on mutation_score) | n≥10 |
| Correctness smoke (binary, claim-office under exact-hybrid-v1-cc) | n=3 suffices if all green; with a mix, n≥5 is required |

**What is open:** The subsampling answer ("from which n is it reliable") is **model-, kata- and metric-specific**. RQ-stability data apply to opus-4-7-no-thinking × game-of-life × code complexity. Transfer to claim-office (correctness) and other models has not been measured — caveats (a)/(b) in the RQ README document this.

**Consequence for practice:**
- Default for new RQs: `min_replicates: 5` instead of 3. n=3 only for binary sanity checks ("does it run green at all?").
- For small expected effects or comparisons in the middle field: plan n=7-10.
- For tail claims (budget planning, worst-case latency): n=30+ or mark explicitly as a "rough estimate".
- Be careful with workflow optimization iterations at small n — F-stability.3 shows that middle rank changes between iterations can be pure sampling artifacts (relation to the v6.5 setback above: there v6.5.3 supposedly won with n=1, but was statistically empty).

## v4 wallclock × single-shard requirement = slow going (acute during v6.5 optimization 16.-22.05.2026)

exact-subagents-v1-cc is the most expensive workflow on wallclock: typically ~14 min/run, worst case **~65 min/run** (RQ-stability F-stability.5, wallclock σ=984 s, single run 3923 s = 5× median). Reason: four phases (test-list/red/green/refactor) as isolated Task subagents, each with its own context cold start.

**Sharding constraint:** Direct-API batches must run single-shard ([[feedback-direct-single-shard]]) — otherwise a rate-limit hit loses all parallel containers synchronously (backoff 60 s → 5 min → 30 min → 1 h → 2 h). The risk of losing many runs is especially high with v4, because every lost run is expensive to redo.

**Consequence for a v4 RQ cell (n=5):**
- Sequential: 5 × 14 min = **70 min** typical, worst case 5 × 65 min ≈ **5.4 h**.
- Plus subagent heavyweight (~2.5 M tokens/run) eats the weekly rate limit twice as fast.
- Several models/prompts in one RQ → easily **days** of wallclock per refill.

**Practical pain:** long waiting windows (often several hours until the next intermediate result), no parallel progress, every rate-limit hit adds 1-2 h. In the v6.5 setback (above) this additionally forced the model switch to Portkey 4.6 — which in turn distorted the workflow findings (see the Opus 4.6 vs 4.7 block).

**Lessons / mitigations:**
- Plan v4 cells early, not at the end of an RQ pipeline; when delayed, v4 blocks the whole RQ.
- If the RQ allows it: move v4 cells to the Portkey variant (`opus-4-7-no-thinking-portkey`), then shard. Check in advance whether the exact model version is available on Portkey (see the Opus 4.6 vs 4.7 block — a model switch within an RQ is not free).
- When raising n (see the previous block), mind the v4 multiplier: n=10 for v4 Direct = a very large time budget. Possibly leave v4 at a lower n, others higher.
- Avoid v4 workflow iterations if the change does not specifically concern v4 — test the same reduction on v5/v6 first (shorter wallclock), then verify v4 specifically.

## Kata rework — from training-known trivial katas to novel + external verification (April-May 2026)

The starting point of the whole rework was: the original kata selection was methodologically weak. Three chained problems:

**(1) Trivial katas → one-shot instead of TDD measurement (dropped on 04.05.2026):** string-calculator and pixel-art-scaler were so small (string-calculator ~3 LoC solution) that all workflows — including baseline-oneshot-v1-cc — could one-shot them correctly. So they measure no TDD effect: every workflow reaches 100 % correctness, smell counts are 0, no signal between the cells. Additionally, never-run katas (chimera-score, diamond, word-score) removed. Reduction 137 runs → 68 runs.

**(2) Training familiarity → solution bias (game-of-life is training data):** Game of Life is one of the best-known katas; the canonical solution is in the training data of practically every LLM. Consequences:
  - Workflow effects can be masked by a "model already knows the solution" bias — baseline-oneshot-v1-cc works unusually well on GoL.
  - TDD hints in prompts act as triggers (data poisoning); therefore **10.04. TDD hints removed**, **02.05. vitest hints removed as well**.
  - **Still usable** for studies that control for exactly this bias or are not affected by it: code quality comparisons (shape of the solution) at a constant kata, reduction validations (bias constant across iterations).
  - **Unsuitable** for correctness claims about "can the workflow do novel code?" — that requires novel katas.

**(3) Internal tests are not reliable enough — external verification suite needed:** The run's internal Vitest measures whether the model gets its own tests green, not whether the solution is correct. Observed failure pattern: the model writes tests only for the easy half of the spec, implements only that half, all tests green — but Correctness (external) is 50 %. `tests_passing = true` at `verification_pct = 0.5` is real (see RQ 3.1 / claim-office, where opus-4-6 completely omits the claim half in ~40 % of the v6 runs; `tests_total` 19-23 because internal tests only cover quote).

**Solution: claim-office kata + verification suite (08.05.2026):**
  - Purpose-built insurance domain (HPSMV/MHPCO), guaranteed not in training data.
  - CLI-based (stdin/stdout JSON), two operations (`quote` + `claim`) with constructed ambiguities.
  - External verification suite (`experiments/katas/claim-office-verification/`): 15 scenarios `*.input.json`/`*.expected.json` (+ stories), runs on the host after the container run, the agent never sees the suite.
  - Generic mechanism for CLI katas (`runner.json` + `scenarios/`); added for the GoL CLI analogously (13.05./14.05.).
  - Metric `verification_pct` (float 0.0-1.0) as an external correctness measure **in addition to** `tests_passing`.

**Lesson:** Without external verification, the v6.5 quality wins would have counted as methodologically clean — the correctness break (see the first block) only became visible because claim-office has an external suite. On game-of-life only (internal tests), all v6.5.x were green.

**Active kata roles (as of 24.05.2026):**

| Kata | Property | Suitable for |
|---|---|---|
| `claim-office` | novel, external verification suite | correctness measurement, workflow smoke on novel code |
| `claim-office-lite` | novel, reduced suite (10 scenarios) | code quality on novel code (not for correctness — saturates/collapses depending on style) |
| `game-of-life` | training-known, external suite | code quality, reduction validation (controlling the bias) |
| `mars-rover` | training-known | hardly used so far |

**Consequence for RQ design:** Kata assignment explicitly by research question (see CLAUDE.md): claim-office → correctness, game-of-life → code quality. Never measure workflow optimizations purely on game-of-life without a claim-office smoke (lesson from the v6.5 setback).

## No RQ discipline at first → full-matrix trap (February 2026, RQ structure introduced 04.05.2026)

In the initial phase (February 2026) there were no explicitly formulated research questions. Instead, the attempt was to **combine all parameters with all others** — workflows × katas × prompt styles × models × n=3 replicates as one big matrix run. Resulting order of magnitude of the full matrix:

```
7 Katas × 3 Prompts × 5 Workflows × 2 Models × n=3 = 630 Runs
```

Actually run were ~235 runs (old study, as of 11.02.2026, archived in `old_runs/all-runs-statistics-*.md`) — the full 630 matrix was never completed. With the Direct-API weekly rate limit (see the Opus 4.6 vs 4.7 block above: ~2-3 days of active work, then weeks of waiting), 630 runs would have needed **several weeks of wallclock** — adding v4 (~14 min typical, 65 min worst case) and the single-shard requirement (see the v4 wallclock block) would have stretched that several times over again.

**What goes wrong with a full matrix without RQ discipline:**
- **Wrong variety of questions:** A matrix answers no specific question, but delivers an n-dimensional table that mixes every possible interaction effect. Without an RQ it is unclear which confounds would need to be controlled.
- **Costs scale multiplicatively:** Every additional factor level costs ×N runs. An isolated question ("workflow effect at fixed model and kata") costs 5×3 = 15 runs instead of 630.
- **Findings cannot be attributed cleanly:** In the 235-run set, 21 findings were extracted from the data after the fact (`research/_archive/findings-validation-2026-05-04/old-findings.md`, deleted in `953841cb`). On 04.05.2026 these had to be laboriously distributed to new RQs and re-validated against fresh data (✅ holds / ⚠️ revised / ❌ discarded / 🚫 not testable per finding).
- **The trivial-kata share stays invisible:** If pixel-art-scaler and string-calculator carry the same weight in the matrix as game-of-life, they dominate the means and mask real workflow differences (lesson from the kata block above).

**Turnaround on 04.05.2026 — RQ-driven structure:**
- Five initial RQs introduced, each with an explicit factor + controls + outcomes list in the frontmatter.
- `batch-plan-from-rq.py` generates only the runs needed for the respective RQ (typically 15-50 instead of 630).
- `aggregate-by-query.py` pulls runs from the flat pool that match the RQ selector — reuse of runs across RQs is explicit.
- Findings are kept per RQ, not as a master table.
- Pre-existing 235-run data in `research/_archive/findings-validation-2026-05-04/`, old findings re-evaluated and distributed to RQs (directory deleted in `953841cb`; the methods overview from it is still available as `research/reports/experiment-overview-v2-2026-05-04.md`).

**Lesson:** Before every refill, **formulate the RQ first** (question + one factor + controls + expected outcomes), then generate a minimal plan. Full-matrix thinking is practically infeasible with a rate-limited API and yields methodologically weaker findings than targeted individual RQs. Compute factor product × n × v4 wallclock in advance — if > 1-2 days of wallclock, cut the RQ narrower or move to Portkey routing.

## Recurring measurement bugs → silent zero values in metrics (ongoing topic Feb-May 2026)

Recurring over the entire project duration: individual metrics show 0 or null, **sometimes correctly** (the workflow really does not measure the phase), but **mostly a measurement bug**. Characteristic: the bug does not scream — batches run through cleanly, aggregation produces numbers, just wrong ones. Detection only works via sanity checks (sudden steps between workflows / versions / container builds) or through RQ findings that look too strange to be real.

**Bug classes that actually occurred (chronological, a selection of the instructive cases):**

| Date | Bug | Symptom | Cause | Consequence |
|---|---|---|---|---|
| 02.05.2026 | Transcript JSONLs not copied into run dir | TDD metrics null in 91/93 runs (smart-subset) | `save_transcript()` missing in `run-batch.sh` | post-hoc enrich needed |
| 02.05.2026 | ESLint+SonarJS not installed in the container | `smell_*=0` in 89/89 runs | `package.json` heredoc without eslint deps | retrofitted post-hoc, later baked into the image |
| 03.05.2026 | Rate-limit false positive | runs marked as rate-limited | timestamp `backup.<ms>.json` contained the digit sequence `429` | match pattern on `\b429\b` + `claude_exit != 0` |
| 09.05.2026 | awk PCRE in the container | `cc_functions=0` in **all** container runs | analyze-run.sh used `\s`/`\w` (PCRE), container `mawk` only POSIX | fix POSIX classes + `gawk` as a double safeguard |
| 09.05.2026 | v3 phase inference missing | `cycle_count`/`refactorings_applied=0` for v3 | no phase extractor for inline TDD (no skill, no subagent) | new `infer_phases_from_tool_sequence()` |
| 09.05.2026 | v5 predictions regex | `predictions_correct=0` | plan patch emitted `✅ Correct`, regex only matched `- Correct` | `(?:-\|✅\|❌)` as alternative; v5 runs rerun |
| 09.05.2026 | v4 predictions compliance | v4 ~0.7 predictions/cycle vs. v5 ~2.0 (compliance artifact, not a discipline signal) | v4 `red.md` Step 7 had only one prediction line + no "MUST verbatim" | Step 7 + subagent spawn templates extended; v4 runs rerun |
| 10.05.2026 | claim-office cc_* only from `cli.ts` | single-file aggregation hides multi-file code | analyze-run.sh did not aggregate over all non-spec `.ts` | multi-file aggregation + new field `median_loc_per_function` |
| 10.05.2026 | `tests_passing` grep `"passed"` matched `"X failed \| Y passed"` | tests_passing=true with actually red tests (2 runs affected) | grep without Vitest summary anchor | match on `^\s*Tests\s+.*passed` AND not `failed` |
| 10.05.2026 | Container pnpm 11 blocks esbuild build | `tests_passing=false` in 27 actually green runs | pnpm@latest=11 + `ERR_PNPM_IGNORED_BUILDS` | `pnpm.onlyBuiltDependencies` in templates; pnpm 9.15.9 pin |
| 12.05.2026 | `cli_built=false` artifact | claim-office runs without CLI marked as test failure | prompt did not enforce `src/cli.ts` hard enough | prompt hardening + nudge in analyze-run |
| 14.05.2026 | analyze-run did not install pnpm deps automatically | tests_passing=null on reanalysis of old runs | missing `node_modules` → vitest crash | auto-install in analyze-run.sh |

**Structural causes (recurring, not date-specific):**

- **Workflow marker missing → silent zero** (see `experiments/workflows/MARKERS.md`): Four hardcoded markers drive all TDD metrics. If one is overlooked during a workflow edit, the batch runs cleanly, aggregation shows the column as 0 — no error signal. Reading `MARKERS.md` as a pre-edit check is mandatory.
- **Container ≠ host:** Tools in the container (`mawk` instead of `gawk`, a different `pnpm`, no host `~/.claude`) must be pinned explicitly. Bugs appear in container runs, not in the local test.
- **Workflow change alters metric output:** The v4/v5 examples show that the same parser regex produces different hit rates depending on the workflow generation. Workflow and analyze-run changes are versioned together — cross-version comparisons need a pipeline audit.

**Debug pattern (what has worked repeatedly):**

1. **Spot check before aggregation:** `jq '.summary_metrics + .final_metrics | {cycle_count, refactorings_applied, predictions_correct, predictions_total, tests_passing}'` on the latest run. The block addition is necessary: the four TDD markers live in `summary_metrics`, only `tests_passing` in `final_metrics` — `.final_metrics` alone returns four `null`s and makes healthy runs look broken. Healthy for TDD workflows: `cycle_count≥3`, `refactorings_applied≥1`, `predictions_total ~ 2 × cycle_count`. Everything 0 → bug or a real workflow failure.
- 2. **"Sudden steps" diagnosis:** If metric X drops abruptly to 0 between two workflow versions / container builds, it is almost always the pipeline, not behavior.
3. **Check the pipeline first, then believe the finding:** Before concluding "v4/v5 suddenly behaves differently", always check the `analyze-run.sh` diff and the container image diff against the last healthy state (also stated this way in MEMORY.md).
4. **The run completion signal is `metrics.json | jq .run_status.exit_reason`**, not the existence of `analysis-report.md`. Otherwise data loss when cleaning up unfinished runs.

**Lesson:** The measurement pipeline is as much a research object as the workflow. Every pipeline fix invalidates the previously collected values of the affected metric — either rerun or mark explicitly as "before fix X". Silent zeros are the most expensive bug type, because they never appear as errors, only as "the workflow is just weak here".

## Claude Code CLI version pinning hell (February-May 2026, current pin 2.1.107)

Every CLI version bump breaks something different, and the symptom is never a clear error. Concrete incidents:

- **2.1.37 (February 2026):** Hangs indefinitely on `claude --print` when the cwd contains a `.claude/agents/` directory (exact-subagents-v1-cc workflow). Symptom: `run.log` 0 bytes, exit 124 after timeout. Affects Haiku, Sonnet, Opus equally — so not a model issue but a CLI bug. Days lost with wrong "model is broken" hypotheses before the CLI was clear as the culprit.
- **2.1.126 (end of April):** Regresses; wants `~/.claude.json` as a file (sibling of the `.claude/` directory), which we do not provision → silent exit without output. Again no error signal, only empty output.
- **2.1.107 (current pin):** Verified: smoke test v3+Sonnet 28 s, v4+Opus-4.7+thinking 569 s — all OK.

**Lesson:** On image rebuild **always** run `docker compose build batch && docker run --rm --entrypoint claude docker-batch --version` for verification, then a v3 smoke + v4 smoke (v4 has the subagent code path that was hit by CLI bug 2.1.37). Do not check in a version bump without this end-to-end test. CLI version errors present as silent hangs / empty output — the pattern "it runs, but the result is null" applies here too (see the silent-zero block above).

## Workflow-pipeline coupling → forced reruns (09.05.2026)

Workflow definition and metric parser are coupled. If the parser regex changes, the workflow must produce the format it expects — and vice versa. Concretely affected on 09.05.2026:

- **v4 predictions compliance:** v4 `red.md` Step 7 had only **one** prediction line + no "MUST verbatim". Result: v4 marked ~0.7 predictions/cycle vs. v5 ~2.0. The supposed v4-vs-v5 discipline difference was a pure compliance artifact, not a behavior signal. The fix required a **rerun of all v4 runs** for valid prediction comparisons.
- **v5 predictions regex:** The plan patch produced the `✅ Correct` format, the regex only matched `- Correct` (v4 style). Fix `(?:-|✅|❌)` as alternative, workflow file extension for two prediction lines — **rerun of all v5 runs** needed.

**Double costs:** The pipeline fix itself is cheap (minutes of code change), but the invalidated runs must be run again completely. With the v4 wallclock multiplier (see the v4 block above) and the Direct-API single-shard requirement, that was several days of rework per fix. Before-values remain in the run dirs and must be marked explicitly as "before pipeline fix X", otherwise they contaminate later aggregations.

**Lesson:** Pipeline fix costs include the rerun, not just the code change. For plan changes to the workflow that affect the output format, clarify before committing: which metrics are invalidated, which runs must rerun, is the fix worth it at all given the required wallclock? For v4 reruns: verify on v5/v6 first (shorter wallclock), v4 only selectively at the end.

## Container setup trap: host `~/.claude` makes the container hang silently

The first container runs hung indefinitely (symptom: `run.log` 0 bytes, timeout after 1800 s). Cause not immediately visible — the container builds cleanly, starts cleanly, just no output.

**Cause:** The default bind mount would pass the host `~/.claude` into the container. The host `settings.json` contains fish MCP spawns + host paths in `additionalDirectories` → no fish available in the `node:22-slim` container, MCP init hangs silently without an error. Similarly: a `.credentials.json` symlink with host-absolute paths points to nothing in the container.

**Fix:**
- Dedicated `experiments/docker/claude-config/` directory mount, checked in with a native `settings.json` (`mcpServers: {}`).
- `.credentials.json` via a **separate bind mount** (`~/.claude/.credentials.json:/home/experimenter/.claude/.credentials.json`), not as a symlink in the config dir.
- Override vars for local debugging: `CLAUDE_CONFIG_DIR=~/.claude` / `CLAUDE_CREDENTIALS_FILE=...`.

**Lesson:** Container environment ≠ host environment, even if both are "Linux". Host configs with tool spawns (fish, MCP servers, IDE hooks) assume the tools are available — in the minimal container they are not, and the result is often a silent hang instead of an error. The container needs its own minimal config, checked in and versioned.

## Kata construction is harder than expected (HPSMV pre-test findings, 08.05.2026)

The first claim-office version (HPSMV) had two anti-pattern blunders that would have landed in the study without a systematic pre-test:

- **Input schema gave away the reading:** The original `existingContracts` field in the input JSON pinned the customer-related reading of "first insurance" (the customer had no contract before) — and effectively excluded the alternative item-related reading (there was no contract yet for this item). The constructed ambiguity was in the prompt text, but already decided by the schema. The field had to go, making the input neutral.
- **Numerical inconsistency:** The bonus price of 80 G was described as a "surcharge", but with a 3 × 25 = 75 G base it was only a 5 G surcharge — no recognizable bonus effect. Corrected to 60 G (= 80 G total). It would have passed as a "no effect" finding, when in truth the number was chosen wrongly.

**Detection:** Pre-test script `kata-builder/ambiguity-probe/probe.py` — sends rule+question to Opus/Sonnet/Haiku (with/without thinking) × n=5 at default temperature, classified manually by reading the raw answers. Without this pre-test the blunders would have landed in the study.

**Lesson:** Kata creation is not finished when the prompt is written. A pre-publish checklist is needed (methodology in `kata-builder/kata-construction.md`):
- The input schema gives away no reading — watch for field names that pin an interpretation.
- Check numerical consistency — compute all values; bonus/surcharge/discount must also do numerically what the language promises.
- Pre-test with n≥3 models, read the classified answers, do not just count the pass rate.
- Avoid signpost vocabulary ("im Zweifelsfall", "kann beeinflussen", "in jedem Fall", "ausgenommen") — it antagonizes the model instead of constructing ambiguities.
- Task coherence: all operations on a shared state, no lifecycle operation whose only purpose is an ambiguity.

## Tooling tracking trap: `nohup ./batch.sh &` with `run_in_background:true`

When starting long batches, it is tempting to combine `nohup ./batch.sh <plan> &` with the tool parameter `run_in_background: true` — it feels like "doubly safe in the background". In fact: the `&` returns immediately, the tool reports "completed" after seconds, although the container keeps running. Tracking lost.

**Consequences:**
- The tool reports supposed "success" although the batch runs for hours more.
- Status checks via the Bash tool no longer work — the original process is dead, the container kept running.
- Happened several times: I (Claude) thought the batch was finished and kept working on the run dirs while fresh runs were still being produced.

**Correct:** Call `./batch.sh <plan>` directly with `run_in_background: true` (without nohup, without `&`). Then the tool tracks the `docker compose run` process correctly until the batch ends. Status during the run via `docker logs -f docker-batch-run-<hash>` or `tail -f experiments/docker/batch.<plan>.log`. Stop via `docker stop docker-batch-run-<hash>`.

**Lesson:** Do not apply tool mechanics and shell mechanics twice. If the harness offers "run in the background", do not additionally build `nohup`/`&` into the command — the concepts overlap destructively and the losing information is always the tracking.

## Reanalyze discipline after a pipeline fix (ongoing risk)

A pipeline fix invalidates affected metrics in all previously run runs. Whoever simply keeps going after the fix and collects new runs creates **mixed cohorts** (old with wrong value, new with correct value) — aggregation smooths them into nonsensical means and produces findings that nobody can reproduce.

**Variants that occurred repeatedly:**
- analyze-run.sh multi-file fix (10.05.): claim-office cc_* values differ before/after the fix → older runs showed only cli.ts, new ones showed the multi-file aggregate. Without reanalyze, claim-office aggregations before 10.05. were systematically too low.
- Container pnpm 11 bug: 27 runs from 10.05. with `tests_passing=false` although actually green — if not explicitly reanalyzed, they would have slipped into the findings as "workflow X does not pass the tests".
- v4/v5 predictions regex/compliance (09.05.): reruns needed instead of reanalyze (the workflow now produces the format differently) — a different class of pipeline fix.

**The `/reanalyze` skill exists precisely for this:** re-run of the analysis pipeline on all runs that match an RQ, reaggregation, findings update proposal. But it was not routine from the start — early pipeline fixes were repeatedly forgotten to be propagated.

**Lesson:** The pipeline fix workflow is always three-stage: (1) check in the fix, (2) `/reanalyze` the affected RQs OR an explicit rerun (if the fix changes the output format), (3) findings update with a note on the invalidated before-values. Step 2 is skipped most often under time pressure — precisely then the rule is: a fix without reanalyze is not a fix, but a new data source.
