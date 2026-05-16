import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block (2x2) is a still life and remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("blinker rotates from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(vertical).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(input).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
  it("live cell with more than 3 neighbors dies (overpopulation)", () => {
    const input: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1],         [2, 1],
      [0, 2], [1, 2], [2, 2],
      [1, 1],
    ];
    const expected: [number, number][] = [
      [0, 0], [2, 0], [0, 2], [2, 2],
      [-1, 1], [1, -1], [1, 3], [3, 1],
    ];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(input).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
  it("works with negative coordinates", () => {
    const horizontal: [number, number][] = [[-1, 0], [0, 0], [1, 0]];
    const expected: [number, number][] = [[0, -1], [0, 0], [0, 1]];
    const sortFn = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect(nextGeneration(horizontal).sort(sortFn)).toEqual(expected.sort(sortFn));
  });
});
