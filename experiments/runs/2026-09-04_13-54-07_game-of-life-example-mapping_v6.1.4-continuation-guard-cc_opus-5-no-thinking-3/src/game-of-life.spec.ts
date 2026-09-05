import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

/** Sorts cells into a canonical order so comparisons ignore output ordering. */
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with 0 neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent live cells, each with 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  // The spec's Rule 2 diagram (row [(0,0),(1,0),(2,0)] plus (1,2) → `.#. / .#.`)
  // is inconsistent with the four rules it illustrates: (1,1) has 4 live
  // neighbors and dies by overpopulation, while (0,1), (1,-1) and (2,1) each
  // have exactly 3 and are born. Survival is asserted here via the spec's
  // unambiguous case instead — the blinker's centre cell, which has 2
  // neighbors and lives on.
  it("keeps a live cell with 2 neighbors alive (survival) — blinker centre (0,1) survives into gen 1", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(result).toContainEqual([0, 1]);
  });

  // The spec's Rule 3 diagram crops the infinite grid to a 3x3 window and
  // misreports its edges: it shows `#.# / #.# / #.#`, but the mid-edge cells
  // (0,1) and (2,1) have 5 live neighbors and die, while four cells *outside*
  // the original box — (-1,1), (1,-1), (1,3), (3,1) — have exactly 3 and are
  // born. The rule the diagram exists to demonstrate is sound and is what is
  // asserted here: the centre (1,1) has 8 live neighbors and dies.
  it("kills a live cell with more than 3 neighbors (overpopulation) — full 3x3 block: centre (1,1) has 8 neighbors and dies", () => {
    const block: Cell[] = [];
    for (let x = 0; x <= 2; x++) {
      for (let y = 0; y <= 2; y++) block.push([x, y]);
    }

    const result = nextGeneration(block);

    expect(result).not.toContainEqual([1, 1]);
    expect(sorted(result)).toEqual([
      [-1, 1],
      [0, 0],
      [0, 2],
      [1, -1],
      [1, 3],
      [2, 0],
      [2, 2],
      [3, 1],
    ]);
  });

  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(sorted(result)).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it("oscillates a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(sorted(result)).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("oscillates a horizontal blinker back into a vertical one — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(sorted(result)).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it("leaves a block still life unchanged — [(0,0),(1,0),(0,1),(1,1)] → same four cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("handles negative coordinates — block at [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] stays unchanged", () => {
    const block: Cell[] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
