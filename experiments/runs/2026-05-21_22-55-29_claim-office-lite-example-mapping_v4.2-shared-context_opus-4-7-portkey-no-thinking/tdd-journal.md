# TDD Journal

## Cycle 1 — Red: empty items quote: newcomer with no items → premium 5 G (processing fee only)
- Compilation prediction: Cannot find module './claim-office.js' — Correct
- Runtime prediction: Expected { results: [{ premium: 5 }] }, received { results: [] } — Correct
- Discrepancies: none

## Cycle 1 — Green: empty items quote: newcomer with no items → premium 5 G (processing fee only)
- Minimal implementation: hardcoded return { results: [{ premium: 5 }] }
- Tests passing: 1

## Cycle 2 — Red: single plain amulet, yearsWithMHPCO 0 → premium 71 G
- Compilation prediction: No compilation error expected (runScenario already exists with `unknown` parameter type from cycle 1) — Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 5 }] } (hardcoded value from cycle 1) — Correct
- Discrepancies: none

## Cycle 2 — Green: single plain amulet, yearsWithMHPCO 0 → premium 71 G
- Minimal implementation: added BASE_PREMIUM lookup (amulet:60), per-step computation of policyBase + 10% first-insurance + 5 fee, rounded up
- Tests passing: 2

## Cycle 3 — Red: single plain sword, yearsWithMHPCO 0 → premium 115 G
- Compilation prediction: No compilation error expected (runScenario signature already covers this; QuoteItem accepts string `type` and tolerates extra properties at runtime) — Correct
- Runtime prediction: Expected { results: [{ premium: 115 }] }, received { results: [{ premium: 5 }] } (BASE_PREMIUM has no "sword" entry, so policyBase falls through to 0 → premium = ceil(0 + 0 + 5) = 5) — Correct
- Discrepancies: none

## Cycle 3 — Green: single plain sword, yearsWithMHPCO 0 → premium 115 G
- Minimal implementation: added `sword: 100` entry to BASE_PREMIUM lookup
- Tests passing: 3

## Cycle 4 — Red: newcomer with cursed sword (steel, ench 3) → premium 165 G
- Compilation prediction: No compilation error expected (QuoteItem extra properties already tolerated; runScenario signature unchanged) — Correct
- Runtime prediction: Expected { results: [{ premium: 165 }] }, received { results: [{ premium: 115 }] } (impl ignores `cursed` flag, so cursed sword priced as plain sword: 100 base + 10 first + 5 fee = 115) — Correct
- Discrepancies: none

## Cycle 4 — Green: newcomer with cursed sword (steel, ench 3) → premium 165 G
- Minimal implementation: added optional `cursed?: boolean` to QuoteItem and a curseSurcharge accumulator (sum of 50% × base for cursed items), added into premium total before fee
- Tests passing: 4

## Cycle 5 — Red: newcomer with plain sword at exactly enchantment 5 → premium 145 G
- Compilation prediction: No compilation error expected (vitest does not type-check at runtime; QuoteItem tolerates extra literal properties as prior tests with `enchantment: 3` already demonstrate; `runScenario` signature unchanged) — Correct
- Runtime prediction: Expected { results: [{ premium: 145 }] }, received { results: [{ premium: 115 }] } (impl ignores `enchantment`, so plain sword priced as 100 base + 10 first + 5 fee = 115) — Correct
- Discrepancies: none

## Cycle 5 — Green: newcomer with plain sword at exactly enchantment 5 → premium 145 G
- Minimal implementation: added optional `enchantment?: number` to QuoteItem and high-enchantment branch in `itemSurcharges` (+30% of base when enchantment >= 5); named constants `HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3` and `HIGH_ENCHANTMENT_THRESHOLD = 5`
- Tests passing: 5

