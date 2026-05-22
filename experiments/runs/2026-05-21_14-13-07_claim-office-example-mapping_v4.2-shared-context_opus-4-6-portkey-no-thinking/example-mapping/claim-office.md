# MHPCO Claim Office - Example Mapping

## Rules

### R1: Item values and base premiums
Each main item has a fixed insurance value and base premium:
- Sword: 1000G value, 100G base premium
- Amulet: 600G value, 60G base premium
- Staff: 800G value, 80G base premium
- Potion: 400G value, 40G base premium

### R2: Component premiums
Components (runes, moonstones) cost 250G value, 25G base premium each.
A building block of exactly 3 alike (same type) components = 60G base premium.
Block requires exactly 3; 4 of the same type = 4x25G = 100G (no block).

### R3: Cursed item surcharge
+50% surcharge on the affected item's base premium only (item-level modifier).

### R4: High enchantment surcharge
Enchantment level >= 5: +30% surcharge on the affected item's base premium only (item-level modifier).

### R5: Loyalty discount
Customer with >= 2 years with MHPCO: -20% discount on the policy base premium (policy-level modifier).

### R6: First insurance surcharge
+10% surcharge on the policy base premium. Always applies per quote -- every item in a quote is treated as first insurance regardless of customer history.

### R7: Follow-up contract discount
-15% discount on policy base premium for every contract after the customer's first quote in the scenario.

### R8: Processing fee
+5G added at the very end of every premium calculation.

### R9: Rounding (premiums)
Round up (ceil) to whole G. Only the final premium is rounded; intermediates kept as fractions.

### R10: Modifier application order
Item-level modifiers (cursed, high enchantment) apply to individual item base premiums. Policy-level modifiers (loyalty, first insurance, follow-up contract) apply to the sum of all item premiums (after item-level modifiers). Processing fee added last.

### R11: Deductible
100G deductible per damaged item (per damage entry).

### R12: Payout cap
Total payout per policy capped at 2x the insurance sum. Insurance sum = sum of item insurance values (unmodified by premium modifiers). Cap is tracked across claims against the same policy.

### R13: High enchantment claim clause
Damage to items with enchantment >= 8: reimbursed at 50% of damage amount.

### R14: Dragon material clause
Damage to items made of dragon material: fully reimbursed (100%).

### R15: Both clauses conflict resolution
When both enchantment >= 8 AND dragon material apply: 50% wins (enchantment clause takes precedence).

### R16: Rounding (payouts)
Round down (floor) to whole G. Only the final payout is rounded.

### R17: Damage validation
- damages array entries must match policy items (count per type)
- More damage entries of a type than policy covers = error (non-zero exit)
- Damage referencing item not in policy = error
- Negative damage amount = error
- Unknown item type in damage = error

### R18: Empty item list
Empty items array in quote = 5G premium (only processing fee).

### R19: Unknown item type in quote
Unknown type in quote items = non-zero exit code, error to stderr, no results to stdout.

### R20: CLI interface
- Executable `claim-office` reads JSON from stdin, writes JSON to stdout
- Entry point at `src/cli.ts`
- Input: `{customer, steps}` where steps are sequential quote/claim operations
- Output: `{results: [...]}` array matching steps
- Quote result: `{premium: <integer>}`
- Claim result: `{payout: <integer>, remainingCap: <integer>}`
- Steps processed sequentially; claims reference earlier quote by zero-based step index

### R21: Multiple items of same type
- Policy can cover multiple items of the same type (e.g. two swords)
- Insurance sum = sum of all items' values (e.g. 2 swords = 2000G)
- Each damage entry treated separately with its own deductible

### R22: Components have no enchantment/material
Runes and moonstones have no enchantment level or material, so no special claim clauses apply to them.

---

## Examples

### E1: Component block pricing
- 2 runes -> 50G base premium (2 x 25G)
- 3 runes -> 60G base premium (block of 3 alike)
- 4 runes -> 100G base premium (4 x 25G, no block)
- 7 runes -> 175G base premium (7 x 25G, no block)

### E2: "Alike" means same type
- 2 runes + 1 moonstone -> 75G (no block: different types)
- 3 runes + 3 moonstones -> 120G (two separate blocks: 60G + 60G)

