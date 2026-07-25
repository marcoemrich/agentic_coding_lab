import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when input is empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty array when single cell dies from underpopulation -- [] given [(0,0)]", () => {
    const input: Cell[] = [[0, 0]];
    const expected: Cell[] = [];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should return empty array when two adjacent cells die from underpopulation -- [] given [(0,1), (1,1)]", () => {
    const input: Cell[] = [[0, 1], [1, 1]];
    const expected: Cell[] = [];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should keep center cell alive when it has exactly 2 live neighbors -- [(1,1)] given [(0,1), (1,1), (2,1)]", () => {
    const input: Cell[] = [[0, 1], [1, 1], [2, 1]];
    const expected: Cell[] = [[1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should keep center cell alive when it has exactly 3 live neighbors -- [(1,1)] given [(0,1), (1,0), (1,1), (2,1)]", () => {
    const input: Cell[] = [[0, 1], [1, 0], [1, 1], [2, 1]];
    const expected: Cell[] = [[1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should kill center cell due to overpopulation when it has 4 live neighbors -- [] given [(0,1), (1,0), (1,1), (1,2), (2,1)]", () => {
    const input: Cell[] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const expected: Cell[] = [];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should bring dead cell to life when exactly 3 neighbors are alive -- [(1,1)] given [(0,1), (1,0), (2,1)]", () => {
    const input: Cell[] = [[0, 1], [1, 0], [2, 1]];
    const expected: Cell[] = [[1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should evolve blinker pattern horizontally to vertically -- [(-1,1), (0,1), (1,1)] given [(0,0), (0,1), (0,2)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
  it("should preserve block pattern as still life -- [(0,0), (1,0), (0,1), (1,1)] given same", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });
});