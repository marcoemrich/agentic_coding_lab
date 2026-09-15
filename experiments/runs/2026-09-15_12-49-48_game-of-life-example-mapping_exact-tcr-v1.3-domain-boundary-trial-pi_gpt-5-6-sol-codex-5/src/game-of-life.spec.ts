import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);
}

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it has no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] because each has only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const nextCells = nextGeneration([[0, 1], [1, 1], [2, 1]]);

    expect(nextCells).toContainEqual([1, 1]);
  });
  it("keeps the center cell (1,1) alive when it has exactly 3 live neighbors", () => {
    const nextCells = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]]);

    expect(nextCells).toContainEqual([1, 1]);
  });
  it("kills the center cell (1,1) when it has 4 live neighbors", () => {
    const nextCells = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(nextCells).not.toContainEqual([1, 1]);
  });
  it("makes dead cell (1,1) alive when its neighbors are [(0,1),(0,0),(1,0)]", () => {
    const nextCells = nextGeneration([[0, 1], [0, 0], [1, 0]]);

    expect(nextCells).toContainEqual([1, 1]);
  });
  it("transforms vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    const nextCells = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(nextCells)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("transforms the horizontal blinker back to [(0,0),(0,1),(0,2)] after a second generation", () => {
    const nextCells = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(sorted(nextCells)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("leaves block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
