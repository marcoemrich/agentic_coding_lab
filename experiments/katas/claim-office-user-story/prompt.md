# MHPCO Claim Office Kata

## Setting

You are building the policy management system for the **Most Honorable
Privileged Claims Office for Magical Risks and Cursed Items** (MHPCO),
an old-fashioned insurance institution that covers magical items —
swords, amulets, staves, potions, and components such as runes and
moonstones. The MHPCO is bureaucratic, slightly stingy, and proud of
its venerable traditions.

## User Story 1 — Quoting a premium

**As a** customer of the MHPCO
**I want** to receive a premium quote for a list of items I wish to
insure
**so that** I know what the policy will cost me before I sign.

### Acceptance Criteria

- Each main item has an insurance value and a base premium according to
  the MHPCO price list:
  - Sword: 1000 G insurance value, 100 G base premium
  - Amulet: 600 G / 60 G
  - Staff: 800 G / 80 G
  - Potion: 400 G / 40 G
- Components — for example runes and moonstones — are insured at
  250 G each, with a base premium of 25 G per component.
- A building block of 3 alike components carries a special base premium
  of 60 G.
- Cursed items add a 50 % risk surcharge.
- Highly enchanted items (enchantment level ≥ 5) add a 30 % risk
  surcharge.
- Long-standing customers (≥ 2 years of business with MHPCO) receive a
  20 % loyalty discount.
- A first insurance carries a 10 % initial assessment surcharge.
- Customers receive a 15 % discount on each contract after their first.
- A 5 G processing fee is added to every premium.

## User Story 2 — Processing a claim

**As a** customer of the MHPCO
**I want** to file a claim when one of my insured items is damaged
**so that** the MHPCO reimburses me according to my policy.

### Acceptance Criteria

- A deductible of 100 G applies per damage event.
- The total payout per policy is capped at twice the insurance sum.
- Damage to items with enchantment level ≥ 8 is reimbursed at 50 % of
  the damage amount.
- Damage to items made of dragon material is fully reimbursed.

## Common Acceptance Criteria

- All amounts are rounded to whole G in the MHPCO's favor.
- The implementation must be exposed as a command-line executable
  `claim-office`.
- The executable reads a JSON document from stdin describing a sequence
  of operations and writes a JSON document to stdout with the
  corresponding results in the same order.
- A scenario is a JSON object with a `customer` object and a `steps`
  array. The `customer` describes the single customer for the whole
  scenario. Each step has an `op` field (`"quote"` or `"claim"`) and
  the operation-specific input fields. Steps are processed
  sequentially; later `claim` steps refer to a policy created by an
  earlier `quote` step via its zero-based step index in a `policy`
  field.
- Stdout receives a JSON object with a `results` array of the same
  length and order as the input `steps`. Each result contains
  operation-specific fields:
  - For a `quote` step: `premium` (integer, total premium in G).
  - For a `claim` step: `payout` (integer, payout in G) and
    `remainingCap` (integer, cap remaining on the policy after this
    claim).

### Schema example 1 — Quote only

Stdin:

```json
{
  "customer": {"yearsWithMHPCO": 0},
  "steps": [
    {
      "op": "quote",
      "items": [
        {"type": "sword", "material": "steel", "enchantment": 3, "cursed": false}
      ]
    }
  ]
}
```

Stdout shape:

```json
{"results": [{"premium": <integer>}]}
```

### Schema example 2 — Quote followed by two claims

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
    },
    {
      "op": "claim",
      "policy": 0,
      "incident": {
        "cause": "spell mishap",
        "damages": [
          {"itemType": "amulet", "amount": 250}
        ]
      }
    }
  ]
}
```

Stdout shape:

```json
{"results": [{"premium": <integer>}, {"payout": <integer>, "remainingCap": <integer>}, {"payout": <integer>, "remainingCap": <integer>}]}
```

The two examples illustrate the **shape** of stdin and stdout. Concrete
values are not given here; deriving them from the rules above is part
of the task.

## Expected Output Files

- Source files implementing the logic and the `claim-office` CLI
- Test files
- A way to run the CLI executable (e.g. `pnpm exec claim-office`,
  `node dist/cli.js`, or a wrapper script)

## Constraints

- Use TypeScript for the implementation
- The CLI must read JSON from stdin and write JSON to stdout
- Internal data structures and module organization are free
