import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a block (2x2) stable (survival with 3 neighbors)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("should kill an overpopulated cell with more than 3 neighbors", () => {
    // 2x3 block - middle row cells have 5 neighbors each, must die from overpopulation
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]];
    const result = nextGeneration(input);
    // Middle row (y=1) should not include the original (0,1) or (1,1) - they died from overpopulation
    expect(result).not.toContainEqual([0, 1]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should birth a dead cell with exactly 3 live neighbors (reproduction)", () => {
    // L-shape: 3 cells with (1,1) dead surrounded by 3 alive neighbors -> birth
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should oscillate a vertical blinker to horizontal", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const sortByCoord = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect([...nextGeneration(vertical)].sort(sortByCoord)).toEqual(
      [...expected].sort(sortByCoord),
    );
  });
  it("should handle negative coordinates correctly", () => {
    // Vertical blinker at negative coords -> horizontal blinker
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    const sortByCoord = (a: [number, number], b: [number, number]) =>
      a[0] - b[0] || a[1] - b[1];
    expect([...nextGeneration(vertical)].sort(sortByCoord)).toEqual(
      [...expected].sort(sortByCoord),
    );
  });
});
