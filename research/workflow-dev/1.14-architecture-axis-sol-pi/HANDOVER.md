# Handover — RQ-architecture-axis-sol-pi → RQ-B

State on 2026-08-10. Data collection is **complete** (30 runs, 6 cells × n=5,
zero failures). `findings.md` **is written** (F-1.1 … F-1.5); the RQ is closed.

This document is **not committed** — it is a working handover, kept locally so
the follow-up RQ can be designed without re-deriving today's results. The
published result is `findings.md`; where the two differ in emphasis, `findings.md`
is authoritative. What lives here and nowhere else is the infrastructure
knowledge of §3–§4: the pi ports, the parser extensions, the marker-discipline
caveat and the sharding experience.

---

## 1. What RQ-A answered

**Question:** Does the TDD architecture axis (subagents-v2 isolated subagents / single-context-v2
single context / hybrid-v2 hybrid) rank the same way on `gpt-5-6-sol` as on
`opus-4-7`?

**Answer: yes on the correctness axis, no on the quality axis.**

### Correctness — `verification_pct` (higher = better)

| Kata | subagents-v2 | single-context-v2 | hybrid-v2 |
|---|---:|---:|---:|
| claim-office | **40 %** | 100 % | 100 % |
| game-of-life | 100 % | 100 % | 100 % |

subagents-v2 on claim-office is **strictly bimodal**: 1.00 / 0.00 / 0.00 / 0.00 / 1.00 —
no intermediate value. The failing runs pass all their own tests and build a
working CLI, but fail 15/15 external scenarios. Inspected output for scenario
`01-block-exact-three`: expected `{"results":[{"premium":71}]}`, produced
`{"results":[{"premium":59},{"payout":100,"remainingCap":1100}]}` — wrong value
*and* an extra result object. Same mechanism as F-workflow-model.2: the isolated
subagents build a self-consistent but wrong reading of the spec, and the
self-written tests only cover that reading.

Notably the **failing runs did more work**: correct runs took 78/80 cycles, the
failing ones 76/100/103. More iteration under subagents-v2 does not converge on the spec
— it elaborates the misreading.

### Peak complexity — `cognitive_max` (lower = better)

| Kata | subagents-v2 | single-context-v2 | hybrid-v2 |
|---|---:|---:|---:|
| claim-office | 11.6 ± 3.36 | 8.4 ± 2.19 | **5.8 ± 4.09** |
| game-of-life | **7.0 ± 4.58** | 7.4 ± 6.66 | 8.6 ± 5.73 |

**Reading this table depends on which row you follow.** On Opus, hybrid-v2 was top-2
on *both* katas — that dual placement is the standing justification for the hybrid-v1
default. On Sol hybrid-v2 wins claim-office but comes **last** on game-of-life. All σ
are large (4.6–6.7), so the game-of-life ordering sits within one standard
deviation and is not a robust reversal.

`findings.md` F-1.3 reads the same numbers along the **subagents-v2 row** instead and
finds the Opus pattern intact: subagents-v2 competitive on game-of-life (7.0, rank 1),
collapsing on claim-office (11.6, rank 3) — the kata inversion of F-tdd-quality.9,
replicated. Both readings hold; they track different rows. Because the
game-of-life spread is inside 1 σ, `findings.md` awards the trophy to all three
variants there and treats that row as "no effect" — which is the more
conservative call and the one to carry into RQ-B. The v6.1-specific claim below
(§2 caveat 1) is the weaker of the two and needs more replicates before it
carries weight.

### Everything else (n=5 per cell)

| Metric (lower = better unless noted) | Kata | subagents-v2 | single-context-v2 | hybrid-v2 |
|---|---|---:|---:|---:|
| `duration_seconds` | claim-office | 4296 | **255** | 1185 |
| | game-of-life | 899 | **198** | 343 |
| `smell_total` | claim-office | 28.0 | **12.4** | 15.2 |
| | game-of-life | 3.8 | **2.4** | 2.8 |
| `code_mass` | claim-office | 646.8 | 524.6 | **446.4** |
| | game-of-life | 146.8 | 141.0 | **125.8** |
| `total_tokens` | claim-office | 14.06 M | **0.82 M** | 4.99 M |
| | game-of-life | 1.61 M | **0.70 M** | 0.80 M |
| `refactorings_applied` (higher = more activity) | claim-office | 10.2 | 19.6 ± 17.4 | 15.0 ± 2.35 |
| `predictions_correct_rate` (higher = better) | claim-office | 79 % | 98.4 % | 98.6 % |
| | game-of-life | 84.4 % | 95.9 % | **100 %** |

