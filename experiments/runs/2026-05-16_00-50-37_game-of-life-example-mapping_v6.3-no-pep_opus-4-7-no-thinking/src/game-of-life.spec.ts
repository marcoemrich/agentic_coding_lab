import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells (each has only 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a block (2x2) unchanged as a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(block.map((c) => c.join(","))),
    );
  });
  it("oscillates a vertical blinker into a horizontal blinker", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
  it("creates a new cell when a dead cell has exactly 3 live neighbors (reproduction)", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    expect(new Set(result.map((c) => c.join(",")))).toContain("1,1");
  });
  it("kills a cell with more than 3 live neighbors (overpopulation)", () => {
    const full3x3: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(full3x3);
    expect(new Set(result.map((c) => c.join(",")))).not.toContain("1,1");
  });
  it("handles negative coordinates correctly", () => {
    const verticalAtNegative: Cell[] = [[-5, -3], [-5, -2], [-5, -1]];
    const expected: Cell[] = [[-6, -2], [-5, -2], [-4, -2]];
    const result = nextGeneration(verticalAtNegative);
    expect(result).toHaveLength(3);
    expect(new Set(result.map((c) => c.join(",")))).toEqual(
      new Set(expected.map((c) => c.join(","))),
    );
  });
});
