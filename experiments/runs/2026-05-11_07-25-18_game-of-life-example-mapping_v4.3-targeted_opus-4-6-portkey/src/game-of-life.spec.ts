import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly 2 neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a live cell alive with exactly 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should kill a live cell with 4 neighbors (overpopulation)", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 live neighbors (reproduction)", () => {
    // ##.
    // #..  ->  ##.
    // ...      ##.
    // Live cells: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors -> born
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];
    expect(result.sort(sortFn)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker pattern (oscillator)", () => {
    const sortFn = (a: number[], b: number[]) => a[0] - b[0] || a[1] - b[1];

    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expectedGen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    const gen1 = nextGeneration(gen0);
    expect(gen1.sort(sortFn)).toEqual(expectedGen1.sort(sortFn));

    const gen2 = nextGeneration(gen1);
    expect(gen2.sort(sortFn)).toEqual(gen0.sort(sortFn));
  });
});
