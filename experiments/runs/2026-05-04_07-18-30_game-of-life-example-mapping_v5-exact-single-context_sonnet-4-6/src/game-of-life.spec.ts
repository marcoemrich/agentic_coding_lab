import { describe, it, expect } from "vitest";
import { Cell, nextGeneration } from "./game-of-life.js";

const sortCells = (cells: Cell[]) => [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells with only one neighbor each", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors", () => {
    // (1,0) has exactly 2 neighbors: (0,0) and (2,0) → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive with exactly 3 neighbors", () => {
    // (1,0) has exactly 3 neighbors: (0,0), (2,0), and (1,1) → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors", () => {
    // (1,1) has 4 neighbors: (1,0), (0,1), (2,1), (1,2) → dies from overpopulation
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("should make a dead cell with exactly 3 live neighbors come alive", () => {
    // dead cell (1,1) has exactly 3 live neighbors: (0,0), (1,0), (0,1) → becomes alive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker pattern", () => {
    // vertical blinker → horizontal blinker
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should keep a block pattern unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
