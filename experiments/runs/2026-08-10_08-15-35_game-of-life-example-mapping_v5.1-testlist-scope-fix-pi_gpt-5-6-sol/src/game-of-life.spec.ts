import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - next generation", () => {
  it("a single live cell dies -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two neighboring live cells die from underpopulation -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with two neighbors survives -- the three-cell line becomes a vertical line", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("the survival example's live center cell with three neighbors lives on -- output contains [1,1]", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbors is reproduced -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("an overpopulated center dies -- the supplied seven-cell pattern becomes two vertical columns", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).toEqual([
      [0, 0], [2, 0], [0, 1], [2, 1], [0, 2], [2, 2],
    ]);
  });
  it("a block is a still life -- its four coordinates are unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });
  it("a blinker oscillates for two generations and supports negative coordinates -- vertical, horizontal, vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);
    expect(generationOne).toEqual(horizontal);
    expect(nextGeneration(generationOne)).toEqual(vertical);
  });
});
