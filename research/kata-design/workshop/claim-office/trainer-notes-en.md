# Trainer notes for the MHPCO kata

Companion material for the trainer. **Not for participants.**

Contains the MHPCO rulings on every ambiguity — that is, the answers
that example mapping should arrive at — plus notes on running the
workshop.

## Setting

Task: [`prose-en.md`](prose-en.md) (English, narrative Galaxy-Trucker
style). German original: [`prose.md`](prose.md).

Verification scenarios (for checking values / demonstrating after the
mapping): [`../../../../experiments/katas/claim-office-verification/`](../../../../experiments/katas/claim-office-verification/).

## List of ambiguities

Five main ambiguities plus one sub-ambiguity. The list follows the
internal numbering from `kata-mehrdeutigkeiten.md`.

### A — Set scoring with leftovers

**Question:** How is a collection of 4 or more alike components
scored?

**MHPCO ruling:** A building block counts **only at exactly three**
components. At 4 or more, everything is counted individually — no
"greedy" block forming, no "one block, rest individually".

**Examples to pin during mapping:**
- 3 runes → 60 G base premium (block)
- 4 runes → 100 G base premium (4 × 25, no block)
- 7 runes → 175 G base premium (7 × 25, no block)

**Trainer note:** This reading is the *most expensive* of the three
plausible ones — which fits the stingy tone. Models and participants
typically gravitate to greedy max-block. If nobody arrives at "strictly
three only", the trainer can deploy the assessor character ("Three
*alike* components constitute a block. Three.").

### Aₐ — "Alike" as a term

**Question:** What does "alike" mean? Same type, same category, same
material?

**MHPCO ruling:** Same **type identifier**. Runes and moonstones are
never alike to one another, even though both are "components".

**Examples:**
- 2 runes + 1 moonstone → 75 G (no block, different types)
- 3 runes + 3 moonstones → 120 G (two separate blocks)

**Trainer note:** A classic terminology trap. During mapping somebody
typically asks "hang on, what does alike mean?". This is
*constructively hidden information* — the question has to be asked
actively, it is not stated in the rules.

### B₂ — Deductible per damage event

**Question:** Does the 100 G deductible apply once per claim (e.g. a
dragon attack) or per damaged item?

**MHPCO ruling:** The deductible is deducted **per item**. A dragon
attack that damages two items costs two times 100 G deductible.

**Examples:**
- Dragon attack: sword (500 G) + amulet (300 G) →
  (500 − 100) + (300 − 100) = 600 G payout

**Trainer note:** Models scatter across family lines here (Opus toward
"one event = one deductible", Sonnet toward "per item"). Likely to
spark discussion in the workshop too. The ruling fits the stingy tone
— the MHPCO likes to retain more.

### C — "First insurance" as a term

**Question:** Does the 10 % initial assessment surcharge refer to *the
customer's first contract* (customer-scoped) or to *the first policy
for an item* (item-scoped)?

**MHPCO ruling:** **Item-scoped.** Even a regular customer insuring a
new item pays the initial surcharge — because the item is under
assessment for the first time.

**Examples:**
- Regular customer of 3 years, second contract with a new sword → +10 %
  (first insurance of the sword) AND −15 % (customer's follow-up
  contract), both at once.

**Trainer note:** The two clauses "first insurance +10 %" and "from the
second contract −15 %" look contradictory at first. The MHPCO reading
is that they apply *in parallel* — item-first plus customer-follow-up.

**JSON reading:** Items in the scenario JSON have no identity (no `id`,
no "wasInsuredBefore" flag). Consequence: every item counts implicitly
as a first insurance — so the +10 % surcharge applies at *every* quote
step to *every* item. The −15 % follow-up discount, by contrast, is
readable from the JSON: it applies at every `quote` step *after the
first* in the `steps` array (same customer across the whole scenario).
Frequent participant question: "How do I see that the sword was
insured before?" — answer: you don't, and that is deliberate.

### D — Factor order for modifiers

**Question:** How are the modifiers (curse, enchantment, loyalty, etc.)
applied to the base price? Additively? Multiplicatively? In what order?

**MHPCO ruling:** **Additively on the base price.** All percentages are
converted into absolute gold pieces (each as a percentage of the base
price) and added to / subtracted from the policy base price.

**Extension — item vs. policy scope:** Item-specific modifiers (curse,
high enchantment) act on the **item base price** of the affected item.
Policy modifiers (loyalty discount, first insurance, follow-up
contract) act on the **policy base price** (sum of all item base
premiums).

**Examples:**
- Cursed level-7 sword, 3-year regular customer, second contract, base
  price 100 G:
  100 + 50 (curse) + 30 (high enchantment) − 20 (loyalty discount)
  + 10 (first ins.) − 15 (follow-up contract) = 155 G
  + 5 G processing fee = **160 G**
- Policy with cursed sword (100) + amulet (60), newcomer:
  policy base price 160 G; curse surcharge +50 G (50 % of the sword
  base price); initial surcharge +16 G (10 % of the policy base
  price); subtotal 226 G + 5 = **231 G**

**Trainer note:** Models converge on multiplicative calculation;
additive is the *everyday reading* (e-commerce discount codes), but it
is fixed here against that model convergence. If the mapping picks
multiplicative, *that* is a valid workshop experience too ("your tariff
computes differently from the MHPCO tariff" — a valuable insight about
pinning down requirements).

### F' — Risk threshold vs. dragon material

**Question:** What happens with an item that triggers *both* claim
settlement clauses — dragon material AND enchantment level ≥ 8?

