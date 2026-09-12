import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// Cell order is an implementation detail the kata does not specify,
// so compare generations order-insensitively.
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  // Baseline
  it("should return an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1 - Underpopulation (live cell with < 2 live neighbors dies)
  it("should kill a single lone cell with 0 neighbors — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells of a pair that each have 1 neighbor — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 live neighbors becomes alive)
  it("should bring a dead cell with exactly 3 live neighbors to life — [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });

  // Rule 2 - Survival (live cell with 2 or 3 live neighbors lives on)
  // The spec's Rule 2 art is internally inconsistent: taken literally its Gen 0
  // (### / ... / .#.) leaves (1,1) dead with 4 neighbours, which matches neither
  // the prose ("(1,1) has 3 live neighbors -> survives") nor its own Gen 1 art.
  // The live set below is the one reading that satisfies the prose exactly:
  // (1,1) alive with 3 live neighbours, so Rule 2 keeps it alive.
  it("should keep a live cell with 3 live neighbors alive — center (1,1) of [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);

    expect(result).toContainEqual([1, 1]);
    expect(sortCells(result)).toEqual(
      sortCells([[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [2, 1]])
    );
  });

  // Rule 3 - Overpopulation (live cell with > 3 live neighbors dies)
  // The spec's Rule 3 art is also inconsistent with the rules it illustrates.
  // For Gen 0 (### / .#. / ###) the centre (1,1) has 6 live neighbours, not 4 —
  // it still dies, which is the rule being demonstrated. But the spec's Gen 1
  // art (#.# / #.# / #.#) is not what the four rules produce: (0,1) and (2,1)
  // each have 5 live neighbours so they stay dead, while (1,-1) and (1,3) each
  // have exactly 3 and are born. The expectation below is derived from the
  // rules (hand-computed and cross-checked), not copied from the art.
  it("should kill a live cell with more than 3 live neighbors — centre (1,1) of [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] dies", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(result).not.toContainEqual([1, 1]);
    expect(sortCells(result)).toEqual(
      sortCells([[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3]])
    );
  });

  // Pattern examples
  it("should keep a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should rotate a vertical blinker to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("should oscillate a blinker back to vertical after two generations — [(0,0),(0,1),(0,2)] -> ... -> [(0,0),(0,1),(0,2)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];

    const gen2 = nextGeneration(nextGeneration(vertical));

    expect(sortCells(gen2)).toEqual(sortCells(vertical));
  });

  // Infinite grid / negative coordinates
  it("should handle negative coordinates on the infinite grid — blinker at [(-10,-10),(-10,-9),(-10,-8)] -> [(-11,-9),(-10,-9),(-9,-9)]", () => {
    expect(sortCells(nextGeneration([[-10, -10], [-10, -9], [-10, -8]]))).toEqual(
      sortCells([[-11, -9], [-10, -9], [-9, -9]])
    );
  });
});
