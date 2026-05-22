# MHPCO Claim Office — Example Mapping

Shared context for `red` and `green` subagents. The full spec lives in
`prompt.md`. This file is the single source of truth for field names,
rules, examples, and ❓-resolved interpretations.

## Feature

A `claim-office` CLI exposes two operations: **quote** computes the
premium for a list of items, **claim** processes a damage report
against an existing policy. Input/output are JSON on stdin/stdout.

The CLI entry point is `src/cli.ts`. The pure domain logic lives in
`src/claim-office.ts` (test target).

---

## Rules

### R1 — Item values and base premiums

| Item     | Insurance value | Base premium |
| -------- | --------------- | ------------ |
| Sword    | 1000 G          | 100 G        |
| Amulet   |  600 G          |  60 G        |
| Staff    |  800 G          |  80 G        |
| Potion   |  400 G          |  40 G        |

Components (`rune`, `moonstone`, …): 250 G insurance value, 25 G base
premium each. A **block of exactly 3 alike components** has a special
base premium of 60 G instead of 75 G.

### R2 — "Alike" components (❓ resolved)

"Alike" means **same type**. `rune` and `moonstone` are different types
and never combine into one block.

### R3 — Premium modifiers

- **Cursed** item: +50 % of that item's base premium.
- **Highly enchanted** (enchantment ≥ 5): +30 % of that item's base
  premium.
- **Long-standing customer** (yearsWithMHPCO ≥ 2): −20 % policy-wide
  loyalty discount on the policy base premium.
- **First insurance**: +10 % per item — applies to every item in every
  quote (❓ resolved: each item in a quote is treated as a first
  insurance, regardless of customer history).
