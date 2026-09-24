# The fifteen verification scenarios in prose

Companion material for the trainer. **Not for participants** — the
scenarios contain the answers.

The machine-readable versions live in
[`../../../../experiments/katas/claim-office-verification/scenarios/`](../../../../experiments/katas/claim-office-verification/scenarios/).
This document tells the same fifteen cases the way the assessor would
read them out in plenary — with the arithmetic, so the trainer does
not have to re-derive the numbers at the flip chart.

German version: [`szenarien.md`](szenarien.md).

Every amount here has been checked against the `*.expected.json`
files. If a group arrives at a different number, it is because they
read an ambiguity differently, not because of an arithmetic error in
this document — which reading produces which number is noted with
each scenario.

## How to use the scenarios

The fifteen cases are ordered by increasing entanglement. For the
workshop that means:

- **Stage 1 (01–07)** is useful for pinning individual red cards.
  Each case isolates exactly one ambiguity — failing it means having
  read that one rule differently.
- **Stage 2 (08–11)** shows interactions. Failing here means each
  rule is right on its own but their stacking is wrong.
- **Stage 3 (12–15)** are narratives. They work as a closing demo
  or, when time is short, as the only pass.

For an acceptance-test demo after the mapping, stage 1 plus one story
is enough. The full fifteen are meant for lab use.

## The calculation basis in brief

So the arithmetic below stays readable, here are the quantities that
appear in every scenario:

| Piece | Insurance value | Base premium |
|-------|----------------:|-------------:|
| Sword | 1000 G | 100 G |
| Staff | 800 G | 80 G |
| Amulet | 600 G | 60 G |
| Potion | 400 G | 40 G |
| Component (rune, moonstone …) | 250 G | 25 G |
| Building block (exactly 3 alike) | 3 × 250 G | flat 60 G |

Surcharges and discounts are applied **additively** to the respective
base price, not chained multiplicatively. Item-level modifiers (curse
+50 %, high enchantment from level 5 +30 %) attach to the base premium
*of the affected piece*; policy-level ones (loyalty −20 % from two
years, first insurance +10 %, follow-up contract −15 %) to the sum of
all base premiums. Finally 5 G handling fee, then rounded in the
office's favour: premiums up, payouts down.

On a claim: first the reimbursement clause (from enchantment 8 only
50 %; dragon material 100 %; the 50 % clause wins a conflict), then
100 G deductible **per damage entry**. The cap is 2 × insurance sum
and applies cumulatively over the lifetime of the policy.

---

# Stage 1 — Isolated rules

## 01 — Three runes, one block

A newcomer brings three runes for assessment. No history, no curses,
nothing enchanted — the simplest case the office knows.

**Premium: 71 G**

Three alike components form a building block: a flat 60 G instead of
75 G individually. On top of that the initial assessment surcharge of
10 % (6 G), giving 66 G, plus the 5 G handling fee = 71 G.

**What the case tests:** does the block discount exist at all? Anyone
arriving at 80 G has not implemented it.

## 02 — Four runes, no block

The same newcomer, one rune more.

**Premium: 115 G**

A block counts **only at exactly three** components. At four,
everything counts individually: 4 × 25 = 100 G. Plus 10 % first
insurance (10 G) = 110 G, plus the fee = 115 G.

**What the case tests:** the core question from ambiguity A. Both
common counter-readings produce different numbers — "one block plus
one loose rune" gives 99 G, and so does "greedily block as many as
possible". Only the strict three-reading hits 115 G.

**Trainer note:** This is the sharpest single instrument in the set.
Groups and models almost always choose some greedy variant; putting
01 and 02 side by side makes the difference visible in two lines.

## 03 — Two runes and a moonstone

Three components again, but not the same ones.

**Premium: 88 G**

"Alike" means same type identifier. Runes and moonstones do not form
a block together, even though both are components: 3 × 25 = 75 G,
plus 10 % (7.5 G) = 82.5 G, plus the fee = 87.5 G, rounded up to
**88 G**.

**What the case tests:** ambiguity Aₐ. Reading "alike" as "same
category" forms a block here and lands on 71 G — the same number as
scenario 01, which gives the error away immediately when the two are
put next to each other.

**Trainer note:** This is also where rounding first becomes visible.
87.5 becomes 88, not 87.

## 04 — One dragon, two damaged pieces

