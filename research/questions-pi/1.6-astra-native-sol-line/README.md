---
id: RQ-astra-native-sol
question: "Does the natively-built Sol workflow line (basic-sol-tdd, Predictive TDD) transfer to GPT-6 Astra — or is its advantage over the Opus-derived EXACT line a property of Sol?"
# Route is a constant, not part of the question: every cell runs on the OpenAI
# subscription route (pi provider `openai-codex`), which is encoded in the
# `-codex` model ids. It is binding and non-substitutable — see "Constants of
# the subscription route" in the body before comparing anything here against a
# Requesty-routed RQ.
factors:
  model:
    # Each level is an `{any: [...]}` OR-match over two *label* variants of the
    # same configuration, not over two models. Both spellings resolve to the
    # same pi model through the same pi-config profile with thinking=false
    # (run-batch.sh:819-823, MODEL_CONFIGS lines 134/149/164/165). Canonical
    # entry first — it is the cell label and what a fill plan generates.
    # See "Model `any:` rationale" below.
    - {any: [gpt-6-astra-codex-no-thinking, gpt-6-astra-codex]}
    - {any: [gpt-5-6-sol-codex, gpt-5-6-sol-codex-no-thinking]}
  workflow:
    - v3-basic-tdd-pi               # floor: "use TDD", no architecture, no refactor brief
    - basic-sol-tdd-pi              # native line, refactor inline
    - basic-sol-tdd-subagent-pi     # native line, refactor isolated
    - v6.2.1-phase-continuation-pi  # EXACT line, Opus-derived, APP mass in the refactor brief
controls:
  kata_base: claim-office
  prompt: example-mapping
outcomes:
  # primary: correctness. claim-office is the correctness kata and the spec on
  # which Opus-derived workflows have historically broken (RQ-1.9, RQ-1.10).
  # A cell that drops here disqualifies itself regardless of its quality numbers.
  - verification_pct
  - tests_passing
  - completed_within_budget
  # primary: decomposition — the axis on which the native line beat the EXACT
  # line on Sol (F-1.17.1). This is what "transfer" means for this RQ.
  - cc_avg_loc_per_function
  - cc_median_loc_per_function
  - cc_longest_function
  # secondary quality. cognitive_* and mccabe_* are blind to missing
  # abstraction (see "Metric blind spot") and are read as witnesses, not as
  # the decision.
  - cognitive_max
  - cognitive_avg
  - mccabe_max
  - smell_total
  # mechanism witness: APP mass is what the v6.2.1 refactor brief optimises and
  # what the native line does not name at all. Expected to run *against* the
  # decomposition metrics. Reported without trophy — see RQ-1.17.
  - code_mass
  - cc_functions
  - cc_loc
  # TDD discipline. n/a on the v3 cell (no phase markers). Never read
  # predictions_total on this line or this model — see "Marker caveats".
  - cycle_count
  - refactorings_applied
  - predictions_correct_rate
  # cost. cost_usd is deliberately NOT an outcome: Astra ships without a `cost`
  # block and reads a structural 0 against Sol's measured inline costs, which
  # would fake a landslide. Tokens and wall-clock are the cost signal here.
  - duration_seconds
  - total_tokens
min_replicates: 5
status: aktiv
---

# RQ-astra-native-sol: Does the Native Sol Line Transfer to Astra?

**Route:** all eight cells run on the OpenAI subscription route
(`openai-codex`, Responses API, OAuth). It is held constant and is not a factor
— but it is not substitutable either, and nothing here may be read against a
Requesty-routed RQ without the delta in "Constants of the subscription route".

## The question this answers

Two lines of TDD workflow exist in this lab for the pi harness on the OpenAI
subscription route, and they come from different places:

- The **EXACT line** — `v3` through `v6.x`, developed on Opus, carrying the
  four-marker contract, the Compilation/Runtime prediction form and APP mass in
  the refactor brief. `v6.2.1-phase-continuation-pi` is its current member on pi.