### E3: Item-level modifier scope (multi-item)
- Cursed sword (100G) + plain amulet (60G) -> 160G policy base + 50G curse surcharge = 210G before policy modifiers and fee

### E4: Modifier thresholds
- Customer with exactly 2 years -> loyalty discount applies
- Sword with enchantment 5 -> high-enchantment surcharge applies
- Sword with enchantment 5, cursed -> both surcharges apply
- Sword with enchantment 4 -> no high-enchantment surcharge
- Dragon-material sword, enchantment 8, damage 1000G -> payout 400G (50% of 1000 = 500, minus 100 deductible)

### E5: Deductible per damage event
- Sword damage 500G + amulet damage 300G -> payout 600G (500-100 + 300-100)

### E6: Standard reimbursement
- Regular sword (steel, ench 3), damage 500G -> payout 400G (500 - 100)
- Rune, damage 200G -> payout 100G (200 - 100; no special clauses)

### E7: Enchantment vs dragon material in claims
- Dragon sword, ench 9, damage 1000G -> payout 400G (both clauses: 50% wins; 500 - 100)
- Dragon sword, ench 5, damage 800G -> payout 700G (only dragon clause: 800 - 100)
- Steel sword, ench 9, damage 1000G -> payout 400G (only ench clause: 500 - 100)

### E8: Multiple items of same type
- 2 swords -> insurance sum 2000G, cap 4000G
- 2 sword damages -> each gets own deductible
- 2 sword damages but only 1 sword insured -> error, non-zero exit

### E9: Cap exhaustion
- Sword + amulet -> insurance sum 1600G, cap 3200G
- Cursed sword (1000G value) -> cap 2000G (based on unmodified insurance value)
- Sword + 3 runes -> insurance sum 1750G (1000 + 3x250); block discount only affects premium
- Sword insured (sum 1000G, cap 2000G); two claims of 1500G damage each:
  - First claim: payout 1400G (1500-100), remaining cap 600G
  - Second claim: payout 600G (capped from desired 1400G), remaining cap 0G

### E10: Rounding
- Premium yielding 197.5G -> 198G (ceil)
- Payout yielding 350.5G -> 350G (floor)
- Intermediates kept as fractions

### E11: Edge cases
- Empty item list -> 5G premium
- Unknown type in quote (e.g. "broomstick") -> non-zero exit, stderr error, no stdout results
- Claim damage entry for item not in policy -> non-zero exit, stderr error
- Negative damage amount -> non-zero exit, stderr error

### E12: Integration - Newcomer cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, ench 3)
- Calculation: 100G base + 50G curse + 10G first insurance = 160G + 5G fee = 165G

### E13: Integration - Long-standing customer 2nd contract
- Customer: 3 years, second quote in scenario
- Item: cursed sword (steel, ench 7)
- Calculation: 100G base + 50G curse + 30G high ench - 20G loyalty + 10G first insurance - 15G follow-up = 155G + 5G fee = 160G
- First insurance surcharge always applies per quote regardless of customer history

---

## Questions / Clarifications

### Q1: "Alike" components (resolved)
"Alike" means exactly the same type. 2 runes + 1 moonstone = no block. 3 runes + 3 moonstones = two separate blocks.

### Q2: Cursed surcharge scope (resolved)
Item-level: cursed surcharge applies only to the cursed item's base premium, not the whole policy.

### Q3: First insurance meaning (resolved)
"First insurance" always applies to every item in every quote, regardless of customer history. It is NOT about whether the customer has had a contract before -- it means each item being quoted is getting its "first insurance." The follow-up contract discount is what reflects customer history.

### Q4: Multiple items of same type (resolved)
Allowed. Policy covers them individually. Damage entries must not exceed the count insured per type.

---

## Per-test Rationale

Each `it.todo()` maps to one or more rules/examples:

