# TDD Journal
1 R | amulet alone → base premium 60 G | comp:OK | run:OK | -
1 G | hardcoded basePremium 60 | passing:1
2 R | sword alone → base premium 100 G | comp:OK | run:OK | no comp error expected — quote already exists
2 G | if type==="sword" return 100 else 60 | passing:2
3 R | staff alone → base premium 80 G | comp:OK | run:OK | no comp error expected — quote exists; staff hits else branch returning 60
3 G | type==="sword"?100:type==="staff"?80:60 | passing:3
4 R | potion alone → base premium 40 G | comp:OK | run:OK | no comp error expected — quote exists; potion absent from lookup map returns undefined
4 G | add potion:40 to lookup map | passing:4
5 R | a single rune → base premium 25 G | comp:OK | run:OK | no comp error expected — quote exists; rune absent from lookup map returns undefined
5 G | add rune:25 to lookup map | passing:5
6 R | empty item list → premium 5 G (fee only) | comp:OK | run:OK | no comp error expected — quote exists; premium hardcoded 0, test checks premium not basePremium
6 G | premium = items.length===0 ? 5 : 0 | passing:6
7 R | 2 runes → base premium 50 G | comp:OK | run:OK | no comp error expected — quote exists; impl reads only items[0] so 2 runes returns single-rune 25
7 G | sum basePremiumByType over all items via reduce | passing:7
8 R | 3 runes → base premium 60 G (block) | comp:OK | run:OK | no comp error expected — quote exists; reduce sums 3×25=75, no block logic yet
8 G | if 3 items all rune return 60 else reduce | passing:8
9 R | 4 runes → base premium 100 G (no block) | comp:OK | run:OK | no comp error expected; test passes immediately — exactly-3 block guard excludes 4 runes, reduce gives 4×25=100
10 R | 7 runes → base premium 175 G (no block) | comp:OK | run:OK | no comp error expected; test passes immediately — exactly-3 block guard excludes 7 runes, reduce gives 7×25=175
11 R | 2 runes + 1 moonstone → base premium 75 G (no block, diff types) | comp:OK | run:OK | no comp error expected — quote exists, moonstone valid string; moonstone absent from lookup map so reduce gives 25+25+undefined=NaN
11 G | add moonstone:25 to lookup map | passing:11
12 R | 3 runes + 3 moonstones → base premium 120 G (two blocks) | comp:OK | run:OK | no comp error expected — quote exists, moonstone valid; 6-item exactly-3 block guard is false so reduce gives 6×25=150
12 G | group items by type, count===3 uses 60 block per type else count×base | passing:12
13 R | cursed sword → 150 G base+surcharge | comp:OK | run:OK | no comp error expected — quote & cursed field exist; impl ignores cursed so single sword gives 100
13 G | if single cursed item multiply base by 1.5 else unchanged | passing:13
14 R | sword enchantment exactly 5 → 130 G base+high-ench surcharge | comp:OK | run:OK | no comp error expected — quote & enchantment field exist; impl ignores enchantment so single sword gives 100
14 G | if single item enchantment>=5 multiply base by 1.3 else unchanged | passing:14
15 R | sword enchantment 4 → no high-ench surcharge (base 100) | comp:OK | run:OK | no comp error expected; test passes immediately — >=5 threshold from cycle 14 excludes ench 4, factor 1.0 → 100
16 R | customer exactly 2 years → 20% loyalty discount (premium 95) | comp:OK | run:OK | no comp error expected — quote exists, yearsWithMHPCO field exists; premium hardcoded 0 for non-empty list, expected 95
16 G | premium fake: empty→5, yearsWithMHPCO>=2→95, else 0 | passing:16
17 R | cursed sword + plain amulet → 210 base (modifier scope, surcharge on cursed item only) | comp:OK | run:OK | no comp error expected — quote/cursed exist; impl applies surcharge only when items.length===1, so 2-item policy gives 100+60=160 no surcharge
17 G | sum per-item surcharge (factor-1)*itemBase into basePremium | passing:17
18 R | integration newcomer cursed sword (steel ench3) → premium 165 | comp:OK | run:OK | no comp error expected — quote/all Item fields exist; premium hardcoded 0 for non-empty newcomer policy, expected 165
18 G | premium fake: newcomer non-empty branch returns hardcoded 165 | passing:18
19 R | integration long-standing 2nd contract cursed ench7 sword → premium 160 | comp:OK | run:OK | no comp error expected — quote/followUp/all fields exist; 3yr customer hits hardcoded LOYAL_CUSTOMER_PREMIUM=95 branch, expected 160
19 G | replace premium ternary with additive formula (loyalty/first-ins/follow-up as % of policy base + ceil(fee)); make surcharge additive so curse+high-ench stack | passing:19
20 R | premium 197.5 → rounded up to 198 G (cursed ench5 sword + plain rune, 2yr) | comp:OK | run:OK | no comp error expected; test passes immediately — Math.ceil(premium+fee) already implemented in cycle 19 covers R6 ceil rounding
21 R | regular sword (steel ench3) damage 500 → payout 400 | comp:FAIL | run:OK | comp pred wrong: vitest/esbuild does not type-check, so claim(policy,incident) extra-arg + .payout-on-unknown surfaced as runtime TypeError not TS error; stubbed claim to return {payout:0} for clean assertion-error stage
21 G | claim returns incident.damages[0].amount - 100 deductible | passing:21
22 R | rune damage 200 → payout 100 (no clause) | comp:OK | run:OK | no comp error expected; test passes immediately — cycle-21 claim does damages[0].amount−100=100, components carry no R7 clause
23 R | dragon sword ench8 damage 1000 → payout 400 (50% clause then deductible) | comp:OK | run:OK | no comp error expected — quote/claim & Item.material/enchantment fields exist; claim applies only deductible (1000−100=900), missing ≥8 50% clause, expected 400
23 G | thread items into QuoteResult; claim looks up matched item, ench>=8 halves damage before deductible | passing:23
24 R | dragon sword ench5 damage 800 → payout 700 (dragon full reimbursement then deductible) | comp:OK | run:OK | no comp error expected; test passes immediately — ench5 below ≥8 clause so claim does full 800−100=700, dragon full-reimbursement coincides with default
25 R | steel sword ench9 damage 1000 → payout 400 (high-ench 50% then deductible) | comp:OK | run:OK | no comp error expected; test passes immediately — cycle-23 ench≥8 clause is material-agnostic so steel ench9 halves to 500 then −100=400
26 R | dragon sword ench9 damage 1000 → payout 400 (50% rule wins over dragon, then deductible) | comp:OK | run:OK | no comp error expected; test passes immediately — cycle-23 ench≥8 50% clause is material-agnostic and there is no dragon full-reimbursement clause to compete, so 1000×0.5=500 then −100=400
27 R | dragon attack: sword500 + amulet300 → payout 600 (deductible per damaged item) | comp:OK | run:OK | no comp error expected — quote/claim & all fields exist, vitest no type-check; claim reads only damages[0]=sword so 500−100=400, ignores amulet entry, expected 600
27 G | claim reduces over all damages, summing each (reimbursed − deductible) | passing:27
28 R | payout 350.5 → floor to 350 (steel sword ench8 damage901) | comp:OK | run:OK | no comp error expected — quote/claim & fields exist, vitest no type-check; claim does 901×0.5−100=350.5 with no floor rounding, expected 350
28 G | Math.floor on summed total payout (per R6 final rounding) | passing:28
29 R | sword + amulet → insurance sum 1600, cap 3200 (remainingCap 3100 after 200 dmg) | comp:OK | run:OK | no comp error expected — quote/claim & fields exist, vitest no type-check; ClaimResult lacks remainingCap so result.remainingCap is undefined, expected 3100
29 G | add remainingCap to ClaimResult + insuranceValueByType lookup; cap=2×sum(insurance values over policy.items), remainingCap=cap−payout | passing:29
30 R | cursed sword (value 1000, premium 165) → cap 2000 (unmodified value) | comp:OK | run:OK | no comp error expected; test passes immediately — cycle-29 cap uses insuranceValueByType (ignores cursed/premium surcharge) so unmodified 1000 → cap 2000, remainingCap 2000−200=1800
31 R | sword + 3 runes (block) → insurance sum 1750, cap 3500 (block discount affects premium only) | comp:OK | run:OK | no comp error expected; test passes immediately — totalInsuranceValue sums insuranceValueByType (1000+3×250=1750) independent of premiumForTypeBlock discount, cap 3500, remainingCap 3500−100=3400
32 R | sword (cap 2000), two successive 1500 claims → 1400 (rem 600) then 600 (rem 0) | comp:OK | run:OK | no comp error expected — quote/claim & remainingCap field exist, vitest no type-check; claim recomputes remainingCap=2000−payout fresh each call with no cross-claim cap memory, so 2nd claim returns payout 1400 again, expected 600
32 G | store remainingCap on policy (lazy-init full cap), payout=min(desired,remainingBefore), decrement & persist | passing:32
33 R | two swords → insurance sum 2000, cap 4000 (remainingCap 3900 after 200 dmg) | comp:OK | run:OK | no comp error expected; test passes immediately — totalInsuranceValue reduces over all policy.items (1000+1000=2000), cap=2×2000=4000, payout 200−100=100, remainingCap 3900 matches; multiple same-type items already summed by existing reduce
34 R | two swords both damaged (two sword entries) → each own 100 G deductible | comp:OK | run:OK | no comp error expected; test passes immediately — cycle-27 reduce-over-all-damages applies per-entry deductible, (500−100)+(500−100)=800, cap 4000 not binding
35 R | CLI reads stdin JSON, writes {results:[{premium}]}; amulet 5yr → premium 59 | comp:OK | run:OK | comp pred = no TS error (spec spawns tsx, no static import, vitest no type-check); missing src/cli.ts surfaced as runtime ERR_MODULE_NOT_FOUND, then stub wrote premium:0 for clean assertion-stage failure (exp 59)
35 G | CLI maps steps to quote(customer,items,{followUp:false}) returning {premium}; no claim/validation | passing:35
36 R | CLI writes payout+remainingCap for claim step (amulet quote then amulet dmg200 → payout 100, remainingCap 1100) | comp:OK | run:OK | comp pred = no TS error (spec spawns tsx, no static import, vitest no type-check); CLI ran quote on claim step's missing items → TypeError reduce-of-undefined, then stub returned {payout:0,remainingCap:0} for claim op → clean assertion-stage failure (exp 100)
36 G | CLI stores QuoteResult per step index; claim step looks up policy[step.policy], calls claim(policy,incident), pushes {payout,remainingCap} | passing:36
37 R | CLI unknown item type (broomstick) → non-zero exit, stderr, no stdout results | comp:OK | run:OK | comp pred = no TS error (spec spawns tsx, no static import, vitest no type-check); added runCliExpectingFailure via spawnSync; CLI does no type validation so quote gives NaN premium and exits 0, expected non-zero
37 G | quote() throws on type not in basePremiumByType; CLI wraps in try/catch → stderr+exit(1), stdout only on success | passing:37
38 R | CLI claim references item not in policy (amulet dmg, sword-only policy) → non-zero exit | comp:OK | run:OK | no comp error expected — tsx spawn, no type-check; claim() find() misses amulet, treats as full reimbursement → CLI exits 0, expected non-zero
38 G | reimbursedAmount throws when policy.items.find misses the damaged itemType | passing:38
39 R | CLI negative damage amount (-200) → non-zero exit | comp:OK | run:OK | no comp error expected — tsx spawn, no new static import, vitest no type-check; claim does no negative-amount validation so CLI computes payout and exits 0, expected non-zero
39 G | reimbursedAmount throws when damage.amount < 0 | passing:39
40 R | CLI more damages of a type than insured (2 sword damages, 1 sword) → non-zero exit | comp:OK | run:OK | no comp error expected — runCliExpectingFailure exists, no new static import, tsx spawn (vitest no type-check); claim find() matches both damages to single sword, payout 200, CLI exits 0, expected non-zero
40 G | claim guards: count damages per itemType vs insured count per type, throw if any exceeds | passing:40
