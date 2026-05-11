import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return no living cells for an empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell (underpopulation, 0 neighbors)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, 1 neighbor each)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    // 2x2 block: each cell has exactly 3 live neighbors
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill a live cell with 4 neighbors (overpopulation)", () => {
    // Plus pattern: center cell (1,1) has 4 live neighbors
    const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has exactly 3 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker pattern (period-2 oscillator)", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(vertical);
    const gen1Sorted = gen1.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(gen1Sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);

    const gen2 = nextGeneration(gen1);
    const gen2Sorted = gen2.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(gen2Sorted).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
