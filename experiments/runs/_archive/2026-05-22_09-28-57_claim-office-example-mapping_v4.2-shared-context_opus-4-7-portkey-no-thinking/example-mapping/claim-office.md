# MHPCO Claim Office — Example Mapping

## Overview

The MHPCO system supports two operations within a scenario for a single customer:

- **quote**: compute premium for a list of items
- **claim**: process damage against a previously-created policy (referenced by 0-based step index)

The CLI lives at `src/cli.ts`, reads a JSON scenario from stdin, writes a JSON
result document to stdout. Errors exit non-zero and write to stderr.

---

## Rules

### R1. Base premiums and insurance values

Per main item:
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff:  800 G / 80 G
- Potion: 400 G / 40 G

Components (rune, moonstone):
- 250 G insurance value, 25 G base premium each
- A "block" of exactly 3 alike components → 60 G base premium (replaces 3×25 = 75)

### R2. Components — "alike" means same type

Disambiguation from ❓: "alike" = same component type. A rune and a moonstone
are NOT alike, even though both are components.

### R3. Premium modifiers

Item-specific (applied to the affected item's base premium):
- Cursed: +50%
- High enchantment (level ≥ 5): +30%

Policy-wide (applied to the policy base premium = sum of all item base premiums after item modifiers):
- Loyalty (≥ 2 years with MHPCO): −20%
- First insurance: +10% (per-item — see R3a)
- Follow-up contract (any quote after the customer's first in this scenario): −15%

Final:
- Add 5 G processing fee.

### R3a. First-insurance surcharge is per-item

Disambiguation from ❓: "first insurance" means each item is treated as a first
insurance regardless of customer history; the surcharge always applies to every
item in any quote. (See "Long-standing customer's second contract" example —
+10G first insurance is still added on the second contract.)

### R3b. Modifier ordering (derived from integration examples)

For a given item:
- item premium = base × (1 + 0.5 if cursed) × (1 + 0.3 if enchant ≥ 5)
  - Equivalently, the spec presents the two surcharges as additive on the base
    (cursed +50G, enchant +30G on a 100G sword sums to 180G). Both
    interpretations give 180 in the spec's examples — use additive on base for
    item-specific modifiers to match the spec's worked sums exactly:
    - cursed item premium = base + base×0.5
    - high-ench item premium = base + base×0.3
    - both = base + base×0.5 + base×0.3 (e.g. cursed sword ench 7: 100 + 50 + 30 = 180)
- per-item first-insurance surcharge = base × 0.10 (added to that item)

Policy base premium = sum of (per-item base + per-item surcharges + per-item first-insurance)

Then policy-wide modifiers add/subtract from the policy base:
- loyalty discount = policy base × 0.20 (subtract)
- follow-up discount = policy base × 0.15 (subtract)

Then +5 G fee at the very end.

Verification against "Long-standing customer's second contract":
- cursed sword (ench 7): base 100 + 50 (curse) + 30 (high-ench) + 10 (first-ins) = 190
- −20G loyalty (20% of 100) − 15G follow-up (15% of 100) = 190 − 20 − 15 = 155
- +5G fee = 160. ✓

Verification against "Newcomer with cursed sword":
- cursed sword (ench 3): 100 + 50 (curse) + 10 (first-ins) = 160
- no loyalty, no follow-up
- +5G fee = 165. ✓

Verification against "cursed sword + plain amulet" (no other modifiers):
- cursed sword: 100 + 50 = 150; plain amulet: 60
- policy base before first-insurance: 210
- (the spec wording: "policy base premium 160 G; the cursed surcharge adds
  50 G… → 210 G before further modifiers and fee")
- Note: the spec's "210 G before further modifiers and fee" excludes
  first-insurance, which is a per-item surcharge that still applies later.

### R4. Rounding in MHPCO's favor

- Premiums rounded UP to whole G (ceiling)
- Payouts rounded DOWN to whole G (floor)
- Only the FINAL premium/payout is rounded; intermediate values stay fractional.

### R5. Claim — deductible & cap

- 100 G deductible per damage event (per entry in the `damages` array)
- Cap = 2 × insurance sum (sum of unmodified insurance values of all items in the policy)
- Premium modifiers do NOT raise the cap
- Block discount does NOT lower the cap (insurance sum uses raw 250 G per component)

### R6. Claim — special reimbursement clauses

- Item with enchantment ≥ 8 → 50% reimbursement of damage amount (before deductible)
- Item made of "dragon" material → 100% reimbursement (full reimbursement)
- If both clauses apply, the 50% rule wins (see "dragon, ench 9 → 400 G")
- Then the deductible is subtracted: payout = max(0, reimbursable − 100)
- Components (rune, moonstone) have no enchantment / material; no special clause applies

### R7. Claim — multi-claim cap exhaustion

- Cap accumulates across multiple claims on the same policy
- Each claim's payout is clipped to the remaining cap
- `remainingCap` in result = cap remaining AFTER this claim

### R8. Claim — multi-item & damage matching

- A policy may contain multiple items of the same type (e.g. two swords)
- Each entry in `damages` is a separate damage event with its own deductible
- If `damages` references more items of a type than the policy contains → error (non-zero exit, stderr)
- If `damages` references a type not in the policy at all → error

### R9. CLI interface

- Reads single JSON document from stdin (input schema in prompt.md)
- Writes single JSON document to stdout with `results` array (same order as `steps`)
- Quote result: `{premium: integer}`
- Claim result: `{payout: integer, remainingCap: integer}`
- Error conditions → non-zero exit, error to stderr, no `results` to stdout:
  - unknown item type in quote (e.g. `broomstick`)
  - claim references item type not in policy
  - claim has negative damage amount
  - claim has more damages of a type than the policy contains

### R10. Edge cases

- Empty item list → premium = 5 (just the fee)
- Customer with 0 years, no prior quote → no loyalty, no follow-up; first
  quote still triggers per-item first-insurance surcharge
- Each subsequent quote in the scenario is a "follow-up contract" → −15%

---

## Interface contract (binding field names)

**Input (stdin):**

```json
{
  "customer": {"yearsWithMHPCO": 5},
  "steps": [
    {
      "op": "quote",
      "items": [
        {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
      ]
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "fire",
        "damages": [
          {"itemType": "amulet", "amount": 200}
        ]
      }
    }
  ]
}
```

**Output (stdout):**

```json
{"results": [{"premium": 71}, {"payout": 100, "remainingCap": 1100}]}
```

(Values illustrative; the schema is binding.)

Item types: `sword | amulet | staff | potion | rune | moonstone`

---

## Examples (with computed expected values)

### E1. Base premiums (each item alone, no modifiers, year=0, first contract)

- 1 sword (steel, ench 0) → 100 base + 10 first-ins + 5 fee = 115 G
- 1 amulet (silver, ench 0) → 60 + 6 + 5 = 71 G
- 1 staff (wood, ench 0) → 80 + 8 + 5 = 93 G
- 1 potion (glass, ench 0) → 40 + 4 + 5 = 49 G

### E2. Empty item list

- `items: []` → premium = 5 G (fee only)

### E3. Components and blocks

(year=0, no modifiers; component first-ins surcharge applies)

- 2 runes → base 50 + 5 (first-ins) + 5 (fee) = 60 G
- 3 runes → base 60 (block) + 6 (10% of 60 first-ins) + 5 = 71 G
- 4 runes → base 100 + 10 + 5 = 115 G
- 7 runes → base 175 + 17.5 → 192.5 → 198 G (rounded up: 192.5 + 5 = 197.5, ceil → 198)
  - Actually: 175 + 17.5 (first-ins) = 192.5; +5 fee = 197.5; ceil = 198 G
  - This matches the rounding example (197.5 → 198)

### E4. "Alike" = same type

- 2 runes + 1 moonstone → 50 + 25 = 75 base; first-ins = 7.5; +5 fee = 87.5 → 88 G
- 3 runes + 3 moonstones → 60 + 60 = 120 base; first-ins = 12; +5 fee = 137 G

### E5. Cursed surcharge is item-specific

- Policy: cursed sword + plain amulet (year=0, first contract)
  - Item bases: sword 100, amulet 60
  - Curse on sword: +50
  - First-ins: sword 10, amulet 6
  - Policy base = 100 + 50 + 60 + 10 + 6 = 226
  - +5 fee = 231 G
  - (Note: the spec's "210 G before further modifiers and fee" excludes
    first-insurance; with first-ins added per-item we get 226, +5 = 231.)

### E6. Enchantment threshold

- Sword with exactly enchantment 5 (year=0, first contract, not cursed):
  - 100 + 30 (high-ench) + 13 (10% of 130 first-ins?) … wait — first-ins is 10% of base
  - Use: first-ins = 10% of base per item = 10
  - Item total = 100 + 30 + 10 = 140; +5 = 145 G
- Sword with enchantment 4 → no high-ench:
  - 100 + 10 + 5 = 115 G
- Sword with enchantment 5 and cursed:
  - 100 + 50 + 30 + 10 + 5 = 195 G

### E7. Loyalty (≥ 2 years)

- Customer 2 years, single plain sword (first contract, not cursed):
  - Item: 100 + 10 = 110
  - Loyalty: −20 (20% of 100 policy base premium of items pre-first-ins?
    or 20% of 110?)
  - Per R3b: loyalty applies to the policy base premium (sum of items including first-ins)
  - Actually, re-reading: "policy-wide modifiers… apply to the policy base
    premium (the sum of all item base premiums)"
  - "Sum of all item base premiums" = sum of unmodified bases = 100
  - Verification with the long-standing-customer example:
    - 100 + 50 + 30 + 10 = 190
    - loyalty −20 (20% of 100), follow-up −15 (15% of 100) = 190 − 35 = 155
    - +5 = 160 ✓
  - So **loyalty% and follow-up% are computed on the SUM OF UNMODIFIED BASE PREMIUMS**.
  - Customer 2 years, plain sword, first contract:
    - 100 (base) + 10 (first-ins) − 20 (loyalty 20% of 100) + 5 = 95 G

### E8. Follow-up contract

- The integration example "Long-standing customer's second contract" verifies:
  - 3 years, second quote in scenario, cursed sword ench 7:
  - 100 + 50 + 30 + 10 − 20 − 15 + 5 = 160 G ✓

### E9. Rounding premiums up

- A premium of 197.5 → 198 G (e.g. 7 runes scenario above)

### E10. Newcomer with cursed sword (integration)

- Customer 0 years, no prior contract, cursed sword steel ench 3
- 100 + 50 + 10 + 5 = 165 G ✓

### E11. Claim — deductible per damage event

- Two damages in one incident: sword damaged 500 G, amulet damaged 300 G (steel,
  low enchantment, no special clause)
- Payout = (500 − 100) + (300 − 100) = 400 + 200 = 600 G

### E12. Claim — standard reimbursement minus deductible

- Steel sword, ench 3, damage 500 → payout 400 G
- Rune (no enchantment/material), damage 200 → payout 100 G

### E13. Claim — enchantment ≥ 8 (50%)

- Steel sword, ench 9, damage 1000 → 500 (50%) − 100 (deductible) = 400 G

### E14. Claim — dragon material (full)

- Dragon sword, ench 5, damage 800 → 800 − 100 = 700 G

### E15. Claim — both clauses → 50% wins

- Dragon sword, ench 9, damage 1000 → 500 − 100 = 400 G
- Dragon sword, ench 8, damage 1000 → 500 − 100 = 400 G

### E16. Claim — cap exhaustion across multiple claims

- 1 sword insured: insurance sum 1000, cap 2000
- Claim 1 damage 1500 → payout = min(1500-100, 2000) = 1400; remainingCap = 600
- Claim 2 damage 1500 → desired = 1400, clipped to remaining cap 600 → payout 600; remainingCap = 0

### E17. Cap not affected by premium modifiers / block discount

- Cursed sword: cap = 2000 (not affected by premium 165)
- Sword + 3 runes: insurance sum = 1000 + 750 = 1750, cap = 3500

### E18. Multiple swords in one policy

- Two swords: insurance sum 2000, cap 4000
- Dragon attack damages both swords; both damages have own deductible
- (Steel swords, ench 3, each damaged 500): payout = 400 + 400 = 800

### E19. Multi-item damage validation

- Policy has 1 sword. `damages` contains 2 sword entries → error, non-zero exit
- Policy has only a sword. `damages` references an amulet → error
- Damage amount negative → error

### E20. Unknown item type in quote

- Quote with `{type: "broomstick"}` → error, non-zero exit, stderr message; no `results`

### E21. Rounding payouts down

- A payout calculation yielding 350.5 → 350 G

### E22. Dragon-material sword ench exactly 8 (from "modifier thresholds")

- Dragon material sword, ench 8, damage 1000 → 50% rule applies (ench ≥ 8 takes
  precedence over dragon-full), then deductible: 500 − 100 = 400 G

---

## Questions / Clarifications

| ❓ | Resolution |
|---|------------|
| "Alike" components — same type or family? | Same type only (R2, E4) |
| Item-specific modifier scope (curse on whole policy?) | Per-item only (R3, E5) |
| First insurance — first ever or first per item? | Per-item, always applies (R3a, E8) |
| Multiple items of same type | Allowed; each `damages` entry = separate event (R8, E18, E19) |
| Modifier thresholds (exactly 2 yrs loyalty, exactly ench 5 high-ench, exactly ench 8 dragon) | Inclusive at the threshold (≥) |

---

## Per-test rationale

Tests live in `src/claim-office.spec.ts`. The CLI is tested via a child-process
invocation of `src/cli.ts`. The test list, ordered simple → complex:

1. **Quote: empty items → 5 G (fee only)** — E2 / R10
2. **Quote: single plain sword (year=0) → 115 G** — E1, R1, R3a (first-ins +10%)
3. **Quote: single plain amulet → 71 G** — E1
4. **Quote: single plain staff → 93 G** — E1
5. **Quote: single plain potion → 49 G** — E1
6. **Quote: 2 runes → 60 G** — E3, R1 (components, no block)
7. **Quote: 3 runes block → 71 G** — E3, R1 (block discount)
8. **Quote: 4 runes → 115 G** — E3 (no block since not exactly 3)
9. **Quote: 7 runes → 198 G (premium rounded up from 197.5)** — E3, E9, R4
10. **Quote: 2 runes + 1 moonstone → 88 G (alike = same type only)** — E4, R2
11. **Quote: 3 runes + 3 moonstones → 137 G (two separate blocks)** — E4, R2
12. **Quote: cursed sword (ench 3, year=0, first contract) → 165 G** — E10, R3 (curse +50%)
13. **Quote: cursed sword + plain amulet (year=0) → 231 G (curse on sword only)** — E5, R3 (item-specific curse)
14. **Quote: sword ench 5 → 145 G (high-ench applies at exactly 5)** — E6
15. **Quote: sword ench 4 → 115 G (no high-ench)** — E6
16. **Quote: cursed sword ench 5 → 195 G (both surcharges)** — E6
17. **Quote: 2-year customer, plain sword → 95 G (loyalty applies at exactly 2)** — E7, R3 (loyalty)
18. **Quote: 3-year customer's second quote, cursed sword ench 7 → 160 G (integration)** — E8, R3 (follow-up + loyalty)
19. **Claim: steel sword ench 3, damage 500 → payout 400, remainingCap 1600** — E12, R5
20. **Claim: rune damage 200 → payout 100, remainingCap 400** — E12 (components, no special clause)
21. **Claim: two damages in one incident (sword 500 + amulet 300) → payout 600** — E11, R5 (deductible per event)
22. **Claim: steel sword ench 9, damage 1000 → payout 400 (50% rule)** — E13, R6
23. **Claim: dragon sword ench 5, damage 800 → payout 700 (full reimbursement)** — E14, R6
24. **Claim: dragon sword ench 9, damage 1000 → payout 400 (50% wins over dragon)** — E15, R6
25. **Claim: dragon sword ench 8, damage 1000 → payout 400 (50% applies at exactly 8)** — E22, R6
26. **Claim: cap exhaustion — sword, two claims of 1500 → first payout 1400 remCap 600, second payout 600 remCap 0** — E16, R7
27. **Claim: cap based on raw insurance values (cursed sword cap = 2000)** — E17, R5
28. **Claim: cap unaffected by block discount (sword + 3 runes cap = 3500)** — E17, R5
29. **Claim: two swords in policy, both damaged → payout per damage with own deductible** — E18, R8
30. **Claim: payout rounding down — calculation yielding 350.5 → payout 350** — E21, R4
31. **CLI: quote scenario via stdin/stdout produces `{results:[{premium:...}]}`** — R9
32. **CLI: claim scenario via stdin/stdout produces `{results:[..., {payout, remainingCap}]}`** — R9
33. **CLI: unknown item type (`broomstick`) → non-zero exit, stderr message, no results on stdout** — R9, E20
34. **CLI: claim references item type not in policy → non-zero exit, stderr** — R9, E19
35. **CLI: claim has negative damage amount → non-zero exit, stderr** — R9, E19
36. **CLI: claim has more damages of a type than policy contains → non-zero exit, stderr** — R8, E19

The CLI tests (31–36) exercise the binding interface contract from the spec.
For test 30, we construct a scenario where the payout math yields a fractional
value (e.g. a 50%-reimbursement scenario where damage is odd).
