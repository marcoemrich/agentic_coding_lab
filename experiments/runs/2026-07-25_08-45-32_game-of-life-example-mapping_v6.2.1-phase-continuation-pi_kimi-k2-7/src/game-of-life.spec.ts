import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for an empty input grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells by underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("should let a live cell with exactly 3 neighbors survive", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [2, 1], [10, 10]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 neighbors by overpopulation", () => {
    const result = nextGeneration([[1, 1], [0, 0], [0, 2], [2, 0], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should revive a dead cell with exactly 3 neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should advance a blinker from vertical to horizontal", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
});
