import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each, producing [] (underpopulation example)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive (survival)", () => {
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(result).toContainEqual([0, 0]);
  });
  it("keeps the example's center live cell with exactly three live neighbors alive (survival example)", () => {
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(result).toContainEqual([0, 0]);
  });
  it("kills a live center cell with more than three live neighbors (overpopulation example)", () => {
    const result = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(result).not.toContainEqual([0, 0]);
  });
  it("turns dead (1,1) alive from exactly three neighbors, producing the 2x2 block (reproduction example)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps the 2x2 block unchanged (still-life example)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns the vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("turns the blinker back to its original vertical state after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];

    expect(nextGeneration(nextGeneration(vertical))).toEqual(vertical);
  });
  it("applies the rules at negative coordinates on the infinite grid", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
