# Handover: mutation testing and findings for RQ-current-models-ptdd

Written 2026-10-23, after the fill. The RQ is complete — 10 cells at n=5, 51
runs, every cell ✅ — and carries **no findings yet**. Two steps remain.

Paste this file, or its two task sections, into a fresh session.

---

## Step 1 — Mutation testing (before aggregation)

`mutation_score`, `mutants_total`, `mutants_survived` and `mutants_no_coverage`
are declared in `outcomes:`, so this RQ opts in and the scores must be computed
**before** the aggregation that writes them into `summary.md`:

```bash
python3 experiments/compute-mutation-score.py research/questions-cross/1.12-current-models-ptdd
```

Every cell runs `typescript-vitest`, so the engine is Stryker. Budget minutes
per run and a `pnpm install` per run — roughly 1–2 hours for the 49 scorable
runs. Only `tests_passing = true` runs are scored, and two of the 51 are not:
the refused `sonnet-5-5-no-thinking` attempt, and one `deepseek-v4-1-flash` run
that exited `ok` with failing tests (see "The two weak cells are bimodal").

**Check the host pnpm version first.** `pnpm --version` must report `9.15.9`.
A newer host pnpm turns green TypeScript runs red: pnpm ≥ 10 ignores the `pnpm`
key in `package.json` and writes a warning to **stderr**, and suites that start
the CLI through `spawnSync` and correctly assert `stderr === ""` then fail for a
reason that has nothing to do with the agent's code. `compute-mutation-score.py`
removes the key for the duration of the test run, but the version warning
itself stays. After the run, check `git diff` on the `metrics.json` files:
`tests_passing` and `coverage` must be unchanged.

Then aggregate, on the host:

```bash
python3 experiments/aggregate-by-query.py research/questions-cross/1.12-current-models-ptdd
```

`uv` is **not** on this host's PATH and `experiments/.venv` does not exist — the
system `python3` has pandas, PyYAML and tabulate. The aggregator refuses while
batch containers run, so check `docker ps` first.

## Step 2 — `/run-rq RQ-current-models-ptdd`

Aggregation and findings only. Do not plan new runs; every cell is at
`min_replicates`.

---

## What the findings must carry

### `predictions_*` is not a discipline metric on this model generation

Gate on the phase chain. The evidence is in this RQ:

- `sonnet-5-5-no-thinking` closes 28–34 cycles across its five runs at
  `red_batch_max` constant 1, and emits 0, 0, 0, 2 and 12 prediction markers —
  σ 5.22 on a mean of 2.8, where the heuristic in CLAUDE.md
  (`predictions_total ≈ 2 × cycles_closed`) would expect about 59.
- One `qwen3-8` run emitted 38 markers while closing **0** cycles.

So the error runs in both directions, on two model families.
`predictions_correct_rate` is deliberately absent from `outcomes:`. The
comparable columns are `cycles_closed`, `red_batch_max`, `refactor_events` and
`tdd_discipline_step`.

### All ten cells sit on the same side of the test-list boundary

Every cell runs Predictive TDD, so the Skip-fed columns (`tdd_discipline`,
`skip_events`, `cycles_total`, `test_first_rate`, …) stay comparable **within**
this RQ. They are still not comparable to any ad-hoc-TDD RQ.

### Correctness gate for trophies

`kimi-k3-sference` 0.99, `deepseek-v4-1-flash` 0.80 and `minimax-m3` 0.77 do not
reach 1.00. Per the trophy convention in `.claude/skills/run-rq/SKILL.md` they
take no quality trophy — low complexity on incompletely correct code is not a
quality signal.

### The two weak cells are bimodal, and the mean misrepresents them

This is the single reading most easily destroyed by quoting cell means. The
per-run `verification_pct` of the two lowest cells:

| Cell | mean | the five runs |
|---|---:|---|
| `deepseek-v4-1-flash` | 0.80 | **0.0**, 1.0, 1.0, 1.0, 1.0 |
| `minimax-m3` | 0.77 | **0.0**, 0.867, 1.0, 1.0, 1.0 |
| `kimi-k3-sference` | 0.99 | 0.933, 1.0, 1.0, 1.0, 1.0 |
| every other cell | 1.00 | 1.0 × 5 |

