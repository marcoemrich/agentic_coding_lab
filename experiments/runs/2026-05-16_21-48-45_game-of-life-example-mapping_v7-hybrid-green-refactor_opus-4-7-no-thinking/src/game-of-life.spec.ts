import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns an empty array when given no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single living cell with no neighbors (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells each having only one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps a block (2x2) stable across generations (survival with still life)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("transforms a vertical blinker into a horizontal blinker (survival + reproduction)", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.map((c) => c.join(",")).sort()).toEqual(
      horizontal.map((c) => c.join(",")).sort()
    );
  });
  it("kills the center cell of a fully surrounded 3x3 block (overpopulation)", () => {
    const fullBlock3x3: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(fullBlock3x3);
    const containsCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(containsCenter).toBe(false);
  });
  it("brings a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result.map((c) => c.join(",")).sort()).toEqual(
      expected.map((c) => c.join(",")).sort()
    );
  });
  it("handles negative coordinates correctly", () => {
    const negativeBlock: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(negativeBlock);
    expect(result.map((c) => c.join(",")).sort()).toEqual(
      negativeBlock.map((c) => c.join(",")).sort()
    );
  });
});
