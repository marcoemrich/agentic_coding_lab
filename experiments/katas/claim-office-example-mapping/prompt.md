# MHPCO Claim Office Kata

## Setting

You are building the policy management system for the **Most Honorable
Privileged Claims Office for Magical Risks and Cursed Items** (MHPCO),
an old-fashioned insurance institution that covers magical items —
swords, amulets, staves, potions, and components such as runes and
moonstones. The MHPCO is bureaucratic, slightly stingy, and proud of
its venerable traditions.

## Feature

The system supports two operations: **quote** computes the premium for
a list of items a customer wishes to insure, and **claim** processes a
damage report against an existing policy.

## Rules

### Item values and base premiums

Each main item has an insurance value and a base premium according to
the MHPCO price list:

- Sword: 1000 G insurance value, 100 G base premium
- Amulet: 600 G / 60 G
- Staff: 800 G / 80 G
- Potion: 400 G / 40 G

Components — for example runes and moonstones — are insured at 250 G
each, with a base premium of 25 G per component. A building block of
3 alike components is offered at a special base premium of 60 G.

### Premium modifiers

- Cursed items add a 50 % risk surcharge.
- Highly enchanted items (enchantment level ≥ 5) add a 30 % risk
  surcharge.
- Long-standing customers (≥ 2 years of business with MHPCO) receive a
  20 % loyalty discount.
- A first insurance carries a 10 % initial assessment surcharge.
- Customers receive a 15 % discount on each contract after their first.
- A 5 G processing fee is added to every premium.

All amounts are rounded to whole G in the MHPCO's favor.

### Claim processing

A deductible of 100 G applies per damage event. The total payout per
policy is capped at twice the insurance sum.

- Damage to items with enchantment level ≥ 8 is reimbursed at 50 % of
  the damage amount.
- Damage to items made of dragon material is fully reimbursed.

## Examples

The examples below illustrate single rules in isolation. Values shown
are base premiums or raw payout amounts before integration with other
modifiers, unless stated otherwise.

### Building block of 3 alike components

- 2 runes → 50 G base premium
- 3 runes → 60 G base premium (block applies)
- 4 runes → 100 G base premium (no block — block requires exactly 3)
- 7 runes → 175 G base premium

### "Alike" components

> ❓ Hmm — "alike" components: does that mean exactly the same type,
> or just the same family (rune-y, gemstone-y)?

- 2 runes + 1 moonstone → 75 G base premium (no block: different types)
- 3 runes + 3 moonstones → 120 G base premium (two separate blocks)

### Modifier scope on multi-item policies

> ❓ A policy with several items: does the cursed surcharge apply to
> the whole policy, or just to the cursed item?

- a policy covers a cursed sword (base premium 100 G) and a plain
  amulet (base premium 60 G) → policy base premium 160 G; the cursed
  surcharge adds 50 G (50 % of the cursed sword's base premium, not
  of the policy total) → 210 G before further modifiers and fee
- item-specific modifiers (cursed, high enchantment) apply to the
  base premium of the affected item; policy-wide modifiers (loyalty,
  first insurance, follow-up contract) apply to the policy base
  premium (the sum of all item base premiums); the processing fee is
  added at the very end

### Modifier thresholds

- customer with exactly 2 years with MHPCO → loyalty discount applies
- sword with exactly enchantment 5 → high-enchantment surcharge
  applies; if cursed, both surcharges apply
- sword with enchantment 4 → no high-enchantment surcharge; curse
  surcharge applies only if cursed
- dragon-material sword with exactly enchantment 8, damage 1000 G →
  payout 400 G (high-enchantment clause applies, then deductible)

### Deductible per damage event

- a dragon attack damages an insured sword (500 G) and an insured
  amulet (300 G); payout = 600 G (the 100 G deductible applies once
  per damaged item)

### Standard reimbursement (no special clauses)

- regular sword (steel, enchantment 3), damage 500 G → payout 400 G
  (full reimbursement minus 100 G deductible; no special clause applies)
- damage to a rune (insurance value 250 G), damage 200 G → payout
  100 G (full reimbursement minus 100 G deductible; runes have no
  enchantment level or material, so no special clause applies)

### Enchantment threshold vs. dragon material

- dragon-material sword, enchantment 9, damage 1000 G → payout 400 G
  (both clauses apply; the 50 % rule wins, then deductible: 500 − 100)
- dragon-material sword, enchantment 5, damage 800 G → payout 700 G
  (only the dragon-material clause applies: full reimbursement,
  then deductible: 800 − 100)
- steel sword, enchantment 9, damage 1000 G → payout 400 G
  (only the high-enchantment clause applies: 50 % first, then
  deductible: 500 − 100)

### Multiple items of the same type

> ❓ What if a customer brings two of the same item — one in hand,
> one in the backpack? Or just two swords because they fight with
> two?

- a policy covers two swords → insurance sum 2000 G (= 2×1000),
  cap 4000 G
