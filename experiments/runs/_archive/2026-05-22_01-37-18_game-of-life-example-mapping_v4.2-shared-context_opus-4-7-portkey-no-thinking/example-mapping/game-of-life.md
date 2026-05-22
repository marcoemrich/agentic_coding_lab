# Game of Life — Example Mapping

## Feature

Compute the next generation of Conway's Game of Life on an **infinite**
2D grid using a **sparse** representation (only living cells are
tracked). The grid extends to negative coordinates as well.

## Interface contract

The only public API exported from `src/game-of-life.ts`:

```ts
type Cell = [number, number]; // [x, y]
export function nextGeneration(cells: Cell[]): Cell[];
```

- Input: array of `[x, y]` tuples — the currently-alive cells.
- Output: array of `[x, y]` tuples — the alive cells of the next
  generation.
- The spec does not mandate output order. Tests therefore compare as
  **unordered sets**, e.g. by sorting both `expected` and `actual`
  using a deterministic key (`a[0] - b[0] || a[1] - b[1]`) and using
  `toEqual` on the sorted arrays. This is the only sane comparison
  given each "cell" is itself an array.
- Coordinates may be negative.
- Internal data structure is free (Set/Map/Array). Only the boundary
  signature is fixed.

### Coordinate convention (derived from spec examples)

- `x` = column (left → right increases), `y` = row.
- In the ASCII displays the **top row corresponds to the highest y**.
  - Rule 1 display `##` / `..` with live cells `[(0,1),(1,1)]` → the
    `##` row is y=1, the `..` row is y=0.
  - Blinker Gen 0 (vertical line over three rows) →
    `[(0,0),(0,1),(0,2)]` — column x=0, rows y=0..2.
  - Blinker Gen 1 (horizontal `###` in middle row) →
    `[(-1,1),(0,1),(1,1)]` — row y=1, columns x=-1..1.

A cell at `(x, y)` has **8 neighbours**: the eight cells with
coordinates `(x+dx, y+dy)` where `dx, dy ∈ {-1, 0, 1}` and not both
zero.

## Rules

1. **Underpopulation** — live cell with fewer than 2 live neighbours
   dies.
2. **Survival** — live cell with exactly 2 or 3 live neighbours stays
   alive.
3. **Overpopulation** — live cell with more than 3 live neighbours
   dies.
4. **Reproduction** — dead cell with exactly 3 live neighbours becomes
   alive.

## Examples

For every test, the expected output below has been computed **strictly
from the four rules**, not lifted blindly from the spec's ASCII
drawings. Where the spec's drawing is internally inconsistent with the
rules (see "Questions / Clarifications"), the rule-derived expectation
is authoritative.

### E1 — Empty board
- `[] → []`. Degenerate case; not in spec but trivially follows from
  the rules (no live cells, no dead cell has neighbours).

### E2 — Single live cell dies (Rule 1, spec "Single cell dies")
- `[(0,0)] → []`. Rule 1: the lone live cell has 0 < 2 neighbours.

### E3 — Two adjacent cells both die (Rule 1)
- Spec Rule 1 example, input `[(0,1),(1,1)]` (the `##` / `..` display).
- Each live cell has 1 neighbour (each other) → both die.
- No dead cell has 3 live neighbours.
- `[(0,1),(1,1)] → []`.

### E4 — Block is a still life (Rules 2 + lack of Rule 4 births)
- Spec Block: `[(0,0),(1,0),(0,1),(1,1)]`.
- Every live cell has exactly 3 live neighbours → all survive.
- The only dead cells with > 0 live neighbours are the surrounding
  ring; each has ≤ 2 live neighbours → no births.
- Output equals input as a set.

### E5 — Dead cell with 3 neighbours is born (Rule 4)
- Spec Rule 4 L-shape: `[(0,2),(1,2),(0,1)]`.
- Per-cell rule check:
  - `(0,2)`: neighbours `(1,2),(0,1),(1,1)` → 2 alive (`(1,2),(0,1)`)
    → survives.
  - `(1,2)`: neighbours `(0,2),(0,1),(1,1)` → 2 alive → survives.
  - `(0,1)`: neighbours `(0,2),(1,2),(1,1),(0,0),(1,0)` → 2 alive
    (`(0,2),(1,2)`) → survives.
  - Dead `(1,1)`: neighbours `(0,2),(1,2),(0,1)` all alive → 3 → born.
  - All other dead cells have ≤ 2 live neighbours.
- Output `[(0,2),(1,2),(0,1),(1,1)]` (matches spec drawing
  `##.` / `##.` / `...`).

### E6 — Live cell with 4 neighbours dies (Rule 3, isolated)
- Input: + shape — `[(1,2),(0,1),(1,1),(2,1),(1,0)]`.
- `(1,1)` has 4 live neighbours → dies (Rule 3). This is the most
  direct demonstration of Rule 3.
- Per-cell:
  - `(1,2)`: neighbours `(0,1),(1,1),(2,1)` = 3 → survives.
  - `(0,1)`: neighbours `(1,2),(1,1),(1,0)` = 3 → survives.
  - `(2,1)`: neighbours `(1,2),(1,1),(1,0)` = 3 → survives.
  - `(1,0)`: neighbours `(0,1),(1,1),(2,1)` = 3 → survives.
  - `(1,1)`: 4 neighbours → DIES.
  - Dead corners `(0,0),(2,0),(0,2),(2,2)`: each has neighbours
    `(0,1)+(1,0)+(1,1)` (or symmetric triple) = 3 → BORN.
