import { describe, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty input -> empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells die from underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 2 neighbors survives and end cells reproduce -- forms vertical blinker", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("live cell with 3 neighbors survives -- 2x2 block remains unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("live cell with 4 neighbors dies from overpopulation and corners are born -- plus shape evolves to square ring", () => {
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]])).toEqual([
      [0, 0], [0, 1], [0, 2], [1, 0], [1, 2], [2, 0], [2, 1], [2, 2],
    ]);
  });
  it("dead cell with exactly 3 neighbors becomes alive -- L-shape produces a fourth cell", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("block still life remains unchanged -- returns the same four cells", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("blinker oscillator alternates horizontally and vertically -- vertical after one generation", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker oscillator returns to original after two generations -- horizontal again", () => {
    expect(nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("handles negative coordinates -- block at (-1,-1),(0,-1),(-1,0),(0,0) unchanged", () => {
    expect(nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]])).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
