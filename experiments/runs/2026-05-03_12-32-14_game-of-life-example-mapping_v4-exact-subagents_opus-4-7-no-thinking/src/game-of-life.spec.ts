// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Conway's Game of Life - Next Generation", () => {
  it("should return empty result for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a 2x2 block unchanged (still life, each cell has 3 neighbors)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should rotate a vertical blinker into a horizontal blinker", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should kill a live cell with 4 or more neighbors (overpopulation)", () => {
    // Input pattern: ### / .#. / ###  (center has 6 live neighbors -> dies)
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(sortCells(result)).toEqual(
      sortCells([[1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3]])
    );
  });
  it("should handle cells at negative coordinates", () => {
    const result = nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, -1], [0, -1], [-1, 0], [0, 0]]));
  });
});
