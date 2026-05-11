import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent living cells (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should create a living cell from exactly 3 live neighbors (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const sorted = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should keep a cell alive with exactly 2 neighbors (survival)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a cell alive with exactly 3 neighbors (survival)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Plus/cross pattern: center (1,1) has 4 neighbors → dies
    const input: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should preserve a block still life across a generation", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a blinker pattern across a generation", () => {
    const blinkerGen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerGen0);
    const sorted = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
});
