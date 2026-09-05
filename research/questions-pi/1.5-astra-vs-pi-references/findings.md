# RQ-astra-pi — Findings

GPT-6 Astra on the OpenAI subscription route against the strongest references
reachable on the pi harness. `game-of-life-example-mapping` ×
`v6.2.1-phase-continuation-pi`, n=5 per cell, 25 runs.

**The harness is pi in every cell — this is not a harness comparison.** Two
cells sit on the OpenAI subscription route (`openai-codex`, Responses API),
three on Requesty. `codex` in the lab ids names the pi provider through which
the subscription is reached, not the Codex CLI.

## Übersicht

Means per cell. Direction is stated per row.

| Metric | `astra` subs | `sol` subs | `sol` Requesty | `sol` Req. reasoning | `opus-5` Requesty |
|---|---:|---:|---:|---:|---:|
| Complexity Peak — kleiner = besser | 7.0 | 4.4 | 9.0 | 10.6 | **2.4** 🏆 |
| `cognitive_avg` — kleiner = besser | 2.96 | 2.47 | 4.87 | 5.62 | **2.2** 🏆 |
| `mccabe_max` — kleiner = besser | 4.6 | 4.6 | 6.8 | 8.0 | **3.4** 🏆 |
| `cc_longest_function` — kleiner = besser | 19.4 | 20.8 | 18.8 | 21.6 | **5.8** 🏆 |
| `cc_avg_loc_per_function` — kleiner = besser | 18.0 | 11.53 | 14.14 | 15.3 | **2.62** 🏆 |
| Smell Total — kleiner = besser | 2.4 | **0.6** 🏆 | 2.4 | 2.8 | 2.0 |
| `smell_complexity` — kleiner = besser | 0.2 | **0.0** 🏆 | 0.8 | 0.8 | **0.0** 🏆 |
| Production LoC — kleiner = besser | **22.4** 🏆 | 41.6 | 30.6 | 27.2 | 39.8 |
| Code Mass (APP) — no trophy, see F-1.5.3 | 99.4 | 153.2 | 138.8 | 126.4 | 151.8 |
| Correctness (external) — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| Correctness (internal) — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| `completed_within_budget` — saturated | 100 % | 100 % | 100 % | 100 % | 100 % |
| `cycle_count` — ambivalent, no trophy | 14.0 | 9.8 | 8.4 | 8.4 | 10.2 |
| `refactorings_applied` — höher = besser | 4.0 | **7.0** 🏆 | 5.0 | 4.4 | 3.8 |
| `predictions_correct_rate` — höher = besser | 96.7 % | 98.5 % | **100 %** 🏆 | 97.7 % | **100 %** 🏆 |
| `duration_seconds` — kleiner = besser | 496.2 | 615.6 | **252.8** 🏆 | 286.0 | 436.2 |
| `total_tokens` — kleiner = besser | 970.7 k | 1.26 M | 855.4 k | **823.1 k** 🏆 | 2.22 M |

**Reading the table.** Three rows are saturated at the ceiling across all five
cells and carry no trophy — there is no contest to win. `cycle_count` gets none
because more cycles is not per se better. Code Mass (APP) gets none for the
reason in F-1.5.3. Cross-route rows conflate model and transport: RQ-route-effect-pi
established that the subscription route alone improves structural metrics on this
exact kata and workflow, so a Requesty cell winning a structural row is winning
*against* its transport, and a subscription cell winning is not proof of the model.
F-1.5.4 bounds how small a difference may be read at all.

## F-1.5.1 — Astra does not reach Sol on the shared subscription route

The RQ's cleanest comparison — same route, same vendor, same workflow, no
transport confound — goes against Astra on every structural metric:

| | Astra | Sol | direction |
|---|---:|---:|---|
| Complexity Peak | 7.0 | **4.4** | kleiner = besser |
| `cognitive_avg` | 2.96 | **2.47** | kleiner = besser |
| Smell Total | 2.4 | **0.6** | kleiner = besser |
| `cc_avg_loc_per_function` | 18.0 | **11.53** | kleiner = besser |
| `refactorings_applied` | 4.0 | **7.0** | höher = besser |

`mccabe_max` is the one tie (4.6 both), and `cc_longest_function` is the one
row Astra takes (19.4 vs 20.8) — inside the noise of a metric whose spread is
much larger than that gap.

