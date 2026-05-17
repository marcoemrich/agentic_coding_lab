import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("should return empty array when given empty input (no live cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a 2x2 block stable (each cell has 3 neighbors, survives)", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(block.map(c => `${c[0]},${c[1]}`))
    );
  });
  it("should oscillate a vertical blinker into a horizontal blinker", () => {
    const vertical: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    const expectedSet = new Set(["-1,1", "0,1", "1,1"]);
    expect(resultSet).toEqual(expectedSet);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Gen 0: (0,0), (1,0), (0,1) -> dead cell (1,1) has 3 live neighbors and becomes alive
    const input: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should handle negative coordinates correctly", () => {
    // Blinker centered at negative coordinates: vertical at x=-5
    const vertical: Array<[number, number]> = [[-5, -1], [-5, 0], [-5, 1]];
    const result = nextGeneration(vertical);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet).toEqual(new Set(["-6,0", "-5,0", "-4,0"]));
  });
});
