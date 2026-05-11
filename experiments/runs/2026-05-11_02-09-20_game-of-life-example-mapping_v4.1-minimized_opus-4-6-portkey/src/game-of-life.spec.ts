import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return an empty grid when given an empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill a live cell with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep a live cell alive with exactly two neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive with exactly three neighbors (survival)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should kill a live cell with four neighbors (overpopulation)", () => {
    const cross: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(cross);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const centerAlive = sorted.some(([x, y]) => x === 1 && y === 1);
    expect(centerAlive).toBe(false);
  });
  it("should create a live cell from a dead cell with exactly three live neighbors (reproduction)", () => {
    // Gen 0: cells (0,0), (0,1), (1,1) — dead cell (1,0) has 3 live neighbors
    const result = nextGeneration([[0, 0], [0, 1], [1, 1]]);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should not create a live cell from a dead cell with only two live neighbors", () => {
    // Two adjacent cells: (0,0) and (1,0). Dead cell (0,1) has 2 live neighbors.
    // Both live cells die from underpopulation (only 1 neighbor each).
    // No dead cell has exactly 3 neighbors, so no births occur.
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should handle a block still life (2x2 square remains unchanged)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should handle a blinker oscillator (three in a row toggles orientation)", () => {
    // Gen 0: horizontal blinker
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0]];

    // Gen 1: should become vertical
    const gen1 = nextGeneration(gen0);
    const sortedGen1 = gen1.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortedGen1).toEqual([[1, -1], [1, 0], [1, 1]]);

    // Gen 2: should return to horizontal
    const gen2 = nextGeneration(gen1);
    const sortedGen2 = gen2.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortedGen2).toEqual([[0, 0], [1, 0], [2, 0]]);
  });
  it("should support negative coordinates", () => {
    const block: [number, number][] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    const result = nextGeneration(block);
    const sorted = result.map(([x, y]) => [x, y]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
