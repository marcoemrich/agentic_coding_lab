# MHPCO Claim Office -- Example Mapping

## Rules

### R1 -- Item values and base premiums
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G
- Component (rune, moonstone, etc.): 250 G insurance value, 25 G base premium each
- Building block of exactly 3 alike components: 60 G base premium (instead of 75 G)

### R2 -- Premium modifiers (applied in a specific order)
- **Item-specific modifiers** (applied per item to that item's base premium):
  - Cursed: +50 % of that item's base premium
  - Highly enchanted (enchantment >= 5): +30 % of that item's base premium
  - First insurance: +10 % of that item's base premium (every item in a quote is treated as first insurance, regardless of customer history)
- **Policy-wide modifiers** (applied to the policy base premium = sum of all item base premiums):
  - Loyalty (customer >= 2 years with MHPCO): -20 % of policy base premium
  - Follow-up contract (each contract after the customer's first quote): -15 % of policy base premium
- **Processing fee**: +5 G flat, added at the very end

**Modifier stacking computation** (from integration examples):
- Total premium = sum(item base premiums) + sum(item-specific surcharges) + sum(policy-wide adjustments) + 5 G fee
- Item-specific surcharges are percentages of the individual item's base premium
- Policy-wide modifiers are percentages of the policy base premium (sum of all item base premiums before any surcharges)
- First insurance surcharge (+10%) is applied to each item's base premium (treated as item-specific)
- Rounding: only the final premium (after fee) is rounded to whole G in MHPCO's favor (rounded up / ceiling)

### R3 -- Claim processing
- Deductible: 100 G per damaged item (per damage entry, not per event)
- Cap: 2x the insurance sum (sum of all insured items' insurance values)
- Cap is based on unmodified insurance values (premium modifiers do not raise it)
- The block discount on components affects premium only, not insurance sum

### R4 -- Claim reimbursement special clauses
- Enchantment >= 8: reimburse at 50 % of damage amount (then deductible)
- Dragon material: fully reimburse (then deductible)
- Both clauses apply: 50 % wins (then deductible)
- Neither clause: full reimbursement (then deductible)
- Components (runes, moonstones) have no enchantment or material; standard reimbursement applies

### R5 -- Cap exhaustion
- Successive claims reduce the remaining cap
- When the computed payout exceeds remaining cap, payout is reduced to remaining cap

### R6 -- Rounding in MHPCO's favor
- Premium: round UP (ceiling) to whole G
- Payout: round DOWN (floor) to whole G
- Intermediate calculations kept as fractions; only final result rounded

### R7 -- Edge cases / errors
- Empty item list: premium = 5 G (only processing fee)
- Unknown item type in quote: non-zero exit code, error to stderr, no results to stdout
- Claim references item not in policy: non-zero exit code, error to stderr
- Claim references unknown item type: non-zero exit code, error to stderr
- Claim damage count exceeds insured count for a type: non-zero exit code, error to stderr
- Negative damage amount: non-zero exit code, error to stderr

### R8 -- CLI interface
- Executable: `claim-office`
- Entry point: `src/cli.ts`
- Reads JSON from stdin with `customer` object and `steps` array
- Writes JSON to stdout with `results` array (same length/order as steps)
- Quote result: `{ premium: <integer> }`
- Claim result: `{ payout: <integer>, remainingCap: <integer> }`
- Steps processed sequentially; claim steps reference earlier quote via zero-based step index in `policy` field

## Examples

### E1 -- Component base premiums
- 2 runes -> 50 G base premium (2 x 25)
- 3 runes -> 60 G base premium (block of 3 alike)
- 4 runes -> 100 G base premium (no block; 4 x 25)
- 7 runes -> 175 G base premium (7 x 25; no block)

### E2 -- "Alike" components
- 2 runes + 1 moonstone -> 75 G (no block: different types)
- 3 runes + 3 moonstones -> 120 G (two separate blocks: 60 + 60)

### E3 -- Modifier scope on multi-item policies
- Cursed sword (100 G base) + plain amulet (60 G base) -> policy base 160 G; cursed surcharge 50 G (50% of 100 G only) -> 210 G before further modifiers and fee

### E4 -- Modifier thresholds
- Customer exactly 2 years -> loyalty discount applies
- Sword enchantment exactly 5 -> high-enchantment surcharge applies
- Sword enchantment 5, cursed -> both surcharges apply
- Sword enchantment 4 -> no high-enchantment surcharge
- Dragon-material sword, enchantment exactly 8, damage 1000 G -> payout 400 G (50% = 500, minus 100 deductible)

### E5 -- Deductible per damage entry
- Dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (each gets 100 G deductible: 400 + 200)

### E6 -- Standard reimbursement
- Steel sword, enchantment 3, damage 500 G -> payout 400 G (500 - 100)
- Rune, damage 200 G -> payout 100 G (200 - 100)

### E7 -- Enchantment threshold vs dragon material
- Dragon-material sword, enchantment 9, damage 1000 G -> payout 400 G (50% = 500, minus 100)
- Dragon-material sword, enchantment 5, damage 800 G -> payout 700 G (full, minus 100: 800 - 100)
- Steel sword, enchantment 9, damage 1000 G -> payout 400 G (50% = 500, minus 100)

### E8 -- Multiple items of same type
- Two swords -> insurance sum 2000 G, cap 4000 G
- Two sword damages -> each treated separately with own deductible
- More damages than insured items -> non-zero exit, claim rejected

### E9 -- Cap exhaustion
- Sword + amulet -> insurance sum 1600 G, cap 3200 G
- Cursed sword (value 1000 G) -> cap 2000 G (based on unmodified value)
- Sword + 3 runes -> insurance sum 1750 G (1000 + 3x250); block discount only affects premium
- Sword insured (sum 1000 G, cap 2000 G); first claim 1500 G -> payout 1400 G, remaining 600 G; second claim 1500 G -> payout 600 G, remaining 0 G

### E10 -- Rounding
- Premium yielding 197.5 G -> 198 G (ceiling)
- Payout yielding 350.5 G -> 350 G (floor)

### E11 -- Integration: Newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, enchantment 3)
- Premium: 165 G = 100 base + 50 curse + 10 first insurance + 5 fee

### E12 -- Integration: Long-standing customer's second contract
- Customer: 3 years, second quote
- Item: cursed sword (steel, enchantment 7)
- Premium: 160 G = 100 base + 50 curse + 30 high-enchantment - 20 loyalty + 10 first insurance - 15 follow-up + 5 fee = 155 + 5

### E13 -- Edge cases
- Empty item list -> premium 5 G
- Unknown item type in quote -> error exit
- Claim references item not in policy -> error exit
- Negative damage amount -> error exit

## Questions / Clarifications

### Q1 -- "Alike" components (resolved)
"Alike" means exactly the same type (e.g., all runes). Different component types (runes vs moonstones) do not form a block together.

### Q2 -- Modifier scope (resolved)
Item-specific modifiers (cursed, high-enchantment, first insurance) apply to the individual item's base premium. Policy-wide modifiers (loyalty, follow-up) apply to the policy base premium (sum of all item base premiums).

### Q3 -- "First insurance" meaning (resolved)
"First insurance" applies to every item in every quote -- each item is always treated as a first insurance. It is NOT about whether the customer has had a previous contract. The "follow-up contract" discount is the one that relates to customer history (second and subsequent quotes).

## Per-test Rationale

Each line maps one `it.todo()` in `src/claim-office.spec.ts` to the rule(s) and example(s) it covers.

### Quote - base premiums
1. "should return 5 G premium for an empty item list (processing fee only)" -- E13/R1/R2: empty list, only 5 G fee
2. "should return 115 G for a single plain sword" -- R1/R2: 100 base + 10 first-ins (10% of 100) + 5 fee
3. "should return 71 G for a single plain amulet" -- R1/R2: 60 base + 6 first-ins + 5 fee
4. "should return 93 G for a single plain staff" -- R1/R2: 80 base + 8 first-ins + 5 fee
5. "should return 49 G for a single plain potion" -- R1/R2: 40 base + 4 first-ins + 5 fee
6. "should return 33 G for a single rune" -- R1/R2/R6: 25 base + 2.5 first-ins + 5 fee = 32.5 -> ceil = 33

### Quote - component building blocks
7. "2 runes -> 50 G base premium" -- E1: 2 x 25, no block
8. "3 runes -> 60 G base premium (block)" -- E1: block of exactly 3 alike
9. "4 runes -> 100 G base premium (no block)" -- E1: block requires exactly 3
10. "7 runes -> 175 G base premium" -- E1: 7 x 25, no block

### Quote - alike components
11. "2 runes + 1 moonstone -> 75 G base (no block)" -- E2/Q1: different types
12. "3 runes + 3 moonstones -> 120 G base (two blocks)" -- E2/Q1: same-type blocks

### Quote - item-specific modifiers
13. "cursed sword -> +50% of item base" -- R2: curse surcharge
14. "enchantment 5 sword -> +30% high-enchantment" -- R2/E4: threshold at 5
15. "enchantment 4 sword -> no high-enchantment surcharge" -- E4: below threshold
16. "cursed + enchantment >= 5 -> both surcharges" -- E4: stacking

### Quote - modifier scope
17. "cursed sword + plain amulet -> surcharge on sword only" -- E3/Q2: item-specific scope

### Quote - policy-wide modifiers
18. "customer 2 years -> loyalty discount applies" -- R2/E4: threshold at 2
19. "customer 1 year -> no loyalty discount" -- R2: below threshold
20. "second quote -> follow-up discount applies" -- R2: follow-up contract
21. "first insurance always applies per item" -- R2/Q3: regardless of history

### Quote - rounding
22. "premium rounding up (ceiling)" -- R6/E10: e.g. 197.5 -> 198

### Quote - integration
23. "newcomer cursed sword -> 165 G" -- E11: 100 + 50 + 10 + 5
24. "long-standing second contract cursed ench 7 sword -> 160 G" -- E12: 100 + 50 + 30 - 20 + 10 - 15 + 5

### Claim - standard reimbursement
25. "steel sword ench 3, 500 damage -> 400 payout" -- E6: full - 100 deductible
26. "rune, 200 damage -> 100 payout" -- E6: full - 100, no special clause

### Claim - enchantment and material clauses
27. "dragon-material sword ench 9, 1000 damage -> 400 payout" -- E7/R4: both -> 50% wins
28. "dragon-material sword ench 5, 800 damage -> 700 payout" -- E7/R4: dragon only -> full
29. "steel sword ench 9, 1000 damage -> 400 payout" -- E7/R4: high-ench only -> 50%
30. "dragon-material sword ench 8, 1000 damage -> 400 payout" -- E4/R4: threshold at 8

### Claim - deductible
31. "sword 500 + amulet 300 -> 600 payout" -- E5/R3: 100 G deductible per entry

### Claim - multiple items of same type
32. "two swords -> sum 2000, cap 4000" -- E8/R3
33. "two sword damages each with own deductible" -- E8
34. "more damages than insured -> error" -- E8/R7

### Claim - cap
35. "sword + amulet -> cap 3200" -- E9/R3: 2 x 1600
36. "cursed sword cap -> 2000 (unmodified value)" -- E9/R3
37. "sword + 3 runes -> sum 1750" -- E9/R3: block discount premium only

### Claim - cap exhaustion
38. "first claim 1500 -> payout 1400, remaining 600" -- E9/R5
39. "second claim 1500 -> payout 600, remaining 0" -- E9/R5

### Claim - rounding
40. "payout rounding down (floor)" -- R6/E10: e.g. 350.5 -> 350

### Edge cases and errors
41. "unknown item type in quote -> error" -- E13/R7
42. "claim references item not in policy -> error" -- E13/R7
43. "negative damage amount -> error" -- E13/R7
44. "claim references unknown item type -> error" -- R7

### CLI interface
45. "CLI reads JSON from stdin, writes JSON results to stdout" -- R8
46. "results array same length and order as steps" -- R8
47. "quote result has integer premium field" -- R8
48. "claim result has integer payout and remainingCap" -- R8
49. "CLI error: non-zero exit, stderr, no stdout results" -- R8/R7
