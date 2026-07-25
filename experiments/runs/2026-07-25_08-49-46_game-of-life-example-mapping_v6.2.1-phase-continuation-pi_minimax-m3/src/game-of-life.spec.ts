import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const cellSetEquals = (actual: Cell[], expected: Cell[]): void => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("Game of Life", () => {
  it("should return empty array when input is empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (Rule 1) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with only one neighbor (Rule 1) -- [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should kill non-adjacent live cells each with zero neighbors (Rule 1) -- [(0,0),(5,5)] -> []", () => {
    expect(nextGeneration([[0, 0], [5, 5]])).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (Rule 4) -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    cellSetEquals(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
      [
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ],
    );
  });
  it("should keep a 2x2 block unchanged as a still life (Rule 2 with 3 neighbors) -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    cellSetEquals(nextGeneration(block), block);
  });
  it("should kill interior live cells from overpopulation while keeping corners (Rule 3) -- 2x3 rectangle -> 4 corners + 2 outside births", () => {
    // 2x3 rectangle has 6 cells. The middle row's two cells each see 5 live
    // neighbors (overpopulation, Rule 3) and die. Corner cells see 3 neighbors
    // and survive. Two outside cells (-1,1) and (2,1) each see exactly 3
    // live neighbors and are born.
    const rect: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
      [1, 2],
    ];
    cellSetEquals(nextGeneration(rect), [
      [-1, 1],
      [0, 0],
      [1, 0],
      [0, 2],
      [1, 2],
      [2, 1],
    ]);
  });
  it("should oscillate a vertical blinker to horizontal (Gen 0 -> Gen 1) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    cellSetEquals(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
      [
        [-1, 1],
        [0, 1],
        [1, 1],
      ],
    );
  });
  it("should oscillate a horizontal blinker back to vertical (Gen 1 -> Gen 2) -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    cellSetEquals(
      nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
      [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    );
  });
  it("should return to the original configuration after two generations (period-2 oscillator) -- blinker cycles", () => {
    const start: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const afterOne = nextGeneration(start);
    const afterTwo = nextGeneration(afterOne);
    cellSetEquals(afterTwo, start);
  });
});
