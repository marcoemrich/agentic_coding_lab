# TDD Journal

## Cycle 1 — Red: should price a single plain sword (115G)
- Compilation prediction: Module './claim-office.js' / runScenario does not exist — Correct
- Runtime prediction: Expected { results: [{ premium: 115 }] }, received undefined — Correct
- Discrepancies: none

## Cycle 1 — Green: should price a single plain sword (115G)
- Minimal implementation: hardcoded return { results: [{ premium: 115 }] }
- Tests passing: 1

## Cycle 2 — Red: should price a single plain amulet (71G)
- Compilation prediction: No compilation error — runScenario and types already exist from cycle 1 — Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 115 }] } (hardcoded sword price) — Correct
- Discrepancies: none

## Cycle 2 — Green: should price a single plain amulet (71G)
- Minimal implementation: branch on first item's type — amulet -> 71, else -> 115
- Tests passing: 2

## Cycle 3 — Red: should price a single plain staff (93G)
- Compilation prediction: No compilation error — runScenario and types already exist; PREMIUM_BY_ITEM_TYPE is Record<string, number> — Correct
- Runtime prediction: Expected { results: [{ premium: 93 }] }, received { results: [{ premium: undefined }] } (staff not in lookup map) — Correct
- Discrepancies: none

## Cycle 3 — Green: should price a single plain staff (93G)
- Minimal implementation: added `staff: 93` entry to PREMIUM_BY_ITEM_TYPE lookup map
- Tests passing: 3

## Cycle 4 — Red: should price a single plain potion (49G)
- Compilation prediction: No compilation error — runScenario, types, and PREMIUM_BY_ITEM_TYPE all already exist — Correct
- Runtime prediction: Expected { results: [{ premium: 49 }] }, received { results: [{ premium: undefined }] } (potion missing from lookup map) — Correct
- Discrepancies: none

## Cycle 4 — Green: should price a single plain potion (49G)
- Minimal implementation: added `potion: 49` entry to PREMIUM_BY_ITEM_TYPE lookup map
- Tests passing: 4

## Cycle 5 — Red: should price a single rune (33G)
- Compilation prediction: No compilation error — runScenario, types, and PREMIUM_BY_ITEM_TYPE already exist; Item type only requires `type: string` so `{ type: "rune" }` compiles — Correct
- Runtime prediction: Expected { results: [{ premium: 33 }] }, received { results: [{ premium: undefined }] } (rune missing from lookup map) — Correct
- Discrepancies: none

## Cycle 5 — Green: should price a single rune (33G)
- Minimal implementation: added `rune: 33` entry to PREMIUM_BY_ITEM_TYPE lookup map
- Tests passing: 5

## Cycle 6 — Red: should price a single moonstone (33G)
- Compilation prediction: No compilation error — runScenario, types, and PREMIUM_BY_ITEM_TYPE already exist; Item type only requires `type: string` so `{ type: "moonstone" }` compiles — Correct
- Runtime prediction: Expected { results: [{ premium: 33 }] }, received { results: [{ premium: undefined }] } (moonstone missing from lookup map) — Correct
- Discrepancies: none

## Cycle 6 — Green: should price a single moonstone (33G)
- Minimal implementation: added `moonstone: 33` entry to PREMIUM_BY_ITEM_TYPE lookup map
- Tests passing: 6

## Cycle 7 — Red: should add a 50% risk surcharge for a cursed sword (170G)
- Compilation prediction: No compilation error — runScenario accepts `unknown`; same item shape (cursed/material/enchantment) already passed in cycles 1-4 — Correct
- Runtime prediction: Expected { results: [{ premium: 170 }] }, received { results: [{ premium: 115 }] } (PREMIUM_BY_ITEM_TYPE lookup returns hardcoded sword=115; cursed flag is ignored) — Correct
- Discrepancies: none

## Cycle 7 — Green: should add a 50% risk surcharge for a cursed sword (170G)
- Minimal implementation: added `cursed?: boolean` to Item type; if first item is cursed, return hardcoded 170, else existing lookup
- Tests passing: 7

## Cycle 8 — Red: should add a 30% surcharge for a highly enchanted sword (enchantment=5) (148G)
- Compilation prediction: No compilation error — runScenario accepts unknown; the {type, material, enchantment, cursed} item shape already compiled in cycles 1 and 7 — Correct
- Runtime prediction: Expected { results: [{ premium: 148 }] }, received { results: [{ premium: 115 }] } (cursed=false skips cursed branch; falls through to PREMIUM_BY_ITEM_TYPE lookup that returns hardcoded sword=115; enchantment flag is ignored) — Correct
- Discrepancies: none

## Cycle 8 — Green: should add a 30% surcharge for a highly enchanted sword (enchantment=5) (148G)
- Minimal implementation: added `enchantment?: number` to Item type; if (item.enchantment ?? 0) >= 5, return hardcoded 148, else existing branches
- Tests passing: 8

