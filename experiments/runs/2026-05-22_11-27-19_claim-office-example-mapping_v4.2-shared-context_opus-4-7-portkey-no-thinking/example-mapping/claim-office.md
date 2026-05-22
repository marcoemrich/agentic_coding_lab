# MHPCO Claim Office — Example Mapping

Shared spec memory for Red/Green subagents. Source of truth for field
names, rule application order, and expected numeric values.

## Rules

### R1. Item base values and premiums
Main items have fixed insurance value and base premium:
- sword: 1000 G / 100 G
- amulet: 600 G / 60 G
- staff: 800 G / 80 G
- potion: 400 G / 40 G

Components (rune, moonstone): 250 G insurance value / 25 G base premium each.

### R2. Component "building block" discount
A group of exactly 3 alike (same type) components is offered as a block at
60 G base premium instead of 75 G. The block discount affects the premium
only, NOT the insurance sum. Greedy grouping by type.

### R3. Item-level premium modifiers
Applied to each affected item's base premium (additive percentages of the
item's own base premium):
- cursed: +50 %
- enchantment ≥ 5: +30 %

### R4. Policy-level premium modifiers
Applied to the policy base premium (sum of item base premiums after R2):
- yearsWithMHPCO ≥ 2: −20 % loyalty discount
- first insurance: +10 % initial assessment (applies to EACH item in EACH
  quote regardless of customer history — see ❓Q3)
- follow-up contract (every quote after the customer's first one in this
  scenario): −15 %

### R5. Processing fee
+5 G flat fee, added at the very end after all other modifiers and rounding.

### R6. Rounding in MHPCO's favor
- Premiums: rounded UP to whole G
- Payouts: rounded DOWN to whole G
- Intermediate amounts kept as fractions; only the final amount rounded

### R7. Insurance sum and cap
Insurance sum = sum of items' insurance values (unmodified, block does
NOT reduce). Cap = 2 × insurance sum, based on UNMODIFIED insurance
values (premium modifiers don't raise cap).

### R8. Claim deductible
100 G deductible per damage event (per item entry in damages array).

### R9. Claim clauses (per item)
- enchantment ≥ 8: reimbursed at 50 % of damage (then deductible)
- dragon material: full reimbursement (then deductible)
- If both apply: 50 % wins, then deductible (per example: dragon sword
  ench 9, dmg 1000 → 500 − 100 = 400)
- Components (no enchantment/material): full reimbursement minus
  deductible

### R10. Cap exhaustion across claims
Payouts are capped by the remaining cap. If desired payout exceeds
remaining cap, it's reduced to the remaining cap. Cap depletes across
successive claims on the same policy.

### R11. Error cases (CLI exits non-zero, writes to stderr, no results
on stdout)
- Unknown item type in quote
- Claim damage references item not in policy (or unknown type)
- Damages array has more entries of a type than policy covers
- Negative damage amount

## Examples

### Item base premiums (R1)
- sword: base 100 G
- amulet: base 60 G
- staff: base 80 G
- potion: base 40 G
- 1 rune: base 25 G

### Building blocks (R2)
- 2 runes → 50 G base premium
- 3 runes → 60 G base premium (block applies)
- 4 runes → 100 G base premium (no block — block requires exactly 3)
- 7 runes → 175 G (one block of 3 + 4 individual = 60 + 100)
  — wait: spec says 7 runes → 175 G. 3+3+1 = 60+60+25 = 145 G? Or
  3+4 = 60+100 = 160 G? Or 7×25 = 175 G (no block applied)? Spec
  literally says "175 G" — that's 7 × 25, so blocks do NOT auto-apply
  greedily on 7. Re-reading: "3 alike components is offered at a
  special base premium of 60 G" — must be exactly 3 to qualify.
  Therefore 7 = no block → 175 G. (See ❓Q4 for resolution.)

### "Alike" components (R2, ❓Q1)
- 2 runes + 1 moonstone → 75 G (no block: different types, 3×25 = 75)
- 3 runes + 3 moonstones → 120 G (two separate blocks: 60 + 60)

