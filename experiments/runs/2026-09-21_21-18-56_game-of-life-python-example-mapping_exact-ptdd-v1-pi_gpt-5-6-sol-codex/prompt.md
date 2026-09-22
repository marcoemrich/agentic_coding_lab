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

## Python API and CLI contract

Use Python with pytest and the existing project. Implement the Game of Life under
`src/` and its tests under `tests/`, in files named `test_*.py`. Represent a cell
with a value carrying integer `x` and `y` coordinates. Expose a public
`next_generation` operation that accepts the living cells and returns the next
generation.

For external acceptance, provide `src/cli.py`. Run directly as
`python3 src/cli.py`, it must read one JSON object from stdin and write one JSON
object to stdout, with no additional stdout output:

```json
{"aliveCells": [[0, 0], [1, 0]], "steps": 1}
```

```json
{"aliveCells": []}
```

The CLI applies `next_generation` `steps` times and emits cells sorted by `x`,
then `y`. Internal organization is otherwise free. Use the standard library's
`json` module; do not replace the project stack.