- The **native Sol line** — `basic-sol-tdd-pi` and `basic-sol-tdd-subagent-pi`,
  ported from the `sol_tdd` project (Predictive TDD, Four Rules of Simple
  Design, no mass metric), written independently of the v-chain.

GPT-6 Astra has been measured on the first line only. `RQ-astra-pi`
(questions-pi/1.5) placed it on `v6.2.1-phase-continuation-pi` against Sol,
Opus 5 and the route pair, at n=5 on `game-of-life-example-mapping`. It has
never run on the native line.

That gap matters because the native line is not a neutral alternative — on Sol
it *wins*. `RQ-app-vs-four-rules-sol` (workflow-dev/1.17) measured exactly this
contrast on exactly these controls and found the EXACT line's APP brief
producing the worst decomposition in the field, behind even the structureless
floor, while the Four-Rules line took every decomposition metric:

| Metric | v3 (floor) | basic-sol-tdd | v6.2.1 (EXACT) | Direction |
|---|---:|---:|---:|---|
| `cc_avg_loc_per_function` | 8.45 | **6.60** | 9.52 | kleiner = besser |
| Complexity Peak | 27.0 | **18.0** | 24.0 | kleiner = besser |
| `cognitive_max` | 11.4 | **4.0** | 8.2 | kleiner = besser |
| `mccabe_max` | 9.8 | **5.4** | 6.2 | kleiner = besser |
| Smell Total | 4.2 | **0.0** | 9.6 | kleiner = besser |
| Code Mass (APP) | 750.0 | 556.8 | **492.4** | Mechanismus-Zeuge |
| Correctness (external) | 100 % | 100 % | 100 % | saturated |

F-1.17.1 attributes this to the brief itself: `refactor.md` prices extraction
(**Invocation (Mass: 2)**), so minimising the number the brief names rewards
inlining, and the guard against it ("Rule 2 trumps APP") does not hold on Sol.

**That is a claim about a prompt, and it has been tested on one model.** If it
is really the brief, it should reproduce on Astra. If it does not, the finding
is about Sol, and the workflow recommendation has to split per model.

## Why a separate RQ and not cells in RQ-1.17

`RQ-app-vs-four-rules-sol` controls on the model (`gpt-5-6-sol-codex`). Adding
an Astra row would open the control as an uncontrolled factor, which CLAUDE.md
forbids. This RQ opens it deliberately, as its own 2 × 4 matrix, and is to
RQ-1.17 what `RQ-spark-vs-sol` (questions-pi/1.4) is to RQ-1.16: same line,
same route, model axis opened.

It also picks up the two arms RQ-1.17 left out. RQ-1.17 carries only the inline
native arm; the refactor-isolation contrast lives in RQ-1.16 (F-1.16.3, F-1.16.4).
Both arms are cells here so the isolation question is asked on Astra in the same
batch, at no extra reference cost — the Sol side is filled for both.

## Existing data — half the matrix is already filled

Aggregation is query-based over `experiments/runs/`, so every run whose
(kata, prompt, workflow, model) matches counts regardless of which batch produced
it. On `claim-office-example-mapping`, subscription route (verified 2026-09-05):

| Workflow | Sol (`gpt-5-6-sol-codex`) | Astra (`gpt-6-astra-codex-no-thinking`) |
|---|---:|---:|
| `v3-basic-tdd-pi` | 5 ✅ | **0** |
| `basic-sol-tdd-pi` | 5 ✅ | **0** |
| `basic-sol-tdd-subagent-pi` | 5 ✅ | **0** |
| `v6.2.1-phase-continuation-pi` | 5 ✅ | **0** |

All 20 existing runs exited `ok`. Sol cells come from the RQ-1.16 / RQ-1.17 /
RQ-1.18 batches of 2026-08-16 and 2026-08-17.

**Net new work: 20 Astra runs.** All four Astra cells sit on the `pi-config`
profile, so the fill is a single plan (see "Profile split").

### On including the v3 floor

