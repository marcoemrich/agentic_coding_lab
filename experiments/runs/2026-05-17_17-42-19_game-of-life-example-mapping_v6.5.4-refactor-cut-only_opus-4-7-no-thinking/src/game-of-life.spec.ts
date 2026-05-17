import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent cells with only one neighbor each (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should keep a 2x2 block stable (survival)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
    expect(result.length).toBe(4);
  });
  it("should rotate a horizontal blinker to vertical (survival + reproduction)", () => {
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(horizontal);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["0,0", "0,1", "0,2"])
    );
  });
  it("should bring a dead cell with exactly 3 neighbors to life (reproduction)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["0,0", "1,0", "0,1", "1,1"])
    );
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    // Plus shape: center cell has 4 live neighbors
    const plus: [number, number][] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(plus);
    expect(result.map(c => c.join(","))).not.toContain("1,1");
  });
  it("should handle negative coordinates", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(["-1,1", "0,1", "1,1"])
    );
  });
});