**single-context-v2 is the efficiency winner by a wide margin** — same perfect correctness as
hybrid-v2 at ~1/5 the wallclock (255 s vs 1185 s on claim-office) and ~1/6 the tokens.
hybrid-v2's advantage is confined to `cognitive_max` and `code_mass`, and on
claim-office the `cognitive_max` gap (5.8 vs 8.4) is smaller than hybrid-v2's own σ
(4.09). This is a much weaker "hybrid-v1 wins" than the Opus data shows (there: 4.3 vs
14.8).

---

## 2. Gate decision for RQ-B

**H1 holds on correctness → the hybrid-v1 reduction chain is a legitimate foundation
for Sol, and RQ-B (retest of hybrid-v4 / hybrid-v4.3 / exact-hybrid-v4.1-refactor-vocab-cc / hybrid-v5) can
proceed as planned.**

Two caveats to carry into RQ-B's motivation:

1. The hybrid-v1 advantage on Sol rests on claim-office alone. On game-of-life hybrid-v2 is
   last on `cognitive_max`. Any RQ-B finding phrased as "hybrid-v1.x improves quality"
   must state which kata.
2. single-context-v2 matches hybrid-v2 on correctness at a fraction of the cost. If RQ-B's
   reduction steps only move quality metrics by less than 1 σ, the honest
   conclusion for Sol may be "use single-context-v2", not "use the refined hybrid-v1". Worth stating
   as an alternative hypothesis in RQ-B rather than discovering it at the end.

---

## 3. Reusable infrastructure built for RQ-A

### Three pi ports (committed, validated)

| Workflow | `.pi/agents/` | `.pi/skills/` | Notes |
|---|---:|---:|---|
| `exact-subagents-v2-testlist-fix-pi` | 4 | 0 | every phase a subagent |
| `exact-single-context-v2-testlist-fix-pi` | 0 | 4 | everything shared context |
| `exact-hybrid-v2-testlist-fix-pi` | 1 | 3 | red/green shared, refactor isolated |

All three carry the `hybrid-v4.1` continuation overlay. Without it Sol settles at the
Test-List → Red boundary. For subagents-v2 the overlay had to be **rewritten** onto
subagent mechanics (it references `red/SKILL.md`, which subagents-v2 does not have), and
the four agents needed explicit output-marker blocks added — the CC originals
carry only document headings (`## Red Flags`, `## Red Phase Process`), which are
not output instructions. On CC that is irrelevant because tool calls are counted.

**If RQ-B needs further pi ports** (hybrid-v4, hybrid-v4.3, exact-hybrid-v4.1-refactor-vocab-cc, hybrid-v5), the
cheapest path is copying `exact-hybrid-v4-cleaned-pi` (already exists, established
track record) and applying the CC-side delta. That is how `v6.1-...-pi` was built:
diff the two CC variants, apply the same delta to the pi translation. Note the pi
line has two standing deviations from CC that are *not* part of any delta and must
not be "fixed": no `You are a …` opening sentence and no `Red Flags` section in
`refactor.md`.

### Two parser extensions in `parse_pi_transcript.py`

Both were mandatory — without them the corresponding cells silently measure zero.

1. **`refactorings_applied` text fallback** (line ~464):
   `refactor_calls or text_phase_counts["refactor"]`. single-context-v2 refactors inline and
   never emits a subagent call.
2. **Phase markers from subagent output** (`_subagent_phase_text_of`): subagents-v2 runs
   every phase in a subagent, so markers never reach the main thread. Verified on
   a real run: 78 `## Red` in the subagent, **0** in the main thread.

**The agent binding in (2) is load-bearing.** Across 25 existing pi runs the
refactor subagents emit 98 `## Green` and 19 `## Refactor` headings inside their
reports. An unbound fallback would have corrupted every existing hybrid run's
`cycle_count`. Markers are therefore bound to `results[].agent`, and both
fallbacks apply only when the primary signal is entirely absent. Regression:
10 hybrid runs across four pi workflow variants, unchanged.

Documented under P1–P7 in `experiments/workflows/MARKERS.md`.

---

## 4. Measurement caveats — read before designing RQ-B

### 4.1 Sol's marker discipline is unreliable (affects TDD-discipline metrics only)

`predictions_total` should be ≈ 2 × `cycle_count`. Observed quotas across the 30
runs: one run at 100 %, most at 44–66 %, one single-context-v2 run at **6 %** (4 predictions
across 36 cycles). Verified this is *not* a parser bug — that run emitted `## Red`
and `## Refactor` 36 times each but the `Red Phase Complete:` block only twice.

Consequences:
- `predictions_correct_rate` stays valid as a *ratio* (it is correct/total).
- `predictions_total` and, for single-context-v2, `refactorings_applied` partly measure marker
  compliance rather than actual TDD work. single-context-v2/claim-office shows refactorings
  of 2, 14, 36, 40 at near-identical cycle counts — σ 17.4.
- Comparisons of these metrics against Opus reference values are not clean.
- **Correctness and code-quality metrics are unaffected** — measured externally.