`deepseek-v4-1-flash` solves claim-office **perfectly in four of five runs** and
fails completely in the fifth. "80 % correct" describes nothing that happened.
The same shape, less cleanly, in `minimax-m3`. Report these as a **reliability**
property — a failure rate of 1 in 5 — not as a capability ceiling, and quote the
run-level values next to any mean.

This is H1 ("correctness is dichotomous, not graded") confirmed in a sharper
form than it was posed: the dichotomy is **per run within a cell**, not between
cells. Seven of ten cells are at 1.00 with σ = 0, and the spread in the rest is
carried by single failed runs.

**Note on the `deepseek` failure: it is a genuine model failure, not
infrastructure.** The run exited `ok`, wrote code to `src/`, and its tests do
not pass — so the `empty-run` guard correctly does not catch it, and it
correctly counts as a replicate. Do not delete it; it is the finding.

### `qwen3-8`: the spread is the result

`cycles_closed` 0, 11, 16, 19, 20 at `verification_pct` 1.00 in all five runs.
The zero run is a bulk-implement: three TDD events — the test list as 51 skipped
entries, 24 minutes of nothing, then green. That means **"ran no loop", not "no
data"** — the reporter was working. One run in five, so report it as
instability, never as the character of the cell.

### `minimax-m3` batches its red tests

`red_batch_max` mean 2.0 against 1.0 everywhere else (one smoke run reached 6).
A workflow-compliance deviation, not a crash; name it alongside the discipline
columns.

### mean vs median

`aggregate-by-query.py`'s pivots report the **mean**. The Qwen pair table in
`README.md` reports medians computed from the runs. They differ wherever a cell
has an outlier — `qwen3-8`'s `cycles_closed` is 13.2 as a mean and 16.0 as a
median, from the same five runs, because one closed 0. Say which statistic a
finding quotes.

### The three binding confounds

They are in the README under "Confounds (binding)" and belong in any quoted
finding. The heaviest is the route effect: `RQ-route-effect-pi` F-1.3.6 measured
one model (GPT-5.6 Sol) at constant harness, workflow, kata and prompt across
the two routes at `cognitive_max` 4.0 against 8.0 — and showed it is not a
reasoning effect.

**Read the commercial-against-open comparison within the Requesty route first**:
`gemini-4-argon` against the five open-weight cells. The three subscription
cells (`opus-5-5-no-thinking`, `sonnet-5-5-no-thinking`, `gpt-6-1-sol-codex`)
carry the route effect on top of the model effect.

### Results already derived — do not re-derive

The README section "The Qwen pair is the lab's only confound-free price axis"
holds the complete H5 comparison (flash-next 6.5× cheaper at identical
correctness and identical Code Mass, with better `cognitive_max`, paying 1.8×
in tokens and wall clock), together with the measurement showing the 262k
window asymmetry did not bind (largest single request 87–191k in the flagship
cell, 107–141k in flash-next — `total_tokens` does **not** measure context
occupancy).

### Glossary is binding

Correctness (external), Code Mass (APP), Smell Total, Production LoC, Mutation
Score. The complexity metrics have no prose name — write `cognitive_max`,
`mccabe_max`, `longest_function` in backticks.

---

## State of the data

- **51 runs, one non-`ok`**: a provider refusal in the `sonnet-5-5-no-thinking`
  cell (`reasoning_extraction`). It stays visible in the pool, does not count
  as a replicate, and the cell has its 5 `ok`.
- **`mistral-large-4` was planned as an eleventh cell and dropped**: Mistral's
  endpoint rejects pi's request body with HTTP 422. Reasoning in the README
  under "Dropped: mistral-large-4", including the two infrastructure lessons
  (probe with the harness's body shape, not a minimal curl; pi exits 0 on this
  failure, which is why `run-batch.sh` now has an `empty-run` guard).
- **Smell Total is 0 in all ten cells.** Quality differentiation runs through
  `cognitive_max` and `mccabe_max`, not through smells.
- **Mutation Score will be the first column that separates suite strength** —
  the RQ has none so far, which is why step 1 comes before the findings.
