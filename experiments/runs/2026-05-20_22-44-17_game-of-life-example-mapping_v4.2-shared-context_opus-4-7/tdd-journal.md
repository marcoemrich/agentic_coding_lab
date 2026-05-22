# TDD Journal

## Cycle 1 — Red: should return [] for empty input — empty grid stays empty
- Compilation prediction: Module './game-of-life.js' not found — Correct
- Runtime prediction: Expected [], received undefined — Correct
- Discrepancies: none

## Cycle 1 — Green: should return [] for empty input — empty grid stays empty
- Minimal implementation: hardcoded `return []`
- Tests passing: 1

## Cycle 2 — Red: should kill a lone live cell — nextGeneration([[0,0]]) returns []
- Compilation prediction: no compilation error, `nextGeneration` already exists from Cycle 1 — Correct
- Runtime prediction: no runtime error, test passes immediately because hardcoded `return []` already satisfies this case — Correct
- Discrepancies: none — this is a "free pass" test where the previous minimal implementation already covers the new case; Green phase will have nothing to implement

## Cycle 2 — Green: should kill a lone live cell — nextGeneration([[0,0]]) returns []
- Minimal implementation: no change required; existing hardcoded `return []` already satisfies the new test
- Tests passing: 2

## Cycle 3 — Red: should kill two adjacent live cells (underpopulation) — nextGeneration([[0,1],[1,1]]) returns []
- Compilation prediction: no compilation error, `nextGeneration` already exists and accepts `Cell[]` — Correct
- Runtime prediction: no runtime error, test passes immediately because hardcoded `return []` already returns `[]` — Correct
- Discrepancies: none — another "free pass" test where the existing minimal implementation already covers the new case; Green phase will have nothing to implement

## Cycle 3 — Green: should kill two adjacent live cells (underpopulation) — nextGeneration([[0,1],[1,1]]) returns []
- Minimal implementation: no change required; existing hardcoded `return []` already satisfies the new test
- Tests passing: 3

## Cycle 4 — Red: should leave a 2x2 block unchanged (still life) — nextGeneration([[0,0],[1,0],[0,1],[1,1]]) returns same four cells
- Compilation prediction: no compilation error, `nextGeneration` already exists with correct signature — Correct
- Runtime prediction: assertion error, expected `[[0,0],[0,1],[1,0],[1,1]]` but received `[]` from hardcoded return — Correct
- Discrepancies: none — first test that forces the implementation to return non-empty output; Green phase must introduce real logic

## Cycle 4 — Green: should leave a 2x2 block unchanged (still life) — nextGeneration([[0,0],[1,0],[0,1],[1,1]]) returns same four cells
- Minimal implementation: "fake it" — `if (cells.length === 4) return cells;` else `return []` (hardcoded length-based branch, no real Game-of-Life logic yet)
- Tests passing: 4

## Cycle 5 — Red: should birth the diagonal-completing cell from an L-shape (reproduction) — nextGeneration([[0,0],[1,0],[0,1]]) returns the 2x2 block
- Compilation prediction: no compilation error, `nextGeneration` and `Cell` already exist with correct signature — Correct
- Runtime prediction: assertion error, expected `[[0,0],[0,1],[1,0],[1,1]]` but received `[]` (current fake-it branch matches only length===4) — Correct
- Discrepancies: none — this test breaks the length===4 fake-it scaffold and forces real neighbor-counting logic in Green (must compute Rule 2 survival for 3 cells AND Rule 4 reproduction for the dead diagonal cell)

## Cycle 5 — Green: should birth the diagonal-completing cell from an L-shape (reproduction)
- Minimal implementation: replaced fake-it length-branch with real Game-of-Life logic — tally neighbor counts by iterating 8-offsets around each live cell, then apply Rules 2 (survival on 2 or 3) and 4 (birth on exactly 3)
- Tests passing: 5

## Cycle 6 — Red: should kill the center of a full 3x3 from overpopulation — center (1,1) is absent from nextGeneration of nine 3x3 cells
- Compilation prediction: no compilation error, `nextGeneration` already exists with correct signature — Correct
- Runtime prediction: no assertion error, existing `survives(8, true)` returns false (8 ∉ {2,3}) so (1,1) is absent from output — Correct
- Discrepancies: none — "free pass" test where the existing Rule 3 logic from Cycle 5's general implementation already covers overpopulation; Green phase will have nothing to implement

## Cycle 6 — Green: should kill the center of a full 3x3 from overpopulation
- Minimal implementation: no change required; existing `survives(count, wasAlive)` returns false for `survives(8, true)`, so center (1,1) is correctly omitted from output
- Tests passing: 6

## Cycle 7 — Red: should oscillate a vertical blinker into a horizontal blinker — nextGeneration([[0,0],[0,1],[0,2]]) returns [[-1,1],[0,1],[1,1]]
- Compilation prediction: no compilation error, `nextGeneration` and `Cell` already exist with correct signature — Correct
- Runtime prediction: no assertion error, existing general implementation already handles negative coordinates naturally (no grid bounds; just integer arithmetic) and correctly applies Rules 1, 2 and 4 to produce {(-1,1),(0,1),(1,1)} — Correct
- Discrepancies: none — "free pass" capstone test; the general logic from Cycle 5 plus the neighbor-offset refactor from Cycle 6 already covers integration of Rules 1+2+4 with negative coordinates; Green phase will have nothing to implement

## Cycle 7 — Green: should oscillate a vertical blinker into a horizontal blinker
- Minimal implementation: no change required; existing general implementation (Rules 1+2+4 via `survives` + `NEIGHBOR_OFFSETS`) already produces {(-1,1),(0,1),(1,1)} for the vertical blinker
- Tests passing: 7

## Cycle 7 — Refactor
- Naming evaluation: `nextGeneration`, `cellKey`, `survives`, `NEIGHBOR_OFFSETS`, `Cell` all still fit current behavior (B3/S23 with blinker now exercised); only local `k` was misaligned with its producer `cellKey` → renamed `k` → `key` (both loops)
- Refactoring applied: collapsed `if (entry) entry.count++; else neighborCounts.set(k, { cell: neighbor, count: 1 });` into branchless `const entry = neighborCounts.get(key) ?? { cell: neighbor, count: 0 }; entry.count++; neighborCounts.set(key, entry);`
- Rule 4 (Fewest Elements): removed the only conditional inside the neighbor-counting loop → flat get-or-default → mutate → store sequence
- Rule 2 (Reveals Intent): `key` now matches `cellKey` producer; single mental model instead of two branches
- Mass ~107 → ~106
- Tests passing: 7 (all green)
