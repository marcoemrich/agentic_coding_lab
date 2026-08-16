import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell at (0,0), producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell at (1,1) with exactly three neighbors, producing [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("preserves a live center cell with exactly three live neighbors", () => {
    const result = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("kills an overpopulated center cell with more than three neighbors", () => {
    const result = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("keeps the four-cell block unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
  });
  it("evolves a vertical blinker at negative and positive coordinates into a horizontal blinker and back", () => {
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
