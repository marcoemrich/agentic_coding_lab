import { describe, it, expect } from "vitest";
import { advanceGenerations } from "./gameOfLife.js";

describe("Conway's Game of Life", () => {
  it("should return input unchanged when steps is 0", () => {
    const input: [number, number][] = [[5, 5], [1, 2]];
    const result = advanceGenerations(input, 0);
    expect(result).toEqual(input);
  });
  it("should return empty grid when input is empty", () => {
    const input: [number, number][] = [];
    const result = advanceGenerations(input, 1);
    expect(result).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    const input: [number, number][] = [[0, 0]];
    const result = advanceGenerations(input, 1);
    expect(result).toEqual([]);
  });
  it("should keep a cell alive with exactly 2 neighbors", () => {
    // Three cells in a row: center cell (0, 0) has 2 neighbors
    const input: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
    const result = advanceGenerations(input, 1);
    // After 1 step: center cell survives (2 neighbors) and new cells are born above/below (3 neighbors each)
    // Result is a vertical line: cells become vertical around x=0
    expect(result).toEqual([[0, -1], [0, 0], [0, 1]]);
  });
  it("should keep a block pattern stable (still life)", () => {
    // 2x2 block: each cell has exactly 3 neighbors
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = advanceGenerations(input, 1);
    // Block pattern is stable - all 4 cells survive
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should evolve blinker pattern correctly after 1 generation", () => {
    // Horizontal blinker: 3 cells in a row
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = advanceGenerations(input, 1);
    // After 1 step, blinker rotates to vertical: center cell survives (2 neighbors)
    // Two new cells are born above and below (3 neighbors each around the center)
    // Result should be: [1, -1], [1, 0], [1, 1] (vertical blinker)
    expect(result).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
});