## Cycle 9 — Red: should NOT add the highly-enchanted surcharge when enchantment=4 (boundary): sword stays at 115G
- Compilation prediction: No compilation error — runScenario accepts unknown; the {type, material, enchantment, cursed} item shape already compiled in cycles 1, 7, 8 — Correct
- Runtime prediction: Expected assertion error (115 vs 148); actual: test PASSES on activation because enchantment=4 fails the `>= HIGHLY_ENCHANTED_MIN` (5) guard from cycle 8 and falls through to PREMIUM_BY_ITEM_TYPE["sword"] = 115 — Incorrect
- Discrepancies: Test passes immediately. The boundary behavior is already correctly handled by cycle 8's `>= 5` guard (a stricter `> 4` or `>= 4` would have failed). This is a free-passing boundary test — Green phase will have nothing to implement.

## Cycle 10 — Red: should apply a 20% loyalty discount for a customer with yearsWithMHPCO=2: sword becomes 93G
- Compilation prediction: No compilation error — runScenario accepts unknown; customer/steps/item shape already compiled in prior cycles — Correct
- Runtime prediction: Expected { results: [{ premium: 93 }] }, received { results: [{ premium: 115 }] } (cursed=false and enchantment=0 skip both surcharge branches; falls through to PREMIUM_BY_ITEM_TYPE["sword"]=115; customer.yearsWithMHPCO is ignored by current impl) — Correct
- Discrepancies: none

## Cycle 10 — Green: should apply a 20% loyalty discount for a customer with yearsWithMHPCO=2: sword becomes 93G
- Minimal implementation: added Customer type with optional yearsWithMHPCO; if (customer?.yearsWithMHPCO ?? 0) >= 2, return hardcoded 93, else existing lookup
- Tests passing: 10

## Cycle 11 — Red: should NOT apply the loyalty discount when yearsWithMHPCO=1 (boundary): sword stays at 115G
- Compilation prediction: No compilation error — runScenario, Customer, Item types all exist from prior cycles — Correct
- Runtime prediction: Expected assertion error (115 vs 93); actual: test PASSES on activation because yearsWithMHPCO=1 fails the `>= LOYALTY_MIN_YEARS` (2) guard in `hasLoyalty` from cycle 10 and falls through to PREMIUM_BY_ITEM_TYPE["sword"] = 115 — Incorrect
- Discrepancies: Test passes immediately. The boundary behavior is already correctly handled by cycle 10's `>= 2` guard (a stricter `> 1` or `>= 1` would have failed). This is a free-passing boundary test — Green phase will have nothing to implement. Mirrors cycle 9 (enchantment=4 boundary).

## Cycle 12 — Red: should apply the +10% first-insurance surcharge to the first quote (115G) and a -15% after-first discount to the second quote (90G)
- Compilation prediction: No compilation error — runScenario accepts unknown; Input.steps is Step[] so a two-step array satisfies the type — Correct
- Runtime prediction: Expected { results: [{ premium: 115 }, { premium: 90 }] }, received { results: [{ premium: 115 }] } (current runScenario only ever indexes steps[0] and returns a single-element results array; second step ignored) — Correct
- Discrepancies: none

## Cycle 12 — Green: should apply the +10% first-insurance surcharge to the first quote (115G) and a -15% after-first discount to the second quote (90G)
- Minimal implementation: mapped over steps (results array length now matches steps length); added `if (stepIndex >= 1) return { premium: 90 }` branch below the existing guards so non-first plain-sword steps return hardcoded 90
- Tests passing: 12

## Cycle 13 — Red: should price three runes as one building block at 60G: 71G
- Compilation prediction: No compilation error — runScenario accepts unknown; Item shape `{ type: "rune" }` (no cursed/enchantment) already compiled in cycle 5 — Correct
- Runtime prediction: Expected { results: [{ premium: 71 }] }, received { results: [{ premium: 33 }] } (current impl only inspects step.items[0]; the three-rune array is treated as a single plain rune, falling through all guards to PREMIUM_BY_ITEM_TYPE["rune"]=33) — Correct
- Discrepancies: none

## Cycle 13 — Green: should price three runes as one building block at 60G: 71G
- Minimal implementation: added guard at top of step branch — if items.length === 3 and all are rune, return hardcoded 71
- Tests passing: 13

## Cycle 14 — Red: should price two runes individually (no block): 60G
- Compilation prediction: No compilation error — runScenario accepts unknown; Item shape `{ type: "rune" }` (no cursed/enchantment) already compiled in cycles 5 and 13 — Correct
- Runtime prediction: Expected { results: [{ premium: 60 }] }, received { results: [{ premium: 33 }] } — current impl only inspects step.items[0]; isThreeRuneBlock is false (length 2, not 3); not cursed; not highly enchanted; no loyalty; not after first step; falls through to PREMIUM_BY_ITEM_TYPE["rune"] = COMPONENT_PREMIUM = 33 — Correct
- Discrepancies: none

## Cycle 14 — Green: should price two runes individually (no block): 60G
- Minimal implementation: added `isTwoRunes` predicate and a branch returning hardcoded { premium: 60 } (mirrors isThreeRuneBlock placeholder shape)
- Tests passing: 14

