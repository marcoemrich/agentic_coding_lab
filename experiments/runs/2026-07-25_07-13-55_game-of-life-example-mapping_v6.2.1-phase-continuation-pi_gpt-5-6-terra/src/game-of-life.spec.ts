import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns [] for a single live cell at [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to [(0,1), (1,1)] and returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps the center (1,1) alive when it has three neighbors", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]])).toEqual([[1, 1]]);
  });
  it("removes the overpopulated center (1,1) with expected #.# / #.# / #.# result", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).toEqual([[0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2]]);
  });
  it("reproduces at (1,1) from [(0,0), (1,0), (0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("evolves the blinker to horizontal and back after a second generation", () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(generationOne).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(nextGeneration(generationOne)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("preserves the block still life", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
});
