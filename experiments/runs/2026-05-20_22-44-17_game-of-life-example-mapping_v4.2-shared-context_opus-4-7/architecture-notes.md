# Architecture Notes

## After cycle 1
- Change: exported `Cell` type alias (`[number, number]`) from `game-of-life.ts`
- Rationale: Rule 2 (Reveals Intent) — publish domain vocabulary so future tests and helpers can name coordinates as `Cell` rather than re-deriving `[number, number]`
- Naming established: `Cell` = `[number, number]` representing a live-cell coordinate pair `[x, y]`

## After cycle 2
- No refactoring (justified): body is `return []` (mass 2) shared by both passing tests via "fake it"; no duplication, no extractable structure, and removing the `Cell` alias would regress cycle 1. Real refactoring opportunities will arrive once the next Red forces a branch on input.

## After cycle 3
- No refactoring (justified): third passing test (two adjacent cells underpopulation) still satisfied by the same `return []` body — mass remains 2. `_cells` underscore-prefix honestly signals unused; renaming would lie. No duplication, no extraction possible, no element removable. Next Red (2x2 block still life) will require a non-empty return, exposing real structure to refactor.

## After cycle 4
- No refactoring (justified): body is fake-it `if (cells.length === 4) return cells; return [];` (mass 7). The magic `4` is deliberately dishonest scaffolding — naming it (e.g. `STILL_LIFE_BLOCK_SIZE`) would entrench a false predicate (a 4-cell row is not a still life), worsening Rule 2. Extracting `isStillLife()` around it would manufacture a lying abstraction. Real neighbor-counting logic belongs to the next Red (L-shape reproduction), which length-fakes cannot satisfy. No duplication, no honest extraction, no element removable without breaking tests.

## After cycle 5
- Change: extracted module-level `cellKey(cell): string` and `survives(count, wasAlive): boolean`; switched neighbor map value from bare `number` to `{ cell: Cell; count: number }` so the original coordinate is carried alongside its tally; renamed local `result` → `next`
- Rationale: Rule 2 (Reveals Intent) names the GoL transition rule (`survives`) and removes the dishonest string-encode/decode round-trip (`k.split(",")` + two `Number()`); Rule 3 (No Duplication) eliminates the parallel encode/decode pathways for the same coordinate; Rule 4 (Fewest Elements) drops the `xs`/`ys`/`x`/`y` reconstruction bindings and consolidates two `result.push` branches into one. Mass ~124 → ~114.
- Naming established: `cellKey(cell: Cell) => string` = canonical "x,y" string key for set/map lookup; `survives(count: number, wasAlive: boolean) => boolean` = full GoL transition rule (B3/S23) for a single position

## After cycle 6
- Change: extracted module-level constant `NEIGHBOR_OFFSETS: ReadonlyArray<Cell>` (the 8 Moore-neighborhood offsets); replaced nested `for dx` / `for dy` plus `if (dx===0 && dy===0) continue;` with a single `for (const [dx, dy] of NEIGHBOR_OFFSETS)` loop
- Rationale: Rule 2 (Reveals Intent) — names the Moore neighborhood directly and expresses "skip self" by absence rather than control flow; Rule 4 (Fewest Elements) — removes one nested loop level and one compound conditional. Mass ~116 → ~107. `survives` name still fits after the overpopulation test (B3/S23 already encoded — overpopulation count=8 falls out of `count === 2 || count === 3` naturally), no rename.
- Naming established: `NEIGHBOR_OFFSETS` = the 8 Moore-neighborhood `[dx, dy]` offsets relative to a live cell (excludes `[0, 0]`)

## After cycle 7
- Change: collapsed neighbor-tally `if (entry) entry.count++; else neighborCounts.set(k, { cell: neighbor, count: 1 });` into branchless `const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 }; entry.count++; neighborCounts.set(key, entry);`; renamed local `k` → `key` (both occurrences) to match the `cellKey` producer
- Rationale: Rule 4 (Fewest Elements) — removes the only conditional inside the neighbor-counting loop, leaving a flat get-or-default → mutate → store sequence (one mental model instead of two branches); Rule 2 (Reveals Intent) — `key` aligns with `cellKey`, removing the one-letter alias. Mass ~107 → ~106 (one conditional eliminated, one extra invocation + one default-zero constant added). `survives` name kept after blinker test — `wasAlive` parameter already signals it covers birth (count===3) as well as survival, no rename warranted.
- Naming established: local `key` = result of `cellKey(cell)` for in-loop Map/Set lookup (no module-level public surface added)
