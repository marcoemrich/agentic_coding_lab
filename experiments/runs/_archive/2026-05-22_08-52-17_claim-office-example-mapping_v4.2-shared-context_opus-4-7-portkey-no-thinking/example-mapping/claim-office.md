# MHPCO Claim Office — Example Mapping

## Rules

### R1: Item base values and premiums (price list)

Each "main" item has an insurance value and a base premium:

| Type   | Insurance value (G) | Base premium (G) |
|--------|---------------------|------------------|
| sword  | 1000                | 100              |
| amulet | 600                 | 60               |
| staff  | 800                 | 80               |
| potion | 400                 | 40               |

Components (rune, moonstone, etc.): insurance value 250 G each,
base premium 25 G per component. A "building block" of **exactly 3
alike** components is offered at a special base premium of 60 G
(replaces the 3 × 25 G for those 3 components only).

### R2: Premium modifiers

- **Cursed item:** +50 % surcharge on that item's base premium.
- **Highly enchanted** (enchantment level ≥ 5): +30 % surcharge on
  that item's base premium.
- **Long-standing customer** (yearsWithMHPCO ≥ 2): −20 % loyalty
  discount on the policy base premium (sum of item base premiums).
- **First insurance:** +10 % initial assessment surcharge — applied
  per item, on each item's base premium (every item in a quote is
  treated as a first insurance, regardless of customer history).
- **Follow-up contract** (customer's 2nd or later quote in the
  scenario): −15 % discount on the policy base premium.
- **Processing fee:** flat +5 G added at the very end.

Order of application (per integration examples):
1. Per-item modifiers (curse, high enchantment, first insurance)
   apply to each item's base premium.
2. Policy-wide modifiers (loyalty, follow-up) apply to the policy
   base premium (the sum of item base premiums).
3. The 5 G processing fee is added at the very end.
4. The total is rounded UP to the nearest whole G (in the MHPCO's
   favor).

