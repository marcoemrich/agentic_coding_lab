import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single live cell die from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two live cells die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block still life unchanged (survival with 2 or 3 neighbors)", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should let a live cell with more than 3 neighbors die from overpopulation", () => {
    const plus = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(plus);
    expect(result).toEqual(expect.not.arrayContaining([[1, 1]]));
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    const lTromino = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lTromino);
    expect(result).toEqual(
      expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("should evolve a blinker from vertical to horizontal", () => {
    const verticalBlinker = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    const expected = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
