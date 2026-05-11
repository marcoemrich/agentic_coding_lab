import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block pattern unchanged (survival with 2-3 neighbors)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a blinker pattern (reproduction and underpopulation combined)", () => {
    const blinkerGen0 = [[0, 0], [0, 1], [0, 2]];
    const blinkerGen1 = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(blinkerGen0);
    expect(result.sort()).toEqual(blinkerGen1.sort());
  });
});
