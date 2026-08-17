# Findings — RQ-app-subordination-measurement-sol

On the OpenAI subscription route, does subordinating APP mass to the Four Rules
recover the decomposition that the unsubordinated brief suppresses — and does adding
pre/post measurement improve the result further, at what cost in duration as the
measurement moves from the model to deterministic tools?

Data base: 25 runs, 5 cells × n=5, all `exit_reason: ok`, `completed_within_budget`
100 %, `tests_passing` 100 % and `verification_pct` 100 % in every cell. Route: OpenAI
subscription (`gpt-5-6-sol-codex`), reasoning always on (F-1.3.5). Kata
`claim-office-example-mapping`, the only kata in this lab where the decomposition
metrics measure decomposition rather than function length (F-1.16.7).

The five cells form two axes. **Axis 1** is the refactor brief: the reference carries
the Four Rules alone, Arm A adds an elaborated Rule 2/3 plus APP explicitly ranked
under Rule 4. **Axis 2** is measurement: B1, B2 and B3 share Arm A's brief
byte-identically and differ only in where the pre/post numbers come from — the model's
own arithmetic, ESLint, or ESLint plus an AST script.

## Übersicht

| Metric | Basis (Four Rules) | A (APP subordinated) | B1 (by hand) | B2 (ESLint) | B3 (tools) | Direction |
|---|---:|---:|---:|---:|---:|---|
| Correctness (external) `verification_pct` | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | **100 %** 🏆 | höher = besser |
| Correctness (internal) `tests_passing` | 100 % | 100 % | 100 % | 100 % | 100 % | höher = besser |
| `cc_avg_loc_per_function` | **6.60 ± 1.18** 🏆 | **6.72 ± 0.34** 🏆 | 7.12 ± 1.10 | 7.88 ± 1.12 | 7.11 ± 0.81 | kleiner = besser |
| `cc_median_loc_per_function` | **4.70 ± 0.67** 🏆 | 5.80 ± 0.84 | 5.30 ± 0.97 | 6.40 ± 1.34 | 6.00 ± 1.46 | kleiner = besser |
| Complexity Peak `cc_longest_function` | 18.0 ± 3.00 | 15.8 ± 2.39 | 18.0 ± 3.08 | 18.2 ± 2.77 | 16.2 ± 3.03 | kein 🏆 — Spread < 1 σ |
| `cognitive_max` | 4.0 ± 0.71 | 5.4 ± 2.88 | **3.4 ± 1.14** 🏆 | **3.8 ± 1.48** 🏆 | 4.6 ± 1.82 | kleiner = besser |
| `cognitive_avg` | 2.15 ± 0.19 | 2.11 ± 0.60 | **2.02 ± 0.39** 🏆 | 2.25 ± 0.82 | 2.16 ± 0.61 | kleiner = besser |
| `mccabe_max` | 5.4 ± 0.89 | 5.6 ± 2.07 | **4.2 ± 0.84** 🏆 | 4.8 ± 1.64 | **4.4 ± 0.55** 🏆 | kleiner = besser |
| Smell Total | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | **0.0** 🏆 | kleiner = besser |
| Production LoC | **129.4 ± 13.24** 🏆 | 148.8 ± 11.82 | 141.2 ± 8.76 | 141.2 ± 15.80 | **130.4 ± 10.69** 🏆 | kleiner = besser |
| `cc_functions` | 9.8 ± 1.64 | 11.0 ± 1.58 | 10.2 ± 1.79 | 9.2 ± 1.79 | 8.6 ± 1.95 | kein 🏆 — ambivalent |
| Code Mass (APP) | 556.8 ± 53.0 | 590.6 ± 66.1 | 534.8 ± 21.9 | 581.2 ± 63.6 | 534.4 ± 27.5 | kein 🏆 — Mechanismus-Zeuge, s.u. |
| `cycle_count` | 31.6 ± 7.54 | 30.6 ± 7.23 | 31.6 ± 1.67 | 32.4 ± 6.43 | 34.8 ± 2.95 | kein 🏆 — Testlisten-Granularität, s.u. |
| `refactorings_applied` | 31.6 ± 7.54 | 30.6 ± 7.23 | 31.6 ± 1.67 | 32.6 ± 6.47 | 34.8 ± 2.95 | kein 🏆 — Spread < 1 σ |
| `duration_seconds` | **874 ± 92** 🏆 | 1226 ± 186 | 1011 ± 115 | 1143 ± 214 | 1181 ± 111 | kleiner = besser |
| `total_tokens` | 4.61 M ± 1.10 M | **4.49 M ± 2.17 M** 🏆 | 5.76 M ± 0.96 M | 6.63 M ± 2.01 M | 8.22 M ± 0.77 M | kleiner = besser |
| `cost_usd` | $3.98 ± 0.74 | **$3.58 ± 1.65** 🏆 | $4.55 ± 0.67 | $5.03 ± 1.50 | $5.96 ± 0.47 | kleiner = besser |

