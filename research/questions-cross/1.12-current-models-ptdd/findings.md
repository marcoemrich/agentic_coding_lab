# RQ-current-models-ptdd — Findings

Eleven model cells on `claim-office` (`example-mapping` prompt) under the maintained
EXACT Coding Predictive TDD workflow, each model reached over its own native
route. 55 `ok` runs, n=5 per cell, `typescript-vitest` throughout.

## Overview

**Trophies mark near-ties, not ranks.** A 🏆 goes to every eligible cell whose
mean lies within 1 σ of the best value (σ of the best cell; where that is 0.00,
of the runner-up). Several rows of this field are separated by less than their
own run-to-run spread, and a single trophy there would invent a winner.

### Correctness (external) — primary outcome

| Cell | Route | Correctness (external) | σ | the five runs | `tests_passing` |
|---|---|---:|---:|---|---:|
| `opus-5-5-no-thinking` | Anthropic subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `sonnet-5-5-no-thinking` | Anthropic subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `fable-5-2-no-thinking` | Anthropic subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `gpt-6-1-sol-codex` | OpenAI subscription | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `gemini-4-argon` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `glm-5-3` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `qwen3-8` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `qwen3-8-flash-next` | Requesty | **1.00** 🏆 | 0.00 | 1.00 × 5 | 5/5 |
| `kimi-k3-sference` | Requesty | 0.99 | 0.03 | 0.933, 1.00 × 4 | 5/5 |
| `deepseek-v4-1-flash` | Requesty | 0.80 | 0.45 | **0.00**, 1.00 × 4 | 4/5 |
| `minimax-m3` | Requesty | 0.77 | 0.44 | **0.00**, 0.867, 1.00 × 3 | 5/5 |

Higher = better. Eight trophies are the reading: the field is saturated on this
kata. The two cell means below 0.90 are each produced by a **single** failed run
out of five — see F-1.12.1 and F-1.12.2, and never quote those two means without
the run values beside them.

### Code quality

Means over 5 runs. Lower = better in every column.
Correctness-gated: `deepseek-v4-1-flash` (0.80) and `minimax-m3` (0.77) are below
the 0.90 gate and take no quality trophy.

| Cell | `cognitive_max` | `cognitive_avg` | `mccabe_max` | `longest_function` | Production LoC | Code Mass (APP) | Smell Total |
|---|---:|---:|---:|---:|---:|---:|---:|
| `fable-5-2-no-thinking` | **2.2** 🏆 | **1.30** 🏆 | **3.0** 🏆 | **10.6** 🏆 | 235.2 | 674.8 | 0.0 |
| `opus-5-5-no-thinking` | **2.4** 🏆 | **1.43** 🏆 | **3.4** 🏆 | 13.0 | 184.8 | 632.4 | 0.0 |
| `sonnet-5-5-no-thinking` | **2.6** 🏆 | **1.33** 🏆 | 3.6 | 12.6 | 219.8 | 645.4 | 0.0 |
| `gpt-6-1-sol-codex` | 3.0 | 1.47 | 3.8 | **12.0** 🏆 | **130.2** 🏆 | **561.2** 🏆 | 0.0 |
| `qwen3-8-flash-next` | 4.6 | 1.78 | 4.8 | 24.0 | 264.4 | 706.6 | 0.0 |
| `gemini-4-argon` | 4.8 | 1.85 | 4.6 | 23.2 | 325.8 | 713.4 | 0.0 |
| `qwen3-8` | 6.8 | 2.60 | 6.0 | 19.8 | 254.6 | 761.4 | 0.0 |
| `kimi-k3-sference` | 8.6 | 3.46 | 6.8 | 21.8 | 184.8 | 586.8 | 0.0 |
| `glm-5-3` | 9.0 | 3.10 | 8.0 | 24.2 | 273.4 | 819.0 | 0.0 |
| `deepseek-v4-1-flash` | 4.8 | 1.82 | 4.4 | 20.0 | 244.8 | 680.0 | 0.0 |
| `minimax-m3` | 6.8 | 2.60 | 6.0 | 22.8 | 269.0 | 699.0 | 0.0 |

The four frontier cells share the complexity trophies because their differences
are smaller than their own spread: `cognitive_max` 2.2–3.0 at σ 0.45–1.41,
`mccabe_max` 3.0–3.8 at σ 0.00–1.10. `fable-5-2-no-thinking` holds the best mean
in all four complexity columns and is the only cell whose `mccabe_max` never
exceeds 3 (3.0 at σ 0.00, five of five runs) — a lead of 0.4 over
`opus-5-5-no-thinking`, which is inside that cell's own σ of 0.55.
`gpt-6-1-sol-codex` sits a hair outside the `cognitive_avg` band (1.47 against a
limit of 1.46) and keeps both size columns outright.

**Smell Total gets no trophy**: it is 0.0 at σ = 0.00 in all eleven cells, so there is
no contest in that row. On `typescript-vitest` `unit_size_max` is the same
measurement as `longest_function` and carries the same numbers in every cell — it
is not independent evidence.

**Mutation Score is in `summary.md` but carries no trophy here.** It spans
0.70 to 0.97, and that order tracks how much of each cell's domain its suite
reaches in the test process (`mutants_no_coverage` 0.0 to 24.0) as much as how
strongly it asserts. Two cells also mix two measurement modes. F-1.12.6 has the
counts, the two cells that were measurement artifacts until the instrument was
fixed, and the one run that must be excluded from the column outright.

