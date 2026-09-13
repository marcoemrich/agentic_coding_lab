import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const byCoordinate = (a: Cell, b: Cell): number => a[0] - b[0] || a[1] - b[1];

describe("Game of Life - Next Generation", () => {
  it("should return no living cells for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells that each have 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with 2 live neighbors alive (survival) — (1,0) has 2 neighbors and survives in [(0,0), (1,0), (2,0), (1,2)]", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]).sort(byCoordinate),
    ).toEqual([[0, 1], [1, -1], [1, 0], [2, 1]]);
  });
  it("should keep a live cell with 3 live neighbors alive (survival) — (1,1) has 3 neighbors in [(0,0), (1,0), (2,0), (1,1)] and survives", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]).sort(byCoordinate),
    ).toEqual([[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [2, 1]]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation) — center (1,1) of the ring-plus-center has 4 neighbors and dies", () => {
    expect(
      nextGeneration([
        [0, 0], [1, 0], [2, 0],
        [1, 1],
        [0, 2], [1, 2], [2, 2],
      ]).sort(byCoordinate),
    ).toEqual([[0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2]]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (0,1), (1,0), (1,1)]", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [0, 1]]).sort(byCoordinate),
    ).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should leave a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]).sort(byCoordinate),
    ).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should rotate a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    expect(
      nextGeneration([[0, 0], [0, 1], [0, 2]]).sort(byCoordinate),
    ).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should rotate a horizontal blinker back into a vertical one — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    expect(
      nextGeneration([[-1, 1], [0, 1], [1, 1]]).sort(byCoordinate),
    ).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should handle negative coordinates on an infinite grid — [(-3,-3), (-2,-3), (-3,-2)] → [(-3,-3), (-3,-2), (-2,-3), (-2,-2)]", () => {
    expect(
      nextGeneration([[-3, -3], [-2, -3], [-3, -2]]).sort(byCoordinate),
    ).toEqual([[-3, -3], [-3, -2], [-2, -3], [-2, -2]]);
  });
});
