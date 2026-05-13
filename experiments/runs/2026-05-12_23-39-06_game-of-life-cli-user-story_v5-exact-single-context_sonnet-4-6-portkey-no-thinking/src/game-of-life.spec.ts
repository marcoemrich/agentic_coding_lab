import { describe, it, expect } from "vitest";
import { step, simulate } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty set when given empty set of alive cells", () => {
    expect(step([])).toEqual([]);
  });
  it("should return empty set when a single cell dies from underpopulation", () => {
    expect(step([[0, 0]])).toEqual([]);
  });
  it("should keep a cell alive when it has exactly two neighbors", () => {
    // L-shape [[0,1],[1,0],[1,1]]: each cell has exactly 2 neighbors and survives;
    // dead cell [0,0] has 3 neighbors and is born → result is the 2x2 block
    expect(step([[0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive when it has exactly three neighbors", () => {
    // 2x2 block: every cell has exactly 3 neighbors, all survive
    expect(step([[0, 0], [0, 1], [1, 0], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should birth a new cell when a dead cell has exactly three neighbors", () => {
    // L-shape: [0,0],[1,0],[0,1] all survive (2 neighbors each); dead cell [1,1] has 3 neighbors → born
    expect(step([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell that has more than three neighbors (overpopulation)", () => {
    // Plus/cross: center [1,1] has 4 neighbors → dies (overpopulation)
    // Each arm has 3 neighbors (the other 3 arms via center) → survives
    // 4 corner dead cells each have 3 alive neighbors → born
    // Result: ring of 8 surrounding cells
    expect(step([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]])).toEqual([
      [0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2]
    ]);
  });
  it("should advance zero steps and return cells unchanged", () => {
    expect(simulate([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
  });
  it("should correctly evolve a blinker pattern over one step", () => {
    // Horizontal blinker → vertical blinker after 1 step
    expect(simulate([[1, 0], [1, 1], [1, 2]], 1)).toEqual([[0, 1], [1, 1], [2, 1]]);
  });
  it("should correctly evolve a blinker pattern over two steps (returning to original)", () => {
    // Horizontal blinker → vertical → horizontal (period 2)
    expect(simulate([[1, 0], [1, 1], [1, 2]], 2)).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("should return alive cells sorted by x ascending then y ascending", () => {
    // Cells with negative coordinates to verify sort order: input in arbitrary order
    // Two isolated pairs: [-2,-1] and [-1,-2] each have 1 neighbor → die; but [-2,-2] has 2 neighbors: [-2,-1] and [-1,-2]
    // Actually use a known case: step on a 2x2 block returns same 2x2 block, sorted
    // Provide input in reverse order and verify sorted output
    expect(step([[1, 1], [0, 1], [1, 0], [0, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
