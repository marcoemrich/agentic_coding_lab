import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to two adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("lets a live cell with two or three neighbors survive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("kills an overpopulated live center cell with more than three neighbors", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it("keeps a 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("turns a vertical blinker into [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("returns a blinker to its original state after two generations", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(initial))).toEqual(initial);
  });
  it("handles an oscillator across negative coordinates on the infinite grid", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1], [-2, -1], [-1, -1],
    ]);
  });
});
