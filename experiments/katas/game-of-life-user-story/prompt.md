# Game of Life Kata

## User Story

**As a** simulation enthusiast
**I want** to compute the next generation of Conway's Game of Life on an infinite grid
**so that** I can observe how arbitrary patterns evolve without being constrained by grid boundaries.

## Acceptance Criteria

- Cells are identified by integer `(x, y)` coordinates and may have negative values.
- Only living cells are tracked; the data structure does not allocate memory for dead regions.
- A living cell with fewer than two living neighbors dies in the next generation.
- A living cell with two or three living neighbors stays alive.
- A living cell with more than three living neighbors dies.
- A dead cell with exactly three living neighbors becomes alive.
- The transformation produces the complete set of living cells of the next generation.

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
