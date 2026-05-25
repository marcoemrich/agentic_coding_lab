import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // 1. Simplest cases
  it("should return an empty array when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return an empty array when given a single cell -- underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // 2. Rule 1: Underpopulation
  it("should make a pair of cells die -- underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // 3. Rule 2: Survival
  it("should let a cell survive if it has 2 or 3 neighbors -- survival", () => {
    // Gen 0: ###       Gen 1: .#.
    //        ...  ->          .#.
    //        .#.              ...
    // Center cell (1,1) has 3 live neighbors -> survives.
    // Let's test standard coordinates:
    // cells: (0,1), (1,1), (2,1) for ###
    //        (1,-1) for .#.
    // Let's check cell (1,1)'s neighbors: (0,1), (2,1), (1,-1) which is exactly 3.
    // So (1,1) should survive.
    // Input cells: [(0,1), (1,1), (2,1), (1,-1)]
    // Let's test if (1,1) is in the output cells.
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, -1]]);
    const hasCenterCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenterCell).toBe(true);
  });

  // 4. Rule 3: Overpopulation
  it("should make a cell with 4 or more neighbors die -- overpopulation", () => {
    // Gen 0: ###       Gen 1: #.#
    //        .#.  ->          #.#
    //        ###              #.#
    // Center cell (1,1) has 4 or more live neighbors -> dies.
    // In Gen 0: (0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)
    // Let's test that (1,1) is not in Gen 1.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    const hasCenterCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenterCell).toBe(false);
  });

  // 5. Rule 4: Reproduction
  it("should make a dead cell with exactly 3 neighbors become alive -- reproduction", () => {
    // Gen 0: ##.
    //        #..
    //        ...
    // Dead cell (1,1) has exactly 3 live neighbors -> becomes alive.
    // Live cells in Gen 0: (0,0), (1,0), (0,1)
    // Dead cell at (1,1) has neighbors: (0,0), (1,0), (0,1).
    // Let's verify (1,1) becomes alive in Gen 1.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const hasCenterCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenterCell).toBe(true);
  });

  // 6. Pattern Examples
  it("should handle a blinker (oscillator) pattern", () => {
    // Gen 0: [(0,0), (0,1), (0,2)]
    // Gen 1: [(-1,1), (0,1), (1,1)]
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedGen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const resultGen1 = nextGeneration(gen0);
    
    // Sort and compare helper to handle different ordering
    const sortCells = (arr: Cell[]) => [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(resultGen1)).toEqual(sortCells(expectedGen1));
  });
  // 6. Pattern Examples
  it("should handle a block (still life) pattern", () => {
    // Gen 0: [(0,0), (1,0), (0,1), (1,1)]
    // Gen 1: unchanged
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    
    const sortCells = (arr: Cell[]) => [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(result)).toEqual(sortCells(block));
  });
});
