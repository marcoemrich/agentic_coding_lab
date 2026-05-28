import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell due to underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with 1 neighbor due to underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block pattern stable -- all 4 cells survive", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("should keep center cell alive with 3 neighbors (survival) -- center survives", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([0, 0]);
  });
  it("should kill center cell with 8 neighbors (overpopulation) -- center dies", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 neighbors (reproduction) -- new cell appears", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [1, 0]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should transform blinker oscillator from vertical to horizontal -- correct coordinates", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toHaveLength(3);
    expect(gen1).toContainEqual([-1, 1]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);
  });
  it("should handle cells with negative coordinates correctly", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([-2, -2]);
    expect(result).toContainEqual([-1, -2]);
    expect(result).toContainEqual([-2, -1]);
    expect(result).toContainEqual([-1, -1]);
  });
});