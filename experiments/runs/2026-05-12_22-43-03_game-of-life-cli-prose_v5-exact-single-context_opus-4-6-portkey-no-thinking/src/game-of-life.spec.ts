import { describe, it, expect } from "vitest";
import { nextGeneration, advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should keep a cell alive that has exactly two live neighbors", () => {
    // Horizontal blinker: [0,0], [1,0], [2,0]
    // Middle cell [1,0] has 2 neighbors and should survive
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toContainEqual([1, 0]);
  });
  it("should keep a cell alive that has exactly three live neighbors", () => {
    // 2x2 block: each cell has exactly 3 neighbors, block is a still life
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
    expect(result).toHaveLength(4);
  });
  it("should kill a cell that has four live neighbors (overpopulation)", () => {
    // Plus pattern: center [1,1] has 4 neighbors and should die
    const plus: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(plus);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life when it has exactly three live neighbors (reproduction)", () => {
    // L-shape: [0,0], [1,0], [0,1] — dead cell [1,1] has exactly 3 live neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should advance multiple steps", () => {
    // Blinker has period 2: after 2 steps it returns to original
    const blinker: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = advance(blinker, 2);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([2, 0]);
    expect(result).toHaveLength(3);
  });
  it("should return cells sorted lexicographically by x then y", () => {
    // L-shape produces a 2x2 block — verify exact sorted order
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
});