## Cycle 15 — Red: should price four runes as one block + one individual: 99G
- Compilation prediction: No compilation error — runScenario accepts unknown; rune item shape `{ type: "rune" }` already compiled in cycles 5/13/14; 4-element items array satisfies Item[] — Correct
- Runtime prediction: Expected { results: [{ premium: 99 }] }, received { results: [{ premium: 33 }] } — isThreeRuneBlock false (length 4), isTwoRunes false (length 4), not cursed, not highly enchanted, no loyalty, first step → falls through to PREMIUM_BY_ITEM_TYPE["rune"] = COMPONENT_PREMIUM = 33 — Correct
- Discrepancies: none

## Cycle 15 — Green: should price four runes as one block + one individual: 99G
- Minimal implementation: added `isFourRunes` predicate mirroring isTwoRunes/isThreeRuneBlock and a branch returning hardcoded { premium: 99 }
- Tests passing: 15

## Cycle 16 — Red: should price six runes as two blocks: 137G
- Compilation prediction: No compilation error — runScenario, Input/Step/Item types all exist; rune item shape `{ type: "rune" }` already compiled in cycles 5/13/14/15; 6-element items array satisfies Item[] — Correct
- Runtime prediction: Expected { results: [{ premium: 137 }] }, received { results: [{ premium: 33 }] } — isThreeRuneBlock false (length 6), isTwoRunes false (length 6), isFourRunes false (length 6), not cursed, not highly enchanted, no loyalty, first step → falls through to PREMIUM_BY_ITEM_TYPE["rune"] = COMPONENT_PREMIUM = 33 — Correct
- Discrepancies: none

## Cycle 16 — Green: should price six runes as two blocks: 137G
- Minimal implementation: added `isSixRunes` predicate mirroring isTwoRunes/isThreeRuneBlock/isFourRunes and a branch returning hardcoded { premium: 137 }
- Tests passing: 16

## Cycle 17 — Red: should NOT combine 2 runes + 1 moonstone into a block (alike = same type): 88G
- Compilation prediction: No compilation error — runScenario, Input/Step/Item types all exist; `{ type: "rune" }`/`{ type: "moonstone" }` item shapes already compiled in cycles 5/6/13-16; 3-element Item[] satisfies items — Correct
- Runtime prediction: Expected { results: [{ premium: 88 }] }, received { results: [{ premium: 33 }] } — isAllRuneStep false (not every item is rune; one is moonstone), runeStepPremium skipped; first item has no cursed/enchantment, no loyalty, first step → falls through to PREMIUM_BY_ITEM_TYPE[item.type] = PREMIUM_BY_ITEM_TYPE["rune"] = COMPONENT_PREMIUM = 33 — Correct
- Discrepancies: none

## Cycle 17 — Green: should NOT combine 2 runes + 1 moonstone into a block (alike = same type): 88G
- Minimal implementation: added `isTwoRunesOneMoonstone` predicate (length 3, rune count 2, moonstone count 1) and a branch returning hardcoded { premium: 88 }
- Tests passing: 17

## Cycle 18 — Red: should stack cursed AND highly enchanted surcharges multiplicatively on a sword: 220G
- Compilation prediction: No compilation error — runScenario accepts unknown; sword item shape `{ type, material, enchantment, cursed }` already compiled in cycles 1/7/8 — Correct
- Runtime prediction: Expected { results: [{ premium: 220 }] }, received { results: [{ premium: 170 }] } — isMultiComponentStep false (sword, not components); first guard hit is `item.cursed` which returns hardcoded 170; the highly-enchanted surcharge is silently ignored because the cursed branch matches first — Correct
- Discrepancies: none

## Cycle 18 — Green: should stack cursed AND highly enchanted surcharges multiplicatively on a sword: 220G
- Minimal implementation: added `if (item.cursed && isHighlyEnchanted(item)) return { premium: 220 }` branch above the existing cursed-only branch
- Tests passing: 18

## Cycle 19 — Red: should combine cursed + highly enchanted + loyalty + first surcharges on a sword: 177G
- Compilation prediction: No compilation error — runScenario accepts unknown; sword item shape `{ type, material, enchantment, cursed }` and customer.yearsWithMHPCO already compiled in prior cycles — Correct
- Runtime prediction: Test PASSES on activation — after cycle 18's formula refactor, `applyMultsAndFee(100, [150, 130, 80, 110])` = ceil(171600000/100000000) + 5 = ceil(171.6) + 5 = 172 + 5 = 177. The formula naturally handles all four modifiers stacking, exactly as anticipated in cycle 18's notes ("177G four-modifier will pass against this formula with zero additional code") — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9 and 11 (boundary tests) but for a different reason: there the threshold guards already handled boundaries; here the formula refactor of cycle 18 already subsumes the four-modifier combination.

## Cycle 20 — Red: should sum multiple items in a single quote then apply customer modifiers: sword + amulet for new customer first = 181G
- Compilation prediction: No compilation error — runScenario accepts unknown; sword/amulet item shape and 2-element Item[] already compiled in prior cycles — Correct
- Runtime prediction: Expected { results: [{ premium: 181 }] }, received { results: [{ premium: 115 }] } — isMultiComponentStep false (neither item is a component); falls into single-item path that only inspects step.items[0] (sword), ignores amulet, returns applyMultsAndFee(100, [110]) = ceil(11000/100) + 5 = 115 — Correct
- Discrepancies: none

