import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const equalCellSets = (a: Cell[], b: Cell[]): boolean => {
  const sa = sortCells(a);
  const sb = sortCells(b);
  if (sa.length !== sb.length) return false;
  return sa.every((c, i) => c[0] === sb[i][0] && c[1] === sb[i][1]);
};

describe("nextGeneration", () => {
  it("empty input yields empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a lone live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
    ]);
    expect(result).toEqual([]);
  });

  it("block (still life) remains unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(equalCellSets(nextGeneration(block), block)).toBe(true);
  });

  it("blinker oscillates between horizontal and vertical", () => {
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
    expect(equalCellSets(nextGeneration(horizontal), vertical)).toBe(true);
    expect(equalCellSets(nextGeneration(vertical), horizontal)).toBe(true);
  });

  it("dead cell with exactly three live neighbors becomes alive", () => {
    // Three cells in an L-shape produce a 2x2 block.
    const lShape: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const next = nextGeneration(lShape);
    expect(equalCellSets(next, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ])).toBe(true);
  });

  it("live cell with more than three neighbors dies (overpopulation)", () => {
    // Center cell surrounded by 4 neighbors at the cardinal positions.
    const cells: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const next = nextGeneration(cells);
    const nextSet = new Set(next.map(([x, y]) => `${x},${y}`));
    expect(nextSet.has("0,0")).toBe(false);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [
      [-5, -3],
      [-4, -3],
      [-3, -3],
    ];
    const expected: Cell[] = [
      [-4, -4],
      [-4, -3],
      [-4, -2],
    ];
    expect(equalCellSets(nextGeneration(blinker), expected)).toBe(true);
  });

  it("glider moves diagonally after 4 generations", () => {
    let glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      glider = nextGeneration(glider);
    }
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    expect(equalCellSets(glider, expected)).toBe(true);
  });

  it("does not include cells with zero live neighbors in output", () => {
    // Two far-apart cells, each dies alone.
    const cells: Cell[] = [
      [0, 0],
      [100, 100],
    ];
    expect(nextGeneration(cells)).toEqual([]);
  });
});
