import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: center cell with 3 neighbors lives on", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 2]];
    expect(sortCells(nextGeneration(gen0))).toEqual(
      sortCells([[0, 1], [1, -1], [1, 0], [2, 1]]),
    );
  });
  it("Rule 3 overpopulation: center cell with 4 neighbors dies", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(sortCells(nextGeneration(gen0))).toEqual(
      sortCells([[0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2]]),
    );
  });
  it("Rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    expect(sortCells(nextGeneration(gen0))).toEqual(
      sortCells([[0, 0], [0, 1], [1, 0], [1, 1]]),
    );
  });
  it("Block still life stays unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(gen0))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]]),
    );
  });
});
