# Workflow Construction

Single source of truth for TDD workflows in this repo. Three levels in one file:

1. **[Inventory](#inventory)** — which workflow variants are active, and for what?
2. **[Methodology](#methodology)** — how do you build a new workflow / a reduction RQ?
3. **[Supporting findings](#supporting-findings)** — which RQ results back the methodology?

Sibling docs:
- `experiments/workflows/MARKERS.md` — hard parser requirements (skill invocations, "Red Phase Complete" string, prediction lines, `experiment-done.txt`).
- `research/workflow-dev/model-recommendation-matrix.md` — recommended workflow per model.
- `research/kata-design/kata-construction.md` — kata methodology.

The workflow files of the pre-hybrid-v2 generation + the first reduction chain (v6.5.x, v6.6-leaner) live under `experiments/workflows/_archive/`. The corresponding RQ directories of the oneshot-v1 generation were deleted on 2026-08-11 (commit `953841cb`) and are only reachable through the git history. Findings from that chain are not carried into this file — the chain was correctness-defective (see the anti-pattern "Bundle reduction without a correctness sample" below), and all subsequent iterations ran on a broken workflow. The current hybrid-v2 line is the restart on a repaired base.

---

## Inventory

### Generations — architecture axis

| Variant | Mechanics | Status / use |
|---|---|---|
| `baseline-oneshot-v1-cc` | single-shot, no TDD structure | control for the TDD effect |
| `baseline-iterative-v1-cc` | iterative, no explicit phases | control |
| `baseline-inline-tdd-v1-cc` | inline TDD, no skill, no subagent | TDD baseline |
| `exact-subagents-v1-cc` / `exact-subagents-v2-testlist-fix-cc` | all phases as Task subagents (isolated) | maximum isolation; subagents-v2 additionally has the "Cover every spec example" obligation in the test-list |
| `exact-single-context-v1-cc` / `exact-single-context-v2-testlist-fix-cc` | everything in one context | lowest tokens, discipline collapse on long katas |
| `exact-hybrid-v1-cc` | red/green as skills, refactor as an isolated subagent | first hybrid variant (correctness-defective after the skill-creator intervention in v6.5-lean, see anti-patterns) |
| `exact-hybrid-v2-testlist-fix-cc` | exact-hybrid-v1-cc + test-list scope fix | **current default base for reduction RQs** |
| `exact-green-refactor-v1-cc` / `v7.1-...-testlist-scope-fix` | green and refactor isolated | Pareto-dominated by hybrid-v1 (RQ-context, oneshot-v1 archive) |
| `baseline-end-refactor-only-v1-agent-cc` / `baseline-end-refactor-only-v1-native-cc` | oneshot + end refactor (vibe-coding control) | control for "periodic TDD vs end refactor" |
| `basic-sol-tdd-*` (8 variants) | Predictive TDD from the `sol_tdd` project. Reference `exact-sol-v1-pi` (pi-native, refactor inline), subagent arm, four APP/measurement variants, Claude Code port, full stack-profile extraction | foreign-methodology import, see its own section below |
| `exact-tcr-v1-pi` | complete inactive test list, then native-git TCRDD with commit-or-revert for red, green and refactor in the shared pi context | first-party lab port from `exact-coding-exercises/.pi` version `2026-09-13`; autonomous, with P1–P7 markers; empirical reference in RQ-1.7 |
| `exact-tcr-v1.1-srp-pi` | `exact-tcr-v1-pi` plus a qualitative SRP check in the refactor; concrete TypeScript/Vitest and Java/JUnit/Maven application only in the stack profiles | factor-isolated SRP variant; `RQ-srp-effect-exact-tcr-sol`: correctness intact, no consistent decomposition/complexity gain, more Production LoC on GoL, fewer tokens/cost on claim-office; not recommended as an upgrade |
| `exact-tcr-v1.2-domain-responsibility-pi` | operationalises SRP as a mandatory domain-responsibility review: name the responsibility in ubiquitous language, check independent policy change axes and explicitly prioritise intent-revealing domain boundaries over Fewest Elements; no DDD pattern obligation, stack profiles unchanged versus v1.1 | `RQ-srp-effect-exact-tcr-sol`: on claim-office shorter average functions and more policy-named refactor commits than v1.1 at full correctness, but no Complexity Peak gain and cost back at v1 level; no decomposition gain on GoL |
| `exact-tcr-v1.3-domain-boundary-trial-pi` | v1.2 plus a mandatory trial of the strongest plausible domain-boundary candidate through TCR commit-or-revert; change counter-check against broad umbrella terms, concrete semantic moves and domain-specific before/after evidence; stack profiles unchanged | `RQ-srp-effect-exact-tcr-sol`: on claim-office clear decomposition (avg LoC/function 7.03→5.67, Complexity Peak 17.2→14.2, refactor commits 3.8→9.4) at full correctness, but +35 % duration and +29 % Production LoC; no resolved quality gain on GoL; quality-oriented claim-office variant, not a general default |
| `exact-tcr-v1.4-domain-boundary-app-pi` | v1.3 plus a qualitative APP review after the domain boundary decision and its own APP TCR trial; rules 1–3 and retained domain boundaries take precedence, no full in-run measurement; stack profiles unchanged | `RQ-srp-effect-exact-tcr-sol` | No APP gain: Code Mass (APP) on claim-office 568.4→571.8, on GoL 165.8→163.2, each within the spread; full correctness and decomposition are preserved, claim-office Production LoC drops to 134.8 at higher variance. Guard safe, APP largely inert; no default |

### `basic-sol-tdd` pair (import from `sol_tdd`, pi)

The source is the `predictive-tdd` and `test-list` skills of the `sol_tdd` project.
The line sits **outside** the oneshot-v1–v9 chain: it is not a reduction step,
but an independently developed TDD methodology that was made measurable here.

Content differences to the hybrid-v1 line:

- **Predictions are prose, not a form.** The rule is "before every
  deterministic check, state a falsifiable expectation", not
  "fill in the compilation/runtime block". The two verbatim prediction lines
  are only the *mechanical summary* of the prose expectation here — needed
  for P5/P6, but not the methodology itself.
- **Refactor only knows the Four Rules of Simple Design.** No APP mass computation,
  no metric-driven end-refactor pass. This deliberately omits the before/after
  obligation protected under "Supporting content" point 4 — a difference
  that a comparison against hybrid-v4/hybrid-v5 measures directly.
- **Red is behaviour-defined.** A valid red fails because the
  active behaviour is missing; the compilation scaffold is a means, not a phase of its own.

Two lab adaptations versus the source: the human-in-the-loop autonomy
agreement was dropped (the harness runs unattended; the escalation rules
instead resolve to "name the most defensible reading and continue"),
and the markers from `MARKERS.md` were added. Both live in the LAB-ONLY block or
are documented there, so that an export can restore the source semantics.

The two variants differ **solely** in where the
Four-Rules review runs — inline in the main context (`## Refactor` text marker) or
in an isolated `subagent` (tool call as the signal). That is the architecture
axis, isolated on a foreign methodology.

#### Relation to RQ-architecture-axis-sol-pi (1.14) — binding

The architecture axis is **already measured** on Sol/pi: RQ-1.14, 50 runs,
10 cells × n=5, inline-tdd-v1 / subagents-v2 / single-context-v2 / hybrid-v2 / hybrid-v6 × claim-office + game-of-life,
prompt style `example-mapping`, model `gpt-5-6-sol`. Anyone evaluating the `basic-sol-tdd` pair
must read that RQ first — it sets the frame.

Its core finding (F-1.6) is sharper than a mere caveat: on game-of-life,
**structureless inline-tdd-v1 wins nearly every quality metric** against every architecture,
at 100 % correctness in all cells and 2.8–4.1× lower cost. On
claim-office, inline-tdd-v1 also reaches 100 % `verification_pct` — at 229 s against
1185 s (hybrid-v2) and $1.18 against $9.52. The RQ had named this outcome in advance as the H4 counter case:
in that event the honest recommendation is inline-tdd-v1.

**What the pair nevertheless adds.** RQ-1.14 varies the architecture *within*
the opus line; the step single-context-v2 → hybrid-v2 changes refactor isolation **and**
skill structure at once. The `basic-sol-tdd` pair holds a foreign methodology
constant and varies **only** inline vs subagent. This isolates
the refactor-isolation effect that is confounded in RQ-1.14.

Connection to a concrete open point in F-1.6: there the isolated
refactor subagent (hybrid-v2) does *not* deliver on Sol the extraction it exists for —
inspected runs leave a triply nested loop standing that the
inline-tdd-v1 floor names. On opus-4-7 the same subagent extracts (F-1.10). F-1.6 calls
that a model-architecture interaction. The pair checks whether the effect also
appears when the refactor brief comes from a different methodology (Four Rules
without APP instead of the hybrid-v1 refactor agent).

**Driver RQ: `RQ-native-sol-workflows-sub`** (`workflow-dev/1.16-native-sol-workflows-subscription/`),
3 cells × 2 katas × n=5. It deliberately runs **not** as an extension of RQ-1.14,
but standalone on the OpenAI subscription route (`gpt-5-6-sol-codex`):
RQ-1.14 controls on `gpt-5-6-sol` (Requesty), and RQ-route-effect-pi F-1.3.6
documents a real route effect on exactly the quality metrics measured here
(Complexity Peak 4.0 against 8.0/9.0, Smell Total 0.0 against 2.0) — demonstrably not a
reasoning effect. Mixing would confound the lineage comparison with the transport,
and in exactly the direction in which the native line is expected to move.

That is why the new RQ carries its **own inline-tdd-v1 floor** on the sub route —
`baseline-inline-tdd-v1-pi × gpt-5-6-sol-codex` had zero existing runs, the RQ-1.14 numbers
are not transferable. Without that floor the core question ("does the native
line beat inline-tdd-v1?") would be unanswerable, because F-1.6 shows: on Sol, inline-tdd-v1 is not a weak
comparison point but the reigning winner.

The two smoke runs (`game-of-life-prose`) belong to no cell — wrong
prompt style, they only document the marker mechanics.

**Status: RQ-1.16 is answered.** The inline-tdd-v1 floor does *not* hold everywhere — on
claim-office the native line beats it clearly, on game-of-life and
sphinx-score it does not. The consequences are in the next section.

#### `predictions_total ≈ 2 × cycle_count` does not hold here

The MARKERS.md convention "two prediction lines per cycle" assumes that
every cycle goes through a real red. This line systematically produces
**already-green cycles**: the source rule explicitly forbids fabricating a failure
when an earlier generalisation already covers the next test
("do not manufacture a failure"). Such cycles count in
`cycle_count`, but correctly contribute no predictions.

The smoke run shows this clearly (`game-of-life-prose` × `gpt-5-6-sol-codex`,
n=1 per variant):

| | `exact-sol-v1-pi` | `exact-sol-v1.1-subagent-pi` |
|---|---|---|
| `phase_source` | `text-markers` | `subagents` |
| `cycle_count` | 10 | 9 |
| `refactorings_applied` | 10 | 10 |
| `predictions_correct` / `_total` | 8 / 8 | 12 / 12 |
| red phases total | 10 | 9 |
| of those with a formal prediction block | 4 | 6 |
| of those explicitly already-green | 3 | 3 |
| rest (prose prediction without the two lines) | 3 | 0 |
| `verification_pct` | 1.0 | 1.0 |
| `lines_of_code` | 43 | 37 |
| `code_mass` | 142 | 144 |
| `cognitive_max` | 4 | 4 |
| wallclock (batch log) | 320 s | 715 s |
| `cost_usd` | 1.18 | 1.43 |

Both `tests_passing` true, `exit_reason: ok`. At n=1 per cell only
the marker mechanics are load-bearing, not the quality or cost difference —
the subagent arm costs roughly twice the wallclock here, which fits the known
architecture cost curve but carries no claim at a single run.

The gap between red phases and prediction blocks has **two** causes that
must be kept apart:

1. **Already-green (3 of 10 resp. 3 of 9) — methodologically correct.** The
   source rule forbids fabricating a failure; for this case the workflow prescribes
   its own block without prediction lines.
2. **Prose prediction without the two formal lines (3 of 10 in variant A,
   0 in variant B) — a genuine compliance loss.** The model states the
   expectation as running text ("I predict TypeScript resolution succeeds …") and
   does not follow up with the `Red Phase Complete:` block. These cycles should have
   carried predictions.

Point 2 is the price of the source methodology defining predictions as prose
while the two lines are only bolted on afterwards — unlike in
the hybrid-v1 line, where the form *is* the prediction. Should this be confirmed over more
runs, the lever is the verbatim note in the `red` position (see
"Supporting content" point 2), not more prose.

A low `predictions_total` on this line is therefore **not a
compliance break** but a property of the methodology. Anyone comparing it against the
hybrid-v1 line must use `predictions_correct_rate` (share) instead of
`predictions_total` (absolute count) — otherwise they measure the frequency of
already-green steps instead of prediction discipline.

Side finding for the pi parser mechanics: `## Red` and the associated
`Red Phase Complete:` block land in **separate** assistant blocks here.
Only because `parse_pi_transcript.py` works with `loose_gate=True` are the
predictions counted at all (P5 note in `MARKERS.md`).

#### Variants of the Sol line and their status (RQ-1.16 through RQ-1.18, RQ-1.21)

The pair has grown into ten workflows. They share the methodology, markers and the
two lab adaptations and differ in the refactor brief, in where it
runs, or in the completeness of the already existing stack-profile boundary.
`exact-sol-v1.3-stack-profile-pi` changes no refactor brief: the variant
only moves the remaining TypeScript/Vitest details out of `AGENTS.md` and the
test-list skill into the stack profile. `RQ-stack-profile-extraction-sol` found no
correctness or completion regression on two katas at n=5 per cell
and continues to support the variant as the lean/budget line. The numbers of the refactor variants
below come from `claim-office-example-mapping` × `gpt-5-6-sol-codex`
(OpenAI subscription route), n=5 per cell; the stack-profile finding additionally covers
game-of-life and is reported per kata.

| Variant | What differs vs `exact-sol-v1-pi` | Driver RQ | Core finding |
|---|---|---|---|
| `exact-sol-v1-pi` | — (reference: refactor inline, Four Rules only, no mass metric) | [RQ-1.16](1.16-native-sol-workflows-subscription/findings.md), [RQ-1.17](1.17-app-vs-four-rules-sol/findings.md) | Empirical reference and parent variant of the lean/budget line; best or joint-best decomposition in the original refactor variant field at 100 % correctness |
| `exact-sol-v1.1-subagent-pi` | Four-Rules review in an isolated `subagent` instead of inline | [RQ-1.16](1.16-native-sol-workflows-subscription/findings.md) | **Rejected.** No quality advantage on any of the three katas, 1.9–2.7× wallclock, last place in Correctness (external) on both novel katas (F-1.16.3, F-1.16.4, F-1.16.8) |
| `exact-sol-v1.2-app-pi` | APP mass subordinated under Rule 4, qualitative; rule order explicitly marked as binding | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | No gain. Prevents the APP damage (F-1.17.1) but produces no advantage — and at 1226 s is the **slowest** cell in the field at the fewest tokens (F-1.18.1, F-1.18.4) |
| `exact-sol-v1.2.1-measured-model-pi` | + before/after measurement, model computes all three metrics by hand | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Takes `cognitive_max`/`cognitive_avg`/`mccabe_max` — for +16 % wallclock and +25 % tokens (F-1.18.2) |
| `exact-sol-v1.2.2-measured-eslint-pi` | + ESLint for cognitive/McCabe, mass still by hand | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Worst decomposition of the measurement arms at +31 % wallclock and +44 % tokens |
| `exact-sol-v1.2.3-measured-tool-pi` | + ESLint **and** AST script (`.pi/tools/app-mass.mjs`); the model computes nothing | [RQ-1.18](1.18-app-subordination-and-measurement-sol/findings.md) | Most expensive cell (8.22 M tokens, +78 %) without a better measurement result than hand computation (F-1.18.3) |
| `exact-sol-v1-cc` | Port to Claude Code (`.claude/commands/` + `rules/`) instead of `.pi/skills/` | — | Different harness and different route. Runs exist on `opus-5-no-thinking` and `opus-4-8-no-thinking`; do **not** pool with the pi cells |
| `exact-sol-v1.3-stack-profile-pi` | Remaining TS/Vitest details moved into the existing stack profile; no new runtime boundary | [RQ-stack-profile-extraction-sol](1.21-stack-profile-extraction-sol/findings.md) | **Lean/budget line.** 20/20 fresh runs internally and externally correct; completion invariant; remaining differences mostly within the replicate spread, lower Complexity Peak on claim-office |
| `exact-sol-v1.4-domain-boundary-trial-pi` | On the local-git-controlled v1.3 snapshot: the same domain-responsibility/boundary trial as exact-tcr-v1.3, but via predictive predict/check/undo without TCR method commits; stack profiles unchanged | `RQ-srp-effect-exact-tcr-sol` | Full correctness; on claim-office useful but variable decomposition (13.0 ± 2.2 functions) and faster than TCR + trial, while TCR + trial decomposes more consistently and more strongly (15.4 ± 0.9, lower `mccabe_avg`); on GoL no resolved methodological difference. No general replacement for the Predictive main line |
| `exact-sol-v1.5-tcr-parity-domain-trial-pi` | Direct method transfer from exact-tcr-v1.3: the full test-list, domain-boundary, stack and lab contract is preserved; only TCR commit-or-revert is replaced by predictive prediction/check/narrow-undo; no APP | `RQ-tcr-ptdd-parity-claim-sol` | **Main line for large, novel specs.** Reproduces TCR on claim-office without method commits: avg LoC/function 5.69 vs. 5.67, functions 15.6 vs. 15.4, Code Mass (APP) 564.8 vs. 568.4, cycles 35.2 vs. 36.0; TCR complexity advantages stay within the spread. Non-git source context is the stronger mechanism; the parity port does, however, inherit TCR's token profile |

##### What the RQs show together

**The line beats the opus line on its own turf (RQ-1.17).** With model,
kata and prompt style held constant, `exact-sol-v1-pi` wins every decomposition metric
against `exact-hybrid-v4.2-phase-continuation-pi` — and against the inline-tdd-v1 floor as well:

| Metric | inline-tdd-v1 (floor) | `exact-sol-v1-pi` | `hybrid-v4.2` (opus line) | Direction |
|---|---:|---:|---:|---|
| `cc_avg_loc_per_function` | 8.45 | **6.60** | 9.52 | lower = better |
| Complexity Peak | 27.0 | **18.0** | 24.0 | lower = better |
| `cognitive_max` | 11.4 | **4.0** | 8.2 | lower = better |
| `mccabe_max` | 9.8 | **5.4** | 6.2 | lower = better |
| Smell Total | 4.2 | **0.0** | 9.6 | lower = better |
| Code Mass (APP) | 750.0 | 556.8 | **492.4** | mechanism witness |

The mechanism is the refactor brief itself. The opus line's `refactor.md` prices
extraction (**Invocation (Mass: 2)**) — an extracted function is charged twice,
once for existing and once per call site. Mass minimisation
therefore rewards inlining, and the cell does exactly that: least code, cut into the fewest
pieces (6.6 functions against 9.8). The built-in protection against this
("Rule 2 trumps APP: Clarity over low mass") does not hold on Sol.

**Nothing added since then has paid off (RQ-1.18).**
Four variants, all at 100 % correctness, none better than the bare reference:
the base holds `cc_avg_loc_per_function` (level with arm A, both within 1 σ),
`cc_median_loc_per_function`, Production LoC and duration on its own. The measurement arms
take `cognitive_max` and `mccabe_max` — for +16–35 % wallclock and +25–78 % tokens
against the base. F-1.18.1 in one sentence: subordination prevents the damage
but produces no gain.

Two side findings that hold beyond the Sol line:

- **Duration and tokens are not interchangeable cost proxies on reasoning-on routes
  (F-1.18.4).** Arm A is the slowest cell at the *fewest* tokens: a
  longer, more prescriptive brief shows up as thinking time, not as
  output volume. A brief-length effect is invisible in the token column.
- **Prose rules without mechanical enforcement are followed partially at best
  (F-1.18.5).** All three measurement arms were instructed to bracket *every* refactoring with
  a measurement; one B1 run delivered a single measurement block across 30
  refactorings, another 46 across 32. The effects in F-1.18.2/F-1.18.3 are therefore
  lower bounds. The lever would be a marker per measurement — like the phase markers,
  without which the parser discards a run.

##### Recommendation

- **Large, novel specs (claim-office-like) on Sol/subscription: `exact-sol-v1.5-tcr-parity-domain-trial-pi`.**
  The Predictive TDD line takes over the full test-list, stack and
  domain-boundary contract from TCR-v1.3, but replaces commit-or-revert with
  prediction/check/narrow-undo. On Claim Office it holds 5/5 full correctness
  and achieves, at practically the same wallclock as the lean v1.3 main line, a
  stronger domain decomposition (`cc_avg_loc_per_function` 5.69 instead of 7.69); the price
  is roughly 32 % more tokens. RQ-tcr-ptdd-parity-claim-sol shows at the same time that
  TCR method commits are not necessary for this average decomposition.
- **Small or training-familiar katas (game-of-life, sphinx-score) on Sol/subscription:
  `baseline-inline-tdd-v1-pi`.** The native line does not beat the floor there and costs 3.2×
  (GoL, F-1.16.2) resp. 3.6× (sphinx, F-1.16.7) more. On sphinx for a different reason
  than on GoL: there the metrics resolve nothing at all.
- **The older subagent, APP and measurement variants are not recommended as a default.**
  The subagent arm is rejected, the four APP/measurement variants are cost-neutral to
  more expensive with no quality return. The domain-boundary trial of the v1.5 main line is
  separate from that: it materialises domain boundaries and is backed by the direct
  TCR/PTDD parity test.
- **Do not use `sphinx-score` for workflow comparisons on Sol** (F-1.16.7). As a
  cheap correctness probe it remains usable. Before cells on a new
  kata-model pair: check `cc_functions` on a single probe run — a mean
  near 1 means no decomposition metric will resolve anything.

##### Open fronts

- **Model axis.** Everything above is measured on **one** model (`gpt-5-6-sol-codex`).
  [RQ-spark-vs-sol](../questions-pi/1.4-spark-vs-sol/findings.md) has opened the axis on
  sphinx (Spark does not hold correctness),
  [RQ-astra-native-sol](../questions-pi/1.6-astra-native-sol-line/) opens it on
  claim-office for GPT-6 Astra — testing whether F-1.17.1 is a property of the
  brief or a property of Sol.
- **Route.** Whether F-1.16.1 survives on the Requesty route or is entangled with the route effect
  (F-1.3.6) is open — the claim-office cells would have to rerun on
  `gpt-5-6-sol`.
- **Size vs. novelty.** The inversion between claim-office and game-of-life is
  documented, its cause is not: `sphinx-score` was intended as a novelty control and
  resolved nothing (F-1.16.7). A genuine mid-size kata (`claim-office-lite`) is outstanding.
- **Where the reference's advantage comes from** — methodology or the absence of APP — is
  not separated. The test would be to swap the opus line's APP brief into the native line
  at constant architecture.

### hybrid-v2 reduction line (currently active)

All variants live under `experiments/workflows/exact-coding/opus/exact-hybrid-v2*` and differ only in the five workflow files (`commands/test-list.md`, `commands/red.md`, `commands/green.md`, `agents/refactor.md`, `rules/tdd.md`). Settings, markers and subagent mechanics are identical to `exact-hybrid-v2-testlist-fix-cc`.

| Variant | What differs vs base | Driver RQ | Core finding |
|---|---|---|---|
| `exact-hybrid-v2-testlist-fix-cc` | — (base) | — | Full MUST/CRITICAL/🚨 imperatives + PEP + emoji |
| `exact-hybrid-v2.1-no-pep-cc` | "Psychological Resistance" section and motivational inline comments in red/green removed | [RQ-1.1](1.1-pep-effect-v6.1/findings.md) | Correctness invariant on GOL; +67 % refactorings, +30 % wallclock. **On claim-office −3 pp correctness** (RQ-1.4) |
| `exact-hybrid-v2.2-no-emoji-cc` | 95 decoration emojis (✅❌🔴🟢🔄📋🚨⚠️) removed | [RQ-1.2](1.2-emoji-effect-v6.1/findings.md) | Correctness invariant on GOL; +29 % refactorings, **saves NO tokens** (even +8.5 %). **On claim-office −20 pp correctness** (1× complete failure, RQ-1.4) |
| `exact-hybrid-v2.3-no-pep-no-emoji-cc` | both reductions combined | [RQ-1.3](1.3-pep-emoji-combined-v6.1/findings.md), [RQ-1.4](1.4-pep-emoji-claim-office/findings.md) | Effects not additive; combined it refactors *below* baseline. **On claim-office −5 pp correctness** |
| `exact-hybrid-v2.9-stack-profile-cc` | all concrete TS/Vitest details from core, phases and refactor agent moved into the existing `tdd_with_ts_and_vitest.md`; no new file boundary | `RQ-stack-profile-extraction-opus` | **Open.** Tests whether the existing profile boundary can be made complete without behaviour loss |
| `exact-hybrid-v3-with-why-cc` | 3 why blocks from v6.5-lean (green.md, red.md Step 7, rules/tdd.md) **with MUSTs fully preserved** | [RQ-1.5](1.5-why-block-effect-v6.1/findings.md) | Correctness invariant on claim-office (1× outlier 0.27); +87 % refactorings, −87 % smells, Complexity Peak −37–43 % at σ −82–90 %; +53 % wallclock, +22 % tokens |
| `exact-hybrid-v4-cleaned-cc` | exact-hybrid-v3-with-why-cc + 3 hygiene cleanups from the archived v6.5.1 audit (`pnpm test:unit:basic`→`pnpm test`, rule-file hyphen, settings permission dedup; `refactor.md` role-neutral; `tdd-experiment-mode.md` without phantom HITL framing) | [RQ-1.6](1.6-v62-cleanup-validation-v61-with-why/findings.md) | Correctness not worse (mean 0.91→0.96 incl. hybrid-v2 nudge outlier); +34 % refactorings, cycle_count spread σ 14.2→1.6; +13 % wallclock, +12 % tokens. Cleanups behaviour-equivalent, **new default baseline** |
| `exact-hybrid-v4.3-audit-bundle-cc` | exact-hybrid-v4-cleaned-cc + remaining audit-bundle items from the archived v6.5.1 audit: **class 2** rationale additions (measurement-pipeline rationale for mandatory refactoring, bisectability for ONE-at-a-time, concrete three-path bar for "no improvement possible", green-phase generalization rationale in test-list Step 3) + **class 3** red-phase hardening (mandatory-procedure preamble, removal of "STOP and explain" in Steps 3/6, replacement "Prediction Failure Protocol" → "Wrong Predictions Are Data"). Plus an opt-in `HUMAN-IN-THE-LOOP.md` in the workflow root for non-autonomous profiles (prediction failure → human escalation). | [RQ-1.8](1.8-audit-bundle-effect-v62/findings.md) (GoL) + [RQ-1.9](1.9-audit-bundle-validation-claim-office/findings.md) (claim-office) | **GoL (RQ-1.8):** correctness invariant (100 % `tests_passing`); `tests_passed_immediately` 0.7 → **0** (deterministic); `refactorings_applied` +10 % at σ −64 %; code quality within 1 σ (slight improvement in Code Mass (APP)/Smell Total); `predictions_correct_rate` 100 → 97.4 %; +16 % tokens, wallclock neutral. **claim-office (RQ-1.9): `verification_pct` flips 0.96 → 0.35 (bi-modal, 6/8 runs ≤ 0.30)** — the agent declares itself done after 7–14 cycles instead of 37–38 cycles as with hybrid-v4; `experiment-done.txt` is missing in 6/8 runs. Do **not** promote as the default baseline for claim-office — remains a GoL-specific quality champion |
| `exact-hybrid-v4.1-refactor-vocab-cc` (**rejected**) | exact-hybrid-v4-cleaned-cc + an additive vocabulary block in `refactor.md` (cyclomatic + cognitive complexity, single responsibility, smell→move table with 10 entries) between naming evaluation and Rule 3. Naming, APP, process steps, examples, red flags byte-identical. No numeric thresholds. | [RQ-1.10](1.10-refactor-vocab-effect-v62/findings.md) | **claim-office: `verification_pct` 0.96 → 0.23 (4/5 runs ≤ 0.13, 1/5 at 0.93)** — the agent self-terminates after 7-22 instead of 36-40 cycles, `code_mass` halved. Same bundle-kata asymmetry pattern as exact-hybrid-v4.3-audit-bundle-cc. **GoL:** complexity metrics within 1 σ of the baseline (no robust gain), +12 % `code_mass`, +14 % wallclock, +15.5 % tokens. Goodhart caveat: `cognitive_*`/`mccabe_*` are explicitly named in the block → compliance metrics, asymmetric comparison. **Rejected**; exact-hybrid-v4-cleaned-cc remains the default |

### Supporting content — protect before every reduction

1. **Four markers from `MARKERS.md`** (skill tool invocations; `Red Phase Complete` sentinel; prediction lines via regex `(- |✅ |❌ )(Correct|Incorrect)`; `experiment-done.txt`).
2. **Predictions verbatim block in `red.md` Step 7** — without it, cycles merge the two prediction lines into one and `predictions_total` halves.
3. **"Mandatory refactoring attempt" in `refactor.md`** — without an explicit obligation the model skips the refactor phase on simple tests; `refactorings_applied` drops.
4. **APP mass computation in `refactor.md`** — not for the metric (that is computed externally), but because the explicit before/after comparison forces the model to make refactorings *measurable* instead of merely cosmetic.
   - **Model caveat (binding):** This holds for the hybrid-v1 line on Opus. On Sol/pi the effect inverts — RQ-1.17 F-1.17.1 measures the same brief as the *cause* of the worst decomposition in the field, worse than the structureless inline-tdd-v1 floor, because the mass table prices extraction and thereby rewards inlining. Point 4 is therefore not a model-portable safeguard but an Opus observation. To be validated before adopting it on a new model.

### Current front

- **Default for correctness-critical work (exact-coding baseline) on opus-5-no-thinking × Claude Code:** `exact-hybrid-v2-testlist-fix-cc` (RQ 4.5 / RQ-workflow-reduction-opus5, carrier decision from RQ-1.19). The rationale is in the sub-points below — it is deliberately kept out of this line because the exact-coding-baseline-export skill pulls the workflow name from exactly this line by backtick match and it may therefore carry exactly one backtick name.
  - The exact-coding profile is a **trade-off of quality against duration**: high quality counts, but not at any price. The hybrid-v2 line hits that point best on opus-5 — it delivers **86 % of hybrid-v6's decomposition gain at 47 % of the wallclock and 60 % of the tokens** (claim-office: `cc_avg_loc_per_function` 4.04 against v6.6's 3.21, at 9.18 for structureless inline-tdd-v1; 44 min against 93 min). The step to hybrid-v6 buys the last 14 % with +111 % wallclock — that is the point at which the trade-off tips.
  - **Measurement basis and export carrier are the same file again.** Until 2026-09, `exact-hybrid-v2.4-lab-split-cc` was the carrier because its file layout simplified the export: lab infrastructure isolated in `rules/lab-only.md`, which only had to be deleted on export. RQ-1.19 priced that convenience and reversed the choice. The export therefore goes the classic route again — `rules/tdd-experiment-mode.md` is not copied but replaced by `templates/tdd-execution-mode.md`, which reproduces the subagent prompt contracts. The skill detects this itself (`SKILL.md` Step 1: no `lab-only.md` → `LAYOUT=legacy`); no rebuild is needed.
  - **The rule split costs, and does so independently of text volume.** RQ-1.19 (`research/workflow-dev/1.19-lab-split-neutrality/`, four workflows, claim-office n=13/10/5/5) measures on claim-office a refactor rate of 0.41 (hybrid-v2) against 0.52 (hybrid-v2.8), 0.56 (hybrid-v2.7) and 0.69 (hybrid-v2.4), at practically equal cycle counts. The decisive case is `exact-hybrid-v2.8-pure-split-cc`: a pure partition of hybrid-v2 at **+3.5 % rule text**, which nevertheless shows +27 % refactorings (Welch p = 0.009) and +20 % wallclock (p = 0.034). This refutes the volume explanation — it is the split itself. No quality return is measurable on any kata (all metrics within 1 σ). Details: F-1.19.1 through F-1.19.3.
  - **The always-refactor tipper belongs to hybrid-v2.4's additional text, not to the split.** Runs that refactor after *every* cycle are the most expensive in the field (claim-office 4860–5923 s against 2400–3700 s). Rate across both katas: hybrid-v2 0/18, hybrid-v2.8 1/15, hybrid-v2.7 2/10, hybrid-v2.4 4/10 (Fisher against hybrid-v2: only hybrid-v2.4 separates, p = 0.010). The suspect is the second mention of the cycle in `lab-only.md` § "Phase Continuation" ("Red/Green/Refactor for every test", "After Green → launch the refactor subagent") — hybrid-v2.4 enumerates the cycle twice, hybrid-v2 once. F-1.19.5.
  - **Correctness separates nothing here, and the metric is not fit for it either.** On claim-office all four workflows sit at `verification_pct` 0.95–0.96. Across all 33 runs the same one of the 15 verification cases fails without exception (`14-family-steinheim`), always with the same wrong value — on this kata the metric is a bit, not a degree. The earlier statement that hybrid-v2.4 falls behind on correctness (2/5 against 4/5) was an n=5 artefact: at n=13, hybrid-v2 itself sits at only 6/13. F-1.19.4. Anyone needing maximum code quality without a cost ceiling still takes `exact-hybrid-v6-lab-split-cc` — that is a deliberate profile deviation, not an upgrade, and it inherits the split premium measured here.
  - **External loops are not worse on this kata in terms of correctness.** RQ-4.7 replaces the inner loop at the same example-mapping entry point with two vendored foreign skills: `external-superpowers-2026-09-04-cc` and `external-pocock-2026-09-04-cc` both reach `verification_pct` 1.00 in 5/5 runs on claim-office × opus-5-no-thinking — at 7× shorter wallclock and 10× fewer tokens. The price is decomposition: `cc_avg_loc_per_function` 4.49 (hybrid-v2.4) against 7.90 (superpowers-2026-09-04) and 10.41 (pocock-2026-09-04). This is **not** a recommendation to switch the export to a foreign skill — n=5, one kata, one model, and both foreign skills are snapshots with no maintenance commitment. It does, however, bound what the subagent apparatus justifies: it buys decomposition, not correctness.
  - **Harness branching stays.** The export still delivers a separate config subtree per harness (`.claude/`, `.opencode/`, `.cursor/`, `.pi/`) in the snapshot root directory; see `exact-coding-baseline-2026-07-28` as a reference. The carrier decision only concerns which lab workflow the Claude Code half is generated from, not the multi-harness output.
  - **Harness caveat (binding):** only Claude Code is measured. For pi, `exact-hybrid-v2-testlist-fix-pi` exists but not a single opus-5 run; for OpenCode and cursor, hybrid-v2 does not exist at all. On Sol/pi the architecture axis is moreover a net negative — there, structureless inline-tdd-v1 beats every architecture (RQ-architecture-axis-sol-pi F-1.6). This recommendation must not be transferred to other harnesses until it has been replicated there.
  - **Model caveat:** applies to opus-5. On opus-4-8, `exact-hybrid-v5-end-refactor-cc` remains the default (RQ-1.13: lowest Complexity Peak on both katas, cognitive_max claim-office 3.6→2.8, GoL 5.6→2.4, deterministically smell_total = 0, 5/5 perfect correctness on claim-office); on opus-4-7 the peak winner is hybrid-v4.4 (the refactor lever is not model-portable, see below). exact-hybrid-v4-cleaned-cc remains the parsimonious baseline (minimal code_mass/cost) and predecessor reference.
- **Default for code quality on training-familiar katas (GoL) × opus-4-7-portkey-no-thinking:** `exact-hybrid-v4.3-audit-bundle-cc` (RQ-1.8). Eliminates `tests_passed_immediately` deterministically, +10 % refactorings at σ −64 %. **Only** on GoL/saturated correctness — on claim-office the workflow breaks (RQ-1.9).
- **Default for speed/token efficiency, training-familiar katas:** `exact-hybrid-v2.1-no-pep-cc` on GOL. Not recommended on claim-office.
- **Default for method-comparison RQs (reduction chain):** `exact-hybrid-v2-testlist-fix-cc` as the baseline.
- **Default on Sol/pi (OpenAI subscription route):** kata-dependent, and the opus line is not the answer in either case. Large novel specs → `exact-sol-v1.5-tcr-parity-domain-trial-pi`; small or training-familiar katas → `baseline-inline-tdd-v1-pi`. The promotion of v1.5 is backed by RQ-tcr-ptdd-parity-claim-sol: full correctness, near-TCR domain decomposition without method commits and practically the same wallclock as the lean v1.3 main line, at roughly a 32 % token premium. `exact-sol-v1.3-stack-profile-pi` remains the lean/budget variant; its stack-profile layering is fully preserved in v1.5.
- **Metric-driven refactor pays off over hybrid-v4, but the effective lever timing is kata- AND model-dependent — no global hybrid-v4 replacement.** Validated in RQ-1.12 (opus-4-7) and RQ-1.13 (opus-4-8), each hybrid-v4 / v6.4-per-cycle / exact-hybrid-v5-end-refactor-cc × claim-office + game-of-life. Correctness held throughout (no bundle break). The Complexity Peak winner **changes with the model**:
  - **opus-4-7:** the per-cycle refactor `exact-hybrid-v4.4-metric-refactor-cc` is the robust winner on BOTH katas (cognitive_max: claim-office 5.0→2.4, GoL 4.0→2.2; each ≥ 1 σ). `exact-hybrid-v5-end-refactor-cc` only works on multi-part codebases (claim-office: level with hybrid-v4.4 + smallest code_mass through cross-file consolidation); on the single-part GoL library, hybrid-v5 is indistinguishable from hybrid-v4 and increases code_mass.
  - **opus-4-8:** `exact-hybrid-v5-end-refactor-cc` has the lowest Complexity Peak on BOTH katas (cognitive_max: claim-office 3.6→2.8, GoL 5.6→2.4); `hybrid-v4.4` falls back to hybrid-v4 level on claim-office (3.6 = 3.6, no per-cycle gain). The v6.5 cross-file benefit from 4.7 (smaller code_mass) vanishes into the σ noise on 4.8 — on both katas all three code_mass means lie within 1 σ. What remains is a general complexity reduction, not a specific cross-file lever.
  - The only cross-kata robust result on both models is `smell_total` = 0 (hybrid-v4.4/hybrid-v5 deterministically clean). Cost rises monotonically with refactor intensity (GoL: hybrid-v4.4 +17–18 %, hybrid-v5 +29–48 % wallclock); hybrid-v4.4 is cost-unpredictable on large codebases (per-cycle measurement diverges on 4.7; more token-frugal on 4.8).
  - **Recommendation:** The default depends on what takes precedence. If **cost** counts (parsimonious, minimal code_mass): `exact-hybrid-v4-cleaned-cc`. If **correctness + code quality rank above cost** (exact-coding profile): on 4.8 `exact-hybrid-v5-end-refactor-cc` (see the front entry above — lowest Complexity Peak on both katas, smell_total 0, most robust claim-office correctness; the price is GoL wallclock +29 %), on 4.7 `hybrid-v4.4` (the robust peak winner there). The refactor lever is not model-portable and is to be validated per model before use. On 4.8 the bare hybrid-v4 baseline is moreover less robust on claim-office (1/5 CLI contract break through workflow circumvention, RQ-1.13 F-1.13.2), which hybrid-v4.4/hybrid-v5 do not show.
- **Never use as a default:** `exact-hybrid-v2.2-no-emoji-cc`, `exact-hybrid-v2.3-no-pep-no-emoji-cc`, `exact-hybrid-v4.3-audit-bundle-cc`, `exact-hybrid-v4.1-refactor-vocab-cc` on novel code with genuine ambiguities. All four have documented correctness breaks on claim-office (RQ-1.4, RQ-1.9, RQ-1.10).

---

## Methodology

### Guiding principles

#### 1. Theory of mind instead of MUSTs (or alongside MUSTs)

Straight from `~/.claude/skills/skill-creator/SKILL.md` (lines 139, 302):

> *"Try to explain to the model why things are important in lieu of heavy-handed musty MUSTs. Use theory of mind and try to make the skill general and not super-narrow to specific examples."*
>
> *"Today's LLMs are smart. They have good theory of mind and when given a good harness can go beyond rote instructions."*

Empirically confirmed in [RQ-1.5](1.5-why-block-effect-v6.1/findings.md): why blocks alongside MUSTs (not instead of them) deliver measurably better TDD discipline and code quality. Concretely for `exact-hybrid-v3-with-why-cc` vs `v6.1-hybrid` on claim-office:

- +87 % refactorings, −87 % smells
- Complexity Peak (`cognitive_max`, `cc_longest_function`, `mccabe_max`) −37 to −43 % in the mean, **σ −82 to −90 %**
- correctness invariant (1× outlier in 8 runs, otherwise 100 %)

Example pattern — `red.md` Step 7 in `exact-hybrid-v3-with-why-cc`:

```
You MUST output the full Step 7 block verbatim with `Correct` or `Incorrect`
chosen for each prediction. Do not abbreviate. Do not collapse the two
prediction lines into one.

**Why this format matters:** The block is mechanically parsed to compute
`predictions_correct_rate`. The parser expects two lines matching
`(- |✅ |❌ )(Correct|Incorrect)` per cycle — one for the compilation prediction,
one for the runtime prediction. Collapsing them into a single line, summarizing
them as "both correct", or skipping the block entirely drops the predictions
count for this cycle to zero. Format consistency here directly drives a metric
the experiment measures.
```

The `MUST output … verbatim` is preserved; the why block stands **in addition**, not as a replacement. Important lesson: **why blocks do not replace imperatives — they contextualise them.** A pure why variant (lean style, MUSTs removed) is not directly tested here, but the v6.5-lean bundle removed MUSTs AND PEP at the same time and broke correctness; the effects are entangled (see anti-patterns).

#### 2. Reduction before addition

Default hypothesis: a workflow file contains too much, not too little. Empirically confirmed for several content classes — but **kata-dependent**:

- **Pep talks** ([RQ-1.1](1.1-pep-effect-v6.1/findings.md)): "Psychological Resistance", "Trust the process" — on GOL code quality invariant, but discipline shifts (no-pep refactors +67 %). On claim-office: −3 pp correctness.
- **Decoration emojis** ([RQ-1.2](1.2-emoji-effect-v6.1/findings.md)): ✅❌🔴🟢🔄📋🚨⚠️ — invariant on GOL, **saves NO tokens** (even +8.5 %). On claim-office: 1/5 complete failure (the agent stopped after the test list with no implementation), −20 pp on average.

**Consequence:** reduction before addition holds — but every reduction needs **a separate correctness sample on a kata with an external verification suite** (claim-office × n ≥ 5). Reductions that look "neutral" on GOL regularly break on novel code. See also the anti-pattern "Bundle reduction without a correctness sample".

#### 3. What may *not* be cut

See "Supporting content" in the inventory. Re-read before every reduction.

#### 4. Architecture axis: skill vs subagent

Orthogonal to the content question. The finding comes from the oneshot-v1 RQ chain (before the hybrid-v2 rebuild, RQ-workflow-tradeoff) and is not re-validated under hybrid-v2; the RQ directory was deleted in `953841cb`. The Pareto finding **exact-hybrid-v1-cc (only refactor isolated) > subagents-v1 (everything isolated) > single-context-v1 (everything single-context)** is adopted as the architecture default in the current line (`v6.1-*` inherits this architecture); a systematic re-validation on a hybrid-v2 base is outstanding.

**Reading from the archived chain:** isolation helps where a fresh perspective has value (refactor sees the code with new eyes). It hurts where continuity is needed (red→green needs test-list coherence). A blanket "more isolation = better" is wrong.

#### 5. Mechanism: `commands/` with the Skill tool — a deliberate decision

All hybrid-v1.x workflows place the three TDD phases as `.claude/commands/{test-list,red,green}.md`, but invoke them from `rules/tdd.md` as `Skill({ skill: "..." })`. That is **not a mismatch** but a deliberate choice.

**Basis:** According to the [Claude Code slash commands docs](https://code.claude.com/docs/en/slash-commands), custom commands are "merged" into skills — `.claude/commands/<name>.md` and `.claude/skills/<name>/SKILL.md` both produce `/name` and are equivalently addressable for the Skill tool. Commands are explicitly **not** deprecated ("Your existing `.claude/commands/` files keep working").

**Empirical confirmation:** In the RQ-1.5 baseline run with `commands/` + `Skill({skill: "..."})`, 61 skill invocations (43× `red`, 17× `green`, 1× `test-list`) were successful; all four marker metrics (cycle_count=43, predictions_correct_rate=96%, refactorings_applied=17) were populated correctly.

**Why not migrate to `skills/<name>/SKILL.md`?** Skills additionally offer: a supporting-files directory, auto-invocation via the `description` frontmatter, `disable-model-invocation`, `paths` triggers. For our explicit `Skill({skill:"..."})` invocations from `tdd.md`, none of these features adds value. A migration would be cosmetic and would carry the risk that the `description` frontmatter unintentionally co-triggers skill selection.

**Consequence for reduction RQs:** workflow variants inherit the `commands/` structure unchanged. Skill tool invocations in `rules/tdd.md` continue to count as marker 1 (see `MARKERS.md`).

**Source of the caveat:** An archived `/blueprint-audit` run (v6.5.1, 2026-05-17) flagged `commands/` + skill invocation as "wrong mechanism = silent zero metric" and recommended migration. That claim is clearly refuted by the finding above — it was presumably based on an earlier Claude Code version in which the merge semantics did not yet apply. The audit finding is to be read as a historical artefact, not as a current recommendation.

### Procedure for building a new workflow variant

1. **State a hypothesis**: which *one* thing is being changed? "Several things at once" makes the variant untestable.
2. **Copy the baseline** (usually `exact-hybrid-v2-testlist-fix-cc`): `cp -r experiments/workflows/exact-coding/opus/exact-hybrid-v2-testlist-fix-cc experiments/workflows/<new-variant>`.
3. **Apply the change** — minimal, documentable in one sentence that fits into the later RQ README.
4. **Re-read MARKERS.md** — are all four markers still intact? Easy to miss, particularly with reductions.
5. **Smoke run** (1× game-of-life-example-mapping × opus-4-7-no-thinking, ~5–8 min):
   ```bash
   ./experiments/docker/batch.sh <smoke-plan>
   jq '.summary_metrics | {cycle_count, refactorings_applied,
      predictions_correct, predictions_total}' \
      experiments/runs/<latest>/metrics.json
   ```
   Healthy: `cycle_count ≥ 3`, `refactorings_applied ≥ 1`, `predictions_total ≈ 2 × cycle_count`.
6. If markers break → fix them, do **not** go into the n=10 batch.
7. **n=5 → n=8 or n=10** in two steps, not in one go. At n=5, standard deviations are often so wide that apparent findings dissolve or invert at n=8+.
8. **If the reduction is structural (test list, refactor mandate) or the RQ touches code correctness**: additionally a correctness sample on claim-office-example-mapping × n ≥ 5. GOL-only validation systematically hides correctness breaks (see anti-pattern).

### Anti-patterns from real reduction attempts

#### Bundle reduction without a correctness sample

An RQ that tests several reductions at once (e.g. the archived `v6.5-lean` = no-app + no-rules + no-pep + no-emoji + why rewrites) can only measure the bundle effect — not *which* component carries it. That is OK for a first validation ("does the bundle cost us anything?"), but becomes a **catastrophe** when the bundle is measured on GOL and hides a correctness break on novel code (claim-office).

**What concretely happened:** The v6.5.x chain (v6.5-lean, .1, .2, .3, .4 + v6.6-leaner) was measured only on GOL and ran ~5 iterations on a workflow that lowered `verification_pct` on claim-office from 1.00 to 0.38. The entire chain is unusable as a source for correctness recommendations; it sits in the archive. The current hybrid-v2 line is the restart on a repaired base.

**Lesson:** **Every workflow iteration needs a correctness sample on a kata with an external verification suite** (claim-office-example-mapping × n ≥ 3), even if the RQ primarily measures code quality. Factor-isolated RQs (one reduction per RQ) are preferable to bundle RQs — they often cost less in the end because they deliver the causal paths directly.

**Empirically documented by the hybrid-v2 reduction line:** RQ-1.1 (PEP), 1.2 (emoji), 1.3 (combined) and 1.4 (claim-office stress test) showed across four separate RQs what the v6.5-lean bundle had hidden in one step:
- individual effects on GOL were neutral (consistent with the original bundle reading)
- on claim-office correctness breaks moderately (no-pep) to catastrophically (no-emoji), and the **discipline pattern inverts** (the refactor winner is hybrid instead of no-pep)

#### Reduction without a marker check

A frequent mistake: a "leaner" workflow accidentally cuts the predictions verbatim block or the "Mandatory refactoring" clause. The runs complete, but `predictions_total` or `refactorings_applied` drop to zero/half. It only surfaces at aggregation time — by then the batch is already done.

**Consequence:** after every reduction and *before* the multi-replicate batch: smoke run + jq check of the four marker metrics (healthy baseline from MARKERS.md). See steps 5–6 in "Procedure for building a new variant".

#### Subagent without prompt context

When green or refactor runs as a subagent (subagents-v1, hybrid-v2, green-refactor-v1), it gets *no* memory access to the preceding skill state. The invoking prompt must contain everything: file paths, failing test name, current error, passing test count, recent green summary.

In `exact-hybrid-v2-testlist-fix-cc/.claude/rules/tdd.md` this is spelled out as a required-prompt-context block. Anyone building a new subagent workflow should adopt this pattern — otherwise the subagent hallucinates files or misses the active test phase.

#### Shared-context files for red/green are not a correctness lever on 4.7

The intuitive assumption that red/green subagents perform better if they read persistent spec notes (`example-mapping/<feature>.md`, `tdd-journal.md`, `architecture-notes.md`) between invocations does not hold empirically. On claim-office × opus-4-7-portkey-no-thinking (RQ-tdd-correctness, 2026-05-22):

| Workflow | n | verification_pct | duration_s |
|---|---:|---:|---:|
| exact-subagents-v1-cc | 10 | 0.67 | 3693 |
| **exact-subagents-v2-testlist-fix-cc** | 5 | **0.96** | 3229 |
| exact-subagents-v2.1-shared-context-cc | 5 | 0.71 | 4538 |
| exact-subagents-v2.1.1-fake-it-green-cc | 2 | 0.70 | ~5500 |

subagents-v2 adds *only* a "Cover every spec example" obligation to the test-list subagent — nothing else. With that it reaches single-context-v1/hybrid-v1 level at low spread. subagents-v2.1 inherits this fix AND adds shared example mapping for red/green — and still drops back to 0.71 with bimodal spread.

**Lesson:**
- If a subagent workflow performs badly on a novel kata (`verification_pct` < 0.8), check the test-list completeness of the `test-list` subagent FIRST. "Cover every spec example" with the failure mode "Missing an entire operation described in the spec" is the simplest and strongest intervention.
- Spec sharing in red/green subagents invites the subagents to re-interpret the spec instead of focusing on the activated test. The spec belongs in the test list (via test-list), not in subagent memory.
- subagents-v2.1/subagents-v2.1.1 are archived in `experiments/workflows/_archive/`. Anyone wanting to test similar architecture ideas: read the linked finding first, then justify why the mechanism is different this time.

Reference: F-model-novel.4 in `research/questions/2.2-model-effect-novel-kata/findings.md`.

#### Additive bundles carry the same bundle risk as reduction bundles

The anti-pattern "Bundle reduction without a correctness sample" was originally tied to v6.5-lean (simultaneous removal of several contents). RQ-1.9 and RQ-1.10 show: **the same trap applies to additive bundles** that add content instead of cutting it — and the pattern has by now been reproduced twice independently.

Concretely 1 — `exact-hybrid-v4.3-audit-bundle-cc`: adds rationale blocks, a mandatory-procedure preamble, a three-path bar, a wrong-predictions block. On GoL (RQ-1.8) clearly positive. On claim-office (RQ-1.9) `verification_pct` flips from 0.96 to 0.35 because the agent stops early in 6/8 runs.

Concretely 2 — `exact-hybrid-v4.1-refactor-vocab-cc`: adds purely refactor vocabulary (complexity awareness + SRP + smell→move table), nothing to the process. On GoL (RQ-1.10) complexity metrics within 1 σ (no gain), cost +14 %. On claim-office (RQ-1.10) `verification_pct` breaks from 0.96 to 0.23 because the agent stops after 7-22 instead of 36-40 cycles in 4/5 runs and writes only half the `code_mass`.

Both cases show the same micro-pattern on claim-office: self-termination after <½ of the baseline cycles, `code_mass` halved, internal `tests_passing = true` (the _written_ tests are green), external `verification_pct` collapses. Which component triggers the self-stop behaviour cannot be decided from bundle findings — causal localisation would need isolated sub-RQs.

**Lesson:** Every workflow iteration — additive as much as reductive — needs a correctness sample on a kata with an external verification suite (claim-office-example-mapping × n ≥ 5). "We are only adding rationales, that can't break anything" is wrong. Content additions can trigger self-stop behaviour that stays invisible on saturated katas (GoL: 9 tests, quickly done) but strikes immediately on multi-iteration katas (claim-office: 41 tests).

Factor-isolated sub-RQs remain preferable to bundle RQs because they deliver the causal paths directly. Bundle validation is acceptable as a first step *if* the correctness sample on novel code is included from the start.

#### Do not generalise discipline patterns from GOL to other katas

The GOL-based discipline findings of the hybrid-v2 line (RQ-1.1, RQ-1.2, RQ-1.3) look clear and consistent: "less framing → more refactoring → more discipline". On claim-office (RQ-1.4) **the pattern flips completely**:

| Metric | GOL winner (RQ-1.3) | claim-office winner (RQ-1.4) |
|---|---|---|
| `refactorings_applied` | no-pep (7.0) > hybrid (4.1) | **hybrid (11.6)** > no-pep (6.6) |
| `refactorings_applied` (combined) | 3.8 (below baseline) | 9.8 (between the reductions) |
| `verification_pct` | 100/100/100/100 (all) | **1.00 only in hybrid**, otherwise 0.80–0.97 |

**Lesson:** Discipline effects from training-familiar katas (GOL) are no proof of the same effect on novel code with ambiguities. Before recipe recommendations: cross-check on claim-office.

### When a workflow RQ cannot deliver an answer

In three constellations an n=10 batch wastes tokens because the signal is structurally absent:

- **Factor and kata collide**: e.g. a refactor variant on string-calculator — the kata is too trivial, `smell_total` is constantly 0, complexity metrics do not fluctuate. Code-quality signal only on game-of-life and claim-office.
- **Factor and model collide**: TDD discipline factors on Haiku — Haiku does not hold skill discipline; all workflows collapse to `cycle_count ≈ 3`. Discipline effects are visible only on Opus.
- **Factor without a mechanism hypothesis**: "green-refactor-v1 might be better than hybrid-v1, let's see" is not an RQ. If it is unclear *which* mechanism should produce a difference, it is also unclear which outcomes to measure and which cells must stay controlled. Hypothesis first, then plan.

---

## Supporting findings

Empirical support for the guiding principles above. Ordered by design axis.

### Theory of mind / why blocks

- **[RQ-1.5 F-1.1](1.5-why-block-effect-v6.1/findings.md#f-11)** — Why blocks alongside MUSTs (exact-hybrid-v3-with-why-cc): no correctness effect, but +87 % refactorings, −87 % smells, Complexity Peak −37–43 %, σ −82–90 %. Hypothesis H2 from RQ-1.5 confirmed. **Theory of mind has empirical support from this repo, not only the Anthropic skill-creator docs.**
- **[RQ-1.5 F-1.2](1.5-why-block-effect-v6.1/findings.md#f-12)** — Equally fast/expensive per cycle; the ~50 % wallclock premium and ~22 % token premium per run are purely a consequence of the higher cycle count, not why-bloat overhead.

### exact-hybrid-v4-cleaned-cc — hygiene cleanups (v6.5.1 audit subset on exact-hybrid-v3-with-why-cc, RQ-1.6 + RQ-1.7)

Subset of the archived v6.5.1 blueprint audit, limited to structural hygiene without touching MUSTs, why blocks or markers:

- **Consistency renames** in `red.md`: `pnpm test:unit:basic` → `pnpm test` (matches `tdd.md` and the tech-stack rule).
- **Rule-file hyphen rename**: `tdd_with_ts_and_vitest.md` → `tdd-with-ts-and-vitest.md` (matches the hyphen convention of all other rules).
- **Settings permission dedup** in `.claude/settings.json`: removal of redundant `Bash(pnpm test:*)`, `Bash(pnpm install:*)`, `Bash(pnpm run:*)` (already covered by `Bash(pnpm:*)`).
- **refactor.md decoupling**: mission description and steps rephrased role-neutrally ("Guide the requester through a refactoring pass" instead of "After Green phase / Proceeding to next test / Skipping refactor"). The agent file now defines role/capability, the TDD sequence lives only in `tdd.md`. The "Build and Tests" section was cut (already covered in `tdd-with-ts-and-vitest.md`).
- **tdd-experiment-mode.md reframing**: phantom HITL override framing removed, replaced by a positive statement of the autonomous default mode with a measurement-pipeline rationale.

Explicitly **not** part of this cleanup subset (hence reserved for the later hybrid-v4.3 audit bundle): rationale additions, red-phase mandatory-procedure preamble, wrong-predictions block, mechanism migration `commands/` → `skills/`. See `experiments/workflows/exact-coding/opus/exact-hybrid-v4-cleaned-cc/.claude/` for the exact files.

- **[RQ-1.6 F-1.1](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-11)** — Three hygiene cleanups from the archived v6.5.1 blueprint audit (consistency renames + refactor.md decoupling + tdd-experiment-mode reframing) are **behaviour-equivalent** on claim-office × opus-4-7-portkey-no-thinking. A correctness break is clearly refuted (verification_pct mean 0.91 → 0.96, tests_passing 100 %/100 %). The risk of skill-creator cleanups documented in [v6.5-correctness-setback](https://) is thereby averted *for this specific selection* — the cleanups left MUSTs, why blocks and all MARKERS untouched.
- **[RQ-1.6 F-1.2](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-12)** — Discipline drift in one direction: +34 % `refactorings_applied`, `cycle_count` spread collapses from σ 14.2 to σ 1.6 (the latter partly through the removal of the hybrid-v2 nudge outlier). Mechanistically plausible: the refactor.md decoupling removes the "TDD Refactor Phase specialist" chaining inhibition and produces more refactor iterations.
- **[RQ-1.6 F-1.4](1.6-v62-cleanup-validation-v61-with-why/findings.md#f-14)** — Cost premium +13 % wallclock, +12 % tokens — driven exclusively by +7 % cycles and +34 % refactorings, **not more expensive per cycle** (+5 % tokens/cycle, within the noise). Spread drastically reduced for both wallclock and tokens (σ roughly halved).
- **[RQ-1.7 F-1.1](1.7-v62-cleanup-validation-gol/findings.md#f-11)** — Cleanup equivalence generalises to game-of-life: 100/100 correctness on both workflows. Cross-kata validation of the RQ-1.6 recommendation is stable.
- **[RQ-1.7 F-1.2](1.7-v62-cleanup-validation-gol/findings.md#f-12)** — The complexity spread collapse repeats on GoL: `cognitive_max` −42 % mean / σ −81 %; `mccabe_max` −22 % mean / σ −64 %. The pattern first documented in RQ-1.5 (σ collapse in Complexity Peak through more refactorings) is thereby reproduced in the next workflow iteration and on a second kata — a robust mechanism, not claim-office-specific.
- **[RQ-1.7 F-1.4](1.7-v62-cleanup-validation-gol/findings.md#f-14)** — Cost premium on GoL +13 % wallclock / +15 % tokens — almost identical to claim-office (+13 % / +12 %). The "hybrid-v4 premium" is therefore kata-independent.

**Consequence for the methodology:** Cleanups that stay structurally limited to "style hygiene" (renames, role-neutral language, reframing without touching MUSTs) are safely applicable at this magnitude. That does not replace the obligation to take a correctness sample — but it confirms that not *every* cleanup attempt reproduces the v6.5-lean trap. The cross-kata validation in RQ-1.7 strengthens the hybrid-v4 default recommendation beyond the original claim-office-only statement.

### Audit bundle (v6.5.1 audit on exact-hybrid-v4-cleaned-cc, RQ-1.8 + RQ-1.9)

A bundle of two item classes, tested in isolation on a hybrid-v4 base:
- **Class 2** — rationale additions in `refactor.md` (measurement pipeline for mandatory refactoring; bisectability for ONE-at-a-time; a concrete three-path bar for "no improvement possible") and in `test-list.md` (green-phase generalization rationale for simple→complex).
- **Class 3** — red-phase hardening in `red.md` (mandatory-procedure preamble; removal of the "STOP and explain" clause in Steps 3/6; replacement "Prediction Failure Protocol" → "Wrong Predictions Are Data" with a backfill ban).

Plus an opt-in `HUMAN-IN-THE-LOOP.md` in the workflow root (no auto-load, no measurement effect) for non-autonomous profiles in which prediction failures are escalated to the human instead of counting as data.

- **[RQ-1.8 F-1.1](1.8-audit-bundle-effect-v62/findings.md#f-181)** — The mandatory-procedure preamble eliminates premature greens on GoL deterministically: `tests_passed_immediately` 0.7 ± 2.21 → **0 ± 0** (10/10 runs). Pattern identical to the archived v6.5-lean → v6.5.1 precedent; the effect replicates on a MUST/PEP-carrying hybrid-v4 base (not only as a v6.5-lean repair).
- **[RQ-1.8 F-1.2](1.8-audit-bundle-effect-v62/findings.md#f-182)** — Refactor rationale + three-path bar raises and stabilises refactoring discipline: `refactorings_applied` 7.9 → 8.7 (+10 %), σ 1.85 → 0.67 (−64 %). Effect size smaller than with the v6.5-lean bundle (why blocks in hybrid-v4 already carry part of the rationale effect), σ reduction clear.
- **[RQ-1.8 F-1.4](1.8-audit-bundle-effect-v62/findings.md#f-184)** — The wrong-predictions block makes honest wrong predictions visible: `predictions_correct_rate` 100 % → 97.4 % (on GoL). Not a discipline loss but the intended effect of the backfill ban. On claim-office (RQ-1.9) also a slight drop (97.2 → 94.9 %).
- **[RQ-1.8 F-1.5](1.8-audit-bundle-effect-v62/findings.md#f-185)** — The bundle costs +16 % tokens (replicated v6.5.1 precedent), but is wallclock-neutral on GoL — presumably compensated by the premature-green detours saved on a hybrid-v4 base.
- **[RQ-1.9 F-1.1](1.9-audit-bundle-validation-claim-office/findings.md#f-191)** — Cross-kata validation on claim-office breaks: `verification_pct` 0.96 → **0.35** (bi-modal). Internal `tests_passing` 100 %, the CLI builds — but the implementation is incomplete.
- **[RQ-1.9 F-1.2](1.9-audit-bundle-validation-claim-office/findings.md#f-192)** — Bi-modal completeness: 6 of 8 hybrid-v4.3 runs without `experiment-done.txt`, with 7–14 cycles (vs hybrid-v4: 35–40) and 8–19 min wallclock (vs hybrid-v4: 37–55 min). The agent declares itself finished after a few complete cycles. Mechanism hypothesis: the audit bundle creates more per-cycle effort; on multi-iteration katas the agent interprets the obligation to complete cycles with discipline as an implicit done signal after a few full cycles.

**Consequence for the methodology:** The audit bundle is unambiguously effective on GoL (discipline + code quality), but on novel code with genuine ambiguities it burns out completeness. hybrid-v4.3 is recommended as a GoL-specific quality champion, **not** as a general default baseline. exact-hybrid-v4-cleaned-cc remains the default for correctness-critical work. This is the third independent confirmation of the "GoL winner ≠ claim-office winner" anti-pattern (cf. RQ-1.4 for reductions + F-model-novel.4 for architecture; now RQ-1.9 for additive bundles).

### Pep/emoji reduction (hybrid-v2 line)

- **[RQ-1.1 F-1.1](1.1-pep-effect-v6.1/findings.md#f-11)** — Pep talks (`"Psychological Resistance"`, motivational inline comments) on GOL: code quality invariant, discipline shifts (`refactorings_applied` +67 %, `tests_passed_immediately` −75 %). +30 % wallclock, +21 % tokens.
- **[RQ-1.2 F-1.1](1.2-emoji-effect-v6.1/findings.md#f-11)** — Decoration emojis on GOL: code quality invariant, slight discipline shift as with the pep reduction (+29 % refactorings, −54 % immediate greens).
- **[RQ-1.2 F-1.2](1.2-emoji-effect-v6.1/findings.md#f-12)** — Emojis save **no tokens** (even +8.5 % tokens, +12 % wallclock). The expected "compactness gain" does not materialise because the token load of the 95 emojis is in the per-mille range.
- **[RQ-1.3 F-1.1](1.3-pep-emoji-combined-v6.1/findings.md#f-11)** — Pep and emoji effects are **not additive**: combined it refactors at 3.8, *below* the baseline of 4.1 (the additive prediction would be ~9.1). `tests_passed_immediately` saturates at the no-pep value.
- **[RQ-1.3 F-1.3](1.3-pep-emoji-combined-v6.1/findings.md#f-13)** — The combined reduction is the fastest cell on GOL (−15 % wallclock vs baseline), but at the price of the reduced refactor activity that the individual reductions reported as positive.
- **[RQ-1.4 F-1.1](1.4-pep-emoji-claim-office/findings.md#f-11)** — On claim-office: only v6.1-hybrid has 100 % `verification_pct`. no-emoji breaks to 80 % (1× complete failure, the agent stopped after the test list), no-pep to 97 %, combined to 95 %. **GOL correctness invariance does NOT translate to novel code.**
- **[RQ-1.4 F-1.2](1.4-pep-emoji-claim-office/findings.md#f-12)** — The discipline pattern inverts: on claim-office hybrid refactors the most (11.6), no-pep considerably less (6.6). The GOL reading "less framing = more discipline" is kata-specific.
- **[RQ-1.4 F-1.3](1.4-pep-emoji-claim-office/findings.md#f-13)** — Recipe recommendation is kata-dependent: GOL → `exact-hybrid-v2.1-no-pep-cc` as the quality choice; claim-office → `v6.1-hybrid` as the only correctness-safe choice.

### Architecture axis (not re-validated on hybrid-v2)

The oneshot-v1 RQs (deleted in `953841cb`, only in the git history) established exact-hybrid-v1-cc as the Pareto optimum: red/green as skills (test-list coherence), refactor as an isolated subagent (fresh perspective). The current hybrid-v2 line inherits this architecture; a systematic re-validation on a hybrid-v2 base is outstanding.

If a re-validation on hybrid-v2 is to happen: set up a separate RQ with v6.1-hybrid (default), v6.1-all-skills, v6.1-all-subagents as comparison cells. Note: that is an architecture variation, not a reduction test — it does not fall under "reduction before addition".

### Test-list completeness as a correctness lever

- **F-model-novel.4** (`research/questions/2.2-model-effect-novel-kata/findings.md`) — The "Cover every spec example" obligation in the test-list subagent is the strongest isolated intervention for `verification_pct` on novel katas. subagents-v2 = subagents-v1 + this one fix reaches single-context-v1/hybrid-v1 level (0.96 vs 0.67). Spec sharing in red/green, by contrast, worsens the result (subagents-v2.1: 0.71).

### Generalisation across models

The oneshot-v1 archive RQ-emoji-cross-model warns: reductions are not model-agnostic. On Sonnet-4-6, emoji removal multiplies the correctness rate; on opus-4-6 both variants fail equally. The hybrid-v2 line was measured primarily on opus-4-7 (no-thinking, direct API and Portkey) — transferring it to other models needs separate replication. Current model recommendations: `model-recommendation-matrix.md`.

---

## References

- `experiments/workflows/MARKERS.md` — hard parser requirements.
- `experiments/workflows/_archive/` — rejected but cleanly measured workflow files (among them `exact-hybrid-v4.1-refactor-vocab-cc`, RQ-1.10).
- `git show 478a0c5e^:experiments/workflows/_archive/` — workflow files of the defective hybrid-v1 reduction chain (v6.1-no-app, v6.2-no-rules, v6.3-no-pep, v6.4-no-emoji, v6.5-lean, v6.5.1–.4, v6.6-leaner) together with their 144 runs. Deleted on 2026-08-17 because the chain ran on a correctness-defective base and its runs were not identifiable as such in the active pool; only in the git history now.
- `git show 953841cb^:research/_archive/workflow-dev-v1/` — RQs of the oneshot-v1 generation (RQ-context, RQ-workflow-tradeoff, RQ-app/rules/pep/emoji/lean/audit/bullets/targeted/refactor-cut/delayed-refactor). Deleted on 2026-08-11 because the chain ran on a correctness-defective base; only in the git history now.
- `research/workflow-dev/1.1-pep-effect-v6.1/` through `1.5-why-block-effect-v6.1/` — current reduction RQs on a hybrid-v2 base.
- `research/workflow-dev/v6-reduction-recipe.md` — reduction recipe (step-by-step methodology from the first v6.5.x chain, now re-applicable on a hybrid-v2 base).
- `research/workflow-dev/model-recommendation-matrix.md` — recommended workflow per model.
- `research/kata-design/kata-construction.md` — kata methodology.
- `~/.claude/skills/skill-creator/SKILL.md` — source of the theory-of-mind principle (lines 139, 302).
