import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a cell alive that has exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const sorted = result.map(c => c.join(",")).sort();
    const expected = [[1, -1], [1, 0], [1, 1]].map(c => c.join(",")).sort();
    expect(sorted).toEqual(expected);
  });
  it("should keep a cell alive that has exactly 3 live neighbors (survival)", () => {
    // T-shape: cell (1,1) has exactly 3 live neighbors: (0,1), (2,1), (1,2)
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]]);
    const resultSet = new Set(result.map(c => c.join(",")));
    // (1,1) should survive because it has exactly 3 live neighbors
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should kill a cell with more than 3 live neighbors (overpopulation)", () => {
    // Plus/cross pattern: center (1,1) has 4 live neighbors → dies
    const input: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map(c => c.join(",")));
    // (1,1) should be dead because it has 4 live neighbors (overpopulation)
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // L-shape in corner: (0,0), (0,1), (1,1)
    // Dead cell (1,0) has exactly 3 live neighbors: (0,0), (0,1), (1,1) → becomes alive
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    const sorted = result.map(c => c.join(",")).sort();
    const expected = [[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")).sort();
    expect(sorted).toEqual(expected);
  });
  it("should keep a block pattern unchanged as a still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.map(c => c.join(",")).sort();
    const expected = [[0, 0], [1, 0], [0, 1], [1, 1]].map(c => c.join(",")).sort();
    expect(sorted).toEqual(expected);
  });
  it("should oscillate a blinker pattern to its alternate orientation", () => {
    // Blinker Gen 0 (vertical): (0,0), (0,1), (0,2)
    // Blinker Gen 1 (horizontal): (-1,1), (0,1), (1,1)
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    const sorted = result.map(c => c.join(",")).sort();
    const expected = [[-1, 1], [0, 1], [1, 1]].map(c => c.join(",")).sort();
    expect(sorted).toEqual(expected);
  });
});
