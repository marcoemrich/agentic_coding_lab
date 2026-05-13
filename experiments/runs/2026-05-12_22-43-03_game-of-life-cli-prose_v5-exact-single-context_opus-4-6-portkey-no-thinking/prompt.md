# Game of Life CLI Kata

## Feature

Conway's Game of Life is a cellular automaton that evolves on a two-dimensional grid. The grid in this kata is theoretically infinite in every direction, so cells can have arbitrary positive or negative integer coordinates. At any moment a cell is either alive or dead. To compute the next generation, every cell looks at its eight neighbors. A living cell with fewer than two live neighbors dies, as if by underpopulation. A living cell with two or three live neighbors continues to live in the next generation. A living cell with more than three live neighbors dies, as if by overpopulation. A dead cell with exactly three live neighbors becomes a living cell, as if by reproduction.

## Task

Build a command-line program that reads a starting configuration and a step count from stdin, advances the world by that many generations, and writes the resulting set of living cells to stdout.

## I/O Contract

The program reads a single JSON document from stdin:

```json
{ "aliveCells": [[x, y], ...], "steps": N }
```

`aliveCells` is the set of currently living cells, each cell expressed as a two-element array `[x, y]` of integers. `steps` is a non-negative integer specifying how many generations to advance. A value of `0` means the program returns the input configuration unchanged.

The program writes a single JSON document to stdout:

```json
{ "aliveCells": [[x, y], ...] }
```

Downstream consumers expect a deterministic order: the output array must be lexicographically sorted, primary key `x` ascending, secondary key `y` ascending.

## Expected Output Files

- Source files implementing the logic and the CLI
- Test files
- CLI entry point at `src/cli.ts` (reads JSON from stdin, writes JSON to stdout)

## Constraints

- Use TypeScript for the implementation
- The CLI must read JSON from stdin and write JSON to stdout
- The CLI entry point must be at `src/cli.ts`
- Use sparse representation (only store living cells)
- Handle negative coordinates
- Internal data structures and module organization are free
