# Claim Office — Example Mapping

This document is the shared spec memory for the TDD subagents. It distills
`prompt.md` into rules, examples, open questions, and the rationale for each
`it.todo()` test in `src/claim-office.spec.ts`.

The implementation is a CLI (`src/cli.ts`) that reads a JSON scenario from
stdin and writes a JSON `{results: [...]}` document to stdout. The library
module `src/claim-office.ts` contains the pure logic; tests typically exercise
that pure logic directly, with one or two end-to-end tests through the CLI
(stdin/stdout) for the error-exit / unknown-type behaviour that is described
only in terms of CLI exit status.

## Rules

### R1 — Item insurance values and base premiums

Each main item has a fixed insurance value and base premium:

- Sword: 1000 G / 100 G
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G

Components (runes, moonstones, ...) are 250 G value / 25 G base premium each.

### R2 — Block discount for components

A "building block" of exactly 3 alike components has a special base premium
of 60 G (instead of 3×25 = 75 G). The block requires exactly 3 of the same
type — different component types do not combine.

### R3 — Premium modifiers

- **Cursed** items: +50 % surcharge on that item's base premium.
- **High enchantment** (level ≥ 5): +30 % surcharge on that item's base
  premium.
- **Loyalty** (customer ≥ 2 years with MHPCO): −20 % discount on policy base
  premium.
- **First insurance**: +10 % surcharge on policy base premium. Applied
  per-quote regardless of customer history (each item in a quote is treated
  as a first insurance for that item).
- **Follow-up contract**: −15 % discount on policy base premium, applied to
  every contract after the customer's first in the scenario.
- **Processing fee**: flat +5 G added at the very end.

Modifier scope:
- Item-specific (cursed, high enchantment) → percentage of the affected item's
  base premium only.
- Policy-wide (loyalty, first insurance, follow-up) → percentage of the policy
  base premium (sum of item base premiums).
- Processing fee added last.

### R4 — Rounding

All intermediate amounts are kept as exact fractions. Only the final premium
or payout is rounded — premium UP, payout DOWN (always in MHPCO's favor).

### R5 — Claim processing

- Insurance sum = sum of items' insurance values (unmodified by premium
  modifiers and not affected by block discount).
- Cap = 2 × insurance sum, per policy. Successive claims deplete the cap.
- 100 G deductible applies once per damage entry (per damaged item).
- High-enchantment clause (item enchantment ≥ 8): damage reimbursed at 50 %
  before the deductible.
- Dragon material: full reimbursement (before deductible).
- If both apply (dragon AND enchantment ≥ 8), the 50 % clause wins.

### R6 — CLI / scenario semantics

- Input: `{customer, steps[]}` with `customer.yearsWithMHPCO` and steps that
  are either `{op: "quote", items: [...]}` or
  `{op: "claim", policy: <step-index>, incident: {cause, damages: [...]}}`.
- Output: `{results: [...]}` aligned with steps; quote → `{premium}`,
  claim → `{payout, remainingCap}`.
- Customer state across steps: each successive quote in the same scenario
  is a follow-up contract (so the very first quote is the customer's first
  contract; loyalty depends solely on `yearsWithMHPCO`).
- Errors (unknown type, claim mismatch, negative damage amount): CLI exits
  non-zero, writes description to stderr, no `results` to stdout.

## Examples (mapped to tests)

### E1 — Empty item list → 5 G (only fee)
### E2 — Base premiums of single main items
- 1 sword (plain, customer 0y, first contract): base 100 + first 10 + fee 5 = 115 G
- (We use a similar minimal case to assert each main item type)

### E3 — Component base premium
- 1 rune (250 G value, 25 G base): premium = 25 + 2.5 (first) + 5 = 32.5 → rounded up to 33 G

### E4 — Block discount (3 alike components)
- 2 runes → base 50 G
- 3 runes → base 60 G (block)
- 4 runes → base 100 G (block + 1 lone = 60 + 25)
- 7 runes → base 175 G (2 blocks + 1 lone = 60 + 60 + 25 = 145? — spec says 175)
  - Reading spec carefully: 7 runes → 175 G. That implies the rule is:
    one block of 3 at 60 G, the remaining 4 priced individually at 25 G:
    60 + 4×25 = 160 G — NOT 175 G. Re-checking: actually 175 G = 7×25,
    i.e. NO block applies for 7. The spec phrase "block applies when
    exactly 3" means only 3 alike → use block; otherwise individual.
    So 4 runes → 4×25 = 100 G (matches spec), 7 runes → 7×25 = 175 G
    (matches spec). The block applies ONLY when the count of an alike
    component group is exactly 3.

