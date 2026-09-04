import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns no living cells for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("lets a single cell die of underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("lets two adjacent cells die, each having 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with 3 neighbors alive — (1,1) survives in [(0,0), (1,0), (2,0), (1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than 3 neighbors by overpopulation — (1,1) dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 neighbors to life — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("leaves a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("oscillates a vertical blinker to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(next)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("oscillates a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
  it("handles negative coordinates — [(-1,-1), (-2,-1), (-3,-1)] → [(-2,-2), (-2,-1), (-2,0)]", () => {
    const next = nextGeneration([[-1, -1], [-2, -1], [-3, -1]]);
    expect(sorted(next)).toEqual(sorted([[-2, -2], [-2, -1], [-2, 0]]));
  });
});
