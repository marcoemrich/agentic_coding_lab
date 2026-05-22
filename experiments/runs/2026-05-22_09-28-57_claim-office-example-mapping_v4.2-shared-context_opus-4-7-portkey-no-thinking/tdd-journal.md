# TDD Journal
1 R | empty item list returns premium 5 G | comp:OK | run:OK | -
1 G | return 5 hardcoded | passing:1
2 R | plain sword 115 G | comp:OK (no error, fn already exists) | run:OK | -
2 G | return 115 hardcoded when items non-empty | passing:2
3 R | plain amulet 71 G | comp:OK (no error, fn exists) | run:OK | -
3 G | return 71 when first item is amulet | passing:3
4 R | plain staff 93 G | comp:OK (no error, fn exists) | run:OK | -
4 G | return 93 when first item is staff | passing:4
5 R | plain potion 49 G | comp:OK (no error, fn exists) | run:OK | -
5 G | generalize: BASE_PREMIUMS lookup + 10% first-ins per item + fee | passing:5
6 R | 2 runes 60 G | comp:OK (no error, fn exists) | run:OK (NaN vs 60) | -
6 G | add rune:25 to BASE_PREMIUMS | passing:6
7 R | 3 runes block 71 G | comp:OK (no error, fn exists) | run:OK (87.5 vs 71) | -
7 G | when runeCount==3 apply block adjustment (60-75=-15) to baseSum | passing:7
8 R | 4 runes 115 G (no block) | comp:OK (fn exists) | run:OK (test passes immediately, runeCount!=3 bypasses block, 100+10+5=115) | -
9 R | 7 runes 198 G (rounding up from 197.5) | comp:OK (fn exists) | run:OK (197.5 vs 198) | -
9 G | wrap final return in Math.ceil | passing:9
10 R | 2 runes + 1 moonstone 88 G | comp:OK (fn exists) | run:OK (NaN vs 88) | -
10 G | add moonstone:25 to BASE_PREMIUMS | passing:10
11 R | 3 runes + 3 moonstones 137 G (two separate blocks) | comp:OK (fn exists) | run:OK (154 vs 137; moonstone block not applied) | -
11 G | generalize block logic: iterate component types, apply discount per type with exactly 3 | passing:11
12 R | cursed sword newcomer 165 G | comp:OK (fn exists) | run:OK (115 vs 165) | -
12 G | add curseSurcharge = sum of base*0.5 for cursed items, applied after first-ins calc | passing:12
13 R | cursed sword + plain amulet 231 G | comp:OK (fn exists) | run:OK (test passes immediately; per-item curse sum already covers multi-item) | -
14 R | sword ench=5 145 G | comp:OK (fn exists) | run:OK (115 vs 145) | -
14 G | add highEnchantmentSurcharge = sum of base*0.3 for items with enchantment>=5 | passing:14
14 Ref | extract percentageSurcharge(rate,predicate) helper to dedupe curseSurcharge/highEnchantmentSurcharge | tests:14 green
15 R | sword ench=4 115 G (no high-ench) | comp:OK (fn exists) | run:OK (test passes immediately; predicate uses >=5 so ench 4 excluded) | -
16 R | cursed sword ench=5 195 G | comp:OK (fn exists) | run:OK (test passes immediately; curse+high-ench surcharges already combine additively) | -
17 R | 2-year customer plain sword 95 G | comp:OK (fn exists, customer already typed) | run:OK (115 vs 95; loyalty not yet implemented) | -
17 G | subtract adjustedBase*0.20 loyalty discount when customer.yearsWithMHPCO>=2 | passing:17
18 R | 3yr customer 2nd quote cursed sword ench=7 160 G | comp:FAIL (vitest no typecheck; excess prop accepted) | run:OK (175 vs 160; follow-up discount not implemented) | typecheck disabled — TS excess-property error did not surface
18 G | add previousContracts to Customer + subtract adjustedBase*0.15 when previousContracts>=1 | passing:18
18 Refactor | extracted proportionalDiscount helper, added FOLLOW_UP_CONTRACTS_THRESHOLD const | tests:18 passing
19 R | steel sword ench 3 damage 500 → payout 400, remCap 1600 | comp:OK (surfaced as runtime TypeError: claim is not a function; typecheck disabled) | run:OK (stub returns {0,0} vs {400,1600}) | -
19 G | hardcode claim to return {payout:400, remainingCap:1600} | passing:19
19 Ref | no refactor: hardcoded stub already minimal (mass 4); extracting constants would anticipate next test (rune claim 100/400) | tests:19 green
20 R | rune damage 200 → payout 100, remCap 400 | comp:OK (fn exists, signature compatible) | run:OK ({400,1600} vs {100,400}) | -
20 G | generalize claim: INSURANCE_VALUES lookup, cap=2×sum, payout=sum(max(0,amount-100)), remCap=cap-payout | passing:20
21 R | dragon attack sword 500 + amulet 300 → payout 600 remCap 2600 | comp:OK (fn exists) | run:OK (test passes immediately; multi-damage reduce already in place from cycle 20) | -
22 R | steel sword ench 9 damage 1000 → payout 400 remCap 1600 (50% rule) | comp:OK (fn exists) | run:OK ({900,1100} vs {400,1600}) | -
22 G | look up item by itemType in policy.items; if enchantment>=8 halve amount before deductible | passing:22
22 Refactor | extracted reimbursableAmount helper for clarity (Rule 2); 22/22 green
23 R | dragon sword ench 5 damage 800 → payout 700 remCap 1300 | comp:OK (fn exists) | run:OK (test passes immediately; ench<8 falls through to full damage which equals dragon-full behavior) | -
24 R | dragon sword ench 9 dmg 1000 → 400 remCap 1600 (50% wins over dragon-full) | comp:OK (fn exists) | run:OK (test passes immediately; 50% rule already wins because reimbursableAmount checks enchantment ignoring material) | -
25 R | dragon sword ench exactly 8 dmg 1000 → 400 remCap 1600 (50% applies at threshold) | comp:OK (fn exists) | run:OK (test passes immediately; threshold uses >=8 so ench=8 triggers 50% rule) | -
26 R | cap exhaustion two 1500 G claims → 1400/600 then 600/0 | comp:OK (fn exists, typecheck disabled so excess remainingCap prop accepted) | run:OK (second call returned {1400,600} vs expected {600,0}) | -
26 G | Policy.remainingCap optional; cap = policy.remainingCap ?? CAP_MULTIPLIER*insuranceSum; clip payout via Math.min(rawPayout, cap) | passing:26
27 R | cursed sword cap remains 2000 G | comp:OK (fn exists, Item interface compatible) | run:OK (test passes immediately; INSURANCE_VALUES lookup ignores cursed flag, min-clip from cycle 26 caps 2900 at 2000) | -
28 R | sword + 3 runes insurance sum 1750 G cap 3500 G | comp:OK (fn exists) | run:OK (test passes immediately; claim uses raw INSURANCE_VALUES per type ignoring block discount which lives only in quote) | -
29 R | two swords both damaged 500 → payout 800 remCap 3200 | comp:OK (fn exists) | run:OK (test passes immediately; insuranceSum sums per item so 2×1000=2000 → cap 4000, multi-damage reduce already gives 400+400=800) | -
30 R | sword ench 9 damaged 901 → payout 350 remCap 1650 (rounding down) | comp:OK (fn exists, signature unchanged) | run:OK ({350.5, 1649.5} vs {350, 1650}) | -
30 G | wrap Math.min(rawPayout, availableCap) in Math.floor; remCap recomputed from floored payout | passing:30
31 R | CLI quote-only scenario via runScenario | comp:OK (./cli.js missing → Failed to load url) | run:OK (empty stdout → JSON.parse SyntaxError) | -
31 G | parse JSON, map steps to {premium: quote(customer, items)}, write JSON.stringify({results}) | passing:31
31 RF | cli.ts: extracted Scenario/QuoteStep types from inline {items: Parameters<typeof quote>[1]}; imports Customer/Item from claim-office. Better reveals intent (Rule 2), fewer awkward elements (Rule 4). No anticipation of claim op.
32 R | CLI quote-then-claim scenario yields {premium} then {payout, remainingCap} | comp:OK (typecheck disabled; first run produced TypeError because previous CLI mapped every step through quote(items) and claim step lacked items) | run:OK ({premium:115},{} vs expected {payout:400,remainingCap:1600}) | -
32 G | for claim step, look up policy step by index, call claim({items}, incident) | passing:32
33 R | CLI unknown item type ({type:'broomstick'}) → non-zero exit, stderr, no stdout | comp:OK (fn exists, types compatible) | run:OK (exitCode 0 vs expected non-zero; runScenario has no validation) | -
33 G | validate item types in quote steps against KNOWN_ITEM_TYPES set, return error result early | passing:33
34 R | CLI claim references itemType not in referenced policy → non-zero exit, stderr, no stdout | comp:OK (fn exists, signature unchanged) | run:OK (exitCode 0 vs expected non-zero; runScenario has no claim-itemType-in-policy validation) | -
34 G | for claim step, validate damage itemTypes against referenced policy items; return error result if any missing | passing:34
34 F | refactor cli runScenario: merged two-pass validation+processing into single loop; eliminated duplicate policyStep lookup (mass 76 -> ~62)
35 R | CLI claim with negative damage amount (-200) → non-zero exit, stderr | comp:OK (fn exists, signature unchanged) | run:OK (exitCode 0 vs expected non-zero; runScenario doesn't validate damage.amount sign) | -
35 G | inside damage loop: if damage.amount<0 return error result | passing:35
35 F | extracted errorResult helper in cli.ts to remove duplication of {stdout:'',stderr,exitCode:1} shape (3 sites)
36 R | CLI claim with more damages of a type (2 swords) than policy contains (1 sword) → non-zero exit, stderr | comp:OK (fn exists, signature unchanged) | run:OK (exitCode 0 vs expected non-zero; runScenario has no per-type damage-count validation) | -
36 G | count damages per itemType, error if count > policy items of that type | passing:36
