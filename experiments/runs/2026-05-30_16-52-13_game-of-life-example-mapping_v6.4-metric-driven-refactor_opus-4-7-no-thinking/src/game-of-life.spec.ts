import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty input produces empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies (underpopulation, 0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (Rule 1, each has 1 neighbor)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with 4 neighbors dies (Rule 3 - overpopulation)", () => {
    const cells: Cell[] = [[1, 1], [0, 0], [2, 0], [0, 2], [2, 2]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (Rule 4 - reproduction)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("live cell with 2 live neighbors survives (Rule 2)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 0)).toBe(true);
  });
  it("live cell with 3 live neighbors survives (Rule 2)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const result = nextGeneration(cells);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
  it("blinker oscillates from vertical to horizontal — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const sortKey = (c: Cell) => `${c[0]},${c[1]}`;
    const byKey = (a: Cell, b: Cell) => sortKey(a).localeCompare(sortKey(b));
    expect(nextGeneration(cells).sort(byKey)).toEqual(expected.sort(byKey));
  });
  it("block is a still life — [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sortKey = (c: Cell) => `${c[0]},${c[1]}`;
    expect([...result].sort((a, b) => sortKey(a).localeCompare(sortKey(b))))
      .toEqual([...block].sort((a, b) => sortKey(a).localeCompare(sortKey(b))));
  });
  it("handles negative coordinates", () => {
    const cells: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const expected: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    const sortKey = (c: Cell) => `${c[0]},${c[1]}`;
    const byKey = (a: Cell, b: Cell) => sortKey(a).localeCompare(sortKey(b));
    expect(nextGeneration(cells).sort(byKey)).toEqual(expected.sort(byKey));
  });
});
