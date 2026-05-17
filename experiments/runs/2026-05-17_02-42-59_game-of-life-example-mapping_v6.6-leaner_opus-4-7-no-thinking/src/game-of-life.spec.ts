import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should preserve a block (still life: 2x2 square)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(input));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const input: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill a live cell with 4+ neighbors (overpopulation)", () => {
    // Live cell at (1,1) with 4 neighbors: (0,0),(2,0),(0,2),(2,2)
    const input: [number, number][] = [[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (1,1) is dead but has 3 live neighbors → birth
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at negative coords: (-5,-5), (-5,-4), (-5,-3)
    // Should oscillate to horizontal: (-6,-4), (-5,-4), (-4,-4)
    const input: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
