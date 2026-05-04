import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill single cell (underpopulation with 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation with 1 neighbor each)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should transform vertical line to horizontal line (blinker pattern)", () => {
    const gen0 = [[0, 0], [0, 1], [0, 2]]; // vertical line
    const gen1 = [[-1, 1], [0, 1], [1, 1]]; // horizontal line
    expect(nextGeneration(gen0)).toEqual(gen1);
  });
  it("should keep 2x2 block stable (survival with 2-3 neighbors)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should kill center cell with 4+ neighbors (overpopulation)", () => {
    const gen0 = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const gen1 = [[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(gen0)).toEqual(gen1);
  });
});
