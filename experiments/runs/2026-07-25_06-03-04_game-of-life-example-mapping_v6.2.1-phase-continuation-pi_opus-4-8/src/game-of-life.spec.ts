import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("should return empty for empty input -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation (live cell with < 2 neighbors dies)
  it("Rule 1: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 - Survival (live cell with 2 or 3 neighbors lives on)
  it("Rule 2: a live cell with 2 live neighbors survives -- center of 3-in-a-row", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
  });

  // Rule 3 - Overpopulation (live cell with > 3 neighbors dies)
  it("Rule 3: center cell (1,1) with 4 neighbors dies", () => {
    // Plus shape: center (1,1) with 4 neighbors up/down/left/right
    const gen0: Cell[] = [[1, 1], [1, 0], [1, 2], [0, 1], [2, 1]];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction (dead cell with exactly 3 neighbors becomes alive)
  it("Rule 4: dead cell (1,1) with exactly 3 neighbors becomes alive", () => {
    // Gen 0: ##./#../... -> (0,2),(1,2),(0,1); dead (1,1) has 3 neighbors
    const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });

  // Pattern examples
  it("Blinker: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    const sort = (a: Cell[]) => [...a].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(gen0);
    const sort = (a: Cell[]) => [...a].sort((p, q) => p[0] - q[0] || p[1] - q[1]);
    expect(sort(result)).toEqual(sort(gen0));
  });
});
