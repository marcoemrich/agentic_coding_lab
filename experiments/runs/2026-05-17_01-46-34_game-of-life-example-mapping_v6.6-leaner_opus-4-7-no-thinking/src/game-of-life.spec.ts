import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when given an empty array", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a 2x2 block alive unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    const sortFn = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];
    expect(result.sort(sortFn)).toEqual(horizontal.sort(sortFn));
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortFn = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(lShape).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
  it("should handle negative coordinates correctly", () => {
    const verticalBlinker: [number, number][] = [[-10, -1], [-10, 0], [-10, 1]];
    const horizontalBlinker: [number, number][] = [[-11, 0], [-10, 0], [-9, 0]];
    const sortFn = (a: [number, number], b: [number, number]) => a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(verticalBlinker).sort(sortFn)).toEqual(horizontalBlinker.sort(sortFn));
  });
});
