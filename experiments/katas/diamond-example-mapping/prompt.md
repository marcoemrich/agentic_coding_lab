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

**Diamond 'A'**:
```
A
```
(1 row, width 1)

**Diamond 'B'**:
```
 A
B B
 A
```
(3 rows, width 3)
- Row 1: 1 space, "A", 1 space
- Row 2: "B", 1 space, "B"
- Row 3: 1 space, "A", 1 space

**Diamond 'C'**:
```
  A
 B B
C   C
 B B
  A
```
(5 rows, width 5)
- Row 1: 2 spaces, "A", 2 spaces
- Row 2: 1 space, "B", 1 space, "B", 1 space
- Row 3: "C", 3 spaces, "C"
- Row 4: 1 space, "B", 1 space, "B", 1 space
- Row 5: 2 spaces, "A", 2 spaces

**Diamond 'D'**:
```
   A
  B B
 C   C
D     D
 C   C
  B B
   A
```
(7 rows, width 7)

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
