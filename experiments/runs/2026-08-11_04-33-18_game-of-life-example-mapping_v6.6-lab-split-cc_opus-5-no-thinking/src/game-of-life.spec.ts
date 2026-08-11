import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single lonely cell — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: kills two cells that each have 1 neighbor — [(0,1),(1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: a live cell with 3 live neighbors lives on — (1,1) survives", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: a live cell with more than 3 live neighbors dies — (1,1) absent", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — (1,1) is born", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });
  it("Block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker oscillates vertical to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(next)).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    );
  });
  it("Blinker returns to vertical after two generations — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(next)).toEqual(
      sorted([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    );
  });
  it("handles negative coordinates — blinker at negative offset oscillates the same way", () => {
    const next = nextGeneration([
      [-10, -10],
      [-10, -9],
      [-10, -8],
    ]);

    expect(sorted(next)).toEqual(
      sorted([
        [-11, -9],
        [-10, -9],
        [-9, -9],
      ]),
    );
  });
});
