import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns [] for []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("makes a single cell [(0,0)] die to []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("makes the underpopulated pair [(0,1),(1,1)] die to []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("maps the Rule 4 reproduction example to [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("maps the Rule 2 survival example ###/.../.#. to .#./.#./...", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toEqual([
      [1, 0], [1, 1], [1, 2],
    ]);
  });
  it("maps the Rule 3 overpopulation example ###/.#./### to the six edge cells", () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).toEqual([
      [0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2],
    ]);
  });
  it("evolves a vertical blinker, including negative x, to [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1], [0, 1], [1, 1],
    ]);
  });
  it("keeps the block still life unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("evolves the blinker's horizontal second generation back to its vertical form", () => {
    expect(nextGeneration([[-1, 1], [0, 1], [1, 1]])).toEqual([
      [0, 0], [0, 1], [0, 2],
    ]);
  });
});