A newcomer insures a sword (steel, level 3) and a silver amulet. Then
a dragon comes along and damages both: the sword by 500 G, the amulet
by 300 G.

**Premium: 181 G** — base premiums 100 + 60 = 160 G, plus 10 % first
insurance (16 G) = 176 G, plus the fee.

**Payout: 600 G** — namely (500 − 100) + (300 − 100).

**What the case tests:** ambiguity B₂. The deductible applies **per
damaged piece**, not per damage event. Reading it as "one dragon
attack, one 100 G" pays out 700 G.

**Remaining cap: 2600 G** — insurance sum 1600 G, cap 3200 G, of
which 600 G consumed.

## 05 — The highly enchanted sword

A newcomer insures a steel sword of enchantment level 9. A fire
damages it by 1000 G.

**Premium: 145 G** — 100 G base premium, plus the 30 % high-enchantment
surcharge (30 G), plus 10 % first insurance (10 G) = 140 G, plus the
fee.

**Payout: 400 G** — the clause for strongly enchanted items (from
level 8) reimburses only 50 % of the damage: 1000 → 500 G, less the
100 G deductible = 400 G.

**What the case tests:** that there are **two different enchantment
thresholds** — level 5 for the premium surcharge, level 8 for the
reimbursement reduction. Anyone who knows only one threshold fails
here or in 06.

**Remaining cap: 1600 G.**

## 06 — The dragon-bone sword

Newcomer, sword made of dragon material, but only enchantment level 3.
It falls to the ground, damage 800 G.

**Premium: 115 G** — dragon material carries no surcharge; it is
purely a claims-settlement clause. So 100 G, plus 10 %, plus the fee.

**Payout: 700 G** — dragon material is reimbursed at 100 %: the full
800 G, less the 100 G deductible.

**What the case tests:** that dragon material does *not* touch the
premium. A common misreading turns it into a risk surcharge.

**Remaining cap: 1300 G.**

## 07 — When both clauses apply

Newcomer, sword of dragon material **and** enchantment level 9. A
botched spell damages it by 1000 G.

**Premium: 145 G** — as in 05: the level-9 enchantment costs a 30 %
surcharge, the material nothing.

**Payout: 400 G** — the 50 % clause wins. 1000 → 500 G, less 100 G =
400 G.

**What the case tests:** ambiguity F'. Both clauses apply at once, and
the risk threshold beats the material clause. The counter-reading
("dragon material wins, 100 % reimbursement") pays out 900 G.

**Trainer note:** This is the ambiguity that most often goes
unnoticed in the mapping entirely — the two clauses sit in different
paragraphs of the prose and nobody puts them side by side. If no red
card mentions it after 45 minutes, the assessor may prod with exactly
this case.

**Remaining cap: 1600 G.**

---

# Stage 2 — Rules in combination

## 08 — The cursed newcomer

A newcomer insures a cursed steel sword, level 3.

**Premium: 165 G** — 100 G base premium, plus the 50 % curse
surcharge (50 G), plus 10 % first insurance (10 G) = 160 G, plus the
fee.

**What the case tests:** ambiguity D, the additive calculation, in
the smallest possible setup. Calculated multiplicatively
(100 × 1.5 × 1.1 + 5) it would give 170 G instead of 165 G — the
difference is only 5 G here, but it is unambiguous.

**Trainer note:** Because the gap is so small, this case is poor for
convincing anyone. To demonstrate the factor ordering in plenary,
use Garras (12) — there it is 265 G (additive) against 349 G
(multiplicative).

## 09 — The regular customer with two contracts

A customer, three years with the house, first insures a healing
potion, later a cursed sword of level 7.

**First policy: 41 G** — 40 G base premium, −20 % loyalty discount
(8 G), +10 % first insurance (4 G) = 36 G, plus the fee.

**Second policy: 160 G** — 100 G base premium, +50 % curse (50 G),
+30 % high enchantment (30 G), −20 % loyalty (20 G), +10 % first
insurance (10 G), −15 % follow-up contract (15 G) = 155 G, plus the
fee.

**What the case tests:** two things at once. First ambiguity C: the
initial assessment surcharge is **item-bound**, not customer-bound —
even the regular customer pays it, because the *piece* is being
assessed for the first time. So it applies on the second policy too,
simultaneously with the follow-up contract discount. Second, the
additive calculation: chained multiplicatively
(100 × 1.5 × 1.3 × 0.8 × 1.1 × 0.85 + 5) the second policy would come
to 151 G instead of 160 G.