## Cycle 20 — Green: should sum multiple items in a single quote then apply customer modifiers: sword + amulet for new customer first = 181G
- Minimal implementation: sum BASE_BY_ITEM_TYPE across all step.items via reduce (still uses items[0] for itemSurchargeMultsPct since current test has no per-item surcharges)
- Tests passing: 20

## Cycle 21 — Red: should round UP in MHPCO's favor (non-integer): staff with loyalty + first = 76G
- Compilation prediction: No compilation error — runScenario accepts unknown; staff item shape and yearsWithMHPCO:2 customer already compiled in cycles 3 and 10 — Correct
- Runtime prediction: Test PASSES on activation — applyMultsAndFee(80, [80, 110]) = ceil(80*80*110 / 100^2) + 5 = ceil(704000/10000) + 5 = ceil(70.4) + 5 = 71 + 5 = 76. The cycle-18 formula refactor already handles ceil-rounding correctly (integer-first arithmetic avoids the FP gotcha cycle 16 hit) — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. This is the ceil-forcing test that cycles 5/7/8/9/10/11 anticipated would force the formula extraction — but the extraction landed earlier (cycle 18) driven by stacking surcharges, and the formula was correctly designed with `Math.ceil` so the ceil-forcing test now confirms the design rather than driving it. Mirrors the free-passing pattern of cycles 9/11/19.

## Cycle 23 — Red: should fully reimburse damage to a dragon-material item minus the 100G deductible: dragon sword 500G damage => 400G payout
- Compilation prediction: No compilation error — runScenario accepts unknown; the claim step shape (`{ op: "claim", policy: 0, incident: { cause, damages: [{ itemType, amount }] } }`) and the dragon-material quote step satisfy the `unknown` parameter — Correct
- Runtime prediction: First execution surfaced a TypeError (Cannot read properties of undefined reading '0' inside quoteStep — runScenario routed the claim step into quoteStep which dereferences step.items[0]); added a minimal `claimStep()` returning `{ payout: undefined }` plus an `op === "claim"` dispatch in runScenario; on re-run, expected assertion error showed `{ payout: 400 }` vs `{ payout: undefined }` — Correct
- Discrepancies: First run produced a TypeError instead of an assertion error because runScenario had no claim-step branch and quoteStep assumes `step.items` exists. The fix (introduce a `claimStep()` returning `{ payout: undefined }` and dispatch on `step.op`) is the empty-function/Step-4 placeholder the Red phase calls for; after that, the runtime prediction held exactly. The dragon-eligibility lookup (via policy index) is the Green-phase concern.

## Cycle 23 — Green: should fully reimburse damage to a dragon-material item minus the 100G deductible: dragon sword 500G damage => 400G payout
- Minimal implementation: extended Item with optional `material`, added Damage/Incident types and optional `policy`/`incident` on Step; introduced CLAIM_DEDUCTIBLE=100 and DRAGON_REIMBURSEMENT_RATE_PCT=100 constants; replaced placeholder `claimStep()` with one that resolves the policy step via `steps[step.policy ?? 0]`, sums damage amounts where the matched item's `material === "dragon"` (rate 100%), and returns `Math.max(0, reimbursable - CLAIM_DEDUCTIBLE)`
- Tests passing: 23

## Cycle 22 — Red: should default missing optional fields (cursed absent => false, enchantment absent => 0): plain sword first contract = 115G
- Compilation prediction: No compilation error — runScenario accepts unknown; sword item shape without cursed/enchantment already compiled in cycles 5/6 (single rune/moonstone with bare `{ type }`); empty customer `{}` satisfies `Customer = { yearsWithMHPCO?: number }` — Correct
- Runtime prediction: Test PASSES on activation — `item.cursed` undefined → falsy → no cursed multiplier; `(item.enchantment ?? 0) >= 5` → false → no enchanted multiplier; `hasLoyalty({})` → `(undefined ?? 0) >= 2` → false → no loyalty multiplier; first step → stepMultsPct returns [110]; stepBase = BASE_BY_ITEM_TYPE["sword"] = 100; applyMultsAndFee(100, [110]) = ceil(11000/100) + 5 = 110 + 5 = 115 — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. The optional-field defaults were already correctly designed in earlier cycles: `item.cursed` checked as truthy (not equality) in cycle 7; `?? 0` defaults on enchantment in cycle 8 and yearsWithMHPCO in cycle 10. Mirrors the free-passing pattern of cycles 9/11/19/21.

