---
id: RQ-cost-sol-pi-vs-opus-cc
question: "How much cheaper is the GPT model gpt-5-6-sol on the pi harness compared to opus-4-8 on Claude Code — at the same prompt style and an outcome-equivalent TDD workflow, across both katas?"
factors:
  # Coupled model+harness factor: the two axes vary jointly
  # as a practice bundle, NOT as a cross product (no sol@cc / opus@pi).
  model_x_workflow:
    - model: gpt-5-6-sol
      workflow:
        any:
          - v6.2-with-why-cleaned-pi        # claim-office runs, canonical
          - v6.2.1-phase-continuation-pi    # game-of-life runs, outcome-neutral fix
    - model: opus-4-8-requesty
      workflow: v6.2-with-why-cleaned
  kata_base:
    - game-of-life
    - claim-office
controls:
  prompt: example-mapping
outcomes:
  # primary: cost
  - cost_usd
  - total_tokens
  - duration_seconds
  # correctness as a counterweight to price
  - verification_pct
  - tests_passing
  # "cheaper does not mean cleaner" check (code quality)
  - cognitive_max
  - mccabe_max
  - smell_total
min_replicates: 5
status: aktiv
---

# RQ-cost-sol-pi-vs-opus-cc: How much cheaper is Sol@pi compared to Opus@Claude-Code?

## Motivation

A direct practical question: If you switch from the premium setup **opus-4-8 on Claude Code**
(CC) to the cheap setup **gpt-5-6-sol ("Sol") on pi** — how much
cost do you really save, and what do you give up in correctness/code quality in return?
This RQ does not isolate model or harness effect individually (the neighboring RQs do that),
but measures the **combined switching effect** as one bundle.

## Bundle definition + confound caveat (binding)

This is a **deliberately uncontrolled** comparison. Model AND harness vary
**jointly** in two coupled bundles:

- **sol-pi** — `gpt-5-6-sol` (GPT, `azure/gpt-5.6-sol@swedencentral`) on pi
- **opus-cc** — `opus-4-8` (`vertex/claude-opus-4-8@eu`, Requesty) on Claude Code

Both axes are entangled: the measured difference is the **sum** of
model effect and harness effect, not either one alone. Anyone who needs the
isolated effects will find them in:

- **`RQ-harness-requesty`** (`../1.2-harness-requesty/`) — harness effect CC vs
  OC vs pi at **constant** opus-4-8. There, at the same model, pi is on
  claim-office ~56 % cheaper than CC, on game-of-life ~48 %.
- **`RQ-model-quality-pi`** (`../../questions-pi/1.1-model-quality-pi/`) —
  model effect (among others sol vs opus) at **constant** pi harness on
  game-of-life. There sol costs ~$1.09/run against opus ~$2.00/run.

This RQ combines both levers and thereby answers the *switching* question
end-to-end.

### Coupled factor `model_x_workflow`

The harness is encoded in the workflow suffix (`-pi` = pi, no suffix = CC), the
model in `model`. Both together define a bundle. The framework pairs them
via the `model_x_workflow` factor (analogous to `workflow_x_prompt`), so that exactly the
2 desired bundles × 2 katas = **4 cells** arise — no 4-way cross product
with the never-measured ghost cells sol@cc / opus@pi.

### Workflow `any:` rationale (outcome-neutral)

Sol's runs sit on two pi workflow versions: game-of-life under
`v6.2.1-phase-continuation-pi`, claim-office under `v6.2-with-why-cleaned-pi`.
The `.1` version is an **outcome-neutral** fix of the `-pi` version (only
phase-transition drop → continuation, all markers P1–P7 unchanged; memory
`pi-workflow-continuation-drop-v621`). Following the CLAUDE.md exception for
outcome-neutral workflow bugfixes (`rq-workflow-any-match-tooling`), both
versions collapse via `workflow: {any: [...]}` into **one** sol-pi cell. Opus@CC uses
the same `v6.2-with-why-cleaned` in both katas.

## Cost baseline

Both bundles route via Requesty; `cost_usd` is a **list-price estimate**
(token × price via `compute-cost.py`, as of `research/model-pricing.md`
2026-07-25), **not** a billed amount — Requesty delivers no inline cost on these
routes. Cache reads enter at the discount tariff; token counts incl.
`cache_read` are correctly captured for both harnesses (pi after the
main-thread summation fix, memory `pi-requesty-cost-and-parser-undercount`).

**Important:** the two bundles carry **different tariffs** (sol =
`azure/gpt-5.6-sol` $5.00/$30.00/$0.50; opus = `vertex/claude-opus-4-8@eu`
$5.50/$27.50/$0.55/$6.25 per 1M). Unlike in `RQ-harness-requesty` (one
tariff for all cells there), the price difference here is thus tariff **and** effort
combined — which matches the switching question: you really pay the respective
model tariff on the respective harness.

## Existing data

All 4 cells are already covered with **n=5** fully analyzed runs
(`cost_usd` + `verification_pct` filled) — **no** fill runs needed. The RQ is
a re-selection of existing data from the batches of 2026-07-25.

| Bundle | Kata | Model | Workflow | n |
|---|---|---|---|--:|
| sol-pi | game-of-life | gpt-5-6-sol | v6.2.1-phase-continuation-pi | 5 |
| sol-pi | claim-office | gpt-5-6-sol | v6.2-with-why-cleaned-pi | 5 |
| opus-cc | game-of-life | opus-4-8-requesty | v6.2-with-why-cleaned | 5 |
| opus-cc | claim-office | opus-4-8-requesty | v6.2-with-why-cleaned | 5 |

## Hypotheses

- **H1 (cost)**: sol-pi is clearly cheaper than opus-cc on both katas;
  the spread is larger on claim-office (expensive CLI kata, high token load) than
  on game-of-life.
- **H2 (correctness)**: sol-pi maintains full correctness on game-of-life
  (`verification_pct`=1.0); on claim-office it is close to opus-cc, without
  a systematic collapse despite drastically lower cost.
- **H3 (quality-cost tradeoff)**: sol-pi buys the price advantage with a higher
  Complexity Peak (`cognitive_max`/`mccabe_max`) — "cheaper does not mean
  cleaner".

## Methodological notes

- **The model×harness confound is design, not a defect** — carry the
  coupled character along with every $ statement; isolated effects via the neighboring RQs above.
- **Two tariffs** — the cost comparison is tariff+effort, not effort alone
  (difference from `RQ-harness-requesty`).
- **Spend limit guard**: before aggregation `grep -l 'Reached monthly spend limit'`
  over the sol run logs (memory `pi-requesty-412-spend-limit`).
- **Never average across katas** — string-calculator scale ≠ game-of-life scale;
  aggregation per cell.
