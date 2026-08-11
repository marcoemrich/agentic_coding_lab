import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Cells as an order-independent set of "x,y" keys. */
const asCellSet = (cells: Cell[]): Set<string> => new Set(cells.map(String));

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell (0 neighbors) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both cells of a domino, each having 1 neighbor (underpopulation) — [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Spec's Rule 2 example ("###"/"..."/".#.") states Gen 1 = ".#."/".#."/"...",
  // but that Gen 1 does not follow from that Gen 0 under Conway's rules (nor
  // under the variant its prose implies). Testing the rule the example names:
  // a live cell with 3 live neighbors survives.
  it("keeps a live cell with 3 neighbors alive (survival) — (1,0) of '###'/'...'/'.#.' survives", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 2]];

    expect(nextGeneration(gen0).map(String)).toContain(String([1, 0]));
  });
  // As with Rule 2, this example's drawn Gen 1 assumes a bounded 3x3 grid — on
  // the infinite grid the task mandates, cells are also born at y=-1 and y=3.
  // Testing the rule the example names: the over-crowded centre dies.
  it("kills a live cell with more than 3 neighbors (overpopulation) — centre (1,1) of '###'/'.#.'/'###' dies", () => {
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];

    expect(nextGeneration(gen0).map(String)).not.toContain(String([1, 1]));
  });
  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — '##.'/'#..'/'...' -> (1,1) alive", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(asCellSet(nextGeneration(gen0))).toEqual(
      asCellSet([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("keeps the block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] -> same 4 cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(asCellSet(nextGeneration(block))).toEqual(asCellSet(block));
  });
  // The two halves of one period-2 oscillator: each generation is the other's
  // input, so together they show the blinker returning to its starting state.
  describe("blinker oscillator", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    it("flips a vertical blinker to horizontal — [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
      expect(asCellSet(nextGeneration(vertical))).toEqual(asCellSet(horizontal));
    });

    it("flips a horizontal blinker back to vertical — [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
      expect(asCellSet(nextGeneration(horizontal))).toEqual(asCellSet(vertical));
    });
  });

  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] -> [(-6,-4),(-5,-4),(-4,-4)]", () => {
    const farFromOrigin: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];

    expect(asCellSet(nextGeneration(farFromOrigin))).toEqual(
      asCellSet([[-6, -4], [-5, -4], [-4, -4]]),
    );
  });
});