### 4.2 `cost_usd` requires a separate step for pi/Requesty

Requesty returns no inline cost (`usage=null`), so `cost_usd` is 0.00 straight
out of the batch. **`compute-cost.py` closes this** — it multiplies the token
counts from `transcript-metrics.json` by the list prices in
`research/model-pricing.md` and writes `final_metrics.cost_usd`. It was run for
all 30 runs of this RQ, so the cost figures in `findings.md` are real:

| Kata | subagents-v2 | single-context-v2 | hybrid-v2 |
|---|---:|---:|---:|
| claim-office | $38.22 | $1.72 | $9.52 |
| game-of-life | $4.84 | $1.58 | $2.18 |

Two things to carry into RQ-B:

- The script runs **neither** in `analyze-run.sh` **nor** in `/run-rq` — like
  `compute-mutation-score.py` it must be invoked explicitly after the batch:
  `experiments/compute-cost.py <rq-dir>/`, then re-aggregate.
- The value is a **list-price baseline** (Requesty catalogue price × tokens), not
  a billed amount. Fine for comparing cells against each other; do not quote it as
  spend.

Side effect worth knowing: while every `cost_usd` was 0, `aggregate-by-query.py`
classified the column as boolean and rendered it as "rate % = 0" instead of a
mean — an all-zero numeric column looks like an all-`False` boolean column to it.
If a numeric outcome ever shows up as a rate table, that is the cause.

### 4.3 Runtime and disk

subagents-v2 × claim-office averages **72 min/run** (max 85). Individual `run.log` files
reached 2.9 GB during the batch; they are gitignored but fill the disk (~8 GB peak
across 5 parallel runs). If RQ-B includes similarly expensive cells, plan disk
headroom and expect multi-hour batches. single-context-v2 (~4 min) and hybrid-v2 (~20 min) are
unproblematic.

The 5-shard run (against the documented max of 3) completed without a single OOM
kill on a 16 GB-free machine — but 4 of 5 shards finished long before the last,
because round-robin gave shard 3 the expensive subagents-v2 cells. **For unevenly
expensive plans, shard by cost rather than round-robin, or accept a long tail.**

---

## 5. Open questions for RQ-B and beyond

Carried over from RQ-A's README, updated with today's results:

1. **Does the reduction chain transfer?** Do hybrid-v4.3 / exact-hybrid-v4.1-refactor-vocab-cc break
   on claim-office for Sol the way they do for Opus (0.96 → 0.35 / 0.23)? → the
   core of RQ-B.
2. **Is single-context-v2 the better recommendation for Sol?** RQ-A cannot answer this — it
   compared architectures, not the refined hybrid-v1 variants. If RQ-B's winner does not
   clearly beat single-context-v2 on quality, the practical answer for Sol may be single-context-v2.
3. **Why does hybrid-v2 lose on game-of-life?** Opposite of the Opus pattern. Needs
   either more replicates (σ is large) or a third kata to separate "kata
   complexity" from "kata familiarity".
4. **Does subagents-v2's bimodality have a detectable trigger?** 2/5 runs succeed. Whether
   the split correlates with the test list produced in phase 1 is checkable from
   the existing transcripts — no new runs needed.
5. **Marker discipline as a workflow property.** hybrid-v2 held 98.6–100 %
   prediction quota, subagents-v2 79–84 %, single-context-v2 6–100 %. If this replicates, "the
   architecture that keeps the model on-format" is itself a finding — and a
   confound for every TDD-discipline metric compared across architectures.

---

## 6. Concrete next steps

1. ~~`/run-rq RQ-architecture-axis-sol-pi` → write `findings.md`~~ **done** —
   F-1.1 … F-1.5 written, all 72 table values diffed against `summary.md`,
   `status: closed`. Beyond the sections above, `findings.md` also records that
   Sol's complexity is *not* systematically higher than Opus on this axis (F-1.5),
   which qualifies the reading rule this RQ was designed under.
2. ~~Commit the 30 runs~~ **done** (`run.log` gitignored).
3. Update `research/workflow-dev/model-recommendation-matrix.md` with a Sol row
   once findings are written. The matrix currently only covers opus-4-7 /
   opus-4-6 and claims workflow recommendations are model-dependent — RQ-A is the
   first cross-model replication of the `.1` generation and belongs there.
4. Open RQ-B with the gate decision from section 2 and the caveats from section 4.
   Suggested cells: `exact-hybrid-v4-cleaned-pi`, `exact-hybrid-v4.3-audit-bundle-cc-pi`,
   `exact-hybrid-v4.1-refactor-vocab-cc-pi`, `exact-hybrid-v5-end-refactor-cc-pi` × both katas × n=5 = 40 runs.
   Three of the four pi ports do not exist yet.
