import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty when single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty when two live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block (2x2) unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should transform vertical blinker to horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill live cell with 4 live neighbors (overpopulation)", () => {
    // Center (1,1) is alive with 4 live neighbors at corners → dies
    const cells: [number, number][] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth dead cell with exactly 3 live neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors → becomes alive
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker centered at (-5, -5) → horizontal blinker
    const vertical: [number, number][] = [[-5, -6], [-5, -5], [-5, -4]];
    const expected: [number, number][] = [[-6, -5], [-5, -5], [-4, -5]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
