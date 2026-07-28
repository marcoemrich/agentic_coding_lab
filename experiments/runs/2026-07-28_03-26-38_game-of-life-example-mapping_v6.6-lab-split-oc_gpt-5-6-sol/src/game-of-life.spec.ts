import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns no living cells when a single cell dies -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two cells with one neighbor each by underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live center cell with three neighbors alive -- includes [1,1]", () => {
    const next = nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills a live center cell with four neighbors by overpopulation -- excludes [1,1]", () => {
    const next = nextGeneration([[1, 1], [1, 0], [2, 1], [1, 2], [0, 1]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- includes [1,1]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("turns a vertical blinker horizontal and back again -- [[-1,1],[0,1],[1,1]] then original", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal = nextGeneration(vertical);

    expect(horizontal).toEqual([[-1, 1], [0, 1], [1, 1]]);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
  it("leaves a block still life unchanged -- [[0,0],[1,0],[0,1],[1,1]]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(block.length);
  });
});
