# Chimera Score Kata

## User Story

**As a** player of the card game "Overlords"
**I want** my Chimera cards to be scored automatically at the end of the game
**so that** I am rewarded for collecting complete sets and don't have to calculate the score manually.

## Acceptance Criteria

- A player with no Chimera cards receives zero points.
- Individual Chimera cards that are not part of a complete set are worth two points each.
- A complete set consists of exactly three Chimera cards and is worth twelve points.
- When a player has more cards than fit into complete sets, the leftover cards are scored individually at two points each.
- The scoring works for any non-negative number of cards.

## Expected Output Files

- `src/chimera-score.ts` - Implementation
- `src/chimera-score.spec.ts` - Tests

## Constraints

- Use TypeScript
- Input is always a non-negative integer (>= 0)
