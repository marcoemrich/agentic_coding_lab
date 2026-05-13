# Game of Life CLI Kata

## Input

Implement Conway's Game of Life as a command-line program with an **infinite grid** (theoretically unlimited cells in all x and y directions).

## Feature: Advance a configuration by N generations

### Rules

1. **Underpopulation**: Any live cell with fewer than 2 live neighbors dies
2. **Survival**: Any live cell with 2 or 3 live neighbors lives on
3. **Overpopulation**: Any live cell with more than 3 live neighbors dies
4. **Reproduction**: Any dead cell with exactly 3 live neighbors becomes alive

### I/O Contract

The program reads one JSON document from stdin and writes one JSON document to stdout.

Stdin shape:

```json
{ "aliveCells": [[x, y], ...], "steps": N }
```

Stdout shape:

```json
{ "aliveCells": [[x, y], ...] }
```

`x` and `y` are integers, possibly negative. `steps` is a non-negative integer. The output `aliveCells` array is lexicographically sorted, primary key `x` ascending, secondary key `y` ascending — downstream consumers rely on this order.

### Constraints

- Grid is **infinite** in all directions (positive and negative x/y)
- Only track **living cells** (sparse representation)
- Cells are identified by coordinates `(x, y)`
- A "generation" transforms the current state to the next state

### Schema Examples

These examples illustrate the **shape** of stdin and stdout; they do not enumerate the test cases.

**Example A — `steps: 0` returns the input unchanged.**

```
Stdin:  { "aliveCells": [[5, 5]], "steps": 0 }
Stdout: { "aliveCells": [[5, 5]] }
```

**Example B — A tub (still life) advances by one generation.**

```
Gen 0:        Gen 1:
 .#.           .#.
 #.#     →     #.#
 .#.           .#.
```

```
Stdin:  { "aliveCells": [[0, 1], [1, 0], [1, 2], [2, 1]], "steps": 1 }
Stdout: { "aliveCells": [[0, 1], [1, 0], [1, 2], [2, 1]] }
```

## Task

Implement the Game of Life CLI based on the rules and the I/O contract above.

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
