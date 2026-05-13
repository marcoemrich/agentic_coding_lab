# Game of Life Kata

## Task

Implement Conway's Game of Life as a TypeScript module that exports a function to advance a configuration by a given number of generations.

## Function Contract

Export a function (named `evolve`, `nextGeneration`, or similar) with the following behavior:

- **Input**: a list of living cells as `[x, y]` coordinate pairs, where `x` and `y` are integers (possibly negative).
- **Output**: the list of living cells after applying the simulation rules.

The function computes one generation. The caller is responsible for iterating.

## Simulation Rules

Conway's Game of Life is a cellular automaton that evolves on a two-dimensional grid. The grid is theoretically infinite in every direction, so cells can have arbitrary positive or negative integer coordinates. At any moment a cell is either alive or dead. To compute the next generation, every cell looks at its eight neighbors. A living cell with fewer than two live neighbors dies, as if by underpopulation. A living cell with two or three live neighbors continues to live in the next generation. A living cell with more than three live neighbors dies, as if by overpopulation. A dead cell with exactly three live neighbors becomes a living cell, as if by reproduction.

## Expected Output Files

- Source files implementing the simulation logic (e.g. `src/game-of-life.ts`)
- Test files

## Constraints

- Use TypeScript for the implementation
- Use sparse representation (only store living cells)
- Handle negative coordinates
- Internal data structures and module organization are free
