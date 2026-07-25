import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to two adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two or three live neighbors alive -- the center cell (1,1) survives", () => {
    const next = nextGeneration([[1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills an overpopulated live cell -- center cell (1,1) with more than three neighbors dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });
  it("oscillates a blinker across two generations, including negative coordinates -- vertical to horizontal and back", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expect(nextGeneration(vertical)).toEqual(horizontal);
    expect(nextGeneration(horizontal)).toEqual(vertical);
  });
});
