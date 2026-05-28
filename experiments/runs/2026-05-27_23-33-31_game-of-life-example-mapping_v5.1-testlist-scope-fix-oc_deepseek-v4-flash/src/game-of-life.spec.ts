import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell due to underpopulation -- [(0,0)] -> []", () => {
    const input: Cell[] = [[0, 0]];
    expect(nextGeneration(input)).toEqual([]);
  });

  it("should kill two adjacent cells (each has 1 neighbor) due to underpopulation -- [(0,1), (1,1)] -> []", () => {
    const input: Cell[] = [[0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual([]);
  });

  it("should keep block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(input);
  });

  it("should keep center cell alive with 3 neighbors (survival) -- Rule 2 example: [(0,0), (1,0), (2,0), (1,2)] -> [(1,-1), (1,0), (0,1), (2,1)]", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    const expected: Cell[] = [[1, -1], [1, 0], [0, 1], [2, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });

  it("should kill center cell with 4+ neighbors (overpopulation) -- Rule 3 example: full border of 3x3 grid -> corners survive, edge-centers die, border births", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[1, -1], [0, 0], [2, 0], [-1, 1], [3, 1], [0, 2], [2, 2], [1, 3]];
    expect(nextGeneration(input)).toEqual(expected);
  });

  it("should bring dead cell with exactly 3 neighbors to life (reproduction) -- Rule 4 example: [(0,0), (1,0), (0,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });

  it("should oscillate blinker from vertical to horizontal -- Gen 0 [(0,0),(0,1),(0,2)] -> Gen 1 [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(expected);
  });

  it("should oscillate blinker from horizontal to vertical -- Gen 1 [(-1,1),(0,1),(1,1)] -> Gen 2 [(0,0),(0,1),(0,2)]", () => {
    const input: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(input)).toEqual(expected);
  });
});