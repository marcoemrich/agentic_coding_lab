# MHPCO Claim Office -- Example Mapping

## Rules

### R1: Item values and base premiums
Each main item has an insurance value and a base premium:
- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G

### R2: Component pricing
Components (runes, moonstones, etc.) are insured at 250 G each, base premium 25 G each.

### R3: Component block discount
A building block of exactly 3 alike components gets a special base premium of 60 G (instead of 75 G).
- "Alike" means exactly the same type (e.g. 3 runes, not 2 runes + 1 moonstone).
- The block requires **exactly** 3; 4 of the same type = 4 x 25 G = 100 G, no block.

### R4: Cursed surcharge
Cursed items add a 50% risk surcharge on the **item's** base premium (item-specific modifier).

### R5: High enchantment surcharge
Items with enchantment level >= 5 add a 30% risk surcharge on the **item's** base premium (item-specific modifier).

### R6: Loyalty discount
Customers with >= 2 years with MHPCO receive a 20% loyalty discount on the **policy** base premium (policy-wide modifier).

### R7: First insurance surcharge
A first insurance carries a 10% initial assessment surcharge on the **policy** base premium (policy-wide modifier).
- Every item in a `quote` is treated as a first insurance, regardless of customer history.

### R8: Follow-up contract discount
Customers receive a 15% discount on each contract after their first (policy-wide modifier).

### R9: Processing fee
A 5 G processing fee is added to every premium, at the very end.

### R10: Rounding
All amounts rounded to whole G in MHPCO's favor:
- Premiums: rounded **up** (ceil)
- Payouts: rounded **down** (floor)
- Intermediate amounts kept as fractions; only final result is rounded.

### R11: Deductible
A deductible of 100 G applies per damage event (per damaged item).

### R12: Payout cap
Total payout per policy is capped at 2x the insurance sum. Insurance sum = sum of items' insurance values (unmodified by premium modifiers). Block discount affects premium only, not insurance sum.

### R13: High-enchantment claim clause
Damage to items with enchantment level >= 8 is reimbursed at 50% of the damage amount (before deductible).

### R14: Dragon-material claim clause
Damage to items made of dragon material is fully reimbursed (before deductible).

