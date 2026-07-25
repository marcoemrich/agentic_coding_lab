import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("should return an empty array when given an empty array -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell by underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells by underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should let a live cell with 3 neighbors survive -- [(1,1)] stays alive", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });

  it("should kill a live cell with 4 neighbors by overpopulation -- []", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [1, 0]])).not.toContainEqual([1, 1]);
  });

  it("should reproduce a dead cell with exactly 3 live neighbors -- [(1,1)]", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2]])).toContainEqual([1, 1]);
  });

  it("should keep a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });

  it("should transform a blinker from vertical to horizontal -- [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("should transform a horizontal blinker back to vertical -- [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it("should handle negative coordinates correctly -- [(-1,-1),(0,-1),(-1,0),(0,0)]", () => {
    const input: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(nextGeneration(input)).toEqual(expect.arrayContaining(input));
    expect(nextGeneration(input)).toHaveLength(4);
  });
});
