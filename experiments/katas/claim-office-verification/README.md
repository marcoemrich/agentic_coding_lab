# Claim Office — Verification Scenarios

Acceptance scenarios for the `claim-office` CLI. Used by the research
framework to score how well a candidate solution implements the kata.

## Layout

Each scenario has two files in `scenarios/`:

- `<NN>-<name>.input.json` — fed to the CLI as stdin
- `<NN>-<name>.expected.json` — compared against the CLI's stdout

Stage-3 scenarios additionally have a `<NN>-<name>.story.md` with a
short narrative for workshop reuse.

## Scoring

A simple metric: **percentage of scenarios passed**. A scenario passes
when the CLI's stdout (parsed as JSON) deep-equals the corresponding
`*.expected.json` (after canonical JSON formatting). All 15 scenarios
weigh equally.

## Stages

The 15 scenarios are grouped into three stages of increasing
complexity. Stages are not gated — every scenario is independently
scored — but the stages help diagnose where a solution fails.

### Stage 1 — Isolated rules (7 scenarios)

Each scenario exercises a single rule or ambiguity. A failure points
at one specific rule the implementation got wrong.

- 01 block-exact-three
- 02 block-not-four
- 03 alike-different-types
- 04 deductible-per-item
- 05 high-enchantment-clause
- 06 dragon-material-clause
- 07 clause-conflict

### Stage 2 — Combined rules (4 scenarios)

Two or more rules interact. Failures suggest the implementation gets
each rule right in isolation but misses a stacking effect.

- 08 newcomer-cursed
- 09 follow-up-customer
- 10 cap-exhaustion
- 11 multi-items-same-type

### Stage 3 — Stories (4 scenarios)

Multi-step narratives that touch several rules and ambiguities at
once. Designed for workshop reuse — each story has a `*.story.md`
with the narrative.

- 12 warrior-garras
- 13 magus-velorin
- 14 family-steinheim
- 15 unlucky-tordan

## Interpreting scores

- 0 % — does not understand the task
- ~50 % — basic rules in place, missing several ambiguity rulings
- ~75 % — most ambiguities resolved correctly, struggles in stories
- ~95 % — close to complete
- 100 % — full coverage

## Running the suite

```bash
for input in scenarios/*.input.json; do
  name="${input%.input.json}"
  actual=$(claim-office < "$input")
  expected=$(cat "${name}.expected.json")
  if diff <(echo "$actual" | jq -S .) <(echo "$expected" | jq -S .) > /dev/null; then
    echo "PASS: $(basename "$name")"
  else
    echo "FAIL: $(basename "$name")"
  fi
done
```