1. "empty item list -> 5G premium" -- R18, E11: edge case empty list
2. "single sword -> 100G base premium" -- R1: basic item pricing
3. "single amulet -> 60G base premium" -- R1: basic item pricing
4. "single staff -> 80G base premium" -- R1: basic item pricing
5. "single potion -> 40G base premium" -- R1: basic item pricing
6. "single sword with processing fee -> 115G" -- R1, R6, R8: base + first insurance + fee
7. "2 runes -> 50G base premium" -- R2, E1: component pricing
8. "3 runes -> 60G base premium (block)" -- R2, E1: block pricing
9. "4 runes -> 100G base premium (no block)" -- R2, E1: block requires exactly 3
10. "7 runes -> 175G base premium" -- R2, E1: no block for non-3 counts
11. "2 runes + 1 moonstone -> 75G (no block)" -- R2, E2, Q1: alike means same type
12. "3 runes + 3 moonstones -> 120G (two blocks)" -- R2, E2, Q1: separate blocks per type
13. "cursed sword -> +50% surcharge on item" -- R3, E3: cursed surcharge
14. "sword enchantment 5 -> +30% surcharge" -- R4, E4: high enchantment threshold
15. "sword enchantment 4 -> no high-enchantment surcharge" -- R4, E4: below threshold
16. "sword enchantment 5, cursed -> both surcharges" -- R3, R4, E4: both item-level modifiers
17. "cursed sword + plain amulet -> 210G before policy modifiers" -- R3, R10, E3, Q2: item-level scope
18. "loyalty discount for customer >= 2 years" -- R5, E4: loyalty discount
19. "customer exactly 2 years -> loyalty applies" -- R5, E4: threshold boundary
20. "first insurance +10% always applies" -- R6, E12, Q3: first insurance meaning
21. "follow-up contract -15% on second quote" -- R7, E13: follow-up discount
22. "newcomer cursed sword -> 165G" -- R1,R3,R6,R8, E12: full integration
23. "long-standing 2nd contract cursed sword ench 7 -> 160G" -- R1,R3,R4,R5,R6,R7,R8, E13: full integration
24. "premium 197.5G rounds up to 198G" -- R9, E10: rounding up
25. "standard claim: sword damage 500G -> payout 400G" -- R11, E6: basic claim
26. "rune damage 200G -> payout 100G" -- R11, R22, E6: component claim
27. "deductible per item: sword 500G + amulet 300G -> payout 600G" -- R11, E5: per-item deductible
28. "dragon-material sword ench 9, damage 1000G -> payout 400G" -- R13,R14,R15, E7: both clauses 50% wins
29. "dragon-material sword ench 5, damage 800G -> payout 700G" -- R14, E7: only dragon clause
30. "steel sword ench 9, damage 1000G -> payout 400G" -- R13, E7: only high ench clause
31. "dragon-material sword ench 8, damage 1000G -> payout 400G" -- R13,R14,R15, E4: threshold at 8
32. "payout 350.5G rounds down to 350G" -- R16, E10: rounding down
33. "2 swords -> insurance sum 2000G, cap 4000G" -- R12, R21, E8: multiple same type
34. "cap at 2x insurance sum" -- R12, E9: basic cap
35. "cursed sword cap based on unmodified insurance value -> 2000G" -- R12, E9: cap not affected by modifiers
36. "sword + 3 runes -> insurance sum 1750G" -- R12, E9: block discount only affects premium not insurance sum
37. "cap exhaustion across two claims" -- R12, E9: first claim 1400G, second claim capped at 600G
38. "2 sword damages each get own deductible" -- R11, R21, E8: multiple items same type
39. "2 sword damages but 1 insured -> error" -- R17, E8: count mismatch
40. "unknown item type in quote -> error" -- R19, E11: unknown type
41. "claim damage for item not in policy -> error" -- R17, E11: item mismatch
42. "negative damage amount -> error" -- R17, E11: negative damage
43. "CLI reads JSON from stdin and writes results to stdout" -- R20: CLI interface
44. "CLI quote result contains premium as integer" -- R20: output format
45. "CLI claim result contains payout and remainingCap as integer" -- R20: output format
46. "CLI non-zero exit and stderr for errors" -- R20, E11: error handling
47. "intermediates kept as fractions, only final rounded" -- R9, R16, E10: intermediate precision
48. "policy-level modifiers apply to sum of all item premiums" -- R10, E3: modifier order
49. "sword + amulet -> insurance sum 1600G, cap 3200G" -- R12, E9: multi-item cap
