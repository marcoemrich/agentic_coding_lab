# Game of Life Kata - Experiment Prompt

## Input

Implement Conway's Game of Life with an **infinite grid** (theoretically unlimited cells in all x and y directions).

## Feature: Game of Life - Next Generation

### Rules

1. **Underpopulation**: Any live cell with fewer than 2 live neighbors dies
2. **Survival**: Any live cell with 2 or 3 live neighbors lives on
3. **Overpopulation**: Any live cell with more than 3 live neighbors dies
4. **Reproduction**: Any dead cell with exactly 3 live neighbors becomes alive

### Constraints

- Grid is **infinite** in all directions (positive and negative x/y)
- Only track **living cells** (sparse representation)
- Cells are identified by coordinates `(x, y)`
- A "generation" transforms the current state to the next state

### Examples

#### Examples per Rule

**Rule 1 – Underpopulation** (live cell with < 2 neighbors dies):
```
Gen 0:       Gen 1:
 ##           ..
 ..     →     ..
```
Coordinates Gen 0: `[(0,1), (1,1)]` (each has 1 neighbor)
Coordinates Gen 1: `[]`

**Rule 2 – Survival** (live cell with 2 or 3 neighbors lives on):
```
Gen 0:       Gen 1:
 ###          .#.
 ...    →     .#.
 .#.          ...
```
The center cell `(1,1)` has 3 live neighbors → survives.

**Rule 3 – Overpopulation** (live cell with > 3 neighbors dies):
```
Gen 0:       Gen 1:
 ###          #.#
 .#.    →     #.#
 ###          #.#
```
Center cell `(1,1)` has 4 live neighbors → dies.

**Rule 4 – Reproduction** (dead cell with exactly 3 neighbors becomes alive):
```
Gen 0:       Gen 1:
 ##.          ##.
 #..    →     ##.
 ...          ...
```
Dead cell `(1,1)` has exactly 3 live neighbors → becomes alive.

#### Pattern Examples

**Blinker (oscillator)**:
```
Gen 0:       Gen 1:       Gen 2:
  .#.          ...          .#.
  .#.    →     ###    →     .#.
  .#.          ...          .#.
```
Coordinates Gen 0: `[(0,0), (0,1), (0,2)]`
Coordinates Gen 1: `[(-1,1), (0,1), (1,1)]`

**Block (still life)**:
```
Gen 0:       Gen 1:
  ##           ##
  ##     →     ##
```
Coordinates: `[(0,0), (1,0), (0,1), (1,1)]` → unchanged

**Single cell dies**:
```
Gen 0:       Gen 1:
  #      →     .
```
Coordinates Gen 0: `[(0,0)]`
Coordinates Gen 1: `[]` (empty)

## Task

Implement the Game of Life based on the rules and examples above.

The implementation should accept an arbitrary grid of living cells and output the next generation.

## Expected Output Files

- `src/game-of-life.ts` - Implementation
- `src/game-of-life.spec.ts` - Tests

## Constraints

- Use Vitest for testing
- Use TypeScript
- Use sparse representation (only store living cells)
- Handle negative coordinates

