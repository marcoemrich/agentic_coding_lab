import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life";

describe("nextGeneration", () => {
  it("keeps an empty generation empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single isolated cell through underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two neighboring cells through underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("reproduces a dead cell that has exactly three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("lets a live cell with two neighbors survive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });

  it("lets a live cell with three neighbors survive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });

  it("kills a live cell with more than three neighbors", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });

  it("oscillates a blinker", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const horizontal = [[-1, 1], [0, 1], [1, 1]] as [number, number][];

    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });

  it("keeps a block unchanged", () => {
    const block = [[0, 0], [0, 1], [1, 0], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toEqual(block);
  });

  it("works across negative coordinates", () => {
    expect(nextGeneration([[-2, -2], [-2, -1], [-2, 0]])).toEqual([
      [-3, -1],
      [-2, -1],
      [-1, -1],
    ]);
  });
});
