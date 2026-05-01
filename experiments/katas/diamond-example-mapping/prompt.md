# Diamond Kata - Experiment Prompt

## Feature: Diamond Generator

Generate a diamond shape with letters from 'A' to a given letter. The diamond has a horizontal and vertical axis of symmetry.

## Rules

1. **Single Letter 'A'**: Returns just "A"
2. **Top Half**: Each row has the letter appearing twice (except 'A'), separated by spaces
3. **Middle Row**: The widest row containing the target letter
4. **Bottom Half**: Mirror of the top half (excluding middle row)
5. **Spacing**: Each row is centered with leading spaces
6. **Width**: Diamond width = `2 * (position of letter) - 1`
   - A (position 1): width 1
   - B (position 2): width 3
   - C (position 3): width 5

## Examples

### Examples per Rule

**Rule 1 – Single Letter 'A'**:
```
A
```
Input `'A'` → just `"A"` (1 row, width 1).

**Rule 2 – Top Half (letter appears twice, except 'A')**:
Diamond `'B'` top half:
```
 A   ← only one 'A'
B B  ← 'B' appears twice
```

**Rule 3 – Middle Row (widest row, contains target letter)**:
Diamond `'C'`, middle row (row 3):
```
C   C
```
Contains target letter 'C', width 5.

**Rule 4 – Bottom Half (mirror of top half, excluding middle)**:
Diamond `'C'` full output:
```
  A   ← top
 B B  ← top
C   C ← middle
 B B  ← mirror of row 2
  A   ← mirror of row 1
```

**Rule 5 – Spacing (centered with leading spaces)**:
Diamond `'D'`, leading spaces per row:
```
   A    ← 3 leading spaces
  B B   ← 2 leading spaces
 C   C  ← 1 leading space
D     D ← 0 leading spaces
 C   C  ← 1
  B B   ← 2
   A    ← 3
```

**Rule 6 – Width = `2 * position - 1`**:
- Diamond `'A'` (pos 1): width 1
- Diamond `'B'` (pos 2): width 3
- Diamond `'C'` (pos 3): width 5
- Diamond `'D'` (pos 4): width 7

### Full Diamond Examples

**Diamond 'A'** (1 row, width 1):
```
A
```

**Diamond 'B'** (3 rows, width 3):
```
 A
B B
 A
```

**Diamond 'C'** (5 rows, width 5):
```
  A
 B B
C   C
 B B
  A
```

**Diamond 'D'** (7 rows, width 7):
```
   A
  B B
 C   C
D     D
 C   C
  B B
   A
```

## Pattern Details

For a letter at position `n` (A=1, B=2, C=3...):
- **Total rows**: `2n - 1`
- **Diamond width**: `2n - 1`
- **Leading spaces for letter at position k**: `n - k`
- **Inner spaces for letter at position k** (k > 1): `2k - 3`
- **Letter 'A' always has**: 0 inner spaces (appears once)
- **Other letters appear twice per row**: with inner spacing

## Task

Using TDD, implement the Diamond Generator based on the rules and examples above.

The output should:
- Accept a single uppercase letter ('A' to 'Z')
- Return a string with newline characters (`\n`) separating rows
- Each row should be exactly `width` characters (padded with spaces)

## Expected Output Files

- `src/diamond.ts` - Implementation
- `src/diamond.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Follow TDD strictly (no implementation before tests)
- Input is always a single uppercase letter (A-Z)
- Output rows are trimmed to exact width (no trailing spaces beyond width)
- Rows are separated by newline characters (`\n`)

The test-list agent should create the actual test list based on TDD principles (simple → complex).
