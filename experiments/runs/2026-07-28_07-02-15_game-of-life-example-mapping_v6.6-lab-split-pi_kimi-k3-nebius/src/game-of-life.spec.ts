import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("Rule 1 (underpopulation): a single live cell dies -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): live cell with 1 neighbor dies -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 (survival): live cell with 3 live neighbors survives -- center (1,1) of [(0,0),(1,0),(2,0),(1,1)] lives on", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([
      1, 1,
    ]);
  });
  it("Rule 3 (overpopulation): live cell with 4 live neighbors dies -- center (1,1) of plus-shaped 5-cell pattern dies", () => {
    expect(
      nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]),
    ).not.toContainEqual([1, 1]);
  });
  it("Rule 4 (reproduction): dead cell with exactly 3 live neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).sort()).toEqual(
      [[0, 0], [0, 1], [1, 0], [1, 1]].sort(),
    );
  });
  it("Block (still life): 2x2 block is unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same cells", () => {
    expect(
      nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]).sort(),
    ).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]].sort());
  });
  it("Blinker (oscillator): vertical line becomes horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).sort()).toEqual(
      [[-1, 1], [0, 1], [1, 1]].sort(),
    );
  });
  it("Blinker (oscillator): horizontal line becomes vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]]).sort()).toEqual(
      [[0, 0], [0, 1], [0, 2]].sort(),
    );
  });
});
