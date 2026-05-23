import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const toCellSet = (cells: Cell[]): Set<string> =>
  new Set(cells.map(([x, y]) => `${x},${y}`));

describe("Game of Life - Next Generation", () => {
  it("empty input produces empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("Rule 1 – Underpopulation: a single live cell at (0,0) dies → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 – Underpopulation: two adjacent cells [(0,1),(1,1)] both die → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("Rule 2 – Survival: block still life [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(toCellSet(result)).toEqual(toCellSet(block));
  });

  it("Rule 4 – Reproduction: dead cell with exactly 3 neighbors becomes alive (##./#../... → ##./##./...)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(toCellSet(nextGeneration(input))).toEqual(toCellSet(expected));
  });

  it("Rule 3 – Overpopulation: center of ###/.#./### dies with more than 3 neighbors", () => {
    const input: Cell[] = [
      [0, 0], [1, 0], [2, 0],
              [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    expect(toCellSet(nextGeneration(input)).has("1,1")).toBe(false);
  });

  it("Blinker oscillator: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(toCellSet(nextGeneration(input))).toEqual(toCellSet(expected));
  });

  it("handles negative coordinates: blinker [(0,-1),(0,0),(0,1)] → [(-1,0),(0,0),(1,0)]", () => {
    const input: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const expected: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expect(toCellSet(nextGeneration(input))).toEqual(toCellSet(expected));
  });
});
