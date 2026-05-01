# Chimera Score Kata - Experiment Prompt

## Feature: Chimera Card Scoring

A card game "Overlords" needs to calculate scores for Chimera cards in a player's pile. Chimera cards score bonus points when collected in sets of 3.

## Rules

1. **No Cards**: 0 cards returns 0 points
2. **Individual Cards**: Each card scores 2 points
3. **Set Bonus**: A set of 3 cards scores 12 points (instead of 6)
4. **Multiple Sets**: Multiple complete sets each score 12 points, remaining cards score 2 each

## Examples

**No Cards**:
```
Input: 0
Output: 0
```

**Individual Cards (no complete set)**:
```
Input: 1
Output: 2  (1 × 2 points)

Input: 2
Output: 4  (2 × 2 points)
```

**Complete Set**:
```
Input: 3
Output: 12  (1 set of 3 = 12 points)
```

**Set Plus Remainder**:
```
Input: 4
Output: 14  (1 set of 3 = 12, plus 1 × 2 = 14)

Input: 5
Output: 16  (1 set of 3 = 12, plus 2 × 2 = 16)
```

**Multiple Sets**:
```
Input: 6
Output: 24  (2 sets of 3 = 24)

Input: 7
Output: 26  (2 sets of 3 = 24, plus 1 × 2 = 26)
```

## Task

Implement the Chimera Score Calculator based on the rules and examples above.

## Expected Output Files

- `src/chimera-score.ts` - Implementation
- `src/chimera-score.spec.ts` - Tests

## Constraints

- Use TypeScript
- Input is always a non-negative integer (>= 0)