`minimax-m3`'s quality row is not a model profile: one of its five runs stopped
after implementing 5 of 48 test-list entries (45 Production LoC, Code Mass 98),
which pulls every column of that row toward a stub it never finished. Its σ on
Production LoC is 132.05 and on Code Mass 342.93. See F-1.12.2.

### Effort and cost

Means over 5 runs. Same correctness gate.

| Cell | `cycles_closed` ↑ | `refactor_events` ↑ | `tests_total` | duration ↓ | `total_tokens` ↓ | `cost_usd` ↓ |
|---|---:|---:|---:|---:|---:|---:|
| `fable-5-2-no-thinking` | **31.2** 🏆 | **27.0** 🏆 | 59.4 | 40.1 min | 84.2 M | $48.90 |
| `opus-5-5-no-thinking` | 24.2 | 16.6 | 47.8 | **15.4 min** 🏆 | 24.4 M | $9.79 |
| `sonnet-5-5-no-thinking` | **29.6** 🏆 | 15.2 | 57.6 | 20.0 min | 49.3 M | $14.59 |
| `gpt-6-1-sol-codex` | 25.0 | 19.6 | 48.8 | 36.2 min | 9.0 M | $1.47 |
| `gemini-4-argon` | 25.0 | 20.8 | 40.4 | 61.3 min | 13.5 M | $3.48 |
| `kimi-k3-sference` | 17.8 | 5.4 | 40.0 | 20.6 min | **6.0 M** 🏆 | $3.61 |
| `glm-5-3` | 17.0 | 6.2 | 45.4 | **16.5 min** 🏆 | 10.1 M | $3.08 |
| `qwen3-8` | 13.2 | 4.2 | 45.2 | **16.7 min** 🏆 | 11.5 M | $7.80 |
| `qwen3-8-flash-next` | 16.8 | 9.6 | 40.2 | 24.6 min | 16.3 M | **$0.90** 🏆 |
| `deepseek-v4-1-flash` | 20.4 | 9.0 | 44.2 | 20.3 min | 9.6 M | $0.86 |
| `minimax-m3` | 7.6 | 6.0 | 54.6 | 30.1 min | 8.2 M | $0.92 |

`tests_total` carries no trophy — neither direction is better, and the column
spans 5 to 91 at run level. Three cells share the duration trophy at
15.4–16.7 min: `opus-5-5-no-thinking` leads at σ 1.3 min, and both others fall
inside that band. `refactor_events` is the one column of this table with a
clean winner — `fable-5-2-no-thinking`'s 27.0 ± 3.67 is 6.2 above
`gemini-4-argon` and its five runs (23–32) do not overlap any other cell
(F-1.12.12).

### Confounds (binding on every finding below)

Four axes vary jointly with the model; the RQ README holds the full argument.

1. **Harness and workflow port.** Three cells run Claude Code with
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

4. **The Claude Code version is not constant across the three CC cells.**
   Fable 5.2 is gated behind Claude Code 2.1.290 as a hard API 400, so its cell
   runs on the lab's current pin 2.1.311 while the `opus-5-5-no-thinking` and
   `sonnet-5-5-no-thinking` runs are on 2.1.280. An Anthropic-internal difference
   that involves the Fable cell is model + CLI; the clean CC-side comparison in
   this RQ is Opus 5.5 against Sonnet 5.5. `harness_version` cannot be declared as
   a control here because the two harnesses have different version axes.

All eleven cells run Predictive TDD, so they sit on the **same** side of the
test-list boundary and the Skip-fed discipline columns stay comparable within this
RQ. They remain incomparable to any ad-hoc-TDD RQ.

---

## F-1.12.1 — Correctness on claim-office is dichotomous per run, not graded per cell

Of 50 `ok` runs, 46 score 1.00, one scores 0.933, one 0.867, and two score exactly
0.00. **No run in the field lands between 0.00 and 0.867.** The cell means below
0.90 are therefore not capability ceilings but failure rates: `deepseek-v4-1-flash`
solves the kata perfectly in four of five runs, `minimax-m3` in three of five plus
one near-miss at 0.867.

| Correctness (external) | runs | cells contributing |
|---|---:|---|
| 1.00 | 46 | all ten |
| 0.933 | 1 | `kimi-k3-sference` |
| 0.867 | 1 | `minimax-m3` |
| 0.00 | 2 | `deepseek-v4-1-flash`, `minimax-m3` |

Nine of ten cells reach 1.00 in at least four of five runs. Read the two low means
as a reliability property — a failure rate of one run in five — and quote the run
values with them. "80 % correct" describes nothing that happened in the
`deepseek-v4-1-flash` cell.

The mechanism is structural and is given in F-1.12.2: `claim-office`'s external
acceptance suite speaks only to the CLI, so a run that leaves the CLI seam
unfinished scores 0/15 at once regardless of how much of the domain it built. That
is what makes the distribution bimodal rather than graded.

---

## F-1.12.2 — The two zero runs are two different drop modes, and `tests_passing` detects neither

Both failures are genuine model behaviour, not infrastructure. They fail in
opposite ways, and the column that would be expected to catch them does not.