The per-run distributions separate where the aggregate alone would not settle
it: Astra `[6, 6, 6, 6, 11]` against Sol `[3, 4, 4, 4, 7]` on Complexity Peak.
Four of five Astra runs sit above four of five Sol runs; the overlap is a
single value on each side. σ is 2.24 and 1.52 — an order tighter than the
Requesty cells' 5.57/6.11, so on this route the metric does discriminate
(F-1.5.4).

**H1 is rejected.** Astra is not the better model on its own route; it is the
weaker one on structure while writing the least code (F-1.5.3).

## F-1.5.2 — Opus 5 wins the structural axis outright, against the transport

Opus 5 takes five of the six ungated structural rows, and it does so from the
route that RQ-route-effect-pi showed to be the structurally *worse* one:

| | Astra (subscription) | Opus 5 (Requesty) | factor |
|---|---:|---:|---:|
| Complexity Peak | 7.0 | **2.4** | 2.9× |
| `mccabe_max` | 4.6 | **3.4** | 1.4× |
| `cc_longest_function` | 19.4 | **5.8** | 3.3× |
| `cc_avg_loc_per_function` | 18.0 | **2.62** | 6.9× |

The last row is the finding. Opus 5 decomposes: mean function length 2.62
lines, longest 5.8. The whole GPT branch — both routes, both reasoning states —
sits at 11.5–15.3 mean and 18.8–21.6 longest. This is a difference in kind, not
in degree, and it is the largest effect in the RQ.

**H2 is rejected, and more strongly than it was posed.** H2 asked whether
Astra's advantage over Opus 5 exceeds the route delta. There is no advantage to
net out: Astra loses on every structural metric while holding the route that
should favour it. The route delta and the model effect point the same way here,
and the model effect is the larger of the two.

Opus 5 buys this with tokens: 2.22 M, which is 2.3× Astra's 970.7 k and still
1.8× the next-highest cell in the matrix (Sol on the subscription route, 1.26 M).
It does not buy it with wall-clock — 436.2 s against Astra's 496.2 s makes
Opus 5 the faster of the two as well.

## F-1.5.3 — Astra writes the least code and the least decomposed code, and Code Mass (APP) rewards it for both

Astra takes Production LoC at 22.4 against 27.2–41.6, and shows the lowest Code
Mass (APP) at 99.4 against 126.4–153.2. It simultaneously holds the *worst*
`cc_avg_loc_per_function` in the field at 18.0.

These are the same artefact seen twice. Astra concentrates the solution into
few long functions: fewest lines overall, most lines per function. APP has no
notion of nesting and counts a single long function as cheap, so Code Mass reads
Astra as the most parsimonious cell in the matrix while `cognitive_avg`,
`cc_longest_function` and `cc_avg_loc_per_function` all say it is the least
structured of the low-LoC cells.

Code Mass (APP) therefore carries **no trophy** in the overview table. This is
the documented APP blind spot occurring in a live cell, not a theoretical
caveat: the metric would have crowned the cell that F-1.5.1 and F-1.5.2 both
rank last on structure.

Production LoC keeps its trophy — less code passing the same external suite is
a real result — but it must be read next to `cc_avg_loc_per_function`, never
alone.

## F-1.5.4 — The noise floor of Complexity Peak is route-dependent, and on Requesty it exceeds most between-cell differences

`RQ-model-quality-pi` carries a second reasoning-off Sol cell under the bare id
`gpt-5-6-sol` — same route, same `pi-config` profile, same declared
`reasoning: false`, differing only in whether the redundant `--thinking off` is
passed. It is the same configuration, and it does not measure the same:

| id | Complexity Peak median | range | Smell Total | Production LoC |
|---|---:|---:|---:|---:|
| `gpt-5-6-sol-no-thinking` | 8.0 | 4–17 | 2.0 | 28 |
| `gpt-5-6-sol` | 17.0 | 4–17 | 4.0 | 26 |

Identical ranges, medians nine points apart at n=5. That is the noise floor of
`cognitive_max` on this kata for the Requesty cells, and it is larger than the
gap between any two Requesty cells in this RQ (9.0 vs 10.6).

