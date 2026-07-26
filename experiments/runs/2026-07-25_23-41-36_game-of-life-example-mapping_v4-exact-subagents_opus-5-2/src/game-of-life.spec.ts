import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should let a single live cell die from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should let two adjacent live cells die from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should let a live cell with two live neighbors survive", () => {
    expect(nextGeneration([[1, 0], [1, 1], [1, 2]])).toContainEqual([1, 1]);
  });

  it("should let a live cell with three live neighbors survive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 0]);
  });

  it("should let a live cell with more than three live neighbors die from overpopulation", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [0, 1],
        [1, 0],
        [2, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });

  it("should bring a dead cell with exactly three live neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a block unchanged as a still life", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontalBlinker));
  });
  it("should oscillate a horizontal blinker back into a vertical blinker", () => {
    const horizontalBlinker: Cell[] = [
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(horizontalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(verticalBlinker));
  });
  it("should handle cells at negative coordinates", () => {
    const verticalBlinker: Cell[] = [
      [-10, -10],
      [-10, -9],
      [-10, -8],
    ];
    const horizontalBlinker: Cell[] = [
      [-11, -9],
      [-10, -9],
      [-9, -9],
    ];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontalBlinker));
  });
});
