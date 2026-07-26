---
id: RQ-model-novel-oc
question: "How do five models reachable via the OpenCode harness differ in correctness and TDD discipline on claim-office-example-mapping with the v5.1-testlist-scope-fix-oc workflow?"
factors:
  model:
    - opus-4-7-portkey
    - kimi-k2-6
    - minimax-m2-7
    - gemini-3-5-flash
    - glm-5-1
    - mistral-medium-3-5
    - deepseek-v4-flash
    - deepseek-v4-pro
controls:
  workflow: v5.1-testlist-scope-fix-oc
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: correctness (external) — claim-office has an external verification suite
  - verification_pct
  - verification_passed
  - verification_total
  # secondary: code quality
  - code_mass
  - cognitive_max
  - mccabe_max
  - cc_longest_function
  - lines_of_code
  - smell_total
  # tertiary: TDD discipline (v5.1-oc provides these thanks to parse_opencode_transcript)
  - cycle_count
  - refactorings_applied
  - predictions_correct
  - predictions_total
  # context
  - tests_passing
  - tests_total
  - completed_within_budget
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-model-novel-oc: Model effect on a novel kata (OpenCode harness)

## Motivation

Parallel to RQ-model-quality-oc (game-of-life, code quality), but on the harder axis: **spec comprehension and completeness of the implementation**. `claim-office-example-mapping` is a novel kata with five deliberately constructed ambiguities and an external verification suite (15 scenarios) — not a pure training-recall exercise like game-of-life.

RQ-model-novel (CC side) has shown that `verification_pct` on claim-office differentiates models more strongly than any code-quality metric on game-of-life. This RQ transfers the test to the OpenCode side with five new models and the v5.1 workflow (TDD with skills).

## Existing data (as of 2026-05-25)

Available from routing smokes (n=1 per cell, count toward `min_replicates`):

| Model | verification_pct | tests | cycles | preds | done | Wallclock |
|---|---|---|---|---|---|---|
| opus-4-7-portkey | 1.00 (15/15) | 36 | 2 | 4/4 | ✓ | 12 min |
| kimi-k2-6 | 1.00 (15/15) | 46 | 3 | 0/0 | ✓ | 32 min |
| minimax-m2-7 | 0.00 (0/15) | 37 | 1 | 0/2 | ✓ | 35 min |
| gemini-3-5-flash | 1.00 (15/15) | 32 | 2 | 0/0 | ✓ | 8 min |
| mistral-medium-3-5 | — | — | — | — | — | — (no smoke yet; via Portkey `@mistral/mistral-medium-3-5`) |
| deepseek-v4-flash | 0.00 (0/15) | 53 | n/a | n/a | ✓ | 28 min |
| deepseek-v4-pro | 0.00 (0/15) | 26 | n/a | n/a | ✓ | 21 min |

Notable: MiniMax writes 37 of its own tests and makes them green, but fails all 15 external verification scenarios — a classic spec-misunderstanding case, exactly the kata ambiguity effect claim-office was built for. n=5 will show whether this is systematic or an isolated case.

DeepSeek V4 (added 2026-05-28, routing via `@openrouter-eval/deepseek/deepseek-v4-{flash,pro}`): both smokes run v5.1-oc autonomously through (no continuation drop), write done.txt, own tests green — but 0/15 external verification for both, in each case **mechanically through a CLI contract violation**, not through spec misunderstanding:

- **`deepseek-v4-flash`**: Library code (`processScenario`) correct against the input schema (`item.type`), but **no `src/cli.ts` written** — the verification suite cannot invoke the entry point.
- **`deepseek-v4-pro`**: `src/cli.ts` exists and defines `runCLI()`, **but never calls it anywhere** — `tsx src/cli.ts` yields empty stdout, exit 0. Additionally input-schema drift (`category/declaredValue` instead of `type`).

Both models therefore fail on the workflow form (CLI wrapper contract stdin→parse→processScenario→stdout), not on the kata ambiguity. Comparable to the `qwen3-coder-480b` finding, but subtler (done.txt present, tests green). n=5 will show whether this is systematic — if so, DeepSeek is, like qwen3, a workflow-compat drop and says nothing about spec comprehension.

## Model selection

