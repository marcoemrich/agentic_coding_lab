import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns empty array when a single live cell has no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns empty array when two adjacent cells each have only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a block (still life) unchanged - 4 cells each with 3 neighbors survive", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual(block.sort());
  });
  it("transforms a vertical blinker to a horizontal blinker (oscillator)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
  it("creates a new live cell when a dead cell has exactly 3 live neighbors (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center (1,1) plus its 4 orthogonal neighbors: center has 4 neighbors → dies
    const input: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker centered around (-10, -10)
    const vertical: [number, number][] = [[-10, -11], [-10, -10], [-10, -9]];
    const horizontal: [number, number][] = [[-11, -10], [-10, -10], [-9, -10]];
    expect(nextGeneration(vertical).sort()).toEqual(horizontal.sort());
  });
});
