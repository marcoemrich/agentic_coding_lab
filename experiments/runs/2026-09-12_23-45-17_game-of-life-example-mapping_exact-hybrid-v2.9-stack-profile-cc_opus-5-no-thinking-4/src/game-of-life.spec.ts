import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - next generation", () => {
  // Simplest cases
  it("should return an empty array for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single lone cell (0 neighbours) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation (< 2 live neighbours dies)
  it("should kill both cells of an adjacent pair, each having 1 neighbour — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction (dead cell with exactly 3 neighbours becomes alive)
  it("should bring a dead cell with exactly 3 live neighbours to life — [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });

  // Rule 2: Survival (live cell with 2 or 3 neighbours lives on)
  it("should keep a live cell with exactly 2 live neighbours alive — centre (0,1) of [(0,0),(0,1),(0,2)] survives into gen 1", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("should keep a live cell with exactly 3 live neighbours alive — every cell of the block [(0,0),(1,0),(0,1),(1,1)] survives", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });

  // Rule 3: Overpopulation (> 3 live neighbours dies)
  it("should kill a live cell with 4 live neighbours — centre (1,1) of [(0,0),(2,0),(1,1),(0,2),(2,2)] dies", () => {
    expect(sorted(nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]))).toEqual(
      sorted([[1, 0], [0, 1], [2, 1], [1, 2]])
    );
  });

  // Pattern examples
  it("should oscillate the blinker from vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("should oscillate the blinker back to vertical in gen 2 — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [0, 1], [0, 2]])
    );
  });
  it("should leave the block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });

  // Infinite grid / negative coordinates
  it("should handle negative coordinates — blinker at [(-1,-1),(-1,0),(-1,1)] -> [(-2,0),(-1,0),(0,0)]", () => {
    expect(sorted(nextGeneration([[-1, -1], [-1, 0], [-1, 1]]))).toEqual(
      sorted([[-2, 0], [-1, 0], [0, 0]])
    );
  });
});
