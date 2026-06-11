import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two live cells that each have only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [0, 1]])).toEqual([]);
  });
  it("should keep a live cell alive when it has 2 or 3 live neighbors (survival)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toContainEqual([0, 1]);
  });
  it("should kill a live cell when it has more than 3 live neighbors (overpopulation)", () => {
    expect(
      nextGeneration([[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]])
    ).not.toContainEqual([0, 0]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    expect(nextGeneration([[0, 0], [0, 1], [1, 0]])).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    for (const cell of block) {
      expect(result).toContainEqual(cell);
    }
  });
  it("should oscillate a blinker, including negative coordinates", () => {
    const horizontalBlinker: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const expectedVerticalBlinker: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const result = nextGeneration(horizontalBlinker);
    expect(result).toHaveLength(3);
    for (const cell of expectedVerticalBlinker) {
      expect(result).toContainEqual(cell);
    }
  });
});
