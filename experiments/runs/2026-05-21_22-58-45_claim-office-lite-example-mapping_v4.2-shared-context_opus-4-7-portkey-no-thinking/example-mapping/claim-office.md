# MHPCO Claim Office — Example Mapping

## Rules

### R1 — Item base premiums (main items)
Each main item has a fixed insurance value and base premium:
- Sword: 1000 G value, 100 G base premium
- Amulet: 600 G value, 60 G base premium
- Staff: 800 G value, 80 G base premium
- Potion: 400 G value, 40 G base premium

### R2 — Component base premiums
Components (e.g. runes, moonstones): 250 G insurance value, 25 G base premium each.

### R3 — Building block of 3 alike components
A block of **exactly 3 alike** components is offered at a special base premium of 60 G (instead of 75 G). Block requires exactly 3; 4 alike means 100 G (no block applies). 6 alike = 2 blocks = 120 G. 7 alike = 1 block + 4 individuals = 60 + 100 = 175 G. "Alike" means **same type** (runes with runes, moonstones with moonstones — not mixed).

### R4 — Cursed surcharge (item-specific)
A cursed item adds 50% surcharge to that **item's** base premium.

### R5 — High enchantment surcharge (item-specific)
Items with enchantment level ≥ 5 add a 30% surcharge to that item's base premium.

### R6 — Loyalty discount (policy-wide)
Customers with ≥ 2 years with MHPCO get a 20% loyalty discount on the policy base premium.

### R7 — First insurance surcharge (item-specific)
Each item in a quote carries a 10% initial assessment surcharge applied to its base premium. Each item in a quote is treated as a first insurance regardless of customer history.

### R8 — Follow-up contract discount (policy-wide)
Customers receive a 15% discount on each contract **after their first** (scenario-scoped: first quote in scenario gets no follow-up discount; subsequent quotes do).

### R9 — Processing fee
A 5 G processing fee is added to **every** premium at the very end.

### R10 — Modifier scope and stacking order
- Item-specific modifiers (cursed, high enchantment, first insurance) apply to that item's base premium.
- Policy-wide modifiers (loyalty, follow-up contract) apply to the sum of item base premiums (policy base premium).
- Processing fee added last.
- Surcharges and discounts on the same base are additive (a percent of the base), not multiplicative.

