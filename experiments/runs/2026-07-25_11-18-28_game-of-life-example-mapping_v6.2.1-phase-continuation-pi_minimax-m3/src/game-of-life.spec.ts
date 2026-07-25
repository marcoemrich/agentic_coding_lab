import { describe, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// Helper: sort cells for deterministic comparison.
// The API contract does not guarantee output order, so we sort both
// the actual and expected output before comparing.
const sortedCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]));

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array for an empty input", () => {
    expect(sortedCells(nextGeneration([]))).toEqual([]);
  });
  it("kills a single isolated cell -- [(0,0)] -> [] (Rule 1: underpopulation)", () => {
    expect(sortedCells(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("kills two cells that have 1 neighbor each -- [(0,1),(1,1)] -> [] (Rule 1 example from spec)", () => {
    expect(sortedCells(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("horizontal row of 3 becomes vertical column of 3 -- [(0,0),(1,0),(2,0)] -> [(1,-1),(1,0),(1,1)] (blinker, demonstrates Rule 2 survival + Rule 4 reproduction)", () => {
    expect(
      sortedCells(nextGeneration([[0, 0], [1, 0], [2, 0]])),
    ).toEqual([
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("Rule 3 overpopulation: hollow 3x3 square -- center dies and (1,-1), (1,3) are born at the gaps -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] -> [(0,0),(1,-1),(1,0),(1,2),(1,3),(0,2),(2,0),(2,2)]", () => {
    expect(
      sortedCells(
        nextGeneration([
          [0, 0],
          [1, 0],
          [2, 0],
          [1, 1],
          [0, 2],
          [1, 2],
          [2, 2],
        ]),
      ),
    ).toEqual([
      [0, 0],
      [0, 2],
      [1, -1],
      [1, 0],
      [1, 2],
      [1, 3],
      [2, 0],
      [2, 2],
    ]);
  });
  it("Rule 4 reproduction: L-shape births the missing corner -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      sortedCells(nextGeneration([[0, 0], [1, 0], [0, 1]])),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("blinker oscillator step 1: vertical line of 3 becomes horizontal line of 3 -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(
      sortedCells(nextGeneration([[0, 0], [0, 1], [0, 2]])),
    ).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("blinker oscillator step 2: horizontal line of 3 becomes vertical line of 3 -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(
      sortedCells(nextGeneration([[-1, 1], [0, 1], [1, 1]])),
    ).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("block is a still life: 2x2 block stays unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(
      sortedCells(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])),
    ).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("handles negative coordinates: L-shape at (-1,-1), (0,-1), (-1,0) reproduces the Rule 4 example with negative positions", () => {
    expect(
      sortedCells(nextGeneration([[-1, -1], [0, -1], [-1, 0]])),
    ).toEqual([
      [-1, -1],
      [-1, 0],
      [0, -1],
      [0, 0],
    ]);
  });
});
