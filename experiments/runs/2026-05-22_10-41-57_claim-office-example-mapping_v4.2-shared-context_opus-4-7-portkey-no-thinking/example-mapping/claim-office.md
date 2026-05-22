# MHPCO Claim Office - Example Mapping

This is the shared spec memory for Red/Green/Refactor subagents. It is the
single source of truth for field names, rules, examples, and per-test
rationale.

## Rules

### R1. Item base values & base premiums
- Sword: insurance value 1000 G, base premium 100 G
- Amulet: insurance value 600 G, base premium 60 G
- Staff: insurance value 800 G, base premium 80 G
- Potion: insurance value 400 G, base premium 40 G
- Components (rune, moonstone): insurance value 250 G each, base premium
  25 G per component

### R2. Block-of-3-alike component discount
- Per item type, every group of exactly 3 alike components forms a block.
  A block costs 60 G base premium (instead of 3 × 25 = 75 G).
- "Alike" means **same `type`** (a rune and a moonstone are NOT alike).
- Blocks apply per item type independently: e.g. 3 runes + 3 moonstones =
  two blocks.
- Block requires exactly 3; 4 alike components → no block (4 × 25 = 100 G).
  7 alike → no block (7 × 25 = 175 G — only exact multiples wouldn't
  even apply because the example explicitly says "4 runes → 100 G no
  block; 7 runes → 175 G". Blocks are not "every 3", they are "exactly
  3". So 6 runes would also not be a block under this reading.)
  - However, the natural reading combined with the multi-block example
    ("3 runes + 3 moonstones → 120 G base = two separate blocks") shows
    a block forms only when the *whole* group is exactly 3 of the same
    type. With 4 runes there is no way to peel off a block of 3 and
    leave 1 standalone — the spec explicitly disallows this. So the
    rule is: a block of 3 only applies when the count is exactly 3 per
    type.

### R3. Premium modifiers (per item or per policy)
Item-specific (apply to the *affected item's* base premium):
- Cursed: +50% surcharge
- Highly enchanted (enchantment ≥ 5): +30% surcharge

Policy-wide (apply to the policy base premium = sum of item base premiums):
- Loyalty (customer has ≥ 2 years with MHPCO): −20% discount
- First insurance: +10% surcharge (applies to EVERY quote — each item in
  every quote is treated as a first insurance, regardless of customer
  history). Per the integration example, this is added on top of the
  policy base premium.
- Follow-up contract: −15% discount on each contract after the first
  (so quote step index ≥ 1 in the scenario)
- Processing fee: +5 G flat, added at the very end

### R4. Rounding (in MHPCO's favor)
- Premiums: round **up** to whole G
- Payouts: round **down** to whole G
- Intermediate amounts are kept as fractions; only the final amount
  is rounded

### R5. Claim processing - deductible & cap
- 100 G deductible applies **per damage event** (per entry in `damages`)
- Total payout per policy capped at 2 × insurance sum (the sum of items'
  unmodified insurance values)
- The cap is depleted across multiple successive claims; once exhausted,
  no further payout

### R6. Damage modifiers
- Enchantment ≥ 8: payout = 50% of damage amount (applied BEFORE
  deductible)
- Dragon material: full reimbursement (then deductible)
- If both apply, the 50% rule wins (then deductible)
- For non-magical items (no enchantment/material like runes) only the
  standard rule applies

### R7. Edge cases / errors
- Empty item list in a quote → premium = 5 G (just the processing fee)
- Quote with unknown item type → CLI exits non-zero, error to stderr,
  no `results` written to stdout
- Claim references damage to an item type not in the policy → CLI exits
  non-zero, error to stderr
- Claim with negative damage amount → CLI exits non-zero, error to stderr
- Damage array contains more entries of a type than insured (e.g. two
  sword damages but only one sword) → CLI exits non-zero, whole claim
  rejected

## Interface Contract (binding field names)

### Input (stdin JSON)

```json
{
  "customer": {
    "yearsWithMHPCO": 5
  },
  "steps": [
    {
      "op": "quote",
      "items": [
        {
          "type": "amulet",
          "material": "silver",
          "enchantment": 2,
          "cursed": false
        }
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

Field notes:
- `customer.yearsWithMHPCO`: integer
- Quote step item fields:
  - `type`: one of `sword | amulet | staff | potion | rune | moonstone`
  - `material`: string (e.g. `"dragon"`, `"steel"`, `"silver"`)
  - `enchantment`: integer
  - `cursed`: boolean
  - `material`, `enchantment`, `cursed` are optional (defaults: not
    dragon, 0, false)
- Claim step: `policy` is zero-based index into `steps` referencing the
  earlier quote step
- Damage entry: `itemType` matches the `type` field used in quote items;
  `amount` is integer

### Output (stdout JSON)

```json
{
  "results": [
    { "premium": 11 },
    { "payout": 100, "remainingCap": 1100 }
  ]
}
```

- `results.length === steps.length`, same order
- Quote result: `{ "premium": <integer> }`
- Claim result: `{ "payout": <integer>, "remainingCap": <integer> }`

## Examples

### R1 Base premiums
- Single sword (steel, ench 0, not cursed), customer 0 years, no prior
  contract → base 100 + 10 first ins + 5 fee = 115 G
- Single amulet → 60 + 6 + 5 = 71 G
- Single staff → 80 + 8 + 5 = 93 G
- Single potion → 40 + 4 + 5 = 49 G
- Single rune → 25 + 2.5 + 5 → 32.5 → round up = 33 G
- Single moonstone → 25 + 2.5 + 5 → 33 G

### R2 Block of 3 alike
- 2 runes: 2×25 = 50 G base premium
- 3 runes: 60 G base premium (block applies)
- 4 runes: 4×25 = 100 G base premium (no block)
- 7 runes: 7×25 = 175 G base premium
- 2 runes + 1 moonstone: 2×25 + 1×25 = 75 G base premium (no block)
- 3 runes + 3 moonstones: 60 + 60 = 120 G base premium (two blocks)

### R3 Modifier scope
- Cursed sword (base 100) + plain amulet (base 60):
  - policy base 160 G
  - cursed surcharge: 50% × 100 = +50 G (on cursed item only)
  - subtotal 210 G before further modifiers and fee

### R3 Modifier thresholds
- yearsWithMHPCO exactly 2 → loyalty applies
- enchantment exactly 5 → high-enchantment applies
- cursed + enchantment 5 → both surcharges apply
- enchantment 4 → no high-enchantment surcharge

### R5 Deductible per damage event
- Dragon attack damages sword (500) and amulet (300); both dragon-
  material? No — the example just says "dragon attack" but does not say
  the items are dragon material. Re-reading: "a dragon attack damages
  an insured sword (500 G) and an insured amulet (300 G); payout = 600 G
  (the 100 G deductible applies once per damaged item)" — that's
  (500−100) + (300−100) = 400 + 200 = 600. So neither special clause
  is invoked; the example is purely about deductible-per-event.

### R5 Standard reimbursement
- Sword steel ench 3, damage 500 → 500 − 100 = 400 G payout
- Rune damage 200 G → 200 − 100 = 100 G payout

### R6 Enchantment vs dragon
- Dragon sword ench 9, damage 1000 → 500 (50%) − 100 = 400 G
- Dragon sword ench 5, damage 800 → 800 − 100 = 700 G (only dragon
  clause applies; enchantment 5 < 8 so no 50% rule)
- Steel sword ench 9, damage 1000 → 500 − 100 = 400 G
- Dragon sword ench 8, damage 1000 → 500 − 100 = 400 G (50% rule
  triggers at exactly 8)

### R5 Multi-item & damages
- Policy with two swords → insurance sum 2000, cap 4000
- Damages array `[{type:"sword"}, {type:"sword"}]` → each its own
  deductible
- Damages contain two sword entries but only one sword insured → reject

### R5 Cap exhaustion
- Sword (1000, cap 2000); two claims of 1500 G each:
  - first claim → payout 1400, remainingCap 600
  - second claim → desired 1400, but cap 600 left → payout 600,
    remainingCap 0
- Cursed sword (insurance value 1000, premium 165 with mods) → cap 2000
  (mods don't raise cap)
- Sword + 3 runes (block) → insurance sum 1000 + 3×250 = 1750
  (block discount does NOT lower insurance sum)
- Sword + amulet → insurance sum 1600, cap 3200

### R4 Rounding
- Premium 197.5 → 198 (up)
- Payout 350.5 → 350 (down)

### R7 Edge cases
- Empty items → premium 5 G
- Unknown type → CLI non-zero, stderr error, no results stdout
- Claim refs item not in policy → CLI non-zero
- Negative damage amount → CLI non-zero

### Integration: Newcomer with cursed sword
- customer 0 years, no prior contract
- cursed sword (steel, ench 3)
- 100 base + 50 curse + 10 first ins (10% of 100 policy base) = 160
  + 5 fee = 165 G

### Integration: Long-standing customer's 2nd contract
- customer 3 years, 2nd quote in scenario
- cursed sword (steel, ench 7)
- 100 base + 50 curse + 30 high ench − 20 loyalty (20% of 100 base)
  + 10 first ins (10% of 100 base) − 15 follow-up (15% of 100 base)
  = 155 + 5 fee = 160 G
- Note: all the policy-wide percentages here happen to be on a single
  100 G item, so they look like flat amounts. The general rule is
  percentages of the policy base premium.

## Questions / Clarifications (from ❓ in spec)

1. **"Alike" components**: same TYPE (rune ≠ moonstone). Resolved by the
   3 runes + 3 moonstones = 2 blocks example.
2. **Modifier scope on multi-item policies**: item-specific modifiers
   (cursed, high enchantment) apply to that item's base premium only;
   policy-wide modifiers (loyalty, first insurance, follow-up) apply to
   the policy base premium (sum of item bases); fee added at the end.
3. **Multiple items of the same type**: allowed; each contributes
   independently to insurance sum, premium, and damage matching. If
   `damages` lists more of a type than insured → reject.
4. **First insurance vs long-standing customer**: first insurance
   surcharge applies to EVERY quote in EVERY scenario — each item in a
   quote is treated as first insurance regardless of customer history.

## Per-Test Rationale

Tests are split into 4 describe blocks: `quote` premium calculations,
`claim` payouts, edge cases / errors, and CLI integration. Within each
block, tests go simple → complex.

### Quote (premium calculation)

1. **empty items → 5 G** — R7 (only fee)
2. **single sword → 115 G** — R1 single item baseline; verifies base
   + first insurance + fee
3. **single amulet → 71 G** — R1 amulet base
4. **single staff → 93 G** — R1 staff base
5. **single potion → 49 G** — R1 potion base
6. **2 runes → no block, 33 G** — R1 + R2 (2 × 25 = 50, +10% first ins
   = 55, +5 fee = 60 G). Wait — let me recompute. Customer 0 yrs, first
   ever. 2 runes: base 50. Policy base 50. First ins +10% = 5. Subtotal
   55. Fee +5 = 60. So expected 60 G, not 33. (The 33 G I wrote earlier
   was for a single rune.) Let me correct: single rune: base 25 +
   first ins 2.5 + fee 5 = 32.5 → 33.
7. **3 runes → block, 71 G** — R2 (3 runes = 60 base; +6 first ins;
   +5 fee = 71)
8. **4 runes → no block, 115 G** — R2 (100 base + 10 + 5 = 115)
9. **7 runes → no block, 198 G** — R2 (175 base + 17.5 + 5 = 197.5 →
   198 round up). Also covers R4 rounding up.
10. **2 runes + 1 moonstone → 88 G** — R2 mixed types, no block (75
    base + 7.5 + 5 = 87.5 → 88)
11. **3 runes + 3 moonstones → 137 G** — R2 two separate blocks
    (60 + 60 = 120 base; +12 first ins; +5 fee = 137)
12. **cursed sword (ench 3), 0 yrs, 1st contract → 165 G** —
    integration newcomer example
13. **cursed sword (ench 5) → high-ench surcharge applies** —
    R3 threshold exactly 5: 100 + 50 + 30 = 180 base+item; +10 first
    ins; +5 fee = 195 G (customer 0 yrs, no prior). Actually the
    surcharges are on the item base premium so policy base is still
    100; item surcharges add to that. So total = 100 + 50 + 30 + 10
    + 5 = 195.
14. **sword ench 4, not cursed → no surcharges, 115 G** — R3 threshold
15. **sword ench 5, not cursed → high-ench applies, 30 + 100 + 10 +
    5 = 145 G** — R3 threshold exactly 5
16. **customer with exactly 2 yrs → loyalty applies** — R3 threshold.
    Plain sword: 100 base − 20 loyalty + 10 first ins + 5 fee = 95 G
17. **cursed sword + plain amulet → 210 G before fee+other mods** —
    R3 modifier scope. Customer 0 yrs, 1st contract. Bases: 100 + 60
    = 160. Curse: +50 (on sword only). First ins +10% × 160 = 16.
    Fee +5. Total = 160 + 50 + 16 + 5 = 231 G.
18. **long-standing customer 2nd contract: cursed sword ench 7 →
    160 G** — integration follow-up example
19. **rounding: premium yielding 197.5 → 198** — R4 (covered by test 9)

### Claim (payout calculation)

20. **steel sword ench 3, damage 500 → payout 400, remainingCap 1600**
    — R5 standard reimbursement; cap was 2000, used 400, 1600 left
21. **rune damage 200 → payout 100, remainingCap 400** — R5 standard
    rune (insurance value 250, cap 500, used 100, 400 left)
22. **dragon sword ench 5, damage 800 → payout 700, remainingCap
    1300** — R6 dragon-only clause (full reimburse, then deductible)
23. **steel sword ench 9, damage 1000 → payout 400, remainingCap 1600**
    — R6 high-ench only (50% first, then deductible)
24. **dragon sword ench 9, damage 1000 → payout 400, remainingCap
    1600** — R6 both clauses; 50% rule wins
25. **dragon sword ench 8, damage 1000 → payout 400, remainingCap
    1600** — R6 threshold exactly 8
26. **deductible per damage event: damages [sword 500, amulet 300] on
    sword+amulet policy → payout 600, remainingCap 2600** — R5
    deductible per event. Cap = 3200, used 600, 2600 left.
27. **two swords insured, damages [sword 500, sword 300] → payout
    600, remainingCap 3400** — multi-item same type. Cap 4000, used
    600.
28. **cap exhaustion: sword, two claims of 1500 each → first
    payout 1400 remaining 600; second payout 600 remaining 0** —
    R5 cap exhaustion (2 separate claim steps in one scenario)
29. **rounding: payout 350.5 → 350** — R4 rounding down. Use dragon
    sword ench 9, damage 801 → 400.5 − 100 = 300.5 → 300? Actually
    50% of 801 = 400.5, then −100 deductible = 300.5 → rounded down
    to 300. So pick a damage that yields .5 fractional payout. Use
    damage 901: 50% of 901 = 450.5, −100 = 350.5 → 350. Good.

### Edge cases / errors

30. **empty items → premium 5 G** — already covered as quote test 1
31. **unknown item type in quote → CLI exits non-zero, stderr
    contains error, stdout has no results** — R7
32. **claim references item type not in policy → CLI exits non-zero,
    stderr error** — R7
33. **negative damage amount → CLI exits non-zero, stderr error** — R7
34. **damages contain more entries of a type than insured → CLI exits
    non-zero, whole claim rejected** — R7 multi-item edge case

### CLI integration (stdin/stdout)

35. **CLI reads JSON from stdin, writes results JSON to stdout (basic
    quote scenario)** — the schema example: customer 5 yrs, amulet
    quote then amulet claim
36. **CLI processes multi-step scenario: quote then claim returns
    `{ results: [{ premium }, { payout, remainingCap }] }`** — same
    as 35 with both step results validated
37. **CLI exits with non-zero code on unknown item type** — covered by
    31; verify via CLI invocation
38. **CLI exits with non-zero code on invalid claim** — covered by 32
39. **CLI exits with non-zero code on negative damage amount** — by 33
