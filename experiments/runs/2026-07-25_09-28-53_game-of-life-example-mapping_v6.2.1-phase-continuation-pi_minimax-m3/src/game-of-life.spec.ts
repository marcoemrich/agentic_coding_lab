import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] => {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};

describe("Game of Life - Next Generation", () => {
  it("empty grid returns empty grid", () => {
    expect(sortCells(nextGeneration([]))).toEqual([]);
  });
  it("single cell with no neighbors dies (Pattern example: Single cell dies) -- [(0,0)] -> []", () => {
    expect(sortCells(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("two horizontally adjacent cells each with 1 neighbor die (Rule 1 Underpopulation example) -- [(0,1),(1,1)] -> []", () => {
    expect(sortCells(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("live cell with exactly 2 neighbors survives (Rule 2 Survival lower bound)", () => {
    // 3 cells in a horizontal row: middle has 2 neighbors, ends have 1 each
    // Gen 0: [(0,0),(1,0),(2,0)] -> middle (1,0) survives, ends die
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [2, 0]]))).toEqual([[1, 0]]);
  });
  it("live cell with exactly 3 neighbors survives (Rule 2 Survival upper bound)", () => {
    // L-tetromino: (1,0) has 3 neighbors [(0,0),(2,0),(0,1)] -> survives
    // Gen 0: [(0,0),(1,0),(2,0),(0,1)] -> middle survives, others die
    // Gen 1: [(0,0),(1,0),(0,1)] - L-tromino still life
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1]]))).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
    ]);
  });
  it("dead cell with exactly 3 neighbors becomes alive (Rule 4 Reproduction example)", () => {
    // Gen 0: [(0,0),(1,0),(0,1)] -> dead (1,1) has 3 neighbors -> becomes alive
    // All 3 original cells have 2 neighbors each -> survive
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("dead cell with 2 neighbors stays dead (negative test for Rule 4)", () => {
    // Beehive still life. Each corner dead cell ((0,0),(3,0),(0,2),(3,2))
    // has exactly 2 live neighbors and stays dead. (1,1),(2,1) have 5 -> stay dead.
    expect(
      sortCells(
        nextGeneration([
          [1, 0],
          [2, 0],
          [0, 1],
          [3, 1],
          [1, 2],
          [2, 2],
        ])
      )
    ).toEqual([
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 0],
      [2, 2],
      [3, 1],
    ]);
  });
  it("dead cell with 4 neighbors stays dead (negative test for Rule 4)", () => {
    // 4 cells around center (1,1) -> (1,1) has 4 live neighbors but is dead,
    // so it stays dead (Rule 4 requires exactly 3). All 4 cells have 2 neighbors
    // each and survive as a still life.
    expect(sortCells(nextGeneration([[1, 0], [0, 1], [2, 1], [1, 2]]))).toEqual([
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ]);
  });
  it("live cell with 4 neighbors dies (Rule 3 Overpopulation lower bound)", () => {
    // Plus sign: (1,1) has 4 neighbors [(1,0),(0,1),(2,1),(1,2)] -> dies.
    // The 4 arm cells each have 3 neighbors -> survive. Result: diamond.
    expect(
      sortCells(
        nextGeneration([
          [1, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [1, 2],
        ])
      )
    ).toEqual([
      [0, 1],
      [1, 0],
      [1, 2],
      [2, 1],
    ]);
  });
  it("3x3 fully populated block: corners survive, others die (Rule 3 Overpopulation example)", () => {
    // 3x3 block: 4 corners have 3 neighbors -> survive; 4 edges have 5 -> die;
    // center has 8 -> dies. Result: 4 corners remain.
    expect(
      sortCells(
        nextGeneration([
          [0, 0],
          [1, 0],
          [2, 0],
          [0, 1],
          [1, 1],
          [2, 1],
          [0, 2],
          [1, 2],
          [2, 2],
        ])
      )
    ).toEqual([
      [0, 0],
      [0, 2],
      [2, 0],
      [2, 2],
    ]);
  });
  it("block (2x2) is a still life: unchanged after generation (Pattern example)", () => {
    // 2x2 block: each of the 4 cells has 3 neighbors -> survives. Unchanged.
    expect(
      sortCells(
        nextGeneration([
          [0, 0],
          [1, 0],
          [0, 1],
          [1, 1],
        ])
      )
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("blinker Gen 0 -> Gen 1: vertical line becomes horizontal line (Pattern example)", () => {
    // Gen 0: vertical line at (0,0),(0,1),(0,2).
    // Gen 1: horizontal line at (-1,1),(0,1),(1,1) per spec.
    expect(
      sortCells(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ])
      )
    ).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("blinker Gen 1 -> Gen 2: horizontal line becomes vertical line (Pattern example completes cycle)", () => {
    // Gen 1: horizontal line at (-1,1),(0,1),(1,1).
    // Gen 2: vertical line at (0,0),(0,1),(0,2) per spec.
    expect(
      sortCells(
        nextGeneration([
          [-1, 1],
          [0, 1],
          [1, 1],
        ])
      )
    ).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("negative coordinates are handled correctly", () => {
    // Block shifted into the negative quadrant: still a still life, unchanged.
    expect(
      sortCells(
        nextGeneration([
          [-2, -2],
          [-1, -2],
          [-2, -1],
          [-1, -1],
        ])
      )
    ).toEqual([
      [-2, -2],
      [-2, -1],
      [-1, -2],
      [-1, -1],
    ]);
  });
});
