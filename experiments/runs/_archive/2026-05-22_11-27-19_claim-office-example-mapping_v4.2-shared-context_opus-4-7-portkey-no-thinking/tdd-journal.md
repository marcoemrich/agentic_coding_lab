# TDD Journal
1 R | empty items 0 years -> premium 5 | comp:OK | run:OK | -
1 G | hardcoded return {results:[{premium:5}]} | passing:1
2 R | single amulet 0 years -> premium 71 | comp:OK | run:OK | comp N/A (fn already exists from prior cycle); runtime predicted Expected 71 Received 5
2 G | branch on items.length: empty->5 else->71 | passing:2
3 R | single staff 0 years -> premium 93 | comp:OK | run:OK | comp N/A (fn already exists); runtime predicted Expected 93 Received 71
3 G | branch on items[0].type: staff->93 else->71 (empty->5) | passing:3
4 R | single potion 0 years -> premium 49 | comp:OK | run:OK | comp N/A (fn already exists); runtime predicted Expected 49 Received 71
4 G | branch on items[0].type: potion->49 (staff->93, empty->5, else->71) | passing:4
5 R | single sword 0 years -> premium 115 | comp:OK | run:OK | comp N/A (fn already exists); runtime predicted Expected 115 Received undefined
5 G | add sword:115 to PREMIUM_BY_TYPE lookup | passing:5
6 R | single rune 0 years -> premium 33 | comp:OK | run:OK | comp N/A (fn already exists); runtime predicted Expected 33 Received undefined
6 G | add rune:33 to PREMIUM_BY_TYPE lookup | passing:6
7 R | 2 runes 0 years -> premium 60 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 60 Received 33
7 G | branch on type==rune && length==2 -> 60; else PREMIUM_BY_TYPE lookup | passing:7
8 R | 3 runes 0 years -> premium 71 (block applies) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 71 Received 33
8 G | branch on isThreeRunes (length==3 && all type==rune) -> 71 | passing:8
9 R | 4 runes 0 years -> premium 115 (no block) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 115 Received 33
9 G | branch on length==4 && all runes -> 115 | passing:9
10 R | 7 runes 0 years -> premium 198 (no block) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 198 Received 33
10 G | branch on length==7 && all runes -> 198 | passing:10
11 R | 2 runes + 1 moonstone -> premium 88 (no block, different types) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 88 Received undefined
11 G | branch on all-components (rune|moonstone) -> count*25 base, *1.10 ceil, +5 | passing:11
12 R | 3 runes + 3 moonstones -> premium 137 (two separate blocks) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 137 Received 170
12 G | split components by type, apply block-of-3 base per type | passing:12
12 Refactor | Removed runesPremium and isRune (duplicated componentsPremium path); renamed RUNE_* constants to COMPONENT_*; all-runes case now flows through componentsPremium with moonstones=0
13 R | cursed sword 0 years -> premium 165 | comp:OK | run:OK | comp N/A (fn and sword lookup exist); runtime predicted Expected 165 Received 115
13 G | replace single-item lookup with base + cursed(50%) + firstIns(10%) + fee | passing:13
14 R | sword enchantment 5 0 years -> premium 145 | comp:OK | run:OK | comp N/A (fn and sword lookup exist); runtime predicted Expected 145 Received 115
14 G | add highEnchSurcharge (ench>=5 ? base*0.3 : 0) to singleItemPremium | passing:14
15 R | sword enchantment 4 0 years -> premium 115 (threshold) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (115==115, ench 4 below high-ench threshold)
16 R | cursed sword enchantment 5 0 years -> premium 195 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (cursed+highEnch combine: 100+50+30+10=190, +5=195)
17 R | single sword 2-year customer -> premium 95 (loyalty applies) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 95 Received 115 (loyalty discount not yet applied)
17 G | thread customer.yearsWithMHPCO through; subtract base*0.2 when years>=2 in singleItemPremium | passing:17
18 R | 3yr customer 2nd quote cursed sword ench 7 -> premium 160 (integration ex 2) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected {premium:160} Received undefined (impl returns only results[0])
18 G | map steps to results, threading isFollowUp (index>=1) into singleItemPremium for -15% follow-up discount | passing:18
19 R | cursed sword + plain amulet 0 years -> premium 231 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected 231 Received 165 (amulet ignored, only items[0] counted)
19 G | generalize singleItemPremium to mainItemsPremium: sum itemSubtotal across items, then apply policy-level loyalty/follow-up | passing:19
20 R | premium rounding up 197.5->198 (7 runes case) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (duplicate of test 10; ceil already in premiumFromBase: 175*1.10=192.5->193+5=198)
21 R | sword policy (insurance 1000, cap 2000) dmg 500 -> payout 400 remainingCap 1600 | comp:OK | run:OK | comp N/A (no new types/exports needed); runtime predicted Expected {payout:400,remainingCap:1600} Received {payout:0,remainingCap:0} (added claim branch stub returning zeros)
21 G | track PolicyState by quote index (insurance sum from INSURANCE_VALUE_BY_TYPE, cap=2*sum); claim sums max(0,amount-100) per damage, deducts from remainingCap | passing:21
22 R | rune policy (insurance 250 cap 500) dmg 200 -> payout 100 remainingCap 400 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected remainingCap 400 Received NaN (INSURANCE_VALUE_BY_TYPE has no rune entry, undefined propagates through reduce)
22 G | add rune:250 to INSURANCE_VALUE_BY_TYPE | passing:22
23 R | sword+amulet policy multi-item deductible -> payout 600 remainingCap 2600 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected remainingCap 2600 Received NaN (INSURANCE_VALUE_BY_TYPE has no amulet entry)
23 G | add amulet:600 to INSURANCE_VALUE_BY_TYPE | passing:23
23 Rf | Extracted reimbursementFor(damage) helper from computeClaim reduce. Considered unifying BASE_PREMIUM_BY_TYPE + INSURANCE_VALUE_BY_TYPE — rejected (different key sets, would anticipate). 23/23 pass.
24 R | dragon sword ench 8 dmg 1000 -> payout 400 remainingCap 1600 (50% high-ench wins) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected {payout:400,remainingCap:1600} Received {payout:900,remainingCap:1100} (reimbursementFor ignores enchantment)
24 G | reimbursementFor takes items, looks up by itemType, applies 50% when ench>=8 before deductible | passing:24
25 R | dragon sword ench 9 dmg 1000 -> payout 400 remainingCap 1600 (both apply; 50% wins) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (ench 9>=8 triggers 50% rate, same as test 24; impl already covers this case regardless of dragon material)
26 R | dragon sword ench 5 dmg 800 -> payout 700 remainingCap 1300 (dragon only) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (ench 5<8 so rate=1; 800-100=700; full reimbursement already default behavior, dragon material currently ignored but result coincides)
27 R | steel sword ench 9 dmg 1000 -> payout 400 remainingCap 1600 (50% high-ench only) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (impl already triggers 50% rate on ench>=8 regardless of material; matches test 25 outcome)
28 R | dragon sword ench 8 dmg 901 -> payout 350 remainingCap 1650 (rounding DOWN) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted Expected {payout:350,remainingCap:1650} Received {payout:350.5,remainingCap:1649.5} (reimbursementFor has no rounding)
28 G | wrap payout sum in Math.floor before subtracting from remainingCap | passing:28
29 R | two swords policy -> insurance sum 2000 cap 4000 (revealed via dmg 50 -> payout 0 remainingCap 4000) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (insuranceSumFor already sums per-item: 1000+1000=2000; cap=2*2000=4000; dmg 50 yields max(0,50-100)=0; remainingCap stays 4000)
30 R | two swords dragon both damaged 500 each -> payout 800 remainingCap 3200 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (damages.reduce sums per-entry: each max(0,500-100)=400; total 800; cap 4000-800=3200; ench 0 < 8 so rate=1)
31 R | cursed sword policy -> cap 2000 (unmodified insurance value, premium mods do not raise cap) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (cap=2*INSURANCE_VALUE_BY_TYPE.sword=2000 regardless of cursed flag; dmg 50 yields max(0,50-100)=0; remainingCap unchanged)
32 R | sword+3runes policy -> insurance sum 1750 cap 3500 (revealed via dmg 50 -> payout 0 remainingCap 3500) | comp:OK | run:OK | comp N/A (fn exists); runtime predicted PASS (insuranceSumFor sums sword 1000 + 3*250 = 1750, cap=2*1750=3500; dmg 50 yields max(0,50-100)=0; runes already in INSURANCE_VALUE_BY_TYPE from test 22)
33 R | cap exhaustion sword two 1500 claims -> 1400/600 then 600/0 | comp:OK | run:OK | comp N/A (fn exists); runtime predicted second claim payout=1400 remainingCap=-800 (no cap clamping on reimbursement)
33 G | clamp payout to min(computedPayout, remainingCap) before deducting from remainingCap | passing:33
34 R | multi-step quote+claim referencing policy 0 -> results array order/length | comp:OK | run:OK | comp N/A (runScenario exists, input shape matches); runtime predicted PASS (amulet 0yr quote=71; amulet claim 200 -> payout 100 remainingCap 1100; impl already maps steps in order)
35 R | CLI unknown item type broomstick -> non-zero exit, stderr mentions broomstick, no results on stdout | comp:OK | run:OK | comp stage predicted tsx ERR_MODULE_NOT_FOUND for src/cli.ts (file missing) -> stderr.toMatch(/broomstick/) fails; runtime stage predicted empty src/cli.ts exits 0 -> status.not.toBe(0) fails
35 G | created src/cli.ts (stdin->JSON.parse->runScenario->stdout, catch->stderr+exit(1)); added KNOWN_ITEM_TYPES check in runScenario throwing Error with bad type name | passing:35
35 F | extracted validateItemTypes helper from runScenario; names clear; tests 35/35
36 R | CLI claim references item type not in policy (amulet dmg when only sword insured) -> non-zero exit, stderr mentions amulet, no results stdout | comp:OK | run:OK | comp N/A (runCli+runScenario exist); runtime predicted status===0 (CLI returns payout 100 since reimbursementFor treats missing item as rate=1)
36 G | reimbursementFor throws when items.find returns undefined | passing:36
37 R | CLI claim damage unknown item type (broomstick) -> non-zero exit, stderr mentions broomstick, no results stdout | comp:OK | run:OK | comp N/A (runCli+runScenario exist); runtime predicted PASS (reimbursementFor throws on items.find undefined regardless of whether type is unknown or merely not in policy; same code path as test 36, message includes "broomstick")
38 R | CLI claim more sword damages than swords insured -> non-zero exit, stderr mentions sword, no results stdout | comp:OK | run:OK | comp N/A (runCli+runScenario exist, no new symbols); runtime predicted CLI exits 0 (reimbursementFor finds first sword for both damage entries, both get paid, no error thrown)
38 G | rejectIfMoreDamagesThanInsured counts damages and items by type, throws when any damage count exceeds item count | passing:38
39 R | CLI claim with negative damage amount -> non-zero exit, stderr mentions negative, no results stdout | comp:OK | run:OK | comp N/A (runCli+runScenario exist, no new symbols); runtime predicted CLI exits 0 (Math.max(0, -200-100) clamps to 0 payout, no validation, no error thrown)
39 G | computeClaim throws Error mentioning non-negative when any damage.amount<0 | passing:39
