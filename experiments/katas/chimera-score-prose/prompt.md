# Chimera Score Kata

## Feature

In the card game "Overlords", players collect Chimera cards into their pile. At the end of the game these cards need to be scored. Normally a single Chimera card is worth two points. However, players are rewarded for collecting full sets: whenever three Chimera cards form a complete set, that set is worth twelve points instead of the six points the cards would otherwise have scored individually. Any cards that do not form a complete set of three are scored at the regular two points each. A player who has no Chimera cards at all scores zero points.

## Task

Implement a function that, given the number of Chimera cards a player holds, returns the total score according to the rules above.

## Expected Output Files

- `src/chimera-score.ts` - Implementation
- `src/chimera-score.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Input is always a non-negative integer (>= 0)
