import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  // Simplest cases
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single lonely cell — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation
  it("kills both cells of a horizontal pair, each having 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // Rule 2 - Survival
  it("keeps a live cell with 3 live neighbors alive — [(1,0),(0,1),(1,1),(2,1)] → (1,1) survives", () => {
    const result = nextGeneration([
      [1, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ]);

    expect(result).toContainEqual([1, 1]);
  });

  // Rule 3 - Overpopulation
  it("kills a live cell with 4 live neighbors — center (1,1) of [(0,0),(2,0),(1,1),(0,2),(2,2)] dies", () => {
    const result = nextGeneration([
      [0, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [2, 2],
    ]);

    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction
  it("brings a dead cell with exactly 3 live neighbors to life — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  // Patterns
  it("oscillates a vertical blinker to horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("oscillates a horizontal blinker back to vertical — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });
  it("leaves a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  // Infinite grid / negative coordinates
  it("handles negative coordinates — block at [(-1,-1),(-2,-1),(-1,-2),(-2,-2)] → unchanged", () => {
    const block: Cell[] = [
      [-1, -1],
      [-2, -1],
      [-1, -2],
      [-2, -2],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
