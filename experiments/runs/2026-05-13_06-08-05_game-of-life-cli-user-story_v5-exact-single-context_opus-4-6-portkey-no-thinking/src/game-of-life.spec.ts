import { describe, it, expect } from "vitest";
import { evolve } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return alive cells unchanged when steps is 0", () => {
    const aliveCells: [number, number][] = [[1, 1], [2, 2]];
    expect(evolve(aliveCells, 0)).toEqual([[1, 1], [2, 2]]);
  });
  it("should return empty array when no cells are alive", () => {
    expect(evolve([], 1)).toEqual([]);
  });
  it("should kill a single cell (underpopulation)", () => {
    expect(evolve([[0, 0]], 1)).toEqual([]);
  });
  it("should keep a stable block alive (survival with 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(evolve(block, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should bring a dead cell to life with exactly 3 alive neighbors (reproduction)", () => {
    // L-shape: 3 cells, dead cell at [1,1] has exactly 3 neighbors → born
    const lShape: [number, number][] = [[0, 0], [0, 1], [1, 0]];
    expect(evolve(lShape, 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Plus shape: center [1,1] has 4 neighbors → dies
    const plus: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = evolve(plus, 1);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should evolve a blinker over multiple steps", () => {
    // Horizontal blinker → after 2 steps returns to original
    const blinker: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    expect(evolve(blinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Input in non-sorted order, steps=0 — output must still be sorted
    const unsorted: [number, number][] = [[2, 0], [0, 1], [1, 0], [0, 0]];
    expect(evolve(unsorted, 0)).toEqual([[0, 0], [0, 1], [1, 0], [2, 0]]);
  });
  it("should handle negative coordinates", () => {
    // L-shape at negative coords: dead cell at [0,0] has 3 neighbors → born
    const cells: [number, number][] = [[-1, -1], [-1, 0], [0, -1]];
    expect(evolve(cells, 1)).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
