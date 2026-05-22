# MHPCO Claim Office -- Example Mapping

## Rules

### R1 -- Item values and base premiums
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G insurance value, 60 G base premium
- Staff: 800 G insurance value, 80 G base premium
- Potion: 400 G insurance value, 40 G base premium
- Component (rune, moonstone, etc.): 250 G insurance value, 25 G base premium each
- Building block of exactly 3 alike components: 60 G base premium (instead of 75 G)

### R2 -- "Alike" components (for building block discount)
- "Alike" means exactly the same type (e.g. 3 runes, not 2 runes + 1 moonstone)
- Each group of exactly 3 alike components forms one block at 60 G
- Counts that are not exactly 3 do NOT get the block discount (4 runes = 4 x 25 = 100 G)

### R3 -- Premium modifiers (item-specific)
- Cursed: +50% of that item's base premium
- High enchantment (enchantment >= 5): +30% of that item's base premium
- Both can apply to the same item (they stack additively on the item's base)

### R4 -- Premium modifiers (policy-wide, applied to sum of all item base premiums)
- Loyalty discount (customer years >= 2): -20% of policy base premium
- First insurance surcharge: +10% of policy base premium (always applies -- every item in a quote is treated as first insurance regardless of customer history)
- Follow-up contract discount (each contract after the customer's first quote in the scenario): -15% of policy base premium

### R5 -- Processing fee
- 5 G added at the very end, after all modifiers

### R6 -- Modifier application order
- Item-specific modifiers (cursed, high enchantment) apply to each item's base premium individually
- Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium (sum of all item base premiums before item-specific modifiers -- NO, see integration example)
- Actually from the integration examples: policy-wide modifiers apply to the policy base premium which is the sum of item base premiums (the raw base premiums, not including item-specific surcharges). Wait, let me re-read.
- Integration example 1: 100 base + 50 curse + 10 first-insurance = 160 + 5 fee = 165.
  The first-insurance is 10% of 100 (the base), not 10% of 150 (base+curse). So policy-wide modifiers apply to the policy base premium (sum of raw item base premiums).
- Integration example 2: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up = 155 + 5 fee = 160.
  - curse = 50% of 100 = 50. high-ench = 30% of 100 = 30. loyalty = 20% of 100 = 20. first-ins = 10% of 100 = 10. follow-up = 15% of 100 = 15.
  - All modifiers (item-specific and policy-wide) are percentages of the item's/policy's base premium, then summed.

### R7 -- Rounding
- All amounts rounded to whole G in MHPCO's favor
- Premium: rounded UP (ceil) -- 197.5 -> 198
- Payout: rounded DOWN (floor) -- 350.5 -> 350
- Intermediate amounts kept as fractions; only final result is rounded

### R8 -- Claim: deductible
- 100 G deductible per damaged item (per entry in the damages array)

### R9 -- Claim: high enchantment reimbursement
- Items with enchantment >= 8: reimbursed at 50% of damage amount (before deductible)
- Then deductible is subtracted

### R10 -- Claim: dragon material reimbursement
- Items made of dragon material: fully reimbursed (before deductible)
- Then deductible is subtracted

### R11 -- Claim: enchantment >= 8 AND dragon material
- Both clauses apply; the 50% rule wins (more restrictive)
- Then deductible is subtracted
- Example: dragon-material sword, enchantment 9, damage 1000 -> 50% of 1000 = 500, minus 100 deductible = 400

### R12 -- Claim: cap
- Total payout per policy capped at 2x the insurance sum
- Insurance sum = sum of insurance values of all insured items (unmodified by premium modifiers)
- Component block discount affects premium only, not insurance sum
- Cap is tracked across multiple claims on the same policy

### R13 -- Claim: multiple items of same type
- Policy can cover multiple items of the same type
- Each damage entry is treated as a separate damage with its own deductible
- If damages array has more entries of a given type than the policy covers, the whole claim is rejected (non-zero exit code)

### R14 -- CLI interface
- Executable named `claim-office`
- Reads JSON from stdin, writes JSON to stdout
- Entry point: src/cli.ts
- Input: { customer: { yearsWithMHPCO: number }, steps: Step[] }
- Step (quote): { op: "quote", items: Item[] }
- Step (claim): { op: "claim", policy: number (zero-based step index of the quote), incident: { cause: string, damages: Damage[] } }
- Item: { type: string, material: string, enchantment: number, cursed: boolean }
- Damage: { itemType: string, amount: number }
- Output: { results: Result[] }
- Quote result: { premium: number }
- Claim result: { payout: number, remainingCap: number }

### R15 -- Error handling
- Unknown item type in quote -> non-zero exit, error to stderr, no results to stdout
- Damage to item not in policy -> non-zero exit, error to stderr
- Unknown item type in damage -> non-zero exit, error to stderr
- Negative damage amount -> non-zero exit, error to stderr

### R16 -- Empty item list
- Empty items in quote -> premium 5 G (processing fee only)

### R17 -- Follow-up contract
- "First quote" means the customer's first quote step in the scenario
- Subsequent quote steps in the same scenario get the -15% follow-up discount
- The first-insurance surcharge (+10%) always applies regardless

## Examples

### Component base premiums
- 2 runes -> 50 G (2 x 25)
- 3 runes -> 60 G (block of 3 alike)
- 4 runes -> 100 G (4 x 25, no block)
- 7 runes -> 175 G (7 x 25, no block)
- 2 runes + 1 moonstone -> 75 G (3 x 25, no block because different types)
- 3 runes + 3 moonstones -> 120 G (two blocks of 3: 60 + 60)

### Modifier scope
- Cursed sword (100 G) + plain amulet (60 G) -> 160 G policy base; curse adds 50 G (50% of 100) -> 210 G before policy-wide modifiers and fee

### Modifier thresholds
- Customer with exactly 2 years -> loyalty discount applies
- Sword with enchantment exactly 5 -> high-enchantment surcharge applies
- Sword with enchantment 5, cursed -> both surcharges apply
- Sword with enchantment 4 -> no high-enchantment surcharge
- Dragon-material sword, enchantment 8, damage 1000 -> payout 400 (50% of 1000 = 500, minus 100 deductible)

### Deductible per damage event
- Dragon attack damages sword (500 G) and amulet (300 G) -> payout 600 G (500-100 + 300-100 = 400+200)

### Standard reimbursement
- Regular sword (steel, enchantment 3), damage 500 -> payout 400 (500 - 100)
- Rune, damage 200 -> payout 100 (200 - 100)

### Enchantment vs dragon material
- Dragon-material sword, ench 9, damage 1000 -> payout 400 (50% -> 500, minus 100)
- Dragon-material sword, ench 5, damage 800 -> payout 700 (full reimburse 800, minus 100)
- Steel sword, ench 9, damage 1000 -> payout 400 (50% -> 500, minus 100)

### Multiple items same type
- Two swords -> insurance sum 2000 G, cap 4000 G
- Damage to both -> each gets its own deductible
- More damage entries than insured items of that type -> reject

### Cap exhaustion
- Sword + amulet -> insurance sum 1600 G, cap 3200 G
- Cursed sword (ins value 1000 G) -> cap 2000 G (cap based on unmodified insurance value)
- Sword + 3 runes -> insurance sum 1750 G (1000 + 3x250); block discount affects premium only
- Sword insured (ins sum 1000, cap 2000); two claims of 1500 each:
  - First: payout 1400, remaining 600
  - Second: payout 600, remaining 0

### Rounding
- Premium 197.5 -> 198 (ceil)
- Payout 350.5 -> 350 (floor)

### Edge cases
- Empty item list -> premium 5 G
- Unknown item type in quote -> non-zero exit, stderr error
- Damage to item not in policy -> non-zero exit, stderr error
- Negative damage amount -> non-zero exit, stderr error

### Integration example 1: Newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, enchantment 3)
- Premium: 100 base + 50 curse + 10 first-insurance = 160 + 5 fee = 165 G

### Integration example 2: Long-standing customer's second contract
- Customer: 3 years; this is the customer's second quote
- Item: cursed sword (steel, enchantment 7)
- Premium: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-insurance - 15 follow-up = 155 + 5 fee = 160 G

## Questions / Clarifications

### Q1 (Alike components)
"Alike" means exactly the same component type. 2 runes + 1 moonstone = 3 individual components, no block discount. 3 runes + 3 moonstones = two blocks (60 + 60 = 120).

### Q2 (Modifier scope on multi-item policies)
Item-specific modifiers (cursed, high enchantment) apply to the individual item's base premium. Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium (sum of all items' base premiums). Fee added last.

### Q3 (Multiple items of same type)
Allowed. Each gets its own insurance value, its own deductible on damage. If damages array has more entries of a type than insured, the whole claim is rejected.

### Q4 (First insurance vs follow-up)
"First insurance" surcharge (+10%) always applies to every quote -- it means each item is being insured for the first time. "Follow-up contract" discount (-15%) applies to the customer's second and subsequent quotes in the scenario. Both can apply simultaneously. A long-standing customer with a new item still gets the first-insurance surcharge AND the follow-up discount (if not their first quote).

## Per-test rationale

Each line maps a test (by its `it.todo()` description) to the rule(s) or example(s) it covers.

### Quote: base cases
1. **"should return premium 5 G for an empty item list (processing fee only)"** -- R16, R5: empty list, only fee
2. **"should return premium 115 G for a single plain sword"** -- R1, R4, R5: 100 base + 10 first-ins + 5 fee
3. **"should return premium 71 G for a single plain amulet"** -- R1: 60 base + 6 first-ins + 5 fee
4. **"should return premium 93 G for a single plain staff"** -- R1: 80 base + 8 first-ins + 5 fee
5. **"should return premium 49 G for a single plain potion"** -- R1: 40 base + 4 first-ins + 5 fee

### Quote: components and building blocks
6. **"should compute base premium 50 G for 2 runes"** -- R1: 2 x 25
7. **"should compute base premium 60 G for 3 runes"** -- R1, R2: block of 3 alike
8. **"should compute base premium 100 G for 4 runes"** -- R2: no block (not exactly 3)
9. **"should compute base premium 175 G for 7 runes"** -- R2: no block
10. **"should compute base premium 75 G for 2 runes + 1 moonstone"** -- Q1: different types, no block
11. **"should compute base premium 120 G for 3 runes + 3 moonstones"** -- Q1: two separate blocks

### Quote: item-specific modifiers
12. **"should add 50% curse surcharge -- cursed sword newcomer: ... 165 G"** -- R3, integration example 1
13. **"should add 30% high-enchantment surcharge for sword with enchantment exactly 5"** -- R3: threshold
14. **"should NOT add high-enchantment surcharge for sword with enchantment 4"** -- R3: below threshold
15. **"should apply both curse and high-enchantment surcharges"** -- R3: stacking
16. **"should apply item-specific modifiers only to the affected item"** -- Q2: modifier scope

### Quote: policy-wide modifiers
17. **"should apply 20% loyalty discount for customer with exactly 2 years"** -- R4: loyalty threshold
18. **"should NOT apply loyalty discount for customer with 1 year"** -- R4: below threshold
19. **"should apply 10% first-insurance surcharge on every quote"** -- R4: always applies
20. **"should apply 15% follow-up contract discount on second quote"** -- R4, R17: follow-up
21. **"should apply first-insurance surcharge even on follow-up contracts"** -- Q4: both coexist

### Quote: integration examples
22. **"should return 165 G for newcomer ... with cursed sword"** -- full integration example 1
23. **"should return 160 G for long-standing customer ... second contract"** -- full integration example 2

### Quote: rounding
24. **"should round premium UP in MHPCO's favor -- 197.5 G rounds to 198 G"** -- R7

### Claim: standard reimbursement
25. **"should return payout 400 G for regular sword ... damage 500 G"** -- R8: standard, deductible only
26. **"should return payout 100 G for rune, damage 200 G"** -- R8: component claim

### Claim: deductible
27. **"should apply 100 G deductible per damaged item -- sword 500 + amulet 300 = 600"** -- R8: per-item deductible

### Claim: high enchantment
28. **"should reimburse at 50% for steel sword with enchantment 9"** -- R9: 50% then deductible
29. **"should reimburse at 50% for dragon-material sword with enchantment 8"** -- R9, R11: threshold at 8

### Claim: dragon material
30. **"should fully reimburse dragon-material sword with enchantment 5"** -- R10: full then deductible

### Claim: enchantment vs dragon material interaction
31. **"should apply 50% rule when dragon-material sword has enchantment 9"** -- R11: 50% wins

### Claim: rounding
32. **"should round payout DOWN in MHPCO's favor -- 350.5 G rounds to 350 G"** -- R7

### Claim: cap
33. **"should set cap at 2x insurance sum -- sword + amulet, cap 3200 G"** -- R12
34. **"should base cap on unmodified insurance value -- cursed sword, cap 2000 G"** -- R12
35. **"should not let block discount affect insurance sum -- sword + 3 runes = 1750 G"** -- R12
36. **"should exhaust cap across multiple claims"** -- R12: multi-claim tracking

### Claim: multiple items of same type
37. **"should allow two swords in a policy -- insurance sum 2000, cap 4000"** -- R13, Q3
38. **"should apply separate deductible per damage entry when both swords damaged"** -- R13
39. **"should reject claim if damages exceed insured item count"** -- R13, R15

### Error handling
40. **"should reject quote with unknown item type"** -- R15: e.g. broomstick
41. **"should reject claim referencing damage item not in policy"** -- R15
42. **"should reject claim with negative damage amount"** -- R15

### CLI integration
43. **"should read JSON scenario from stdin and write JSON results to stdout"** -- R14: basic I/O
44. **"should process a full scenario with quote and claim steps"** -- R14: multi-step
45. **"should exit with non-zero status code ... for unknown item type"** -- R14, R15
46. **"should exit with non-zero status code ... for damage to item not in policy"** -- R14, R15
47. **"should exit with non-zero status code ... for negative damage amount"** -- R14, R15
48. **"should exit with non-zero status code when damages exceed insured item count"** -- R14, R15
