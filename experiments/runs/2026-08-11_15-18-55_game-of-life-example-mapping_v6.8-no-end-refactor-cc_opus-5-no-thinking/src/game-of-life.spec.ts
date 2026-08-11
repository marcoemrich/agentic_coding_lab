import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// A generation is a set of live cells; the order they come back in is not
// part of the specification. Compare canonically so tests stay decoupled
// from incidental iteration order.
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent live cells, each with 1 neighbor (rule 1, underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell with 2 live neighbors alive (rule 2, survival) — the center of a vertical blinker survives", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    // (0,1) is live with exactly 2 live neighbors — (0,0) and (0,2) — so it
    // survives. The tips have only 1 neighbor each and die.
    expect(sortCells(nextGeneration(verticalBlinker))).toContainEqual([0, 1]);
  });

  it("kills a live cell with more than 3 live neighbors (rule 3, overpopulation) — the center of a filled ring is absent from the next generation", () => {
    // "###" / ".#." / "###" — the live center (1,1) is surrounded by 6 live
    // cells (every neighbor but (0,1) and (2,1)), well over the limit of 3.
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];

    expect(nextGeneration(gen0)).not.toContainEqual([1, 1]);
  });

  it("brings a dead cell with exactly 3 live neighbors to life (rule 4, reproduction) — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    // "##." / "#.." / "..." — the dead corner (1,1) has exactly 3 live
    // neighbors and is born; the three originals each have 2 and survive.
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const gen1: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sortCells(nextGeneration(gen0))).toEqual(sortCells(gen1));
  });

  it("keeps a block unchanged (still life) — [(0,0),(1,0),(0,1),(1,1)] → unchanged", () => {
    // Every cell of a 2x2 block has exactly 3 live neighbors and survives; no
    // dead cell around it reaches 3, so nothing is born.
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it("oscillates a vertical blinker into a horizontal one — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    // The center survives on 2 neighbors, both tips die on 1, and the two
    // cells flanking the center are born on exactly 3 — including (-1,1),
    // which lies off the negative side of the origin.
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontal: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });

  it("oscillates a blinker back to vertical after two generations — [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    // A blinker is a period-2 oscillator: two generations return it to its
    // starting state.
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    expect(sortCells(nextGeneration(nextGeneration(vertical)))).toEqual(
      sortCells(vertical),
    );
  });

  it("handles negative coordinates — blinker at [(-5,-5),(-5,-4),(-5,-3)] → [(-6,-4),(-5,-4),(-4,-4)]", () => {
    // The same blinker translated into fully negative territory: the grid is
    // infinite in all directions, so the origin holds no special position.
    const vertical: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const horizontal: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];

    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
});
