import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array when a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array when two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block stable (still life - survival with 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(([x, y]) => `${x},${y}`))).toEqual(
      new Set(block.map(([x, y]) => `${x},${y}`))
    );
  });
  it("should kill center cell with 4 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors: corners + edges
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("should bring dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // L-shape: dead cell (1,1) has exactly 3 neighbors
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys).toEqual(new Set(["-1,1", "0,1", "1,1"]));
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker at negative coordinates: vertical → horizontal
    const vertical: [number, number][] = [[-5, -10], [-5, -9], [-5, -8]];
    const result = nextGeneration(vertical);
    const resultKeys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultKeys).toEqual(new Set(["-6,-9", "-5,-9", "-4,-9"]));
  });
});