The floor is **not** uniform across routes. The two subscription cells have
σ 2.24 and 1.52 against the Requesty cells' 5.57 and 6.11 — a threefold
difference in spread on the same metric, same kata, same workflow. This is why
F-1.5.1 can read a 7.0-vs-4.4 difference as real while the overview table's
Requesty columns cannot be separated from each other at all.

`gpt-5-6-sol` is deliberately kept out of `factors.model`: as a nominal
duplicate it would enter the table as its own cell and imply a difference where
there is none.

## F-1.5.5 — Astra runs the most cycles and logs the most predictions, with the fewest refactorings of the GPT branch

Astra reaches 14.0 cycles against 8.4–10.2 everywhere else, and logs 122
predictions against 32–66 — roughly the 2 × `cycle_count` the marker
convention expects, which no other cell in the matrix reaches (Sol on the same
route logs 66 against an expected ~20).

It converts that into the fewest refactorings of the GPT branch (4.0 against
4.4–7.0). More cycles with less refactoring per cycle, and the structural
result of F-1.5.1 and F-1.5.3 is consistent with that: the loop runs often but
reworks little.

**One of the five runs breaks the marker pattern**, logging 8 predictions at 13
cycles where the other four log 28–30. This is the Spark-shaped marker
inconsistency that `RQ-spark-vs-sol` documented for this route, occurring at
1-in-5 here. It is the reason `predictions_total` is not an outcome of this RQ
and only `predictions_correct_rate` is read — the rate is unaffected
(96.7 % pooled, and all five cells sit within 96.7–100 %, i.e. no spread worth
interpreting).

## F-1.5.6 — Correctness, budget and the reasoning channel are invisible on this kata

All 25 runs pass: Correctness (external) 1.0, Correctness (internal) green,
`completed_within_budget` 100 %, `cli_built` true. **H3 confirmed** —
`game-of-life` under v6.2.1 does not discriminate on correctness, so the three
saturated rows gate rather than differentiate, and every cell is eligible for
the quality trophies.

The reasoning channel likewise separates nothing. `gpt-5-6-sol-no-thinking` and
`gpt-5-6-sol-reasoning` differ only in whether the Requesty profile declares
`reasoning: true`, and they land within noise of each other on every row
(Complexity Peak 9.0 vs 10.6, Smell Total 2.4 vs 2.8, Production LoC 30.6 vs
27.2) — both inside the floor of F-1.5.4. This reproduces F-1.3.6 on
independent replicates.

**H4 is confirmed.** The subscription route is the slower transport: 496.2 s
and 615.6 s against 252.8 s and 286.0 s on Requesty. Astra is the faster of the
two subscription cells despite running more cycles.

## Caveats

- **`cost_usd` is not an outcome and must not be read from `runs.csv`.** The
  column carries three provenances: measured inline costs for the Sol
  subscription cell, a 0 for Astra, and list-price computations for the three
  Requesty cells. Astra would read as free. The 0 is now correct but was not
  produced correctly: until 2026-09-05 `gpt-6-astra` had **no** `models.json`
  entry at all, so pi priced it with Sol's tariff, and two of these five runs
  recorded a fabricated 0.77 USD. The entry was added (no `cost` block, mirroring
  Spark) and the two values normalised to 0. See RQ-astra-native-sol, Caveats.
- **Phase timings and context utilization are 0 on the subscription route.**
  `avg_cycle_seconds`, `avg_red_seconds`, `avg_green_seconds`,
  `avg_refactor_seconds` and `context_utilization_pct` come back 0 despite
  millions of tokens. Parser gap, not measurement; excluded from `outcomes`.
- **Astra's declared context window is inherited, not confirmed.**
  `contextWindow` 272000 / `maxTokens` 128000 are the GPT-5.6 family defaults,
  and were not even declared when these runs were recorded — the `models.json`
  entry carrying them was added on 2026-09-05, after the fact. Under-declaring is safe; verify upstream before reading any
  context-pressure result.
- **`--thinking off` does not suppress reasoning on the subscription route.**
  Astra's smoke run passed the flag, recorded `thinking: false`, and still
  produced 501 `thinking` blocks. The `-no-thinking` suffix in
  `gpt-6-astra-codex-no-thinking` names a flag, not a reasoning state; it was
  chosen so the two subscription cells differ only in the model.
