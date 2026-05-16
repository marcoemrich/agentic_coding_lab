import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a 2x2 block stable (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.length).toBe(4);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("transforms an L-shape into a 2x2 block (reproduction)", () => {
    const lShape: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(lShape);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(expected.map(c => c.join(",")))
    );
  });
  it("oscillates a vertical blinker to horizontal", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(horizontal.map(c => c.join(",")))
    );
  });
  it("kills the center of a fully-surrounded cell (overpopulation)", () => {
    const fullSquare: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullSquare);
    const resultKeys = new Set(result.map(c => c.join(",")));
    expect(resultKeys.has("1,1")).toBe(false);
  });
  it("handles cells at negative coordinates", () => {
    const negBlock: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(negBlock);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(negBlock.map(c => c.join(",")))
    );
  });
});