| | `minimax-m3` | `deepseek-v4-1-flash` |
|---|---|---|
| Correctness (external) | 0.00 | 0.00 |
| `tests_passing` | **true** | false |
| `cli_built` | **false** | true |
| `todos_remaining` | **43** | **10** |
| `tests_total` | 5 | 41 |
| Production LoC | 45 | 223 |
| Code Mass (APP) | 98 | 507 |
| `cycles_closed` | 2 | 17 |
| duration | 10.6 min | 30.1 min |

- **`minimax-m3` stopped early.** It wrote the full 48-entry test list, implemented
  5 entries, left 43 as `it.todo`, never wrote `src/cli.ts`, and ended the turn
  after 10.6 min of a two-hour budget. This is the `qwen3-235b` drop pattern the
  RQ README names as a risk, occurring in one run of five rather than as the cell's
  character.
- **`deepseek-v4-1-flash` built the domain and never wired the adapter.** 40 of 51
  tests pass, the 10 remaining CLI entries are still `it.todo`, and the one live
  CLI test is red: `runScenario(scenario)` returns `{ results: [] }` where the test
  expects `{ results: [{ premium: 59 }] }`. The domain is complete and green; the
  seam to it is empty.

**`tests_passing = true` is not a completion signal under a test-list workflow.**
`it.todo` entries count as passes, so the `minimax-m3` stub reports a green suite
on 5 of 48 entries. The pair that does detect a drop is `cli_built` together with
`todos_remaining`: 43 and 10 in the two failed runs against 0 in 47 of the other
48 (one `deepseek-v4-1-flash` run at 1.00 carries 4). Gate completion on those two,
not on `tests_passing`.

Neither run is deletable. Both exited `ok` with code under `src/`, so the
`empty-run` guard correctly passes them and both correctly count as replicates.

---

## F-1.12.3 — The workflow flattens the smell axis completely and the complexity axis not at all

Smell Total is 0.0 at σ = 0.00 in all eleven cells — 55 of 55 runs clean. On that axis
the method, not the model, carries the result, and the field has no spread left to
measure.

`cognitive_max` does the opposite. It spans 2.2 to 9.0 across cells — a factor of
4.1 — while the within-cell σ stays at 0.45–1.79 for nine of the eleven
(`deepseek-v4-1-flash` 2.05 and `minimax-m3` 3.35 are the exceptions):

| Cell | `cognitive_max` | σ | `mccabe_max` | σ |
|---|---:|---:|---:|---:|
| `fable-5-2-no-thinking` | 2.2 | 0.45 | 3.0 | 0.00 |
| `opus-5-5-no-thinking` | 2.4 | 0.55 | 3.4 | 0.55 |
| `sonnet-5-5-no-thinking` | 2.6 | 0.55 | 3.6 | 0.55 |
| `gpt-6-1-sol-codex` | 3.0 | 1.41 | 3.8 | 1.10 |
| `qwen3-8-flash-next` | 4.6 | 1.52 | 4.8 | 2.17 |
| `gemini-4-argon` | 4.8 | 1.79 | 4.6 | 1.14 |
| `deepseek-v4-1-flash` | 4.8 | 2.05 | 4.4 | 1.14 |
| `qwen3-8` | 6.8 | 1.30 | 6.0 | 1.73 |
| `minimax-m3` | 6.8 | 3.35 | 6.0 | 1.73 |
| `kimi-k3-sference` | 8.6 | 1.14 | 6.8 | 0.84 |
| `glm-5-3` | 9.0 | 0.71 | 8.0 | 1.41 |

The between-cell spread exceeds the within-cell noise several times over, so H2
("the maintained workflow narrows the field") holds only for smells. On complexity
the model still decides: `glm-5-3` at 9.0 ± 0.71 and `fable-5-2-no-thinking` at
2.2 ± 0.45 are 6.8 apart, an order of magnitude more than either cell's σ.

The top of this table is a different matter. The four frontier cells span 2.2–3.0
at σ 0.45–1.41, so they are one band rather than a ranking — the model decides the
distance to `glm-5-3`, not the order inside the band.

---

## F-1.12.4 — Within the Requesty route there is no commercial-against-open structure gap

This is the comparison H3 was designed around, and it fails. `gemini-4-argon` is
the only commercial, closed-weight model on the Requesty route, so it is the one
cell that can be set against the five open-weight cells without the route
confound. It does not lead on structure:

| Requesty cell | weights | `cognitive_max` | `mccabe_max` | `longest_function` | Production LoC | Test LoC | duration |
|---|---|---:|---:|---:|---:|---:|---:|
| `gemini-4-argon` | closed | 4.8 | 4.6 | 23.2 | 325.8 | 791.6 | 61.3 min |
| `qwen3-8-flash-next` | open | 4.6 | 4.8 | 24.0 | 264.4 | 506.6 | 24.6 min |
| `deepseek-v4-1-flash` | open | 4.8 | 4.4 | 20.0 | 244.8 | 375.2 | 20.3 min |
| `qwen3-8` | open | 6.8 | 6.0 | 19.8 | 254.6 | 472.0 | 16.7 min |
| `kimi-k3-sference` | open | 8.6 | 6.8 | 21.8 | 184.8 | 481.6 | 20.6 min |
| `glm-5-3` | open | 9.0 | 8.0 | 24.2 | 273.4 | 545.8 | 16.5 min |

