# Claim Office — Example Mapping

This is the spec memory for Red/Green agents who do not see `prompt.md`.
Implement against the rules and examples here.

## Operations

The system supports two operations on a single customer per scenario:

1. **quote**: compute the insurance premium for a list of magical items.
2. **claim**: compute the payout for a damage event filed against an
   earlier policy (a previous `quote` step in the same scenario,
   referenced by zero-based step index).

The implementation surface:

- A library function (in `src/claim-office.ts`) that takes a full
  scenario object (the parsed stdin JSON) and returns the full results
  object (the JSON to print to stdout).
- A CLI entry point (in `src/cli.ts`) that reads the scenario from
  stdin and writes the results object to stdout.

## Interface Contract (binding field names)

Use these exact field names. Do not rename or restructure.

### Input

```json
{
  "customer": { "yearsWithMHPCO": 5 },
  "steps": [
    {
      "op": "quote",
      "items": [
        { "type": "sword", "material": "steel", "enchantment": 3, "cursed": false }
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

- `customer.yearsWithMHPCO`: integer years of business.
- `steps[i].op`: `"quote"` or `"claim"`.
- Quote step: `items` is an array of item objects with `type` and
  optional `material`, `enchantment`, `cursed`. Missing optional fields
  default to: no material (treated as non-dragon), `enchantment: 0`,
  `cursed: false`.
- Claim step: `policy` is the zero-based index of an earlier `quote`
  step; `incident.damages` is an array of `{itemType, amount}` rows.

### Output

```json
{
  "results": [
    { "premium": 58 },
    { "payout": 0 }
  ]
}
```

- `results` has the same length and order as the input `steps`.
- Quote result: `{ "premium": <integer> }`.
- Claim result: `{ "payout": <integer> }`.

## Rules

### Quote — base prices (insurance value / base premium, in G)

- sword: 1000 / 100
- amulet: 600 / 60
- staff: 800 / 80
- potion: 400 / 40
- component (rune, moonstone, …): 250 / 25 each
- building block of 3 alike components: 60 base premium (instead of
  3 × 25 = 75). Insurance value is unchanged (3 × 250 = 750).
  - "Alike" = same `type` (e.g. three runes). Three runes + three
    moonstones forms two building blocks.
  - Remainder (1 or 2 of a type) is priced per-piece at 25 G each.

### Quote — modifiers (apply to per-item base premium)

Multipliers applied per item:

- Cursed item (`cursed: true`): ×1.50 (+50% risk surcharge)
- High enchantment (`enchantment >= 5`): ×1.30 (+30% risk surcharge)

Multipliers applied to the whole quote (per customer / per contract):

- Loyalty: `yearsWithMHPCO >= 2` → ×0.80 (-20%)
- First insurance: customer's first `quote` step in the scenario →
  ×1.10 (+10%)
- Post-first contract: every `quote` step after the first → ×0.85
  (-15%)

Flat:

- Processing fee: +5 G added once per quote.

### Quote — computation order

For each item: `itemBase = basePremium(item) × cursedMult × highEnchMult`.

Apply building-block pricing before per-item modifiers: replace the base
premium of a group-of-3 from 75 → 60. Then per-item cursed / enchantment
multipliers apply to each component individually if applicable (a
building block of 3 plain runes has cursedMult = 1, highEnchMult = 1, so
itemBase = 60).

Sum all `itemBase` values, then multiply by loyalty multiplier (if
applicable), then by the contract multiplier (first-insurance OR
post-first), then add 5 G processing fee, then **ceil** the result
(rounding up is "in MHPCO's favor").

A single ceil at the end is sufficient; intermediate fractional
amounts are kept exact.

### Claim — rules

- Deductible: 100 G per damage event (subtracted once per claim step
  from the total reimbursement, floored at 0).
- Reimbursement rate per damage line:
  - Item made of `material: "dragon"` → 100% of damage amount.
  - Item with `enchantment >= 8` → 50% of damage amount.
  - Otherwise: 0% (not reimbursable; only the qualifying categories
    are covered).
- If a single item qualifies under both rules (dragon material AND
  high enchantment), dragon material wins (100%).
- Payout per event = max(0, sum(reimbursementPerDamageLine) - 100).
- The `cause` field is descriptive only; it does not affect payout.
- To resolve item attributes (material, enchantment) for a damaged
  `itemType`, look up the first item in the referenced quote step
  matching that `type`. Items in the quote retain their attributes.

## Examples

All numeric examples below are computed from the rules above; tests
must assert these exact integer values.

### Quote examples

E1. Plain sword, customer 0 years (first insurance):
  - 100 × 1.10 = 110. +5 fee = **115 G**.

E2. Cursed sword, customer 0 years (first insurance):
  - 100 × 1.50 × 1.10 = 165. +5 = **170 G**.

E3. Sword with enchantment 5, customer 0 years (first):
  - 100 × 1.30 × 1.10 = 143. +5 = **148 G**.

E4. Sword cursed AND enchantment 5, customer 0 years (first):
  - 100 × 1.50 × 1.30 × 1.10 = 214.5 → ceil 215. +5 = **220 G**.

E5. Sword, customer 2 years (loyal, first insurance):
  - 100 × 0.80 × 1.10 = 88. +5 = **93 G**.

E6. Amulet, customer 5 years (loyal, first insurance — schema ex 2):
  - 60 × 0.80 × 1.10 = 52.8 → ceil 53. +5 = **58 G**.

E7. Staff plain, customer 0 years (first):
  - 80 × 1.10 = 88. +5 = **93 G**.

E8. Potion plain, customer 0 years (first):
  - 40 × 1.10 = 44. +5 = **49 G**.

E9. Single rune, customer 0 years (first):
  - 25 × 1.10 = 27.5 → ceil 28. +5 = **33 G**.

E10. Three alike runes (building block), customer 0 years (first):
  - 60 × 1.10 = 66. +5 = **71 G**.

E11. Four runes (1 block + 1 single), customer 0 years (first):
  - (60 + 25) × 1.10 = 85 × 1.10 = 93.5 → ceil 94. +5 = **99 G**.

E12. Three runes + three moonstones (two building blocks), customer 0:
  - (60 + 60) × 1.10 = 132. +5 = **137 G**.

E13. Two-quote scenario, customer 0 years:
  - Step 0 (sword plain): first insurance → premium **115 G** (E1).
  - Step 1 (amulet plain): post-first → 60 × 0.85 = 51. +5 = **56 G**.

E14. Sword + amulet in one quote, customer 0 years (first):
  - (100 + 60) × 1.10 = 176. +5 = **181 G**.

### Claim examples

C1. Schema ex 2: amulet ench 2, fire dmg 200. Doesn't qualify (no
    high ench, no dragon). Payout = **0 G**.

C2. Single dragon sword (ench 0), dmg 500:
  - 500 × 1.0 = 500. - 100 deductible = **400 G**.

C3. Single sword ench 9 (steel), dmg 500:
  - 500 × 0.5 = 250. - 100 deductible = **150 G**.

C4. Sword ench 9 dmg 150 (after rate < deductible):
  - 150 × 0.5 = 75. - 100 = -25 → floor at **0 G**.

C5. Mixed event: dragon sword dmg 300 + ench 9 amulet dmg 200:
  - 300 + 200 × 0.5 = 400. - 100 = **300 G**.

C6. Mixed event with non-qualifying: dragon sword dmg 300 +
    plain potion dmg 80:
  - 300 + 0 = 300. - 100 = **200 G**.

C7. Single non-qualifying potion dmg 500: **0 G**.

C8. Dragon item with ench ≥ 8 (both apply): dragon staff ench 10
    dmg 400 → dragon wins (100%). 400 - 100 = **300 G**.

## Questions / Clarifications (resolved)

- ❓ Are modifiers applied multiplicatively or additively?
  → **Multiplicatively** (compounding factors). Standard insurance
  convention; matches "surcharge" language treated as % adjustment of
  the running premium.

- ❓ Are loyalty / first-insurance / post-first applied per item or
  to the whole quote?
  → **Per quote (sum of item bases)**. They are properties of the
  customer relationship, not the item.

- ❓ Does the first-insurance surcharge apply only to the very first
  quote step?
  → **Yes**. The customer's first `quote` in the scenario gets +10%;
  every subsequent quote gets -15% (post-first contract). They are
  mutually exclusive.

- ❓ Building block: any group of 3 alike, multiple groups?
  → **Floor(count/3)** building blocks per component type, with the
  remainder priced per-piece at 25 G.

- ❓ Are non-qualifying items reimbursable at all?
  → **No**. Spec restricts claims to high-enchantment or dragon
  material. Other items contribute 0 to reimbursement.

- ❓ Deductible — before or after rate scaling?
  → **After**. Compute total reimbursement at item rates, then
  subtract one 100 G deductible per event, floored at 0. This is
  more favorable to MHPCO and matches "per damage event" language.

- ❓ Item with both dragon material and ench ≥ 8?
  → **Dragon wins (100%)**. Most generous category determines the
  rate; only one rate applies per damage line.

- ❓ Optional fields default values?
  → `material` absent → not dragon; `enchantment` absent → 0;
  `cursed` absent → false.

- ❓ How does a claim resolve item attributes from `itemType`?
  → Look up the first item in the referenced quote step whose `type`
  matches `itemType`. Use its `material`, `enchantment` for the rate
  calculation.

- ❓ Rounding granularity?
  → A single **ceil** at the end of each quote's premium (after
  modifiers, after fee). Intermediate values kept as exact decimals.

## Per-test Rationale

Each `it.todo` in `src/claim-office.spec.ts` covers a rule or example
above. Order goes simple → complex.

1. Single plain sword, customer 0 yr → premium 115 (E1). Covers base
   sword price + first-insurance + fee.
2. Single amulet, customer 0 yr (no surcharges) — premium 71. Covers
   base amulet price. (60 × 1.10 + 5 = 71.)
3. Single staff → 93 (E7). Base staff price.
4. Single potion → 49 (E8). Base potion price.
5. Cursed sword → 170 (E2). Cursed surcharge.
6. Sword ench 5 → 148 (E3). High-enchantment surcharge.
7. Sword cursed + ench 5 → 220 (E4). Compounding surcharges + ceil.
8. Sword, customer 2 yr → 93 (E5). Loyalty discount.
9. Schema ex 2 amulet, customer 5 yr → 58 (E6). Loyalty + rounding.
10. Single rune → 33 (E9). Component base price + rounding.
11. Three alike runes → 71 (E10). Building block pricing.
12. Four runes → 99 (E11). Block + remainder.
13. Three runes + three moonstones → 137 (E12). Two blocks distinct types.
14. Sword + amulet single quote → 181 (E14). Multi-item sum.
15. Two-quote scenario sword then amulet, customer 0 → 115, 56 (E13).
    Post-first contract discount.
16. Quote followed by non-qualifying claim (schema ex 2) → 58, 0
    (E6 + C1). End-to-end scenario shape.
17. Claim on dragon sword dmg 500 → 400 (C2). Dragon 100%.
18. Claim on ench 9 sword dmg 500 → 150 (C3). High-ench 50%.
19. Claim where rate × dmg < deductible → 0 (C4). Floor at 0.
20. Mixed event dragon + high-ench item → 300 (C5). Sum then deduct.
21. Mixed event with non-qualifying item ignored → 200 (C6).
22. Single non-qualifying potion damage → 0 (C7).
23. Dragon ench-10 staff → 300 (C8). Dragon rate wins over ench rate.
24. CLI reads JSON stdin, writes JSON stdout (schema ex 2 round-trip
    through the CLI). Covers the binding interface contract.
