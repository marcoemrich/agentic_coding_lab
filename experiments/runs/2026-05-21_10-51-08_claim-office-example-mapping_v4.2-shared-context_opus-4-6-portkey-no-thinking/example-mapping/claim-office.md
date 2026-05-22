# MHPCO Claim Office -- Example Mapping

## Rules

### R1 -- Item values and base premiums
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G insurance value, 60 G base premium
- Staff: 800 G insurance value, 80 G base premium
- Potion: 400 G insurance value, 40 G base premium
- Components (rune, moonstone): 250 G insurance value each, 25 G base premium each
- Building block of exactly 3 alike components: 60 G base premium (instead of 75 G)

### R2 -- Premium modifiers (applied in this order)
1. **Item-specific modifiers** (applied to each item's base premium):
   - Cursed: +50% surcharge on the cursed item's base premium
   - Highly enchanted (enchantment >= 5): +30% surcharge on that item's base premium
2. **Policy-wide modifiers** (applied to the sum of all item base premiums):
   - Long-standing customer (yearsWithMHPCO >= 2): -20% loyalty discount
   - First insurance: +10% surcharge (every item in a quote is treated as first insurance, regardless of history)
   - Follow-up contract (customer's 2nd+ quote): -15% discount
3. **Processing fee**: +5 G flat fee added at the very end

### R3 -- Rounding
- All amounts rounded to whole G in MHPCO's favor
- Premium: round UP (ceil)
- Payout: round DOWN (floor)
- Intermediate amounts kept as fractions; only final result rounded

### R4 -- Claim processing
- Deductible: 100 G per damaged item (per entry in the damages array)
- Total payout per policy capped at 2x the insurance sum
- Insurance sum = sum of all items' insurance values (unmodified by premium modifiers)
- Cap tracks across multiple claims against the same policy

### R5 -- Claim reimbursement clauses
- Enchantment >= 8: reimbursed at 50% of damage amount (before deductible)
- Dragon material: fully reimbursed
- Both apply: 50% wins (the enchantment clause takes precedence)
- Neither applies (standard): fully reimbursed
- Components (runes, moonstones): no enchantment level or material, so standard reimbursement

### R6 -- Multiple items of the same type
- Policy can cover multiple items of the same type
- Each damage entry is treated as a separate damage with its own deductible
- If damages array has more entries of a given type than the policy covers, reject with non-zero exit

### R7 -- Edge cases / errors
- Empty item list: premium = 5 G (processing fee only)
- Unknown item type in quote: CLI exits non-zero, error to stderr, no results to stdout
- Claim damage entry for item not in policy: CLI exits non-zero, error to stderr
- Claim damage entry for unknown item type: CLI exits non-zero, error to stderr
- Negative damage amount: CLI exits non-zero, error to stderr

### R8 -- CLI interface
- Entry point: src/cli.ts
- Reads JSON from stdin, writes JSON to stdout
- Input: `{ customer, steps }` where steps are sequential quote/claim operations
- Output: `{ results: [...] }` matching steps array length and order
- Quote result: `{ premium: <integer> }`
- Claim result: `{ payout: <integer>, remainingCap: <integer> }`
- Errors: non-zero exit code, error description to stderr, no results to stdout

---

## Examples

### E1 -- Building block of 3 alike components
- 2 runes: 2 * 25 = 50 G base premium
- 3 runes: 60 G base premium (block discount)
- 4 runes: 4 * 25 = 100 G base premium (no block; block requires exactly 3)
- 7 runes: 7 * 25 = 175 G base premium (no block possible; 7 is not exactly 3)

### E2 -- "Alike" components (type must match exactly)
- 2 runes + 1 moonstone: 75 G (no block; different types)
- 3 runes + 3 moonstones: 120 G (two separate blocks: 60 + 60)

### E3 -- Modifier scope on multi-item policies
- Cursed sword (100 G base) + plain amulet (60 G base) = 160 G policy base
- Curse surcharge: 50% of 100 = 50 G (item-specific, not policy-wide)
- 210 G before policy-wide modifiers and fee (per spec)
- For a 0-year first-quote customer: 160 + 50 curse + 16 first-ins (10% of 160) = 226 + 5 fee = 231 G

### E4 -- Modifier thresholds
- Customer with exactly 2 years: loyalty discount applies
- Sword enchantment exactly 5: high-enchantment surcharge applies
- Sword enchantment 4: no high-enchantment surcharge
- If cursed + enchantment 5: both surcharges apply

### E5 -- Deductible per damage event
- Dragon attack damages sword (500 G) and amulet (300 G)
- Payout = (500-100) + (300-100) = 600 G (100 G deductible per item)

### E6 -- Standard reimbursement
- Regular steel sword ench 3, damage 500 G: payout = 500-100 = 400 G
- Rune, damage 200 G: payout = 200-100 = 100 G

### E7 -- Enchantment threshold vs. dragon material
- Dragon sword, ench 9, damage 1000 G: 50% wins, payout = 500-100 = 400 G
- Dragon sword, ench 5, damage 800 G: dragon only, payout = 800-100 = 700 G
- Steel sword, ench 9, damage 1000 G: ench only, payout = 500-100 = 400 G

### E8 -- Dragon-material sword, ench exactly 8, damage 1000 G
- High-enchantment clause applies (ench >= 8): 50% * 1000 = 500, minus 100 deductible = 400 G

### E9 -- Multiple items same type
- Two swords: insurance sum 2000 G, cap 4000 G
- Two sword damages in same event: each gets its own deductible
- More damage entries than insured items of that type: error, non-zero exit

### E10 -- Cap exhaustion
- Sword + amulet: insurance sum = 1600 G, cap = 3200 G
- Cursed sword (1000 G value, premium 165 G): cap = 2000 G (based on unmodified value)
- Sword + 3 runes: insurance sum = 1000 + 750 = 1750 G; block only affects premium
- Cap exhaustion across two claims: sword insured (sum 1000 G, cap 2000 G)
  - Claim 1: damage 1500 G, payout = 1400 G (1500-100), remaining cap = 600 G
  - Claim 2: damage 1500 G, desired payout = 1400 G, actual = 600 G (capped), remaining = 0 G

### E11 -- Rounding
- Premium 197.5 G -> 198 G (ceil)
- Payout 350.5 G -> 350 G (floor)

### E12 -- Integration: newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, ench 3)
- Base: 100 G + curse 50 G + first-insurance 10 G = 160 G + 5 G fee = 165 G

### E13 -- Integration: long-standing customer's second contract
- Customer: 3 years, this is the 2nd quote
- Item: cursed sword (steel, ench 7)
- Base: 100 G + curse 50 G + high-ench 30 G - loyalty 20 G + first-insurance 10 G - follow-up 15 G = 155 G + 5 G fee = 160 G
- First-insurance surcharge applies to every item regardless of customer history

### E14 -- Empty item list
- Premium = 5 G (processing fee only)

### E15 -- CLI schema
- Input: `{ customer: {yearsWithMHPCO}, steps: [{op, items/policy/incident}] }`
- Output: `{ results: [{premium} | {payout, remainingCap}] }`

---

## Questions / Clarifications

### Q1 -- "Alike" components
Resolved: "alike" means exactly the same component type (e.g., 3 runes, not 2 runes + 1 moonstone). Different component types do not form a block together.

### Q2 -- Modifier scope on multi-item policies
Resolved: Item-specific modifiers (cursed, high enchantment) apply to the individual item's base premium. Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium total. Processing fee is last.

### Q3 -- First insurance meaning
Resolved: "First insurance" means every item in every quote is treated as a first insurance. The 10% surcharge always applies to each item. It is NOT about customer history. It applies universally.

### Q4 -- Multiple items of the same type
Resolved: Allowed. Each item is tracked separately in the policy. Damage entries are matched by type count -- if more damages of a type than covered items, the claim is rejected.

---

## Per-test rationale

Each line maps an `it.todo()` to the rule/example it covers.

### Quote tests (simple to complex)

1. "empty item list => premium 5 G (processing fee only)" -- R1, R2.3, E14
2. "single sword => premium 115 G (100 base + 10 first-insurance + 5 fee)" -- R1, R2, basic premium calc
3. "single amulet => premium 71 G (60 base + 6 first-insurance + 5 fee)" -- R1, confirms amulet value
4. "single staff => premium 93 G (80 base + 8 first-insurance + 5 fee)" -- R1, confirms staff value
5. "single potion => premium 49 G (40 base + 4 first-insurance + 5 fee)" -- R1, confirms potion value
6. "single rune => premium 33 G (25 base + 2.5 first-insurance -> ceil(27.5) + 5 = 33)" -- R1, R3 rounding
7. "2 runes => base 50 G (no block)" -- R1, E1
8. "3 runes => base 60 G (block of 3 alike)" -- R1, E1
9. "4 runes => base 100 G (no block; requires exactly 3)" -- R1, E1
10. "7 runes => base 175 G (no block)" -- R1, E1
11. "2 runes + 1 moonstone => base 75 G (no block; different types)" -- R1, E2, Q1
12. "3 runes + 3 moonstones => base 120 G (two separate blocks)" -- R1, E2, Q1
13. "cursed sword => premium 165 G (100 + 50 curse + 10 first-ins + 5 fee)" -- R2, E12 integration
14. "sword with enchantment 5 => premium 145 G" -- R2, E4
15. "sword with enchantment 4 => premium 115 G (no high-ench surcharge)" -- R2, E4
16. "cursed sword with enchantment 5 => premium 195 G (both surcharges)" -- R2, E4
17. "cursed sword + plain amulet => 231 G (curse applies only to sword)" -- R2, E3, Q2
18. "long-standing customer (2 years) sword => premium 95 G" -- R2, E4
19. "customer with 1 year sword => premium 115 G (no loyalty)" -- R2 (boundary)
20. "second quote (0 years) sword => premium 100 G (follow-up discount)" -- R2, E13
21. "newcomer cursed sword integration => 165 G" -- E12 full integration
22. "long-standing second contract cursed ench-7 sword => 160 G" -- E13 full integration
23. "premium rounding: 197.5 G rounds to 198 G (ceil)" -- R3, E11

### Claim tests (simple to complex)

24. "standard reimbursement: steel sword ench 3, damage 500 G => payout 400 G" -- R4, R5, E6
25. "rune damage 200 G => payout 100 G (no special clause, deductible applies)" -- R5, E6
26. "dragon-material sword ench 9 damage 1000 G => payout 400 G (50% wins)" -- R5, E7
27. "dragon-material sword ench 5 damage 800 G => payout 700 G (dragon clause only)" -- R5, E7
28. "steel sword ench 9 damage 1000 G => payout 400 G (enchantment clause only)" -- R5, E7
29. "dragon-material sword ench exactly 8 damage 1000 G => payout 400 G" -- R5, E8
30. "deductible per damage event: sword 500 G + amulet 300 G => 600 G total" -- R4, E5
31. "multiple items same type: two swords => insurance sum 2000 G, cap 4000 G" -- R6, E9
32. "two sword damages both get own deductible" -- R6, E9
33. "cap = 2x insurance sum (sword + amulet => cap 3200 G)" -- R4, E10
34. "cursed sword cap based on unmodified insurance value (cap 2000 G)" -- R4, E10
35. "sword + 3 runes block: insurance sum 1750 G (block affects premium not sum)" -- R4, E10
36. "cap exhaustion: first claim 1500 G => payout 1400 G, remaining 600 G" -- R4, E10
37. "cap exhaustion: second claim 1500 G => payout 600 G (capped), remaining 0 G" -- R4, E10
38. "payout rounding: 350.5 G rounds to 350 G (floor)" -- R3, E11

### Error / edge case tests

39. "unknown item type in quote => CLI exits non-zero, error to stderr" -- R7, E14
40. "claim damage for item not in policy => CLI exits non-zero" -- R7
41. "claim damage for unknown item type => CLI exits non-zero" -- R7
42. "negative damage amount => CLI exits non-zero" -- R7
43. "more damage entries of a type than insured => CLI exits non-zero" -- R6, E9

### CLI integration tests

44. "CLI reads JSON from stdin and writes JSON results to stdout" -- R8, E15
45. "CLI schema: quote step produces {premium: integer}" -- R8
46. "CLI schema: claim step produces {payout: integer, remainingCap: integer}" -- R8
47. "CLI multi-step scenario: quote then claim against that policy" -- R8, E15
48. "CLI error: non-zero exit code, error to stderr, no results to stdout" -- R7, R8