Caveats for reading the table:

- **No correctness gating applies** — all five cells reach `verification_pct` 100 %, so
  the whole field is eligible for quality and efficiency trophies.
- **Code Mass gets no trophy.** As in RQ-1.17 it is the witness for the mechanism under
  test — what the brief subordinates — not a quality ranking. B1 and B3 reach the lowest
  mass in the field while *also* being among the best on the complexity metrics, which is
  the opposite of the RQ-1.17 pattern and is what F-1.18.2 is about.
- **`cc_functions` gets no trophy** because its direction is not fixed: fewer functions
  can mean cleaner consolidation or missing decomposition, and this RQ has no independent
  way to tell those apart.
- **`cycle_count` gets no trophy** because more cycles is not better: the count tracks how
  finely the model cut its test list, which varies from 19 to 39 tests across this RQ's
  runs and is not an outcome the workflows are trying to move. `refactorings_applied` is
  directionally meaningful but its spread here (30.6–34.8) sits inside every cell's σ.
- **`cc_longest_function` gets no trophy** for the same spread reason: four of five cells
  lie within 1 σ of each other.
- Trophies for near-ties: `cc_avg_loc_per_function` 6.60 vs 6.72 sits far inside 1 σ, so
  both cells carry the trophy. The same applies to `mccabe_max` 4.2 / 4.4 and
  `cognitive_max` 3.4 / 3.8.

---

## F-1.18.1 — Subordinating APP prevents the damage but produces no gain

Ranking APP explicitly as a Rule 4 measure, with the extraction arithmetic spelled out
and two prohibitions attached, moves the decomposition metrics **not at all** relative to
a brief that omits APP entirely.

| Metric | Basis (no APP) | A (APP subordinated) | Δ |
|---|---:|---:|---:|
| `cc_avg_loc_per_function` | 6.60 ± 1.18 | 6.72 ± 0.34 | +0.12 (0.1 σ) |
| `cc_median_loc_per_function` | 4.70 ± 0.67 | 5.80 ± 0.84 | +1.10 (1.5 σ) |
| `cc_longest_function` | 18.0 ± 3.00 | 15.8 ± 2.39 | −2.2 (0.8 σ) |
| `cognitive_max` | 4.0 ± 0.71 | 5.4 ± 2.88 | +1.4 |
| Code Mass (APP) | 556.8 | 590.6 | +6 % |

The decisive comparison is against RQ-1.17, where the *unsubordinated* brief on this
exact model, route, kata and prompt style produced `cc_avg_loc_per_function` 9.52 at
Code Mass 492.4 — the worst decomposition in that field, below even the structureless v3
floor, bought with the lowest mass.

| Brief | `cc_avg` | Code Mass |
|---|---:|---:|
| v6.2.1, APP unsubordinated (RQ-1.17) | 9.52 | 492.4 |
| Basis, no APP at all | 6.60 | 556.8 |
| A, APP subordinated | 6.72 | 590.6 |

