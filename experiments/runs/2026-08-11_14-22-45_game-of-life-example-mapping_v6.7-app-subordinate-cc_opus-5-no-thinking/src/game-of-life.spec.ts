import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both live cells that each have only 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell with 2 neighbors alive (survival) — (1,0) of ###/.../.#. survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 2],
      ]),
    ).toEqual([
      [1, 0],
      [0, 1],
      [1, -1],
      [2, 1],
    ]);
  });

  it("kills a live cell with more than 3 neighbors (overpopulation) — center (1,1) of ###/.#./### dies", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, -1],
      [1, 3],
    ]);
  });

  it("brings a dead cell with exactly 3 neighbors to life (reproduction) — (1,1) of ##./#../... becomes alive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("leaves a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("flips a vertical blinker to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toEqual([
      [0, 1],
      [-1, 1],
      [1, 1],
    ]);
  });

  it("flips a horizontal blinker back to vertical — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    expect(
      nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([
      [0, 1],
      [0, 0],
      [0, 2],
    ]);
  });

  it("handles negative coordinates — a block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] stays unchanged", () => {
    expect(
      nextGeneration([
        [-2, -2],
        [-1, -2],
        [-2, -1],
        [-1, -1],
      ]),
    ).toEqual([
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
    ]);
  });
});