The floor is not strictly required to answer the transfer question — Astra on
the native line against Astra on the EXACT line would do that in 15 runs. It is
included because without it a native-line win on Astra cannot be separated from
"Astra writes decomposed code under any instruction", and because the whole
reason the native line was built is F-1.6 / F-1.16: on Sol, *no* architecture in
the v-line beats structureless TDD. That claim deserves its second model. The
row costs 5 of the 20 runs and can be struck without touching the rest of the
design.

## Model `any:` rationale

The two spellings inside each level are label variants of one configuration, not
two configurations:

| Lab id | pi `--model` | `--thinking` | MODEL_CONFIGS thinking flag |
|---|---|---|---|
| `gpt-5-6-sol-codex` | `openai-codex/gpt-5.6-sol` | model default | false |
| `gpt-5-6-sol-codex-no-thinking` | `openai-codex/gpt-5.6-sol` | `off` | false |
| `gpt-6-astra-codex` | `openai-codex/gpt-6-astra` | model default | false |
| `gpt-6-astra-codex-no-thinking` | `openai-codex/gpt-6-astra` | `off` | false |

Per F-1.3.5 the flag does not suppress reasoning on this route at all — the
Responses API reasons server-side regardless — so the `-no-thinking` suffix names
a flag, not a reasoning state, and the pair cannot differ in reasoning. This is
the same construction RQ-1.17 and RQ-1.18 use for the Sol level, extended to
Astra.

All 20 existing Sol runs on claim-office carry the bare `gpt-5-6-sol-codex`
spelling, so the OR-match changes nothing about what currently aggregates. It is
declared to keep the RQ robust against a future fill choosing the other spelling,
and to make the label asymmetry between the two levels explicit rather than
accidental.

`gpt-6-astra-codex-no-thinking` is canonical on the Astra level so fill runs
carry the same id as the RQ-astra-pi Astra cell, keeping the two RQs readable
side by side.

## Constants of the subscription route — binding

Inherited from `RQ-route-effect-pi` and `RQ-native-sol-workflows-sub`, unchanged:

- **Reasoning is always on and cannot be switched off** (F-1.3.5). It is a
  constant of this RQ, not a factor, and it is on in every cell including v3.
- **The route is not substitutable for Requesty.** F-1.3.6 establishes a real
  route effect on exactly the metrics measured here, at constant model, harness,
  workflow, kata and prompt style. No cell in this RQ may be compared against a
  Requesty cell from `RQ-model-quality-pi` or RQ-1.14 without going through that
  delta.
- **Throughput is lower than on Requesty** (F-1.3.1: 1.63×). Duration and token
  comparisons *inside* this RQ are valid; against Requesty-routed RQs they are not.
- `codex` in the lab ids names the pi provider `openai-codex` through which the
  subscription is reached — **not** the Codex CLI, which is a separate harness
  unused in this lab.

## Hypotheses

**H1 — The native line transfers.** On Astra, `basic-sol-tdd-pi` beats
`v6.2.1-phase-continuation-pi` on `cc_avg_loc_per_function` and
`cc_longest_function`, in the same direction and of comparable magnitude to the
Sol row, at 100 % `verification_pct`.
→ F-1.17.1 is a property of the APP refactor brief, not of Sol. The brief's
inlining incentive is real across models and the EXACT line needs the fix that
RQ-1.18 explored (subordination), not a per-model exception.

**H2 — The advantage is Sol-specific.** The Astra cells land within noise of each
other, or invert.
→ F-1.17.1 does not generalise. The native line is a Sol-tuned artefact, the
workflow recommendation splits per model, and `research/workflow-dev/model-recommendation-matrix.md`
gains a row rather than a rule.

**H3 — The floor holds on Astra too.** No cell beats `v3-basic-tdd-pi` on
decomposition at equal correctness.
→ The F-1.6 / F-1.16.2 counter-case reappears on a second model, which makes it a
statement about the GPT branch rather than about Sol. Note the Sol row does *not*
show this on claim-office — F-1.16.1 and the RQ-1.17 table both have the native
line clearing the floor decisively here — so an Astra floor-hold would be a
genuine model difference, not a replication.

