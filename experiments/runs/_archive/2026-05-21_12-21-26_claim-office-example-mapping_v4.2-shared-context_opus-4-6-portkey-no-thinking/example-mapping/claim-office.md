# MHPCO Claim Office -- Example Mapping

## Operations

The system supports two operations exposed via a CLI (`src/cli.ts`):

1. **quote** -- compute the premium for a list of items.
2. **claim** -- process a damage report against a policy created by an earlier quote.

Input is a JSON document on stdin with `customer` and `steps` array. Output
is a JSON document on stdout with `results` array (same length/order).

---

## Rules

### R1 -- Item values and base premiums

| Item      | Insurance value | Base premium |
|-----------|-----------------|--------------|
| Sword     | 1000 G          | 100 G        |
| Amulet    | 600 G           | 60 G         |
| Staff     | 800 G           | 80 G         |
| Potion    | 400 G           | 40 G         |

### R2 -- Component values and premiums

Components (runes, moonstones, etc.) are each insured at 250 G with a
25 G base premium per component. A "building block" of exactly 3 alike
components receives a special base premium of 60 G (instead of 75 G).

### R3 -- Cursed surcharge

Cursed items add a 50 % surcharge applied to the **item's** base premium.

### R4 -- High-enchantment surcharge

Items with enchantment level >= 5 add a 30 % surcharge applied to the
**item's** base premium.

### R5 -- Loyalty discount

Customers with >= 2 years with MHPCO receive a 20 % discount applied to
the **policy** base premium (sum of all item base premiums).

### R6 -- First-insurance surcharge

A 10 % initial assessment surcharge applies to the **policy** base premium.
Every item in every quote is treated as a first insurance, regardless of
customer history.

### R7 -- Follow-up contract discount

Customers receive a 15 % discount on each contract after their first. This
is applied to the **policy** base premium. The first `quote` step for a
customer is never a follow-up; the second and subsequent are.

### R8 -- Processing fee

A flat 5 G processing fee is added to every premium at the very end.

### R9 -- Modifier application order

Item-specific modifiers (cursed, high enchantment) apply to each item's
base premium individually. Policy-wide modifiers (loyalty, first insurance,
follow-up) apply to the policy base premium (sum of all item base premiums).
The processing fee is added last.

Premium = sum(item base premiums)
       + sum(item-specific surcharges)
       + policy-wide modifiers applied to sum(item base premiums)
       + 5 G fee

### R10 -- Rounding

All amounts rounded to whole G in MHPCO's favor:
- Premiums round UP (ceil).
- Payouts round DOWN (floor).
- Intermediate amounts kept as fractions; only the final result is rounded.

### R11 -- Deductible

100 G deductible per damage event (per damaged item in the `damages` array).

### R12 -- Cap

Total payout per policy is capped at 2x the insurance sum. The insurance
sum is computed from unmodified item insurance values (premium modifiers and
component block discounts do not affect insurance values).

### R13 -- High-enchantment claim clause

Damage to items with enchantment >= 8 is reimbursed at 50 % of the damage
amount (before deductible).

### R14 -- Dragon-material claim clause

Damage to items made of dragon material is fully reimbursed (before
deductible).

### R15 -- High-enchantment + dragon-material interaction

When both clauses apply (dragon material AND enchantment >= 8), the 50 %
rule wins. Then the deductible is subtracted.

### R16 -- Multiple items of the same type

A policy may cover multiple items of the same type. Each damage entry is
matched against the policy's item list. If the damages array contains more
entries of a given type than the policy covers, the claim is rejected
(CLI exits non-zero).

### R17 -- Error: unknown item type

If a quote includes an unknown item type (e.g. "broomstick"), the CLI exits
with a non-zero status code and writes an error to stderr. No results on
stdout.

### R18 -- Error: damage to uninsured item

If a claim references an item not in the policy (wrong type, or more
damages of a type than insured), CLI exits non-zero with error on stderr.

### R19 -- Error: negative damage amount

If a damage entry has a negative amount, CLI exits non-zero with error on
stderr.

### R20 -- Empty item list

An empty item list produces a premium of 5 G (just the processing fee).

---

## Examples

