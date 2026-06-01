import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty array for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell dies of underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two live cells each with one neighbor die of underpopulation — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("a live cell with 2 or 3 live neighbors survives — center (1,1) survives in the survival example", () => {
    // (1,1) is live with exactly 3 live neighbors: (0,1), (2,1), (1,2)
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 2]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("a live cell with more than 3 live neighbors dies of overpopulation — center (1,1) dies in the overpopulation example", () => {
    // (1,1) is live with 4 live neighbors: (0,1), (2,1), (1,0), (1,2)
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction) — (1,1) becomes alive", () => {
    // dead cell (1,1) has exactly 3 live neighbors: (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("blinker oscillates — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toContainEqual([-1, 1]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });

  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
