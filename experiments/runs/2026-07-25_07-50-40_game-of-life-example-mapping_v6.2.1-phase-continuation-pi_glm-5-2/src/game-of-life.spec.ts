import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";
import type { Cell } from "./game-of-life.js";

// Order-independent comparison helper: a generation is a SET of live cells,
// so we sort before comparing to make tests insensitive to output ordering.
const asSorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty array for empty input -- [] -> []", () => {
    expect(asSorted(nextGeneration([]))).toEqual(asSorted([]));
  });
  it("a single isolated live cell dies (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(asSorted(nextGeneration([[0, 0]]))).toEqual(asSorted([]));
  });
  it("two adjacent live cells each die (underpopulation, 1 neighbor) -- [(0,1),(1,1)] -> []", () => {
    expect(asSorted(nextGeneration([[0, 1], [1, 1]]))).toEqual(asSorted([]));
  });
  it("a 2x2 block still life is unchanged (survival, 3 neighbors, no births) -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(asSorted(nextGeneration(block))).toEqual(asSorted(block));
  });
  it("a dead cell with exactly 3 live neighbors is born (reproduction) -- [(0,2),(1,2),(0,1)] -> [(0,2),(1,2),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(asSorted(nextGeneration(gen0))).toEqual(asSorted(expected));
  });
  it("a vertical blinker becomes horizontal (survival 2 + reproduction + underpopulation) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(asSorted(nextGeneration(gen0))).toEqual(asSorted(expected));
  });
  it("overpopulation: a live cell with 4 neighbors dies (center (1,1) absent) -- spec overpop example [(0,2),(1,2),(2,2),(1,1),(0,0),(1,0),(2,0)] -> 8-cell next gen", () => {
    const gen0: Cell[] = [[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]];
    const expected: Cell[] = [[0, 2], [1, 2], [2, 2], [0, 0], [1, 0], [2, 0], [1, 3], [1, -1]];
    expect(asSorted(nextGeneration(gen0))).toEqual(asSorted(expected));
  });
  it("handles negative coordinates -- blinker at [(-2,-2),(-2,-1),(-2,0)] -> [(-3,-1),(-2,-1),(-1,-1)]", () => {
    const gen0: Cell[] = [[-2, -2], [-2, -1], [-2, 0]];
    const expected: Cell[] = [[-3, -1], [-2, -1], [-1, -1]];
    expect(asSorted(nextGeneration(gen0))).toEqual(asSorted(expected));
  });
  it("blinker returns to its original shape after two generations (oscillator period 2)", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(asSorted(nextGeneration(nextGeneration(vertical)))).toEqual(asSorted(vertical));
  });
});
