import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 (underpopulation): a single live cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 (underpopulation): two live cells with 1 neighbor each die — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 (survival): a live cell with 2 live neighbors lives on — [(0,0), (1,0), (2,0)] keeps (1,0) alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);

    expect(sorted(next)).toContainEqual([1, 0]);
  });
  it("Rule 2 (survival): a live cell with 3 live neighbors lives on — [(0,0), (1,0), (2,0), (1,1)] keeps (1,1) alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });
  it("Rule 3 (overpopulation): a live cell with more than 3 live neighbors dies — center (1,1) of the ### / .#. / ### pattern dies", () => {
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
  it("Rule 4 (reproduction): a dead cell with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → (1,1) becomes alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });
  it("Block (still life) stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const next = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(next)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker oscillates back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const next = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(next)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
  it("handles negative coordinates — [(-10,-10), (-10,-9), (-10,-8)] → [(-11,-9), (-10,-9), (-9,-9)]", () => {
    const next = nextGeneration([
      [-10, -10],
      [-10, -9],
      [-10, -8],
    ]);

    expect(sorted(next)).toEqual([
      [-11, -9],
      [-10, -9],
      [-9, -9],
    ]);
  });
});
