# MHPCO Claim Office — Example Mapping

## Rules

### Quote operation
- **R1**: Each main item has a base premium per the price list:
  - sword: insured 1000G, base premium 100G
  - amulet: insured 600G, base premium 60G
  - staff: insured 800G, base premium 80G
  - potion: insured 400G, base premium 40G
- **R2**: Components (rune, moonstone) are insured at 250G each with a base premium of 25G each.
- **R3**: A building block of 3 alike components (3 of the same component type) is offered at a special base premium of 60G (instead of 3 × 25G = 75G). Greedy grouping: form as many blocks of 3 as possible per component type; remainder priced individually.
- **R4 (Cursed)**: Cursed items add a +50% risk surcharge (×1.5 on that item's base premium).
- **R5 (Highly enchanted)**: Items with `enchantment >= 5` add a +30% risk surcharge (×1.3 on that item's base premium).
- **R6 (Loyalty)**: Customers with `yearsWithMHPCO >= 2` receive a 20% loyalty discount (×0.8 on the whole quote's premium).
- **R7 (First insurance)**: A first insurance (first quote step in the scenario) carries a +10% initial assessment surcharge (×1.1 on the whole quote's premium).
- **R8 (After first)**: Each contract after the first receives a flat 15% discount (×0.85 on the whole quote's premium). This applies to every quote step after the first within the scenario.
- **R9 (Processing fee)**: A 5G processing fee is added to every premium (after all percentage modifiers).
- **R10 (Rounding)**: All amounts are rounded UP to whole G (in MHPCO's favor). Rounding is applied to the final premium total.

### Calculation order (chosen interpretation)
1. Compute per-item base premium with item-level modifiers (cursed, enchantment≥5).
2. Sum all per-item base premiums (including component blocks at 60G per block of 3 alike).
3. Apply customer-level modifiers (loyalty, first/after-first) multiplicatively to the sum.
4. Round UP.
5. Add 5G processing fee.

### Claim operation
- **C1**: A deductible of 100G applies per damage event (per claim, not per damaged item).
- **C2**: Damage to items with `enchantment >= 8` is reimbursed at 50% of the damage amount.
- **C3**: Damage to items made of dragon material (`material === "dragon"`) is fully reimbursed (100%).
- **C4 (Chosen interpretation)**: Damage to items neither dragon-material nor highly enchanted (≥8) is not reimbursed (reimbursement rate 0%). The spec scopes claims to those two categories.
- **C5**: When an item qualifies under both C2 and C3 (e.g., dragon sword enchantment ≥ 8), the better rate (100%) applies.
- **C6 (Chosen interpretation)**: Payout calculation: `payout = max(0, sum_over_damages(amount * rate) - deductible)` where rate is 1.0 (dragon), 0.5 (enchant ≥ 8), or 0 (other); deductible is 100G per event.

### CLI / IO
- **I1**: CLI entry point at `src/cli.ts` reads JSON from stdin, writes JSON to stdout.
- **I2**: Input is a JSON object with `customer` (object with `yearsWithMHPCO: integer`) and `steps` (array).
- **I3**: Each step has `op: "quote" | "claim"` and operation-specific fields.
- **I4**: Quote step: `items` array, each item has `type` (sword|amulet|staff|potion|rune|moonstone), optional `material`, `enchantment`, `cursed`.
- **I5**: Claim step: `policy` (zero-based index of a prior quote step), `incident` with `cause` and `damages` array (each with `itemType` and `amount`).
- **I6**: Output is a JSON object with `results` array, same length and order as `steps`. Quote result has `premium` (integer); claim result has `payout` (integer).
- **I7**: Steps processed sequentially; the customer is one single customer for the whole scenario.

## Interface contract (verbatim field names)

**Input:**
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

**Output:**
```json
{"results": [{"premium": 58}, {"payout": 0}]}
```

Field names: `customer`, `yearsWithMHPCO`, `steps`, `op`, `items`, `type`,
`material`, `enchantment`, `cursed`, `policy`, `incident`, `cause`,
`damages`, `itemType`, `amount`, `results`, `premium`, `payout`.

Item types: `"sword"`, `"amulet"`, `"staff"`, `"potion"`, `"rune"`, `"moonstone"`.
Material `"dragon"` triggers full reimbursement.

## Examples

### Quote examples

**Q1 — Single sword, new customer, first contract, plain item**
- Input: `customer { yearsWithMHPCO: 0 }`, items=[sword, material=steel, enchantment=3, cursed=false]
- Base: 100 × 1.1 (first) = 110, +5 = **115G**

**Q2 — Single amulet, plain, new customer, first**
- 60 × 1.1 = 66, +5 = **71G**

**Q3 — Single staff, plain, new customer, first**
- 80 × 1.1 = 88, +5 = **93G**

**Q4 — Single potion, plain, new customer, first**
- 40 × 1.1 = 44, +5 = **49G**

**Q5 — Single rune (component), plain, new customer, first**
- 25 × 1.1 = 27.5 → round up 28, +5 = **33G**

**Q6 — Single moonstone, plain, new customer, first**
- 25 × 1.1 = 27.5 → 28, +5 = **33G**

**Q7 — Cursed sword (no enchantment), new customer, first**
- 100 × 1.5 (cursed) × 1.1 (first) = 165, +5 = **170G**

**Q8 — Highly enchanted sword (enchantment=5), new customer, first**
- 100 × 1.3 × 1.1 = 143, +5 = **148G**

**Q9 — Enchantment exactly 5 boundary; enchantment=4 should NOT trigger surcharge**
- sword enchantment=4, new customer, first: 100 × 1.1 = 110, +5 = **115G**

**Q10 — Loyalty discount (yearsWithMHPCO=2)**
- sword, yearsWithMHPCO=2, first contract: 100 × 0.8 × 1.1 = 88, +5 = **93G**

**Q11 — Loyalty boundary (yearsWithMHPCO=1 does NOT trigger)**
- sword, yearsWithMHPCO=1, first contract: 100 × 1.1 = 110, +5 = **115G**

**Q12 — Second contract (after-first discount)**
- Step 0: sword (first) → 115G
- Step 1: sword (second) → 100 × 0.85 = 85, +5 = **90G**

**Q13 — Three runes form one block of 3 alike**
- 3 runes (block of 3 = 60G), first: 60 × 1.1 = 66, +5 = **71G**

**Q14 — Two runes do NOT form a block**
- 2 × 25 = 50, ×1.1 = 55, +5 = **60G**

**Q15 — Four runes = one block (60G) + one rune (25G)**
- 60 + 25 = 85, ×1.1 = 93.5 → round up 94, +5 = **99G**

**Q16 — Six runes = two blocks**
- 120 × 1.1 = 132, +5 = **137G**

**Q17 — Mixed components do not combine: 2 runes + 1 moonstone form NO block**
- 75 × 1.1 = 82.5 → 83, +5 = **88G**

**Q18 — Cursed AND highly enchanted (stack multiplicatively)**
- sword cursed=true, enchantment=5: 100 × 1.5 × 1.3 × 1.1 = 214.5 → 215, +5 = **220G**

**Q19 — All modifiers combined**
- sword cursed=true, enchantment=5, yearsWithMHPCO=2, first contract
- 100 × 1.5 × 1.3 × 0.8 × 1.1 = 171.6 → round up 172, +5 = **177G**

**Q20 — Multiple items in one quote (sum then modifiers)**
- sword + amulet, plain, new customer, first: (100 + 60) × 1.1 = 176, +5 = **181G**

**Q21 — Rounding UP in MHPCO's favor (non-integer result)**
- staff, yearsWithMHPCO=2, first: 80 × 0.8 × 1.1 = 70.4 → round up 71, +5 = **76G**

### Claim examples

**C-Ex1 — Dragon material fully reimbursed**
- Damage to dragon sword, amount 500: payout = max(0, 500*1.0 - 100) = **400G**

**C-Ex2 — Highly enchanted (≥8) reimbursed at 50%**
- Damage to sword enchantment=8, amount 500: payout = max(0, 500*0.5 - 100) = **150G**

**C-Ex3 — Enchantment=7 boundary does NOT qualify (and not dragon) → 0 payout**
- Damage to sword enchantment=7, material=steel, amount 500: **0G**

**C-Ex4 — Enchantment=8 boundary DOES qualify**
- Damage to amulet enchantment=8, amount 400: max(0, 200 - 100) = **100G**

**C-Ex5 — Neither dragon nor enchant≥8 → 0 payout**
- Damage to amulet enchantment=2, material=silver, amount 200: **0G**

**C-Ex6 — Dragon trumps low enchantment (dragon staff, enchantment=1)**
- Damage 300: max(0, 300 - 100) = **200G**

**C-Ex7 — Single deductible per event (multiple damages in one claim)**
- Two damages on dragon items: amount 200 + amount 200 = 400 total reimbursable, - 100 deductible = **300G**

**C-Ex8 — Damage below deductible clamps to 0**
- Dragon sword damage 50: max(0, 50 - 100) = **0G**

**C-Ex9 — Mixed damages (one dragon, one ineligible)**
- Dragon sword damage 300 + amulet enchantment=2 damage 200: reimbursable = 300 + 0 = 300, - 100 = **200G**

**C-Ex10 — Both dragon AND enchantment≥8 → take the better (100%)**
- Dragon sword enchantment=9, damage 400: **300G** (not 100G if 50% applied)

### CLI / IO examples

**IO1 — Schema example 1: quote only**
- Stdin: scenario with one sword (enchantment=3, customer yearsWithMHPCO=0)
- Stdout: `{"results": [{"premium": 115}]}`

**IO2 — Schema example 2: quote then claim**
- Stdin: amulet (enchantment=2, silver) with customer yearsWithMHPCO=5, then claim 200G amulet damage
- Quote: 60 × 0.8 (loyalty) × 1.1 (first) = 52.8 → round up 53, +5 = 58G
- Claim: amulet enchantment=2, not dragon → 0G
- Stdout: `{"results": [{"premium": 58}, {"payout": 0}]}`

**IO3 — Empty steps array**
- Stdin: `{"customer": {"yearsWithMHPCO": 0}, "steps": []}`
- Stdout: `{"results": []}`

## Questions / Clarifications

- **Q-Ambig-1**: Does the "first insurance" / "after first" status depend on the customer's history outside this scenario? **Resolved**: The schema only carries `yearsWithMHPCO`; the natural reading is that the first quote step in the scenario is the "first insurance" and subsequent quotes are "after first". (Documented as R7/R8.)
- **Q-Ambig-2**: Is the 15% after-first discount flat per contract, or does it stack with the contract index? **Resolved**: "15% discount on each contract after their first" reads as a flat 15% per contract after the first (R8).
- **Q-Ambig-3**: Are first-insurance surcharge and after-first discount mutually exclusive? **Resolved**: Yes — the first contract gets +10%; every contract after gets -15%.
- **Q-Ambig-4**: Order of rounding and processing fee? **Resolved**: Round UP first, then add the 5G fee (so the fee is always exactly +5G and never lost to rounding). This is the simplest reading of "rounded to whole G in MHPCO's favor" plus "5 G processing fee is added to every premium".
- **Q-Ambig-5**: Are loyalty discount and risk surcharges applied per-item or to the whole quote? **Resolved**: Item-level modifiers (cursed, enchantment≥5) apply per item; customer-level modifiers (loyalty, first/after-first) apply to the whole-quote sum.
- **Q-Ambig-6**: "3 alike components" — does it mean 3 of the same component type, or any 3 components? **Resolved**: Same type (alike = same kind). Mixed groups do not form a block.
- **Q-Ambig-7**: How does the deductible interact with the reimbursement rate? **Resolved (C6)**: Compute reimbursable per damage (`amount * rate`), sum, then subtract one deductible per event, clamp to 0.
- **Q-Ambig-8**: What about items not in the two named categories (≥8 enchantment or dragon)? **Resolved (C4)**: They are not reimbursed (rate 0%); the spec scopes claims to those two categories.
- **Q-Ambig-9**: If an item qualifies under both rules (dragon + ≥8), which rate applies? **Resolved (C5)**: The better rate (100%, i.e., dragon).
- **Q-Ambig-10**: `cursed` and `enchantment` may be omitted from items. **Resolved**: Treat absent `cursed` as false and absent `enchantment` as 0.
- **Q-Ambig-11**: Should the deductible be per damage event or per damaged item? **Resolved (C1)**: Per damage event = per claim/incident (the spec says "per damage event"; a single claim filed by the customer is one event).

## Per-test rationale

Listed in test-list order (simple → complex). Each line maps a test to the rule(s) and example(s) it covers.

### Quote tests
1. Single plain sword (115G) — R1, R7, R9, R10; Q1
2. Single amulet (71G) — R1
3. Single staff (93G) — R1
4. Single potion (49G) — R1
5. Single rune (33G) — R2, R10 (rounding)
6. Single moonstone (33G) — R2
7. Cursed sword (170G) — R4
8. Highly enchanted sword, enchantment=5 (148G) — R5
9. Enchantment=4 boundary, NOT highly enchanted (115G) — R5 boundary
10. Loyalty discount yearsWithMHPCO=2, sword (93G) — R6
11. Loyalty boundary yearsWithMHPCO=1, sword (115G) — R6 boundary
12. Two-quote sequence: first (115G) then after-first (90G) — R7, R8
13. Three runes form a block (71G) — R3
14. Two runes no block (60G) — R3 negative
15. Four runes: one block + one (99G) — R3 partial
16. Six runes: two blocks (137G) — R3 multiple
17. Mixed components (2 runes + 1 moonstone) no block (88G) — R3 + Q-Ambig-6
18. Cursed AND highly enchanted stack (220G) — R4 + R5
19. All modifiers combined sword (177G) — R4+R5+R6+R7
20. Multiple items in one quote (181G) — sum then modifiers
21. Rounding UP non-integer (staff loyalty first → 76G) — R10
22. Missing optional cursed/enchantment fields treated as defaults — Q-Ambig-10

### Claim tests
23. Dragon material fully reimbursed (dragon sword 500 → 400G) — C3, C1
24. Enchantment 8 reimbursed at 50% (sword 500 → 150G) — C2
25. Enchantment 7 not qualifying (0G) — C2 boundary, C4
26. Enchantment 8 boundary qualifies (amulet 400 → 100G) — C2 boundary
27. Neither dragon nor ≥8 → 0 payout (amulet enchant 2, 200 → 0G) — C4
28. Dragon trumps low enchantment (dragon staff enchant 1, 300 → 200G) — C3
29. Single deductible per event with two damages (dragon items 200+200 → 300G) — C1
30. Damage below deductible clamps to 0 (dragon 50 → 0G) — C1
31. Mixed damages, one eligible one not (300+200 → 200G) — C1, C4
32. Item qualifies under both rules; better rate wins (dragon+enchant9, 400 → 300G) — C5

### CLI / integration tests
33. CLI reads stdin and writes stdout for schema example 1 (115G) — I1–I7, IO1
34. CLI handles quote+claim sequence (schema example 2: premium 58, payout 0) — IO2
35. CLI handles empty steps array (results: []) — IO3
