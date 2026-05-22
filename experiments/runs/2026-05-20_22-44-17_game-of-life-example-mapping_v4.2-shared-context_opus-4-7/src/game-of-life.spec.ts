import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life — nextGeneration", () => {
  it("should return [] for empty input — empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a lone live cell — nextGeneration([[0,0]]) returns []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells (underpopulation) — nextGeneration([[0,1],[1,1]]) returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should leave a 2x2 block unchanged (still life) — nextGeneration([[0,0],[1,0],[0,1],[1,1]]) returns the same four cells", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should birth the diagonal-completing cell from an L-shape (reproduction) — nextGeneration([[0,0],[1,0],[0,1]]) returns the 2x2 block [[0,0],[1,0],[0,1],[1,1]]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should kill the center of a full 3x3 from overpopulation — center (1,1) is absent from nextGeneration of all nine cells of the 3x3", () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("should oscillate a vertical blinker into a horizontal blinker — nextGeneration([[0,0],[0,1],[0,2]]) returns [[-1,1],[0,1],[1,1]]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const sorted = [...result].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
});