### E5 — Alike components are same TYPE (❓ resolved)
- 2 runes + 1 moonstone → 75 G (3×25; no block — different types)
- 3 runes + 3 moonstones → 120 G (60 + 60 — two separate blocks)

### E6 — Cursed-item scope (❓ resolved)
- Policy: cursed sword + plain amulet → base 160 G; cursed adds 50 G
  (50 % of 100, not of 160) → 210 G before policy modifiers and fee.

### E7 — Modifier thresholds
- yearsWithMHPCO = 2 → loyalty applies.
- enchantment = 5 → high-enchantment surcharge applies.
- enchantment = 4 → no high-enchantment surcharge.
- enchantment = 8 with dragon material, damage 1000 → payout 400 G
  (50 % clause then deductible).

### E8 — Newcomer with cursed sword (integration)
- customer 0y, 1st contract; cursed steel sword enchantment 3
- = 100 base + 50 curse + 10 first = 160 + 5 fee = 165 G

### E9 — Long-standing customer's second contract (integration)
- customer 3y; 2nd quote in scenario; cursed steel sword enchantment 7
- = 100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first
  − 15 follow-up = 155 + 5 fee = 160 G

### E10 — Rounding
- premium 197.5 → 198 G (up)
- payout 350.5 → 350 G (down)

### E11 — Deductible per damage event
- dragon attack damages sword (500) + amulet (300) → payout 600 G
  ((500−100) + (300−100))

### E12 — Standard reimbursement
- steel sword, enchantment 3, damage 500 → payout 400 G
- rune (no enchantment/material), damage 200 → payout 100 G

### E13 — Enchantment threshold vs dragon material
- dragon sword, enchantment 9, damage 1000 → payout 400 G (50 % wins)
- dragon sword, enchantment 5, damage 800 → payout 700 G (dragon, no 50 %)
- steel sword, enchantment 9, damage 1000 → payout 400 G (50 % only)

### E14 — Multiple items of same type (❓ resolved)
- Policy with 2 swords → insurance sum 2000, cap 4000.
- Dragon attack damages both swords (2 entries in damages) → each entry
  has its own deductible.
- More damage entries of a type than insured items → CLI exits non-zero.

### E15 — Cap exhaustion
- Sword + amulet → insurance sum 1600, cap 3200.
- Cursed sword (1000 value, premium with mods 165) → cap 2000
  (unmodified value).
- Sword + 3 runes (block) → insurance sum 1750 (block discount only
  affects premium, not insurance sum).
- Sword (cap 2000), two claims of 1500 each:
  - claim 1 → payout 1400, remainingCap 600
  - claim 2 → payout 600, remainingCap 0 (desired 1400 truncated by cap)

### E16 — Error cases
- Unknown item type in quote → CLI non-zero exit, error on stderr, no
  results on stdout.
- Claim references item not in policy (e.g. amulet damage when only sword
  insured, or unknown type) → non-zero exit, stderr error.
- Damage amount −200 → non-zero exit, stderr error.

## Questions / Clarifications

- ❓ "Alike" components → resolved (same TYPE, e.g. runes with runes only).
- ❓ Cursed surcharge scope on multi-item policies → resolved (item-specific).
- ❓ Multiple items of same type → resolved (allowed; each damage entry has
  its own deductible; mismatch → reject claim).
- ❓ "First insurance" surcharge → resolved (applies per item in every quote,
  regardless of customer history).

## Per-test rationale

