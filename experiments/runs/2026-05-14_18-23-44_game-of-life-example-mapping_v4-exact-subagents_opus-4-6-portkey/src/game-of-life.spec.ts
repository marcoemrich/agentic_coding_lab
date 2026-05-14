import { describe, it, expect } from "vitest";
import { nextGeneration, Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent cells with only one neighbor each (underpopulation)", () => {
    const result = nextGeneration([[0, 0], [0, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive when it has exactly 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 or more neighbors (overpopulation)", () => {
    const cells: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should preserve a block still life pattern unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(block.length);
  });
  it("should oscillate a blinker pattern to its next phase", () => {
    const blinkerGen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinkerGen0);
    const blinkerGen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toEqual(expect.arrayContaining(blinkerGen1));
    expect(result).toHaveLength(blinkerGen1.length);
  });
});
