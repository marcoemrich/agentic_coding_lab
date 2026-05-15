import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function sameCells(a: Cell[], b: Cell[]): boolean {
  const na = normalize(a);
  const nb = normalize(b);
  if (na.length !== nb.length) return false;
  for (let i = 0; i < na.length; i++) if (na[i] !== nb[i]) return false;
  return true;
}

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills two adjacent live cells (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("block (still life) remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sameCells(result, block)).toBe(true);
  });

  it("blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];

    const step1 = nextGeneration(horizontal);
    expect(sameCells(step1, vertical)).toBe(true);

    const step2 = nextGeneration(step1);
    expect(sameCells(step2, horizontal)).toBe(true);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-1, -5], [0, -5], [1, -5]];
    const expected: Cell[] = [[0, -6], [0, -5], [0, -4]];
    expect(sameCells(nextGeneration(blinker), expected)).toBe(true);
  });

  it("dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // Three cells in an L shape
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    // (1,1) has 3 neighbors and should come alive
    expect(normalize(result)).toContain("1,1");
  });

  it("live cell with more than 3 neighbors dies (overpopulation)", () => {
    // Cross pattern: center has 4 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    // (0,0) had 4 neighbors, should die
    expect(normalize(result)).not.toContain("0,0");
  });

  it("does not duplicate cells in output", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(blinker);
    const keys = normalize(result);
    const unique = new Set(keys);
    expect(unique.size).toBe(keys.length);
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expect(sameCells(nextGeneration(glider), expected)).toBe(true);
  });
});
