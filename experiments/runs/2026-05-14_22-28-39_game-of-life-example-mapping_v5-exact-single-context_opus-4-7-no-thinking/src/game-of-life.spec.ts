import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has 1 neighbor, underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (still life) unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should kill center cell with 4 neighbors (overpopulation)", () => {
    // Center (1,1) with 4 diagonal neighbors → dies
    const cells: [number, number][] = [
      [0, 0], [2, 0],
      [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("should birth a dead cell with exactly 3 neighbors (reproduction)", () => {
    // Rule 4 example: L-shape -> 2x2 block
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("should handle negative coordinates", () => {
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
