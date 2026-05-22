# TDD Journal
1 R | empty items list returns premium 5 (processing fee only) | comp:OK | run:OK | -
1 G | hardcode runScenario to return {results:[{premium:5}]} | passing:1
2 R | single plain sword (0 years, 1st contract) returns premium 115 | comp:OK | run:OK | -
2 G | branch on items.length: empty→5 else hardcode 115 | passing:2
2 F | extract ScenarioInput type alias; destructure steps (Rule 2 clarity) | passing:2
3 R | single plain amulet returns premium 71 | comp:OK | run:OK | -
3 G | branch on items[0].type: amulet→71 else→115 (empty→5) | passing:3
4 R | single plain staff (0 years, 1st contract) returns premium 93 | comp:OK | run:OK | -
4 G | add staff:93 to PREMIUM_BY_TYPE lookup | passing:4
5 R | single plain potion (0 years, 1st contract) returns premium 49 | comp:OK | run:OK | -
5 G | add potion:49 to PREMIUM_BY_TYPE lookup | passing:5
6 R | 2 runes returns premium 60 (no block; 50 + 5 first-ins + 5 fee) | comp:OK | run:OK | -
6 G | add rune:60 to PREMIUM_BY_TYPE lookup | passing:6
7 R | 3 runes — block applies — premium 71 | comp:OK | run:OK | -
7 G | special-case rune length===3 → 71, else fall through to lookup | passing:7
7 F | extract RUNE_BLOCK_PREMIUM=71 constant (Rule 2 clarity; names the magic number) | passing:7
8 R | 4 runes — no block — premium 115 | comp:OK | run:OK | -
8 G | special-case rune length===4 → 115, else fall through to lookup | passing:8
8 F | extract FOUR_RUNES_PREMIUM=115 constant (Rule 2 clarity; names magic literal); avoided formula extraction to prevent anticipating upcoming tests | passing:8
9 R | 7 runes — base 175; premium 198 (197.5 rounded up) | comp:OK | run:OK | -
9 G | special-case rune length===7 → 198, else fall through to lookup | passing:9
10 R | 2 runes + 1 moonstone — different types, no block — premium 88 | comp:OK | run:OK | -
10 G | replace lookups with real per-group computation: group components by type, block-of-3 rule per group, integer tenths for first-ins to avoid float drift, ceil + fee | passing:10
11 R | 3 runes + 3 moonstones — two separate blocks — premium 137 | comp:OK | run:OK | test passed immediately — cycle 10's per-type grouping already covers this; confirmatory test, no new failure
12 R | cursed sword (steel, enchantment 3), 0 years, 1st contract — premium 165 | comp:OK (no error — runScenario already accepts cursed/enchantment fields via unknown input) | run:OK (got 115, expected 165) | -
12 G | add curseSurcharge(items) = sum of 50% of item base for cursed items; add as separate term inside ceil before fee | passing:12
13 R | sword enchantment exactly 5 (not cursed), 0 yrs, 1st contract — premium 145 | comp:OK (no error — enchantment passes via unknown cast) | run:OK (got 115, expected 145) | -
13 G | add highEnchantmentSurcharge(items) = sum of 30% of item base for items with enchantment>=5; add as separate term inside ceil before fee | passing:13
14 R | sword enchantment 4 (steel, not cursed), 0 yrs, 1st contract — premium 115 | comp:OK | run:OK | test passed immediately — cycle 13's >=5 threshold already excludes 4; confirmatory test, no new failure
15 R | cursed sword enchantment 5 (steel), 0 yrs, 1st contract — premium 195 (both surcharges stack) | comp:OK | run:OK | test passed immediately — cycles 12+13 added curse and high-ench as separate additive terms, so stacking is automatic; confirmatory test, no new failure
16 R | long-standing customer (yearsWithMHPCO=2), plain sword, 1st contract — premium 95 (100 + 10 first-ins − 20 loyalty + 5 fee) | comp:OK (customer field passes via unknown cast) | run:OK (got 115, expected 95) | -
16 G | destructure customer from input; subtract 20% of policy base as loyalty when yearsWithMHPCO>=2 | passing:16
17 R | multi-item: cursed sword + plain amulet, 0 yrs, 1st contract — premium 231 | comp:OK | run:OK | test passed immediately — cycle 10's multi-item policyBase loop + cycle 12's per-item curseSurcharge already cover this scope (curse applies to sword's 100, not policy total); confirmatory test, no new failure
18 R | long-standing customer 2nd quote — cursed sword (steel, ench 7), 3 yrs — premium 160 (1st quote 175, 2nd 160 with -15 follow-up) | comp:OK (no error — additional step passes via unknown cast) | run:OK (got results length 1 with [175], expected length 2 with [175, 160]) | -
18 G | extract quotePremium(customer,items,quoteIndex); map over steps; subtract 15% follow-up when quoteIndex>0 | passing:18
17 F | extracted surcharges/discounts in quotePremium; tests green
19 R | regular steel sword (ench 3), damage 500 → payout 400, remainingCap 1600 | comp:OK | run:OK | initial fail: items-not-iterable (no claim-step branch); after stub returns undefined payout/remainingCap as expected
19 G | add insurance value lookup (sword=1000, comp=250); compute cap=2×insuranceSum on quote, track per-policy remainingCap, payout=sum(damage−100 deductible) | passing:19
20 R | rune (insurance 250) damage 200 → payout 100, remainingCap 400 | comp:OK | run:OK | test passed immediately — cycle 19's insuranceValueOf already returns 250 for components and deductible loop handles any itemType; confirmatory test, no new failure
21 R | sword+amulet policy, damages [sword 500, amulet 300] → payout 600, remainingCap 2600 | comp:OK | run:OK | test passed immediately — cycle 19's per-damage deductible loop + multi-item insuranceSum already cover this; confirmatory test, no new failure
22 R | dragon-material sword, ench 9, damage 1000 → payout 400 (50% rule wins) | comp:OK | run:OK | got payout 900 remainingCap 1100, expected 400/1600 — current impl lacks high-ench 50% rule and dragon-material clause
22 G | store policyItems on quote; in claim look up matching item by itemType; reimbursementFor halves amount when enchantment>=8 else full, then deductible | passing:22
23 R | dragon-material sword, ench 5, damage 800 → payout 700 (only dragon-material clause) | comp:OK | run:OK | test passed immediately — cycle 22's reimbursementFor returns full amount when enchantment<8 (no halving), so dragon-material at ench 5 produces full 800 − 100 = 700 by default; confirmatory test, no new failure
24 R | steel sword, ench 9, damage 1000 → payout 400 (only high-enchantment clause) | comp:OK | run:OK | test passed immediately — cycle 22's reimbursementFor checks enchantment>=8 regardless of material; ench 9 → 500, − 100 = 400; confirmatory test, no new failure
25 R | dragon-material sword, ench exactly 8, damage 1000 → payout 400 (high-ench wins at boundary 8) | comp:OK | run:OK | test passed immediately — cycle 22's >=8 threshold covers exact boundary; reimbursementFor halves to 500, minus 100 deductible = 400; confirmatory test, no new failure
26 R | sword policy (insurance 1000, cap 2000): first claim of 1500 → payout 1400, remainingCap 600 | comp:OK | run:OK | test passed immediately — cycle 19's deductible-only payout (1500−100=1400) plus cap bookkeeping (2000−1400=600) already covers this; no special clauses involved; cap-exhaustion logic itself will be exercised by the next test (second claim of 1500 against remainingCap 600)
27 R | sword policy after first claim (remainingCap 600): second claim 1500 → payout 600, remainingCap 0 | comp:OK | run:OK | got payout 1400 remainingCap -800, expected 600/0 — current impl lacks cap-clamping (payout not reduced to remaining cap; cap not floored at 0)
27 G | clamp payout = Math.min(desiredPayout, remainingCap) before deducting; cap naturally reaches 0 | passing:27
28 R | sword+amulet policy — insurance sum 1600, cap 3200 verified via damages [sword 1900, amulet 300] → payout 2000, remainingCap 1200 | comp:OK | run:OK | test passed immediately — cycle 19's multi-item insuranceSum + cap=2×sum already covers this; payout 2000 < cap 3200 so no clamping needed; confirmatory test, no new failure
29 R | sword + 3 runes (block) policy — insurance sum 1750, cap 3500 verified via damages [sword 1900, rune 1700] → payout 3400, remainingCap 100 | comp:OK | run:OK | test passed immediately — cap is computed from raw insuranceValueOf (sword 1000 + 3×rune 250 = 1750), block discount only affects policyBase premium computation, not insurance sum; confirmatory test, no new failure
30 R | cursed sword → cap 2000 (premium modifiers do not raise cap): damage 1900 → payout 1800, remainingCap 200, premium 165 | comp:OK | run:OK | test passed immediately — cap derives from raw insuranceValueOf(sword)=1000 × CAP_MULTIPLIER=2, independent of quotePremium's curse surcharge; confirmatory test, no new failure
31 R | payout 350.5 rounded down to 350 (dragon sword, ench 9, damage 901) | comp:OK | run:OK | got payout 350.5 remainingCap 1649.5, expected 350/1650 — current impl applies no floor to payout
31 G | wrap Math.min(desiredPayout, remainingCap) in Math.floor so final payout is integer (remainingCap then subtracts floored payout) | passing:31
32 R | policy with two swords — insurance sum 2000, cap 4000 (verified via sword damage 2500 under cap 4000) — premium 225, payout 2400, remainingCap 1600 | comp:OK | run:OK | test passed immediately — cycle 19's insuranceSum iterates all items so two swords stack to 2000; cap=2×2000=4000; reimbursement 2500−100=2400 under cap; confirmatory test, no new failure
33 R | two swords, damages [sword 500, sword 500] → payout 800, remainingCap 3200 (per-damage deductible) | comp:OK | run:OK | test passed immediately — cycle 19's per-damage deductible loop + cycle 32's multi-sword insuranceSum stacking already cover this; each damage entry independently deducts 100 (400+400=800) under cap 4000; confirmatory test, no new failure
34 R | CLI processes schema example (amulet quote yrs=5 + amulet damage 200) → [{premium:59},{payout:100,remainingCap:1100}] via spawn npx tsx src/cli.ts | comp:OK (no TS error; CLI is subprocess) | run:OK (stage1: missing cli.ts → exit 1; stage2: empty cli stub → JSON.parse("") throws "Unexpected end of JSON input") | -
34 G | minimal cli.ts: read stdin, call runScenario(JSON.parse), write JSON.stringify to stdout | passing:34
35 R | CLI integration E-int1: newcomer cursed sword → premium 165 via spawn cli.ts | comp:OK | run:OK | test passed immediately — cli.ts (cycle 34) is a thin wrapper around runScenario; cursed sword premium 165 already covered by cycle 12; confirmatory test, no new failure
36 R | CLI integration E-int2: long-standing 3yr customer's two quotes (cursed sword steel ench 7) → [{premium:175},{premium:160}] via spawn cli.ts | comp:OK | run:OK | test passed immediately — cli.ts thin wrapper + cycle 18's two-quote follow-up discount logic already produce the exact E-int2 output; confirmatory test, no new failure
37 R | CLI: quote with unknown item type ({type:'broomstick'}) → exit non-zero, stderr error, no 'results' on stdout | comp:OK | run:OK | got status 0 (CLI accepts unknown type, undefined base premium → NaN → JSON null on stdout); expected non-zero exit with stderr
37 G | add KNOWN_ITEM_TYPES set; runScenario throws on unknown type in quote items; cli.ts try/catch writes err.message to stderr and process.exit(1) | passing:37
26 F | Refactor: replaced literal KNOWN_ITEM_TYPES set with one derived from Object.keys(ITEM_INSURANCE_VALUE) and COMPONENT_TYPES. Rule 3 (no duplication) — single source of truth for known item types. Mass locally 9 -> 5. All 37 tests green.
38 R | CLI: claim references item type not in policy (amulet damage, sword-only policy) → non-zero exit, stderr | comp:OK | run:OK | test passed immediately — current impl: items.find returns undefined, reimbursementFor accesses item.enchantment → TypeError, caught by cli.ts try/catch (cycle 37) → exit 1 with stderr. Confirmatory test; existing implicit error path satisfies contract.
39 R | CLI: claim references unknown item type (broomstick) in damages → non-zero exit, stderr | comp:OK | run:OK | test passed immediately — same TypeError path as cycle 38: items.find returns undefined for any itemType absent from policyItems (whether unknown or merely missing), cli.ts try/catch maps it to exit 1 with stderr. Confirmatory test; no implementation change.
40 R | CLI: claim has more damage entries of a type than items insured (two sword damages, one sword insured) → non-zero exit, stderr | comp:OK | run:OK (got proc.status 0, expected non-zero — items.find re-matches the same sword for both damages, no count-vs-damages validation) | -
40 G | in claim branch, count damages per itemType vs insured items per type; throw if any damage count exceeds insured count (cli.ts try/catch yields non-zero exit + stderr) | passing:40
29 X | extracted validateDamageCountsAgainstInsured from runScenario claim branch (reveals intent) | tests:40
41 R | CLI: claim damage entry amount -200 → non-zero exit, stderr | comp:OK | run:OK | got proc.status 0 expected non-zero — no negative-amount validation in runScenario claim branch
41 G | in claim branch, throw if any damage.amount < 0 (cli.ts try/catch yields non-zero exit + stderr) | passing:41
41 X | extracted validateKnownItemTypes from quote branch and validateDamageAmounts from claim branch in runScenario (3 validators now form a symmetric family; runScenario body reads as validate-then-act) | tests:41