## Cycle 24 — Red: should reimburse damage to a highly enchanted item (enchantment=8) at 50%, minus deductible: sword 500G damage => 150G payout
- Compilation prediction: No compilation error — runScenario accepts unknown; sword item shape `{ type, material, enchantment, cursed }` and claim step shape `{ op: "claim", policy, incident: { cause, damages: [{ itemType, amount }] } }` already compiled in cycles 1/7/8/23 — Correct
- Runtime prediction: Expected `{ results: [{ premium: 148 }, { payout: 150 }] }`, received `{ results: [{ premium: 148 }, { payout: 0 }] }` — quote produces 148G correctly (cycle 8's `isHighlyEnchanted` returns true for enchantment=8 just as for =5; same multiplier chain). Claim's `claimStep` only assigns `ratePct = DRAGON_REIMBURSEMENT_RATE_PCT (100)` when `item.material === "dragon"`; the sword is steel, so `ratePct = 0`, reimbursable = (500 * 0) / 100 = 0, payout = max(0, 0 - 100) = 0. The highly-enchanted reimbursement rate (C2) is not yet implemented — Correct
- Discrepancies: none

## Cycle 24 — Green: should reimburse damage to a highly enchanted item (enchantment=8) at 50%, minus deductible: sword 500G damage => 150G payout
- Minimal implementation: added `HIGHLY_ENCHANTED_REIMBURSEMENT_RATE_PCT = 50`; in `claimStep` rate selection, if not dragon material but item is highly enchanted, set ratePct to 50 (dragon checked first preserves "better rate wins" for C5)
- Tests passing: 24

## Cycle 25 — Red: should NOT reimburse damage when enchantment=7 and material is not dragon (boundary): 0G payout
- Compilation prediction: No compilation error — runScenario, Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/damages) all exist from cycles 1/7/8/23/24 — Correct
- Runtime prediction: Expected `{ results: [{ premium: 148 }, { payout: 0 }] }`, received `{ results: [{ premium: 148 }, { payout: 150 }] }` — quote correctly returns 148 (enchantment=7 ≥ HIGHLY_ENCHANTED_MIN=5 triggers quote surcharge). Claim incorrectly returns 150 because `reimbursementRatePct` reuses the quote-side `isHighlyEnchanted` predicate (threshold ≥5); at enchantment=7 it returns true, so ratePct=50, reimbursable=250, payout=max(0, 250-100)=150. The claim threshold should be ≥8 per spec C2 — Correct
- Discrepancies: none

## Cycle 25 — Green: should NOT reimburse damage when enchantment=7 and material is not dragon (boundary): 0G payout
- Minimal implementation: introduced `CLAIM_HIGHLY_ENCHANTED_MIN = 8` constant and replaced the `isHighlyEnchanted(item)` call inside `reimbursementRatePct` with an inline `(item.enchantment ?? 0) >= CLAIM_HIGHLY_ENCHANTED_MIN` check, decoupling claim eligibility from the quote-side ≥5 threshold

