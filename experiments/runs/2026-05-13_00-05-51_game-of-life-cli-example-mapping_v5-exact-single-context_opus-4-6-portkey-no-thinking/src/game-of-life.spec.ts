import { describe, it, expect } from "vitest";
import { advance } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return alive cells unchanged when steps is 0", () => {
    expect(advance([[5, 5]], 0)).toEqual([[5, 5]]);
  });
  it("should return empty array when no cells are alive", () => {
    expect(advance([], 1)).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(advance([[0, 0]], 1)).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    // Three cells in an L-shape: dead cell at (1,1) has exactly 3 live neighbors
    expect(advance([[0, 0], [0, 1], [1, 0]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a cell alive when it has 2 or 3 neighbors (survival)", () => {
    // Tub still life: each cell has exactly 2 neighbors
    const tub: [number, number][] = [[0, 1], [1, 0], [1, 2], [2, 1]];
    expect(advance(tub, 1)).toEqual([[0, 1], [1, 0], [1, 2], [2, 1]]);
  });
  it("should kill a cell with more than 3 neighbors (overpopulation)", () => {
    // Plus shape: center (1,1) has 4 neighbors → dies
    const plus: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = advance(plus, 1);
    // Center cell (1,1) should not be in the result
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("should advance multiple steps", () => {
    // Blinker oscillator: period 2. After 2 steps returns to original.
    const blinker: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    expect(advance(blinker, 2)).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should return alive cells sorted lexicographically by x then y", () => {
    // Horizontal blinker at y=-1,0,1 → vertical after 1 step
    // Tests that output with negative coords is properly sorted
    const blinker: [number, number][] = [[0, -1], [0, 0], [0, 1]];
    expect(advance(blinker, 1)).toEqual([[-1, 0], [0, 0], [1, 0]]);
  });
});
