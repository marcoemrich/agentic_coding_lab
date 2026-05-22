# MHPCO Claim Office -- Example Mapping

## Rules

### R1 -- Item values and base premiums
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G
- Components (runes, moonstones, etc.): 250 G insurance value, 25 G base premium each

### R2 -- Component block discount
- A building block of exactly 3 alike components has a special base premium of 60 G (instead of 3 x 25 = 75 G)
- "Alike" means exactly the same type (e.g. 3 runes, not 2 runes + 1 moonstone)
- Block requires exactly 3; 4 of the same type = 4 x 25 = 100 G (no block)
- Multiple blocks are possible if there are multiple groups of exactly 3 alike components

### R3 -- Premium modifiers (item-specific)
- Cursed items: +50% surcharge on that item's base premium
- Highly enchanted (enchantment >= 5): +30% surcharge on that item's base premium
- Both can stack on the same item

### R4 -- Premium modifiers (policy-wide)
- Long-standing customer (yearsWithMHPCO >= 2): -20% loyalty discount on policy base premium
- First insurance: +10% surcharge on policy base premium (every item in a quote is treated as first insurance, regardless of customer history)
- Follow-up contract (each quote after the first in a scenario): -15% discount on policy base premium
- Processing fee: +5 G added at the very end

### R5 -- Modifier application order
- Item-specific modifiers (cursed, high enchantment) apply to the base premium of the affected item
- Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply to the policy base premium (sum of all item base premiums including item-specific surcharges)
- Processing fee is added last
- All amounts rounded to whole G in MHPCO's favor at the end only (intermediates kept as fractions)

### R6 -- Rounding in MHPCO's favor
- Premium: round UP (ceil) -- 197.5 -> 198 G
- Payout: round DOWN (floor) -- 350.5 -> 350 G
- Only final amounts are rounded; intermediates are kept as fractions

### R7 -- Claim: deductible
- 100 G deductible per damage event (per damaged item entry)

### R8 -- Claim: enchantment >= 8 reimbursement
- Items with enchantment level >= 8: reimbursed at 50% of the damage amount (before deductible)

### R9 -- Claim: dragon material
- Items made of dragon material: fully reimbursed (before deductible)

### R10 -- Claim: enchantment >= 8 AND dragon material
- When both clauses apply (dragon material + enchantment >= 8), the 50% rule wins (worse for customer / MHPCO's favor), then deductible

### R11 -- Claim: cap
- Total payout per policy capped at 2x insurance sum
- Insurance sum = sum of items' unmodified insurance values (premium modifiers don't raise the cap)
- Cap tracked across multiple claims on the same policy

### R12 -- Claim: standard reimbursement
- Items with no special clause (enchantment < 8, not dragon material): full reimbursement minus deductible
- Components (runes, moonstones) have no enchantment or material, so always get standard reimbursement

### R13 -- Multiple items of the same type
- A policy can cover multiple items of the same type (e.g. two swords)
- Insurance sum and cap scale accordingly (2 swords -> 2000 G sum, 4000 G cap)
- Each damage entry treated as separate damage with own deductible
- If damages array has more entries of a type than the policy covers -> CLI exits non-zero, whole claim rejected

### R14 -- Edge cases / error handling
- Empty item list -> premium 5 G (processing fee only)
- Unknown item type in quote -> CLI exits non-zero, error to stderr, no results to stdout
- Claim references item not in policy (wrong type or unknown type) -> CLI exits non-zero, error to stderr
- Negative damage amount -> CLI exits non-zero, error to stderr

### R15 -- CLI input/output format
- CLI executable: `claim-office` (entry point at `src/cli.ts`)
- Reads JSON from stdin: `{ customer: { yearsWithMHPCO: N }, steps: [...] }`
- Each step: `{ op: "quote", items: [...] }` or `{ op: "claim", policy: <step-index>, incident: { cause: "...", damages: [...] } }`
- Writes JSON to stdout: `{ results: [...] }` in same order as steps
- Quote result: `{ premium: <integer> }`
- Claim result: `{ payout: <integer>, remainingCap: <integer> }`

---

## Examples (from spec, with expected values)

### E1 -- Component base premiums
- 2 runes -> 50 G base premium
- 3 runes -> 60 G base premium (block)
- 4 runes -> 100 G base premium (no block)
- 7 runes -> 175 G base premium

