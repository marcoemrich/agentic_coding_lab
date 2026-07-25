import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const asSet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - Next Generation", () => {
  it("empty grid returns empty -- []", () => {
    expect(asSet(nextGeneration([]))).toEqual(asSet([]));
  });
  it("single live cell with 0 neighbors dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(asSet(nextGeneration([[0, 0]]))).toEqual(asSet([]));
  });
  it("two adjacent cells (1 neighbor each) both die (underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(asSet(nextGeneration([[0, 1], [1, 1]]))).toEqual(asSet([]));
  });
  it("block still life: 4 cells each with 3 neighbors all survive, no births -- unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(asSet(nextGeneration(block))).toEqual(asSet(block));
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,2),(1,2),(0,1)] -> 2x2 block", () => {
    const cells: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const expected: Cell[] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(asSet(nextGeneration(cells))).toEqual(asSet(expected));
  });
  it("survival (2 neighbors) + reproduction + underpopulation -- blinker Gen0 [(0,0),(0,1),(0,2)] -> Gen1 [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(asSet(nextGeneration(cells))).toEqual(asSet(expected));
  });
  it("blinker oscillator: two generations returns to original [(0,0),(0,1),(0,2)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(asSet(gen2)).toEqual(asSet(gen0));
  });
  it("overpopulation: live cell with 4 neighbors dies -- plus shape center dies", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const expected: Cell[] = [
      [1, 0], [-1, 0], [0, 1], [0, -1],
      [1, 1], [-1, 1], [1, -1], [-1, -1],
    ];
    const result = nextGeneration(cells);
    expect(asSet(result)).toEqual(asSet(expected));
    expect(result).not.toContainEqual([0, 0]);
  });
  it("negative coordinates: blinker in negative space -- [(-2,-1),(-2,0),(-2,1)] -> [(-3,0),(-2,0),(-1,0)]", () => {
    const cells: Cell[] = [[-2, -1], [-2, 0], [-2, 1]];
    const expected: Cell[] = [[-3, 0], [-2, 0], [-1, 0]];
    expect(asSet(nextGeneration(cells))).toEqual(asSet(expected));
  });
});
