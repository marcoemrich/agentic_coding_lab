import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sortCells = (cells: [number, number][]): [number, number][] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("block (2x2) is a still life - unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("blinker oscillates from vertical to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(vertical))).toEqual(sortCells(horizontal));
  });
  it("dead cell with exactly 3 neighbors becomes alive (reproduction)", () => {
    // L-shape: ##/#. - dead cell (1,1) has 3 live neighbors → becomes alive
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(input))).toEqual(sortCells(expected));
  });
  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // X pattern: center (1,1) is live with 4 diagonal neighbors → dies
    //   #.#
    //   .#.
    //   #.#
    const input: [number, number][] = [
      [0, 0], [2, 0],
      [1, 1],
      [0, 2], [2, 2],
    ];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("handles negative coordinates", () => {
    // Block at negative coordinates - should remain unchanged
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
