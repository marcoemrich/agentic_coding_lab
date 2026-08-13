---
id: RQ-harness-requesty
question: "How does switching harness (Claude Code vs OpenCode vs pi) affect correctness, code quality, TDD discipline and cost when model (opus-4-8 via Requesty), workflow intention and prompt style are held constant?"
factors:
  workflow:
    - v6.2-with-why-cleaned
    - v6.2-with-why-cleaned-oc
    - v6.2-with-why-cleaned-pi
  kata_base:
    - claim-office
    - game-of-life
controls:
  model:
    any:
      - opus-4-8-requesty   # CC + OC: route vertex/claude-opus-4-8@eu, canonical for new fill runs
      - opus-4-8            # pi: same model, pi label without -requesty suffix (models.json route)
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
  # TDD discipline
  - cycle_count
  - predictions_correct_rate
  - refactorings_applied
  # context + cost (cache-inclusive, same tariff across all harnesses; source per harness see § Cost comparison)
  - completed_within_budget
  - duration_seconds
  - total_tokens
  - cost_usd
min_replicates: 5
status: aktiv
---

# RQ-harness-requesty: Harness effect CC vs OC vs pi (Requesty routing)

## Motivation

Successor to the frozen `RQ-harness` (Portkey/opus-4-7). The lab switched in 2026-07 from
Portkey to **Requesty**; the old RQ remains as a Portkey snapshot and
is not overwritten. This RQ measures the same harness effect (CC vs OC vs pi, full
TDD mechanics, workflow trio `v6.2-with-why-cleaned{,-oc,-pi}`) anew under Requesty — with
two decisive improvements in the data situation compared to the Portkey era:

1. **Real prompt caching on all harnesses.** The Portkey bug #1579 (cache_control
   stripped → pi `cache_read=0`) does not exist on Requesty. Verified live: Requesty's
   Anthropic `/v1/messages` path delivers `cache_creation`→`cache_read` correctly (a cache hit
   lowers the price by ~10×).
