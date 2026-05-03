import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function toSet(cells: Cell[]): Set<string> {
  return new Set(cells.map(([x, y]) => `${x},${y}`));
}

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(toSet(actual)).toEqual(toSet(expected));
}

describe("Game of Life - nextGeneration", () => {
  it("returns no cells when there are no living cells", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("a single isolated live cell dies (underpopulation)", () => {
    expectSameCells(nextGeneration([[0, 0]]), []);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expectSameCells(
      nextGeneration([
        [0, 0],
        [1, 0],
      ]),
      []
    );
  });

  it("a live cell with two live neighbors stays alive", () => {
    // Blinker - vertical line becomes horizontal
    const input: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    const expected: Cell[] = [
      [-1, 0],
      [0, 0],
      [1, 0],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it("blinker oscillates back to original after two generations", () => {
    const input: Cell[] = [
      [0, -1],
      [0, 0],
      [0, 1],
    ];
    expectSameCells(nextGeneration(nextGeneration(input)), input);
  });

  it("a live cell with more than three live neighbors dies (overpopulation)", () => {
    // Center cell at (0,0) with 4 live neighbors
    const input: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const result = nextGeneration(input);
    // (0,0) has 4 neighbors, dies
    expect(result.some(([x, y]) => x === 0 && y === 0)).toBe(false);
  });

  it("a dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    // Three cells in an L-shape, the dead corner should become alive
    const input: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(input);
    // (1,1) is dead but has 3 live neighbors
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });

  it("block (still life) remains unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expectSameCells(nextGeneration(block), block);
  });

  it("works with negative coordinates", () => {
    // Blinker at negative coordinates
    const input: Cell[] = [
      [-5, -10],
      [-5, -11],
      [-5, -9],
    ];
    const expected: Cell[] = [
      [-6, -10],
      [-5, -10],
      [-4, -10],
    ];
    expectSameCells(nextGeneration(input), expected);
  });

  it("glider moves correctly after one generation", () => {
    const glider: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const expected: Cell[] = [
      [0, 1],
      [2, 1],
      [1, 2],
      [2, 2],
      [1, 3],
    ];
    expectSameCells(nextGeneration(glider), expected);
  });

  it("handles duplicate cells in input gracefully", () => {
    const input: Cell[] = [
      [0, 0],
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    // Without dedup: (0,0) might be considered to have neighbors counted twice.
    // With proper sparse representation, duplicates collapse to single cell.
    const result = nextGeneration(input);
    // (1,1) should become alive - has 3 unique neighbors
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(true);
  });
});
