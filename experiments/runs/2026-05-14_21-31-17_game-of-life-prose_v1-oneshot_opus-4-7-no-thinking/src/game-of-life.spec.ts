import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => (a[0] - b[0]) || (a[1] - b[1]));

const expectSameCells = (actual: Cell[], expected: Cell[]) => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("nextGeneration", () => {
  it("returns empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a lone living cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("kills cells with only one live neighbor", () => {
    expectSameCells(nextGeneration([[0, 0], [1, 0]]), []);
  });

  it("keeps a living cell with two live neighbors alive", () => {
    // A vertical line of three -> becomes horizontal line of three (blinker)
    const blinkerVertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const blinkerHorizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    expectSameCells(nextGeneration(blinkerVertical), blinkerHorizontal);
  });

  it("blinker oscillates back after two generations", () => {
    const blinkerVertical: Cell[] = [[0, -1], [0, 0], [0, 1]];
    const oneStep = nextGeneration(blinkerVertical);
    const twoSteps = nextGeneration(oneStep);
    expectSameCells(twoSteps, blinkerVertical);
  });

  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // L-shape: (0,0), (1,0), (0,1). (1,1) has three neighbors -> alive
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    // Each living cell has 2 neighbors and lives, plus (1,1) reborn
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(result, expected);
  });

  it("block (still life) remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  it("kills living cell with more than three neighbors (overpopulation)", () => {
    // Center cell at (0,0) with four neighbors at NSEW
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const result = nextGeneration(input);
    // (0,0) has 4 neighbors -> dies
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });

  it("handles negative coordinates correctly", () => {
    const blinker: Cell[] = [[-5, -5], [-5, -6], [-5, -4]];
    const expected: Cell[] = [[-5, -5], [-4, -5], [-6, -5]];
    expectSameCells(nextGeneration(blinker), expected);
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
    expectSameCells(glider, expected);
  });

  it("handles duplicate input cells gracefully", () => {
    const input: Cell[] = [[0, 0], [0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(input);
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(result, expected);
  });
});
