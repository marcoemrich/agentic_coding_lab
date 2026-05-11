import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (still life - each cell has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
  });
  it("should rotate a vertical blinker to horizontal (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-tromino from spec: ##. / #.. / ... → ##. / ##. / ...
    // (1,1) is dead with 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Spec Rule 3 example: center cell (1,1) has 6 live neighbors → dies
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(input)).not.toContainEqual([1, 1]);
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker at negative coordinates: vertical → horizontal
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
});