### R15: When both R13 and R14 apply
If an item is both dragon-material AND enchantment >= 8, the 50% rule wins (less favorable to customer = MHPCO's favor). Then deductible is applied.

### R16: Modifier application order (quote)
1. Compute each item's base premium
2. Apply item-specific modifiers (cursed, high enchantment) to each item's base premium
3. Sum all items' adjusted premiums to get policy base premium
4. Apply policy-wide modifiers (loyalty, first insurance, follow-up) to the policy base premium
5. Add 5 G processing fee last

### R17: Multiple items of the same type
- A policy can cover multiple items of the same type.
- Insurance sum adds all items' values.
- Each damage entry in `damages` is treated as a separate damage with its own deductible.
- If damages array has more entries of a given type than the policy covers, reject the claim (non-zero exit).

### R18: Components in claims
Components (runes, moonstones) have no enchantment level or material, so no special clause applies. Standard reimbursement minus deductible.

### R19: CLI interface
- Reads JSON from stdin, writes JSON to stdout.
- Input: `{ customer: { yearsWithMHPCO }, steps: [...] }`
- Each step: `{ op: "quote", items: [...] }` or `{ op: "claim", policy: <stepIndex>, incident: { cause, damages: [...] } }`
- Output: `{ results: [...] }` matching steps in order.
- Quote result: `{ premium: <integer> }`
- Claim result: `{ payout: <integer>, remainingCap: <integer> }`

### R20: Error handling
- Unknown item type in quote: non-zero exit, error to stderr, no results to stdout.
- Damage to item not in policy (wrong type or unknown type): non-zero exit, error to stderr.
- Negative damage amount: non-zero exit, error to stderr.
- More damage entries of a type than policy covers: non-zero exit, error to stderr.

---

## Examples

### E1: Component base premiums (R2, R3)
- 2 runes -> 50 G base premium (2 x 25)
- 3 runes -> 60 G base premium (block of 3 alike)
- 4 runes -> 100 G base premium (4 x 25, no block)
- 7 runes -> 175 G base premium (7 x 25, no block)

### E2: "Alike" components (R3, Q1)
- 2 runes + 1 moonstone -> 75 G base premium (no block: different types)
- 3 runes + 3 moonstones -> 120 G base premium (two separate blocks: 60 + 60)

### E3: Multi-item cursed surcharge scope (R4, R16, Q2)
- Cursed sword (100 G base) + plain amulet (60 G base) -> policy base 160 G
- Cursed surcharge: 50% of cursed sword's base = 50 G
- Total before fee: 210 G

### E4: Modifier thresholds (R4, R5, R6)
- Customer with exactly 2 years -> loyalty discount applies
- Sword with enchantment 5 -> high-enchantment surcharge applies
- Sword with enchantment 5, cursed -> both surcharges apply
- Sword with enchantment 4 -> no high-enchantment surcharge
- Sword with enchantment 4, cursed -> only curse surcharge

### E5: Claim -- dragon-material, enchantment 8, damage 1000 G (R13, R15)
- 50% of 1000 = 500, minus 100 deductible = 400 G payout

### E6: Deductible per damage event (R11)
- Dragon attack damages sword (500 G) and amulet (300 G)
- Payout = (500 - 100) + (300 - 100) = 600 G

### E7: Standard reimbursement (R11, R18)
- Regular steel sword, enchantment 3, damage 500 G -> payout 400 G (500 - 100)
- Rune, damage 200 G -> payout 100 G (200 - 100)

### E8: Enchantment threshold vs. dragon material in claims (R13, R14, R15)
- Dragon-material sword, enchantment 9, damage 1000 G -> 400 G (50% = 500, minus 100)
- Dragon-material sword, enchantment 5, damage 800 G -> 700 G (full reimburse 800, minus 100)
- Steel sword, enchantment 9, damage 1000 G -> 400 G (50% = 500, minus 100)

### E9: Multiple items same type (R17)
- Policy covers 2 swords -> insurance sum 2000 G, cap 4000 G
- Both swords damaged -> two separate damage entries, each with own deductible
- More damage entries than insured items -> reject (non-zero exit)

### E10: Cap exhaustion (R12)
- Sword + amulet -> insurance sum 1600 G, cap 3200 G
- Cursed sword (insurance value 1000 G, premium 165 G) -> cap 2000 G (cap based on unmodified insurance value)
- Sword + 3 runes (block) -> insurance sum 1750 G (1000 + 3x250); block doesn't affect insurance sum
- Sword insured (sum 1000 G, cap 2000 G); two claims of 1500 G each:
  - First claim: payout 1400 G, remaining cap 600 G
  - Second claim: payout 600 G (capped), remaining cap 0 G

### E11: Rounding (R10)
- Premium 197.5 G -> 198 G (rounded up)
- Payout 350.5 G -> 350 G (rounded down)

### E12: Edge cases (R20)
- Empty item list -> premium 5 G (only processing fee)
- Unknown item type in quote -> non-zero exit, error to stderr
- Damage to item not in policy -> non-zero exit, error to stderr
- Negative damage amount -> non-zero exit, error to stderr

### E13: Integration -- newcomer with cursed sword (R4, R7, R9, R16)
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, enchantment 3)
- Premium: 100 base + 50 curse + 10 first insurance = 160 + 5 fee = 165 G

### E14: Integration -- long-standing customer's second contract (R4, R5, R6, R7, R8, R9, R16, Q3)
- Customer: 3 years, second quote in scenario
- Item: cursed sword (steel, enchantment 7)
- Premium: 100 base + 50 curse + 30 high-enchant - 20 loyalty + 10 first insurance - 15 follow-up = 155 + 5 fee = 160 G
- First insurance surcharge applies even for existing customers (every item in a quote is a first insurance)

