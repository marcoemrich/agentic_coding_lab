import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell by underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent live cells with one neighbor each -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("preserves a live cell with exactly two live neighbors", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("preserves a live cell with exactly three live neighbors, as required by the survival example", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("kills a live cell with more than three live neighbors, as required by the overpopulation example", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces a dead cell with exactly three live neighbors, as required by the reproduction example", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("keeps the four-cell block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);

    expect(next).toHaveLength(block.length);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("oscillates the blinker through horizontal Gen 1 with negative x and back to vertical Gen 2", () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const horizontal = [[-1, 1], [0, 1], [1, 1]] as [number, number][];

    const generationOne = nextGeneration(vertical);
    expect(generationOne).toHaveLength(horizontal.length);
    expect(generationOne).toEqual(expect.arrayContaining(horizontal));

    const generationTwo = nextGeneration(generationOne);
    expect(generationTwo).toHaveLength(vertical.length);
    expect(generationTwo).toEqual(expect.arrayContaining(vertical));
  });
});
