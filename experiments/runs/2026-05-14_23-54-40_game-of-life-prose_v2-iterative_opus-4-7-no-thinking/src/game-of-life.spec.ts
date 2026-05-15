import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(sortCells(actual)).toEqual(sortCells(expected));
}

describe("nextGeneration", () => {
  it("empty grid stays empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("block (still life) remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("blinker (period-2 oscillator) horizontal -> vertical", () => {
    const horizontal: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const vertical: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameCells(nextGeneration(horizontal), vertical);
    expectSameCells(nextGeneration(vertical), horizontal);
  });

  it("dead cell with exactly 3 live neighbors becomes alive", () => {
    // Three cells in an L; the dead cell at (1,1) has 3 live neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).toContainEqual([1, 1]);
  });

  it("live cell with 4 neighbors dies (overpopulation)", () => {
    // Center cell surrounded by 4 neighbors in a plus
    const cells: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([0, 0]);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [[-10, -10], [-9, -10], [-8, -10]];
    const expected: Cell[] = [[-9, -11], [-9, -10], [-9, -9]];
    expectSameCells(nextGeneration(blinker), expected);
  });

  it("glider moves diagonally after 4 generations", () => {
    let glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      glider = nextGeneration(glider);
    }
    // After 4 generations, the glider has shifted by (1, 1)
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expectSameCells(glider, expected);
  });

  it("does not include dead cells in output", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    // blinker -> vertical line; (0,0) and (2,0) should be dead
    expect(result).not.toContainEqual([0, 0]);
    expect(result).not.toContainEqual([2, 0]);
  });

  it("returns no duplicates", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const keys = result.map(([x, y]) => `${x},${y}`);
    expect(new Set(keys).size).toBe(result.length);
  });
});
