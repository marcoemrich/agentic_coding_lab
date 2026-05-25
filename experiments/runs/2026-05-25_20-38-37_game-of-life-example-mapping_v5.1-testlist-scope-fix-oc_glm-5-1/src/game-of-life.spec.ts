import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (a: number[], b: number[]): number =>
  a[0] - b[0] || a[1] - b[1];

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with 0 neighbors (Rule 1: underpopulation) -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor (Rule 1: underpopulation) -- [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a cell with exactly 2 neighbors (Rule 2: survival) -- block corner cell survives", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort(sortCells)).toEqual(block.sort(sortCells));
  });
  it("should keep alive a cell with exactly 3 neighbors (Rule 2: survival) -- [(0,1),(1,1),(2,1),(1,2)] center (1,1) survives", () => {
    const cells: Cell[] = [[0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a cell with more than 3 neighbors (Rule 3: overpopulation) -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] center (1,1) dies", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 neighbors (Rule 4: reproduction) -- [(0,0),(1,0),(0,1)] → (1,1) born", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.sort(sortCells)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort(sortCells));
  });
  it("should leave block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort(sortCells)).toEqual(block.sort(sortCells));
  });
  it("should transform blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(cells);
    expect(result.sort(sortCells)).toEqual([[-1, 1], [0, 1], [1, 1]].sort(sortCells));
  });
  it("should return blinker to original after two generations -- [(0,0),(0,1),(0,2)] → gen1 → [(0,0),(0,1),(0,2)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    const gen2 = nextGeneration(gen1);
    expect(gen2.sort(sortCells)).toEqual(gen0.sort(sortCells));
  });
  it("should handle negative coordinates correctly -- cell at (-1,-1) with 0 neighbors dies", () => {
    expect(nextGeneration([[-1, -1]])).toEqual([]);
  });
});
