# Example Mapping: MHPCO Claim Office

Feature file: `src/claim-office.ts` (core logic) + `src/cli.ts` (CLI entry).
Tests: `src/claim-office.spec.ts`.

Two operations: **quote** (compute premium for a list of items) and **claim**
(process a damage report against a policy created by an earlier quote).

---

## Rules

### R1 — Item base premiums and insurance values
Price list per main item:
- Sword: insurance value 1000 G, base premium 100 G
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G

Components (rune, moonstone, ...): insurance value 250 G each, base premium
25 G per component.

### R2 — Building block of 3 alike components
A block of exactly 3 alike components costs 60 G base premium (instead of
3×25 = 75). Block requires **exactly 3**; surplus components are billed at
25 G each. Greedily form as many 3-blocks as possible per type.

### R3 — "Alike" = same type
A block is formed only from components of the **same type**. Different types
(rune vs moonstone) form separate blocks; they do not combine.

### R4 — Premium modifiers
- Cursed item: +50 % surcharge (item-specific, on the item's base premium)
- High enchantment (enchantment level ≥ 5): +30 % surcharge (item-specific)
- Loyalty (≥ 2 years with MHPCO): −20 % discount (policy-wide)
- First insurance: +10 % surcharge (policy-wide — see R8)
- Follow-up contract (each contract after the first): −15 % discount (policy-wide)
- Processing fee: +5 G, added at the very end (after everything)

### R5 — Modifier scope
- Item-specific modifiers (cursed, high enchantment) apply to the **affected
  item's base premium** only.
- Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply
  to the **policy base premium** = sum of all item base premiums.
- The processing fee is added **last**.

Worked policy total order:
`policyTotal = sum(itemBase + itemSpecificSurcharges)`
then apply policy-wide percentage modifiers, then `+ 5 G fee`.

### R6 — Rounding in MHPCO's favor
- Premium → rounded **up** to whole G (ceil).
- Payout → rounded **down** to whole G (floor).
- Intermediate amounts are kept as exact fractions; only the final premium /
  payout is rounded.

### R7 — Claim processing
- 100 G deductible per damage **event** (= per damaged item / per entry in
  `damages`).
- Total payout per policy capped at **2 × insurance sum** (based on unmodified
  insurance values; premium modifiers do not raise the cap).
- High enchantment (≥ 8) on the damaged item → reimbursed at 50 % of the
  damage amount (the 50 % applies **before** the deductible).
- Dragon material → fully reimbursed.
- When both the ≥ 8 clause and dragon clause apply, the 50 % rule wins.
- Deductible applies after the percentage clause.
- Cap is shared and exhausted across successive claims on the same policy;
  a payout is reduced to the remaining cap.

### R8 — First insurance semantics (clarified ❓)
"First insurance" surcharge applies to **every item in a quote**, regardless
of customer history. It is NOT tied to customer's first-ever contract nor to
whether we've seen the item before. (Modeled as a policy-wide +10 % here,
consistent with the integration example arithmetic.)

### R9 — CLI
- Reads a JSON scenario from stdin: `{ customer: { yearsWithMHPCO }, steps: [...] }`.
- Steps processed sequentially; `claim` steps reference an earlier quote step
  by zero-based index in `policy`.
- Writes `{ results: [...] }` to stdout, same length/order as `steps`.
  - quote result: `{ premium: <int> }`
  - claim result: `{ payout: <int>, remainingCap: <int> }`
- Follow-up contract discount: a quote step is "first" if it's the customer's
  first quote in the scenario; later quotes get the −15 %.

### R10 — Error / edge conditions (CLI exits non-zero, error to stderr)
- Unknown item type in a quote (e.g. `broomstick`).
- Claim references an item not in the policy (wrong type, or unknown type).
- Damage entry with negative `amount`.
- `damages` contains more entries of a type than the policy covers
  (e.g. two sword damages, one sword insured) → whole claim rejected.
- Empty item list is NOT an error → premium 5 G (fee only).

---

## Examples (with expected values)

### Base premiums / blocks (R1, R2, R3)
- 2 runes → 50 G base (2×25)
- 3 runes → 60 G base (block)
- 4 runes → 100 G base (block of 3 + 1 single = 60 + 25)... NOTE spec says
  "4 runes → 100 G (no block — block requires exactly 3)". So 4 runes = 100 G,
  i.e. 4×25, NOT 60+25. Block applies only when count is exactly a multiple
  of 3? Re-read: "7 runes → 175 G". 7 = 175. 175 = 7×25. And 3→60, 6→? Spec
  only gives 3→60. For 7: if greedy blocks, 2 blocks (6) + 1 = 120+25 = 145,
  but spec says 175 = 7×25. So the block applies ONLY when the count is
  EXACTLY 3. Any other count → all components billed singly at 25 G each.
  - 2 runes → 50, 3 runes → 60, 4 runes → 100 (4×25), 7 runes → 175 (7×25).
