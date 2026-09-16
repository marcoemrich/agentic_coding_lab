import { describe, expect, it } from "vitest";

import { type Cell, nextGeneration } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe("Game of Life -- nextGeneration", () => {
  // Output is treated as an unordered set of cells: the specification defines no
  // ordering contract, so every assertion compares order-insensitively.
  it("returns no living cells for an empty grid -- [] -> []", () => {
    expectCells(nextGeneration([]), []);
  });

  it("kills a single living cell with 0 live neighbors (underpopulation) -- [[0,0]] -> []", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it("kills both cells of a live pair, each having 1 live neighbor (underpopulation) -- [[0,0],[1,0]] -> []", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
      [],
    );
  });

  it("keeps a living cell with exactly 2 live neighbors alive (survival) -- centre of [[0,0],[1,0],[2,0]] stays alive", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);

    expect(sorted(next)).toContainEqual([1, 0]);
  });

  it("keeps a living cell with exactly 3 live neighbors alive (survival) -- every cell of the 2x2 block [[0,0],[1,0],[0,1],[1,1]] survives", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expectCells(nextGeneration(block), block);
  });

  it("kills a living cell with more than 3 live neighbors (overpopulation) -- centre of [[0,0],[1,0],[-1,0],[0,1],[0,-1]] dies", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]);

    expect(next).not.toContainEqual([0, 0]);
  });

  it("brings a dead cell with exactly 3 live neighbors to life (reproduction) -- [[0,0],[1,0],[0,1]] gives birth at [1,1]", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(next).toContainEqual([1, 1]);
  });

  it("leaves a dead cell with exactly 2 live neighbors dead (no reproduction) -- [[0,0],[1,0]] gives no birth", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
      [],
    );
  });

  it("counts only the eight surrounding cells as neighbors -- a cell two steps away is not a neighbor", () => {
    // [0,0] and [2,0] are two steps apart: neither counts the other, so both
    // die of underpopulation while the centre survives on two neighbours.
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);

    expect(next).not.toContainEqual([0, 0]);
    expect(next).not.toContainEqual([2, 0]);
    expect(next).toContainEqual([1, 0]);
  });

  it("handles negative coordinates -- blinker [[-1,-1],[-1,0],[-1,1]] rotates about [-1,0]", () => {
    expectCells(
      nextGeneration([
        [-1, -1],
        [-1, 0],
        [-1, 1],
      ]),
      [
        [-2, 0],
        [-1, 0],
        [0, 0],
      ],
    );
  });

  it("evolves the blinker oscillator through a half period -- [[0,0],[1,0],[2,0]] -> [[1,-1],[1,0],[1,1]]", () => {
    expectCells(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
      ]),
      [
        [1, -1],
        [1, 0],
        [1, 1],
      ],
    );
  });

  it("returns the block still life unchanged -- [[0,0],[1,0],[0,1],[1,1]] -> same four cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expectCells(nextGeneration(block), block);
  });

  it("evolves the glider by one generation -- [[1,0],[2,1],[0,2],[1,2],[2,2]] -> [[0,1],[2,1],[1,2],[2,2],[1,3]]", () => {
    expectCells(
      nextGeneration([
        [1, 0],
        [2, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]),
      [
        [0, 1],
        [2, 1],
        [1, 2],
        [2, 2],
        [1, 3],
      ],
    );
  });
});
