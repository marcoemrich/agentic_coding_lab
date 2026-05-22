# MHPCO Claim Office -- Example Mapping

## Operations

Two operations: **quote** (compute premium) and **claim** (process damage report).

---

## Rules

### R1: Item values and base premiums
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G
- Components (runes, moonstones, etc.): 250 G insurance value, 25 G base premium each

### R2: Component building block
- A group of exactly 3 alike components gets a special base premium of 60 G (instead of 3 x 25 = 75 G).
- "Alike" means exactly the same component type (rune vs moonstone are different types).
- Only groups of exactly 3 qualify; 4 of the same type = 4 x 25 = 100 G (no block).
- Multiple blocks of different types are allowed (e.g., 3 runes + 3 moonstones = 60 + 60 = 120 G).

### R3: Premium modifiers -- item-specific
- **Cursed**: +50% surcharge on the cursed item's base premium.
- **High enchantment** (enchantment >= 5): +30% surcharge on that item's base premium.
- Both can apply to the same item (they stack additively on the base premium).

### R4: Premium modifiers -- policy-wide
- **Loyalty discount** (customer yearsWithMHPCO >= 2): -20% of the policy base premium (sum of all item base premiums).
- **First insurance surcharge**: +10% of the policy base premium. Every item in a quote is treated as a first insurance regardless of customer history.
- **Follow-up contract discount**: -15% of the policy base premium on each contract after the customer's first quote in the scenario.

### R5: Processing fee
- 5 G processing fee added at the very end of every premium calculation.

### R6: Modifier application order
- Item-specific modifiers (cursed, high enchantment) apply to each item's base premium.
- Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium (sum of all item base premiums before item-specific modifiers? No -- the policy base premium is the sum of item base premiums).
- Wait, looking at integration example 1: 100 G base + 50 G curse + 10 G first insurance = 160 G.
  - The 10 G first insurance is 10% of 100 G (the item base premium, which is also the policy base premium here).
  - So policy-wide modifiers apply to the sum of item base premiums (not the sum after item-specific modifiers).
- Processing fee is added last.

### R7: Rounding
- Round in MHPCO's favor: premiums round UP, payouts round DOWN.
- Intermediate amounts are kept as fractions; only the final result is rounded.

### R8: Claim deductible
- 100 G deductible per damage event (per damaged item entry).

### R9: Claim cap
- Total payout per policy is capped at 2x the insurance sum.
- Insurance sum = sum of all items' insurance values (unmodified by premium modifiers).
- Component block discount affects premium only, not insurance sum.
- Cap persists across multiple claims on the same policy.

### R10: Claim special reimbursement clauses
- Enchantment >= 8: reimbursed at 50% of damage amount (before deductible).
- Dragon material: fully reimbursed.
- If both apply (dragon material AND enchantment >= 8): 50% rule wins.
- Components (runes, moonstones) have no enchantment level or material, so no special clause applies -- standard full reimbursement.

