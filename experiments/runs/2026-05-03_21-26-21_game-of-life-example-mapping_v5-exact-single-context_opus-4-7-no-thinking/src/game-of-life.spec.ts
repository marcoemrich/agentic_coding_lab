import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells each with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep block (2x2) unchanged (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should oscillate blinker from vertical to horizontal", () => {
    const verticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expectedHorizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(verticalBlinker);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expectedHorizontal));
  });
  it("should kill live cell with more than 3 neighbors (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,1)
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring dead cell to life with exactly 3 neighbors (reproduction)", () => {
    // Dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1)
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });
  it("should handle negative coordinates", () => {
    // Vertical blinker at negative coords: (-5,-1),(-5,0),(-5,1) → horizontal at y=0
    const cells: Cell[] = [[-5, -1], [-5, 0], [-5, 1]];
    const expected: Cell[] = [[-6, 0], [-5, 0], [-4, 0]];
    const result = nextGeneration(cells);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