`gemini-4-argon` ties `deepseek-v4-1-flash` on `cognitive_max` and is beaten by
`qwen3-8-flash-next` on it, beaten by `deepseek-v4-1-flash` on `mccabe_max`, and
beaten by three of the five open cells on `longest_function`. It carries the
field's largest Production LoC (325.8), largest Test LoC (791.6) and longest wall
clock in the whole RQ — 61.3 min, 1.7× the next cell and 2.5× the fastest Requesty
cell. The smell half of H3 cannot be tested at all, because Smell Total is 0
everywhere (F-1.12.3).

The structural advantage in this field belongs entirely to the three subscription
cells — `opus-5-5-no-thinking` 2.4, `sonnet-5-5-no-thinking` 2.6,
`gpt-6-1-sol-codex` 3.0 on `cognitive_max`, against 4.6–9.0 for every Requesty cell
including the commercial one. That is exactly where Confound 2 lives: the same
split the route effect of `RQ-route-effect-pi` F-1.3.6 would produce on its own
(`cognitive_max` 4.0 against 8.0 for one model across the two routes). **This RQ
therefore cannot attribute the subscription cells' lower complexity to the models.**

The honest reading: where the commercial/open-weight split is measurable it is
absent, and where it is visible it is confounded with the route. Separating the two
needs one model measured on both routes, which is `RQ-route-effect-pi`'s design,
not this one's.

---

## F-1.12.5 — `predictions_*` is not a discipline metric on this model generation

The text-derived prediction markers fail in both directions, across three model
families, at loop behaviour the phase chain records as normal. Per-run
`predictions_total` against `cycles_closed`:

| Cell | `predictions_total` per run | `cycles_closed` per run | reading |
|---|---|---|---|
| `opus-5-5-no-thinking` | 0, 0, 0, 0, 10 | 22–26 | under-emits |
| `sonnet-5-5-no-thinking` | 0, 0, 0, 2, 12 | 28–34 | under-emits |
| `qwen3-8-flash-next` | 0, 1, 2, 2, 72 | 9–20 | under-emits |
| `qwen3-8` | 32, 36, 38, 47, 172 | 0, 11, 16, 19, 20 | over-emits |
| `gpt-6-1-sol-codex` | 96, 96, 96, 100, 100 | 24–26 | consistent |
| `glm-5-3` | 84, 86, 90, 95, 102 | 14–19 | consistent |
| `gemini-4-argon` | 64, 70, 86, 92, 93 | 22–28 | consistent |
| `deepseek-v4-1-flash` | 80, 85, 90, 102, 122 | 16–25 | consistent |
| `kimi-k3-sference` | 2, 75, 77, 83, 84 | 16–20 | one outlier |

`sonnet-5-5-no-thinking` closes 28–34 cycles at `red_batch_max` constant 1 and
emits 2.8 markers on average (σ 5.22). `qwen3-8` emits 38 markers in the run that
closed **0** cycles, and 172 in one that closed 20. Within one RQ the marker count
spans 0 to 172 at near-identical loop behaviour.

The heuristic in `CLAUDE.md` (`predictions_total ≈ 2 × cycles_closed`) does not hold
in either direction here: it would predict ~59 for the `sonnet-5-5-no-thinking`
cell against the measured 2.8, and the cells that do emit faithfully sit nearer 4×
than 2×. `predictions_correct_rate` is deliberately absent from this RQ's
`outcomes:`.

**Gate on the phase chain.** The comparable columns are `cycles_closed`,
`red_batch_max`, `refactor_events` and `tdd_discipline_closure`. This extends
F-2.4.6 of `RQ-opus55-current-workflow` ("the markers do not survive") to a second
Anthropic model and adds the inverse error on a second family.

---

## F-1.12.6 — Mutation Score here measures test architecture as much as suite strength

The column is available for every cell, but it is **not** a cell ranking, and
the reason is visible in its own counts. `mutants_no_coverage` — mutants no
test reaches in the test process, which the score definition books as
survivors — spans 0 to 24 across cells, and it orders them almost exactly as
the score does inverted:

| Cell | Mutation Score | σ | n | `mutants_total` | `mutants_survived` | `mutants_no_coverage` |
|---|---:|---:|---:|---:|---:|---:|
| `fable-5-2-no-thinking` | 0.98 | 0.03 | 5 | 133.8 | 2.8 | 0.0 |
| `sonnet-5-5-no-thinking` | 0.97 | 0.02 | 5 | 133.6 | 4.2 | 0.0 |
| `gemini-4-argon` | 0.95 | 0.04 | 5 | 126.4 | 6.8 | 0.8 |
| `opus-5-5-no-thinking` | 0.94 | 0.05 | 5 | 124.0 | 7.8 | 2.8 |
| `gpt-6-1-sol-codex` | 0.93 | 0.04 | 5 | 113.0 | 8.2 | 1.8 |
| `kimi-k3-sference` | 0.90 | 0.04 | 3 | 110.7 | 11.3 | 2.0 |
| `qwen3-8-flash-next` | 0.89 | 0.08 | 5 | 145.6 | 16.0 | 5.4 |
| `minimax-m3` | 0.87 | 0.05 | 5 | 129.2 | 14.6 | 1.6 |
| `qwen3-8` | 0.85 | 0.05 | 5 | 152.8 | 22.6 | 6.6 |
| `deepseek-v4-1-flash` | 0.78 | 0.09 | 4 | 149.75 | 33.5 | 20.25 |
| `glm-5-3` | 0.70 | 0.29 | 5 | 155.4 | 43.0 | 24.0 |

