import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (both have only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a block (2x2) stable (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should transform vertical blinker to horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(lShape);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Center cell (1,1) has 4 live neighbors and should die
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2],         [2, 2],
    ];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative coordinates
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const horizontal: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(horizontal.sort());
  });
});
