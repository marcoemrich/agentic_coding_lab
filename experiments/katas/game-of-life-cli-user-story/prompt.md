# Game of Life Kata

## Task

Implement Conway's Game of Life as a TypeScript module that exports a function to advance a configuration by a given number of generations.

## User Story

**As a** simulation framework
**I want** to call a function with a set of living cells
**so that** I receive the next generation of living cells, without being constrained by grid boundaries.

## Acceptance Criteria

- The module exports a function (named `evolve`, `nextGeneration`, or similar) that takes a list of living cells as `[x, y]` coordinate pairs and returns the next generation.
- Cells are identified by integer `(x, y)` coordinates and may have negative values.
- Only living cells are tracked; the data structure does not allocate memory for dead regions.
- A living cell with fewer than two living neighbors dies in the next generation.
- A living cell with two or three living neighbors stays alive.
- A living cell with more than three living neighbors dies.
- A dead cell with exactly three living neighbors becomes alive.
- The function computes one generation. The caller is responsible for iterating.

## Expected Output Files

- Source files implementing the simulation logic (e.g. `src/game-of-life.ts`)
- Test files

## Constraints

- Use TypeScript for the implementation
- Use sparse representation (only store living cells)
- Handle negative coordinates
- Internal data structures and module organization are free
