# Overlords — Sphinx Scoring Kata

## Setting

*Overlords* is a set-collection card game. Players draft monster cards
into their army; at the end of the game every player scores their army.
Each monster card carries its own scoring rule printed on it.

A new card has been designed for the next expansion: the **Sphinx**.
Your job is to implement its scoring.

## Feature

The system scores one army. Only Sphinx cards produce points — every
other monster card in the army contributes nothing on its own. Their
scoring rules are printed on their own cards and are out of scope here.

## Rules

The Sphinx card reads:

> **Sphinx** — 1 point. 2 per type beyond three, else 1.

Cards of the **Undead Warrior** come in three point variants (1, 2 and
3 points). All other monsters have a single variant.

The monsters that may appear in an army are: Sphinx, Undead Warrior,
Zombie, Hydra, Cyclops, Orthrus and Chimera.

## Examples

Each example below states the points a whole army's Sphinx cards are
worth.

### Does a Sphinx count towards the types in the army?

> ❓ The card counts "types" in the army — and the Sphinx is itself a
> monster in that army. Is it one of them?

- Sphinx, Chimera, Orthrus → **2 points**
- Sphinx, Chimera, Orthrus, Zombie, Hydra → **3 points**
- Sphinx, Chimera, Orthrus, Zombie, Hydra, Cyclops → **5 points**

### A second Sphinx

> ❓ And what about a Sphinx looking at another Sphinx?

- Sphinx, Sphinx, Chimera, Orthrus → **4 points**
- Sphinx, Sphinx, Chimera, Orthrus, Zombie → **6 points**

### Beyond three types

> ❓ "…else 1" — one point once, or one point per type?

- Sphinx, Cyclops → **2 points**
- Sphinx, Chimera, Orthrus → **2 points** (see above)

### Undead Warrior variants

> ❓ The Undead Warrior comes in three point variants. Is that one type
> of monster, or three?

- Sphinx, Undead Warrior (1), Undead Warrior (3), Chimera → **2 points**
- Sphinx, Undead Warrior (1), Undead Warrior (2), Undead Warrior (3),
  Cyclops, Orthrus, Chimera → **3 points**

### Several cards of the same monster

- Sphinx, Chimera, Chimera, Chimera, Orthrus, Orthrus → **2 points**

### No Sphinx

- Chimera, Orthrus, Zombie → **0 points**

## Task

Implement the Sphinx scoring for an army.

The implementation must be exposed as a command-line executable. The
executable reads a JSON document from stdin describing an army, and
writes the result as a JSON document to stdout.

### Input format

A JSON object with an `army` array. Each entry is a card with a
`monster` field. Undead Warrior cards additionally carry a `rank` field
holding their point variant (1, 2 or 3).

```json
{
  "army": [
    { "monster": "sphinx" },
    { "monster": "undead-warrior", "rank": 2 },
    { "monster": "hydra" }
  ]
}
```

### Output format

A JSON object with a `score` field holding the points the army's Sphinx
cards are worth, as an integer.

```json
{ "score": 5 }
```

### JSON Schema (normative)

The field names below are **binding**. Your implementation must use
exactly these names; do not rename or restructure them.

**Input (stdin):**

```json
{
  "type": "object",
  "required": ["army"],
  "properties": {
    "army": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["monster"],
        "properties": {
          "monster": {
            "type": "string",
            "enum": ["sphinx", "undead-warrior", "zombie", "hydra",
                     "cyclops", "orthrus", "chimera"]
          },
          "rank": { "type": "integer", "enum": [1, 2, 3] }
        }
      }
    }
  }
}
```

**Output (stdout):**

```json
{
  "type": "object",
  "required": ["score"],
  "properties": {
    "score": { "type": "integer" }
  }
}
```

## Expected Output Files

- `src/cli.ts` — command-line entry point (reads stdin, writes stdout)
- `src/sphinx-score.ts` — implementation
- `src/sphinx-score.spec.ts` — tests

## Constraints

- Use TypeScript
- The CLI must be runnable as `pnpm exec tsx src/cli.ts`
- Read the whole of stdin before producing output
