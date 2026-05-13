# Game of Life Kata

## Task

Implement Conway's Game of Life as a TypeScript module that exports a function to advance a configuration by one generation.

## Feature: Compute the next generation

### Simulation Rules

1. **Underpopulation**: Any live cell with fewer than 2 live neighbors dies
2. **Survival**: Any live cell with 2 or 3 live neighbors lives on
3. **Overpopulation**: Any live cell with more than 3 live neighbors dies
4. **Reproduction**: Any dead cell with exactly 3 live neighbors becomes alive

### Function Contract

Export a function (named `evolve`, `nextGeneration`, or similar):

- **Input**: a list of living cells as `[x, y]` coordinate pairs (integers, possibly negative).
- **Output**: the list of living cells after one generation.

### Constraints

- Grid is **infinite** in all directions (positive and negative x/y)
- Only track **living cells** (sparse representation)
- Cells are identified by coordinates `(x, y)`

### Examples

**Rule 1 – Underpopulation** (live cell with < 2 neighbors dies):

Coordinates: `[[0,1], [1,1]]` (each has 1 neighbor) → `[]`

**Rule 2 – Survival** (live cell with 2 or 3 neighbors lives on):

A cell at `(1,1)` with 3 live neighbors survives.

**Rule 4 – Reproduction** (dead cell with exactly 3 neighbors becomes alive):

Input: `[[0,0], [0,1], [1,0]]` → dead cell `(1,1)` has exactly 3 live neighbors → becomes alive.

**Blinker (oscillator)**: `[[0,0], [1,0], [2,0]]` → `[[1,-1], [1,0], [1,1]]` → back after two generations.

**Block (still life)**: `[[0,0], [1,0], [0,1], [1,1]]` → unchanged.

## Expected Output Files

- Source files implementing the simulation logic (e.g. `src/game-of-life.ts`)
- Test files

## Constraints

- Use TypeScript for the implementation
- Use sparse representation (only store living cells)
- Handle negative coordinates
- Internal data structures and module organization are free
