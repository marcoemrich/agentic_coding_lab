import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single cell die — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill cells by underpopulation (fewer than 2 neighbors) — [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block still life unchanged (survival with 3 neighbors) — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("should let the center cell survive with 3 neighbors — (1,1) in [(0,0),(1,0),(2,0),(1,1)] stays alive", () => {
    // Spec figure for Rule 2 is inconsistent (center shown dead / would have 4 neighbors),
    // so this checks the stated rule: a live center cell with exactly 3 neighbors survives.
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("should kill the center cell by overpopulation (more than 3 neighbors) — (1,1) in ###/.#./### dies", () => {
    // Spec figure for Rule 3 is inconsistent (center has 6 neighbors, not 4; shown Gen 1 is
    // not the true next generation), so this checks the stated rule: > 3 neighbors → dies.
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life by reproduction (exactly 3 neighbors) — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should turn a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(next)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should turn a horizontal blinker back into a vertical one — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
  it("should handle negative coordinates — block at [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] → unchanged", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
