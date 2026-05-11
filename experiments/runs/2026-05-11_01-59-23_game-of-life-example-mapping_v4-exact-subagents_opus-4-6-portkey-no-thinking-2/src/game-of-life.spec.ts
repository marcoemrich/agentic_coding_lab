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
  it("should keep a block (2x2) unchanged as a still life (survival)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const cells = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(cells);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("should transform a vertical blinker into a horizontal blinker (oscillator)", () => {
    const verticalBlinker = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    const expected = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
