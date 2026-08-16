import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation -- no living cells remain", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("lets a live cell with 2 neighbors survive -- the center remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("lets a live cell with 3 neighbors survive -- (1,1) remains alive", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).toContainEqual([1, 1]);
  });
  it("applies all rules together -- the surrounded center dies while valid survivors and births live", () => {
    const outer: [number, number][] = [[0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2]];
    const births: [number, number][] = [[1, -1], [1, 3]];
    const next = nextGeneration([...outer, [1, 1]]);
    expect(next).toHaveLength(8);
    expect(next).toEqual(expect.arrayContaining([...outer, ...births]));
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly 3 neighbors -- an L shape becomes a 2x2 block", () => {
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
  it("preserves a block still life -- the 2x2 block is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("oscillates a blinker over two generations, including negative coordinates", () => {
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
