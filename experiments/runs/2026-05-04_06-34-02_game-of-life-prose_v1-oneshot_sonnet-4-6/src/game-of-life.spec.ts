import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

function expectCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("Game of Life", () => {
  it("empty grid stays empty", () => {
    expectCells(nextGeneration([]), []);
  });

  it("single cell dies (underpopulation)", () => {
    expectCells(nextGeneration([[0, 0]]), []);
  });

  it("two cells die (underpopulation)", () => {
    expectCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it("block (2x2) is a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });

  it("blinker oscillates (horizontal to vertical)", () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    expectCells(nextGeneration(horizontal), vertical);
  });

  it("blinker oscillates (vertical to horizontal)", () => {
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectCells(nextGeneration(vertical), horizontal);
  });

  it("dead cell with exactly 3 neighbors becomes alive", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(cells);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(keys).toContain("1,-1");
    expect(keys).toContain("1,1");
  });

  it("live cell with more than 3 neighbors dies (overpopulation)", () => {
    // Center cell has 4 live neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(keys).not.toContain("0,0");
  });

  it("handles negative coordinates", () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    expectCells(nextGeneration(block), block);
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const next: Cell[] = [[0, 1], [2, 1], [1, 2], [2, 2], [1, 3]];
    expectCells(nextGeneration(glider), next);
  });
});
