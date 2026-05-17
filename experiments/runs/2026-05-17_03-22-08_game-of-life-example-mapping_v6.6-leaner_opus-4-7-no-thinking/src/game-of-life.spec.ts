import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return an empty array when input is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells (underpopulation, each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block of 4 cells unchanged (still life - each has 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(block.map(c => `${c[0]},${c[1]}`))
    );
    expect(result).toHaveLength(4);
  });
  it("should oscillate a blinker (vertical 3-cell line becomes horizontal)", () => {
    const verticalBlinker: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(expected.map(c => `${c[0]},${c[1]}`))
    );
    expect(result).toHaveLength(3);
  });
  it("should birth a dead cell with exactly 3 live neighbors and handle negative coordinates", () => {
    const lShape: [number, number][] = [[-1, -1], [0, -1], [-1, 0]];
    const result = nextGeneration(lShape);
    const expected: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(expected.map(c => `${c[0]},${c[1]}`))
    );
    expect(result).toHaveLength(4);
  });
});
