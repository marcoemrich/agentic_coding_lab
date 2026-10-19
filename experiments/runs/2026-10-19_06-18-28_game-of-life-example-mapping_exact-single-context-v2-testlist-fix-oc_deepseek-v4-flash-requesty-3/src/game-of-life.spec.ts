import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for a single live cell (dies of underpopulation) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill live cells with fewer than 2 neighbors (Rule 1 underpopulation) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should transition the blinker vertical -> horizontal (Rule 2 survival + Rule 4 reproduction) -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it("should keep a block still life unchanged (survival) -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual([...block].sort());
  });

  it("should reproduce a dead cell with exactly 3 neighbors (Rule 4) -- [(0,0),(1,0),(0,1)] -> 4 cells including (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it("should kill a live cell with more than 3 neighbors (Rule 3 overpopulation) -- center (1,1) of full 3x3 minus center dies", () => {
    const ring: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(ring);
    expect(result).not.toContainEqual([1, 1]);
    expect(result).toEqual([[-1, 1], [0, 0], [0, 2], [1, -1], [1, 3], [2, 0], [2, 2], [3, 1]]);
  });

  it("should handle negative coordinates -- a single negative cell dies -- [(-3,-2)] -> []", () => {
    expect(nextGeneration([[-3, -2]])).toEqual([]);
  });

  it("should handle negative coordinates in a live pattern -- blinker at negative origin transitions", () => {
    expect(nextGeneration([[-1, -1], [-1, 0], [-1, 1]])).toEqual([[-2, 0], [-1, 0], [0, 0]]);
  });
});