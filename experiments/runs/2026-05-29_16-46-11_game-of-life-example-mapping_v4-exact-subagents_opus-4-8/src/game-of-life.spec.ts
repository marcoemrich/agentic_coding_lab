import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a live cell with three neighbors (survival)", () => {
    // (1,0) has three live neighbors: (0,0), (2,0), (1,1) -> survives
    expect(nextGeneration([[0, 0], [2, 0], [1, 1], [1, 0]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with four neighbors (overpopulation)", () => {
    // Center cell (1,1) has four live neighbors -> dies by overpopulation
    expect(
      nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three neighbors to life (reproduction)", () => {
    // Dead cell (1,1) has three live neighbors: (0,0), (1,0), (0,1) -> comes alive
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should oscillate a blinker, including negative coordinates", () => {
    // Gen 0: vertical triple (0,0),(0,1),(0,2)
    // Gen 1: horizontal triple (-1,1),(0,1),(1,1) — note negative x coordinate
    const sortByTuple = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortByTuple(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortByTuple([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("should leave a block still life unchanged", () => {
    // Block: each live cell has exactly 3 neighbors and survives;
    // no dead cell gets exactly 3 neighbors -> unchanged
    const sortByTuple = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortByTuple(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual(
      sortByTuple([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
});
