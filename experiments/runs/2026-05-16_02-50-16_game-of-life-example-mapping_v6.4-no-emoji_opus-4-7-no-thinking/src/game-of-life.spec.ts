import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells each with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell alive when it has 2 live neighbors (survival)", () => {
    // Vertical blinker: center cell (0,1) has 2 live neighbors and survives
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors and dies
    const cells: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // From spec rule 4: dead cell (1,1) has exactly 3 live neighbors and becomes alive
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("preserves a block still life across a generation", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("handles negative coordinates correctly", () => {
    // Block still life at negative coordinates
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([-5, -5]);
    expect(result).toContainEqual([-4, -5]);
    expect(result).toContainEqual([-5, -4]);
    expect(result).toContainEqual([-4, -4]);
  });
});