---

## Questions / Clarifications

### Q1: "Alike" components
"Alike" means exactly the same type. 2 runes + 1 moonstone = no block. 3 runes + 3 moonstones = two blocks (60 + 60).

### Q2: Modifier scope on multi-item policies
Item-specific modifiers (cursed, high enchantment) apply to the individual item's base premium. Policy-wide modifiers (loyalty, first insurance, follow-up) apply to the policy base premium (sum of all item base premiums after item-specific adjustments).

### Q3: "First insurance" meaning
Every item in a `quote` is treated as a first insurance, regardless of customer history. The 10% surcharge always applies. The follow-up contract discount is separate and applies to contracts after the customer's first.

---

## Per-test Rationale

Each `it.todo()` in `src/claim-office.spec.ts` maps to spec rules/examples.

**Important arithmetic note for policy-wide modifiers:** Policy-wide modifiers
(loyalty, first-insurance, follow-up) are percentages of the "policy base
premium", which the spec defines as "the sum of all item base premiums"
(the **original** base premiums, not the item-adjusted ones). Item-specific
modifiers (cursed, high enchantment) are added to each item's base premium
separately. The final premium = sum-of-item-adjusted-premiums + policy-wide-
modifier-amounts + 5 G fee.

### Quote -- base premiums (tests 1-5)
1. empty item list -> 5 G -- R9, E12: 0 + 5 fee
2. single sword -> 115 G -- R1, R7, R9: 100 item-adj + 10 first-ins (10% of 100) + 5 fee
3. single amulet -> 71 G -- R1, R7, R9: 60 + 6 + 5
4. single staff -> 93 G -- R1, R7, R9: 80 + 8 + 5
5. single potion -> 49 G -- R1, R7, R9: 40 + 4 + 5

### Quote -- component pricing (tests 6-9)
6. 2 runes -> 60 G -- R2, R7, R9: 50 base + 5 first-ins + 5 fee
7. 3 runes (block) -> 71 G -- R3, R7, R9: 60 base + 6 first-ins + 5 fee
8. 4 runes (no block) -> 115 G -- R2, R7, R9: 100 base + 10 first-ins + 5 fee
9. 7 runes -> 198 G -- R2, R10, E11: 175 base + 17.5 first-ins + 5 = 197.5 -> ceil = 198

### Quote -- alike components (tests 10-11)
10. 2 runes + 1 moonstone (no block) -> 88 G -- R3, Q1: 75 base + 7.5 first-ins + 5 = 87.5 -> ceil = 88
11. 3 runes + 3 moonstones (two blocks) -> 137 G -- R3, Q1: 120 base + 12 first-ins + 5 = 137

### Quote -- cursed surcharge (tests 12-13)
12. cursed sword newcomer -> 165 G -- R4, E13: 100 + 50 curse = 150 item-adj; policy base 100; +10 first-ins; 150 + 10 + 5 = 165
13. cursed sword + plain amulet newcomer -> 231 G -- R4, R16, Q2, E3: item-adj (150+60)=210; policy base (100+60)=160; +16 first-ins; 210 + 16 + 5 = 231

### Quote -- high enchantment surcharge (tests 14-15)
14. sword enchantment 5 -> 145 G -- R5: 100 + 30 high-ench = 130 item-adj; +10 first-ins; 130 + 10 + 5 = 145
15. sword enchantment 4 -> 115 G -- R5, E4: no surcharge; 100 + 10 + 5 = 115

### Quote -- combined item-specific modifiers (tests 16-17)
16. cursed sword enchantment 5 -> 195 G -- R4, R5, E4: 100+50+30=180 item-adj; +10 first-ins; 180+10+5=195
17. cursed sword enchantment 4 -> 165 G -- R4, R5, E4: 100+50=150 item-adj; +10 first-ins; 150+10+5=165