### E1 -- Building block of 3 alike components
- 2 runes -> 50 G base premium (2 * 25)
- 3 runes -> 60 G base premium (block of 3 applies)
- 4 runes -> 100 G base premium (4 * 25, block requires exactly 3)
- 7 runes -> 175 G base premium (7 * 25, no block)

### E2 -- "Alike" components (Q1 resolved)
- 2 runes + 1 moonstone -> 75 G (no block: different types)
- 3 runes + 3 moonstones -> 120 G (two separate blocks)

### E3 -- Modifier scope on multi-item policies (Q2 resolved)
- Cursed sword (base 100) + plain amulet (base 60) -> policy base 160 G;
  cursed surcharge = 50 G (50% of 100, not 50% of 160) -> 210 G before
  policy-wide modifiers and fee.

### E4 -- Modifier thresholds
- Customer with exactly 2 years -> loyalty discount applies.
- Sword enchantment exactly 5 -> high-enchantment surcharge applies;
  if also cursed, both surcharges apply.
- Sword enchantment 4 -> no high-enchantment surcharge; curse only if cursed.
- Dragon-material sword, enchantment exactly 8, damage 1000 G ->
  payout 400 G (50% rule: 500 - 100 deductible).

### E5 -- Deductible per damage event
- Dragon attack damages sword (500 G) and amulet (300 G):
  payout = (500 - 100) + (300 - 100) = 600 G
  (100 G deductible per damaged item, applied once per item)

### E6 -- Standard reimbursement
- Regular steel sword ench 3, damage 500 G -> payout 400 G (500 - 100)
- Rune, damage 200 G -> payout 100 G (200 - 100; components have no
  enchantment or material)

### E7 -- Enchantment threshold vs. dragon material
- Dragon-material sword ench 9, damage 1000 -> payout 400 (50%: 500 - 100)
- Dragon-material sword ench 5, damage 800 -> payout 700 (full: 800 - 100)
- Steel sword ench 9, damage 1000 -> payout 400 (50%: 500 - 100)

### E8 -- Multiple items of the same type (Q3 resolved)
- Policy with two swords -> insurance sum 2000, cap 4000.
- Dragon attack damages both swords -> each is a separate damage entry
  with its own deductible.
- More damage entries of a type than insured -> CLI non-zero exit.

### E9 -- Cap exhaustion
- Sword + amulet -> insurance sum 1600, cap 3200.
- Cursed sword (value 1000, premium 165 after modifiers) -> cap 2000
  (based on unmodified insurance value).
- Sword + 3 runes -> insurance sum 1750 (1000 + 3*250); block affects
  premium only.
- Sword insured (sum 1000, cap 2000); two claims of 1500 each:
  first claim payout 1400 (1500-100), remaining 600;
  second claim desired 1400 but capped at 600, remaining 0.

### E10 -- Rounding
- Premium yields 197.5 -> 198 G (ceil)
- Payout yields 350.5 -> 350 G (floor)

### E11 -- Edge cases
- Empty item list -> premium 5 G
- Unknown item type in quote -> CLI non-zero exit, error to stderr
- Damage to item not in policy -> CLI non-zero exit, error to stderr
- Negative damage amount -> CLI non-zero exit, error to stderr

### E12 -- Integration: Newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, ench 3)
- Premium: 100 base + 50 curse + 10 first-ins = 160 + 5 fee = 165 G

### E13 -- Integration: Long-standing customer's second contract
- Customer: 3 years, this is second quote
- Item: cursed sword (steel, ench 7)
- Premium: 100 base + 50 curse + 30 high-ench - 20 loyalty + 10 first-ins
  - 15 follow-up = 155 + 5 fee = 160 G
- First-insurance surcharge always applies (per item, not per customer).

---

## Questions / Clarifications

### Q1 -- "Alike" components
"Alike" means exactly the same component type. 2 runes + 1 moonstone are
NOT alike. 3 runes are alike; 3 moonstones are alike. Blocks form per type.

### Q2 -- Modifier scope
Item-specific modifiers (cursed, high enchantment) apply only to the base
premium of the affected item, not the whole policy. Policy-wide modifiers
(loyalty, first insurance, follow-up) apply to the sum of all item base
premiums.