### R11: Claim payout calculation order
- Apply reimbursement clause (50% for high-enchantment, 100% for dragon material or standard).
- Subtract 100 G deductible.
- Clamp to remaining cap.
- Round down (MHPCO's favor).

### R12: Multiple items of the same type
- A policy can cover multiple items of the same type.
- Each damage entry is treated separately with its own deductible.
- If damages array has more entries of a given type than the policy covers, reject with non-zero exit code.

### R13: Sequential steps
- Steps are processed sequentially. A claim step references an earlier quote step by its zero-based index in the `policy` field.
- Multiple claims can reference the same policy; cap carries over.

### R14: CLI interface
- Entry point: `src/cli.ts`
- Reads JSON from stdin, writes JSON to stdout.
- Input: `{ customer: { yearsWithMHPCO: N }, steps: [...] }`
- Output: `{ results: [...] }` where each result is `{ premium: N }` for quote or `{ payout: N, remainingCap: N }` for claim.

### R15: Error handling
- Unknown item type in quote -> non-zero exit, error to stderr, no results to stdout.
- Damage entry referencing item not in policy -> non-zero exit, error to stderr.
- Unknown item type in damage -> non-zero exit, error to stderr.
- Negative damage amount -> non-zero exit, error to stderr.
- More damage entries of a type than the policy covers -> non-zero exit, error to stderr.

---

## Examples

### E1: Component base premiums
- 2 runes -> 50 G base premium (2 x 25)
- 3 runes -> 60 G base premium (block applies)
- 4 runes -> 100 G base premium (4 x 25, no block)
- 7 runes -> 175 G base premium (7 x 25, no block)

### E2: "Alike" means same type
- 2 runes + 1 moonstone -> 75 G (no block: different types)
- 3 runes + 3 moonstones -> 120 G (two blocks: 60 + 60)

### E3: Modifier scope on multi-item policies
- Cursed sword (base 100) + plain amulet (base 60) -> policy base 160 G; curse surcharge = 50 (50% of cursed sword's 100 G base) -> 210 G before further modifiers and fee.

### E4: Modifier thresholds
- Customer with exactly 2 years -> loyalty discount applies.
- Sword with enchantment 5 -> high-enchantment surcharge applies.
- Sword with enchantment 5 and cursed -> both surcharges apply.
- Sword with enchantment 4 -> no high-enchantment surcharge.
- Dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G (50% = 500, minus 100 deductible).

### E5: Deductible per damage event
- Dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (each gets its own 100 G deductible: (500-100) + (300-100) = 400 + 200 = 600).

### E6: Standard reimbursement
- Regular sword (steel, enchantment 3), damage 500 G -> payout 400 G (500 - 100).
- Rune, damage 200 G -> payout 100 G (200 - 100; no special clause).

### E7: Enchantment threshold vs. dragon material
- Dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% = 500, minus 100).
- Dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full reimbursement, minus 100).
- Steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% = 500, minus 100).

### E8: Multiple items same type
- Two swords -> insurance sum 2000 G, cap 4000 G.
- Dragon attack damages both swords -> each damage entry treated separately with own deductible.
- More damage entries than insured items -> non-zero exit code, claim rejected.

### E9: Cap exhaustion
- Sword + amulet -> insurance sum 1600 G, cap 3200 G.
- Cursed sword (insurance 1000 G, premium 165 G) -> cap 2000 G (cap based on unmodified insurance value).
- Sword + 3 runes (block) -> insurance sum 1750 G (1000 + 3x250); block discount affects premium only.
- Sword insured (sum 1000 G, cap 2000 G); two successive claims of 1500 G each:
  - First claim -> payout 1400 G (1500 - 100), remaining cap 600 G.
  - Second claim -> payout 600 G (capped), remaining cap 0 G.

### E10: Rounding
- Premium yields 197.5 -> 198 G (round up).
- Payout yields 350.5 -> 350 G (round down).
- Intermediate fractions kept; only final value rounded.

### E11: Edge cases
- Empty item list -> premium 5 G (processing fee only).
- Unknown item type in quote -> non-zero exit, error to stderr.
- Damage entry for item not in policy -> non-zero exit, error to stderr.
- Negative damage amount -> non-zero exit, error to stderr.

### E12: Integration -- Newcomer with cursed sword
- Customer: 0 years, no previous contract.
- Item: cursed sword (steel, enchantment 3).
- Premium: 165 G = 100 base + 50 curse + 10 first insurance + 5 fee.

### E13: Integration -- Long-standing customer's second contract
- Customer: 3 years, second quote in scenario.
- Item: cursed sword (steel, enchantment 7).
- Premium: 160 G = 100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee.
- The first insurance surcharge applies to every item regardless of customer history.

---

## Questions / Clarifications

### Q1: "Alike" components (resolved)
"Alike" means exactly the same component type. Runes and moonstones are different types and do not form a block together.

