import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("a single live cell dies -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation kills cells with one neighbor -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with two neighbors survives -- the middle of three adjacent live cells remains alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("a live cell with three neighbors survives -- center (1,1) remains alive", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("overpopulation kills a live cell with four neighbors -- center (1,1) is absent from the next generation", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("reproduction creates a dead cell with exactly three neighbors -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 1], [1, 0], [0, 0]])).toContainEqual([1, 1]);
  });
  it("a block is a still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it("a blinker oscillates over two generations -- vertical becomes horizontal with negative coordinates, then vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);
    expect(generationOne).toEqual(expect.arrayContaining(horizontal));
    expect(generationOne).toHaveLength(3);
    const generationTwo = nextGeneration(generationOne);
    expect(generationTwo).toEqual(expect.arrayContaining(vertical));
    expect(generationTwo).toHaveLength(3);
  });
});