### Quote -- loyalty discount (tests 18-19)
18. customer 2 years, sword -> 95 G -- R6, E4: 100 item-adj; -20 loyalty + 10 first-ins; 100 - 20 + 10 + 5 = 95
19. customer 1 year, sword -> 115 G -- R6: no loyalty; 100 + 10 + 5 = 115

### Quote -- follow-up contract discount (test 20)
20. second quote for sword, 0 years -> 100 G -- R8: 100 item-adj; +10 first-ins - 15 follow-up; 100 + 10 - 15 + 5 = 100

### Quote -- first insurance always applies (test 21)
21. customer 3 years, single sword -> 95 G -- R7, Q3: first-ins always applies regardless of customer history; 100 - 20 + 10 + 5 = 95

### Quote -- premium rounding (test 22)
22. 7 runes -> 198 G -- R10, E11: verifies rounding up specifically; 197.5 -> 198

### Quote -- integration: newcomer cursed sword (test 23)
23. 0 years, first contract, cursed sword ench 3 -> 165 G -- E13: 100 + 50 + 10 + 5 = 165

### Quote -- integration: long-standing customer second contract (test 24)
24. 3 years, second quote, cursed sword ench 7 -> 160 G -- E14: item-adj 100+50+30=180; policy base 100; -20 loyalty +10 first-ins -15 follow-up = -25; 180 - 25 + 5 = 160

### Claim -- standard reimbursement (tests 25-26)
25. steel sword ench 3, damage 500 -> payout 400 -- E7: 500 - 100 = 400
26. rune, damage 200 -> payout 100 -- E7, R18: 200 - 100 = 100

### Claim -- high enchantment clause (tests 27-28)
27. steel sword ench 9, damage 1000 -> payout 400 -- E8, R13: 50% of 1000=500; 500-100=400
28. steel sword ench 7, damage 500 -> payout 400 -- R13: ench 7 < 8 so no special clause; 500-100=400

### Claim -- dragon material clause (test 29)
29. dragon sword ench 5, damage 800 -> payout 700 -- E8, R14: full 800; 800-100=700

### Claim -- both clauses (tests 30-31)
30. dragon sword ench 9, damage 1000 -> payout 400 -- E8, R15: 50% wins; 500-100=400
31. dragon sword ench 8, damage 1000 -> payout 400 -- E5, R15: 50% wins; 500-100=400

### Claim -- deductible per event (test 32)
32. sword 500 + amulet 300 -> payout 600 -- E6, R11: (500-100)+(300-100)=600

### Claim -- multiple items same type (tests 33-35)
33. 2 swords -> insurance sum 2000, cap 4000 -- E9, R17
34. 2 sword damages with 2 swords insured -> separate deductibles -- E9, R17
35. more damages than insured -> reject with error -- E9, R17, R20

### Claim -- payout cap (tests 36-40)
36. sword + amulet -> cap 3200 -- E10, R12: 2 x 1600
37. cursed sword -> cap 2000 -- E10: 2 x 1000 (unmodified insurance value)
38. sword + 3 runes block -> insurance sum 1750 -- E10: 1000 + 3x250
39. sword, first claim 1500 damage -> payout 1400, remaining 600 -- E10: 1500-100=1400; 2000-1400=600
40. sword, second claim 1500 damage -> payout 600 (capped), remaining 0 -- E10

### Claim -- payout rounding (test 41)
41. payout 350.5 -> 350 -- R10, E11: rounded down

### Error handling (tests 42-45)
42. unknown item type in quote -> error -- E12, R20
43. damage to item not in policy -> error -- E12, R20
44. negative damage amount -> error -- E12, R20
45. unknown item type in damage -> error -- R20

### CLI interface (tests 46-49)
46. reads JSON from stdin, writes JSON to stdout -- R19
47. schema example produces correct output -- R19
48. error exits non-zero, writes to stderr -- R19, R20
49. steps processed sequentially, claim references earlier quote -- R19