Tests live in `src/claim-office.spec.ts` and exercise the pure library
function (let's call it `runScenario(input)` returning `{results}`). End-to-end
CLI/stderr tests are deferred to where the spec demands process exit codes
(error cases).

Ordered simple → complex:

1. Empty items quote → 5 G (R1, R3 fee, E1).
2. Single sword (newcomer, plain) → 115 G (R1 + first insurance + fee).
3. Single amulet → 71 G (60 + 6 first + 5 fee = 71).
4. Single staff → 93 G (80 + 8 + 5).
5. Single potion → 49 G (40 + 4 + 5).
6. Single rune → 33 G (25 + 2.5 first → 27.5, +5 fee = 32.5 → round up 33).
7. 2 runes → no block, base 50 G; premium 50 + 5 + 5 = 60 G.
8. 3 runes (block) → base 60 G; premium 60 + 6 + 5 = 71 G.
9. 4 runes → 4×25 = 100 G base; premium 100 + 10 + 5 = 115 G.
10. 7 runes → 7×25 = 175 G base; premium 175 + 17.5 + 5 = 197.5 → 198 G
    (also covers rounding-up rule E10).
11. 2 runes + 1 moonstone → base 75 G (no block — different types).
12. 3 runes + 3 moonstones → base 120 G (two separate blocks).
13. Cursed steel sword newcomer (E8) → 165 G.
14. Cursed sword + plain amulet (E6) → base 160 + 50 curse = 210 before
    policy mods/fee. Newcomer, first contract → +10 % first =
    210 + 21 = 231 + 5 = 236 G. (Sanity check: 10 % first applies to
    policy base 160, not to the post-curse 210? Per R3, first insurance
    is policy-wide on the policy BASE premium (sum of item base premiums),
    not on the curse-augmented amount. So: 160 base → +16 first → 176;
    + 50 curse (item-specific, on base) = 226; + 5 fee = 231 G.
    Re-reading: spec says "policy-wide modifiers apply to the policy base
    premium (the sum of all item base premiums)". So curse (item) and
    first (policy on base sum) are both percentages of base values. We
    use additive composition: total = sum_base + item_surcharges_on_base
    + policy_modifiers_on_sum_base + fee. For E8 newcomer with cursed
    sword: 100 + 50 (curse on 100) + 10 (first on 100) + 5 = 165 ✓.
    For E6 cursed sword + amulet, newcomer first: 160 + 50 (curse on 100)
    + 16 (first on 160) + 5 = 231 G.
15. Enchantment threshold: steel sword enchantment 5 → high-ench applies
    → 100 + 30 + 10 first + 5 fee = 145 G.
16. Enchantment threshold: steel sword enchantment 4 → no high-ench
    → 100 + 10 first + 5 fee = 115 G.
17. Enchantment + cursed combine: cursed sword enchantment 5 →
    100 + 50 + 30 + 10 + 5 = 195 G.
18. Loyalty exactly at 2 years: customer 2y, plain sword (first contract)
    → 100 − 20 loyalty + 10 first + 5 fee = 95 G.
19. Long-standing 2nd contract integration (E9) → 160 G.
20. Rounding premium up: case 10 already covers it. Add a payout-down case
    via claim test (#27 below).
21. Standard claim: steel sword enchantment 3, damage 500 → payout 400 G,
    remainingCap = 2000 − 400 = 1600 G.
22. Standard claim on rune: damage 200 → payout 100 G; cap = 2×250 = 500.
23. High-enchantment clause: steel sword enchantment 9, damage 1000 →
    payout 400 G (500 − 100).
24. Dragon material clause: dragon sword enchantment 5, damage 800 →
    payout 700 G (800 − 100).
25. Both clauses: dragon sword enchantment 9, damage 1000 → payout 400 G
    (50 % wins, then 500 − 100).
26. Enchantment exactly 8: dragon sword enchantment 8, damage 1000 →
    payout 400 G (E7 threshold).
27. Payout rounding down: a damage of 801 on a dragon sword enchantment 9
    → 50 % = 400.5, − 100 = 300.5 → round down 300 G.
28. Deductible per damage event: dragon attack damages sword (500) +
    amulet (300) → payout 600 G; remainingCap = 2×(1000+600) − 600 =
    2600 G.
29. Multiple same-type items: two swords, insurance sum 2000, cap 4000;
    one dragon attack damages both swords (two entries) →
    payout (500−100)+(500−100) = 800 G, remainingCap 3200 G.
30. Cap exhaustion across claims: single sword (cap 2000); two successive
    1500 G claims → first {payout 1400, remainingCap 600},
    second {payout 600, remainingCap 0}.
31. Insurance sum with block: sword + 3 runes → insurance sum 1750
    (block does not change insurance sum); cap 3500. Verify via a claim:
    e.g. damage to sword 200 → payout 100, remainingCap 3400.
32. Error: unknown item type in quote → CLI non-zero exit; no results on
    stdout; stderr non-empty.
33. Error: claim references item not in policy → CLI non-zero exit;
    stderr non-empty.
34. Error: damage amount negative (−200) → CLI non-zero exit; stderr
    non-empty.
35. Error: more damages of a type than insured items (two sword damages
    when only one sword insured) → CLI non-zero exit.

The CLI-error tests (32–35) are run end-to-end by spawning `node` / `tsx`
on `src/cli.ts`. The pure tests (1–31) call `runScenario(input)` directly.