Gemini 2.5 Pro was removed from the RQ on 2026-05-25: three smoke attempts (91s/314s/85s) consistently showed a premature abort of the autonomous loop after 1-2 cycles without `experiment-done.txt`. An explicit continuation prompt ("Do NOT stop... continue until experiment-done.txt") changed nothing either — Pro interprets a passing `pnpm test` as a natural end of conversation and stops with an empty turn. A v5.1-oc compatibility issue, not a routing or model-strength problem.

On 2026-05-26 four further coding models available via Portkey were smoke-tested and none of the four were included in the RQ (routing in the `portkey-cc` workspace worked cleanly, but v5.1-oc workflow compatibility failed in a different way in each case):

- **`devstral-medium-2507` (`@mistral/devstral-medium-2507`)**: 366 tool calls in an edit loop, 0 LOC persisted at the end, but writes `experiment-done.txt` with "significant progress" — no usable output despite high activity.
- **`devstral-2512` (`@mistral/devstral-2512`)**: Real TDD (65 LOC, 6 tests), but writes `experiment-done.txt` **with red tests** — violates the workflow invariant "done.txt only when all tests green".
- **`codestral-2508` (`@mistral/codestral-2508`)**: Stops after 2 tool calls in the test-list creation phase, without a `.ts` file and without `experiment-done.txt` — model too weak for autonomous multi-step tasks of this class.
- **`qwen3-coder-480b` (`@bedrock-eu-north-1/qwen.qwen3-coder-480b-a35b-v1:0`)**: TDD including refactoring works, but stops after test 2 without `experiment-done.txt` — the same continuation drop as Gemini 2.5 Pro.

None of the four wrote `src/cli.ts` (the verification suite would have yielded `null`). Routing mappings for all four remain registered in `experiments/docker/run-batch.sh`, in case they are to be tested under a different workflow (e.g. v1-oneshot-oc as a lower bound).

## Hypotheses

- **H1 (v5.1 workflow lifts the OC level)**: opus-4-7-portkey × v5.1-oc × claim-office-EM reaches a `verification_pct` clearly above the v1-oneshot-oc level (0.20) — the skeleton finding of 1.00 is consistent with that. Expectation: mean >= 0.8 over n=5.
- **H2 (model spread visible)**: The four models show a spread over `verification_pct` — the smoke already suggests: Opus/Kimi/Flash at 1.00, MiniMax at 0.00. If that is stable, the spread is dichotomous (15/15 vs 0/15) rather than graded — claim-office as a pass/fail filter for spec comprehension.
- **H3 (Flash surprisingly strong)**: gemini-3-5-flash has perfect correctness in the smoke (15/15) despite Flash's positioning as a "fast/small" model. Check at n=5 whether this is stable or was luck (n=1 + a known tricky kata = cautious interpretation).
- **H4 (TDD discipline and correctness do NOT correlate linearly)**: Smoke finding: Opus 4/4 predictions + 15/15 verification; Kimi 0/0 predictions + 15/15 verification. Prediction-format compliance is not necessary for correctness — the TDD substance (test-first discipline) apparently works independently of the specific prediction-marker compliance.

## Methodological notes

- The skeleton finding `verification_pct=1.0` is ONE data point — replicates will show whether it is stable or luck. Memory [[replicates-n-reliability]]: n=3 detects bimodality, n=5 for medium confidence.
- The v5.1 workflow enforces skill-tool calls, but agent drift after 1-2 cycles has been observed (skeleton: only 2 skill calls despite ~18 real TDD cycles). `cycle_count` is therefore conservative; actual TDD activity is higher.
- All five models via Portkey, mixed backproviders — see RQ-model-quality-oc for routing details.
- Existing v1-oneshot-oc smokes on claim-office (verification 0.20) show the workflow effect: v1 without TDD mechanics vs v5.1 with skills makes a ~50 percentage point difference for Opus. Cross-workflow comparison is, however, the subject of a separate RQ.
- The `cli.ts` nudge is NOT wired for OC. Should non-Anthropic models systematically forget `src/cli.ts` → `verification_pct=null`. AGENTS.md demands cli.ts explicitly; the v5.1 smoke worked. Observe during the first batch.
