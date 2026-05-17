import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill both cells in a pair with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) stable as a still life (survival with 3 neighbors)", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors (corners) → dies from overpopulation
    const cells: Array<[number, number]> = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors → reproduces.
    const cells: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]] as Array<[number, number]>));
  });
  it("should handle negative coordinates", () => {
    const vertical: Array<[number, number]> = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]] as Array<[number, number]>),
    );
  });
});