**MHPCO ruling:** The **50 % clause wins.** Risk threshold beats
material clause.

**Order relative to the deductible:** **Apply the reimbursement clause
first, then subtract the deductible.**

**Examples:**
- Dragon sword, enchantment 9, damage 1000 G →
  500 G (50 %) − 100 G deductible = **400 G payout**
- Dragon sword, enchantment 5, damage 800 G →
  800 G (full, dragon material) − 100 G deductible = **700 G payout**
- Steel sword, enchantment 9, damage 1000 G →
  500 G (50 %) − 100 G deductible = **400 G payout**

**Trainer note:** The order between clause and deductible is a hidden
ambiguity inside this question. If nobody raises it, the trainer can
probe with a concrete example ("dragon-material sword, ench 9, damage
1000 G — what does the MHPCO pay?").

## Further important rulings

These points are not ambiguities in the narrow sense, but they come up
often during mapping.

### Processing fee

- Always 5 G on top, *after* all modifiers, *never* discounted.
- Also on an empty item list: premium 0 G + 5 G fee = 5 G.

### Rounding

- All amounts in the MHPCO's favour: **round premiums up, round payouts
  down**.
- Round **at the end** of the calculation; intermediate values stay
  fractional.

### Cap

- Cap = **2 × insurance sum**.
- Insurance sum = sum of the **insurance values** of all items (not the
  premiums!).
- The cap is **cumulative over the lifetime** of the policy, no reset.
- The cap is based on the **unmodified** insurance value — curse and
  other surcharges do not raise the cap.
- The block bonus affects only the premium, not the insurance value
  (3-rune block: value 750 G, premium 60 G).

### Multiple items of the same type

- A policy may contain several items of the same type (two swords,
  three potions).
- The insurance sum aggregates linearly: 2 × sword = 2 × 1000 = 2000 G,
  cap 4000 G.
- One deductible per `damages` entry — even when both entries have the
  same `itemType`.
- If the number of damage entries exceeds the number of items in the
  policy → **total rejection** of the claim (bureaucratically strict).

### Unknown items

- Item with an unknown type (not in the main-item table, not a
  component type) → error / total rejection.
- Damage entry whose item is not in the policy → error.
- Negative damage amount → error.

### Edge cases

- Empty item list in `quote` → premium 0 G (= 5 G with fee), not an
  error.

## Running the workshop

### Suggested schedule

1. **Read out / hand out the setting** ([`prose-en.md`](prose-en.md)) — approx. 10 min
2. **Example mapping in small groups** — approx. 60 min
   - Story card (yellow): "calculate MHPCO policy / settle claim"
   - Rule cards (blue): extracted from the setting
   - Example cards (green): at least one example per rule
   - Question cards (red): open points that need the PO/trainer
3. **Plenary: answer questions** — trainer as PO, answers red cards
   according to the rulings above — approx. 20 min
4. **Implementation in pair or mob programming** — approx. 90+ min
5. **Comparison against the verification scenarios** — trainer
   demonstrates `claim-office-verification/scenarios/` as acceptance
   tests

### Tips for the trainer

- **Only answer red cards once they are raised.** If the group does not
  discover an ambiguity on its own, that is part of the experience —
  the "PO" points out gaps only during implementation.
- **Stay in character.** The trainer is not a trainer but *the MHPCO
  assessor*. Bureaucratic, mildly passive-aggressive, with references
  to "the house rules".
- **On conflicts between the group's ruling and the MHPCO ruling:** be
  flexible. If the group consistently picks a different reading and
  stays internally coherent, that is didactically valuable. The
  verification scenarios can then be presented as an "alternative MHPCO
  branch office".
- **Don't overwork the arithmetic.** Under workshop time pressure it is
  enough for the rules to be implemented *qualitatively* correctly —
  the trainer can check the exact gold pieces afterwards.

### Common stumbling blocks

- **Insurance value ≠ premium:** participants frequently confuse
  insurance value (which the cap refers to) with base premium. This
  should be clarified early during mapping.
- **Modifier arithmetic:** groups often oscillate between additive and
  multiplicative. The trainer can pin it down with a worked example.
- **F' conflict:** it is often overlooked that both clauses can apply at
  once. The prompting example "dragon sword at level 9" helps.
- **"alike":** participants sometimes read this as "same category" (all
  runes alike). The trainer pins it to the exact type.

## Verification scenarios as training material

The 15 scenarios in `claim-office-verification/scenarios/` can be shown
as **acceptance tests** after the mapping:

- Stage 1 (01–07): one test per ambiguity → for discussing individual
  rule resolutions
- Stage 2 (08–11): combined tests → show interactions
- Stage 3 (12–15): story scenarios → particularly suited to workshop
  reuse; each story has a `*.story.md` with a narrative

Examples of story use in the workshop:
- **Garras the warrior** (12) — all item types, several policies, dragon attack
- **Velorin the magus** (13) — component block, several policies
- **The Steinheim family** (14) — several items of the same kind
- **Tordan the unlucky** (15) — cap exhaustion across many claims

## Notes on tone

The MHPCO is designed as a *bureaucratic, stingy insurer*. When
answering red cards:

- Lean rulings in the MHPCO's favour (smaller sets, higher premiums,
  lower payouts).
- Keep the language neutral or mildly officious — no emotional
  justification, but "the house rules say", "it has been this way since
  1612", "the assessor has decided".
- On detail questions, *don't* hand over the full answer immediately —
  first see whether the group arrives at a reading itself. Only answer
  with the MHPCO ruling once they are blocked.
