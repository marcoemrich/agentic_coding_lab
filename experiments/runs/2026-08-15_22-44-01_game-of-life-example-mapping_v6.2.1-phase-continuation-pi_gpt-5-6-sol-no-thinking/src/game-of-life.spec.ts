import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("a single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each die with one neighbor -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with two or three neighbors survives", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 0]);
    expect(next).toContainEqual([1, 1]);
  });
  it("a live cell with more than three neighbors dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbors becomes alive -- [(1,1)] is born", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a four-cell block remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("a vertical blinker becomes horizontal, including negative coordinates", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("a blinker returns to its original state after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(vertical))).toEqual(vertical);
  });
});
