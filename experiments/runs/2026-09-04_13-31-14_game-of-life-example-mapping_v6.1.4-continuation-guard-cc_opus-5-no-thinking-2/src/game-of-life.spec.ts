import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns an empty grid for an empty grid — [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone live cell (underpopulation) — [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills both cells of a pair, each having 1 neighbor (underpopulation) — [(0,1), (1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell with 2 live neighbors alive (survival) — center (1,1) of [(0,0), (2,0), (1,1)] survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });

  it("keeps a live cell with 3 live neighbors alive (survival) — center (1,1) of [(0,0), (1,0), (2,0), (1,1)] survives", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });

  it("kills a live cell with more than 3 live neighbors (overpopulation) — center (1,1) is absent from the next generation of [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)]", () => {
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
    ).not.toContainEqual([1, 1]);
  });

  it("brings a dead cell with exactly 3 live neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(result).toHaveLength(4);
    expect(result).toEqual(
      expect.arrayContaining([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    );
  });

  it("leaves a dead cell with 2 live neighbors dead (no reproduction) — [(0,0), (1,1)] -> []", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("leaves the block still life unchanged — [(0,0), (1,0), (0,1), (1,1)] -> [(0,0), (1,0), (0,1), (1,1)]", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    const result = nextGeneration(block);

    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });

  it("oscillates the vertical blinker to horizontal — [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    const horizontal: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });

  it("oscillates the horizontal blinker back to vertical after two generations — [(0,0), (0,1), (0,2)] -> [(0,0), (0,1), (0,2)]", () => {
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const result = nextGeneration(nextGeneration(vertical));

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(vertical));
  });

  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] -> [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const result = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    const horizontal: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];

    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontal));
  });
});