- **Follow-up contract** (customer's 2nd+ `quote` in the scenario):
  −15 % policy-wide discount on the policy base premium.
- **Processing fee**: +5 G flat, added at the very end.

### R4 — Modifier scope (❓ resolved)

- Item-specific modifiers (`cursed`, high enchantment, first
  insurance) apply to each affected item's own base premium.
- Policy-wide modifiers (loyalty, follow-up contract) apply to the
  policy base premium (sum of all item base premiums).
- Processing fee is added at the very end.

### R5 — Modifier thresholds

- Loyalty discount applies when `yearsWithMHPCO >= 2` (exactly 2
  counts).
- High-enchantment surcharge applies when `enchantment >= 5` (exactly
  5 counts).
- Both surcharges stack if both conditions hold.

### R6 — Rounding

All intermediate amounts are kept as exact fractions. Only the final
premium or payout is rounded **in the MHPCO's favor**:

- Premiums are rounded **up** to the next whole G.
- Payouts are rounded **down** to the next whole G.

### R7 — Claim processing

- A 100 G **deductible** applies **per damaged item** (i.e. per entry
  in the `damages` array), not per damage event.
- Total payout per policy is capped at **2 × the insurance sum** of
  the policy. The cap is computed from the items' unmodified
  insurance values (premium modifiers do not raise the cap; component
  blocks do not lower it).
- The cap is persistent across successive claims on the same policy.
- **High-enchantment clause** (enchantment ≥ 8): damage to that item
  is reimbursed at 50 % before the deductible.
- **Dragon-material clause**: damage to that item is fully reimbursed
  (no 50 % cut) before the deductible.
- When both conditions hold (enchantment ≥ 8 **and** dragon material),
  the 50 % rule wins (high-enchantment clause applies first), then the
  deductible.
- Per-claim payouts never go negative — if the deductible exceeds the
  reimbursable amount, that item contributes 0 G to the claim.
- If the remaining cap is smaller than the desired payout, the payout
  is reduced to the remaining cap; remaining cap then becomes 0 G.

### R8 — Edge cases

- Empty `items` list → premium is just the 5 G fee.
- Unknown item type in a quote → CLI exits non-zero; an error
  description is written to stderr; no `results` are written to stdout.
- Claim references an item type not in the policy (including unknown
  types, or more `sword` damages than swords insured) → CLI exits
  non-zero; error to stderr.
- Negative damage amount → CLI exits non-zero; error to stderr.

---

## Interface contract (binding)

Field names below are taken verbatim from the spec. Implementations
must use exactly these names.

### Input on stdin

```json
{
  "customer": { "yearsWithMHPCO": 5 },
  "steps": [
    {
      "op": "quote",
      "items": [
        { "type": "amulet", "material": "silver", "enchantment": 2, "cursed": false }
      ]
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "fire",
        "damages": [
          { "itemType": "amulet", "amount": 200 }
        ]
      }
    }
  ]
}
```

Field reference:

- `customer.yearsWithMHPCO` — integer years of business with MHPCO.
- Each step has `op`: `"quote"` or `"claim"`.
- Quote step has `items`: array of item objects.
  - `type` — one of `sword | amulet | staff | potion | rune |
    moonstone`.
  - `material` — string, optional (used for dragon-material clause:
    `material === "dragon"`).
  - `enchantment` — integer, optional (defaults treated as 0 / not
    applicable for components).
  - `cursed` — boolean, optional (defaults false).
- Claim step has `policy` (zero-based step index of the originating
  quote) and `incident` with `cause` (string, informational) and
  `damages` (array of `{ itemType, amount }`).

### Output on stdout

```json
{
  "results": [
    { "premium": 50 },
    { "payout": 100, "remainingCap": 2900 }
  ]
}
```

- Quote result: `{ "premium": <integer> }`.
- Claim result: `{ "payout": <integer>, "remainingCap": <integer> }`.
- The `results` array has the same length and order as `steps`.

### Pure domain interface (suggested)

The `src/claim-office.ts` module exposes pure functions that the CLI
glue calls; structure is free, but the test file will reference at
least these surfaces:

- `quote(customer, items, contractIndex)` → `{ premium }` plus an
  internal policy record (insurance sum, cap, items) the test can
  inspect or that `claim` later consumes.
- `claim(policy, damages)` → `{ payout, remainingCap }` and mutates /
  returns updated remaining cap.
- A higher-level `runScenario(input)` that mirrors the CLI's
  scenario-level JSON contract, used by the CLI-surface tests.

The exact function names are an implementation detail — the test list
treats `runScenario` as the canonical surface that covers both quote
and claim, with `quote`/`claim` helpers usable for finer-grained
tests.

---

## Examples (grouped by section in the spec)

### E-block — Building block of 3 alike components

- 2 runes → base 50 G
- 3 runes → base 60 G (block)
- 4 runes → base 100 G (no block — block requires exactly 3)
- 7 runes → base 175 G (one block of 3 = 60, plus 4 loose = 100;
  175 = 60 + 4×25? Let's check: 7 runes = 1 block of 3 (60) + 4 loose
  (4×25 = 100) → 160. But spec says 175. So 7 runes = 1 block (60) +
  4 loose (100) = 160? Spec says 175. Re-reading: "7 runes → 175 G
  base premium". 7 × 25 = 175. So with 7 you only get blocks of
  exactly 3 at a time but the example shows no block applied at all.
  Actually re-reading the rule: "A building block of 3 alike
  components is offered at a special base premium of 60 G." This is
  an **offer**, not automatic. The spec's 7-rune example shows the
  customer gets 175 G (= 7 × 25), meaning the block only applies
  when there are **exactly** 3 — it does not auto-decompose larger
  counts. This is consistent with the 4-rune case: "no block —
  block requires exactly 3".)

### E-alike — "Alike" components (❓ resolved)

- 2 runes + 1 moonstone → base 75 G (3 × 25; no block — different
  types)
- 3 runes + 3 moonstones → base 120 G (two separate blocks: 60 + 60)

### E-scope — Modifier scope on multi-item policies

- cursed sword (base 100) + plain amulet (base 60):
  - policy base = 160 G
  - + cursed surcharge = 50 G (50 % of 100, **not** of 160)
  - = 210 G before further modifiers and the fee

### E-thresh — Modifier thresholds

- yearsWithMHPCO = 2 → loyalty discount applies.
- sword with enchantment = 5 → high-enchantment surcharge applies.
- sword with enchantment = 5 and cursed → both surcharges apply.
- sword with enchantment = 4 → no high-enchantment surcharge; curse
  surcharge applies only if cursed.
- dragon-material sword, enchantment = 8, damage 1000 G → payout
  400 G (high-enchantment 50 % rule wins over dragon-material, then
  deductible: 500 − 100).

### E-ded — Deductible per damage event

- Insured sword and amulet; dragon attack damages both; damages =
  `[{itemType:"sword", amount:500}, {itemType:"amulet", amount:300}]`
  → payout 600 G ((500−100) + (300−100)).

### E-std — Standard reimbursement

- Regular steel sword, enchantment 3, damage 500 → payout 400
  (500 − 100).
- Rune (insurance 250), damage 200 → payout 100 (200 − 100; no
  special clause for components).

### E-vs — Enchantment threshold vs. dragon material

- Dragon-material sword, enchantment 9, damage 1000 → payout 400
  (50 % wins: 500 − 100).
- Dragon-material sword, enchantment 5, damage 800 → payout 700
  (only dragon-material applies: full 800 − 100).
- Steel sword, enchantment 9, damage 1000 → payout 400 (only
  high-enchantment: 500 − 100).

### E-multi — Multiple items of the same type

- Two swords in one policy → insurance sum 2000 G, cap 4000 G.
- Two sword damages → two separate damages, each with its own
  100 G deductible.
- More sword damages than swords insured → CLI exits non-zero.

### E-cap — Cap exhaustion

- Sword + amulet policy → insurance sum 1600, cap 3200.
- Cursed sword (premium with modifiers 165) → cap 2000 (based on
  unmodified insurance value 1000; modifiers do not raise the cap).
- Sword + 3 runes block → insurance sum 1750 (1000 + 3 × 250);
  block discount does not reduce the insurance sum.
- Sword policy (insurance 1000, cap 2000); two successive claims of
  1500 each:
  - First claim → payout 1400 G (1500 − 100), remainingCap 600 G.
  - Second claim → payout 600 G (desired 1400 reduced to 600),
    remainingCap 0 G.

### E-round — Rounding in MHPCO's favor

- Premium calc yields 197.5 G → final premium 198 G (up).
- Payout calc yields 350.5 G → final payout 350 G (down).
- Intermediate values stay fractional; only final answer rounds.

### E-edge — Edge cases

- Empty items list → premium 5 G (fee only).
- Unknown item type in quote → CLI exits non-zero, stderr error,
  no `results` on stdout.
- Claim references item not in policy (or unknown type) → CLI exits
  non-zero, stderr error.
- Negative damage amount → CLI exits non-zero, stderr error.

### E-int1 — Newcomer with a cursed sword (integration)

- customer: 0 years, no previous contract
- item: cursed sword, steel, enchantment 3
- breakdown: 100 base + 50 curse + 10 first-insurance = 160; + 5 fee
  = **165 G premium**

### E-int2 — Long-standing customer's second contract (integration)

- customer: 3 years; this is the customer's **2nd** quote in the
  scenario
- item: cursed sword, steel, enchantment 7
- breakdown: 100 base + 50 curse + 30 high-enchantment − 20 loyalty
  + 10 first-insurance − 15 follow-up = 155; + 5 fee = **160 G
  premium**
- (❓ resolved: the first-insurance surcharge always applies per
  item, regardless of customer history.)

---

## Open / Resolved Questions (❓)

- **What counts as "alike"?** Resolved: same type. `rune` and
  `moonstone` are distinct.
- **Modifier scope on multi-item policies?** Resolved: item-specific
  modifiers act on the item's base premium; policy-wide modifiers
  (loyalty, follow-up) act on the sum of item base premiums; fee at
  the end.
- **What if a customer brings two of the same item?** Resolved:
  multiple items of the same type stack their insurance values; each
  damage entry has its own deductible; more damage entries of a type
  than items insured → CLI rejects the claim.
- **Does "first insurance" mean first ever, or per item?** Resolved:
  per item in a quote, always.

---

## Per-test rationale

Order: simplest → most complex; pure domain first, then CLI surface
last. Each test name in `src/claim-office.spec.ts` maps 1:1 to the
table below.

### Quote — base premiums (R1, E-block, E-alike)

1. Empty items list returns premium 5 (fee only). — E-edge.
2. Quote for a single plain sword returns premium 115 (100 base + 10
   first-insurance + 5 fee). — R1 + R3.
3. Quote for a single plain amulet returns premium 71 (60 + 6 + 5;
   rounded up from 71). — R1 + R3 + R6.
   - 60 base + 10 % first ins = 66; + 5 fee = 71. (Integer already.)
4. Quote for a single plain staff returns premium 93 (80 + 8 + 5). —
   R1 + R3.
5. Quote for a single plain potion returns premium 49 (40 + 4 + 5). —
   R1 + R3.

### Quote — components and blocks (R1, R2, E-block, E-alike)

6. 2 runes → base 50 G → premium 60 G (50 + 5 first-ins + 5 fee). —
   E-block (2 runes).
7. 3 runes → base 60 G (block) → premium 71 G (60 + 6 + 5). — E-block.
8. 4 runes → base 100 G (no block) → premium 115 G (100 + 10 + 5). —
   E-block.
9. 7 runes → base 175 G → premium 198 G (175 + 17.5 + 5 = 197.5 → up
   to 198). — E-block + E-round.
10. 2 runes + 1 moonstone → base 75 G → premium 88 G (75 + 7.5 + 5
    = 87.5 → up to 88). — E-alike (different types).
11. 3 runes + 3 moonstones → base 120 G (two separate blocks: 60+60)
    → premium 137 G (120 + 12 + 5 = 137). — E-alike (two blocks).

### Quote — modifiers (R3, R4, R5, E-scope, E-thresh)

12. Cursed sword (steel, enchantment 3), customer 0 years, 1st
    contract → premium 165 G. — E-int1.
13. Sword with enchantment exactly 5 → high-enchantment surcharge
    applies; premium for a steel sword enchantment 5, 0 years, 1st
    contract = 100 + 30 + 10 + 5 = 145 G. — E-thresh.
14. Sword with enchantment 4 → no high-enchantment surcharge;
    premium 115 G (100 + 10 + 5). — E-thresh.
15. Cursed sword with enchantment 5 → both surcharges apply; 0 years,
    1st contract: 100 + 50 + 30 + 10 + 5 = 195 G. — E-thresh.
16. Long-standing customer (yearsWithMHPCO = 2) on first contract for
    a plain sword: policy base 100, +10 first ins (per item) = 110;
    loyalty −20 % of 100 (policy base) = −20; total = 90; + 5 fee =
    95 G. — R5 (loyalty threshold exactly 2).
17. Multi-item policy: cursed sword (base 100) + plain amulet (base
    60), customer 0 years, 1st contract → 100 + 60 = 160 policy
    base; cursed +50; first-ins per item = +10 + 6 = +16; total 226;
    + 5 fee = 231 G. — E-scope.

### Quote — long-standing customer's second contract (integration)

18. Cursed sword (steel, enchantment 7), customer 3 years, 2nd
    contract in scenario → premium 160 G. — E-int2 + ❓.

### Quote — rounding (R6, E-round)

19. A premium calculation yielding 197.5 G is rounded up to 198 G. —
    E-round (covered by test 9 above; explicit rounding sanity here
    if needed).

### Claim — single-item, no special clauses (R7, E-std, E-ded)

20. Regular steel sword (enchantment 3), policy from a fresh quote,
    damage 500 G → payout 400 G, remainingCap = 2000 − 400 = 1600 G.
    — E-std.
21. A rune (insurance value 250 G), damage 200 G → payout 100 G,
    remainingCap = 500 − 100 = 400 G. — E-std.
22. Sword + amulet policy, dragon attack damages both:
    damages = sword 500 + amulet 300 → payout 600 G; remainingCap =
    3200 − 600 = 2600. — E-ded.

### Claim — special clauses (R7, E-vs, E-thresh)

23. Dragon-material sword, enchantment 9, damage 1000 → payout 400
    (50 % wins, then deductible). — E-vs.
24. Dragon-material sword, enchantment 5, damage 800 → payout 700
    (only dragon-material clause; full reimbursement then
    deductible). — E-vs.
25. Steel sword, enchantment 9, damage 1000 → payout 400 (50 % then
    deductible). — E-vs.
26. Dragon-material sword, enchantment exactly 8, damage 1000 →
    payout 400 (high-enchantment clause applies at exactly 8). —
    E-thresh.

### Claim — cap (R7, E-cap)

27. Sword policy (cap 2000), first claim of 1500 → payout 1400,
    remainingCap 600. — E-cap.
28. Same policy, second claim of 1500 → payout 600 (reduced to
    remaining cap), remainingCap 0. — E-cap.
29. Insurance sum / cap derivation: sword + amulet → insurance sum
    1600, cap 3200 (verified through a claim that exceeds 1600 but
    not 3200). — E-cap.
30. Block discount does **not** lower cap: sword + 3 runes →
    insurance sum 1750, cap 3500 (verified through a large claim).
    — E-cap.

### Claim — payout rounding (R6, E-round)

31. A payout calculation yielding 350.5 G is rounded **down** to 350
    G (dragon-material sword half-enchantment-not-applicable scenario
    constructed to produce 350.5). — E-round.
    - Construction: dragon-material sword, enchantment 9 (50 %
      rule), damage 901 → 450.5 − 100 = 350.5 → 350.

### Claim — multiple items of the same type (E-multi)

32. Policy with two swords → insurance sum 2000, cap 4000 (verified
    via a claim that exceeds 2000 but not 4000). — E-multi.
33. Policy with two swords, two sword damages of 500 each → payout
    800 (each damage gets its own 100 deductible). — E-multi.

### CLI surface — successful scenarios (interface contract)

34. CLI reads the schema example from stdin and writes a `results`
    array with one quote result and one claim result, in order. —
    Interface contract.
35. CLI integration: newcomer with a cursed sword → results contain
    `{ premium: 165 }`. — E-int1 via CLI.
36. CLI integration: long-standing customer's two quotes — first
    quote then second quote — produces `[ {premium: ...}, {premium:
    160} ]` for E-int2. — E-int2 via CLI.

### CLI surface — error cases (R8, E-edge, E-multi)

37. CLI: quote with unknown item type (`{type:"broomstick"}`) →
    exits non-zero, writes error to stderr, writes nothing (or no
    `results`) to stdout. — E-edge.
38. CLI: claim references an item type not in the policy (amulet
    when only a sword is insured) → exits non-zero, error to
    stderr. — E-edge.
39. CLI: claim references an unknown item type → exits non-zero,
    error to stderr. — E-edge.
40. CLI: claim has more damage entries of a type than items insured
    (two sword damages but only one sword) → exits non-zero, error
    to stderr. — E-multi.
41. CLI: claim contains a damage entry with `amount: -200` → exits
    non-zero, error to stderr. — E-edge.
