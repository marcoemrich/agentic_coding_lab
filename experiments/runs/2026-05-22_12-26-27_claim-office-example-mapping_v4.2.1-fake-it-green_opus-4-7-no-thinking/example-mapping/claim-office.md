# Example Mapping: MHPCO Claim Office

Feature for `src/claim-office.ts` (logic) + `src/cli.ts` (CLI). Tests in
`src/claim-office.spec.ts`.

Two operations: **quote** (premium for a list of items) and **claim**
(payout for a damage report against an existing policy).

---

## Rules

### R1 — Item base premiums & insurance values
| type      | insurance value | base premium |
|-----------|-----------------|--------------|
| sword     | 1000 G          | 100 G        |
| amulet    | 600 G           | 60 G         |
| staff     | 800 G           | 80 G         |
| potion    | 400 G           | 40 G         |
| component (rune, moonstone) | 250 G each | 25 G each |

### R2 — Component block
A group of **exactly 3 alike** components (same type) has a special base
premium of 60 G (instead of 3×25=75). "Alike" = exactly the same type
(rune ≠ moonstone). Block applies only at exactly 3; 4+ alike are priced
as singles. Insurance value/sum is unaffected by the block (still 250 G
each).

### R3 — Premium modifiers
- **Cursed**: +50% surcharge — item-specific (on that item's base premium).
- **High enchantment** (level ≥ 5): +30% surcharge — item-specific.
- **Loyalty** (≥ 2 years with MHPCO): −20% discount — policy-wide.
- **First insurance**: +10% surcharge — applied per item; each item in a
  quote is always treated as a first insurance regardless of customer
  history.
- **Follow-up contract**: −15% discount — policy-wide; applies to every
  quote after the customer's first quote in the scenario.
- **Processing fee**: +5 G flat, added at the very end.

Item-specific modifiers apply to the affected item's base premium.
Policy-wide modifiers (loyalty, follow-up) apply to the policy base
premium = sum of all item base premiums. First insurance is +10% per
item (10% of each item's base premium). Fee added last.

### R4 — Rounding
Only the final amount is rounded. Premium rounds **UP**; payout rounds
**DOWN** (always in MHPCO's favor). Intermediate values kept as fractions.

### R5 — Claim processing
- 100 G deductible per damage event (per damaged item entry).
- Payout per policy capped at **2× insurance sum** (based on unmodified
  insurance values; premium modifiers do not raise the cap).
- Enchantment ≥ 8: damage reimbursed at 50% of damage amount, then deductible.
- Dragon material: fully reimbursed, then deductible.
- If both apply (dragon + ench ≥ 8): the 50% rule wins.
- Components (rune/moonstone) have no enchantment/material → no special clause.
- Cap persists across successive claims on the same policy.

### R6 — Error cases (CLI: non-zero exit + stderr, no results on stdout)
- Unknown item type in a quote (e.g. "broomstick").
- Claim references a damage entry whose item is not in the policy
  (wrong type, or unknown type).
- Damage entry with negative amount (e.g. -200).
- More damage entries of a given type than the policy insures.

### R7 — CLI / scenario
- `claim-office` CLI at `src/cli.ts` reads JSON scenario from stdin,
  writes `{results: [...]}` to stdout.
- Scenario: `{customer:{yearsWithMHPCO}, steps:[...]}`.
- Steps processed sequentially; a `claim` references the quote step that
  created its policy via zero-based `policy` index.
- `results` array same length/order as `steps`.

---

## Examples (with expected values)

### Block (R2)
- 2 runes → 50 G base premium
- 3 runes → 60 G base premium (block)
- 4 runes → 100 G base premium (no block; needs exactly 3)
- 7 runes → 175 G base premium (7×25; not exactly 3, no block)
- 2 runes + 1 moonstone → 75 G (no block, different types)
- 3 runes + 3 moonstones → 120 G (two separate blocks: 60 + 60)

### Modifier scope (R3)
- cursed sword (base 100) + plain amulet (base 60) → policy base 160 G;
  curse adds 50 G (50% of sword base) → 210 G before further modifiers & fee.

### Modifier thresholds (R3, R5)
- exactly 2 years → loyalty applies.
- sword enchantment exactly 5 → high-enchantment surcharge applies.
- sword enchantment 4 → no high-enchantment surcharge.
- dragon sword, enchantment exactly 8, damage 1000 → payout 400 G
  (50% rule wins: 500 − 100 deductible).

### Deductible per event (R5)
- dragon attack damages sword (500) + amulet (300) → payout 600 G
  (400 + 200, deductible once per damaged item).

### Standard reimbursement (R5)
- steel sword, ench 3, damage 500 → payout 400 G.
- rune (value 250), damage 200 → payout 100 G (200 − 100; no clause).

### Enchantment threshold vs dragon material (R5)
- dragon sword, ench 9, damage 1000 → payout 400 G (50% wins: 500 − 100).
- dragon sword, ench 5, damage 800 → payout 700 G (dragon only: 800 − 100).
- steel sword, ench 9, damage 1000 → payout 400 G (high-ench: 500 − 100).

### Multiple items of same type (R1, R5, R6)
- two swords → insurance sum 2000 G, cap 4000 G.
- dragon attack with two sword damage entries → each its own deductible.
- more sword damage entries than swords insured → CLI non-zero exit, claim rejected.

### Cap (R5)
- sword + amulet → insurance sum 1600 G, cap 3200 G.
- cursed sword (premium with modifiers 165 G) → cap 2000 G (unmodified value).
- sword + 3 runes (block) → insurance sum 1750 G (1000 + 3×250); block
  affects premium only.
- sword (sum 1000, cap 2000), two successive claims of 1500 each:
  - first claim → payout 1400 G (1500 − 100), cap remaining 600 G.
  - second claim → payout 600 G (desired 1400 capped to remaining), cap remaining 0 G.

### Rounding (R4)
- premium 197.5 G → 198 G (up).
- payout 350.5 G → 350 G (down).

### Edge cases (R1, R6)
- empty item list → premium 5 G (only the fee).
- quote with unknown type (broomstick) → CLI non-zero exit + stderr, no results.
- claim references item not in policy (amulet damaged, only sword insured) →
  CLI non-zero exit + stderr.
- claim damage amount -200 → CLI non-zero exit + stderr.

### Integration examples
- **Newcomer cursed sword** (0 years, no prior contract; steel, ench 3):
  premium 165 G = 100 base + 50 curse + 10 first-insurance = 160 + 5 fee.
- **Long-standing 2nd contract** (3 years, 2nd quote; cursed sword steel ench 7):
  premium 160 G = 100 base + 50 curse + 30 high-ench − 20 loyalty
  + 10 first-insurance − 15 follow-up = 155 + 5 fee.

---

## Interface contract

**Input (stdin), verbatim field names:**
```json
{
  "customer": {"yearsWithMHPCO": 5},
  "steps": [
    {"op": "quote", "items": [
      {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
    ]},
    {"op": "claim", "policy": 0, "incident": {
      "cause": "fire",
      "damages": [{"itemType": "amulet", "amount": 200}]
    }}
  ]
}
```

**Output (stdout):**
```json
{"results": [{"premium": 71}, {"payout": 100, "remainingCap": 1100}]}
```
- quote result: `{premium: <integer>}`.
- claim result: `{payout: <integer>, remainingCap: <integer>}`.

Item types: `sword | amulet | staff | potion | rune | moonstone`. Item
fields `material`, `enchantment`, `cursed` are optional. Components have
no enchantment/material.

The core logic in `claim-office.ts` may expose functions (e.g. `quote`,
`claim`, or a single `runScenario`); `cli.ts` wires stdin/stdout. Exact
internal function names are free, but the JSON field names above are binding.

---

## Questions / Clarifications (❓ resolved)

- ❓ "Alike" components → **exactly the same type** (rune ≠ moonstone).
- ❓ Modifier scope on multi-item policies → item-specific modifiers
  (cursed, high-ench) on the item's base; policy-wide (loyalty,
  first-insurance per item, follow-up) on policy base; fee last.
- ❓ Two of the same item → each is a separate insured item; each damage
  entry is a separate event with its own deductible; too many damage
  entries of a type → reject claim (non-zero exit).
- ❓ "First insurance" → every item in a quote is always treated as a
  first insurance regardless of customer history; follow-up discount is
  separate and policy-wide.

---

## Per-test rationale (maps to it.todo order)

1. empty item list → 5 G (fee only) — edge case, simplest quote.
2. single sword newcomer-neutral base path — R1 base premium + fee.
3. amulet / staff / potion base premiums — R1 each main item.
4. single rune → 25+fee — R1 component premium.
5. 2 runes → 50 base — R2 below-block.
6. 3 runes → 60 base (block) — R2 block applies.
7. 4 runes → 100 base (no block) — R2 exactly-3 boundary.
8. 7 runes → 175 base — R2 not-exactly-3, all singles.
9. 2 runes + 1 moonstone → 75 — R2 different types, no block.
10. 3 runes + 3 moonstones → 120 — R2 two separate blocks.
11. cursed sword surcharge (item-specific) — R3 cursed.
12. high-enchantment ench 5 boundary applies — R3 high-ench threshold.
13. enchantment 4 → no high-ench — R3 threshold negative.
14. cursed + high-ench stack on one item — R3 both item-specific.
15. loyalty ≥2 years (exactly 2) — R3 loyalty policy-wide.
16. first-insurance +10% per item — R3 first insurance.
17. follow-up −15% on 2nd quote — R3 follow-up policy-wide.
18. multi-item modifier scope: cursed sword + amulet → 210 before fee — R3 scope.
19. newcomer cursed sword integration → 165 — R3 integration.
20. long-standing 2nd contract integration → 160 — R3 integration.
21. premium rounds up 197.5 → 198 — R4.
22. claim: steel sword ench3 damage 500 → 400 — R5 standard.
23. claim: rune damage 200 → 100 — R5 component no clause.
24. claim: deductible per event, sword 500 + amulet 300 → 600 — R5.
25. claim: dragon sword ench8 damage 1000 → 400 — R5 50% wins at 8.
26. claim: dragon sword ench9 damage 1000 → 400 — R5 both, 50% wins.
27. claim: dragon sword ench5 damage 800 → 700 — R5 dragon only.
28. claim: steel sword ench9 damage 1000 → 400 — R5 high-ench only.
29. payout rounds down 350.5 → 350 — R4.
30. cap = 2× insurance sum (sword+amulet 1600 → cap 3200) — R5 cap value.
31. cap based on unmodified value (cursed sword → cap 2000) — R5 cap.
32. insurance sum with block (sword + 3 runes → 1750) — R5/R2 sum vs premium.
33. two swords → insurance sum 2000, cap 4000 — R5/R1.
34. successive claims first 1400 cap-remaining 600 — R5 cap persists.
35. successive claims second 600 cap-remaining 0 — R5 cap exhaustion.
36. CLI: reads stdin scenario, writes results to stdout — R7 happy path.
37. CLI: quote then claim sequential, claim references policy index — R7.
38. CLI error: unknown item type (broomstick) → non-zero exit + stderr — R6.
39. CLI error: claim item not in policy → non-zero exit + stderr — R6.
40. CLI error: negative damage amount → non-zero exit + stderr — R6.
41. CLI error: more damage entries of a type than insured → non-zero exit — R6.
