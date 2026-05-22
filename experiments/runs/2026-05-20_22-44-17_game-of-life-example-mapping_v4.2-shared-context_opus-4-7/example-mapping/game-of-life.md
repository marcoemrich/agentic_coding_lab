# Example Mapping: Game of Life

## API Contract

```ts
type Cell = [number, number]; // [x, y]
export function nextGeneration(cells: Cell[]): Cell[];
```

- Input: array of `[x, y]` tuples representing currently living cells.
- Output: array of `[x, y]` tuples representing living cells in the next generation.
- Only living cells appear in input/output (sparse representation).
- Grid is infinite; negative coordinates are valid.
- Cell ordering in the returned array is NOT specified by the spec, so tests
  must compare results as sets (e.g. sort both sides before comparing, or
  use `expect.arrayContaining` + length check).

## Coordinate Convention (derived from spec drawings)

In the ASCII grids in the spec, `(x, y)` works as:
- `x` increases left-to-right (column index)
- `y` increases top-to-bottom (row index)

Evidence: Rule 4 Gen 0 grid is
```
##.
#..
...
```
with the statement that dead cell `(1,1)` (middle) has exactly 3 neighbors
and becomes alive. Those three neighbors must be at `(0,0)`, `(1,0)`,
`(0,1)`, i.e. top-left, top-middle, middle-left — which only works if `y`
grows downward.

Same convention applied to the Blinker:
- Gen 0 `[(0,0), (0,1), (0,2)]` is a vertical bar at column x=0, rows 0..2.
- Gen 1 `[(-1,1), (0,1), (1,1)]` is a horizontal bar at row y=1, columns -1..1.

## Rules

1. **Underpopulation** — a live cell with fewer than 2 live neighbors dies.
2. **Survival** — a live cell with 2 or 3 live neighbors lives on.
3. **Overpopulation** — a live cell with more than 3 live neighbors dies.
4. **Reproduction** — a dead cell with exactly 3 live neighbors becomes alive.

A "neighbor" is any of the 8 cells adjacent horizontally, vertically, or
diagonally (Moore neighborhood).

## Examples

### E1 — Empty grid stays empty (boundary)
- Input: `[]`
- Output: `[]`
- Covers: Rule 1/2/3/4 vacuously; "only living cells" constraint.

### E2 — Single cell dies (Rule 1, underpopulation)
- Input: `[(0,0)]`
- Output: `[]`
- A lone live cell has 0 neighbors → dies.

### E3 — Two adjacent cells both die (Rule 1, underpopulation)
- Input: `[(0,1), (1,1)]`
- Output: `[]`
- Each live cell has exactly 1 neighbor → both die.
- Source: spec "Rule 1 – Underpopulation" example.

### E4 — Block still life survives unchanged (Rule 2, survival)
- Input: `[(0,0), (1,0), (0,1), (1,1)]`
- Output: same 4 cells (as a set).
- Each of the 4 live cells has exactly 3 live neighbors → survives.
- No dead cell has exactly 3 live neighbors → no births.
- Source: spec "Block (still life)" example.

### E5 — Blinker rotates from vertical to horizontal (Rules 1+2+4)
- Input (Gen 0): `[(0,0), (0,1), (0,2)]` — vertical bar.
- Output (Gen 1): `[(-1,1), (0,1), (1,1)]` — horizontal bar.
- Center `(0,1)` has 2 neighbors → survives (Rule 2).
- Ends `(0,0)` and `(0,2)` have 1 neighbor → die (Rule 1).
- Dead cells `(-1,1)` and `(1,1)` each have exactly 3 live neighbors → born (Rule 4).
- Demonstrates negative-coordinate handling.
- Source: spec "Blinker (oscillator)" example.

### E6 — Center of full 3x3 dies from overpopulation (Rule 3)
- Input (Gen 0): all 9 cells of the 3x3 grid: `[(0,0),(1,0),(2,0),(0,1),(1,1),(2,1),(0,2),(1,2),(2,2)]`.
- The spec illustrates Gen 1 corners alive, edges dead, center dead.
- Specifically, center cell `(1,1)` has 8 live neighbors → dies (Rule 3).
- Source: spec "Rule 3 – Overpopulation" example. This test focuses on the
  spec's stated claim: the center cell dies (i.e. `(1,1)` is NOT in Gen 1).

### E7 — Reproduction: L-shape births the diagonal-completing cell (Rule 4)
- Input (Gen 0): `[(0,0), (1,0), (0,1)]` — three corners of a 2x2.
- The spec states dead cell `(1,1)` has exactly 3 live neighbors → becomes alive.
- Output (Gen 1) includes `(1,1)` plus whichever of the originals survive
  under Rules 1–3. Walking the rules:
  - `(0,0)`: neighbors are `(1,0)` and `(0,1)` → 2 neighbors → survives.
  - `(1,0)`: neighbors are `(0,0)` and `(0,1)` → 2 neighbors → survives.
  - `(0,1)`: neighbors are `(0,0)` and `(1,0)` → 2 neighbors → survives.
  - `(1,1)`: dead, 3 neighbors → born.
- Output (Gen 1) as a set: `[(0,0), (1,0), (0,1), (1,1)]` — i.e. the block.
- Source: spec "Rule 4 – Reproduction" example.

## Questions / Clarifications

- ❓ **Output order**: spec does not constrain the order of the returned
  array. Tests will compare as sets (sort or arrayContaining).
- ❓ **Duplicates in input**: spec says input is an array of coordinates of
  living cells. The spec gives no example with duplicates, so tests will not
  rely on either accepting or rejecting duplicates. (Not a tested behaviour.)
- ❓ **Coordinate orientation**: resolved above — `y` increases downward in
  the ASCII grids. The function itself is symmetric in x/y so this only
  matters for interpreting the spec's drawings into coordinate lists.

## Per-test Rationale

Tests are ordered simple → complex.

1. `should return [] for empty input` — E1, boundary case, simplest possible
   call. No rules fire.
2. `should kill a lone live cell (single cell dies)` — E2, Rule 1 in
   isolation with the smallest non-trivial input.
3. `should kill two adjacent cells (underpopulation)` — E3, Rule 1 with
   exactly 1 neighbor per live cell, from the spec's Rule 1 illustration.
4. `should leave a block (2x2) unchanged (still life)` — E4, Rule 2 in
   isolation plus implicitly Rule 4 (no births), from the spec's Block
   example.
5. `should produce the diagonal-completing cell from an L-shape (reproduction)`
   — E7, Rule 4, from the spec's Rule 4 illustration. Also exercises Rule 2
   survival for the three original cells.
6. `should kill the center of a full 3x3 (overpopulation)` — E6, Rule 3,
   verifies that `(1,1)` (8 neighbors) is dead in Gen 1.
7. `should oscillate a vertical blinker into a horizontal blinker` — E5,
   integration of Rules 1, 2 and 4, with negative-coordinate output. Most
   complex test; serves as the capstone.
