import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies (underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: two adjacent cells both die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
  it("Rule 2 survival: live cell with 2 or 3 neighbors lives on", () => {
    // Center (1,1) is live with 3 live neighbors -> survives.
    const gen0: Cell[] = [[0, 1], [1, 1], [2, 1], [1, 0]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });
  it("Rule 3 overpopulation: live cell with more than 3 neighbors dies", () => {
    // Center (1,1) is live with more than 3 live neighbors -> dies.
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life is unchanged -- [(0,0),(1,0),(0,1),(1,1)] stays", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("Blinker oscillates -- vertical [(0,0),(0,1),(0,2)] -> horizontal [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sortCells(nextGeneration(gen0))).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]])
    );
  });
});
