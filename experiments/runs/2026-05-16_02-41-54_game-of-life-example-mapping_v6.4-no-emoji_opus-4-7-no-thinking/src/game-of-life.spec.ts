import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const asCellSet = (cells: Cell[]): Set<string> =>
  new Set(cells.map((c) => c.join(",")));

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // Plus pattern: center (0,0) has 4 live neighbors -> dies (overpopulation).
    // Arms each have 3 live neighbors -> survive.
    // Diagonals each have 3 live neighbors -> born.
    // Result: a 3x3 ring with hollow center.
    const result = nextGeneration([[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]]);
    const expected: Cell[] = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],          [0, 1],
      [1, -1],  [1, 0], [1, 1],
    ];
    expect(asCellSet(result)).toEqual(asCellSet(expected));
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0),(1,0),(0,1). Dead (1,1) has 3 live neighbors -> born.
    // All three live cells have 2 neighbors each -> survive.
    // Result: 2x2 block.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(asCellSet(result)).toEqual(asCellSet(expected));
  });
  it("block pattern is a still life (survival with 3 neighbors each)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(asCellSet(nextGeneration(block))).toEqual(asCellSet(block));
  });
  it("blinker oscillates between vertical and horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    const gen1 = nextGeneration(vertical);
    expect(asCellSet(gen1)).toEqual(asCellSet(horizontal));

    const gen2 = nextGeneration(gen1);
    expect(asCellSet(gen2)).toEqual(asCellSet(vertical));
  });
  it("handles negative coordinates", () => {
    // Block at negative coords: still life
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(asCellSet(nextGeneration(block))).toEqual(asCellSet(block));
  });
});
