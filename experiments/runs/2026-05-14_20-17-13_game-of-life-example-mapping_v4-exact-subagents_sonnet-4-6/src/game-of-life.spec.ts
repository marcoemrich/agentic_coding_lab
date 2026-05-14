import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array for single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array for two live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep all cells alive in a block (still life)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should reproduce a dead cell with exactly 3 live neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should transform blinker from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(3);
  });
  it("should transform blinker from horizontal back to vertical", () => {
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(horizontal);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toHaveLength(3);
  });
});
