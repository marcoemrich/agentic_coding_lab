# MHPCO Claim Office Kata

## Setting

You are building the policy management system for the **Most Honorable
Privileged Claims Office for Magical Risks and Cursed Items** (MHPCO),
an old-fashioned insurance institution that covers magical items —
swords, amulets, staves, potions, and components such as runes and
moonstones. The MHPCO is bureaucratic, slightly stingy, and proud of
its venerable traditions.

## Feature

The system supports two operations: quoting a premium for a list of
items, and processing damage claims against a policy.

### Quoting a premium

When a customer wants to insure a list of items, the system computes the
premium. Each main item has an insurance value and a base premium
according to the MHPCO price list: a sword is insured at 1000 G with a
base premium of 100 G, an amulet at 600 G / 60 G, a staff at 800 G /
80 G, a potion at 400 G / 40 G. Components — for example runes and
moonstones — are insured at 250 G each, with a base premium of 25 G.
A building block of 3 alike components is offered at a special base
premium of 60 G.

Several modifiers apply to the premium:

- Cursed items add a 50 % risk surcharge.
- Highly enchanted items (enchantment level ≥ 5) add a 30 % risk
  surcharge.
- Long-standing customers (≥ 2 years of business with MHPCO) receive a
  20 % loyalty discount.
- A first insurance carries a 10 % initial assessment surcharge.
- Customers receive a 15 % discount on each contract after their first.
- A 5 G processing fee is added to every premium.

All amounts are rounded to whole G in the MHPCO's favor.

### Processing claims

When damage occurs to insured items, the customer files a claim. A
deductible of 100 G applies per damage event. The total payout per
policy is capped at twice the insurance sum.

Claims may concern damage to items with high enchantment level (≥ 8) or
made of dragon material:

- Damage to items with enchantment level ≥ 8 is reimbursed at 50 % of
  the damage amount.
- Damage to items made of dragon material is fully reimbursed.

## Task

Implement the two operations (quote, claim) so that they correctly model
the MHPCO policy behavior as described above.

The implementation must be exposed as a command-line executable
`claim-office`. The executable reads a JSON document from stdin
describing a sequence of operations, and writes the corresponding
results as a JSON document to stdout.

### Input format

A scenario is a JSON object with a `customer` object and a `steps`
array. The `customer` describes the single customer for the whole
scenario. Each step has an `op` field (`"quote"` or `"claim"`) and the
operation-specific input fields. Steps are processed sequentially;
later steps may refer to a policy created by an earlier `quote` step
via its zero-based step index in the `policy` field of a `claim`.

### Output format

Stdout receives a JSON object with a `results` array. The `results`
array has the same length as the input `steps`, in the same order. Each
result object contains the fields appropriate to the operation:

- For a `quote` step: `premium` (integer, total premium in G).
- For a `claim` step: `payout` (integer, payout in G) and
  `remainingCap` (integer, cap remaining on the policy after this
  claim).

### JSON Schema (normative)

The field names below are **binding**. Your implementation must use
exactly these names; do not rename or restructure them.

**Input (stdin):**

```json
{
  "type": "object",
  "required": ["customer", "steps"],
  "properties": {
    "customer": {
      "type": "object",
      "required": ["yearsWithMHPCO"],
      "properties": {
        "yearsWithMHPCO": { "type": "integer" }
      }
    },
    "steps": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "description": "Quote step",
            "required": ["op", "items"],
            "properties": {
              "op": { "const": "quote" },
              "items": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": ["type"],
                  "properties": {
                    "type":        { "type": "string", "description": "sword | amulet | staff | potion | rune | moonstone" },
                    "material":    { "type": "string" },
                    "enchantment": { "type": "integer" },
                    "cursed":      { "type": "boolean" }
                  }
                }
              }
            }
          },
          {
            "description": "Claim step",
            "required": ["op", "policy", "incident"],
            "properties": {
              "op":     { "const": "claim" },
              "policy": { "type": "integer", "description": "zero-based index of the quote step that created the policy" },
              "incident": {
                "type": "object",
                "required": ["cause", "damages"],
                "properties": {
                  "cause": { "type": "string" },
                  "damages": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": ["itemType", "amount"],
                      "properties": {
                        "itemType": { "type": "string" },
                        "amount":   { "type": "integer" }
                      }
                    }
                  }
                }
              }
            }
          }
        ]
      }
    }
  }
}
```

**Output (stdout):**

```json
{
  "type": "object",
  "required": ["results"],
  "properties": {
    "results": {
      "type": "array",
      "items": {
        "oneOf": [
          {
            "description": "Quote result",
            "required": ["premium"],
            "properties": {
              "premium": { "type": "integer" }
            }
          },
          {
            "description": "Claim result",
            "required": ["payout", "remainingCap"],
            "properties": {
              "payout":       { "type": "integer" },
              "remainingCap": { "type": "integer" }
            }
          }
        ]
      }
    }
  }
}
```

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
values are not given here; deriving them from the rules above is part of
the task.

## Expected Output Files

- Source files implementing the logic and the `claim-office` CLI
- Test files
- CLI entry point at `src/cli.ts` (reads JSON from stdin, writes JSON to stdout)

## Constraints

- Use TypeScript for the implementation
- The CLI must read JSON from stdin and write JSON to stdout
- The CLI entry point must be at `src/cli.ts`
- Internal data structures and module organization are free
