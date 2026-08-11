import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The spec defines a generation as a *set* of living cells; ordering is not
// specified, so grid comparisons sort both sides first.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells, each having 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with 2 live neighbors alive (survival) — (0,0) of [(0,0), (1,0), (1,1)] stays alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [1, 1]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with 3 live neighbors alive (survival) — (1,0) of [(0,0), (1,0), (2,0), (1,1)] stays alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("kills a live cell with more than 3 live neighbors (overpopulation) — center (1,1) of the 3x3 ring plus center is absent in gen 1", () => {
    const ringPlusCenter: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(nextGeneration(ringPlusCenter)).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 live neighbors to life (reproduction) — (1,1) is born from [(0,0), (1,0), (0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("leaves a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
  it("oscillates a horizontal blinker back into a vertical one — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });
  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const vertical: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const horizontal: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
});
