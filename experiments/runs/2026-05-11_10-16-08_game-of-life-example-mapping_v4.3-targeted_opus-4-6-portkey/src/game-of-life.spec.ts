import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = (arr: [number, number][]) =>
      [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [0, 1], [1, 0], [1, 1]]));
  });
  it("should keep a live cell alive when it has 2 or 3 live neighbors (survival)", () => {
    // Vertical blinker: center cell (1,1) has exactly 2 live neighbors
    const result = nextGeneration([[1, 0], [1, 1], [1, 2]]);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus-shaped pattern: center (1,1) has 4 live neighbors
    const cells: [number, number][] = [
      [1, 1], // center - has 4 neighbors, should die
      [0, 1], // left
      [2, 1], // right
      [1, 0], // bottom
      [1, 2], // top
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("should produce a stable block pattern (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = (arr: [number, number][]) =>
      [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted(block));
  });
  it("should oscillate a blinker pattern", () => {
    const sorted = (arr: [number, number][]) =>
      [...arr].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    // Gen 0: vertical blinker
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    // Gen 1: horizontal blinker
    const expectedGen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    const gen1 = nextGeneration(gen0);
    expect(sorted(gen1)).toEqual(sorted(expectedGen1));

    // Gen 2: back to vertical (same as gen0)
    const gen2 = nextGeneration(gen1);
    expect(sorted(gen2)).toEqual(sorted(gen0));
  });
});
