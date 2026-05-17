import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells each with only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a block (2x2) alive unchanged (survival, still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(block.map(c => c.join(",")))
    );
  });
  it("transforms a vertical blinker into a horizontal blinker (survival + reproduction)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(vertical);
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(expected.map(c => c.join(",")))
    );
  });
  it("kills the center of a fully surrounded 3x3 block (overpopulation)", () => {
    const full3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(full3x3);
    const keys = new Set(result.map(c => c.join(",")));
    expect(keys.has("1,1")).toBe(false);
  });
  it("births a dead cell that has exactly 3 live neighbors (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). Dead cell (1,1) has 3 live neighbors.
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(lShape);
    const keys = new Set(result.map(c => c.join(",")));
    expect(keys.has("1,1")).toBe(true);
  });
  it("handles negative coordinates correctly", () => {
    // Vertical blinker entirely in negative space: (-5,-5),(-5,-4),(-5,-3)
    // → horizontal: (-6,-4),(-5,-4),(-4,-4)
    const vertical: [number, number][] = [[-5, -5], [-5, -4], [-5, -3]];
    const result = nextGeneration(vertical);
    const expected: [number, number][] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(result).toHaveLength(3);
    expect(new Set(result.map(c => c.join(",")))).toEqual(
      new Set(expected.map(c => c.join(",")))
    );
  });
});
