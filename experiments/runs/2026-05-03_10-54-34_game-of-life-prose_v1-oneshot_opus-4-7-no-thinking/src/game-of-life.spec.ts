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

describe("Conway's Game of Life - nextGeneration", () => {
  it("an empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single live cell dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die from underpopulation", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("a live cell with two live neighbors survives", () => {
    // Blinker (vertical) at center: (0,-1), (0,0), (0,1)
    const next = nextGeneration([[0, -1], [0, 0], [0, 1]]);
    // becomes horizontal blinker: (-1,0), (0,0), (1,0)
    expect(sameCells(next, [[-1, 0], [0, 0], [1, 0]])).toBe(true);
  });

  it("a dead cell with exactly three live neighbors becomes alive", () => {
    // L-shape: (0,0), (1,0), (0,1) -> all three live, plus (1,1) becomes alive
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sameCells(next, [[0, 0], [1, 0], [0, 1], [1, 1]])).toBe(true);
  });

  it("a live cell with more than three live neighbors dies from overpopulation", () => {
    // Center cell at (0,0) with 4 live neighbors
    const cells: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const next = nextGeneration(cells);
    // Center has 4 neighbors -> dies. The four arm cells each have 1 live neighbor (center) + check diagonals
    // Actually each arm: e.g., (-1, 0) neighbors among living: (0,0), (0,-1)? distance check: (0,-1) is at distance dx=1, dy=1 -> neighbor. (0,1) similarly. So (-1,0) has neighbors: (0,0), (0,-1), (0,1) = 3 -> survives
    // Same logic for all four arm cells -> survive
    // Dead cells like (-1, 1): neighbors (0,0), (-1,0), (0,1) = 3 -> becomes alive
    // Similarly (-1,-1), (1,1), (1,-1) become alive
    expect(sameCells(next, [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, 1], [-1, -1], [1, 1], [1, -1],
    ])).toBe(true);
  });

  it("a 2x2 block is stable (still life)", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(sameCells(next, block)).toBe(true);
  });

  it("a blinker oscillates with period 2", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical = nextGeneration(horizontal);
    expect(sameCells(vertical, [[0, -1], [0, 0], [0, 1]])).toBe(true);
    const back = nextGeneration(vertical);
    expect(sameCells(back, horizontal)).toBe(true);
  });

  it("handles negative coordinates correctly", () => {
    const blinker: Cell[] = [[-100, -50], [-100, -51], [-100, -49]];
    const next = nextGeneration(blinker);
    expect(sameCells(next, [[-101, -50], [-100, -50], [-99, -50]])).toBe(true);
  });

  it("a glider moves diagonally", () => {
    // Glider in standard orientation
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const gen1 = nextGeneration(glider);
    const expected1: Cell[] = [
      [0, 1], [2, 1],
      [1, 2], [2, 2],
      [1, 3],
    ];
    expect(sameCells(gen1, expected1)).toBe(true);
  });
});