The two cells at the bottom are the two that leave 20 and 24 mutants per run
unreached, and the two at the top — `fable-5-2-no-thinking` and
`sonnet-5-5-no-thinking` — reach every mutant in all five runs
(`mutants_no_coverage` 0.0 at σ 0), on a near-identical mutant population
(133.8 against 133.6). An unreached mutant is a
statement about where a model put its test seam — how much of the domain it
exercises through an imported module versus through the CLI — not about how
strong its assertions are. The score cannot separate the two, so read it with
the counts beside it, and read a low value as "this suite tests less of the
domain in process", not as "this suite asserts weakly".

**`glm-5-3`'s σ of 0.29 is one run.** Four of its five sit at 0.774–0.928; the
fifth scores 0.195 with 94 of 128 mutants unreached, because its spec imports
only a test helper out of `src/` and drives everything else through the CLI.
The cell has no usable mean — report the four and name the fifth.

**Two cells carry a measurement gap that is not a model property.**
`kimi-k3-sference` is at n=3: two of its runs put the whole domain inside
`src/cli.ts`, which the mutate glob excludes as the CLI adapter, leaving
nothing to mutate. `deepseek-v4-1-flash` is at n=4 because its failed run has a
red suite (F-1.12.2), and mutation score on a red suite is meaningless.

**Exclude `minimax-m3`'s stub run from any reading of this column.** It scores
0.778 on **9** mutants — the loop-drop run of F-1.12.2, 45 Production LoC. A
mutation score over nine mutants of an unfinished stub is not a suite
measurement, and it is inside that cell's mean of 0.87.

### The instrument needed fixing first, and two cells were artifacts

A suite that reaches the implementation only by spawning `src/cli.ts` is
invisible to Stryker's default configuration: the mutant is selected through an
in-process global that the child never sees, so every mutant comes back
`Survived` — filed as such rather than as `NoCoverage`, which is why no column
revealed it — and the score comes out an authoritative 0.000. Three runs of
this RQ carried that value and one more timed out against it.

`experiments/compute-mutation-score.py` now mirrors the active mutant into
`__STRYKER_ACTIVE_MUTANT__`, which Stryker's instrumented header already reads
as a fallback, and measures such runs with `coverageAnalysis: "off"`. It also
refuses to record a 0.000 that comes with every mutant survived, writing a null
plus `final_metrics.mutation_unmeasurable_reason` instead. What the four
affected runs actually score:

| Cell | run | before | after |
|---|---|---:|---:|
| `gpt-6-1-sol-codex` | 2026-10-04_23-17-21 | 0.000 | **0.964** |
| `gpt-6-1-sol-codex` | 2026-10-04_23-18-57 | 0.000 | **0.982** |
| `kimi-k3-sference` | 2026-10-23_03-19-14 | 0.000 | **0.870** |
| `kimi-k3-sference` | 2026-10-23_03-17-45 | timed out | **0.945** |

So the cells read 0.93 ± 0.04 and 0.90 ± 0.04 rather than 0.54 ± 0.49 and
0.44 ± 0.62. The old `gpt-6-1-sol-codex` figure would have made the
best-structured cell in the RQ (F-1.12.3) look like the one with the weakest
suite.

**The two measurement modes are not interchangeable, and both cells now mix
them.** The bridged mode kills mutants that `perTest` leaves uncounted, so the
four runs above are measured more completely than their siblings: within
`gpt-6-1-sol-codex`, 0.871/0.907/0.917 under `perTest` against 0.964/0.982
bridged. A uniform re-measure of every TypeScript run in the bridged mode is
what would make this column a ranking; until then the eight unmixed cells are
comparable with each other and the two mixed ones are not.

---

## F-1.12.7 — Refactoring frequency splits commercial from open-weight inside the Requesty route

H3 predicted a commercial-against-open gap in code structure and does not get one
(F-1.12.4). It does get one in refactoring *behaviour*, and this one survives the
route test: `gemini-4-argon`, on Requesty, records the field's highest
`refactor_events`.

| Cell | Route | weights | `refactor_events` | σ |
|---|---|---|---:|---:|
| `fable-5-2-no-thinking` | Anthropic subscription | closed | 27.0 | 3.67 |
| `gemini-4-argon` | Requesty | closed | 20.8 | 4.44 |
| `gpt-6-1-sol-codex` | OpenAI subscription | closed | 19.6 | 3.36 |
| `opus-5-5-no-thinking` | Anthropic subscription | closed | 16.6 | 2.41 |
| `sonnet-5-5-no-thinking` | Anthropic subscription | closed | 15.2 | 3.11 |
| `qwen3-8-flash-next` | Requesty | open | 9.6 | 5.46 |
| `deepseek-v4-1-flash` | Requesty | open | 9.0 | 4.00 |
| `glm-5-3` | Requesty | open | 6.2 | 2.59 |
| `minimax-m3` | Requesty | open | 6.0 | 3.87 |
| `kimi-k3-sference` | Requesty | open | 5.4 | 1.52 |
| `qwen3-8` | Requesty | open | 4.2 | 3.03 |

