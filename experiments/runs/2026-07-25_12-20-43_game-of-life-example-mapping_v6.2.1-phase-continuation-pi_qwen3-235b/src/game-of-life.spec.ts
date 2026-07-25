import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("should return empty array when given empty input -- next generation of no cells is no cells");

  it("should return empty array when given a single cell -- single cell dies due to underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it.todo("should return empty array when given a single cell -- single cell dies due to underpopulation");

  it("should apply underpopulation rule: live cell with 1 neighbor dies -- input [(0,1), (1,1)] returns []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it.todo("should apply underpopulation rule: live cell with 1 neighbor dies -- input [(0,1), (1,1)] returns []");

  it("should apply survival rule: live cell with 2 or 3 neighbors survives -- center cell (1,1) with 3 neighbors survives", () => {
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it.todo("should apply survival rule: live cell with 2 or 3 neighbors survives -- center cell (1,1) with 3 neighbors survives");

  it("should apply overpopulation rule: live cell with 4 or more neighbors dies -- center cell (1,1) with 4 neighbors dies", () => {
    expect(nextGeneration([
      [1, 1], [0, 1], [2, 1],
      [1, 0], [1, 2]
    ])).not.toContainEqual([1, 1]);
  });
  it.todo("should apply overpopulation rule: live cell with 4 or more neighbors dies -- center cell (1,1) with 4 neighbors dies");

  it("should apply reproduction rule: dead cell with exactly 3 neighbors becomes alive -- dead cell (1,1) with neighbors (0,1),(1,0),(2,1) becomes alive", () => {
    expect(nextGeneration([
      [0, 1], [1, 0], [2, 1]
    ])).toContainEqual([1, 1]);
  });
  it.todo("should apply reproduction rule: dead cell with exactly 3 neighbors becomes alive -- dead cell (1,1) with neighbors (0,1),(1,0),(2,1) becomes alive");

  it("should evolve blinker pattern correctly: vertical bar becomes horizontal bar -- input [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]", () => {
    expect(nextGeneration([
      [0, 0], [0, 1], [0, 2]
    ])).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it.todo("should evolve blinker pattern correctly: vertical bar becomes horizontal bar -- input [(0,0), (0,1), (0,2)] becomes [(-1,1), (0,1), (1,1)]");

  it("should preserve block pattern: 2x2 square remains unchanged -- input [(0,0), (1,0), (0,1), (1,1)] returns same", () => {
    const input = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual(input);
  });
  it.todo("should preserve block pattern: 2x2 square remains unchanged -- input [(0,0), (1,0), (0,1), (1,1)] returns same");
});