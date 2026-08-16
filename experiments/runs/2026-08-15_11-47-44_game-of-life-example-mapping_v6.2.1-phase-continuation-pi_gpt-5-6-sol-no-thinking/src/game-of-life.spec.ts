import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at [(0,0)] by underpopulation -- expected []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells at [(0,1),(1,1)] with one neighbor each -- expected []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with three neighbors alive -- center (1,1) survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than three neighbors -- center (1,1) dies", () => {
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual(expect.arrayContaining([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]));
  });
  it("preserves the 2x2 block still life -- expected unchanged coordinates", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)] and back after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const first = nextGeneration(vertical);
    expect(first).toEqual(expect.arrayContaining(horizontal));
    expect(first).toHaveLength(3);
    const second = nextGeneration(first);
    expect(second).toEqual(expect.arrayContaining(vertical));
    expect(second).toHaveLength(3);
  });
  it("handles an oscillator across negative x and y coordinates on the infinite sparse grid", () => {
    const result = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);
    const expected: [number, number][] = [[-3, -2], [-2, -2], [-1, -2]];
    expect(result).toEqual(expect.arrayContaining(expected));
    expect(result).toHaveLength(3);
  });
});