### Q2: Modifier scope (resolved)
Item-specific modifiers (cursed, high enchantment) apply to the individual item's base premium. Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium (sum of all item base premiums, NOT the sum after item-specific modifiers).

### Q3: First insurance meaning (resolved)
"First insurance" surcharge applies per-item in every quote. Even long-standing customers on follow-up contracts pay it. It means each item in a quote is treated as a first insurance.

---

## Per-test Rationale

1. **empty item list -> premium 5 G** -- R5/E11: processing fee only
2. **single sword -> 100 G base premium** -- R1: base premium for sword
3. **single amulet -> 60 G base premium** -- R1: base premium for amulet
4. **single staff -> 80 G base premium** -- R1: base premium for staff
5. **single potion -> 40 G base premium** -- R1: base premium for potion
6. **single rune -> 25 G base premium** -- R1: component base premium
7. **2 runes -> 50 G base premium** -- E1: no block
8. **3 runes -> 60 G base premium** -- R2/E1: block applies
9. **4 runes -> 100 G base premium** -- R2/E1: no block (not exactly 3)
10. **7 runes -> 175 G base premium** -- R2/E1: no block
11. **2 runes + 1 moonstone -> 75 G** -- R2/E2/Q1: different types, no block
12. **3 runes + 3 moonstones -> 120 G** -- R2/E2: two separate blocks
13. **cursed sword -> +50% surcharge on item** -- R3: cursed modifier
14. **enchantment 5 sword -> +30% surcharge** -- R3/E4: high enchantment threshold
15. **enchantment 4 sword -> no surcharge** -- R3/E4: below threshold
16. **cursed + enchantment 5 -> both surcharges** -- R3/E4: both apply
17. **cursed sword + plain amulet -> 210 G before policy modifiers** -- R3/E3/Q2: cursed surcharge on item only
18. **loyalty discount for customer >= 2 years** -- R4/E4: loyalty threshold
19. **no loyalty discount for customer < 2 years** -- R4: below threshold
20. **first insurance surcharge +10%** -- R4: first insurance
21. **follow-up contract discount -15%** -- R4: second+ quote
22. **newcomer cursed sword integration -> 165 G** -- E12: full integration
23. **long-standing customer second contract -> 160 G** -- E13: full integration
24. **rounding premium up (197.5 -> 198)** -- R7/E10: round up
25. **rounding payout down (350.5 -> 350)** -- R7/E10: round down
26. **standard reimbursement: steel sword ench 3, damage 500 -> payout 400** -- R8/E6
27. **rune damage 200 -> payout 100** -- R8/E6: component, no special clause
28. **high enchantment claim (ench >= 8) -> 50% reimbursement** -- R10/E7
29. **dragon material -> full reimbursement** -- R10/E7
30. **dragon material + ench >= 8 -> 50% wins** -- R10/E7
31. **dragon material + ench 5 -> full reimbursement (800 -> 700)** -- R10/E7
32. **deductible per damage event** -- R8/E5: multiple damaged items
33. **two swords insured -> insurance sum 2000, cap 4000** -- R9/R12/E8
34. **cap = 2x insurance sum** -- R9/E9
35. **cap based on unmodified insurance value** -- R9/E9
36. **cap not affected by component block discount** -- R9/E9: sword + 3 runes = 1750 sum
37. **cap exhaustion across successive claims** -- R9/E9: first claim 1400, second capped at 600
38. **more damage entries than insured items -> error** -- R12/R15/E8
39. **unknown item type in quote -> error** -- R15/E11
40. **damage for item not in policy -> error** -- R15/E11
41. **negative damage amount -> error** -- R15/E11
42. **CLI reads JSON from stdin, writes JSON to stdout** -- R14: basic CLI
43. **CLI schema example: quote then claim** -- R14: full scenario
44. **CLI error exits with non-zero status code** -- R14/R15
45. **dragon-material sword ench 8 damage 1000 -> payout 400** -- E4: threshold example
46. **multiple items same type, each damage has own deductible** -- R12/E8