All five closed-weight cells sit at 15.2–27.0, all six open-weight cells at
4.2–9.6, with no overlap and a gap of 5.6 between the groups — wider than the
largest within-group σ (5.46, `qwen3-8-flash-next`). Because `gemini-4-argon` leads
the Requesty half of the closed group and the laggards of the open group are on the
same route, the split cannot be explained by Confound 2 here.

The same ordering shows in `cognitive_max` (F-1.12.3), which suggests the two are
linked: the cells that refactor 3–4× as often are the cells that end with the
lowest complexity. `fable-5-2-no-thinking` is now the extreme case of that pattern
on both axes at once — the field's highest `refactor_events` and its lowest
`cognitive_max` — which fits the link without testing it. This RQ cannot establish
the direction: it has no arm that varies refactoring frequency at a fixed model.

Caveat: the within-route closed group is **one cell at n=5**. `mistral-large-4` was
wired as a second one and had to be dropped (pi cannot talk to Mistral's endpoint;
README "Dropped: mistral-large-4"), so this finding rests on `gemini-4-argon`
alone.

---

## F-1.12.8 — The cheapest cell that reaches 1.00 costs a fifty-fourth of the most expensive one

Among the nine cells at or above the 0.90 correctness gate, `cost_usd` spans
$0.90 to $48.90 at identical Correctness (external) and identical Smell Total:

| Cell | Correctness (external) | `cost_usd` | `total_tokens` | `cognitive_max` | `refactor_events` |
|---|---:|---:|---:|---:|---:|
| `qwen3-8-flash-next` | 1.00 | **$0.90** 🏆 | 16.3 M | 4.6 | 9.6 |
| `gpt-6-1-sol-codex` | 1.00 | $1.47 | 9.0 M | 3.0 | 19.6 |
| `glm-5-3` | 1.00 | $3.08 | 10.1 M | 9.0 | 6.2 |
| `gemini-4-argon` | 1.00 | $3.48 | 13.5 M | 4.8 | 20.8 |
| `kimi-k3-sference` | 0.99 | $3.61 | **6.0 M** 🏆 | 8.6 | 5.4 |
| `qwen3-8` | 1.00 | $7.80 | 11.5 M | 6.8 | 4.2 |
| `opus-5-5-no-thinking` | 1.00 | $9.79 | 24.4 M | 2.4 | 16.6 |
| `sonnet-5-5-no-thinking` | 1.00 | $14.59 | 49.3 M | 2.6 | 15.2 |
| `fable-5-2-no-thinking` | 1.00 | $48.90 | 84.2 M | 2.2 | 27.0 |

**Price does not order the structure column.** The four cells at `cognitive_max`
2.2–3.0 are the four subscription cells — and one of them, `gpt-6-1-sol-codex`,
is the second *cheapest* row in the table at $1.47, within the same complexity
band as the $48.90 Fable cell. Every Requesty cell sits at 4.6–9.0 regardless of
tariff, with the $3.08 `glm-5-3` at 9.0 and the $0.90 `qwen3-8-flash-next` at 4.6.
What separates the two groups is the route family (Confound 2), not what they cost.
For a practitioner whose acceptance criterion is the external suite,
`qwen3-8-flash-next` clears it at 1/54 of the `fable-5-2-no-thinking` tariff and
1/16 of the `sonnet-5-5-no-thinking` one.

Two cells below the gate are cheaper still — `deepseek-v4-1-flash` $0.86 and
`minimax-m3` $0.92 — and neither is a bargain at a one-in-five total failure rate
(F-1.12.2).

`fable-5-2-no-thinking` is the field's most expensive cell at $48.90 ± 14.12 —
5.0× `opus-5-5-no-thinking` on 3.4× its token volume, at the same 1.00 (F-1.12.12).
`sonnet-5-5-no-thinking` is the second, above `opus-5-5-no-thinking`, on 2.0× its
token volume (49.3 M against 24.4 M) for 1.2× its closed cycles (29.6 against
24.2). All four subscription figures are list-price comparisons under Confound 3;
nothing is billed per token on either subscription.

---

## F-1.12.9 — Within one family and one provider, a twelfth of the price loses nothing on this kata

`qwen3-8` and `qwen3-8-flash-next` are the same model family on the same
backprovider (tensorx), separated by 12.5× on input and 12× on output list price.
They resolve to different backends (`qwen/qwen3.8-2.4t-a95b` against
`qwen/qwen3.8-flash-next`), so this is the lab's only intra-family price axis
without a simultaneous provider change.

**Medians** over 5 runs each, with each cell's σ. The pivots in `summary.md` report
the mean; the two differ where a cell has an outlier, and `qwen3-8` has one.

| | `qwen3-8` | `qwen3-8-flash-next` | |
|---|---:|---:|---|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 | equal |
| `tests_total` | 42.0 ± 5.9 | 41.0 ± 1.6 | equal |
| `cycles_closed` | 16.0 ± 8.2 | 19.0 ± 4.5 | flash-next higher |
| `refactor_events` | 4.0 ± 3.0 | 11.0 ± 5.5 | flash-next 2.75× |
| `cognitive_max` | 6.0 ± 1.3 | 5.0 ± 1.5 | flash-next lower |
| Code Mass (APP) | 738 ± 66 | 738 ± 74 | identical |
| Smell Total | 0.0 | 0.0 | both clean |
| `total_tokens` | 8.75 M ± 6.18 M | 15.94 M ± 3.84 M | flash-next 1.8× |
| `cost_usd` | $5.89 ± $4.12 | $0.90 ± $0.20 | flash-next 6.5× cheaper |
| `duration_seconds` | 14.2 min ± 8.2 | 25.5 min ± 4.8 | flash-next 1.8× slower |