- a dragon attack damages both swords; `damages` contains two
  `{itemType: "sword", ...}` entries → each entry is treated as a
  separate damage with its own deductible
- if the `damages` array contains more entries of a given type than
  the policy actually covers (e.g. two sword damages but only one
  sword insured) → the CLI exits with a non-zero status code; the
  whole claim is rejected

### Cap exhaustion

- a policy covers a sword and an amulet → insurance sum 1600 G
  (= 1000 + 600, the sum of the items' insurance values), cap 3200 G
- a cursed sword (insurance value 1000 G, premium with modifiers
  165 G) → cap 2000 G (based on the unmodified insurance value;
  premium modifiers do not raise the cap)
- a policy covers a sword and 3 runes (a block) → insurance sum
  1750 G (= 1000 + 3×250); the block discount affects the premium
  only, not the insurance sum
- a sword is insured (insurance sum 1000 G, cap 2000 G); two successive
  claims of 1500 G each
- first claim → payout 1400 G, cap remaining 600 G
- second claim → payout 600 G, cap remaining 0 G (the desired 1400 G
  is reduced to the remaining cap)

### Rounding in the MHPCO's favor

- a premium calculation that yields 197.5 G → final premium 198 G
  (rounded up)
- a payout calculation that yields 350.5 G → final payout 350 G
  (rounded down)
- intermediate amounts during a calculation are kept as fractions;
  only the final premium or payout is rounded

### Edge cases

- empty item list → premium 5 G (only the processing fee)
- quote includes an item with an unknown type (e.g.
  `{type: "broomstick"}`) → the CLI exits with a non-zero status code
  and writes an error description to stderr; no `results` are written
  to stdout
- claim references a damage entry whose item is not part of the policy
  (e.g. an amulet damaged when only a sword is insured, or an item
  with an unknown type) → the CLI exits with a non-zero status code
  and writes an error description to stderr
- claim contains a damage entry with `amount: -200` → the CLI exits
  with a non-zero status code and writes an error description to
  stderr

## Integration examples

The following two examples combine multiple rules to clarify how
modifiers stack and how customer history affects the premium.

### Newcomer with a cursed sword

- customer: 0 years with MHPCO, no previous contract
- item: a cursed sword (steel, enchantment 3)
- premium: 165 G
- (100 G base + 50 G curse + 10 G first insurance = 160 G + 5 G fee = 165 G)

### Long-standing customer's second contract

> ❓ Wait — does "first insurance" mean the customer's first ever
> contract, or the first time we see this particular item? A
> long-standing customer with a brand-new sword: does the first
> insurance surcharge still apply?

- customer: 3 years with MHPCO; this is the customer's second `quote`
  in the scenario
- item: a cursed sword (steel, enchantment 7)
- premium: 160 G
- (100 G base + 50 G curse + 30 G high enchantment − 20 G loyalty
  + 10 G first insurance − 15 G follow-up contract = 155 G + 5 G fee
  = 160 G)
- The first insurance surcharge still applies to the new sword, even
  though the customer is on a follow-up contract — each item in a
  `quote` is treated as a first insurance, regardless of customer
  history.

## CLI input/output format

The implementation must be exposed as a command-line executable
`claim-office`. It reads a JSON document from stdin describing a
scenario and writes a JSON document with the corresponding results to
stdout.

A scenario is a JSON object with a `customer` object and a `steps`
array. The `customer` describes the single customer for the whole
scenario. Each step has an `op` field (`"quote"` or `"claim"`) and the
operation-specific input fields. Steps are processed sequentially;
later `claim` steps refer to a policy created by an earlier `quote`
step via its zero-based step index in a `policy` field.

Stdout receives a JSON object with a `results` array of the same length
and order as the input `steps`. Each result contains:

- For a `quote` step: `premium` (integer, total premium in G).
- For a `claim` step: `payout` (integer, payout in G) and
  `remainingCap` (integer, cap remaining on the policy after this
  claim).

### Schema example

Stdin:

```json
{
  "customer": {"yearsWithMHPCO": 5},
  "steps": [
    {
      "op": "quote",
      "items": [
        {"type": "amulet", "material": "silver", "enchantment": 2, "cursed": false}
      ]
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "fire",
        "damages": [
          {"itemType": "amulet", "amount": 200}
        ]
      }
    }
  ]
}
```

Stdout shape:

```json
{"results": [{"premium": <integer>}, {"payout": <integer>, "remainingCap": <integer>}]}
```

## Expected Output Files

- Source files implementing the logic and the `claim-office` CLI
- Test files
- A way to run the CLI executable (e.g. `pnpm exec claim-office`,
  `node dist/cli.js`, or a wrapper script)

## Constraints

- Use TypeScript for the implementation
- The CLI must read JSON from stdin and write JSON to stdout
- The CLI entry point must be at `src/cli.ts`
- Internal data structures and module organization are free