Arm A lands on the no-APP baseline, not on the v6.2.1 damage. Sol no longer optimises
the mass number — mass *rises* by 6 % rather than falling, which is what the brief
predicts a healthy extraction pattern looks like.

**Rationale.** The RQ-1.17 reading was that Sol optimises past the one-line guard
("Rule 2 trumps APP"). This RQ shows the guard can be made to hold: what it takes is
the rank stated explicitly, the arithmetic made plain (extraction *raises* mass, and
that is normal), and the two failure modes named as prohibitions. What that buys is
neutralisation, not improvement — the hypothesis that a better-specified APP brief
would decompose *better* than no APP at all (H1) is not supported. For a practitioner
on Sol the operational consequence is unchanged: including APP costs 40 % duration
(see F-1.18.4) and returns nothing, so the shortest correct brief is the one without it.

---

## F-1.18.2 — Measurement improves exactly the metrics it measures

The three measured arms share Arm A's brief byte-identically and differ only in the
pre/post measurement. Their advantage is confined to the two quantities the agent
actually reads.

| Metric | measured? | A (none) | B1 (hand) | B2 (ESLint) | B3 (tools) |
|---|---|---:|---:|---:|---:|
| `cognitive_max` | ✓ | 5.4 | **3.4** | 3.8 | 4.6 |
| `mccabe_max` | ✓ | 5.6 | **4.2** | 4.8 | 4.4 |
| `cc_avg_loc_per_function` | ✗ | **6.72** | 7.12 | 7.88 | 7.11 |
| `cc_median_loc_per_function` | ✗ | **5.80** | 5.30 | 6.40 | 6.00 |

Every measured arm beats the unmeasured one on `cognitive_max` and `mccabe_max`; every
measured arm loses to it on `cc_avg_loc_per_function`. The measured arms also reach the
lowest Code Mass in the field (B1 534.8, B3 534.4) at the *best* complexity values —
the RQ-1.17 trade-off between mass and structure does not reappear here.

**Rationale.** This is teaching-to-the-test in a clean form, and it is worth stating
precisely because both metric groups describe "decomposition" informally. Cognitive and
cyclomatic complexity count branching inside a function; LoC-per-function counts how the
code is cut into functions. Measuring the first pushes the model to flatten control flow
— which it does, successfully — while the second is left to the qualitative review,
where the extra prose competes for attention with the measurement ritual.

The practical rule: a measured metric will improve, so choose the metric that encodes
what is actually wanted. If the goal is decomposition into named domain functions,
neither cognitive complexity nor McCabe expresses it (F-1.14, F-1.16), and measuring
them will not produce it.

---

## F-1.18.3 — Deterministic tools cost more than model arithmetic and measure no better

Moving the measurement from the model's own arithmetic to deterministic tools raises
cost monotonically without improving the result.

| | B1 (by hand) | B2 (ESLint, mass by hand) | B3 (ESLint + AST script) |
|---|---:|---:|---:|
| `total_tokens` | 5.76 M ± 0.96 M | 6.63 M ± 2.01 M | 8.22 M ± 0.77 M |
| `cost_usd` | $4.55 | $5.03 | $5.96 |
| `duration_seconds` | 1011 ± 115 | 1143 ± 214 | 1181 ± 111 |
| `cognitive_max` | **3.4** | 3.8 | 4.6 |
| `mccabe_max` | **4.2** | 4.8 | 4.4 |

B3 costs **+43 % tokens** and **+31 % cost** over B1 while landing *worse* on
`cognitive_max`. The gradient is monotone in cost (5.76 → 6.63 → 8.22 M) and, on the
primary measured metric, monotone in the wrong direction (3.4 → 3.8 → 4.6).

**Rationale.** F-1.4 (RQ-1.11) attributed the +109 % duration of metric-driven
refactoring largely to the model computing APP and McCabe by hand for every function.
The expectation that followed — replace the arithmetic with a script and the cost goes
away — is refuted. The arithmetic was never the expensive part on this route: a tool
call returns its full output into the context (an ESLint JSON report lists every
function; the mass script prints a component table), and that output is re-read on every
subsequent turn. Hand-computed figures, by contrast, appear once as a two-line summary.

