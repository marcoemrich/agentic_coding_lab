import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with 2 or 3 neighbors survive -- (1,0) with 2 neighbors survives in [(0,0),(1,0),(2,0),(1,2)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([1, 0]); // survived with 2 neighbors
    expect(result).toContainEqual([0, 1]); // born with 3 neighbors
    expect(result).toContainEqual([1, -1]); // born with 3 neighbors
    expect(result).toContainEqual([2, 1]); // born with 3 neighbors
  });
  it("should kill overpopulated cells -- full 3x3 block: center (8 neighbors) and edges (5 neighbors) die, corners survive", () => {
    const block3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(block3x3);
    expect(result).toHaveLength(8);
    // corners survive with 3 neighbors
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toContainEqual([0, 2]);
    expect(result).toContainEqual([2, 2]);
    // dead cells adjacent to 3 live cells are born
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([3, 1]);
    expect(result).toContainEqual([1, -1]);
    expect(result).toContainEqual([1, 3]);
    // overpopulated center and edges die
    expect(result).not.toContainEqual([1, 1]);
    expect(result).not.toContainEqual([1, 0]);
    expect(result).not.toContainEqual([0, 1]);
  });
  it("should birth dead cell with exactly 3 neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("should oscillate blinker gen0->gen1 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates -- [(-1,-1)] -> []", () => {
    expect(nextGeneration([[-1, -1]])).toEqual([]);
  });
});