### Modifier scope (R3, R4)
- cursed sword + plain amulet:
  - policy base premium = 100 + 60 = 160 G
  - cursed surcharge = 50 G (50 % of cursed sword's base, not policy)
  - subtotal = 210 G before further modifiers and fee

### Modifier thresholds
- exactly 2 years → loyalty applies
- exactly enchantment 5 → high-enchantment surcharge applies
- enchantment 4 → no high-enchantment surcharge
- if cursed AND enchantment ≥ 5 → both surcharges apply
- dragon-material sword, enchantment exactly 8, dmg 1000 G → payout 400 G
  (high-enchantment 50 % rule wins, then deductible)

### Claim — multi-item deductible (R8)
- sword damage 500 G + amulet damage 300 G in same incident
  → payout = (500 − 100) + (300 − 100) = 600 G

### Standard reimbursement (R9)
- regular sword (steel, ench 3), dmg 500 G → payout 400 G
- rune (insurance 250 G), dmg 200 G → payout 100 G

### Enchantment vs. dragon material (R9)
- dragon sword, ench 9, dmg 1000 G → 400 G (50 % rule + deductible)
- dragon sword, ench 5, dmg 800 G → 700 G (dragon only: full − 100)
- steel sword, ench 9, dmg 1000 G → 400 G (50 % + deductible)

### Multiple items of same type (❓Q2)
- two swords policy → insurance sum 2000 G, cap 4000 G
- two sword damage entries → each treated separately with own deductible
- more sword damages than swords insured → CLI exits non-zero, claim rejected

### Cap exhaustion (R7, R10)
- sword + amulet policy → insurance sum 1600 G, cap 3200 G
- cursed sword (premium with mods 165 G) → cap 2000 G (unmodified value)
- sword + 3 runes (block) → insurance sum 1750 G (= 1000 + 3×250),
  cap 3500 G (block doesn't affect insurance sum)
- sword cap 2000 G; two claims of 1500 G each:
  - claim 1 → desired 1500 − 100 = 1400 G; cap remaining 600 G
  - claim 2 → desired 1400 G reduced to 600 G; cap remaining 0 G

### Rounding (R6)
- premium 197.5 G → 198 G (up)
- payout 350.5 G → 350 G (down)

### Edge cases
- empty item list → premium 5 G (only processing fee)
- unknown item type in quote (e.g. broomstick) → CLI exits non-zero,
  error to stderr, no results
- claim with item not in policy → CLI exits non-zero, error to stderr
- claim with negative amount → CLI exits non-zero, error to stderr

### Integration: Newcomer with cursed sword
- customer 0 years, no previous contracts
- cursed sword (steel, ench 3)
- premium 165 G = 100 (base) + 50 (curse) + 10 (first insurance)
  = 160 + 5 fee = 165 G
- (no loyalty since 0 years; no follow-up since first quote)

### Integration: Long-standing customer, second contract
- customer 3 years, second quote in scenario
- cursed sword (steel, ench 7)
- premium 160 G:
  - 100 (base) + 50 (curse) + 30 (high ench) = 180 item subtotal
  - −20 (loyalty 20 % of 100 base = 20) → wait spec breakdown:
    "100 + 50 + 30 − 20 + 10 − 15 = 155 + 5 = 160"
  - So loyalty 20 = 20 % of 100 G policy base premium = 20 G
  - first insurance 10 = 10 % of 100 G policy base = 10 G
  - follow-up 15 = 15 % of 100 G policy base = 15 G
  - Policy-level modifiers (loyalty, first-insurance, follow-up) are
    each computed as percentage of the POLICY base premium (sum of
    items' unmodified base premiums), NOT of the modified subtotal.
  - Total: 100 + 50 + 30 − 20 + 10 − 15 = 155 → +5 fee = 160 G

## Interface contract

### CLI: `src/cli.ts`
Reads ONE JSON document from stdin, writes ONE JSON document to stdout.
On error: exits non-zero, writes error description to stderr, NO
`results` written to stdout.

### Input shape (verbatim field names)
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

Item types: `sword`, `amulet`, `staff`, `potion`, `rune`, `moonstone`.
Item fields: `type` (required), `material` (optional string),
`enchantment` (optional integer, default 0), `cursed` (optional boolean,
default false).

### Output shape (verbatim field names)
```json
{
  "results": [
    {"premium": 71},
    {"payout": 100, "remainingCap": 1100}
  ]
}
```

- Quote result: `{"premium": <integer>}`
- Claim result: `{"payout": <integer>, "remainingCap": <integer>}`
- `results` length and order match input `steps`.

### Policy reference
`claim.policy` is the zero-based index into `steps` of the `quote` step
that created the policy.

## Questions / Clarifications

- **Q1 (alike components)** — Resolved: "alike" means same type. Runes
  and moonstones are different types (don't combine into one block).
- **Q2 (multiple items same type)** — Resolved: each entry in `items` is
  a separate insured item; each entry in `damages` is a separate damage
  event; mismatch (more damages of a type than insured) → reject claim
  with non-zero exit.
- **Q3 (scope of "first insurance")** — Resolved: each item in each
  quote is treated as a first insurance (the +10 % surcharge always
  applies per item). Follow-up discount (−15 %) applies to the whole
  quote when it's not the customer's first quote in this scenario.
- **Q4 (modifier scope)** — Resolved: item-specific modifiers (cursed,
  high enchantment, first insurance) apply per item to that item's
  base premium; policy-wide modifiers (loyalty, follow-up) apply as a
  percentage of the policy base premium (sum of items' unmodified base
  premiums). Processing fee added last.

  Refining from the integration breakdown: loyalty −20, first-insurance
  +10, follow-up −15 are each `% × 100 (single-item policy base)`. With
  one item the distinction between "per item" and "per policy" doesn't
  bite, but the spec text explicitly says first-insurance is per item
  (each item in a quote is a first insurance), while loyalty and
  follow-up are policy-wide.

  Formula:
  ```
  for each item:
    item_subtotal = base × (1 + 0.5·cursed + 0.3·highEnch + 0.1·firstIns)
  policy_subtotal = Σ item_subtotal
  policy_base    = Σ item_base  (unmodified)
  policy_after_policy_mods =
    policy_subtotal − 0.20·policy_base·(years≥2) − 0.15·policy_base·(followUp)
  final = ceil(policy_after_policy_mods) + 5
  ```
  Verifies integration example 1 (newcomer): 100×(1+0.5+0.1)=160; no
  policy mods; 160+5=165 ✓
  Verifies integration example 2: 100×(1+0.5+0.3+0.1)=190;
  policy mods: −20 (loyalty) −15 (follow-up) = −35 → 155; +5 = 160 ✓

## Per-test rationale

Each `it.todo()` below maps to one rule or example:

### Quote operation — function-level (via scenario interface)
01. empty items, 0 years → premium 5 (R5 only) — edge case
02. one sword, 0 years → premium 116 (100 base + 10 first-ins + 5 fee
    = 110×1 = wait: 100 + 10 = 110, +5 fee = 115. Recompute: item
    subtotal = 100×1.1 = 110; no policy mods; 110+5 = 115). So
    premium 115 — R1, R5, R4-firstIns
03. one amulet, 0 years → premium 71 (60×1.1=66, +5=71) — R1
04. one staff → premium 93 (80×1.1=88, +5=93) — R1
05. one potion → premium 49 (40×1.1=44, +5=49) — R1
06. one rune → premium 33 (25×1.1=27.5 → ceil 28, +5=33) — R1, R6
07. 2 runes → 55 G (no block: 50×1.1=55, +5=60) — R2
08. 3 runes → block: (60×1.1=66, +5=71) — R2
09. 4 runes → no block: (100×1.1=110, +5=115) — R2
10. 7 runes → 175 base: 175×1.1=192.5 → ceil 193, +5=198 — R2,R6
11. 2 runes + 1 moonstone → no block: 75×1.1=82.5→ceil 83, +5=88 — R2,Q1
12. 3 runes + 3 moonstones → 2 blocks: 120×1.1=132,+5=137 — R2,Q1
13. cursed sword (0 years) → 165 (integration ex 1) — R3,R5
14. sword enchantment 5 (0 years) → 100×(1+0.3+0.1)=140, +5=145 — R3
15. sword enchantment 4 (0 years) → 100×(1+0.1)=110, +5=115 — R3 threshold
16. cursed sword enchantment 5 → 100×(1+0.5+0.3+0.1)=190,+5=195 — R3
17. 2 years customer, one sword → 100×1.1 − 0.2×100 + 5 = 110−20+5=95 — R4
18. 3 years customer, second quote, cursed ench 7 sword → 160 (integration ex 2)
    — R3, R4 all combined
19. cursed sword + plain amulet (0 years, first quote): item subtotals
    100×(1+0.5+0.1)=160, 60×(1+0.1)=66; total 226; no policy mods;
    +5=231 — R3 scope (cursed adds 50 only to sword)
20. rounding up: scenario producing 197.5 → 198 (e.g. 7 runes case
    covers this; or design explicit: 7 runes gives 198) — R6
21. customer exactly 2 years (boundary) → loyalty applies — R4 threshold

### Claim operation
22. sword policy (1000 G insurance, cap 2000), damage 500 G regular →
    payout 400, remaining 1600 — R7, R8, R9
23. rune policy (250 G insurance), damage 200 G → payout 100, remaining 400
    — R8, R9 (components no clauses)
24. sword + amulet policy, dragon damages both (sword 500, amulet 300)
    → payout 600 (400+200), remaining 2600 — R8 multi-item
25. dragon sword ench 8, dmg 1000 → payout 400 (50% wins, then deductible)
    — R9 boundary
26. dragon sword ench 9, dmg 1000 → payout 400 — R9
27. dragon sword ench 5, dmg 800 → payout 700 (dragon only) — R9
28. steel sword ench 9, dmg 1000 → payout 400 (high-ench only) — R9
29. two swords policy, dragon damages both swords → each separate
    deductible (e.g. 500+500 → payout 800, cap 4000−800=3200) — Q2
30. two sword damage entries but only one sword insured → CLI exits
    non-zero, error on stderr, no results — Q2 error
31. cap exhaustion: sword policy (cap 2000), two claims of 1500 each:
    - claim 1: desired 1400, payout 1400, remaining 600
    - claim 2: desired 1400 reduced to 600, payout 600, remaining 0
    — R10
32. cursed sword cap = 2000 G (not based on premium modifiers) — R7
33. sword + 3 runes (block) → insurance sum 1750, cap 3500 — R7

### Payout rounding (R6)
34. payout that yields 350.5 → 350 (round down). Example: dragon sword
    ench 8, dmg 901 → 901/2 − 100 = 350.5 → 350

### CLI / error cases
35. CLI: reads JSON from stdin, writes results JSON to stdout (schema
    example: amulet 5-year quote then claim) — interface contract
36. CLI: quote with unknown item type (broomstick) → exit non-zero,
    error to stderr, no results on stdout
37. CLI: claim references item not in policy → exit non-zero, error
    to stderr
38. CLI: claim with negative amount → exit non-zero, error to stderr
39. CLI: multi-step scenario with quote followed by claim referencing
    policy by zero-based index → results array matches steps order
