import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns [] for an empty sparse grid -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("makes a single live cell die -- [(0, 0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation -- [(0, 1), (1, 1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps the center cell alive with three neighbors -- (1, 1) remains live", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("applies overpopulation -- center cell (1, 1) with more than 3 neighbors dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("applies reproduction -- [(0, 1), (1, 1), (0, 0)] becomes [(0, 1), (1, 1), (0, 0), (1, 0)]", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("evolves the blinker through two generations -- vertical to horizontal and back", () => {
    const initial = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    expect(nextGeneration(initial)).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(nextGeneration(nextGeneration(initial))).toEqual(initial);
  });
  it("keeps the block still life unchanged -- [(0, 0), (1, 0), (0, 1), (1, 1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
