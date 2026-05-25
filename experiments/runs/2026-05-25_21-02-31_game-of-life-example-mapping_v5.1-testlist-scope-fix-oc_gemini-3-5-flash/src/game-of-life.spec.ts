import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given an empty grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should die if a single cell has no neighbors (underpopulation) -- (0,0) -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should die if cells have fewer than 2 neighbors (underpopulation) -- [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should survive if a cell has 2 or 3 live neighbors -- [(0,0), (0,1), (0,2)] (center (0,1) has 2 neighbors) -> survives", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const hasCenter = result.some(([x, y]) => x === 0 && y === 1);
    expect(hasCenter).toBe(true);
  });
  it("should survive if center cell (1,1) has 3 live neighbors -- [(0,1), (1,1), (2,1), (1,2)] -> (1,1) survives", () => {
    // Center cell (1,1) has neighbors (0,1), (2,1), (1,2) plus other cells might change, but we check if (1,1) is present in results.
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]]);
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(true);
  });
  it("should die if a cell has more than 3 live neighbors (overpopulation) -- center cell (1,1) with 4 live neighbors dies", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2], [1, 0]]);
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(false);
  });
  it("should reproduce if a dead cell has exactly 3 live neighbors -- dead (1,1) becomes alive", () => {
    // Dead (1,1) with live neighbors [(0,1), (1,0), (2,1)] (or similar setup)
    // Here we can use [(0,1), (2,1), (1,0)] which are 3 cells, and see if (1,1) becomes alive.
    const result = nextGeneration([[0, 1], [2, 1], [1, 0]]);
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(true);
  });
  it("should correctly calculate a Blinker oscillator transition -- [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expectedGen1 = [
      [-1, 1],
      [0, 1],
      [1, 1]
    ];
    const gen1 = nextGeneration(gen0);
    // Let's sort both arrays so the comparison doesn't fail on ordering
    const sortCells = (arr: [number, number][]) => 
      [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    expect(sortCells(gen1)).toEqual(sortCells(expectedGen1));
  });
  it("should remain unchanged for a Block still life -- [(0,0), (1,0), (0,1), (1,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const gen1 = nextGeneration(block);
    const sortCells = (arr: [number, number][]) => 
      [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    expect(sortCells(gen1)).toEqual(sortCells(block));
  });
});
