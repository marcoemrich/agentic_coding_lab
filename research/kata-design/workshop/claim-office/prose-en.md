# The Most Honorable Privileged Claims Office for Magical Risks and Cursed Items

— or, since even assessors find that a mouthful: the MHPCO.

## A brief introduction

The MHPCO is one of the oldest insurance institutions in the twelve
kingdoms and holds a privilege that nobody has seen in the original
for generations — which does not stop it from citing that privilege
on every letterhead.

Its business consists, in essence, of insuring magical items. These
include swords, amulets, staves, potions and all manner of components
— runes, moonstones, and occasionally more exotic things the house
rules prefer not to describe in detail. The assessor who performs the
intake inspection has a small room on the ground floor for this
purpose, and a very good supply of candles.

The MHPCO is, depending on where you stand, *conscientious* or
*stingy* — both apply, according to whether you are on the counter
side or the customer side. What the house rules describe as "prudent
management in the interest of the insured", common speech describes
in less friendly words. Neither view is entirely without merit.

## What the Claims Office insures

The MHPCO distinguishes between *main items* and *components*. The
main items — swords and their closer relatives — are listed in the
official price schedule:

- a sword is carried at an insurance value of 1000 G, with a base
  premium of 100 G;
- an amulet at 600 G and 60 G;
- a staff at 800 G and 80 G;
- a potion at 400 G and 40 G.

On request, the assessor will also examine unusual pieces — the
*Seven-Armed Staff of Dawn, Witness to the Third Turning of the Ages*,
say — but in ninety-two cases out of a hundred concludes that the
item is a *staff* and that the official price applies. The ledger
reads "staff, wood, 800 G".

Components — runes, moonstones and the like — are insured at 250 G
each, with a base premium of 25 G apiece. There is a small tariff
advantage for those customers who deliver their components in proper
sets: a *building block* of three alike components costs a flat 60 G
base premium. That is fifteen gold pieces below the individual price,
and is widely held in the office to be the most generous concession
the MHPCO has ever granted.

## Calculating the premium

The calculation begins plainly, with the sum of the base premiums of
all insured pieces. A series of surcharges and discounts is then
applied to that sum, as the office has levied them for generations.

**Cursed items** attract a risk surcharge of 50 %. The MHPCO has
learned over the centuries that cursed swords throw themselves at
legs, door frames and occasionally the furniture of the claims office
with disagreeable regularity. The surcharge is a kind of advance
compensation for the trouble such pieces inevitably cause.

**Highly enchanted items** — those with an enchantment level of five
or more — carry a further surcharge of 30 %. The precise definition of
"enchantment level" has changed several times over the decades. The
current rule: whatever the mage writes on the label stands. Anyone
registering a sword at level *one thousand* is politely asked by the
assessor to confine himself to the official scale.

**Long-standing customers** — those whose business relationship with
the MHPCO has lasted at least two years — receive a loyalty discount
of 20 %. The MHPCO calls this a *loyalty discount*; it would probably
be more honest to describe it as a token of appreciation for having
endured two full years of dealings at the counter.

**A first insurance** attracts an *initial assessment surcharge* of
10 %. This covers the assessor's effort in inspecting the piece,
sniffing at it, and entering it in the ledger.

**Follow-up contracts** — that is, every contract a customer takes out
after his first — receive a discount of 15 % on the premium. This is
how the office keeps its regulars on the hook without unsettling them
with genuine generosity.

Finally, a **processing fee** of 5 G is added to every premium. Common
speech calls it *the stamp fee*, which is not entirely inaccurate;
the office does in fact keep two very old stamps, whose operation
occupies the staff in question for several seconds.

> *Actuary's note (handwritten, not official):*
> "All amounts are rounded to whole gold pieces in the office's
> favour. This is not a rule, it is a custom."

## In the event of a claim

Should it come to pass that an insured item comes to harm — by dragon
fire, by the owner's own clumsiness, by what the office discreetly
terms *an unfortunate concatenation of circumstances* — the
policyholder files a claim.

The MHPCO retains a **deductible** of 100 G on every such case. The
house rules explain this on the grounds that the deductible "shall
encourage the insured to handle the items entrusted to him with due
care". Anyone who asks the actuary in person receives the somewhat
less polished answer that the MHPCO simply likes to keep a hundred
gold pieces wherever it can.

The **total amount** the MHPCO pays out on a single policy over the
years is capped at *twice the insurance sum*. The insurance sum is the
sum of the insurance values of all pieces carried in the policy.
Anything beyond the cap is not paid out.

For particularly conspicuous pieces the office knows two special
clauses:

- **Strongly enchanted items** — those with enchantment level eight or
  higher — are reimbursed at only 50 % of the damage amount. The
  assessor has observed many times over the years that such pieces
  behave in a manner one might call *self-healing* as soon as the
  insurer is out of sight; the clause takes account of this.

- **Items made of dragon material** are reimbursed at 100 % of the
  damage amount. The MHPCO is fond of stressing that this is a
  particularly *generous* rule; what the MHPCO does not mention is
  that dragon material is generally so robust that the clause rarely
  comes into play at all.

## The task

You work — congratulations! — on the MHPCO's administration system.
Your assignment is modest:

- A function that calculates the *premium* for a list of items (in the
  office this is simply called *quote*).
- A function that *settles a claim* against an existing policy and
  determines the payout amount (the *claim*).
