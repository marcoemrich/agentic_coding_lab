# MHPCO Claim Office — Example Mapping

Shared specification memory for the `red`/`green` subagents. This file
condenses the requirements from `prompt.md`. Use the exact field names
from the Interface Contract below.

## Rules

### R1. Item base values and premiums

Main items (insurance value / base premium):
- `sword`: 1000 G / 100 G
- `amulet`: 600 G / 60 G
- `staff`: 800 G / 80 G
- `potion`: 400 G / 40 G

Components (`rune`, `moonstone`, ...): 250 G insurance value, 25 G base
premium per component. **Building block:** exactly 3 alike components
(same `type` — `rune` ≠ `moonstone`) get a special base premium of 60 G
instead of 3 × 25 = 75 G.

- 2 of a type → 2 × 25 = 50 G
- 3 of a type → 60 G (block applies)
- 4 of a type → 4 × 25 = 100 G (block requires exactly 3)
- 7 of a type → 7 × 25 = 175 G

Multiple component types are counted independently:
- 2 runes + 1 moonstone → 50 + 25 = 75 G
- 3 runes + 3 moonstones → 60 + 60 = 120 G (two blocks)

### R2. Premium modifiers

Item-specific surcharges (apply to that item's base premium only):
- **Cursed** (`cursed: true`): +50 % of that item's base premium
- **High enchantment** (`enchantment >= 5`): +30 % of that item's base premium

Policy-wide modifiers (apply to the **policy base premium** = sum of all
item base premiums + item-specific surcharges):
- **Loyalty** (customer `yearsWithMHPCO >= 2`): −20 %
- **First insurance**: +10 % — applies to **every item in every quote**,
  regardless of customer history. (Clarified: each item in a quote is
  treated as a first insurance.) Interpretation: this is a policy-wide
  +10 % surcharge on the policy base premium (applies once per quote).
- **Follow-up contract** (any quote after the customer's first quote in
  the scenario): −15 % of the policy base premium

Final: +5 G processing fee added at the very end.

Rounding: all amounts are rounded to **whole G in MHPCO's favor**:
- premiums round **up** (197.5 → 198)
- payouts round **down** (350.5 → 350)
- intermediate values kept as fractions; only the final premium/payout
  rounded.

### R3. Claim processing

- **Deductible**: 100 G applies **per damage event** (per entry in
  `damages`).
- **High-enchantment clause** (item's `enchantment >= 8`): reimburse 50 %
  of damage amount, **then** subtract deductible.
- **Dragon-material clause** (item's `material === "dragon"`): full
  reimbursement, then deductible.
- If both clauses apply, the 50 % clause wins (then deductible).
- If neither clause applies: full reimbursement minus deductible.

Components (`rune`, `moonstone`) have no `enchantment` or `material`, so
no special clause applies; treat as standard reimbursement.

### R4. Multiple items of same type

- A quote may contain multiple items of the same type (e.g. two swords).
  Insurance sum stacks (2 swords → 2000 G).
- A claim's `damages` array may contain multiple entries of the same
  `itemType`; each entry is a separate damage event with its own
  deductible.
- If `damages` contains more entries of a given itemType than the policy
  covers (e.g. 2 sword damages but only 1 sword insured), the **whole
  claim is rejected**: CLI exits non-zero, error to stderr, no result.

### R5. Edge cases / errors (CLI exits non-zero, error on stderr)

- Quote with empty `items` array → premium 5 G (only the fee). Not an
  error.
- Quote contains item with unknown type (e.g. `broomstick`) → reject:
  CLI exits non-zero, error on stderr, no `results` written to stdout.
- Claim references a damage entry for an item not in the policy
  (e.g. amulet damage but only a sword insured, or unknown itemType) →
  CLI exits non-zero, error on stderr.
- Claim contains a damage entry with negative `amount` (e.g. `-200`) →
  CLI exits non-zero, error on stderr.

### R6. Scenario semantics

- One `customer` for the whole scenario, with `yearsWithMHPCO`.
- `steps` is an ordered array. Each step has `op: "quote"` or
  `op: "claim"`.
- `claim` step has a `policy` field with the **zero-based index** of the
  `quote` step that created the policy.
- Output `results` has the same length and order as input `steps`.
- "Follow-up contract" −15 % discount applies to **every quote after the
  customer's first quote within this scenario** (claim steps don't
  count toward this counter).

## Examples

### E1. Building block of 3 alike components (R1)
- 2 runes → base 50 G
- 3 runes → base 60 G
- 4 runes → base 100 G
- 7 runes → base 175 G

### E2. Alike means same exact type (R1)
- 2 runes + 1 moonstone → 75 G base
- 3 runes + 3 moonstones → 120 G base

### E3. Modifier scope — cursed surcharge applies per-item (R2)
- Cursed sword (100 G base) + plain amulet (60 G base):
  - policy base = 160 G; cursed surcharge = 50 G (50% of sword);
    sum = 210 G *before* policy-wide modifiers and fee.

### E4. Modifier thresholds (R2/R3)
- Exactly 2 years → loyalty discount applies
- Exactly enchantment 5 → high-enchantment surcharge applies; both
  apply if also cursed
- Enchantment 4 → no high-enchantment surcharge
- Dragon-material sword, enchantment exactly 8, damage 1000 G → payout
  400 G (high-enchantment clause kicks in: 1000 × 0.5 = 500, − 100
  deductible = 400)

### E5. Deductible per damage event (R3)
- Dragon attack on sword (damage 500) + amulet (damage 300):
  payout = (500−100) + (300−100) = 600 G.

### E6. Standard reimbursement (R3)
- Regular sword (steel, enchantment 3), damage 500 → 400 G payout
- Rune damage (insurance 250), damage 200 → 100 G payout

### E7. Enchantment threshold vs. dragon material (R3)
- Dragon-material sword, enchantment 9, damage 1000 → 400 G
- Dragon-material sword, enchantment 5, damage 800 → 700 G
- Steel sword, enchantment 9, damage 1000 → 400 G

### E8. Multiple items of same type (R4)
- 2 swords in a quote → insurance sum 2000 G
- 2 damage entries of `sword` against a 2-sword policy: each separately
  reimbursed (each with own deductible)
- 2 sword damages, only 1 sword insured → whole claim rejected (CLI
  exits non-zero)

### E9. Rounding in MHPCO's favor (R2)
- 197.5 G premium → 198 G (up)
- 350.5 G payout → 350 G (down)
- Intermediates stay fractional.

### E10. Edge cases (R5)
- Empty items → premium 5 G
- Unknown item type (`broomstick`) → error
- Claim for item not in policy → error
- Negative damage amount → error

### E11. Integration — newcomer with cursed sword
- Customer: `yearsWithMHPCO: 0`, no previous contract
- Item: cursed sword (steel, enchantment 3)
- Calculation: 100 base + 50 curse = 150; +10 first insurance = 160;
  +5 fee = **165 G**

### E12. Integration — long-standing customer's second contract
- Customer: `yearsWithMHPCO: 3`; second quote in scenario
- Item: cursed sword (steel, enchantment 7)
- Calculation: base 100; +50 curse; +30 high enchantment = 180 item
  total. Policy-wide: −20 loyalty (−20 % of 180 = −36? but spec says
  "−20 G loyalty"). The spec's worked breakdown is:
  `100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first insurance
  − 15 follow-up = 155 + 5 fee = 160`.
- This means policy-wide modifiers (loyalty, first insurance,
  follow-up) are computed as percentages of the **base premium of
  100 G** (not the post-surcharge total): 20 % of 100 = 20, 10 % of
  100 = 10, 15 % of 100 = 15. This matches the example values
  exactly. (Item-specific surcharges are added separately and are not
  themselves subject to policy-wide discounts.)
- **Final formula:**
  premium = sum_items(base + item_surcharges)
          + policy_base × (first_insurance + loyalty + follow_up)
          + processing_fee
  where policy_base = sum of item base premiums (no surcharges), and
  the policy-wide modifiers are signed percentages.
- Sanity-check with E3: cursed sword (base 100) + plain amulet
  (base 60). policy_base = 160. Item surcharges = 50 (curse). Sum =
  210 G "before further modifiers and fee" ✓.
- Sanity-check with E11: cursed sword only. policy_base = 100.
  Item surcharges = 50 (curse). Policy-wide: +10 first insurance
  = 10 % × 100 = 10 G. Total: 100 + 50 + 10 = 160; +5 fee = 165 G ✓.

## Interface Contract

The CLI `claim-office` (entry point `src/cli.ts`) reads JSON from stdin
and writes JSON to stdout. Field names below are **binding**.

### Stdin (scenario)

```json
{
  "customer": { "yearsWithMHPCO": 5 },
  "steps": [
    {
      "op": "quote",
      "items": [
        { "type": "amulet", "material": "silver", "enchantment": 2, "cursed": false }
      ]
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "fire",
        "damages": [
          { "itemType": "amulet", "amount": 200 }
        ]
      }
    }
  ]
}
```

- `customer.yearsWithMHPCO`: integer.
- `steps[].op`: `"quote"` or `"claim"`.
- Quote step: `items[]` with `type` (string: `sword`/`amulet`/`staff`/
  `potion`/`rune`/`moonstone`). Optional: `material`, `enchantment`,
  `cursed`.
- Claim step: `policy` (zero-based step index of the quote that created
  the policy); `incident.cause` (string), `incident.damages[]` with
  `itemType` and `amount` (integer G).

### Stdout (results)

```json
{ "results": [ { "premium": 71 }, { "payout": 100 } ] }
```

- `results[]` same length and order as `steps[]`.
- Quote result: `{ "premium": <integer G> }`.
- Claim result: `{ "payout": <integer G> }`.

### Error behavior

On any of the error cases listed in R5, the CLI:
- Exits with a **non-zero** status code.
- Writes a human-readable error description to **stderr**.
- Does **not** write a partial `results` document to stdout.

### Internal API for unit tests

The implementation file `src/claim-office.ts` should expose a
synchronous function that runs a parsed scenario object and returns the
results object (or throws on invalid input). Suggested signature
(tests will pin this down progressively):

```ts
export function runScenario(scenario: Scenario): { results: ResultEntry[] };
```

Unit tests import `runScenario` (and possibly smaller helpers as they
emerge). CLI tests in `src/cli.spec.ts` (or via `src/claim-office.spec.ts`)
exercise the stdin/stdout/exit-code surface end-to-end by spawning the
CLI as a subprocess via `tsx src/cli.ts`.

## Questions / Clarifications

- ❓ "Alike" components — **same exact type** (rune ≠ moonstone). [E2]
- ❓ Modifier scope on multi-item policy — item-specific (curse, high
  enchantment) apply to that item's base premium only; policy-wide
  (loyalty, first insurance, follow-up) apply to the **policy base
  premium** (sum of item base premiums, without item surcharges). [E3,
  E12]
- ❓ "First insurance" — applies to **each item in every quote**,
  regardless of customer history. Practically: every quote receives the
  +10 % first-insurance surcharge (on policy base premium). [E12]
- ❓ Multiple items of same type — allowed; each damage is a separate
  event; over-claiming is rejected outright. [E8]

## Per-test Rationale (covered by `it.todo`s)

The test list below covers all rules and examples. Numbering matches
the order in `src/claim-office.spec.ts`.

Quote pricing (unit tests via `runScenario`):
1. Empty items quote → premium 5 G (E10/R5 — fee only).
2. Single plain amulet (yearsWithMHPCO 0) → base 60 + first 6 + fee 5 = 71 G (R1 + first insurance).
3. Single plain sword (newcomer) → 100 + 10 + 5 = 115 G (R1 + first insurance).
4. Newcomer with cursed sword (steel, ench 3) → 165 G (E11 integration).
5. Sword exactly enchantment 5 (newcomer, plain) → 100 + 30 high-ench + 10 first = 140 + 5 fee = 145 G (E4 threshold).
6. Sword enchantment 4 (newcomer, plain) → no high-ench: 100 + 10 + 5 = 115 G (E4 threshold).
7. Cursed sword exactly enchantment 5 (newcomer) → 100 + 50 + 30 + 10 + 5 = 195 G (E4 both surcharges).
8. Long-standing customer (≥2 years), single plain sword, only quote → 100 + 10 first − 20 loyalty + 5 fee = 95 G (R2 loyalty + first insurance).
9. Customer with exactly 2 years (threshold) → loyalty applies, same calc as 8.
10. Long-standing customer's second contract: cursed sword ench 7 → 160 G (E12 integration).
11. Multi-item policy: cursed sword + plain amulet, newcomer → policy base 160 + 50 curse = 210; +16 first (10 % × 160) = 226; +5 fee = 231 G (E3 modifier scope; verifies first-insurance applies to policy base).
12. Components — 2 runes → base 50 + 5 first + 5 fee = 60 G (E1 block edge).
13. Components — 3 runes (block applies) → base 60 + 6 first + 5 fee = 71 G (E1 block applies).
14. Components — 4 runes (no block) → base 100 + 10 first + 5 fee = 115 G (E1).
15. Components — 7 runes → base 175 + 17.5 first = 192.5; +5 fee = 197.5 → round UP to 198 G (E1 + E9 rounding up).
16. Components — 2 runes + 1 moonstone → base 75 + 7.5 first + 5 fee = 87.5 → round up 88 G (E2 alike means same type).
17. Components — 3 runes + 3 moonstones (two blocks) → base 120 + 12 first + 5 fee = 137 G (E2 two blocks).
18. Two swords in one quote (newcomer) → base 200 + 20 first + 5 fee = 225 G (E8 stacking).

Claim payouts:
19. Standard claim: steel sword ench 3, damage 500 → payout 400 G (E6).
20. Component damage: rune damage 200 → 100 G (E6 component standard).
21. High-enchantment-only: steel sword ench 9, damage 1000 → 400 G (E7).
22. Dragon-material only, ench 5, damage 800 → 700 G (E7).
23. Dragon-material AND ench 9, damage 1000 → 400 G (E7 50% wins).
24. Dragon-material sword exactly ench 8, damage 1000 → 400 G (E4 threshold).
25. Multiple damage entries: dragon attack on sword (damage 500) + amulet (damage 300) → 600 G (E5 deductible per event).
26. Two swords insured, claim with two sword damages (e.g. 400 + 300, steel ench 3) → 300 + 200 = 500 G (E8 each event independent).
27. Payout rounding: contrived damage yielding 350.5 → 350 G (E9 round DOWN). E.g. dragon-material sword ench 8, damage 901 → 901×0.5 − 100 = 350.5 → 350.

Error / rejection cases (CLI surface — spawn `tsx src/cli.ts`):
28. CLI happy path: scenario stdin → results stdout, exit 0 (schema example).
29. CLI: unknown item type in quote (`broomstick`) → exit non-zero, error on stderr, no results on stdout (R5/E10).
30. CLI: claim references item not in policy (amulet damage on sword-only policy) → exit non-zero, error on stderr (R5/E10).
31. CLI: claim with unknown itemType → exit non-zero, error on stderr (R5/E10).
32. CLI: damage entry with negative amount → exit non-zero, error on stderr (R5/E10).
33. CLI: claim with more sword damages than swords insured → exit non-zero (E8 over-claim rejection).
34. CLI: full scenario with multiple quotes and a claim — follow-up discount applies to second quote; results array preserves order and step indexing. (R6 + E12 integration end-to-end.)
