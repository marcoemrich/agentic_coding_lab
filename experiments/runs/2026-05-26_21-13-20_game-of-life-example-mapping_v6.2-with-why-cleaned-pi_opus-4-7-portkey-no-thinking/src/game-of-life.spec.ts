import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  // Simplest case: empty grid
  it("empty grid stays empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("single live cell dies from underpopulation -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die from underpopulation -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Still life - Block (each cell has 3 neighbors -> survives, no new births)
  it("block still life is unchanged -- [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  // Rule 2 - Survival (center cell with 3 neighbors survives)
  it("Rule 2: a live cell with exactly 3 live neighbors survives", () => {
    // L-shape: (0,0) live with neighbors (1,0), (0,1), (1,1) = 3 neighbors
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toContainEqual([0, 0]);
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("Rule 4 example: dead cell (1,1) with 3 neighbors becomes alive", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1 = nextGeneration(gen0);
    expect(sortCells(gen1)).toEqual(sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  // Rule 3 - Overpopulation
  it("Rule 3: a live cell with more than 3 live neighbors dies", () => {
    // Center (1,1) is live with 4 live neighbors (the 4 corners)
    const gen0: Cell[] = [[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).not.toContainEqual([1, 1]);
  });

  // Blinker (oscillator) - integration of survival + reproduction + underpopulation
  it("vertical blinker becomes horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(sortCells(gen1)).toEqual(sortCells([[-1, 1], [0, 1], [1, 1]]));
  });

  // Negative coordinates handling
  it("handles negative coordinates -- horizontal blinker around origin", () => {
    // Horizontal blinker centered at origin
    const gen0: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const gen1 = nextGeneration(gen0);
    expect(sortCells(gen1)).toEqual(sortCells([[0, -1], [0, 0], [0, 1]]));
    // Oscillates back
    const gen2 = nextGeneration(gen1);
    expect(sortCells(gen2)).toEqual(sortCells(gen0));
  });
});