## Cycle 6 — Red: newcomer with plain sword at enchantment 4 (below threshold) → premium 115 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; `enchantment: 4` matches optional `enchantment?: number`; extra `material` property tolerated at runtime) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl correctly applies `enchantment >= HIGH_ENCHANTMENT_THRESHOLD (5)`, so 4 yields no surcharge: 100 + 0 + 10 + 5 = 115 G — Correct
- Discrepancies: none (this is a regression/threshold-pinning test that locks in cycle 5's `>= 5` boundary; no implementation change required)

## Cycle 7 — Red: newcomer with cursed sword at exactly enchantment 5 → premium 195 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem already accepts `cursed: true` and `enchantment: 5`; extra `material` property tolerated at runtime) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `itemSurcharges` independently sums curse (100 × 0.5 = 50) and high-enchantment (100 × 0.3 = 30), so total = 100 + 50 + 30 + 10 first + 5 fee = 195 G — Correct
- Discrepancies: none (this is a composition/regression test that pins additive interaction of cycle 4's curse and cycle 5's high-enchantment surcharges at the ench-5 threshold; no implementation change required)

## Cycle 8 — Red: long-standing customer (yearsWithMHPCO 3), single plain sword, only quote → premium 95 G
- Compilation prediction: No compilation error expected (Scenario already requires customer.yearsWithMHPCO: number; runScenario signature unchanged; QuoteItem fields all accepted) — Correct
- Runtime prediction: Expected { results: [{ premium: 95 }] }, received { results: [{ premium: 115 }] } (impl ignores yearsWithMHPCO, so loyalty discount not applied: 100 base + 10 first + 5 fee = 115) — Correct
- Discrepancies: none

## Cycle 8 — Green: long-standing customer (yearsWithMHPCO 3), single plain sword, only quote → premium 95 G
- Minimal implementation: threaded `yearsWithMHPCO` into `priceQuoteStep` and subtracted `loyaltyDiscount = policyBase * 0.2` when `yearsWithMHPCO >= 2`; added `LOYALTY_DISCOUNT_RATE` and `LOYALTY_THRESHOLD_YEARS` constants
- Tests passing: 8

## Cycle 9 — Red: customer at exactly yearsWithMHPCO 2 (loyalty threshold), single plain sword → premium 95 G
- Compilation prediction: No compilation error expected (Scenario already requires customer.yearsWithMHPCO: number; runScenario signature unchanged; QuoteItem fields all accepted; shape identical to cycle 8's test) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl uses `yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS (2)`, so yearsWithMHPCO=2 satisfies the threshold: 100 base + 10 first − 20 loyalty + 5 fee = 95 G — Correct
- Discrepancies: none (this is a threshold-pinning/regression test that locks in cycle 8's `>= 2` boundary; no implementation change required)

## Cycle 10 — Red: long-standing customer's second quote, cursed ench 7 sword → premium 160 G (integration: loyalty + curse + high-ench + first-insurance + follow-up)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem already accepts cursed/enchantment/material; Scenario already permits multiple quote steps) — Correct
- Runtime prediction: Expected { premium: 160 } for results[1], received { premium: 175 } (current impl computes: policyBase 100 + curse 50 + high-ench 30 + first-insurance 10 − loyalty 20 + fee 5 = 175; missing the −15 follow-up discount which is 15% × 100 = 15, so 175 − 15 = 160) — Correct
- Discrepancies: none

## Cycle 10 — Green: long-standing customer's second quote, cursed ench 7 sword → premium 160 G
- Minimal implementation: added FOLLOW_UP_DISCOUNT_RATE = 0.15; threaded `isFollowUp` boolean (step index > 0) into priceQuoteStep and subtracted `policyBase * FOLLOW_UP_DISCOUNT_RATE` when isFollowUp
- Tests passing: 10

## Cycle 11 — Red: multi-item policy, newcomer: cursed sword + plain amulet → premium 231 G (E3 modifier scope)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem accepts type/cursed/enchantment; items: QuoteItem[] already accepts multiple entries) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl uses sumOver to aggregate per-item base and per-item surcharges, with policy-wide first-insurance computed on policyBase = 160; so 160 base + 50 curse + 16 first + 5 fee = 231 — Correct
- Discrepancies: none (regression/integration test pinning E3 modifier scope: item-specific surcharges per-item, policy-wide modifiers on policyBase)

## Cycle 12 — Red: 2 runes, newcomer → premium 60 G (50 base + 5 first-insurance + 5 fee)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"rune"` is accepted; cursed/enchantment are optional so `{ type: "rune" }` is valid) — Correct
- Runtime prediction: Expected { results: [{ premium: 60 }] }, received { results: [{ premium: 5 }] } (BASE_PREMIUM has no "rune" entry, so itemBasePremium returns 0 for each rune → policyBase = 0, surcharges = 0, firstInsurance = 0, premium = ceil(0 + 0 + 0 + 5) = 5) — Correct
- Discrepancies: none

## Cycle 12 — Green: 2 runes, newcomer → premium 60 G
- Minimal implementation: added `rune: 25` entry to BASE_PREMIUM lookup
- Tests passing: 12

## Cycle 13 — Red: 3 runes (block applies), newcomer → premium 71 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"rune"` is accepted; cursed/enchantment optional; identical shape to cycle 12) — Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 88 }] } (current impl: 3 × 25 = 75 base; + 7.5 first + 5 fee = 87.5; ceil → 88; no block-discount logic exists yet) — Correct
- Discrepancies: none

## Cycle 13 — Green: 3 runes (block applies), newcomer → premium 71 G
- Minimal implementation: in `priceQuoteStep`, count items of type "rune"; if exactly 3, subtract 15 from policyBase (75 → 60 block adjustment). Handles only the exact-3-rune case per prompt guidance.
- Tests passing: 13

## Cycle 14 — Red: 4 runes (no block — exactly 3 required), newcomer → premium 115 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"rune"` is accepted; cursed/enchantment optional; identical shape to cycles 12-13) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl applies block discount only when `runeCount === RUNE_BLOCK_SIZE (3)`; with 4 runes runeBlockAdjustment = 0, so policyBase = 4 × 25 = 100; firstInsurance = 10; premium = ceil(100 + 0 + 10 + 5) = 115 — Correct
- Discrepancies: none (threshold-pinning/regression test locking in cycle 13's exact-3 boundary; no implementation change required)

## Cycle 15 — Red: 7 runes (no block — exactly 3 required), newcomer → premium 198 G (round UP from 197.5)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"rune"` is accepted; cursed/enchantment optional; identical shape to cycles 12-14 with more rune entries) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl applies block discount only when `runeCount === RUNE_BLOCK_SIZE (3)`; with 7 runes runeBlockAdjustment = 0, so policyBase = 7 × 25 = 175; firstInsurance = 17.5; raw total = 175 + 0 + 17.5 + 5 = 197.5; `roundUpInFavorOfOffice` ceils to 198 — Correct
- Discrepancies: none (dual-purpose regression test: (a) reconfirms "block requires exactly 3" for the 7-rune case, (b) exercises the round-up branch of `roundUpInFavorOfOffice` on a fractional total, pinning the MHPCO-favor rounding rule)

## Cycle 16 — Red: 2 runes + 1 moonstone (different types, no block), newcomer → premium 88 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"moonstone"` is accepted; cursed/enchantment optional; identical shape to cycles 12-15) — Correct
- Runtime prediction: Expected { results: [{ premium: 88 }] }, received { results: [{ premium: 60 }] } (BASE_PREMIUM has no "moonstone" entry, so itemBasePremium returns 0 for moonstone; policyBase = 25+25+0 = 50; runeCount=2, no block adjustment; firstInsurance = 5; total = 50+0+5+5 = 60) — Correct
- Discrepancies: none

## Cycle 16 — Green: 2 runes + 1 moonstone (different types, no block), newcomer → premium 88 G
- Minimal implementation: added `moonstone: 25` entry to BASE_PREMIUM lookup
- Tests passing: 16

## Cycle 17 — Red: 3 runes + 3 moonstones (two separate blocks), newcomer → premium 137 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so both `"rune"` and `"moonstone"` accepted; cursed/enchantment optional; identical shape to cycles 12-16) — Correct
- Runtime prediction: Expected { results: [{ premium: 137 }] }, received { results: [{ premium: 154 }] } (current impl: sumOver→150 base; runeCount=3 triggers runeBlockAdjustment=-15 → policyBase=135; NO moonstone block logic, so 3 moonstones priced at raw 75; firstInsurance=13.5; total=135+0+13.5+5=153.5; ceil→154) — Correct
- Discrepancies: none

## Cycle 17 — Green: 3 runes + 3 moonstones (two separate blocks), newcomer → premium 137 G
- Minimal implementation: generalized rune-only block to a per-type loop over `COMPONENT_TYPES = ["rune", "moonstone"]`; replaced `RUNE_BLOCK_SIZE/RUNE_BLOCK_PRICE/RUNE_BLOCK_ADJUSTMENT` with `COMPONENT_BLOCK_SIZE=3`/`COMPONENT_BLOCK_PRICE=60`; per-type adjustment computed when count === 3
- Tests passing: 17

## Cycle 18 — Red: two swords in a single quote, newcomer → premium 225 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"sword"` is accepted; `items` array already accepts multiple entries; extra `material` tolerated) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current impl `sumOver(step.items, itemBasePremium)` correctly stacks: 100 + 100 = 200 policyBase; no surcharges (plain swords); no loyalty (yearsWithMHPCO 0); no follow-up (single step); firstInsurance = 20; total = 200 + 0 + 20 + 5 = 225 — Correct
- Discrepancies: none (regression test pinning E8 item-stacking: multiple items of same type sum their base premiums; no implementation change required)

## Cycle 19 — Red: standard claim, steel sword ench 3, damage 500 → payout 400 G
- Compilation prediction: No compilation error expected (vitest does not type-check at runtime; consistent with prior cycles) — Correct
- Runtime prediction: Initial runtime: TypeError `Cannot read properties of undefined (reading 'reduce')` because runScenario blindly called priceQuoteStep for the claim step (step.items was undefined). After adding minimal stub (ClaimStep type, processClaimStep returning {payout: 0}, op-discriminated dispatch in runScenario), test now fails with assertion: Expected `{ payout: 400 }`, received `{ payout: 0 }` — Correct
- Discrepancies: none. Note: added new types (DamageEntry, ClaimStep, Step, ClaimResult, StepResult) and a `processClaimStep` stub returning {payout: 0} as the minimal scaffolding to convert TypeError → assertion failure; no payout logic yet

## Cycle 19 — Green: standard claim, steel sword ench 3, damage 500 → payout 400 G
- Minimal implementation: replaced `processClaimStep` stub with `sumOver(step.incident.damages, d => d.amount - DEDUCTIBLE_PER_DAMAGE)`; added `DEDUCTIBLE_PER_DAMAGE = 100` constant. No special-clause logic (high-enchantment, dragon-material); future tests will force those.
- Tests passing: 19

## Cycle 20 — Red: component claim — rune damage 200 → payout 100 G (standard, no special clause)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem.type is `string` so `"rune"` accepted; DamageEntry/ClaimStep already defined in cycle 19; identical claim-step shape to cycle 19) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `damagePayout` returns `damage.amount - DEDUCTIBLE_PER_DAMAGE` = 200 − 100 = 100; components have no enchantment/material so no special clause logic is needed — Correct
- Discrepancies: none (regression/pinning test that confirms components share the standard reimbursement path: full reimbursement minus deductible; no implementation change required)

## Cycle 21 — Red: high-enchantment only — steel sword ench 9, damage 1000 → payout 400 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; ClaimStep/DamageEntry shapes already defined; test mirrors cycle 19's claim-step structure with different enchantment/amount) — Correct
- Runtime prediction: Expected { payout: 400 }, received { payout: 900 } (current `damagePayout` ignores item enchantment — it only knows the DamageEntry, not the insured item — so it returns 1000 − 100 = 900; missing the high-enchantment 50% clause which requires looking up the insured item via step.policy index) — Correct
- Discrepancies: none. Note: this is the first claim test that forces `damagePayout` to know about the insured item's properties (enchantment ≥ 8). The Green phase will need to thread item lookup (via `step.policy` → quote step's items, matched by `itemType`) into the claim-processing path.

## Cycle 21 — Green: high-enchantment only — steel sword ench 9, damage 1000 → payout 400 G
- Minimal implementation: threaded `policyItems` (from `scenario.steps[step.policy]`) into `processClaimStep`; added `insuredItem` lookup by matching `item.type === damage.itemType`; extended `damagePayout(damage, insuredItem)` to apply 50% reimbursement rate when `enchantment >= 8` then subtract deductible. Added constants `HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8` and `HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5`. No dragon-material clause yet (deferred to its own test).
- Tests passing: 21

## Cycle 22 — Red: dragon-material only — dragon sword ench 5, damage 800 → payout 700 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem already tolerates extra `material` property at runtime — prior cycles already supplied `material: "steel"`/`"silver"`; vitest does not type-check) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `damagePayout` only applies the 50% clause when `enchantment >= 8`; with ench=5 (< 8), it falls through to full reimbursement: 800 − 100 = 700, which coincidentally matches the dragon-material-with-low-enchantment expected payout — Correct
- Discrepancies: none (regression/pinning test that locks in "for ench < 8, dragon-material yields the same result as the standard reimbursement path"; the dragon-material clause becomes observable only when the standard path would diverge — i.e. for non-dragon items with no enchantment surcharge, or when combined with a different reimbursement rate. Next test in spec — "both clauses apply (50% wins): dragon sword ench 9 → 400" — is also a pinning test of the existing high-ench branch. The dragon clause will only need explicit implementation if a future test exercises a case where standard ≠ dragon at ench < 8 — but per R3, full reimbursement is precisely what "no clause" already does, so dragon-material may never need an explicit branch. Architecture-notes documents this on the next refactor.)

## Cycle 23 — Red: both clauses apply (50% wins) — dragon sword ench 9, damage 1000 → payout 400 G
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem already tolerates extra `material` property at runtime; shape identical to cycles 21-22) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `damagePayout` applies the 50% clause when `enchantment >= 8`; with ench=9, reimbursement = 1000 × 0.5 = 500; payout = 500 − 100 = 400. The dragon-material clause is unimplemented, but the spec's "if both clauses apply, the 50% clause wins" rule means the existing high-ench branch already yields the correct answer — Correct
- Discrepancies: none (regression/pinning test confirming the "50% wins" rule from R3 in the case where both clauses would apply; dragon-material clause still has no explicit implementation, consistent with cycle 22's observation that it may never need a branch since R3's "neither clause → full reimbursement minus deductible" already equals the dragon-only behavior)

## Cycle 24 — Red: enchantment exactly 8 threshold — dragon sword ench 8, damage 1000 → payout 400 G (E4)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem tolerates extra `material` property at runtime; shape identical to cycles 21-23) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `damagePayout` uses `(insuredItem.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD (8)`; with ench=8 the `>=` boundary is satisfied: reimbursement = 1000 × 0.5 = 500; payout = 500 − 100 = 400 — Correct
- Discrepancies: none (threshold-pinning/regression test locking in cycle 21's `>= 8` boundary at the lower edge, mirroring how cycles 6/9/14 pin the >=5/>=2/===3 quote-side thresholds; no implementation change required. Confirms dragon-material clause still has no explicit code path needed since the 50% high-ench branch dominates whenever both clauses would otherwise apply.)

## Cycle 25 — Red: multi-damage event — sword damage 500 + amulet damage 300 → payout 600 G (E5 deductible per item)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; ClaimStep.incident.damages is already DamageEntry[] so multiple entries are natively supported; QuoteStep.items already accepts multiple items of different types; shape identical to cycles 19-24 with an extra damage entry and a second insured item) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `processClaimStep` uses `sumOver(step.incident.damages, ...)` so it natively iterates ALL damage entries; each entry resolves to its own insured item via `insuredItemFor` (matched by type), and `damagePayout` subtracts the deductible per-entry. For sword (ench 3 < 8): 500 − 100 = 400. For amulet (ench 2 < 8): 300 − 100 = 200. Sum = 600 — Correct
- Discrepancies: none (regression/pinning test locking in R3's "deductible per damage event" rule: cycle 19's `sumOver` already gives per-entry deductible naturally; this test pins that behavior so a future refactor cannot accidentally collapse to a single deductible-per-claim. Also implicitly verifies `insuredItemFor` correctly routes each damage to its matching insured item — the sword damage finds the sword, the amulet damage finds the amulet — which becomes important for upcoming multi-sword test (cycle 26) where multiple damages route to multiple instances of the SAME type.)

## Cycle 26 — Red: two swords insured, two sword damages (steel ench 3): 400 + 300 → payout 500 G (E8 each damage independent)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; ClaimStep.incident.damages already DamageEntry[] supporting multiple entries; QuoteStep.items already accepts multiple swords; shape identical to cycle 25 with two damages of the SAME type) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Current `sumOver` over damages iterates both entries; each calls `insuredItemFor` which uses `.find()` to return the FIRST matching sword. Both damages map to the same first sword (steel, ench 3, identical to the second) — but since the two insured swords have identical properties, the outcome is the same as if each damage matched its "own" sword: ench 3 < 8 → no high-ench clause; each payout = amount − 100. So 400 − 100 = 300 and 300 − 100 = 200, sum = 500 — Correct
- Discrepancies: none (regression test locking in E8 "each event independent with own deductible"; pins per-event deductible for SAME-type multi-damage. Subtle: `insuredItemFor` uses `.find()` so both damages currently resolve to the SAME insured item — this is invisible here because both swords are identical, but would matter if the two swords had different enchantment/material. The spec's cycle-33 over-claim rejection test ("more sword damages than swords insured") will force the consume/index logic that distinguishes which physical sword each damage applies to. For now, the existing `.find()` behavior is correct for the spec's examples since identical items yield identical payouts.)

## Cycle 27 — Red: payout rounded DOWN in MHPCO's favor — dragon sword ench 8, damage 901 → payout 350 G (350.5 rounded DOWN)
- Compilation prediction: No compilation error expected (runScenario signature unchanged; QuoteItem already tolerates extra `material` property at runtime; ClaimStep/DamageEntry shapes already defined; shape identical to cycle 24 with `amount: 901` instead of 1000) — Correct
- Runtime prediction: Expected { payout: 350 }, received { payout: 350.5 } (current `damagePayout` computes 901 × 0.5 − 100 = 350.5; `processClaimStep` returns the raw `sumOver` result without any rounding, so `payout = 350.5`; the symmetric `roundDownInFavorOfOffice` helper anticipated in architecture-notes cycle 12 does not exist yet) — Correct
- Discrepancies: none. Note: this is the first claim test that forces payout-side rounding (mirror of cycle 7's `roundUpInFavorOfOffice` for premiums). The Green phase will need to either (a) wrap `payout` in `Math.floor` inline at `processClaimStep`, or (b) introduce the symmetric `roundDownInFavorOfOffice(amount)` helper that architecture-notes cycle 12 has been anticipating. (b) is preferred since it pins the MHPCO domain rule at the call site and matches the existing `roundUpInFavorOfOffice` pattern from cycle 7.

## Cycle 27 — Green: payout rounded DOWN in MHPCO's favor — dragon sword ench 8, damage 901 → payout 350 G
- Minimal implementation: wrapped the `sumOver(...)` payout in `Math.floor(...)` inside `processClaimStep` (inline option (a) from Red prediction); deferred introducing the symmetric `roundDownInFavorOfOffice` helper to Refactor phase to keep Green minimal
- Tests passing: 27

## Cycle 28 — Red: CLI happy path — scenario stdin → results stdout, exit 0
- Compilation prediction: No compilation error expected (added `spawnSync` import from node:child_process which is a Node built-in; the path "src/cli.ts" is a runtime string argument to spawnSync, not a static import — vitest does not type-check at runtime; runScenario import unchanged) — Correct
- Runtime prediction: Expected `result.status` to be 0, received 1 (tsx fails to load nonexistent file `src/cli.ts` and exits non-zero; the spawn process itself succeeds — `result.status` reflects the child's exit code, not a spawn error) — Correct
- Discrepancies: none. Note: this is the first CLI-surface test; Green will need to (a) create `src/cli.ts` as a tsx-runnable entry point that reads stdin (process.stdin), parses JSON, calls `runScenario`, writes JSON to stdout, exits 0 on success.

## Cycle 28 — Green: CLI happy path — scenario stdin → results stdout, exit 0
- Minimal implementation: created `src/cli.ts` that accumulates stdin chunks, JSON.parses, calls `runScenario`, writes `JSON.stringify(result)` to stdout, and calls `process.exit(0)` on stdin 'end'
- Tests passing: 28

## Cycle 29 — Red: CLI unknown item type (broomstick) → exit non-zero, stderr, no stdout
- Compilation prediction: No compilation error expected (vitest does not type-check at runtime; spawnSync already imported in cycle 28; QuoteItem.type is `string` so `"broomstick"` is accepted; identical structure to cycle 28's happy-path CLI test) — Correct
- Runtime prediction: Expected `result.status !== 0` and `result.stderr !== ""` and `result.stdout === ""`; received `result.status === 0` (CLI succeeds silently because `basePremium("broomstick")` returns 0 via the `BASE_PREMIUM[type] ?? 0` fallback, so the broomstick prices at policyBase 0 → premium = ceil(0 + 0 + 0 + 5) = 5 G; no validation/error path exists in `scenarioJsonToResultJson` or `runScenario`) — Correct
- Discrepancies: none. Note: this is the first CLI validation test. Green will need to (a) introduce an error path in `scenarioJsonToResultJson` (e.g. validate item types against `BASE_PREMIUM` keys and throw), and (b) have `main()` catch the throw, write the error message to stderr, and `process.exit(non-zero)` without writing to stdout. Architecture-notes cycle 21 explicitly anticipated this design choice.

## Cycle 29 — Green: CLI unknown item type (broomstick) → exit non-zero, stderr, no stdout
- Minimal implementation: added `KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM))` (also filled out `staff: 80` and `potion: 40` in BASE_PREMIUM to cover all spec-recognized types); in `runScenario`'s quote branch, iterate items and throw `Error("Unknown item type: <type>")` for any type not in the set; wrapped `main()`'s transform/write in try/catch — on catch, write `err.message + "\n"` to stderr and `process.exit(1)` (no stdout write on error path).
- Tests passing: 29

## Cycle 30 — Red: CLI claim references item not in policy (amulet damage on sword-only policy) → exit non-zero, stderr non-empty
- Compilation prediction: No compilation error expected (spawnSync already imported in cycle 28; identical CLI-spawn shape to cycles 28-29; vitest does not type-check at runtime) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. `insuredItemFor` returns `undefined` (sword-only policy has no amulet); `damagePayout(damage, insuredItemFor(...)!)` then accesses `insuredItem.enchantment` on `undefined` → throws `TypeError: Cannot read properties of undefined (reading 'enchantment')`; CLI `main()`'s try/catch (cycle 29) catches it, writes message + "\n" to stderr, exits 1. Both assertions (`status !== 0` and `stderr !== ""`) satisfied incidentally via the unintended TypeError path. — Correct
- Discrepancies: none (test passes via uncaught TypeError, not via the intended explicit validation path; the `!` non-null assertion from cycle 13 still bypasses proper validation. Green phase should replace this incidental coverage with an explicit `validateClaimStep(step, allSteps)` helper that throws a descriptive `Error("Claim references item not in policy: <itemType>")` BEFORE `processClaimStep` runs — anticipated in architecture-notes cycle 22 — and the future "more sword damages than insured" test (cycle 33) will also live in that helper. Note: this test only checks `stderr !== ""` not the error message content, so the incidental TypeError message currently passes; Green should still tighten this since stricter future tests and CLI consumers benefit from a domain-specific message.)


## Cycle 31 — Red: CLI claim with unknown itemType (broomstick) → exit non-zero, stderr non-empty
- Compilation prediction: No compilation error expected (spawnSync already imported in cycle 28; identical CLI-spawn shape to cycles 28-30; vitest does not type-check at runtime) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. `insuredItemFor` returns `undefined` (sword-only policy has no "broomstick"); `damagePayout(damage, insuredItem!)` then accesses `insuredItem.enchantment` on `undefined` → throws `TypeError: Cannot read properties of undefined (reading 'enchantment')`; CLI `main()`'s try/catch (cycle 29) catches it, writes message + "\n" to stderr, exits 1. Both assertions (`status !== 0` and `stderr !== ""`) satisfied incidentally via the unintended TypeError path (mirrors cycle 30). — Correct
- Discrepancies: none (test passes via uncaught TypeError, not via the intended explicit validation path; this is the same incidental-coverage problem flagged in cycle 30's journal entry. The right Green/Refactor move is to create the `validateClaimStep(step, allSteps)` helper anticipated in architecture-notes cycle 22 — it would handle both "claim references item not in policy" (cycle 30) AND "claim damage entry with unknown itemType" (this cycle) in one place: throw `Error("Unknown item type in claim damage: <itemType>")` when the damage.itemType is not in KNOWN_ITEM_TYPES, BEFORE `processClaimStep` runs. This test only checks `stderr !== ""` so the current TypeError message passes; tightening to a domain-specific message also enables the future "more sword damages than insured" rejection (cycle 33) to share the same validation surface.)

## Cycle 32 — Red: CLI claim with negative damage amount (-200) → exit non-zero, stderr non-empty
- Compilation prediction: No compilation error expected (spawnSync already imported in cycle 28; identical CLI-spawn shape to cycles 28-31; DamageEntry.amount is `number` so `-200` is accepted; vitest does not type-check at runtime) — Correct
- Runtime prediction: Expected `result.status !== 0` and `result.stderr !== ""`; received `result.status === 0` (CLI succeeds silently because no negative-amount guard exists: `validateQuoteStep` passes (sword is a known type); `insuredItemFor` resolves the sword; `damagePayout` computes `(ench=3) < 8` → `reimbursement = -200`; payout = `-200 - 100 = -300`; `roundDownInFavorOfOffice(-300) = -300`; CLI writes `{"results":[{"premium":115},{"payout":-300}]}` to stdout and exits 0; first assertion `expect(0).not.toBe(0)` fails) — Correct
- Discrepancies: none. Note: this is the first claim test whose required guard does NOT live behind an incidental TypeError — cycle 30/31's `insuredItem!.enchantment` access naturally throws for missing items, but a negative `amount` flows cleanly through arithmetic and produces a (nonsensical) negative payout. Green will need to add an explicit guard. The right home (per architecture-notes cycle 22's prediction) is a new `validateClaimStep(step: ClaimStep, allSteps: Step[]): void` helper at module scope, called from `runScenario`'s claim branch BEFORE `processClaimStep` — that helper will check (a) each damage.amount >= 0, throwing `Error("Negative damage amount: <amount>")`, and additionally absorb the incidental-coverage path from cycles 30/31 by checking damage.itemType against the policy items and KNOWN_ITEM_TYPES, which is also the right place to eventually remove the cycle-13 `!` non-null assertion in `processClaimStep`'s `insuredItemFor(...)!`.

## Cycle 32 — Green: CLI claim with negative damage amount (-200) → exit non-zero, stderr non-empty
- Minimal implementation: added module-level `validateClaimStep(step: ClaimStep): void` helper that iterates `step.incident.damages` and throws `Error("Negative damage amount: <amount>")` when any `damage.amount < 0`; invoked it from `runScenario`'s claim branch before `processClaimStep`. Did NOT yet add the unknown-itemType / not-in-policy / over-claim checks (no failing test demands them — cycles 30/31 pass incidentally via TypeError; cycle 33 is still `it.todo`); signature kept as `validateClaimStep(step)` not `(step, allSteps)` for the same minimalism reason — Refactor may widen the signature when the next failing test demands it.
- Tests passing: 32

## Cycle 33 — Red: CLI over-claim — more sword damages than swords insured → exit non-zero, stderr non-empty
- Compilation prediction: No compilation error expected (spawnSync already imported in cycle 28; identical CLI-spawn shape to cycles 28-32; vitest does not type-check at runtime) — Correct
- Runtime prediction: Expected `result.status !== 0` and `result.stderr !== ""`; received `result.status === 0` (current `validateClaimStep` only checks negative amounts; `processClaimStep`'s `insuredItemFor` uses `.find()` which returns the single insured sword for both damages; `damagePayout` yields (200-100) + (300-100) = 400; CLI writes `{"results":[{"premium":115},{"payout":400}]}` and exits 0; `expect(0).not.toBe(0)` fails) — Correct
- Discrepancies: none. Note: this is the third validation test whose required guard does NOT live behind an incidental TypeError — over-claiming flows cleanly through `.find()` (which always returns the first match) producing a (semantically wrong) positive payout. Green will need to add an over-claim guard to `validateClaimStep`: count damage entries per itemType, count insured items per type from the referenced policy, throw `Error("More <itemType> damages than insured: <damageCount> > <insuredCount>")` (or similar) when damageCount > insuredCount. The signature will need to widen to `validateClaimStep(step, allSteps)` (anticipated in cycle 22/23 architecture notes) to look up `allSteps[step.policy]`. This is also the natural moment to absorb the cycle-30/31 incidental-TypeError coverage (claim references item not in policy, unknown itemType in damage) into the same helper, replacing the cycle-13 `!` non-null assertion with explicit pre-validation.

## Cycle 33 — Green: CLI over-claim — more sword damages than swords insured → exit non-zero
- Minimal implementation: widened `validateClaimStep` signature to `(step, policyItems: QuoteItem[])`; added per-itemType damage count (via Map) vs policy items.filter(...).length comparison; throws `Error("More <itemType> damages than insured: <damageCount> > <insuredCount>")` when exceeded. Updated `runScenario`'s claim branch to compute `policyStep` first, then pass `policyStep.items` to validate before processing.
- Tests passing: 33

## Cycle 34 — Red: CLI end-to-end multi-step (R6 + E12) — two quotes + claim, follow-up discount on second quote, results order preserved
- Compilation prediction: No compilation error expected (spawnSync already imported in cycle 28; identical CLI-spawn shape to cycles 28-33; vitest does not type-check at runtime) — Correct
- Runtime prediction: No runtime/assertion error expected — test passes immediately. Tracing through current impl with scenario [quote sword, claim sword 500, quote sword] for yearsWithMHPCO=0: step 0 (index 0, isFollowUp=false) → priceQuoteStep yields 100+0+10-0-0+5 = 115; step 1 (claim) → validateClaimStep passes (amount 500>0, 1 sword damage ≤ 1 sword insured); processClaimStep yields 500-100 = 400 (ench 3 < 8); step 2 (index 2, isFollowUp=(2>0)=true) → priceQuoteStep yields 100+0+10-0-15+5 = 100. Output `{"results":[{"premium":115},{"payout":400},{"premium":100}]}`, CLI exits 0. All five assertions (status===0, results.length===3, results[0]={premium:115}, results[1]={payout:400}, results[2]={premium:100}) satisfied. — Correct
- Discrepancies: none (this is a regression/integration pinning test for R6 step-order preservation AND the follow-up discount on the second quote. Subtle: the spec's R6 nuance "claim steps don't count toward this counter" is NOT actually exercised here because the existing `index > 0` definition of isFollowUp happens to give the correct answer for this specific scenario — the second quote is at scenario index 2 (post-claim), and `2 > 0` is true. A discriminating test for R6 would need either (a) a claim at index 0 followed by a quote at index 1 that should be the FIRST quote (no follow-up), or (b) two quotes with a claim between them where the second quote should be follow-up=true regardless of whether claims are counted — but the latter is what this test is, so coverage is incidental. Architecture-notes may want to revisit the `index > 0` heuristic if a future test forces the proper "count of prior quote steps" computation; for now no failing test demands it.)