**H4 — Astra loses correctness on claim-office.** `verification_pct` drops below
100 % in at least one Astra cell.
→ Disqualifying for that cell regardless of its quality numbers, and the first
thing to check: `game-of-life` did not discriminate on correctness for Astra
(F-1.5.6), so claim-office is the first real correctness test this model faces
in the lab. F-1.5.3 gives the reason to expect trouble — Astra writes the least
code and the least decomposed code of the GPT branch, and claim-office is where
under-specification breaks workflows.

**H5 — Refactor isolation reproduces its Sol profile.** The subagent arm buys
nothing on quality and costs substantially more wall-clock and tokens
(F-1.16.3), possibly with the correctness regression F-1.16.4 found.
→ Isolation is a harness-level property, not a model-level one, and the arm can
be retired from the line rather than kept as a per-model option.

## Marker caveats

- **`predictions_total` is not comparable here, on either axis.** Two independent
  reasons stack. On the native line the source methodology forbids manufacturing
  a failure when an earlier generalization already covers the next test, so
  cycles legitimately carry no predictions and `predictions_total ≈ 2 × cycle_count`
  does not hold (MARKERS.md, "Convention for marker 3"). On Astra a separate
  marker inconsistency was seen at 1-in-5 in RQ-astra-pi (F-1.5.5): one run logged
  8 predictions at 13 cycles where its siblings logged 28–30. **Read
  `predictions_correct_rate` only.**
- **TDD-discipline metrics are n/a on the v3 cell**, never 0. v3 prescribes no
  phase markers; `cycle_count`, `refactorings_applied` and
  `predictions_correct_rate` carry no trophy in that column. The parser's
  inferred values are a different construct, not weaker discipline (MARKERS.md,
  "Baseline workflows satisfy marker 4 only").
- **`cycle_count` is not comparable across the marker-based and inferred paths**
  and is reported for context, not ranked.
- **Phase timings and context utilization come back 0 on this route** —
  `avg_cycle_seconds`, `avg_red_seconds`, `avg_green_seconds`,
  `avg_refactor_seconds`, `context_utilization_pct`. Parser gap, not measurement;
  excluded from `outcomes` and not to be reintroduced without fixing the parser.

## Metric blind spot — decomposition

Inherited from RQ-1.14, RQ-1.16 and RQ-1.17, binding here: `code_mass`,
`cognitive_max` and `mccabe_max` all fail to detect missing abstraction, because
Cognitive Complexity resets its nesting counter at every function boundary and
APP has no notion of nesting at all. A single long function built from callback
chains scores *better* on all three than the same logic split into named domain
functions.

**`cc_avg_loc_per_function` is therefore the binding decomposition metric**, with
`cc_longest_function` (Complexity Peak) secondary. Both are immune to the
callback trick. Neither measures naming.

Code Mass (APP) carries **no trophy**. In this RQ it is not a quality metric but
the witness for the mechanism under test: it is what the v6.2.1 brief optimises
and what the native line never names, and F-1.17.1 has it running against the
decomposition metrics. Reporting it as a win would invert the finding. RQ-astra-pi
F-1.5.3 already caught the blind spot crowning Astra in a live cell.

Note that this cuts both ways for H1: `v6.2.1-phase-continuation-pi` names APP
mass in its refactor brief, so the model is optimising a metric this RQ reports.
The native cells name none of the outcome metrics. That asymmetry is the
mechanism, not a flaw in the comparison — but it means Code Mass must never be
read as a cross-workflow ranking.

## Methodological notes

### Profile split — the fill is single-profile

`PI_CONFIG_DIR` is container-global, so the pi-config profile applies to the whole
batch. All four open Astra cells sit on `pi-config`, so the fill batch is a single
plan. No cell in this RQ uses `pi-config-reasoning`.

### OAuth expiry — check before filling

`pi-config/agent/auth.json` is gitignored, host-provisioned and expires. The token
in place on 2026-09-05 runs to **2026-09-15**. A token expiring mid-batch kills the
affected runs on auth, not on a model error:

```bash
python3 -c "import json,datetime;print(datetime.datetime.fromtimestamp(json.load(open('experiments/docker/pi-config/agent/auth.json'))['openai-codex']['expires']/1000))"
```