The cheap tier does not merely lose less than its price difference suggests — on
this kata it loses nothing. Correctness is identical at σ = 0 in both cells, Code
Mass (APP) is identical to the digit at the median, Smell Total is 0 in both, and
`cognitive_max` and `refactor_events` favour flash-next. What it pays is wall clock
and tokens, 1.8× each, which is why a 12× price gap converts to only 6.5× in cost
per run.

The flagship is also the unstable cell of the pair: σ $4.12 on a median of $5.89,
and a token range of 8.2–22.5 M against 12.2–22.2 M for flash-next. Medians are the
honest comparison; means would be carried by the flagship's outlier run.

The window asymmetry (262 144 against the flagship's 1 M) did not bind. The largest
single request of each run, input plus cache reads, came to 87–191 k tokens in the
flagship cell and 107–141 k in flash-next; neither cell compacted. `total_tokens`
does not measure context occupancy — the per-request maximum does. On a larger kata
the asymmetry could still bind, so re-check it there.

---

## F-1.12.10 — `minimax-m3` has no representative mean in any column

The cell completes the kata — three of five runs at 1.00 — but no column of it
survives the σ test, and the instability is not confined to one run:

| | the five runs | mean | σ |
|---|---|---:|---:|
| Correctness (external) | 0.00, 0.867, 1.00, 1.00, 1.00 | 0.77 | 0.44 |
| `cycles_closed` | 1, 2, 7, 12, 16 | 7.6 | 6.43 |
| `red_batch_max` | 1, 1, 1, 1, **6** | 2.0 | 2.24 |
| `tests_total` | 5, 49, 58, 70, 91 | 54.6 | 31.88 |
| `total_tokens` | 0.5 M, 1.3 M, 2.2 M, 8.6 M, 28.5 M | 8.2 M | 11.79 M |
| `cost_usd` | $0.05, $0.21, $0.23, $1.00, $3.10 | $0.92 | $1.27 |
| Production LoC | 45, 277, 297, 340, 386 | 269.0 | 132.05 |
| Code Mass (APP) | 98, 762, 803, 905, 927 | 699.0 | 342.93 |

`cycles_closed` 1–16 at `tests_total` 5–91 is the signature: one run wrote 49 tests
and closed a single cycle, another wrote 91 and closed 16. Its `tdd_discipline`
spans 0.09 to 0.58 across the five.

`red_batch_max` 6 in one run is a workflow-compliance deviation, not a crash: that
run completed with 58 tests and Correctness (external) 0.867. It is also not unique
to this cell — `deepseek-v4-1-flash` reached 3 and `kimi-k3-sference` 2 in one run
each, so seven of ten cells hold `red_batch_max` at a constant 1 and three do not.

Report every `minimax-m3` value as a range. The cell is in the RQ because the
inclusion rule is per model and four of its five runs ran the loop through; it is
not a cell any mean describes.

---

## F-1.12.11 — `tdd_discipline_step` is saturated here; `tdd_discipline` tracks test-list granularity

All eleven cells sit on the same side of the test-list boundary, so the Skip-fed
columns are comparable **within** this RQ. Two cautions on reading them.

`tdd_discipline_step` is **1.00 in all 55 runs** — including the `minimax-m3` run
with `red_batch_max` 6, because `red_batch_size` averages to 1.00 there over many
batches. The column CLAUDE.md names as always-comparable carries no signal on this
field; `red_batch_max` per run is what separates the cells (F-1.12.10).

`tdd_discipline`, `tdd_discipline_closure` and `test_first_rate` do spread — 0.43 to
0.72, 0.27 to 0.61, 0.33 to 0.62 — but what they order is the **share** of the
test list that arrived already satisfied, not the rigour of the loop. The last
column is `skip_events / cycles_total`, both cell means:

| Cell | `tdd_discipline` | `tdd_discipline_closure` | `test_first_rate` | `skip_events` | `cycles_total` | skip share |
|---|---:|---:|---:|---:|---:|---:|
| `gemini-4-argon` | 0.72 | 0.61 | 0.62 | 13.0 | 41.4 | 0.31 |
| `deepseek-v4-1-flash` | 0.70 | 0.58 | 0.62 | 15.0 | 37.2 | 0.40 |
| `sonnet-5-5-no-thinking` | 0.64 | 0.50 | 0.52 | 26.4 | 58.8 | 0.45 |
| `opus-5-5-no-thinking` | 0.63 | 0.49 | 0.51 | 23.8 | 49.6 | 0.48 |
| `gpt-6-1-sol-codex` | 0.63 | 0.49 | 0.51 | 23.0 | 50.6 | 0.45 |
| `fable-5-2-no-thinking` | 0.63 | 0.49 | 0.50 | 28.6 | 64.4 | 0.44 |
| `kimi-k3-sference` | 0.58 | 0.44 | 0.45 | 22.6 | 41.0 | 0.55 |
| `qwen3-8-flash-next` | 0.56 | 0.41 | 0.43 | 23.2 | 41.2 | 0.56 |
| `qwen3-8` | 0.54 | 0.31 | 0.33 | 17.4 | 33.8 | 0.51 |
| `glm-5-3` | 0.52 | 0.36 | 0.39 | 28.2 | 47.0 | 0.60 |
| `minimax-m3` | 0.43 | 0.27 | 0.33 | 24.4 | 34.0 | 0.72 |

The skip share reproduces the discipline ordering almost exactly — only `qwen3-8`
and the `kimi-k3-sference`/`qwen3-8-flash-next` pair swap places. The **absolute**
skip count does not: `qwen3-8` has the second-fewest skips (17.4) and the
third-lowest score, because it also ran the fewest cycles (33.8).

Under Predictive TDD a Skip is compliance — a test already satisfied by an earlier
generalisation is legitimate evidence — so the ordering above is a statement about
test-list granularity as much as about loop rigour. Do not present it as a quality
ranking.

`chain_opens_red` is `false` in all 55 runs (a test-list workflow opens with the
list, not with a red test) and `chain_ends_green` is `true` in 54 — the exception is
the failed `deepseek-v4-1-flash` run. Both columns are ambivalent and carry no
trophy.

---

## F-1.12.12 — Fable 5.2 buys refactoring and suite strength, not correctness

On this kata the top Anthropic tier does not move the primary outcome. It moves
what the loop spends and how often it refactors.

| | `fable-5-2-no-thinking` | `opus-5-5-no-thinking` | `sonnet-5-5-no-thinking` |
|---|---:|---:|---:|
| Correctness (external) | 1.00 ± 0.00 | 1.00 ± 0.00 | 1.00 ± 0.00 |
| scenarios passed, per run | 15/15 × 5 | 15/15 × 5 | 15/15 × 5 |
| `refactor_events` | **27.0** ± 3.67 | 16.6 ± 2.41 | 15.2 ± 3.11 |
| the five runs | 23, 24, 27, 29, 32 | 14, 15, 16, 18, 20 | 10, 15, 16, 17, 18 |
| `cycles_closed` | 31.2 ± 2.05 | 24.2 ± 1.64 | 29.6 ± 2.51 |
| `cognitive_max` | 2.2 ± 0.45 | 2.4 ± 0.55 | 2.6 ± 0.55 |
| `mccabe_max` | 3.0 ± 0.00 | 3.4 ± 0.55 | 3.6 ± 0.55 |
| `longest_function` | 10.6 ± 1.67 | 13.0 ± 1.58 | 12.6 ± 1.14 |
| Production LoC | 235.2 ± 19.60 | 184.8 ± 19.66 | 219.8 ± 52.39 |
| Mutation Score | 0.98 ± 0.03 | 0.94 ± 0.05 | 0.97 ± 0.02 |
| `mutants_survived` | 2.8 | 7.8 | 4.2 |
| duration | 40.1 min | 15.4 min | 20.0 min |
| `total_tokens` | 84.2 M | 24.4 M | 49.3 M |
| `cost_usd` | $48.90 | $9.79 | $14.59 |

**`refactor_events` is the one column that separates cleanly.** The five Fable
runs (23–32) do not overlap the Opus 5.5 (14–20) or Sonnet 5.5 (10–18) runs, and
the 10.4 gap to Opus 5.5 is roughly three times either cell's σ. Everything on the
complexity axis goes the same direction but inside the noise: 0.2 on
`cognitive_max` at σ 0.45–0.55, 2.4 on `longest_function` at σ 1.1–1.7. The one
qualitative difference there is that Fable 5.2's `mccabe_max` is 3 in every run
(σ 0.00), where both other cells produce 4s.

**The suite gets stronger in a way the counts support.** 2.8 surviving mutants
against 7.8 for Opus 5.5, on an almost identical mutant population (133.8 against
124.0) and with `mutants_no_coverage` 0.0 in both — so this is assertion strength,
not a test-seam artifact (F-1.12.6). It is also the one cell that pairs that with
the field's highest `refactor_events`.

**What it costs.** 3.4× the tokens of Opus 5.5, 2.6× the wall clock, 5.0× the
list price, for a primary outcome that was already saturated at 1.00. Production
LoC moves the other way (235.2 against 184.8): more refactoring here did not mean
less code. A practitioner whose acceptance criterion is the external suite has no
reason to reach for this tier on a kata of this size; the finding is about where
the extra budget goes, not about a correctness gain.

**Confound 4 is binding on this block.** The Fable cell runs on Claude Code
2.1.311 (the model is gated behind 2.1.290), the two comparison cells on 2.1.280.
A CLI contribution to the refactor-count gap cannot be excluded, and no RQ in this
lab measures a CLI-version effect on refactoring frequency — the RQs that pin
`harness_version` exclude the other version rather than compare against it, so
there is no published bound to lean on. Read every row of this block as
model + CLI. What would separate them is one cell of `opus-5-5-no-thinking` on
2.1.311; until that exists, the clean comparison inside this RQ is Opus 5.5 against
Sonnet 5.5, where `refactor_events` differs by 1.4 at σ 2.4–3.1.
