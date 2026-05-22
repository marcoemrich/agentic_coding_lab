# TDD Journal
1 R | empty item list → premium 5 G | comp:OK | run:OK | -
1 G | return hardcoded { results: [{ premium: 5 }] } | passing:1
2 R | single sword → premium 115 G | comp:OK | run:OK | -
2 G | map steps: empty items→5, else→115 | passing:2
3 R | single amulet → premium 71 G | comp:OK | run:OK | -
3 G | branch on items[0].type === "amulet" → 71, else → 115 | passing:3
4 R | single staff → premium 93 G | comp:OK | run:OK | -
4 G | branch on items[0].type === "staff" → 93 | passing:4
5 R | single potion → premium 49 G | comp:N/A | run:OK | function already exists, no compilation error expected
5 G | add potion: 49 to PREMIUM_BY_ITEM_TYPE lookup | passing:5
6 R | single rune → premium 33 G | comp:N/A | run:OK | function already exists, no compilation error expected
6 G | add rune: 33 to PREMIUM_BY_ITEM_TYPE lookup | passing:6
7 R | 2 runes → premium 60 G | comp:N/A | run:OK | function already exists, no compilation error expected
7 G | sum base premiums per item, premium = ceil(base + base/10) + 5 | passing:7
8 R | 3 runes (block of 3) → premium 71 G | comp:N/A | run:OK | function already exists, no compilation error expected
8 G | group items by type, hardcode rune count===3 → 60, else count*base | passing:8
9 R | 4 runes (no block) → premium 115 G | comp:N/A | run:OK | test passes immediately, current impl handles count!==3 via count*25
10 R | 7 runes (no block) → premium 198 G | comp:N/A | run:OK | test passes immediately, current impl handles count!==3 via count*25
11 R | 2 runes + 1 moonstone → premium 88 G | comp:N/A | run:OK | function already exists, no compilation error expected
11 G | add moonstone: 25 to BASE_PREMIUM_BY_ITEM_TYPE lookup | passing:11
12 R | 3 runes + 3 moonstones (two blocks) → premium 137 G | comp:N/A | run:OK | function already exists, no compilation error expected
12 G | extend block-of-3 condition to include moonstone | passing:12
12 Ref | rename RUNE_BLOCK_OF_3_PRICE→BLOCK_OF_3_PRICE; extract BLOCK_ELIGIBLE_TYPES set; intent clarified, mass roughly unchanged | passing:12
13 R | sword enchantment 4, not cursed → premium 115 G | comp:N/A | run:OK | test passes immediately, current impl ignores enchantment & cursed; sword base 100 + 10 + 5 = 115
14 R | sword enchantment 5, not cursed → premium 145 G | comp:N/A | run:OK | function already exists; current impl returns 115 (ignores enchantment), expected 145
14 G | sum +30% surcharge on base for each item with enchantment>=5 | passing:14
15 R | cursed sword enchantment 5 → premium 195 G | comp:N/A | run:OK | function already exists; current impl ignores cursed, returns 145, expected 195
15 G | add +50% curse surcharge on base for each cursed item | passing:15
16 R | plain sword, customer 2 yrs (loyalty) → premium 95 G | comp:N/A | run:OK | function already exists; current impl ignores yearsWithMHPCO, returns 115, expected 95
16 G | thread yearsWithMHPCO into quotePremium; subtract 20% of policyBase when years>=2 | passing:16
17 R | cursed sword + plain amulet → premium 231 G | comp:N/A | run:OK | test passes immediately, current impl correctly computes policyBase=160, curse surcharge=50, firstIns=16, fee=5 → 231
18 R | integration newcomer cursed sword ench 3 → premium 165 G | comp:N/A | run:OK | test passes immediately, current impl: 100 base + 50 curse + 10 firstIns + 5 fee = 165 (ench 3 < 5 threshold)
19 R | integration long-standing 3yrs 2nd quote cursed sword ench 7 → premium 160 G | comp:N/A | run:OK | function already exists; current impl returns 175 (missing −15 follow-up discount on 2nd step), expected 160
19 G | thread step index into quotePremium; subtract 15% of policyBase when index>=1 | passing:19
20 R | sword damage 500 → payout 400, remainingCap 1600 | comp:N/A | run:OK | function already exists; claim step currently treated as quote returning { premium: 5 }
20 G | dispatch on step.op; claim: cap=2×sum(insuranceValue), payout=floor(sum(amount-100)), track remainingCap per policy; quoteIndex separate from step index | passing:20
21 R | rune damage 200 → payout 100, remainingCap 400 | comp:N/A | run:OK | test passes immediately, INSURANCE_VALUE_BY_ITEM_TYPE.rune=250 already in lookup; cap=500, payout=100, remainingCap=400
22 R | dragon sword ench 5 damage 800 → payout 700, remainingCap 1300 | comp:N/A | run:OK | test passes immediately; dragon clause (full reimburse then deductible) yields 800-100=700 same as current standard rule; cap=2000, remainingCap=1300
23 R | steel sword ench 9 damage 1000 → payout 400, remainingCap 1600 | comp:N/A | run:OK | function exists, current impl ignores enchantment so returns payout 900 remainingCap 1100, expected 400/1600
23 G | lookup insured item by type in damages; if enchantment>=8 halve amount before deductible | passing:23
24 R | dragon sword ench 9 damage 1000 → payout 400, remainingCap 1600 | comp:N/A | run:OK | test passes immediately; current impl halves at ench>=8 regardless of material → 1000*0.5-100=400, cap 2000-400=1600
25 R | dragon sword ench 8 damage 1000 → payout 400, remainingCap 1600 | comp:N/A | run:OK | test passes immediately; HIGH_ENCHANTMENT_PAYOUT_THRESHOLD=8 with >= triggers at exactly 8: 1000*0.5-100=400, cap 2000-400=1600
26 R | sword+amulet damages [500,300] → payout 600, remainingCap 2600 | comp:N/A | run:OK | test passes immediately; reduce(amount-100) sums 400+200=600, cap=2×1600=3200, remainingCap=2600
27 R | two swords damages [sword 500, sword 300] → payout 600, remainingCap 3400 | comp:N/A | run:OK | test passes immediately; cap=2×(1000+1000)=4000, find returns first sword (ench 0), no enchantment adjustment, (500-100)+(300-100)=600, remainingCap=3400
28 R | cap exhaustion: sword two claims of 1500 → 1400/600 then 600/0 | comp:N/A | run:OK | test passes immediately; remainingCapByPolicy persists across claim steps, Math.min caps payout at remaining cap
29 R | rounding down dragon sword ench 9 damage 901 → payout 350 remainingCap 1650 | comp:N/A | run:OK | test passes immediately; Math.floor(450.5-100)=350, cap=2000-350=1650
30 R | cap unmodified by cursed: cursed sword damage 300 → payout 200 remainingCap 1800 | comp:N/A | run:OK | test passes immediately; cap uses INSURANCE_VALUE_BY_ITEM_TYPE.sword=1000, 2×1000=2000, 300-100=200 payout, 2000-200=1800
31 R | block discount does not lower insurance sum: sword + 3 runes damage 300 → payout 200 remainingCap 3300 | comp:N/A | run:OK | test passes immediately; insurance sum=1000+3×250=1750, cap=3500, payout=200, remainingCap=3300
32 R | CLI reads scenario JSON from stdin writes results JSON | comp:N/A | run:OK | cli.ts did not exist; created stub writing "{}" — runtime prediction (received {} vs expected results) held
32 G | cli.ts: collect stdin chunks, JSON.parse, processScenario, JSON.stringify to stdout | passing:32
33 R | CLI quote result shape { premium: <integer> } amulet 5yrs | comp:N/A | run:OK | test passes immediately, current impl returns { premium: 59 } an integer matching shape
34 R | CLI claim result shape { payout, remainingCap } amulet 5yrs damage 200 | comp:N/A | run:OK | test passes immediately, current impl returns results[1]={ payout: 100, remainingCap: 1100 } both integers matching shape
35 R | CLI multi-step quote+claim returns results length 2 with shapes | comp:N/A | run:OK | test passes immediately, current CLI+processScenario already handles multi-step amulet quote+claim returning premium=59 and { payout:100, remainingCap:1100 }
36 R | CLI unknown item type → non-zero exit, stderr, no results | comp:N/A | run:OK | function exists; current impl returns NaN→null in JSON results with exit 0, expected non-zero exit + stderr + no "results"
36 G | processScenario throws on unknown item type; cli try/catch writes err.message to stderr, process.exit(1) | passing:36
37 R | CLI claim references item type not in policy → non-zero exit, stderr | comp:N/A | run:OK | function exists; current processClaim treats missing item as undefined yielding payout=100, CLI exits 0, expected non-zero exit + stderr
37 G | throw Error in processClaim when damage.itemType not found in policyItems | passing:37
38 R | CLI negative damage amount → non-zero exit, stderr | comp:N/A | run:OK | function exists; current impl uses Math.max(0, amount-100) yielding payout=0 and exit 0, expected non-zero exit + stderr
38 G | throw Error in processClaim when damage.amount < 0 | passing:38
39 R | CLI more damages of type than insured → non-zero exit, stderr | comp:N/A | run:OK | function exists; current impl uses find() ignoring count, yields payout=600/remainingCap=1400 with exit 0, expected non-zero exit + stderr
39 G | processClaim: count damages per type, count insured per type, throw when damages>insured | passing:39