Concrete: total = round_up(
  sum_of_item_base_premiums
  + sum_of_curse_surcharges (50 % of cursed items' base)
  + sum_of_high_enchant_surcharges (30 % of high-enchant items' base)
  + sum_of_first_insurance_surcharges (10 % of every item's base)
  − loyalty_discount (20 % of policy base, if applicable)
  − follow_up_discount (15 % of policy base, if applicable)
  + 5 G fee
)

Intermediate amounts are kept as fractions; only the final result
is rounded.

### R3: Claim processing

- **Deductible:** 100 G per damage event (per damaged item entry).
- **Cap:** total payout per policy capped at 2 × policy insurance
  sum. Cap is based on unmodified insurance values.
- **Enchantment ≥ 8 clause:** damage reimbursed at 50 % of damage
  amount (applied before the deductible).
- **Dragon material clause:** damage fully reimbursed.
- When both clauses apply, the 50 % rule wins (then deductible).
- Items without enchantment/material (e.g. runes) get full
  reimbursement minus deductible.

Per-damage payout formula:
1. Start with damage amount.
2. If enchantment ≥ 8 → halve it (50 % clause wins over dragon).
   Else if dragon material → keep full amount.
   Else → keep full amount.
3. Subtract 100 G deductible (floor at 0 for that item).
4. Sum per-damage payouts.
5. Cap the total to remaining cap.
6. Round DOWN to whole G (in the MHPCO's favor).

### R4: Rounding in MHPCO's favor

- Premiums round UP (e.g., 197.5 → 198).
- Payouts round DOWN (e.g., 350.5 → 350).
- Intermediate amounts kept as fractions; rounding only at the end.

### R5: Insurance sum & cap

- Insurance sum = sum of items' raw insurance values (block
  discount does NOT affect insurance sum).
- Cap = 2 × insurance sum.
- Cap is based on unmodified insurance values; premium modifiers do
  not raise the cap.
- Cap is consumed across successive claims on the same policy.

### R6: Multiple items of the same type

- A policy can list two of the same item type (e.g. two swords);
  insurance sum doubles.
- Each `{itemType, ...}` entry in `damages` is a separate damage
  event with its own deductible.
- If `damages` contains more entries of a type than the policy
  covers (e.g. two sword damages but only one sword insured), the
  whole claim is rejected: CLI exits non-zero, error to stderr.

### R7: CLI

- Reads JSON from stdin, writes JSON to stdout.
- Input has `customer` (with `yearsWithMHPCO`) and `steps` array.
- Each step is either a quote (`op: "quote"`, `items`) or claim
  (`op: "claim"`, `policy`, `incident: {cause, damages: [{itemType, amount}]}`).
- Steps processed sequentially; claims reference an earlier quote
  by zero-based step index.
- Output: `{results: [...]}` — same length/order as input steps.
  Quote result: `{premium}`. Claim result: `{payout, remainingCap}`.
- The follow-up surcharge tracks the customer's quote sequence
  within the scenario.
- The CLI executable is invoked via `src/cli.ts`.

### R8: Error handling

- Unknown item type in a quote → exit non-zero, error to stderr, no
  `results` to stdout.
- Claim references a damage entry whose item is not part of the
  policy (or item with unknown type) → exit non-zero, error to
  stderr.
- Damage entry with negative amount → exit non-zero, error to
  stderr.

## Examples

### E1: Building block — 2 runes (no block)
Base premium = 2 × 25 = **50 G**.

### E2: Building block — 3 runes (block applies)
Base premium = **60 G** (replaces 3 × 25).

### E3: Building block — 4 runes (no block; exactly 3 required)
Base premium = 4 × 25 = **100 G**.

### E4: Building block — 7 runes
The block requires **exactly 3** alike components. 7 ≠ 3, so no
block applies; all 7 are billed individually: 7 × 25 = **175 G**.

(Note: the block is a one-shot pricing rule for a group of exactly
3 — it does not "decompose" larger quantities into blocks + leftovers.)

### E5: "Alike" — 2 runes + 1 moonstone (different types)
No block: 2×25 + 25 = **75 G**.

### E6: "Alike" — 3 runes + 3 moonstones (two separate blocks)
60 + 60 = **120 G**.

### E7: Modifier scope — cursed sword + plain amulet
Item base premiums: 100 + 60 = 160 G.
Curse surcharge: 50 % × 100 = 50 G.
Before further modifiers/fee: **210 G**.

### E8: Loyalty threshold (exactly 2 years)
Loyalty discount applies.

### E9: High-enchantment threshold (exactly 5)
High-enchantment surcharge applies; if also cursed, both apply.

### E10: Low enchantment (4)
No high-enchantment surcharge; curse surcharge only if cursed.

### E11: Dragon sword, enchantment exactly 8, damage 1000 G
Payout = 500 − 100 = **400 G** (50 % rule wins, then deductible).

### E12: Dragon attack, sword (500 G) + amulet (300 G), deductible per item
Payout = (500 − 100) + (300 − 100) = **600 G**.

### E13: Standard sword, enchantment 3, damage 500 G
Payout = 500 − 100 = **400 G**.

### E14: Rune damage 200 G
Payout = 200 − 100 = **100 G**.

### E15: Dragon sword enchantment 9, damage 1000 G
Both clauses; 50 % wins. 500 − 100 = **400 G**.

### E16: Dragon sword enchantment 5, damage 800 G
Only dragon clause applies. 800 − 100 = **700 G**.

### E17: Steel sword enchantment 9, damage 1000 G
Only high-enchant clause. 500 − 100 = **400 G**.

### E18: Two swords policy — insurance sum & cap
Insurance sum 2000 G; cap 4000 G.

### E19: Two-sword policy, dragon attack damages both
Two `{itemType: sword}` entries → each its own deductible.

### E20: Too many damages for what's insured
Two sword damages but only one sword insured → claim rejected,
CLI exits non-zero, error to stderr.

### E21: Cap = 2 × insurance sum (sword + amulet)
Insurance sum = 1600 G; cap = **3200 G**.

### E22: Cap based on unmodified values
Cursed sword (premium 165 G after modifiers): cap still **2000 G**.

### E23: Block discount doesn't affect insurance sum
Sword + 3 runes: insurance sum = 1000 + 3 × 250 = **1750 G**.

### E24: Cap exhaustion across successive claims
Sword (cap 2000 G); two claims of 1500 G each.
- Claim 1: payout = 1400 G (1500 − 100 deductible), cap remaining
  600 G.
- Claim 2: desired 1400 G capped to 600 G remaining. Payout 600 G,
  cap remaining 0 G.

### E25: Rounding — premium 197.5 → 198
### E26: Rounding — payout 350.5 → 350

### E27: Empty item list
Premium = **5 G** (only processing fee).

### E28: Unknown item type in quote
CLI exits non-zero, stderr error, no `results` on stdout.

### E29: Claim references item not in policy
(amulet damaged but only sword insured, OR unknown item type)
→ CLI exits non-zero, stderr error.

### E30: Negative damage amount
→ CLI exits non-zero, stderr error.

### E31: Newcomer integration — cursed sword (steel, enchant 3),
customer 0 years, first contract.
100 (base) + 50 (curse) + 10 (first insurance) + 5 (fee) =
**165 G**.

### E32: Long-standing customer's 2nd contract — cursed sword
(steel, enchant 7), customer 3 years.
100 base + 50 curse + 30 high enchant − 20 loyalty + 10 first
insurance − 15 follow-up + 5 fee = **160 G**.

## Interface contract

The CLI reads JSON from stdin and writes JSON to stdout. Field
names below are normative.

### Input

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

### Output

```json
{
  "results": [
    {"premium": 60},
    {"payout": 100, "remainingCap": 1100}
  ]
}
```

(The exact numbers depend on the inputs; only the **shape** above
is binding.)

- Item types: `"sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone"` (others → error).
- Component types include `"rune"` and `"moonstone"`; other component-like types may exist but the spec names only these two.
- Item properties `material`, `enchantment`, `cursed` are optional; main items default to non-cursed, no enchantment, generic material.
- Components don't have enchantment/material/cursed in any example;
  treat absent properties as default (no surcharge applies).

## Questions / Clarifications

- ❓ "Alike" components → resolved by spec: same TYPE (not family).
  E.g. 2 runes + 1 moonstone is NOT a block. (E5, E6)
- ❓ Cursed surcharge scope → resolved: per-item, not per-policy.
  Curse surcharge = 50 % of the cursed item's base premium. (E7)
- ❓ Multiple items of same type → resolved: allowed; each damage
  entry is treated independently with its own deductible. Too-many
  damages → claim rejected. (E18-20)
- ❓ "First insurance" → resolved: applies per item in each quote,
  regardless of customer history. (E32)

## Per-test rationale

Tests target the `claim-office.ts` module's pure functions
(`quote(customer, items)` returning premium integer, and
`claim(policy, incident, remainingCap)` returning {payout,
remainingCap}). CLI tests exercise the JSON in/out flow including
scenario sequencing, error handling, and exit codes.

Ordered simple → complex:

### Quote function (pure)
1. Empty item list → 5 G fee only (E27, R7-trivial)
2. Single sword, newcomer, no curse, low enchant → 100 + 10 + 5 = 115 G (R1, R2 baseline)
3. Single amulet, newcomer → 60 + 6 + 5 = 71 G (R1)
4. Single staff, newcomer → 80 + 8 + 5 = 93 G (R1)
5. Single potion, newcomer → 40 + 4 + 5 = 49 G (R1)
6. 2 runes, newcomer → 50 base + 5 first ins (10%) + 5 fee = 60 G (E1, R1)
7. 3 runes (block), newcomer → 60 + 6 + 5 = 71 G (E2, R1)
8. 4 runes (no block), newcomer → 100 + 10 + 5 = 115 G (E3, R1)
9. 7 runes → 175 + 17.5 + 5 = 197.5 → 198 G (E4, E25, rounding)
10. 2 runes + 1 moonstone → 75 + 7.5 + 5 = 87.5 → 88 G (E5)
11. 3 runes + 3 moonstones → 120 + 12 + 5 = 137 G (E6)
12. Cursed sword newcomer (integration E31) → 165 G
13. Cursed sword + plain amulet, newcomer → policy base 160, curse +50, first ins 10+6=16, fee 5 → 231 G (E7 integration; isolated value 210 G before further mods+fee documented in spec)
14. Loyalty threshold: exactly 2 years, single sword → 100 base − 20 loyalty + 10 first + 5 fee = 95 G (E8, R2)
15. Loyalty just below: 1 year, single sword → 100 + 10 + 5 = 115 G (no loyalty)
16. High enchant threshold exactly 5: sword enchant 5 → 100 + 30 + 10 + 5 = 145 G (E9)
17. High enchant just below 4: sword enchant 4 → 100 + 10 + 5 = 115 G (E10)
18. Cursed + enchant 5 sword → 100 + 50 + 30 + 10 + 5 = 195 G (E9 combined)
19. Long-standing customer 2nd contract integration (E32) → 160 G
20. Premium rounded up — confirms 197.5 → 198 (covered by test 9, also E25)

### Claim function (pure)
21. Standard sword damage 500, no special → 400 (E13)
22. Rune damage 200 → 100 (E14)
23. Dragon sword enchant 8, damage 1000 → 400 (E11, 50% wins)
24. Dragon sword enchant 9, damage 1000 → 400 (E15)
25. Dragon sword enchant 5, damage 800 → 700 (E16)
26. Steel sword enchant 9, damage 1000 → 400 (E17)
27. Dragon attack: sword 500 + amulet 300 → 600 (E12)
28. Two swords policy, dragon attack two swords damages: each its own deductible (E19)
29. Cap = 2 × insurance sum (sword + amulet → 3200) (E21)
30. Cap unaffected by premium modifiers (cursed sword cap still 2000) (E22)
31. Block discount doesn't affect insurance sum: sword + 3 runes → 1750, cap 3500 (E23)
32. Cap exhaustion across two claims: 1500 → 1400 (cap 600), 1500 → 600 (cap 0) (E24)
33. Payout rounded down — 350.5 → 350 (E26) — construct a half-G scenario via 50% clause: dragon irrelevant; sword enchant 8 damage 901 → halve to 450.5, minus 100 → 350.5 → 350.

### CLI (JSON in/out)
34. CLI quote round-trip with schema example → {results: [{premium: N}]}
35. CLI scenario: quote then claim referencing policy index 0 → results array with both
36. CLI follow-up tracking: two quotes, second gets follow-up discount (E32 scenario)
37. CLI unknown item type in quote → exit non-zero, stderr error, no results (E28)
38. CLI claim references item not in policy → exit non-zero, stderr error (E29)
39. CLI negative damage amount → exit non-zero, stderr error (E30)
40. CLI too-many-damages (E20) → exit non-zero, stderr error
