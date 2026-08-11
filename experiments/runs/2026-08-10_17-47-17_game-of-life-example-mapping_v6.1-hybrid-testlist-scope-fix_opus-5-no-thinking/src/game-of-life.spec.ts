import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The spec describes generations as sets of coordinates, so comparisons of a
// whole grid ignore the order cells come back in.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - nextGeneration", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Single cell dies: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 underpopulation: a live cell with 1 neighbor dies — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 2 survival: a live cell with 2 neighbors lives on", () => {
    // Horizontal triple: (1,0) has exactly 2 live neighbors and survives.
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("Rule 2 survival: a live cell with 3 neighbors lives on", () => {
    // In a 2x2 block each cell has exactly 3 live neighbors and survives.
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it("Rule 3 overpopulation: a live cell with more than 3 neighbors dies", () => {
    // '###/.#./###' — the center (1,1) has 6 live neighbors and dies.
    const grid: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(grid)).not.toContainEqual([1, 1]);
  });
  it("Rule 4 reproduction: a dead cell with exactly 3 neighbors becomes alive — [(0,0), (1,0), (0,1)] → (1,1) alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("Rule 4 example in full: '##./#../...' → '##./##./...'", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(gen0))).toEqual(sorted(gen1));
  });
  it("Rule 3 example in full: '###/.#./###' → '#.#/#.#/#.#' within the 3x3 window", () => {
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    // The spec's ASCII art crops to the original 3x3 window. On an infinite
    // grid two further cells are born just outside it, at (1,-1) and (1,3).
    const gen1: Cell[] = [
      [0, 0], [2, 0],
      [0, 2], [2, 2],
      [1, 0], [1, 2],
      [1, -1], [1, 3],
    ];
    expect(sorted(nextGeneration(gen0))).toEqual(sorted(gen1));
  });
  it("Block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("Blinker gen 0 → gen 1 — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
  it("Blinker gen 1 → gen 2 — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });
  it("handles negative coordinates — a block at (-3,-3) stays unchanged", () => {
    const block: Cell[] = [[-3, -3], [-2, -3], [-3, -2], [-2, -2]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
