import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should transform a blinker from vertical to horizontal", () => {
    const blinkerV: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const blinkerH: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(blinkerV)).toEqual(blinkerH);
  });
  it("should create a new cell when dead cell has exactly 3 live neighbors (reproduction)", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const gen1: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual(gen1);
  });
});
