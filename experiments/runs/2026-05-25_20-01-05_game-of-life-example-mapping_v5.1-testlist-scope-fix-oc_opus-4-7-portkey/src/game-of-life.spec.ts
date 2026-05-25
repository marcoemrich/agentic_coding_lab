import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("Game of Life - nextGeneration", () => {
  // Single cell / underpopulation simplest cases
  it("empty grid stays empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell at (0,0) dies (underpopulation) -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation example from spec
  it("two adjacent live cells [(0,1),(1,1)] both die (each has 1 neighbor) -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4 - Reproduction example from spec
  it("L-shape [(0,2),(1,2),(0,1)] produces dead (1,1) coming alive -- [(0,1),(0,2),(1,1),(1,2)]", () => {
    const result = nextGeneration([[0, 2], [1, 2], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[0, 1], [0, 2], [1, 1], [1, 2]]));
  });

  // Rule 2 - Survival example from spec
  it("center cell (1,1) with 3 live neighbors survives (Rule 2 survival)", () => {
    // Cells: (1,1) center with neighbors (0,0),(1,0),(2,0) - exactly 3 live neighbors
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation example from spec
  it("center cell (1,1) with 8 live neighbors dies (Rule 3 overpopulation)", () => {
    // Pattern: ###; .#.; ### -- (1,1) has 8 live neighbors
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Block still life
  it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sortCells(result)).toEqual(sortCells(block));
  });

  // Blinker oscillator
  it("vertical blinker [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });

  // Negative coordinates (infinite grid)
  it("vertical blinker at negative coordinates [(-5,-5),(-5,-4),(-5,-3)] becomes horizontal [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sortCells(result)).toEqual(sortCells([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
