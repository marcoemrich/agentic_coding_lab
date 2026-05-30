import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (no neighbors) [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill live cells with fewer than 2 neighbors [(0,1),(1,1)] -> [] (Rule 1: underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell with 2 or 3 neighbors alive (Rule 2: survival)", () => {
    // Gen 0 cross/T shape: ### / ... / .#.  → live cell (1,0) has 2 neighbors (0,0),(2,0) and survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors (Rule 3: overpopulation)", () => {
    // Gen 0: ### / .#. / ###  → center cell (1,1) has >3 live neighbors and dies
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (Rule 4: reproduction)", () => {
    // Gen 0: ## . / # . . / . . .  → dead cell (1,1) has exactly 3 live neighbors (0,0),(1,0),(0,1) and becomes alive
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate the blinker [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    // Gen 0 vertical blinker becomes Gen 1 horizontal blinker (and vice versa)
    const sortCells = (cells: Cell[]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortCells(result)).toEqual(
      sortCells([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("should leave the block still life [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const sortCells = (cells: Cell[]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortCells(result)).toEqual(
      sortCells([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
});
