# TDD Journal
1 R | empty item list → premium 5 G | comp:OK | run:OK | -
1 G | return 5 hardcoded | passing:1
2 R | single sword newcomer → 115 G | comp:OK | run:OK | -
2 G | hardcoded: empty→5, else→115 | passing:2
3 R | single amulet newcomer → 71 G | comp:OK | run:OK | -
3 G | branch on type: amulet→71, else→115 | passing:3
4 R | single staff newcomer → 93 G | comp:OK | run:OK | -
4 G | branch on type: staff→93 | passing:4
4 F | extracted PREMIUMS_NEWCOMER_PLAIN lookup (sword/amulet/staff only); mass 29→22 | passing:4
5 R | single potion newcomer → 49 G | comp:OK | run:OK | no comp error expected (signature accepts any type); lookup returns undefined
5 G | added potion:49 to PREMIUMS_NEWCOMER_PLAIN | passing:5
6 R | 2 runes (no block) → premium 60 G | comp:OK | run:OK | no comp error expected (signature accepts any type); lookup returns undefined
6 G | hardcoded: rune→60 | passing:6
7 R | 3 runes (block) → premium 71 G | comp:OK | run:OK | no comp error expected; lookup returns 60
7 G | branch rune: len===3 → 71, else → 60 | passing:7
8 R | 4 runes (no block) → premium 115 G | comp:OK | run:OK | no comp error expected (signature accepts any type); current returns 60 for non-3-rune case
8 G | branch rune: len===4 → 115 | passing:8
9 R | 7 runes → premium 198 G | comp:OK | run:OK | no comp error expected (signature accepts any item count); current returns 60 for non-3/4 rune cases
9 G | branch rune: len===7 → 198 | passing:9
10 R | 2 runes + 1 moonstone → premium 88 G | comp:OK | run:OK | no comp error expected; current returns 71 (treats as 3-rune block)
10 G | branch: any moonstone → 88 | passing:10
11 R | 3 runes + 3 moonstones → premium 137 G | comp:OK | run:OK | no comp error expected; current returns 88 (any moonstone branch)
11 G | branch moonstone: len===6 → 137 | passing:11
12 R | loyalty threshold 2 years sword → 95 G | comp:OK | run:OK | no comp error expected (signature unchanged); current ignores customer, returns 115
12 G | branch: sword + years>=2 → 95 | passing:12
13 R | loyalty just below 1 year sword → 115 G | comp:OK | run:OK (test passed immediately) | existing impl already returns 115 for non-loyal sword via PREMIUMS_NEWCOMER_PLAIN fallback
14 R | high-enchant threshold sword enchant 5 → 145 G | comp:FAIL | run:OK | predicted TS excess-property compile error but vitest/esbuild strips types; went straight to runtime assertion 115 vs 145
14 G | added enchantment?:number to Item; branch sword + enchantment>=5 → 145 | passing:14
15 R | high-enchant just below sword enchant 4 → 115 G | comp:OK | run:OK (test passed immediately) | existing impl: enchantment<5 falls through to PREMIUMS_NEWCOMER_PLAIN["sword"]=115
16 R | cursed + high-enchant sword (enchant 5, cursed) → 195 G | comp:OK | run:OK | no comp error expected (vitest/esbuild strips TS excess-property checks); current returns 145 for sword + enchantment>=5, ignoring cursed
16 G | added cursed?:boolean to Item; sword+ench>=5 → cursed?195:145 | passing:16
17 R | cursed sword + plain amulet newcomer → 231 G | comp:OK | run:OK | no comp error expected (Item has cursed?); current returns 115 (items[0]=sword falls through to PREMIUMS_NEWCOMER_PLAIN)
17 G | branch: len===2 + cursed sword + amulet → 231 | passing:17
18 R | cursed sword newcomer (E31) → 165 G | comp:OK | run:OK | no comp error expected (vitest/esbuild strips TS excess-property checks for `material`); current returns 115 (sword falls through to plainSingleItemPremium since enchantment<5 and ignores cursed)
18 G | branch sword + cursed (low enchant) → 165 | passing:18
18 Ref | tightened cursed check: removed `=== true` for consistency with `!items[1].cursed` | mass 21→19 | passing:18
19 R | long-standing 2nd contract cursed sword enchant 7 (E32) → 160 G | comp:OK | run:OK | no comp error expected (added QuoteOptions arg, accepted as optional); current returns 95 (loyalty branch fires on sword + years>=2, ignoring enchantment/cursed/follow-up)
19 G | branch sword + isFollowUp + loyalty + cursed + high-enchant → 160 | passing:19
19 Ref | unified hardcoded branches into per-item premium engine: policyBaseTotal (with rune/moonstone 3-block at 60, else 25*n) + per-item surcharges (curse +50% base, high-ench +30% base) + 10% first-ins + flat loyalty(-20)/follow-up(-15) + 5 fee, ceil. mass ~89→~55; all 19 tests green | passing:19
20 R | regular sword damage 500 → payout 400, remCap 1600 | comp:OK | run:OK | no comp error expected (esbuild strips TS); claim missing → runtime "claim is not a function" served as comp-stage failure, then stub {payout:0,remainingCap:0} produced assertion diff
20 G | hardcoded claim → {payout:400, remainingCap:1600} | passing:20
21 R | rune damage 200 → payout 100, remCap 400 | comp:OK | run:OK | no comp error expected (signature accepts any args); hardcoded claim returns {payout:400, remainingCap:1600} for any input
21 G | claim: payout=damage[0]-100, remCap=2*sum(INSURANCE_VALUES)-payout | passing:21
22 R | dragon sword enchant 8 damage 1000 → payout 400, remCap 1600 | comp:OK | run:OK | no comp error (Item.material/enchantment optional); current returns payout 900 (no 50% halving)
22 G | claim: lookup damaged item, halve damage when enchantment>=8 before deductible | passing:22
23 R | dragon sword enchant 9 damage 1000 → payout 400, remCap 1600 | comp:OK | run:OK (test passed immediately) | existing impl: enchantment>=8 halves damage, dragon material irrelevant since 50% wins; 500-100=400, cap 2000-400=1600
24 R | dragon sword enchant 5 damage 800 → payout 700, remCap 1300 | comp:OK | run:OK (test passed immediately) | existing impl: enchantment<8 → no halving, 800-100=700, cap 2000-700=1300; dragon material not yet needed since reimbursable defaults to full damage
25 R | steel sword enchant 9 damage 1000 → payout 400, remCap 1600 | comp:OK | run:OK (test passed immediately) | existing impl: enchantment>=8 halves damage regardless of material; 1000/2=500, 500-100=400, cap=2*1000-400=1600
26 R | dragon attack sword 500 + amulet 300 → payout 600, remCap 2600 | comp:OK | run:OK | no comp error expected (signature unchanged); current only processes damages[0] → returns {payout:400, remainingCap:2800}
26 G | claim: reduce damages summing per-damage (halve if ench>=8) - deductible | passing:26
27 R | two-sword policy dragon attack 500+400 → payout 700 remCap 3300 | comp:OK | run:OK (test passed immediately) | existing impl: reduce over damages applies deductible per entry; insurance sum 2*1000=2000, cap 4000-700=3300; runtime prediction of assertion error did NOT hold
28 R | sword + amulet policy → ins sum 1600, cap 3200 (damage sword 500 + amulet 200 → payout 500, remCap 2700) | comp:OK | run:OK (test passed immediately) | existing impl: insurance sum 1000+600=1600, cap 2*1600=3200, payout (500-100)+(200-100)=500, remCap 3200-500=2700
29 R | cursed sword cap still 2000 (damage 500 → payout 400, remCap 1600) | comp:OK | run:OK (test passed immediately) | existing impl: INSURANCE_VALUES["sword"]=1000 ignores `cursed` modifier; cap=2000, payout 500-100=400, remCap 2000-400=1600
30 R | sword + 3 runes → ins sum 1750, cap 3500 (damage sword 500 → payout 400, remCap 3100) | comp:OK | run:OK (test passed immediately) | existing impl: INSURANCE_VALUES["rune"]=250, cap based on raw insurance values not block discount; 1000+3*250=1750, cap 3500-400=3100
31 R | cap exhaustion sword 1500+1500 → 1400/600 then 600/0 | comp:OK | run:OK | no comp error expected; current ignores remainingCap arg and recomputes cap from insurance sum — 2nd call returns {1400,600} instead of {600,0}
31 G | claim uses remainingCap arg: payout=min(raw, remCap), return remCap-payout | passing:31
32 R | premium 197.5 G rounds UP → 198 G | comp:OK | run:OK (test passed immediately) | existing impl: 7 runes baseTotal 175 + firstIns 17.5 + fee 5 = 197.5, Math.ceil → 198 (same scenario as test 9)
33 R | payout 350.5 rounds DOWN → 350 (sword ench 8, dmg 901) | comp:OK | run:OK | no comp error expected; claim doesn't floor payout → returns {350.5, 1649.5}
33 G | Math.floor payout in claim | passing:33
34 R | CLI simple quote step → stdout {results:[{premium:115}]} | comp:OK | run:OK | comp-stage = cli.ts missing → tsx exits 1 (status!=0); runtime-stage = empty stdout → JSON.parse throws SyntaxError
34 G | cli.ts reads stdin JSON, maps quote steps via quote(), writes {results} to stdout | passing:34
35 R | CLI quote+claim scenario → results in order | comp:OK | run:OK | comp-stage = cli crashed on step.items=undefined for claim step (status=1); runtime-stage = stub {payout:0,remainingCap:0} produced assertion diff
35 G | cli tracks quote policies + per-policy remainingCap (cap=2*sum INSURANCE_VALUES), dispatches claim steps to claim() | passing:35
36 R | CLI two quotes same customer → 2nd gets follow-up discount (E32 = 160) | comp:OK | run:OK | no comp error expected (cli.ts exists, types stripped by tsx); current returns 175 for both quotes (no follow-up tracking)
36 G | cli passes isFollowUp:quotePolicies.length>0 to quote() | passing:36
37 R | CLI unknown item type (broomstick) → exit non-zero, stderr error, no results | comp:OK | run:OK | no comp error expected (cli.ts exists); current returns status 0 with stdout '{"results":[{"premium":null}]}' (NaN→null) — assertion on status!=0 fails
37 G | cli validates quote item types against INSURANCE_VALUES keys; unknown → stderr + exit(1) before stdout | passing:37
37 Ref | extracted validateItemTypes + failWith helpers from CLI map callback; separates validation concern from main flow | mass: validation block 20 → call-site 2 (helper internal mass ~17 isolated); tests:37 passing
38 R | CLI claim damages references item not in policy (amulet vs sword policy) → exit non-zero, stderr | comp:OK | run:OK | no comp error expected (cli.ts exists, signatures unchanged); current: claim returns payout 100 (find→undefined→ench 0, 200-100), CLI exits 0
38 G | cli validates each damage.itemType against policy item types Set; mismatch → stderr + exit(1) | passing:38
39 R | CLI claim damage entry with negative amount → exit non-zero, stderr | comp:OK | run:OK | no comp error expected (cli.ts exists, no new APIs); current: claim processes -100 as -200 payout, CLI exits 0
39 G | cli validates damage.amount >= 0; negative → stderr + exit(1) | passing:39
40 R | CLI too-many-damages (2 sword dmgs, 1 sword insured) → exit non-zero, stderr | comp:OK | run:OK | no comp error expected (cli.ts exists, no new APIs); current: claim processes both damages successfully, CLI exits 0
40 G | cli counts damages per itemType, errors if any type exceeds policy count | passing:40