**Trainer note:** The most common participant question is "how am I
supposed to see that the sword was insured before?" — answer: you
cannot. The items in the JSON have no identity. Every piece counts
implicitly as a first insurance. That is deliberate, not a gap.

## 10 — The exhausted cap

A newcomer insures a steel sword, level 3. Then he falls twice, each
time 1500 G of damage.

**Premium: 115 G.** Insurance sum 1000 G, so the cap is 2000 G.

**First payout: 1400 G** — 1500 less the 100 G deductible. Remaining
cap 600 G.

**Second payout: 600 G** — arithmetically 1400 G would again be due,
but the cap only yields 600 G. Remaining cap 0.

**What the case tests:** that the cap is **cumulative** and is not
reset per claim — and that it *truncates* rather than rejecting the
claim.

## 11 — Two swords, one dragon

A newcomer insures two identical steel swords. A dragon damages both:
one by 1500 G, the other by 800 G.

**Premium: 225 G** — 2 × 100 G, plus 10 % first insurance (20 G),
plus the fee.

**Payout: 2100 G** — (1500 − 100) + (800 − 100). Two damage entries,
two deductibles, even though both carry the same `itemType`.

**What the case tests:** that a policy can carry several pieces of
the same type and that the insurance sum aggregates linearly
(2 × 1000 = 2000 G, cap 4000 G).

**Trainer note:** Implementations that store items in a map keyed by
type lose one of the two swords here. That is a data-modelling error,
not a rule misunderstanding — and a good opening to talk about
modelling rather than rules in the debrief.

**Remaining cap: 1900 G.**

---

# Stage 3 — The stories

Each of the four stories has its own `*.story.md` next to the JSON
files; the narratives there are longer and suited to reading aloud.
What follows is the short form with the numbers.

## 12 — Warrior Garras

Garras the Berserker has been with the house for five years. He first
insures his combat gear: a cursed sword of level 5, a silver
protection amulet and a healing potion. Weeks later he summons a
dragon-bone staff, level 7, and takes out a second policy for it.

On the road north a red dragon catches him: 1500 G of damage to the
sword, 400 G to the amulet. Later, in a tavern, his staff misfires
during a clumsy spell, 500 G of damage.

**First policy: 265 G** — base premiums 100 + 60 + 40 = 200 G. Item
level: +50 G curse and +30 G high enchantment, both on the sword's
base premium of 100 G. Policy level on the 200 G: −40 G loyalty,
+20 G first insurance. Total 260 G, plus the fee.

**Second policy: 89 G** — 80 G base premium, +24 G high enchantment
(level 7), −16 G loyalty, +8 G first insurance, −12 G follow-up
contract = 84 G, plus the fee.

**First claim: 1700 G** — (1500 − 100) + (400 − 100). Neither sword
nor amulet triggers a special clause; level 5 is below the
reimbursement threshold of 8. Remaining cap 2300 G of 4000 G.

**Second claim: 400 G** — the staff is dragon material, so 100 %
reimbursement: the full 500 G, less 100 G. Level 7 is again below the
50 % threshold. Remaining cap 1200 G of 1600 G.

**What the story tests:** the distinction between item-level and
policy-level modifiers. On a policy with three pieces it makes a
visible difference whether the curse surcharge is calculated on 100 G
or on 200 G — 50 G against 100 G. On top of that: two policies under
one customer, and dragon material on a low-enchantment item.

## 13 — Magus Velorin

Velorin, the Hexenmeister vom Ostmoor, has been a customer for just
over a year — so **not yet** a regular customer; the loyalty discount
does not apply. He insures his working set: an oak staff of level 5,
a silver amulet of level 6, and three matched runes for his warding
circles. Later he takes out a second policy on a shipment of seven
more runes.

A library cat knocks the staff off his table (200 G of damage);
shortly afterwards a counterspell backfires through the amulet
(300 G).

**First policy: 267 G** — base premiums: staff 80 G, amulet 60 G,
three runes as a block 60 G, together 200 G. Item level: +24 G for
the staff (30 % of 80 G) and +18 G for the amulet (30 % of 60 G),
both above enchantment level 5. Policy level: +20 G first insurance.
No loyalty discount at one year. Total 262 G, plus the fee.