## Cycle 26 — Red: should reimburse at boundary enchantment=8: amulet 400G damage => 100G payout (200 reimbursable - 100 deductible)
- Compilation prediction: No compilation error — runScenario, Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/damages) all exist from prior cycles — Correct
- Runtime prediction: Test PASSES on activation — `isHighlyEnchantedForClaim` from cycle 25 uses `>= CLAIM_HIGHLY_ENCHANTED_MIN` (= 8), so enchantment=8 evaluates true. `reimbursementRatePct` returns max(0, 50) = 50. reimbursable = 400 * 50 / 100 = 200. payout = max(0, 200 - 100) = 100. Quote side: amulet base=60, enchantment=8 also triggers quote-side `isHighlyEnchanted` (≥5), so multipliers [130, 110], premium = ceil(60*130*110/10000) + 5 = ceil(85.8) + 5 = 86 + 5 = 91. Expected `{ results: [{ premium: 91 }, { payout: 100 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22 (boundary tests confirming earlier threshold extractions). Cycle 25's `CLAIM_HIGHLY_ENCHANTED_MIN = 8` (inclusive `>=`) already correctly handles the enchantment=8 boundary as "qualifies".
- Tests passing: 25

## Cycle 27 — Red: should pay 0G when item is neither dragon nor highly enchanted: amulet enchantment=2 damage 200G => 0G payout
- Compilation prediction: No compilation error — runScenario, Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/damages) all exist from prior cycles — Correct
- Runtime prediction: Test PASSES on activation — quote: amulet base 60, enchantment=2 < HIGHLY_ENCHANTED_MIN (5) skips enchanted surcharge; not cursed; first step, no loyalty → multsPct=[110]; premium = ceil(60*110/100)+5 = 66+5 = 71G. Claim: matched amulet has material="silver" (not dragon) and enchantment=2 < CLAIM_HIGHLY_ENCHANTED_MIN (8); reimbursementRatePct returns Math.max(...[0]) = 0; reimbursable = 200*0/100 = 0; payout = max(0, 0-100) = 0G. Expected `{ results: [{ premium: 71 }, { payout: 0 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26 — this is a categorical-zero test confirming cycles 23/24/25's combined rate selection (the `[0]` floor in `rates` array plus dragon/claim-enchanted predicates returning false) correctly yields a 0% rate which the deductible-clamp then collapses to a 0G payout.

## Cycle 29 — Red: should apply a single deductible per damage event even with multiple damages: two dragon items damaged 200G each => 300G payout (400 - 100)
- Compilation prediction: No compilation error — runScenario accepts unknown; Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/cause/damages with itemType/amount) all already compiled in cycles 1/7/8/23-28; two-element items array and two-element damages array satisfy Item[] and Damage[] — Correct
- Runtime prediction: Test PASSES on activation — Quote: sword+amulet, neither cursed/enchanted, no loyalty, first step → stepBase = 100+60 = 160 (non-component path), multsPct=[110]; premium = ceil(160*110/100)+5 = 176+5 = 181G. Claim: policyStep = steps[0]; sword damage 200 → matched item material="dragon" → ratePct=100 → 200*100/100=200; amulet damage 200 → matched item material="dragon" → ratePct=100 → 200*100/100=200; reimbursable = 200+200 = 400; payout = max(0, 400-100) = 300G. Expected `{ results: [{ premium: 181 }, { payout: 300 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28 — this confirms cycle 23's design of "subtract one deductible per claim event, not per damage". The reduce in claimStep already accumulates all damages into one `reimbursable` total BEFORE the single `Math.max(0, reimbursable - CLAIM_DEDUCTIBLE)` subtraction, which is exactly the "single deductible per event" semantics. The original design (cycle 23) anticipated this without an explicit test — the choice of accumulate-then-subtract (vs subtract-per-damage) was already correct.

## Cycle 28 — Red: should fully reimburse dragon items regardless of enchantment level: dragon staff enchantment=1 damage 300G => 200G payout
- Compilation prediction: No compilation error — runScenario, Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/damages) all exist from prior cycles — Correct
- Runtime prediction: Test PASSES on activation — quote: staff base 80, enchantment=1 < HIGHLY_ENCHANTED_MIN (5), not cursed, no loyalty, first step → multsPct=[110]; premium = ceil(80*110/100)+5 = 88+5 = 93G. Claim: matched staff has material="dragon" so DRAGON_REIMBURSEMENT_RATE_PCT (100) is pushed into rates; enchantment=1 < CLAIM_HIGHLY_ENCHANTED_MIN (8) so no enchanted rate; Math.max(...[0, 100]) = 100; reimbursable = 300*100/100 = 300; payout = max(0, 300 - 100) = 200G. Expected `{ results: [{ premium: 93 }, { payout: 200 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27 — this confirms cycle 24's `reimbursementRatePct` design where the dragon rate source is independent of (and overrides via Math.max) the enchantment rate source. Cycle 27 confirmed the 0-floor; cycle 28 confirms dragon-without-enchant; cycle 32 will confirm dragon-WITH-high-enchant ("better rate wins").

## Cycle 30 — Red: should clamp payout to 0 when damage is below the deductible: dragon sword 50G damage => 0G payout
- Compilation prediction: No compilation error — runScenario accepts unknown; dragon sword item shape `{ type, material, enchantment, cursed }` and claim step shape `{ op, policy, incident: { cause, damages: [{ itemType, amount }] } }` already compiled in cycles 1/7/23/29 — Correct
- Runtime prediction: Test PASSES on activation — Quote: sword base 100, not cursed, not highly enchanted, no loyalty, first step → multsPct=[110]; premium = ceil(100*110/100)+5 = 110+5 = 115G. Claim: matched dragon sword → reimbursementRatePct via Math.max(...[0, 100])=100; damageReimbursement = 50*100/100 = 50; reimbursable = 50; payout = Math.max(0, 50-100) = Math.max(0, -50) = 0G. Expected `{ results: [{ premium: 115 }, { payout: 0 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29 — this confirms cycle 23's `Math.max(0, reimbursable - CLAIM_DEDUCTIBLE)` clamp design correctly handles negative subtotals (50 - 100 = -50 clamped to 0). The original design (cycle 23) anticipated this without an explicit test — the choice of `Math.max(0, ...)` as the outer wrap (vs an explicit `if (subtotal < 0) return 0`) was already correct and now confirmed by the first test where the clamp arithmetically flips the sign.

## Cycle 32 — Red: should take the better rate when item qualifies under both rules: dragon sword enchantment=9 damage 400G => 300G payout (100%, not 50%)
- Compilation prediction: No compilation error — runScenario, Item (type/material/enchantment/cursed), claim step shape (op/policy/incident/cause/damages with itemType/amount) all already compiled in cycles 1/7/8/23/24 — Correct
- Runtime prediction: Test PASSES on activation — Quote: sword base 100, enchantment=9 ≥ HIGHLY_ENCHANTED_MIN(5) triggers HIGHLY_ENCHANTED_MULT_PCT=130, not cursed, no loyalty, first step → multsPct=[130, 110]; premium = ceil(100*130*110/100²)+5 = ceil(143)+5 = 148. Claim: matched dragon sword with enchantment=9; reimbursementRatePct pushes both DRAGON_REIMBURSEMENT_RATE_PCT(100) AND HIGHLY_ENCHANTED_REIMBURSEMENT_RATE_PCT(50) into rates; Math.max(...[0, 100, 50]) = 100; reimbursable = 400*100/100 = 400; payout = max(0, 400-100) = 300G. Expected `{ results: [{ premium: 148 }, { payout: 300 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30/31 — this is the "better rate wins" test cycle 28 explicitly anticipated ("cycle 32 will confirm dragon-WITH-high-enchant 'better rate wins'"). Confirms cycle 24's `Math.max(...rates)` with `[0]` seed design where dragon and highly-enchanted are independent rate sources that compose via max — both branches push, Math.max selects 100 over 50 ordering-independently, exactly the "better rate wins" semantic. This is the final claim-side test; the 3 remaining sequencing tests and 3 CLI tests follow.

## Cycle 31 — Red: should handle mixed eligibility within one claim: dragon sword 300G + plain amulet 200G => 200G payout
- Compilation prediction: No compilation error — runScenario accepts unknown; sword+amulet item shape (type/material/enchantment/cursed), two-element items array, claim step shape (op/policy/incident/cause/damages), and two-element damages array all already compiled in cycles 1/7/8/20/23/29 — Correct
- Runtime prediction: Test PASSES on activation — Quote: isMultiComponentStep=false (neither sword nor amulet is component); falls to non-component multi-item path: stepBase = BASE_BY_ITEM_TYPE.sword + BASE_BY_ITEM_TYPE.amulet = 100+60 = 160. itemSurchargeMultsPct(step.items[0]=sword) = [] (not cursed, enchantment=0 < 5). stepMultsPct (first step, no loyalty) = [FIRST_CONTRACT_MULT_PCT=110]. premium = ceil(160*110/100)+5 = 176+5 = 181G. Claim: policyStep=steps[0]; sword damage 300 → matched item material="dragon" → reimbursementRatePct = max(0, 100) = 100 → damageReimbursement = 300*100/100 = 300; amulet damage 200 → matched item material="silver", enchantment=2 < CLAIM_HIGHLY_ENCHANTED_MIN(8) → reimbursementRatePct = max(0) = 0 → damageReimbursement = 200*0/100 = 0; grossReimbursable = 300+0 = 300; payout = max(0, 300-100) = 200G. Expected `{ results: [{ premium: 181 }, { payout: 200 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30 — this confirms cycle 23's `reduce(sum + damageReimbursement)` design correctly handles the heterogeneous-rate case: per-damage rate selection (via matched item's eligibility predicates) gives 100% for the dragon sword and 0% for the ineligible amulet, the reduce sums them as separate addends (300 + 0 = 300), and the single deductible (cycle 29's "per event, not per damage" semantics) subtracts once. The interaction of "single deductible per event" + "per-damage rate" was already correctly designed in cycle 23; this test validates that mixing eligible and ineligible items in one claim does NOT introduce a special case — the 0% rate naturally produces a 0G addend for ineligible items.

## Cycle 33 — Red: should process steps sequentially and return a results array of the same length and order (one quote => one result with premium)
- Compilation prediction: No compilation error — runScenario, Input/Step/Item/Customer types, sword item shape `{ type, material, enchantment, cursed }` already compiled in cycles 1/7/8; result.results typed as ScenarioResult[] supports `.toHaveLength` and indexing — Correct
- Runtime prediction: Test PASSES on activation — structurally identical to Test 1 (single plain sword enchantment=3, new customer, first contract = 115G). runScenario already maps steps to results so results has length 1 and results[0] equals { premium: 115 } (stepBase=100, multsPct=[110], applyMultsAndFee = ceil(100*110/100)+5 = 110+5 = 115) — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30/31/32 — this is the first sequencing test, which confirms the cycle-12 design where `runScenario` mapped over `steps` (results array length matches steps length) and uses the per-step `quoteStep`/`claimStep` dispatch from cycle 21/23. The "results array of same length and order" semantic was structurally enforced by `.map` from cycle 12 onward; this test makes that invariant explicit.

## Cycle 34 — Red: should process a quote followed by a claim referencing policy=0: amulet enchantment=2 (yearsWithMHPCO=5) => premium 58, then 200G amulet damage => payout 0
- Compilation prediction: No compilation error — runScenario accepts unknown; customer.yearsWithMHPCO, amulet item shape (type/material/enchantment/cursed), and claim step shape (op/policy/incident/cause/damages with itemType/amount) all already compiled in prior cycles — Correct
- Runtime prediction: Test PASSES on activation — Quote: amulet base 60; not cursed and enchantment=2 < HIGHLY_ENCHANTED_MIN(5), so itemSurchargeMultsPct=[]; first step + hasLoyalty(yearsWithMHPCO=5 ≥ 2) → stepMultsPct=[LOYALTY_MULT_PCT=80, FIRST_CONTRACT_MULT_PCT=110]; applyMultsAndFee(60, [80,110]) = ceil(60*80*110/100^2)+5 = ceil(52.8)+5 = 53+5 = 58G. Claim: policyStep=steps[0]; damage matches amulet item (silver, enchantment=2); reimbursementRatePct: not dragon, not isHighlyEnchantedForClaim (enchant 2 < CLAIM_HIGHLY_ENCHANTED_MIN=8) → rates=[0], Math.max(...[0])=0; damageReimbursement = 200*0/100 = 0; grossReimbursable=0; payoutAfterDeductible(0) = max(0, 0-100) = 0G. Expected `{ results: [{ premium: 58 }, { payout: 0 }] }` matches — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. This is the canonical schema example 2 (IO2 in the example mapping). Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30/31/32/33 — confirms the cycle-18 quote formula (multiplier composition with loyalty + first), cycle-23 claim pipeline (policy lookup, deductible), cycle-24 reimbursementRatePct (0-rate floor for ineligible items), cycle-25 CLAIM_HIGHLY_ENCHANTED_MIN=8 threshold, and cycle-30 payoutAfterDeductible clamp all compose correctly through the cycle-22 runScenario step-op dispatch. Two of the three remaining sequencing/empty tests likely require zero new code (cycle 35: empty steps → empty results via Array.prototype.map on []).

## Cycle 35 — Red: should return an empty results array for an empty steps array
- Compilation prediction: No compilation error — runScenario accepts unknown; empty `steps: []` satisfies Step[]; the empty object literal in the prior cycle 22 test pattern confirms Customer compat — Correct
- Runtime prediction: Test PASSES on activation — `steps.map((step, stepIndex) => ...)` on `[]` returns `[]` without invoking the callback, so runScenario returns `{ results: [] }` which matches the expected output exactly — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30/31/32/33/34. This is the IO3 (empty steps array) example confirming the cycle-12 `.map`-over-steps design: when the steps array is empty, the result array is naturally empty too. The "results array of same length and order as steps" invariant from cycle 33 holds at length 0 just as it holds at length 1+. Cycle 34 explicitly anticipated this would be a free-pass: "cycle 35: empty steps → empty results via Array.prototype.map on []".

## Cycle 36 — Red: CLI schema example 1 via stdin/stdout (sword => premium 115)
- Compilation prediction: No compilation error — `spawnSync` from `node:child_process` is a standard Node API; test spawns `npx tsx src/cli.ts` rather than importing it, so no static module dependency on `./cli.js`; the unused `runScenario` import remains valid — Correct
- Runtime prediction: First run (no `src/cli.ts`) → tsx exits non-zero with empty stdout → `expect(status).toBe(0)` fails (received 1). Created minimal placeholder `src/cli.ts` (comment-only file, the Step-4 empty-function equivalent). Re-run: tsx exits 0 with empty stdout → `expect(status).toBe(0)` passes → `JSON.parse(stdout)` throws `SyntaxError: Unexpected end of JSON input` before reaching `.toEqual` — Correct
- Discrepancies: First execution failed at the status assertion (status=1) because `src/cli.ts` didn't exist; this is the Step-3 compilation-equivalent error (file/module missing). The Step-4 fix is the minimal placeholder file that exists but does nothing — analogous to creating an empty function returning undefined. After that, the Step-6 runtime assertion error matches the prediction exactly (SyntaxError on JSON.parse of empty stdout). Green phase will implement: read all stdin, parse JSON, call `runScenario`, JSON.stringify the result to stdout.

## Cycle 36 — Green: CLI schema example 1 via stdin/stdout (sword => premium 115)
- Minimal implementation: `src/cli.ts` synchronously reads stdin (fd 0) via `readFileSync(0, "utf8")`, JSON.parses, calls `runScenario`, writes `JSON.stringify(output)` to stdout
- Tests passing: 36

## Cycle 37 — Red: CLI schema example 2 via stdin/stdout (quote amulet + claim => premium 58, payout 0)
- Compilation prediction: No compilation error — `runCli`/`spawnSync`/`runScenario` and the customer/yearsWithMHPCO/quote+claim/policy/incident/damages shapes already compiled in cycles 34/36 — Correct
- Runtime prediction: Test PASSES on activation — CLI (cycle 36) is a thin pipeline `JSON.stringify(runScenario(JSON.parse(readFileSync(0,"utf8"))))`. The runScenario call replays exactly the cycle-34 quote+claim sequence: quote = ceil(60 × 80 × 110 / 10000) + 5 = ceil(52.8) + 5 = 53 + 5 = 58; claim = max(0, 200 × 0 / 100 - 100) = 0. JSON.stringify/parse round-trip preserves integer values. Expected `{ results: [{ premium: 58 }, { payout: 0 }] }` matches stdout — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. This is the canonical schema example 2 (IO2) round-tripped through the CLI; confirms the cycle-36 one-liner CLI design correctly composes with the cycle-22 dispatch + cycle-23 claim pipeline + cycle-18 quote formula for mixed-op scenarios. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26/27/28/29/30/31/32/33/34/35.

## Cycle 38 — Red: CLI empty steps array via stdin/stdout ({results: []})
- Compilation prediction: No compilation error — runCli/spawnSync/runScenario and customer/yearsWithMHPCO/empty-steps shapes already compiled in cycles 35/36/37 — Correct
- Runtime prediction: Test PASSES on activation — CLI (cycle 36) is `JSON.stringify(runScenario(JSON.parse(readFileSync(0,"utf8"))))`; runScenario on empty steps returns `{results:[]}` (cycle 35); JSON round-trip preserves it; spawnSync status 0. Expected `{results:[]}` matches stdout — Correct
- Discrepancies: Test passes immediately on activation. Green phase will have nothing to implement. This is the canonical IO3 (empty steps array) routed through the CLI; confirms the cycle-36 one-liner CLI design composes with cycle-35's `.map`-over-empty-steps invariant correctly. Mirrors the free-passing pattern of cycles 9/11/19/21/22/26-35/37. This is the last test in the 38-test list — full kata is now green.
