import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell through underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with only one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell with exactly three neighbors -- (1,1) becomes alive for [(0,1),(1,1),(0,0)]", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toEqual(
      expect.arrayContaining([[0, 0], [0, 1], [1, 0], [1, 1]]),
    );
  });
  it("preserves a live center cell with three neighbors -- (1,1) remains alive for [(0,0),(1,0),(2,0),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills an overpopulated center cell with four neighbors -- (1,1) dies for [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("keeps a block unchanged -- [(0,0),(1,0),(0,1),(1,1)] remains the same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("oscillates a blinker across two generations including negative coordinates -- vertical becomes horizontal then vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
});
