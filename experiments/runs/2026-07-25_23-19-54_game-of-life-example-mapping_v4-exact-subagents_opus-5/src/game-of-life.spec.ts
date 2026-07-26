import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return no living cells for a single living cell", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let both cells die when each has only one live neighbor", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should keep a live cell with three live neighbors alive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a live cell with two live neighbors alive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]),
    ).toContainEqual([0, 1]);
  });
  it("should let a live cell with four live neighbors die", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [1, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly three live neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [0, 1],
        [1, 0],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a block unchanged", () => {
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
  it("should turn a vertical blinker into a horizontal blinker", () => {
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
  it("should return the blinker to its original state after two generations", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(nextGeneration(verticalBlinker));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(verticalBlinker));
  });
  it("should compute the next generation for cells at negative coordinates", () => {
    const verticalBlinker: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const horizontalBlinker: Cell[] = [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(horizontalBlinker));
  });
});
