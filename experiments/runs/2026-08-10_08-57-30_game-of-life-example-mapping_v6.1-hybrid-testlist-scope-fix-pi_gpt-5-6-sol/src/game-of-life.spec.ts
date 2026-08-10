import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("a single cell at (0,0) dies -- expected []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: adjacent cells (0,1) and (1,1) die -- expected []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: a live cell with exactly 2 live neighbors remains alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("survival: a live cell with exactly 3 live neighbors remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation: a live cell with more than 3 live neighbors dies", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead cell (1,1) with exactly 3 neighbors becomes alive -- expected 2x2 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("block still life remains unchanged -- expected [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    expect(nextGeneration(block)).toHaveLength(4);
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
  });
  it("blinker oscillates vertical to horizontal to vertical -- includes (-1,1)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    const generationOne = nextGeneration(vertical);
    expect(generationOne).toHaveLength(3);
    expect(generationOne).toEqual(expect.arrayContaining(horizontal));

    const generationTwo = nextGeneration(generationOne);
    expect(generationTwo).toHaveLength(3);
    expect(generationTwo).toEqual(expect.arrayContaining(vertical));
  });
});
