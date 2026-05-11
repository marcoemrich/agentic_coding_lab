import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should produce a block from three cells in an L-shape (reproduction and survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should keep a block stable as a still life (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(block.length);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a blinker to its next phase", () => {
    const blinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill a cell with four or more neighbors (overpopulation)", () => {
    // Plus/cross pattern: center cell (1,1) has 4 neighbors → dies
    // ###       #.#
    // .#.   →   #.#
    // ###       #.#
    const input: [number, number][] = [[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(input);
    const centerCell: [number, number] = [1, 1];
    expect(result.some(([x, y]) => x === centerCell[0] && y === centerCell[1])).toBe(false);
  });
});
