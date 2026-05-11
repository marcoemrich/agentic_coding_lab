import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when given empty grid", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    const result = nextGeneration([[0, 0]]);
    expect(result).toEqual([]);
  });
  it("should kill cells with only one neighbor (underpopulation)", () => {
    const result = nextGeneration([[0, 1], [1, 1]]);
    expect(result).toEqual([]);
  });
  it("should bring a dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should keep a live cell alive when it has 2 or 3 neighbors (survival)", () => {
    const result = nextGeneration([[0, 1], [1, 1], [2, 1]]);
    expect(result).toEqual([[1, 0], [1, 1], [1, 2]]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Plus/cross pattern: center cell (1,1) has 4 live neighbors -> dies
    const input: [number, number][] = [[0, 1], [1, 0], [1, 1], [1, 2], [2, 1]];
    const result = nextGeneration(input);
    // Center (1,1) has 4 neighbors -> dies (overpopulation)
    // Each arm cell has 1-2 neighbors from the pattern, plus dead cells may come alive
    // Let's verify (1,1) is NOT in the result
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should keep a block pattern unchanged (still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker pattern (oscillator)", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toEqual([[-1, 1], [0, 1], [1, 1]]);
    const gen2 = nextGeneration(gen1);
    expect(gen2).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
});
