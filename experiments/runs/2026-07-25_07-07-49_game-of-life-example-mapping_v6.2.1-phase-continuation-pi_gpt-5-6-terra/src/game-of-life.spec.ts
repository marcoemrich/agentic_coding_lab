import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life nextGeneration", () => {
  it("returns [] for an empty generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation -- [(0, 0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells die from underpopulation -- [(0, 1), (1, 1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cells with two or three neighbours survive -- the center (1, 1) remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 1], [1, 2], [2, 1]])).toContainEqual([1, 1]);
  });
  it("an overcrowded live center dies -- the center (1, 1) is absent", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]])).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbours is born -- (1, 0) is alive", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toContainEqual([1, 0]);
  });
  it("a blinker alternates vertically to horizontally and back", () => {
    const initial = [[0, 0], [0, 1], [0, 2]];
    const firstGeneration = nextGeneration(initial);

    expect(firstGeneration).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(nextGeneration(firstGeneration)).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("a block still life remains unchanged -- [(0, 0), (1, 0), (0, 1), (1, 1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
});