### Astra has never run claim-office

Every Astra run in the pool is `game-of-life`. claim-office is a CLI kata scored
by an external acceptance suite (`verification_pct`) and needs `cli_built` to be
true. **Check the first Astra run's `cli_built` and `verification_pct` before
committing the remaining 19** — a structural failure to produce the CLI would
read as a correctness collapse and waste the batch.

### n=5

Follows memory [[replicates-n-reliability]] (default for a medium field). It is
also what every cell of the Sol row carries, so the two rows are balanced.

## Caveats

1. **Model and date are fully confounded.** Every Sol cell was recorded on
   2026-08-16/17; every Astra cell will be recorded on or after 2026-09-05. Any
   drift on the subscription route in that window sits entirely inside the model
   factor. There is no cell in the current design that can separate the two.
   → **Optional drift probe:** refill one Sol cell (`basic-sol-tdd-pi`, the
   reference arm) alongside the Astra fill, +5 runs, and compare against its
   August values. Worth running if any H1/H2 result lands close to the noise
   floor; unnecessary if the model separation is large.
2. **`cost_usd` must not be read from `runs.csv`.** Astra's `models.json` entry
   ships without a `cost` block — its tariff is unknown and copying Sol's would
   fabricate it — so Astra reports a structural 0, while the Sol codex cells carry
   measured inline costs from the Responses API. Astra would read as free. On a
   flat-rate subscription no per-token charge is incurred by either model anyway.
   Token counts and wall-clock are the cost signal.
3. **Astra's declared context window is inherited, not confirmed.**
   `contextWindow` 272000 / `maxTokens` 128000 in `models.json` are the GPT-5.6
   family defaults. claim-office is the largest kata in the lab (Code Mass
   758–997), so this RQ is the first to put Astra under real context pressure.
   Under-declaring is safe; verify upstream before reading any context-pressure
   result.
4. **The native line is an adaptation, not the source methodology.** The
   `sol_tdd` skills carry a human-in-the-loop autonomy agreement that was removed
   for unattended measurement, and markers P1–P7 were added where the source
   prescribes none. Both changes are confined to a `LAB-ONLY` block. A difference
   against the EXACT line could in principle come from the adaptation rather than
   the methodology — it is the first thing to check should a cell behave
   anomalously.
5. **One prompt style.** example-mapping, consistent with RQ-1.16, RQ-1.17 and
   every previous architecture comparison. Nothing here speaks to prose or
   user-story.
6. **No continuation overlay on the native or v3 cells.** v3 has no phase
   boundaries to stall at; the native line carries its own phase-continuation
   section inside its `LAB-ONLY` block; only `v6.2.1-phase-continuation-pi` carries
   the overlay by name. Systematic `completed_within_budget = false` in any cell
   is read as a harness stall, not as a workflow effect.
7. **The `-cc` sibling is not in this RQ.** `basic-sol-tdd-cc` exists with
   claim-office runs on `opus-5-no-thinking` and `opus-4-8-no-thinking`. Those are
   a different harness and a different route and must not be pooled into any cell
   here; they are a separate cross-harness question.

## Open questions

- If H1 holds: does the subordinated brief from RQ-1.18
  (`basic-sol-tdd-app-pi` and the three `-measured-` variants) behave the same way
  on Astra, or is the subordination fix Sol-tuned as well? That is a 4-cell
  follow-up on the same kata and route, with the Sol side already filled at n=5.
- If H2 holds: what in the native line is Sol-specific — the Four-Rules brief, the
  prose prediction form, or the absence of a mass metric? The three are bundled in
  these cells and would need separating.
- Does the Astra marker inconsistency (F-1.5.5, 1-in-5 on game-of-life) persist on
  claim-office, and does it scale with kata size?
- `game-of-life` is filled for Astra on the EXACT line but not on the native line.
  Adding the two native cells there (10 runs, Sol side filled) would give the
  size/novelty contrast that F-1.16.5 leaves open, now on a second model.
