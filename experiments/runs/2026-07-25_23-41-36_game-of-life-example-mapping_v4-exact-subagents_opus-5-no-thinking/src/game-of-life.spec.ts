import { describe, it, expect } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return an empty result for an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should let a single live cell die from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should let two adjacent live cells die from underpopulation", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("should let a live cell with 2 live neighbors survive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([0, 0]);
  });
  it("should let a live cell with 3 live neighbors survive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ]),
    ).toContainEqual([0, 0]);
  });
  it("should let a live cell with 4 live neighbors die from overpopulation", () => {
    expect(
      nextGeneration([
        [1, 1],
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell with exactly 3 live neighbors to life", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [0, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
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
  it("should turn a horizontal blinker back into a vertical blinker", () => {
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
  it("should apply the rules to cells at negative coordinates", () => {
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
