import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 Underpopulation: kills two adjacent cells each having 1 neighbor — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("Rule 4 Reproduction: brings a dead cell with exactly 3 neighbors to life — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
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

  it("Rule 2 Survival: a live cell with 3 live neighbors lives on — (1,1) in ###/.#./... survives", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(result).toContainEqual([1, 1]);
  });

  it("Rule 3 Overpopulation: a live cell with more than 3 live neighbors dies — (1,1) in ###/.#./### dies", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(result).not.toContainEqual([1, 1]);
  });

  it("Block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
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

  it("Blinker oscillates back to vertical in generation 2 — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
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

  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    expect(sorted(result)).toEqual(
      sorted([
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ]),
    );
  });
});