The quality direction is the more interesting half. B1 is the arm where the model has to
*derive* the numbers, which means reading the function and tracing its branches — the
same act that reveals whether the function does one thing. B3 reads a number off a tool
and never performs that traversal. On this evidence the measurement's value on Sol lies
in the act of measuring, not in the number's accuracy.

Scope: single route, single kata, n=5 per cell, and the σ on B2 (2.01 M tokens) is wide
enough that B1-vs-B2 is not separated. B1-vs-B3 is separated on tokens (2.46 M apart,
σ 0.96 M and 0.77 M).

---

## F-1.18.4 — The brief costs more wallclock than any measurement added to it

The largest single duration effect in this RQ comes from the elaborated brief, before a
single measurement is prescribed.

| Cell | `duration_seconds` | vs. Basis | `total_tokens` | `cycle_count` |
|---|---:|---:|---:|---:|
| Basis (Four Rules) | 874 ± 92 | — | 4.61 M | 31.6 |
| A (elaborated brief) | 1226 ± 186 | **+40 %** | 4.49 M | 30.6 |
| B1 (A + hand measurement) | 1011 ± 115 | +16 % | 5.76 M | 31.6 |
| B2 (A + ESLint) | 1143 ± 214 | +31 % | 6.63 M | 32.4 |
| B3 (A + tools) | 1181 ± 111 | +35 % | 8.22 M | 34.8 |

Arm A is the *slowest* cell in the field while consuming the *fewest* tokens (4.49 M,
below even the Basis) and running the fewest cycles (30.6). Duration and token cost come
apart completely: adding measurement to Arm A raises tokens by 28–83 % and lowers or
barely raises wallclock.

**Rationale.** Reasoning is on regardless on this route (F-1.3.5), and reasoning tokens
are not billed into `total_tokens` here. A longer, more prescriptive brief with ranked
rules and named prohibitions therefore shows up as thinking time rather than as output
volume — the model spends longer per decision without producing more text. The measured
arms add tool output and measurement prose, which is visible token volume, but the
per-decision deliberation does not stack on top.

Consequence for cost accounting in this lab: `duration_seconds` and `total_tokens` are
not interchangeable proxies on reasoning-on routes, and a brief-length effect is
invisible in the token column. RQ-1.11's +109 % duration and +130 % tokens moved
together because both the vocabulary and the measurement grew; here they are separated
and behave differently.

---

## F-1.18.5 — The per-refactoring measurement mandate is followed partially at best

All three measured arms were instructed that "every refactoring in this workflow is
bracketed by a measurement". None complied.

| Arm | `refactorings_applied` | measurement blocks emitted | tool calls |
|---|---:|---:|---:|
| B1 (hand) | 30–34 | 1–46 | — |
| B2 (ESLint) | 23–40 | 1–36 | 4–9 |
| B3 (tools) | 30–37 | 15–64 | 5–21 app-mass, 2–11 ESLint |

The arms are cleanly separated in *which* instrument they use — B2 never invokes the
mass script, B1 never invokes a tool — so the factor under study is intact. What varies
wildly is *how often*: one B1 run emitted a single measurement block across 30
refactorings, another 46 across 32.

**Rationale.** Two things follow. First, the effects in F-1.18.2 and F-1.18.3 are lower
bounds: they were produced by partial compliance, and a workflow that enforced the
bracket mechanically might separate the arms further. Second, compliance frequency is a
plausible confounder for the σ within each measured cell — B2's wide token σ (2.01 M)
sits alongside a 4-to-9 spread in tool calls.

The measurement instruction is prose in a skill document with no mechanical
enforcement, unlike the phase markers, which the parser rejects runs without. Making the
bracket load-bearing — a marker per measurement — would be the way to test whether full
compliance changes the picture.
