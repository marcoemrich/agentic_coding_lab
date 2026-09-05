import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Cells have no meaningful order, so compare canonically sorted copies. */
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two live cells that each have 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  // NOTE: the spec's Rule 2 illustration is internally inconsistent — its diagram
  // draws (1,1) as dead with 4 live neighbours, while its prose claims (1,1) has 3
  // live neighbours and survives. Neither reading reproduces the Gen 1 it depicts.
  // This test therefore covers survival with an unambiguous case derived from the
  // four rules: in a vertical blinker the centre cell has exactly 2 live neighbours.
  it("keeps a live cell with 2 neighbors alive (survival) — center (0,1) of [(0,0), (0,1), (0,2)] survives", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  // NOTE: the spec's Rule 3 prose says the centre has 4 live neighbours, but the
  // diagram it draws (###/.#./###) gives the centre 6. Either way the count exceeds
  // 3, so overpopulation applies; the drawn coordinates are used here.
  it("kills a live cell with more than 3 neighbors (overpopulation) — center (1,1) of ###/.#./### dies", () => {
    const ringPlusCenter: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(ringPlusCenter)).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("leaves a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates a vertical blinker to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(result)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("oscillates a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sorted(result)).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(sorted(result)).toEqual(sorted([[-6, -4], [-5, -4], [-4, -4]]));
  });
});
