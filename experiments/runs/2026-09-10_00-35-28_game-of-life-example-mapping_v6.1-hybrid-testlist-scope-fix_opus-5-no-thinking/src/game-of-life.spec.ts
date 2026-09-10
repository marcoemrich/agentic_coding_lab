import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - next generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (underpopulation): a single live cell dies — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): two adjacent cells with 1 neighbor each die — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 (survival): a live cell with 2 or 3 neighbors lives on — (1,0) with 2 neighbors survives", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);

    expect(sorted(result)).toContainEqual([1, 0]);
  });
  it("Rule 3 (overpopulation): the live center cell (1,1) with 4 neighbors dies", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(result).not.toContainEqual([1, 1]);
  });
  it("Rule 4 (reproduction): a dead cell with exactly 3 neighbors becomes alive — [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(sorted(result)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Block (still life): stays unchanged — [(0,0),(1,0),(0,1),(1,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);

    expect(sorted(result)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("Blinker (oscillator): vertical becomes horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(result)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("Blinker (oscillator): horizontal becomes vertical again — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(sorted(result)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("infinite grid: works with negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);

    expect(sorted(result)).toEqual([[-6, -4], [-5, -4], [-4, -4]]);
  });
});
