import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// `Cell` documents the public tuple type required by the API contract.
const _cellTypeContract: Cell = [0, 0];
void _cellTypeContract;
void nextGeneration;
void expect;

describe("Conway's Game of Life - next generation", () => {
  it("should kill a single live cell at (0,0) by underpopulation — [(0,0)] becomes [] because it has 0 live neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells by underpopulation — [(0,1),(1,1)] becomes [] because each cell has 1 live neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should let a live center cell at (1,1) survive with exactly 2 live neighbors — the next generation includes (1,1)", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });

  it("should let the live center cell at (1,1) survive with exactly 3 live neighbors — the next generation includes (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });

  it("should kill the live center cell at (1,1) by overpopulation with more than 3 live neighbors — the next generation excludes (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });

  it("should reproduce a dead cell at (1,1) with exactly 3 live neighbors — [(0,0),(1,0),(0,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should keep a 2x2 block unchanged as a still life — [(0,0),(1,0),(0,1),(1,1)] remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should evolve a vertical blinker into a horizontal blinker — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("should evolve a vertical blinker to horizontal and back over 2 generations — [(0,0),(0,1),(0,2)] returns to [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it("should handle an infinite sparse grid across negative coordinates — [(-2,-2),(-1,-2),(-2,-1)] becomes [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] by reproduction at (-1,-1)", () => {
    expect(nextGeneration([[-2, -2], [-1, -2], [-2, -1]])).toEqual([
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ]);
  });
});