### Q3 -- Multiple items of the same type
Allowed. Each item is separate. Damage entries are matched by count per
type. Excess damage entries cause rejection.

### Q4 -- First-insurance vs. customer history
"First insurance" surcharge applies to every item in every quote,
regardless of customer history. It is NOT about whether the customer has
had previous contracts.

---

## Per-test rationale

Each `it.todo()` maps to one or more rules/examples:

1. "empty item list -> premium 5 G" -- R20, E11
2. "single sword -> base premium 100 G + 5 G fee = 105 G" -- R1, R6, R8
3. "single amulet -> base premium 60 G + fee" -- R1
4. "single staff -> base premium 80 G + fee" -- R1
5. "single potion -> base premium 40 G + fee" -- R1
6. "single rune component -> 25 G base + fee" -- R2
7. "2 runes -> 50 G base premium" -- R2, E1
8. "3 runes -> 60 G base (block applies)" -- R2, E1
9. "4 runes -> 100 G base (no block)" -- R2, E1
10. "7 runes -> 175 G base" -- R2, E1
11. "2 runes + 1 moonstone -> 75 G (no block, different types)" -- R2, E2, Q1
12. "3 runes + 3 moonstones -> 120 G (two blocks)" -- R2, E2, Q1
13. "cursed sword -> 100 + 50 curse = 150 base" -- R3
14. "cursed sword + plain amulet -> 160 policy base + 50 curse = 210 before fee" -- R3, R9, E3, Q2
15. "sword enchantment 5 -> 100 + 30 high-ench" -- R4, E4
16. "sword ench 4 -> no high-ench surcharge" -- R4, E4
17. "cursed sword ench 5 -> both surcharges" -- R3, R4, E4
18. "customer 2 years -> loyalty discount applies" -- R5, E4
19. "customer 1 year -> no loyalty discount" -- R5
20. "first-insurance surcharge on single item" -- R6
21. "second quote for same customer -> follow-up discount" -- R7
22. "processing fee always added" -- R8
23. "newcomer cursed sword = 165 G" -- R1-R9, E12
24. "long-standing customer second contract cursed sword ench 7 = 160 G" -- R1-R9, E13, Q4
25. "premium 197.5 rounds to 198 (ceil)" -- R10, E10
26. "payout 350.5 rounds to 350 (floor)" -- R10, E10
27. "standard claim: steel sword ench 3, damage 500 -> payout 400" -- R11, E6
28. "component claim: rune damage 200 -> payout 100" -- R11, E6
29. "deductible per item: sword 500 + amulet 300 -> payout 600" -- R11, E5
30. "high-ench claim: ench 9, damage 1000 -> 50% then deductible = 400" -- R13, E7
31. "dragon-material sword ench 5, damage 800 -> payout 700" -- R14, E7
32. "dragon-material + ench 9 -> 50% wins, payout 400" -- R13, R14, R15, E7
33. "dragon-material ench exactly 8, damage 1000 -> payout 400" -- R13, R15, E4
34. "two swords insured -> insurance sum 2000, cap 4000" -- R12, R16, E8
35. "damage both swords -> separate deductibles" -- R16, E8
36. "more damage entries than insured -> rejection" -- R16, R18, E8
37. "cap: sword + amulet = insurance sum 1600, cap 3200" -- R12, E9
38. "cap based on unmodified insurance value (cursed sword cap 2000)" -- R12, E9
39. "sword + 3 runes -> insurance sum 1750, block doesn't affect sum" -- R12, E9
40. "cap exhaustion: two claims against sword, second capped" -- R12, E9
41. "unknown item type in quote -> error" -- R17, E11
42. "damage to uninsured item -> error" -- R18, E11
43. "negative damage amount -> error" -- R19, E11
44. "CLI reads JSON from stdin, writes JSON results to stdout" -- CLI spec
45. "CLI non-zero exit on unknown item type, error to stderr" -- R17, CLI spec
46. "CLI non-zero exit on invalid claim, error to stderr" -- R18, R19, CLI spec
47. "CLI processes sequential steps, claim references earlier quote by index" -- CLI spec
48. "results array has same length and order as steps" -- CLI spec
49. "quote result has premium field; claim result has payout and remainingCap" -- CLI spec
