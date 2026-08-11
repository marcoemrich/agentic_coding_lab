import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns no living cells for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single living cell with no neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent cells that each have one neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell alive when it has 3 neighbors (survival) — (1,1) with neighbors (0,0), (1,0), (2,0) survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });

  it("kills a live cell with 4 neighbors (overpopulation) — (1,1) with neighbors (1,0), (0,1), (2,1), (1,2) dies", () => {
    expect(
      nextGeneration([
        [1, 0],
        [0, 1],
        [1, 1],
        [2, 1],
        [1, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });

  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(result).toHaveLength(4);
    expect(result).toContainEqual([1, 1]);
  });

  it("leaves a block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] → same four cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(block.length);
  });

  it("oscillates a vertical blinker to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const horizontal: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expect(result).toEqual(expect.arrayContaining(horizontal));
    expect(result).toHaveLength(horizontal.length);
  });

  it("oscillates a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const result = nextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);

    expect(result).toEqual(expect.arrayContaining(vertical));
    expect(result).toHaveLength(vertical.length);
  });

  it("handles negative coordinates — block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] → unchanged", () => {
    const block: Cell[] = [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ];

    const result = nextGeneration(block);

    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(block.length);
  });
});