### E2 -- Alike components
- 2 runes + 1 moonstone -> 75 G base premium (no block: different types)
- 3 runes + 3 moonstones -> 120 G base premium (two blocks)

### E3 -- Cursed surcharge scope
- Cursed sword (100 G base) + plain amulet (60 G base) -> policy base 160 G; cursed surcharge = 50 G (50% of 100 G, not 160 G); total before further modifiers and fee = 210 G

### E4 -- Modifier thresholds
- Customer with exactly 2 years -> loyalty discount applies
- Sword with exactly enchantment 5 -> high-enchantment surcharge applies
- Sword enchantment 5, cursed -> both surcharges apply
- Sword enchantment 4 -> no high-enchantment surcharge
- Dragon-material sword, enchantment 8, damage 1000 G -> payout 400 G (50% reimbursement: 500 - 100 deductible)

### E5 -- Deductible per damage event
- Dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (100 G deductible each: (500-100) + (300-100))

### E6 -- Standard reimbursement
- Regular sword (steel, enchantment 3), damage 500 G -> payout 400 G
- Rune, damage 200 G -> payout 100 G

### E7 -- Enchantment vs dragon material interactions
- Dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% -> 500, minus 100 deductible)
- Dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full -> 800, minus 100)
- Steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% -> 500, minus 100)

### E8 -- Multiple items same type
- Policy covers two swords -> insurance sum 2000 G, cap 4000 G
- Two sword damages, two swords insured -> each gets own deductible
- Two sword damages but only one sword insured -> CLI exits non-zero

### E9 -- Cap exhaustion
- Policy: sword + amulet -> insurance sum 1600 G, cap 3200 G
- Cursed sword (1000 G value, 165 G premium) -> cap 2000 G (based on unmodified insurance value)
- Policy: sword + 3 runes (block) -> insurance sum 1750 G (1000 + 3x250); block affects premium only
- Sword insured (1000 G sum, 2000 G cap); two successive claims of 1500 G each:
  - First claim: payout 1400 G, remaining cap 600 G
  - Second claim: payout 600 G (clamped from 1400 G), remaining cap 0 G

### E10 -- Rounding
- Premium 197.5 G -> 198 G (rounded up)
- Payout 350.5 G -> 350 G (rounded down)
- Intermediates kept as fractions

### E11 -- Edge cases
- Empty item list -> premium 5 G
- Unknown item type in quote -> CLI exits non-zero, error to stderr
- Claim references item not in policy -> CLI exits non-zero, error to stderr
- Negative damage amount -> CLI exits non-zero, error to stderr

### E12 -- Integration: newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, enchantment 3)
- Premium: 165 G = 100 base + 50 curse + 10 first insurance + 5 fee

### E13 -- Integration: long-standing customer's second contract
- Customer: 3 years, second quote in scenario
- Item: cursed sword (steel, enchantment 7)
- Premium: 160 G = 100 base + 50 curse + 30 high enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 155 + 5 = 160

---

## Questions / Clarifications (resolved)

### Q1 -- "Alike" components
"Alike" means exactly the same type (e.g. 3 runes), not the same family.

### Q2 -- Cursed surcharge scope
Item-specific modifiers apply to the affected item's base premium only, not the whole policy.

### Q3 -- First insurance meaning
"First insurance" means each item in a quote is treated as a first insurance regardless of customer history. The surcharge always applies.

### Q4 -- Multiple items of the same type
Allowed. Each damage entry is separate. Excess damage entries (more than insured) cause CLI to exit non-zero.

---

## Per-test rationale

Each `it.todo()` in `claim-office.spec.ts` and the rule/example it covers:

1. "should return 100 G base premium for a single sword" -- R1 (sword base premium)
2. "should return 60 G base premium for a single amulet" -- R1 (amulet base premium)
3. "should return 80 G base premium for a single staff" -- R1 (staff base premium)
4. "should return 40 G base premium for a single potion" -- R1 (potion base premium)
5. "should return 25 G base premium for a single rune component" -- R1 (component base premium)
6. "should return 50 G base premium for 2 runes" -- R2/E1 (2 runes, no block)
7. "should return 60 G base premium for 3 runes (block discount)" -- R2/E1 (block of 3)
8. "should return 100 G base premium for 4 runes (no block)" -- R2/E1 (4 runes, block requires exactly 3)
9. "should return 175 G base premium for 7 runes" -- R2/E1 (7 runes, no blocks)
10. "should return 75 G base premium for 2 runes + 1 moonstone (no block, different types)" -- R2/E2/Q1
11. "should return 120 G base premium for 3 runes + 3 moonstones (two blocks)" -- R2/E2/Q1
12. "should add 50% cursed surcharge to the cursed item only" -- R3/E3/Q2
13. "should add 30% high-enchantment surcharge for enchantment >= 5" -- R3/E4
14. "should not add high-enchantment surcharge for enchantment 4" -- R3/E4
15. "should stack cursed and high-enchantment surcharges on the same item" -- R3/E4
16. "should apply 20% loyalty discount for customer with >= 2 years" -- R4/E4
17. "should apply loyalty discount for customer with exactly 2 years" -- R4/E4
18. "should not apply loyalty discount for customer with 1 year" -- R4
19. "should add 10% first insurance surcharge on policy base premium" -- R4/R5
20. "should apply 15% follow-up discount on second and subsequent quotes" -- R4
21. "should add 5 G processing fee at the end" -- R4
22. "should return 5 G premium for empty item list (fee only)" -- R14/E11
23. "should apply item-specific modifiers before policy-wide modifiers" -- R5/E3
24. "should round premium up (ceil) -- 197.5 -> 198 G" -- R6/E10
25. "should round payout down (floor) -- 350.5 -> 350 G" -- R6/E10
26. "should keep intermediates as fractions, rounding only the final result" -- R6/E10
27. "should compute 165 G for newcomer with cursed sword (100 base + 50 curse + 10 first + 5 fee)" -- E12 integration
28. "should compute 160 G for long-standing customer second contract (100 + 50 + 30 - 20 + 10 - 15 + 5)" -- E13 integration
29. "should apply 100 G deductible per damaged item" -- R7/E5
30. "should return 400 G payout for regular sword (steel, enchantment 3) with 500 G damage" -- R12/E6
31. "should return 100 G payout for rune with 200 G damage" -- R12/E6
32. "should reimburse at 50% for enchantment >= 8 then apply deductible" -- R8/E7
33. "should fully reimburse dragon material then apply deductible" -- R9/E7
34. "should apply 50% rule when both dragon material and enchantment >= 8" -- R10/E7
35. "should return 700 G payout for dragon-material sword enchantment 5, 800 G damage (full - 100)" -- R9/E7
36. "should return 400 G payout for dragon-material sword enchantment 8, 1000 G damage (50% - 100)" -- R10/E4
37. "should return 400 G payout for steel sword enchantment 9, 1000 G damage (50% - 100)" -- R8/E7
38. "should apply deductible per damage event (sword 500 + amulet 300 -> 600 G payout)" -- R7/E5
39. "should cap total payout at 2x insurance sum" -- R11/E9
40. "should compute insurance sum as 2000 G for two swords, cap 4000 G" -- R13/E8
41. "should compute insurance sum as 1600 G for sword + amulet, cap 3200 G" -- R11/E9
42. "should base cap on unmodified insurance value (cursed sword 1000 G -> cap 2000 G)" -- R11/E9
43. "should compute insurance sum 1750 G for sword + 3 runes block (block affects premium only)" -- R11/E9
44. "should track cap across successive claims (1400 + 600 = 2000 cap)" -- R11/E9
45. "should treat each damage entry for same-type items separately with own deductible" -- R13/E8
46. "should reject claim when damages exceed insured item count (non-zero exit)" -- R13/E8/R14
47. "should exit non-zero for unknown item type in quote" -- R14/E11
48. "should exit non-zero for claim referencing item not in policy" -- R14/E11
49. "should exit non-zero for negative damage amount" -- R14/E11
50. "should read JSON from stdin and write results JSON to stdout" -- R15
51. "should output quote result with premium field" -- R15
52. "should output claim result with payout and remainingCap fields" -- R15
53. "should process sequential steps where claim references earlier quote by index" -- R15
54. "should write error to stderr on invalid input" -- R14/R15
