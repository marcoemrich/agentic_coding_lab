# Game of Life CLI Kata

## User Story

**As a** downstream simulation pipeline
**I want** to pipe a starting configuration and a step count into a command-line program
**so that** I receive the resulting set of living cells back as JSON, without being constrained by grid boundaries.

## Acceptance Criteria

- The program reads a single JSON document from stdin of the shape `{ "aliveCells": [[x, y], ...], "steps": N }` and writes a single JSON document of the shape `{ "aliveCells": [[x, y], ...] }` to stdout.
- Cells are identified by integer `(x, y)` coordinates and may have negative values.
- Only living cells are tracked; the data structure does not allocate memory for dead regions.
- A living cell with fewer than two living neighbors dies in the next generation.
- A living cell with two or three living neighbors stays alive.
- A living cell with more than three living neighbors dies.
- A dead cell with exactly three living neighbors becomes alive.
- The program iterates the rules for exactly `steps` generations before emitting the result. `steps: 0` means the configuration is returned unchanged.
- The emitted `aliveCells` array is lexicographically sorted, primary key `x` ascending, secondary key `y` ascending, so that downstream consumers see a deterministic order.

## Expected Output Files

- Source files implementing the logic and the CLI
- Test files
- CLI entry point at `src/cli.ts` (reads JSON from stdin, writes JSON to stdout)

## Constraints

- Use TypeScript for the implementation
- The CLI must read JSON from stdin and write JSON to stdout
- The file `src/cli.ts` must exist and be the executable CLI entry point
- Use sparse representation (only store living cells)
- Handle negative coordinates
- Internal data structures and module organization are free
