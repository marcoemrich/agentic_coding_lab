import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("should keep a live cell alive when it has exactly 2 live neighbors (survival)", () => {
    // Three cells in a horizontal line: middle cell (1,0) has exactly 2 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });
  it("should keep a live cell alive when it has exactly 3 live neighbors (survival)", () => {
    // T-shape: cell (1,1) has exactly 3 live neighbors: (0,1), (2,1), (1,0)
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0]]);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 live neighbors → dies
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should preserve a block still life pattern unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker pattern", () => {
    // Vertical blinker → horizontal → back to vertical
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const gen1 = nextGeneration(vertical);
    expect(gen1.sort()).toEqual(horizontal.sort());
    const gen2 = nextGeneration(gen1);
    expect(gen2.sort()).toEqual(vertical.sort());
  });
});