**Second policy: 172 G** — seven runes form **no** block: 7 × 25 =
175 G. Plus 10 % first insurance (17.5 G), less 15 % follow-up
contract (26.25 G) = 166.25 G, plus the fee = 171.25 G, rounded up to
**172 G**.

**First claim: 100 G** — 200 G of damage less the 100 G deductible.

**Second claim: 200 G** — 300 G less 100 G.

**What the story tests:** two things. First, that the block discount
affects only the *premium*, not the *insurance value*: the three runes
cost 60 G in premium but are insured at 3 × 250 = 750 G. The insurance
sum of the first policy is therefore 2150 G and the cap 4300 G —
deriving the value from the premium yields too small a cap. Second,
the enchantment threshold on *two different pieces*: staff (level 5)
and amulet (level 6) both trigger the surcharge, each on its own base
premium.

**Trainer note:** That **no** loyalty discount applies here is the
quietest trap in the whole set. One year is not "at least two years" —
implementations using `>= 1` instead of `>= 2` fail precisely here and
nowhere else (227 G instead of 267 G). And the seven-rune policy
repeats scenario 02 in narrative form.

**Remaining cap after both claims: 4000 G.**

## 14 — The Steinheim family

The three Steinheim brothers, all soldiers, pool their resources for
a single family policy. They register their three battle-worn swords
and their grandmother's protective amulet. They are new to the house.

Months later, fire takes part of the family castle. Two of the three
swords come out warped (1200 G and 800 G of damage); the third was
hanging in a hall the fire never reached, and the youngest brother
was wearing the amulet at market.

**Premium: 401 G** — base premiums 3 × 100 + 60 = 360 G, plus 10 %
first insurance (36 G) = 396 G, plus the fee.

**Payout: 1800 G** — (1200 − 100) + (800 − 100).

**What the story tests:** that the damage report may cover a **proper
subset** of the insured pieces. Two of three swords are damaged, the
third and the amulet are not — the policy stays valid and payment is
made only for the reported entries.

**Trainer note:** The opposite case is in the trainer notes: *more*
damage entries than insured pieces leads to outright rejection. Here
it is the other way round and entirely unremarkable — but
implementations that check the count like to confuse the direction.

**Remaining cap: 5400 G** — insurance sum 3600 G, cap 7200 G.

## 15 — Unlucky Tordan

Tordan has been a customer for four years and is, by the office's
records, the unluckiest insured person in the house. He keeps it
simple: one sword, one healing potion. No curses, no exotic
enchantments, just bad timing.

In quick succession he stumbles down a staircase (sword, 800 G),
spills his potion in a tavern brawl (300 G), falls again on the way
home (sword, 1500 G), and finally manages a fourth tumble (sword,
1000 G).

**Premium: 131 G** — base premiums 100 + 40 = 140 G, −20 % loyalty
(28 G), +10 % first insurance (14 G) = 126 G, plus the fee.

Insurance sum 1400 G, **cap 2800 G.**

**The four claims:**

| Claim | Calculation | Payout | Remaining cap |
|-------|-------------|-------:|--------------:|
| Fall on the stairs | 800 − 100 | 700 G | 2100 G |
| Spilled potion | 300 − 100 | 200 G | 1900 G |
| Second fall | 1500 − 100 | 1400 G | 500 G |
| Fourth fall | 1000 − 100 = 900, truncated | **500 G** | 0 G |

**What the story tests:** cap exhaustion across a longer sequence of
claims, with mixed piece types in between. The last entry is the
interesting one: 900 G would be due arithmetically, 500 G is paid,
and the cap then stands at exactly zero.

**Trainer note:** This story works well as a closing demo, because
the arithmetic per line is trivial and all the tension sits in the
cap. Passing it means carrying the cap state correctly across several
steps.

---

## Appendix — What the scenarios do not cover

The trainer notes fix a number of points for which there is **no**
verification case. They may come up during mapping but are not
tested:

- empty item list on `quote` (premium 0 G + 5 G fee)
- unknown item type (rejection)
- a damage entry for a piece not in the policy (rejection)
- negative damage amount (rejection)
- more damage entries than insured pieces (outright rejection)

For a group that finishes early, these make a good extra exercise —
the rulings are in [`trainer-notes-en.md`](trainer-notes-en.md) under
"Further important rulings".