- 2 runes + 1 moonstone → 75 G (no block; 3×25, different types) (R3)
- 3 runes + 3 moonstones → 120 G (two separate blocks, 60+60) (R3)

### Modifier scope (R5)
- Policy: cursed sword (base 100) + plain amulet (base 60) → policy base 160;
  cursed surcharge = 50 (50 % of sword's 100, not of 160) → 210 before
  policy-wide modifiers and fee.

### Modifier thresholds (R4)
- Exactly 2 years → loyalty applies.
- Sword enchantment exactly 5 → high-enchantment applies.
- Sword enchantment 4 → no high-enchantment.
- Dragon sword, enchantment exactly 8, damage 1000 → payout 400
  (≥8 clause: 50 % → 500; then deductible 100 → 400).

### Claim clauses (R7)
- Dragon attack: insured sword damaged 500 + insured amulet damaged 300 →
  payout 600 (deductible once per item: (500−100)+(300−100)=400+200=600).
- Regular sword (steel, ench 3), damage 500 → 400 (500−100).
- Rune (value 250), damage 200 → 100 (200−100; no clauses for components).
- Dragon sword, ench 9, damage 1000 → 400 (50 % wins: 500, −100).
- Dragon sword, ench 5, damage 800 → 700 (dragon full: 800, −100).
- Steel sword, ench 9, damage 1000 → 400 (50 %: 500, −100).

### Multiple same-type items (R7, R10)
- Two swords → insurance sum 2000, cap 4000.
- Dragon attack damages both swords (two sword entries) → each its own
  deductible.
- More sword damages than swords insured → CLI non-zero exit, claim rejected.

### Cap (R7)
- Sword + amulet → insurance sum 1600, cap 3200.
- Cursed sword (value 1000, premium 165) → cap 2000 (unmodified value).
- Sword + 3 runes (block) → insurance sum 1750 (1000 + 3×250); block
  discount affects premium only, not sum.
- Sword (sum 1000, cap 2000), two successive claims of 1500 each:
  - claim 1 → payout 1400 (1500−100), remaining cap 600.
  - claim 2 → desired 1400 reduced to remaining 600 → payout 600, remaining 0.

### Rounding (R6)
- Premium 197.5 → 198 (up).
- Payout 350.5 → 350 (down).

### Edge cases (R10)
- Empty item list → premium 5 (fee only).
- Unknown item type in quote → non-zero exit, stderr, no results on stdout.
- Claim references item not in policy → non-zero exit.
- Damage amount −200 → non-zero exit.

### Integration (R4, R5, R8)
- Newcomer (0 yrs, no previous contract), cursed sword (steel, ench 3) →
  premium 165. (100 base + 50 curse + 10 first insurance = 160; + 5 fee = 165.)
  Arithmetic: itemSpecific → 100 + 50 = 150 (curse). policy-wide: first
  insurance +10 % of policy base 100 = +10 → 160; fee +5 → 165.
  NOTE: the +10 first-insurance is 10 % of the policy base premium (100),
  giving 10, applied to the surcharged total 150 → 160. Confirmed by numbers.
- Long-standing customer's 2nd contract (3 yrs), cursed sword (steel, ench 7)
  → premium 160.
  (100 base + 50 curse + 30 high ench − 20 loyalty + 10 first ins − 15
  follow-up = 155; + 5 fee = 160.)
  Each %-modifier computed on the policy base premium 100:
  curse 50 (on item base 100), high ench 30 (on item base 100), loyalty
  −20 (20 % of 100), first insurance +10 (10 % of 100), follow-up −15 (15 %
  of 100). Item base 100 + 50 + 30 − 20 + 10 − 15 = 155; + 5 = 160.
  => All percentage modifiers are computed against the relevant base (item
  base for item-specific, policy base premium for policy-wide), then summed
  additively, not compounded. This matches both integration examples.

---

## Interface contract (verbatim field names — binding)

**Input (stdin):**
```json
{
  "customer": { "yearsWithMHPCO": 5 },
  "steps": [
    { "op": "quote",
      "items": [ { "type": "amulet", "material": "silver", "enchantment": 2, "cursed": false } ] },
    { "op": "claim",
      "policy": 0,
      "incident": { "cause": "fire", "damages": [ { "itemType": "amulet", "amount": 200 } ] } }
  ]
}
```

**Output (stdout):**
```json
{ "results": [ { "premium": 65 }, { "payout": 100, "remainingCap": 1100 } ] }
```
(amulet premium for 5-yr customer, ench 2, not cursed: base 60; loyalty −20 %
= −12, first insurance +10 % = +6, → 60 − 12 + 6 = 54; + 5 fee = 59. payout
200 − 100 = 100; cap = 2×600 = 1200, remaining 1100. These are illustrative;
the spec only fixes the shape with `<integer>` placeholders, so the CLI shape
test asserts structure/keys, not these exact derived numbers.)

Item object fields: `type`, `material?`, `enchantment?`, `cursed?`.
Damage object fields: `itemType`, `amount`.
Claim step fields: `op`, `policy`, `incident{ cause, damages[] }`.

---

## Questions / Clarifications (❓ from spec — resolved)
- Q: "alike" = same type or same family? → **Same type** (R3). Separate blocks
  per type.
- Q: cursed surcharge whole policy or just cursed item? → **Just the cursed
  item's base premium** (R5).
- Q: two of the same item? → Each is a separate insured item; insurance sum
  adds up; each damage entry has its own deductible (R7).
- Q: "first insurance" = first ever contract or first time seeing item? →
  **Applies to every item in a quote regardless of history** (R8).

---

## Per-test rationale (each it.todo below)
1. amulet base 60 — R1 simplest single item.
2. sword base 100 — R1.
3. staff base 80 — R1.
4. potion base 40 — R1.
5. single rune base 25 — R1 component.
6. empty item list → 5 (fee only) — R10/R6 edge, simplest fee.
7. 2 runes → 50 base — R2 below-block.
8. 3 runes → 60 base (block) — R2.
9. 4 runes → 100 base (no block) — R2 exactly-3 rule.
10. 7 runes → 175 base — R2.
11. 2 runes + 1 moonstone → 75 (no block, diff types) — R3.
12. 3 runes + 3 moonstones → 120 (two blocks) — R3.
13. cursed sword item-specific surcharge: base 100 +50 = 150 (+5 fee, newcomer
    first-ins) integration → 165 — R4/R5 cursed + integration newcomer.
14. high-enchantment threshold ench 5 applies — R4.
15. enchantment 4 no surcharge — R4.
16. loyalty exactly 2 years applies — R4.
17. multi-item modifier scope: cursed sword + plain amulet → 210 before
    policy-wide & fee — R5.
18. integration newcomer cursed sword → premium 165 — R4/R5/R8.
19. integration long-standing 2nd contract cursed ench7 sword → 160 —
    R4/R5/R8/R9 follow-up.
20. premium rounding 197.5 → 198 (up) — R6.
21. claim: regular sword damage 500 → payout 400 — R7 standard.
22. claim: rune damage 200 → payout 100 — R7 component no clause.
23. claim: high-ench (≥8) sword 50 % then deductible (dragon ench8 dmg1000 →
    400) — R7.
24. claim: dragon material full reimbursement (dragon ench5 dmg800 → 700) — R7.
25. claim: steel ench9 dmg1000 → 400 (50 % clause) — R7.
26. claim: dragon ench9 dmg1000 → 400 (50 % wins over dragon) — R7.
27. claim: deductible per damaged item (sword500 + amulet300 → 600) — R7.
28. cap = 2× insurance sum (sword+amulet sum1600 cap3200) — R7.
29. cap from unmodified value (cursed sword cap 2000) — R7.
30. insurance sum with block (sword + 3 runes → 1750) — R7.
31. payout rounding 350.5 → 350 (down) — R6.
32. cap exhaustion across two claims (1400 then 600, remaining 0) — R7.
33. two swords insurance sum 2000 cap 4000 — R7.
34. two swords both damaged, each own deductible — R7.
35. CLI: reads stdin JSON, writes results array with premium key — R9 shape.
36. CLI: claim step result has payout + remainingCap keys — R9 shape.
37. CLI error: unknown item type → non-zero exit, no stdout results — R10.
38. CLI error: claim references item not in policy → non-zero exit — R10.
39. CLI error: negative damage amount → non-zero exit — R10.
40. CLI error: more damages of a type than insured → non-zero exit — R10.
