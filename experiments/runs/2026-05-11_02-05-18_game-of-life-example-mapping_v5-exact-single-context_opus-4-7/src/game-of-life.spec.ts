import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("should return empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells, each with only 1 neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should let a live cell with 2 live neighbors survive", () => {
    // 3 in a row: middle cell (1,0) has 2 live neighbors → survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 live neighbors (overpopulation)", () => {
    // Hollow box of 3x3 minus middle row sides — center (1,1) has 6 live neighbors
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1) — dead cell (1,1) has 3 live neighbors
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should oscillate the blinker pattern from vertical to horizontal", () => {
    // Vertical: (0,0),(0,1),(0,2) → Horizontal: (-1,1),(0,1),(1,1)
    expect(sortCells(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]])
    );
  });
  it("should keep the block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("should handle negative coordinates", () => {
    // Horizontal blinker at y=-5 → vertical blinker around (-2,-5)
    expect(sortCells(nextGeneration([[-3, -5], [-2, -5], [-1, -5]]))).toEqual(
      sortCells([[-2, -6], [-2, -5], [-2, -4]])
    );
  });
});
