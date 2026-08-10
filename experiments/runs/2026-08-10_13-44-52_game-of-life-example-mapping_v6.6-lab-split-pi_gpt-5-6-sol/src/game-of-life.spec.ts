import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the center live cell with exactly three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills the center live cell with more than three live neighbors", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces at a dead cell with exactly three neighbors -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)] including a negative coordinate", () => {
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
  it("turns the horizontal blinker back into [(0,0),(0,1),(0,2)]", () => {
    const expected: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
});
