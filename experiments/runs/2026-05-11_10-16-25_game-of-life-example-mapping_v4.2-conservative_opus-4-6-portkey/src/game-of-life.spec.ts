import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a cell alive that has exactly 2 live neighbors", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 0]])
    );
  });
  it("should keep a cell alive that has exactly 3 live neighbors", () => {
    const result = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 1]])
    );
  });
  it("should kill a cell with 4 live neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 2], [0, 1], [2, 1], [1, 0], [1, 1]]);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);
    expect(result).toEqual(
      expect.arrayContaining([[1, 0]])
    );
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a blinker pattern (period 2)", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);

    // Gen 0 -> Gen 1: vertical line becomes horizontal line
    expect(gen1).toHaveLength(3);
    expect(gen1.sort((a, b) => a[0] - b[0] || a[1] - b[1])).toEqual(
      [[-1, 1], [0, 1], [1, 1]]
    );

    // Gen 1 -> Gen 2: horizontal line becomes vertical line (back to gen0)
    const gen2 = nextGeneration(gen1);
    expect(gen2).toHaveLength(3);
    expect(gen2.sort((a, b) => a[0] - b[0] || a[1] - b[1])).toEqual(
      [[0, 0], [0, 1], [0, 2]]
    );
  });
});
