import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return no living cells for an empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill cells that have only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive that has exactly 2 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should keep a live cell alive that has exactly 3 live neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should kill a live cell that has more than 3 live neighbors (overpopulation)", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life that has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should not bring a dead cell to life that has fewer than 3 live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).toEqual([]);
  });
  it("should keep a block pattern unchanged across a generation (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a blinker pattern to its alternate form", () => {
    const blinkerGen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerGen0);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const expected = [[-1, 1], [0, 1], [1, 1]].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual(expected);
  });
});
