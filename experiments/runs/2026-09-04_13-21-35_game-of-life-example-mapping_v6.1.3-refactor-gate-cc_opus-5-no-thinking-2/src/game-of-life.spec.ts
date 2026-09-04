import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The contract does not fix the order of the returned cells, so comparisons
// are made against a canonical row-major ordering.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ay - by || ax - bx);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both cells when each has only 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  // Spec's Rule 2 diagram is self-inconsistent: it calls (1,1) — dead in Gen 0 —
  // a cell that "survives", and (1,1) actually has 4 live neighbors so it stays
  // dead. Expectation below follows the four stated rules, which are normative.
  it("keeps a live cell alive when it has 2 neighbors (survival) — (1,0) of ### / ... / .#. survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toContainEqual([1, 0]);
  });
  // As with Rule 2, the spec's Rule 3 diagram does not match the four rules
  // (it draws Gen 1 as #.# / #.# / #.#). The center (1,1) has 6 live neighbours,
  // not 4, and dies by overpopulation — which is the rule this test pins down.
  it("kills a live cell with more than 3 neighbors (overpopulation) — center (1,1) of ### / .#. / ### dies", () => {
    const gen1 = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(gen1).not.toContainEqual([1, 1]);
  });
  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — ##. / #.. / ... → (1,1) alive", () => {
    const gen1 = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(gen1)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("leaves a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates a vertical blinker to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const gen1 = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sorted(gen1)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("oscillates a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const gen2 = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sorted(gen2)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("handles negative coordinates — blinker at (-10,-10) oscillates like any other", () => {
    const gen1 = nextGeneration([[-10, -10], [-10, -9], [-10, -8]]);
    expect(sorted(gen1)).toEqual([[-11, -9], [-10, -9], [-9, -9]]);
  });
});
