import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function sortedKeys(cells: [number, number][]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("nextGeneration", () => {
  it("should return an empty grid when given an empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single living cell with zero neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill two adjacent living cells each having only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should keep a live cell alive that has exactly two neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(sortedKeys(result)).toEqual(sortedKeys([[1, -1], [1, 0], [1, 1]]));
  });
  it("should keep a live cell alive that has exactly three neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });
  it("should kill a live cell that has more than three neighbors (overpopulation)", () => {
    // Cross pattern: center cell (1,1) has 4 neighbors → dies
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should bring a dead cell to life when it has exactly three living neighbors (reproduction)", () => {
    // Dead cell (1,1) has exactly 3 living neighbors: (0,0), (1,0), (0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("should preserve a block pattern as a still life across one generation", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sortedKeys(result)).toEqual(sortedKeys([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should oscillate a blinker pattern to its alternate phase", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortedKeys(result)).toEqual(sortedKeys([[-1, 1], [0, 1], [1, 1]]));
  });
  it("should handle cells at negative coordinates", () => {
    const cells: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(cells);
    expect(sortedKeys(result)).toEqual(sortedKeys([[-1, -1], [0, -1], [-1, 0], [0, 0]]));
  });
});
