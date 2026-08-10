import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("a single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each die with one neighbor -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly two neighbors survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("the center live cell with exactly three neighbors survives -- includes [1,1]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("a live cell with more than three neighbors dies -- excludes [1,1]", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbors is reproduced -- includes [1,1]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a vertical blinker becomes the specified horizontal blinker -- [[-1,1],[0,1],[1,1]]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("a blinker returns to its original vertical state after two generations -- [[0,0],[0,1],[0,2]]", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(nextGeneration(first)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("a block is unchanged in the next generation -- [[0,0],[1,0],[0,1],[1,1]]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(block.length);
    for (const cell of block) expect(next).toContainEqual(cell);
  });
});
