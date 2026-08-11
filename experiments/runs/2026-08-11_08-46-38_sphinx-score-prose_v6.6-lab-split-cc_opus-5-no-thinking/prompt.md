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
