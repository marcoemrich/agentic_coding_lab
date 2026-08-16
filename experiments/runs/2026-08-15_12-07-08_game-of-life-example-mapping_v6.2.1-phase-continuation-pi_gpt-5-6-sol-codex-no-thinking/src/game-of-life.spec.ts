import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0) by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two neighbors alive", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it("keeps the center live cell with exactly three neighbors alive", () => {
    const cells: [number, number][] = [[1, 1], [0, 0], [1, 0], [2, 0]];
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("kills a live center cell with more than three neighbors", () => {
    const cells: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell at (1,1) with exactly three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("keeps the 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the blinker back to its vertical state in generation two, including negative coordinates", () => {
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(horizontal)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