2. **Cost cache-inclusive across all harnesses.** All three carry `cost_usd` on the same
   Requesty tariff; the cache discounts apply for real (no #1579 strip). CC and pi via
   the token×price estimate (`compute-cost.py`), OC potentially inline (`info.cost`) — details
   and caveat in § Cost comparison. Decisive: the cache effect is for the first time real on all
   harnesses, not only on CC/OC as in the Portkey era.

Both points make the harness cost comparison cleanly measurable for the first time — details,
price baseline and cost provenance per harness are stated below in § Cost comparison.

## Routing (important point)

`controls.model` is an **`any:` match** across two labels of the same model:
- **`opus-4-8-requesty`** (CC + OC): CC routes via `ANTHROPIC_BASE_URL=router.eu.requesty.ai`
  + `ANTHROPIC_AUTH_TOKEN=$REQUESTY_API_KEY` (route `vertex/claude-opus-4-8@eu`); OC via
  the `requesty` provider block in `opencode.json`. The `-requesty` suffix keeps these runs
  distinguishable from any future native opus-4-8 runs (different tariff).
- **`opus-4-8`** (pi): pi routes via `pi-config/agent/models.json` (`vertex/claude-opus-4-8@eu`)
  and writes `model=opus-4-8` without suffix.

Both labels designate **the same model on the same Requesty route** — only the
harness channel (and thus the model label) differs. The `any:` match collapses
them into one cell (CLAUDE.md exception for routing variants of the same model). The first
entry `opus-4-8-requesty` is canonical for new fill runs (CC/OC); pi fill uses `opus-4-8`.

**Thinking is enabled** on all three arms (`thinking: true` in every run's
`metrics.json`, verified 2026-08-13). An earlier version of this file claimed the
opposite; the claim was never true of the data. The no-thinking arms of opus-4-8
exist in the pool but are not part of this RQ — mixing them in would open thinking
as an uncontrolled factor.

### Why cursor is not a fourth arm here (withdrawn 2026-08-13)

cursor-cli was briefly carried as a fourth arm (`v6.2.1-phase-continuation-cursor`
+ `opus-cursor`) and has been removed from the factor grid. Two independent reasons,
either of which alone would be sufficient:

1. **The arm was invalidated.** Its runs were built on the false premise that
   cursor-agent has no subagent mechanism, so refactor executed inline while CC/OC/pi
   delegated it — a different workflow, not a different harness. The runs were deleted
   on 2026-07-28. One later run (`2026-07-27_22-45-39_…_opus-cursor`) survives in the
   pool and *does* use the isolated refactor subagent (32 `taskToolCall` events); it is
   valid evidence but n=1, and is not claimed by this RQ.
2. **Effort confound.** cursor-opus is `claude-opus-4-8-medium` — **medium effort**,
   against default effort on the other three arms. Cursor encodes effort only in the
   model name, so an exactly comparable arm does not exist. Any cursor-vs-rest
   difference would be unattributable between effort and harness.

The cursor harness is measured on its own terms in
[`research/questions-cursor-cli/1.1-model-quality-cursor/`](../../questions-cursor-cli/1.1-model-quality-cursor/),
whose runs are all on the corrected architecture.

## Cost comparison

Core question of this RQ: **Which harness is the cheapest at the same model and workflow
— and does the old "pi is cheapest" statement flip once prompt caching
applies for real on all three harnesses?** The comparison runs on two measurement layers
that must not be confused:

1. **`cost_usd` (billing layer, cache-inclusive).** The amount in $ that the run
   would really have cost. Cache reads enter at the discount tariff (Opus 4.8: $0.55/M instead of
   $5.50/M input). This is the decisive comparison metric of the RQ.
2. **`total_tokens` resp. input+output cache-adjusted (effort layer).** How many
   fresh tokens the model actually processed. Proxy for the compute effort,
   **not** for the price — the two layers can rank in opposite directions (see
   F-harness.2 of the predecessor RQ: cache-adjusted CC < OC < pi, but in $ pi < OC < CC).

### Price baseline

All three harnesses route the same model via the same Requesty route
(`vertex/claude-opus-4-8@eu`), so **one** tariff applies to the whole comparison
(USD per 1M tokens, as of `research/model-pricing.md` 2026-07-25):

| Input | Output | Cache Read | Cache Write |
|------:|-------:|-----------:|------------:|
| $5.50 | $27.50 | $0.55      | $6.25       |

The Requesty vertex tariff is ~10 % above the native Anthropic list price
($5.00/$25.00/$0.50). Since all cells carry the same tariff, that shifts the
absolute amount, not the harness ranking.

### Cost provenance per harness (caveat)

The `cost_usd` value comes from different sources depending on the harness — when
comparing, this must be carried along as a caveat:

| Harness | cost_usd source | Cache read real? |
|---------|-----------------|------------------|
| CC | **Estimate** token×price via `compute-cost.py`. The Claude Code CLI discards the `cost` field from the Requesty messages response when writing `transcript.jsonl` (only Anthropic-standard token fields remain, `usage.cost` is missing) — verified live on an opus-4-8-requesty run (`cost_usd=null`, cache_read=4.16M). The parser hook in `analyze_transcript.py` remains, but only applies if a future CLI version passes `cost` through. | yes |
| OC | **inline** from Requesty messages (OC parser `info.cost`) → `transcript-metrics.json.cost_usd`, **if** OpenCode fills the field (to be verified after the batch ends); otherwise fallback to the estimate | yes |
| pi | **Estimate** token×price via `compute-cost.py` (Requesty `openai-completions` path delivers `cost=0`) | yes (route-dependent, opus: yes) |

Factual situation after the first cross-harness batch (2026-07-25): **contrary to the
original assumption, CC receives NO inline cost** — the CLI is the bottleneck, not the parser
or Requesty. CC and pi therefore both carry the token×price estimate on the same tariff;
only OC *could* deliver real cost (open until verification). All three are at least
comparably estimated via `compute-cost.py`. **No automatic trophy** without
this note. Precondition for robust pi numbers: the main-thread summation fix in
`parse_pi_transcript.py` (otherwise a massive cache_read undercount, see § Methodological notes).

### What is new compared to the Portkey predecessor RQ

The old F-harness.2 ("pi cheapest") was **partly a gateway artifact**: Portkey
stripped `cache_control` on vertex routing (issue #1579) → pi got no
cache discounts at all, CC/OC did; in addition the pi parser undercounted the cache. On
Requesty the strip bug does not exist — pi gets real cache reads on the opus
route. This means it is measured *cleanly* for the first time whether pi's cost advantage is real
or was only a missing-discount-plus-undercount effect. Expectation (H2): the
advantage shrinks or flips, because CC/OC now hold their cumulative cache load against a
pi that also draws cache discounts on the same route.

## Workflow trio

Identical to the old RQ-harness — `v6.2-with-why-cleaned{,-oc,-pi}` (complete trio,
marker dirs `.claude`/`.opencode`/`.pi` verified). Skills (test-list/red/green) +
subagent (refactor), same marker conventions. Harness syntax differences and the
translation confound as documented in `RQ-harness` (see there § Methodological
notes — they apply unchanged).

## Existing data

None under Requesty-opus-4-8 with this trio — entirely from scratch.
6 cells (3 workflows × 2 katas) × 5 replicates → 30 runs.

Since CC routing is container-global, a single plan can mix CC-requesty + OC-requesty +
pi-requesty (separate routing channels) — no split needed.

## Hypotheses

- **H1 (correctness harness-invariant)**: `tests_passing`/`verification_pct` without
  systematic harness difference at constant model + workflow.
- **H2 (cost/tokens differentiated — now clean)**: Unlike the Portkey RQ, the
  cache effect here is real on all harnesses. Expectation: the old "pi is cheapest"
  statement could flip, because CC/OC now also receive cache discounts via Requesty and
  pi continues to run without inline caching on the `openai-completions` path. Core question of the RQ.
- **H3 (Code Mass drift)**: `code_mass`/`cognitive_max` on game-of-life with a harness-typical
  style tendency.
- **H4 (TDD discipline harness-invariant)**: `cycle_count`/`predictions_correct_rate`/
  `refactorings_applied` structurally identical across all three harnesses.

## Methodological notes

- **Parser undercount fix (pi)**: `parse_pi_transcript.py` has, since 2026-07, summed the
  main-thread usage across all assistant messages (previously only the last value → massive
  undercount, above all cache_read). All pi runs of this RQ must be analyzed with the fixed
  parser. See memory `pi-requesty-cost-and-parser-undercount`.
- **Document cost provenance**: CC/OC carry real inline cost (Requesty messages),
  pi the token×price estimate. Note as a caveat in the cost comparison — not 1:1
  equivalent, but both close to the actual Requesty tariff.
- **Marker discipline/translation confound**: as in `RQ-harness` — pi structurally carries the
  AGENTS.md marker overhead; diff the prompt files before interpreting significant diffs.
- **Spend limit guard**: before aggregation `grep -l 'Reached monthly spend limit'` over the
  run logs (memory `pi-requesty-412-spend-limit`).
