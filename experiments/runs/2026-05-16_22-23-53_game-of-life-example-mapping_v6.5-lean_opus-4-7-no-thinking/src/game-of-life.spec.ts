import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged as still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // A block (still life) with an extra live cell added at (2,1).
    // The cell (1,1) now has 4 live neighbors: (0,0), (1,0), (0,1), (2,1)
    // → must die from overpopulation.
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1]];
    const result = nextGeneration(input);
    const hasCell = (x: number, y: number) =>
      result.some(([rx, ry]) => rx === x && ry === y);
    expect(hasCell(1, 1)).toBe(false);
  });
  it("should handle negative coordinates correctly", () => {
    // A block at negative coordinates remains a still life.
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
  });
});
