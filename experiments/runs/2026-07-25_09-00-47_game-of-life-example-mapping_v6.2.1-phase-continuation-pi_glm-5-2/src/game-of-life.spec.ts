import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return an empty array for empty input -- [] -> []", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill an isolated single cell with 0 neighbors (Rule 1 underpopulation) -- [(0,0)] -> []", () => {
    const result = nextGeneration([[0, 0]]);
    expect(sortCells(result)).toEqual(sortCells([]));
  });
  it("should kill cells with only 1 neighbor each (Rule 1 underpopulation) -- [(0,1),(1,1)] -> []", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([]));
  });
  it("should birth a dead cell with exactly 3 neighbors (Rule 4 reproduction) -- L-shape [(0,0),(1,0),(0,1)] -> block [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should leave a 2x2 block unchanged (Rule 2 survival, still life) -- [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a vertical blinker to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should kill a cell with 4 neighbors (Rule 3 overpopulation) -- plus shape [(0,1),(1,0),(1,1),(1,2),(2,1)] -> ring with hollow center", () => {
    const result = nextGeneration([[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]));
  });
  it("should handle negative coordinates -- blinker at [(-2,-1),(-2,0),(-2,1)] -> [(-3,0),(-2,0),(-1,0)]", () => {
    const result = nextGeneration([[-2, -1], [-2, 0], [-2, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[-3, 0], [-2, 0], [-1, 0]]));
  });
  it("should return a blinker to its original state after 2 generations (full oscillator cycle)", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(gen0));
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });
});
