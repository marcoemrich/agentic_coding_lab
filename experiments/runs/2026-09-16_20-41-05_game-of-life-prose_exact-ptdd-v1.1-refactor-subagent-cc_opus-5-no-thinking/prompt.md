# Game of Life Kata

## Feature

Conway's Game of Life is a cellular automaton that evolves on a two-dimensional grid. The grid in this kata is theoretically infinite in every direction, so cells can have arbitrary positive or negative integer coordinates. At any moment a cell is either alive or dead. To compute the next generation, every cell looks at its eight neighbors. A living cell with fewer than two live neighbors dies, as if by underpopulation. A living cell with two or three live neighbors continues to live in the next generation. A living cell with more than three live neighbors dies, as if by overpopulation. A dead cell with exactly three live neighbors becomes a living cell, as if by reproduction. Because the grid is infinite, the implementation should only track living cells rather than allocating memory for the whole plane.

## Task

Implement a function that takes the set of currently living cells and returns the set of cells that are alive in the next generation.

## API contract

Export from `src/game-of-life.ts` a function with this signature:

```ts
type Cell = [number, number]; // [x, y]
export function nextGeneration(cells: Cell[]): Cell[];
```

Input and output are arrays of `[x, y]` coordinate tuples. Internally you may use whatever data structure suits you (Set, Map, …), but the function boundary must match the signature above.

## Expected Output Files

- `src/game-of-life.ts` - Implementation
- `src/game-of-life.spec.ts` - Tests

## Constraints

- Use TypeScript
- Use sparse representation (only store living cells)
- Handle negative coordinates