- Output `[(1,2),(0,1),(2,1),(1,0),(0,0),(2,0),(0,2),(2,2)]` (8
  cells).

### E7 — Blinker oscillates vertical → horizontal (combined rules)
- Spec Blinker: `[(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]`.
- Verifies in one step: Rule 1 (the two end cells `(0,0)`, `(0,2)`
  die — 1 neighbour each), Rule 2 (centre `(0,1)` survives — 2
  neighbours), Rule 4 (`(-1,1)` and `(1,1)` born — 3 neighbours
  each), and negative-x support.

### E8 — Negative y symmetry (horizontal blinker on origin row)
- `[(-1,0),(0,0),(1,0)] → [(0,-1),(0,0),(0,1)]`.
- Same as the blinker but rotated 90°, starting on the y=0 row.
  Verified with the same calculation as E7 (rules are translation-
  and rotation-invariant). Exercises negative `y` explicitly.

### E9 — Sparse / infinite grid: block far from origin
- Input: block at `(100, 100)` →
  `[(100,100),(101,100),(100,101),(101,101)]`.
- Same as E4 just translated; output equals input as a set.
- Confirms there is no implicit grid bound (no row/column tracked
  globally), i.e. the algorithm is truly sparse and the coordinate
  space is unbounded.

## Questions / Clarifications

- **❓ Output order?** Spec does not mandate one. Tests treat output
  as an unordered set (compared after sorting both sides by a
  deterministic `(x, y)` key).
- **❓ Duplicate input cells?** Spec does not mention; treat as
  outside the contract — no tests for duplicates.
- **❓ Spec drawing inaccuracies for Rule 2 and Rule 3?**
  - **Rule 2 drawing**: Gen 0 `###` / `...` / `.#.` with narration
    "(1,1) has 3 live neighbors → survives" — but `(1,1)` is *dead*
    in Gen 0, and a recount gives it 4 live neighbours (the three
    in the top row plus `(1,0)`). Under the four rules this gives
    a Gen 1 of `[(1,2)]` only — not the drawn `.#.` / `.#.` / `...`.
    Resolution: **the rules are authoritative** (this is the
    well-known Conway's Game of Life with universally agreed rules);
    we do not test the spec's Rule 2 drawing directly. Rule 2
    (survival with 2 or 3 neighbours) is covered by E4 (Block,
    survival with 3) and E7 (Blinker centre, survival with 2).
  - **Rule 3 drawing**: Gen 0 `###` / `.#.` / `###` with narration
    "centre has 4 live neighbours → dies" — recount gives 6 live
    neighbours (still > 3 so the centre still dies, but the count
    is off). The drawn Gen 1 `#.#` / `#.#` / `#.#` is also
    rule-inconsistent: e.g. `(1,2)` actually has exactly 3 live
    neighbours in Gen 0 and so survives. Resolution: the rules are
    authoritative; we cover Rule 3 with E6, a clean + shape whose
    centre has exactly 4 neighbours and whose Gen 1 we have derived
    rigorously.
  - The intent of both Rule 2 and Rule 3 drawings ("a live cell
    with N neighbours survives/dies") is faithfully tested via E6
    and E7; only the specific drawn pixels are skipped.

## Per-test rationale

Ordered simple → complex. Each item is exactly one `it.todo()` in
`src/game-of-life.spec.ts`.

1. **`empty input → empty output`** (E1). Smallest possible board;
   confirms the function exists, accepts `[]`, and returns an array.
2. **`single live cell dies (0 neighbours)`** (E2, Rule 1). Spec
   "Single cell dies": `[(0,0)] → []`.
3. **`two adjacent live cells both die (1 neighbour each)`** (E3,
   Rule 1, spec Rule 1 example): `[(0,1),(1,1)] → []`.
4. **`block is a still life`** (E4, Rule 2 survival with 3
   neighbours, no Rule 4 births): `[(0,0),(1,0),(0,1),(1,1)]`
   unchanged.
5. **`dead cell with exactly 3 live neighbours is born`** (E5,
   Rule 4, spec Rule 4 L-shape):
   `[(0,2),(1,2),(0,1)] → [(0,2),(1,2),(0,1),(1,1)]`.
6. **`live cell with 4 neighbours dies; corners born`** (E6,
   Rule 3 centre dies; combined Rules 2 + 4 on the arms): + shape
   `[(1,2),(0,1),(1,1),(2,1),(1,0)] →
    [(1,2),(0,1),(2,1),(1,0),(0,0),(2,0),(0,2),(2,2)]`.
7. **`blinker oscillates vertical → horizontal`** (E7, spec Blinker
   combines Rules 1, 2, 4; tests negative x):
   `[(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]`.
8. **`handles negative y (horizontal blinker on y=0)`** (E8):
   `[(-1,0),(0,0),(1,0)] → [(0,-1),(0,0),(0,1)]`.
9. **`works on a sparse infinite grid (block at (100,100))`** (E9):
   block far from origin unchanged.
