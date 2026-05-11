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
  it("should keep a block pattern unchanged when each cell has exactly three neighbors (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sortFn = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];
    expect(result.sort(sortFn)).toEqual(block.sort(sortFn));
  });
  it("should oscillate a blinker pattern producing new cells by reproduction and killing cells by underpopulation", () => {
    const verticalBlinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expectedHorizontalBlinker: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(verticalBlinker);
    const sortFn = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];
    expect(result.sort(sortFn)).toEqual(expectedHorizontalBlinker.sort(sortFn));
  });
});