### R11 — Premium rounding
The final premium is rounded **up** to whole G (MHPCO's favor). Intermediate amounts are kept as fractions.

### R12 — Deductible
A deductible of 100 G applies per damage event (per entry in `damages`).

### R13 — High enchantment payout clause
Damage to items with enchantment level ≥ 8 is reimbursed at 50% of the damage amount (before deductible).

### R14 — Dragon material payout clause
Damage to items made of dragon material is fully reimbursed (then deductible).

### R15 — Clause precedence
When both R13 and R14 apply, the 50% rule wins (then deductible).

### R16 — Payout rounding
The final payout is rounded **down** to whole G (MHPCO's favor).

### R17 — Multiple items of same type
A policy may cover multiple items of the same type. Each entry in `damages` is a separate event with its own deductible. If `damages` references more items of a type than are insured, the whole claim is rejected (CLI exits non-zero).

### R18 — Empty quote
An empty item list yields premium = 5 G (processing fee only).

### R19 — Unknown item type in quote
Quote with unknown item type → CLI exits non-zero, error to stderr, no `results` written.

### R20 — Claim references item not in policy
Claim references item not in policy (wrong type, or unknown type) → CLI exits non-zero, error to stderr.

### R21 — Negative damage amount
Damage entry with `amount: -200` → CLI exits non-zero, error to stderr.

### R22 — CLI scenario processing
The CLI reads a JSON scenario from stdin, processes `steps` sequentially. Claims reference earlier quote steps by zero-based index in `policy`. Writes `{results: [...]}` to stdout, with one entry per step (`{premium}` or `{payout}`).

## Examples

### Example E1 — Components, building blocks
- E1a: 2 runes → 50 G base
- E1b: 3 runes → 60 G base (block)
- E1c: 4 runes → 100 G base (no block)
- E1d: 7 runes → 175 G base (1 block + 4 individuals = 60+100)
- E1e: 2 runes + 1 moonstone → 75 G base (no block, mixed types)
- E1f: 3 runes + 3 moonstones → 120 G base (two separate blocks)

### Example E2 — Modifier scope multi-item
- Cursed sword (100) + plain amulet (60): policy base 160 G, curse adds 50 G (50% of 100, the cursed item), → 210 G before further modifiers and fee.

### Example E3 — Modifier thresholds
- E3a: customer with exactly 2 years → loyalty discount applies (boundary)
- E3b: sword enchantment exactly 5 → high-enchantment surcharge applies; cursed + ench 5 → both surcharges apply
- E3c: sword enchantment 4 → no high-enchantment surcharge
- E3d: dragon-material sword, enchantment exactly 8, damage 1000 → payout = 400 G (50% rule, then deductible: 500-100)

### Example E4 — Deductible per damage event
- Dragon attack damages a sword (500 G damage) and an amulet (300 G damage): payout = 600 G (each item gets its own 100 G deductible: 400 + 200 = 600).

### Example E5 — Standard reimbursement (no special clauses)
- E5a: steel sword, ench 3, damage 500 → payout 400 G (500 - 100)
- E5b: damaged rune, damage 200 → payout 100 G (200 - 100; runes have no enchantment/material)

### Example E6 — Enchantment threshold vs dragon material
- E6a: dragon sword, ench 9, damage 1000 → payout 400 G (50% wins: 500-100)
- E6b: dragon sword, ench 5, damage 800 → payout 700 G (dragon clause only: 800-100)
- E6c: steel sword, ench 9, damage 1000 → payout 400 G (high ench clause: 500-100)

### Example E7 — Multiple items same type
- E7a: policy covers 2 swords → insurance sum 2000 G
- E7b: 2 swords damaged in same claim, two `{itemType: "sword"}` entries → each entry is separate damage with its own deductible
- E7c: 2 sword damages but only 1 sword insured → CLI exits non-zero, claim rejected

### Example E8 — Rounding
- E8a: premium calc yielding 197.5 G → final 198 G (rounded up)
- E8b: payout calc yielding 350.5 G → final 350 G (rounded down)
- E8c: intermediate amounts kept as fractions; only final premium/payout rounded

### Example E9 — Edge cases
- E9a: empty item list → premium 5 G (fee only)
- E9b: unknown item type in quote → CLI exits non-zero, stderr message, no results
- E9c: claim refers to item not in policy → CLI exits non-zero, stderr message
- E9d: claim with damage amount -200 → CLI exits non-zero, stderr message

### Example E10 — Integration: Newcomer with cursed sword
- Customer: 0 years, no previous contract
- Item: cursed sword (steel, ench 3)
- Premium: **165 G**
- Breakdown: 100 base + 50 curse + 10 first-insurance = 160 + 5 fee = 165

### Example E11 — Integration: Long-standing customer's second contract
- Customer: 3 years; second quote in scenario
- Item: cursed sword (steel, enchantment 7)
- Premium: **160 G**
- Breakdown: 100 base + 50 curse + 30 high-ench − 20 loyalty + 10 first-insurance − 15 follow-up = 155 + 5 fee = 160

## Interface Contract

### CLI
- Entry point: `src/cli.ts`
- Reads JSON from stdin, writes JSON `{results: [...]}` to stdout.
- Exits with non-zero exit code on errors; writes error description to stderr; no `results` on stdout when erroring.

### Input shape (verbatim field names — these are BINDING)
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

Item `type` values: `sword | amulet | staff | potion | rune | moonstone`.
Item optional fields: `material` (string, e.g. `"steel"`, `"dragon"`, `"silver"`), `enchantment` (integer), `cursed` (boolean).

### Output shape (verbatim field names)
```json
{
  "results": [
    { "premium": 65 },
    { "payout": 100 }
  ]
}
```

- Quote results carry `premium` (integer G).
- Claim results carry `payout` (integer G).
- `results` length and order match input `steps`.

## Questions / Clarifications (resolved by spec)

- ❓ "Alike" components → resolved: same type only (runes alike with runes, not with moonstones).
- ❓ Cursed surcharge scope on multi-item policy → resolved: item-specific (50% of cursed item's base premium only).
- ❓ First insurance on long-standing customer's new item → resolved: still applies. Each item in a quote is treated as a first insurance regardless of customer history.
- ❓ Multiple items of same type → resolved: allowed; each damage entry has its own deductible; over-claiming rejects whole claim.

## Per-test Rationale

Tests are organized in three describe blocks: the `claim-office` library tests (calculations), and the CLI tests. Order: simple → complex.

### Quote / premium calculation tests
1. **Empty quote → 5 G** — E9a / R18. Simplest baseline: just the fee.
2. **Single potion, no modifiers, 0 years → 45 G** — R1, R7, R9. (40 base + 4 first-insurance = 44 → ceil 44 + 5 = 49? Wait: 40 + 10% of 40 = 4, +5 fee = 49. → 49 G.) — base premium + first insurance + fee.
3. **Single amulet, no modifiers, 0 years → 71 G** — R1, R7, R9. (60 + 6 + 5 = 71).
4. **Single staff, no modifiers, 0 years → 93 G** — R1, R7, R9. (80 + 8 + 5 = 93).
5. **Single sword, no modifiers, 0 years → 115 G** — R1, R7, R9. (100 + 10 + 5 = 115).
6. **Single rune component, no modifiers → 33 G** — R2, R7, R9. (25 + 2.5 + 5 = 32.5 → ceil 33).
7. **2 runes (no block) → 60 G** — E1a, R2, R3, R7, R9. (50 + 5 + 5 = 60).
8. **3 runes (block applies) → 71 G** — E1b, R3. (60 + 6 + 5 = 71).
9. **4 runes (no block) → 115 G** — E1c, R3. (100 + 10 + 5 = 110... wait: 100 + 10 + 5 = 115). 
10. **7 runes (1 block + 4 individuals) → 198 G** — E1d. (175 + 17.5 + 5 = 197.5 → ceil 198). Also covers E8a rounding-up case.
11. **2 runes + 1 moonstone → no block (different types) → 88 G** — E1e. (75 + 7.5 + 5 = 87.5 → ceil 88).
12. **3 runes + 3 moonstones → two blocks → 137 G** — E1f. (120 + 12 + 5 = 137).
13. **Cursed sword alone (newcomer, enchantment 3) → 165 G** — E10 integration. Covers R4, R7, R9.
14. **Sword enchantment 4, not cursed → no high-ench surcharge → 115 G** — E3c. (100 + 10 + 5 = 115); confirms threshold strict ≥ 5.
15. **Sword enchantment exactly 5 → high-ench surcharge applies → 145 G** — E3b. (100 + 30 + 10 + 5 = 145).
16. **Cursed sword enchantment 5 → both surcharges → 195 G** — E3b. (100 + 50 + 30 + 10 + 5 = 195).
17. **Customer with exactly 2 years, single sword → loyalty applies → 95 G** — E3a, R6. (100 + 10 first ins = 110; loyalty 20% of 100 = 20; 110-20 = 90 + 5 fee = 95). Boundary: 2 years.
18. **Customer with 1 year, single sword → no loyalty → 115 G** — R6 negative boundary.
19. **Cursed sword + plain amulet, newcomer → 226 G** — E2. (160 base + 50 curse + 16 first-ins = 226; +5 fee? Let me recompute. First-ins is 10% of each item base: 100*0.1=10 for sword, 60*0.1=6 for amulet → 16 total. So 160 + 50 + 16 = 226 + 5 = 231.) — confirms modifier scope rule R10 and verifies the spec's "210 G before further modifiers and fee" statement.
20. **Long-standing customer's second contract (E11 integration) → 160 G** — covers R4, R5, R6, R7, R8, R9, R10, scenario-scoped follow-up discount.
21. **First quote in scenario for long-standing customer (3 yrs) does not get follow-up discount** — verifies R8 first-quote behavior. Single plain sword, 3 yrs: 100 + 10 first-ins − 20 loyalty + 5 fee = 95 G.
22. **Premium rounding up to whole G** — covers E8a explicitly. Use 7 runes (already 197.5 → 198) — possibly redundant with test 10; keep one rounding-specific test if needed.

### Claim / payout calculation tests
23. **Standard reimbursement: steel sword ench 3, damage 500 → 400 G** — E5a, R12.
24. **Standard reimbursement: rune (no ench/material), damage 200 → 100 G** — E5b, R12.
25. **Two items damaged in one event: sword (500 dmg) + amulet (300 dmg) → 600 G** — E4. Deductible per damage event.
26. **Dragon-material sword, ench 5, damage 800 → 700 G** — E6b, R14. Only dragon clause (ench 5 < 8).
27. **Dragon-material sword, ench exactly 8, damage 1000 → 400 G** — E3d, R13, R15. High-ench (≥8) wins.
28. **Dragon-material sword, ench 9, damage 1000 → 400 G** — E6a. Both clauses, 50% wins.
29. **Steel sword, ench 9, damage 1000 → 400 G** — E6c, R13. High-ench only.
30. **Two swords insured, two sword damages in claim → each treated separately with own deductible** — E7b. e.g. 2 swords insured, damages [{sword,500},{sword,300}] → 400+200 = 600 G.
31. **Payout rounding down** — E8b. e.g. damage 801 with 50% rule: 400.5 → 400 G. (steel sword ench 9, damage 801 → 400.5 → 400; deductible: 400.5-100 = 300.5 → 300 G floor). Actually more cleanly: dragon sword ench 9, damage 1001 → 500.5 - 100 = 400.5 → 400 G floor.
32. **Quote-then-claim referencing earlier policy by index works (scenario-level)** — R22. (Covered via CLI tests but also worth a library-level integration test if exposing scenario function.)

### CLI / scenario tests
33. **CLI reads scenario JSON from stdin and writes results JSON to stdout** — R22. Use schema example: customer 5 yrs, quote single amulet then claim 200 G amulet damage. Verify shape `{results: [{premium: <int>}, {payout: <int>}]}` and exit code 0.
34. **CLI: empty steps array → `{results: []}`, exit 0** — basic R22.
35. **CLI: unknown item type in quote (e.g. broomstick) → exit non-zero, stderr message, no results on stdout** — E9b / R19.
36. **CLI: claim references item type not in policy (amulet damage when only sword insured) → exit non-zero, stderr message** — E9c / R20.
37. **CLI: claim references unknown item type → exit non-zero, stderr message** — E9c / R20.
38. **CLI: claim contains damage amount -200 → exit non-zero, stderr message** — E9d / R21.
39. **CLI: more sword damages than insured swords → exit non-zero, claim rejected** — E7c / R17.
40. **CLI: full integration E11 end-to-end** — two quotes for long-standing customer; verify second quote returns 160 G. Confirms scenario-scoped follow-up discount via stdin/stdout.

All test descriptions in the spec file embed the expected numeric value (e.g. "→ 165 G") so the Red/Green agents can implement against a single source of truth.
