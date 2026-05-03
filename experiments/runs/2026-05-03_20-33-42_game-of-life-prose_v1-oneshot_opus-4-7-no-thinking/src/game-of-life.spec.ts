import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].map(([x, y]) => [x, y] as Cell).sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const sameCells = (a: Cell[], b: Cell[]): boolean => {
  const sa = sortCells(a);
  const sb = sortCells(b);
  if (sa.length !== sb.length) return false;
  return sa.every(([x, y], i) => x === sb[i][0] && y === sb[i][1]);
};

describe("Game of Life - nextGeneration", () => {
  it("returns no living cells when given an empty set", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single living cell dies of underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent living cells both die of underpopulation", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
    ]);
    expect(result).toEqual([]);
  });

  it("a block (2x2) is stable", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sameCells(nextGeneration(block), block)).toBe(true);
  });

  it("a blinker oscillates between horizontal and vertical", () => {
    const horizontal: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const vertical: Cell[] = [
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    expect(sameCells(nextGeneration(horizontal), vertical)).toBe(true);
    expect(sameCells(nextGeneration(vertical), horizontal)).toBe(true);
  });

  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape: three cells around (1,1)
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    // (1,1) should now be alive thanks to 3 neighbors
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it("a living cell with more than three neighbors dies (overpopulation)", () => {
    // Center cell at (1,1) with 4 neighbors
    const cells: Cell[] = [
      [1, 1],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });

  it("handles negative coordinates correctly", () => {
    // Blinker centered at negative coordinates
    const horizontal: Cell[] = [
      [-10, -10],
      [-9, -10],
      [-8, -10],
    ];
    const vertical: Cell[] = [
      [-9, -11],
      [-9, -10],
      [-9, -9],
    ];
    expect(sameCells(nextGeneration(horizontal), vertical)).toBe(true);
  });

  it("a glider moves diagonally", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    // After 4 generations, a glider moves by (1, 1)
    let current = glider;
    for (let i = 0; i < 4; i++) {
      current = nextGeneration(current);
    }
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    expect(sameCells(current, expected)).toBe(true);
  });

  it("does not duplicate cells in the output", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const result = nextGeneration(block);
    const keys = new Set(result.map(([x, y]) => `${x},${y}`));
    expect(keys.size).toBe(result.length);
  });
});
