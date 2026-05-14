import { describe, it, expect } from "vitest";
import {
  nextGeneration,
  nextGenerationCells,
  cellsToSet,
  type Cell,
} from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("nextGeneration", () => {
  it("an empty grid stays empty", () => {
    expect(nextGeneration(new Set()).size).toBe(0);
  });

  it("a single living cell dies from underpopulation", () => {
    const living = cellsToSet([[0, 0]]);
    expect(nextGeneration(living).size).toBe(0);
  });

  it("two adjacent cells both die from underpopulation", () => {
    const living = cellsToSet([
      [0, 0],
      [0, 1],
    ]);
    expect(nextGeneration(living).size).toBe(0);
  });

  it("a block (2x2) is a still life", () => {
    const block: Cell[] = [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ];
    const next = nextGenerationCells(block);
    expect(sortCells(next)).toEqual(sortCells(block));
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
    const next1 = nextGenerationCells(horizontal);
    expect(sortCells(next1)).toEqual(sortCells(vertical));

    const next2 = nextGenerationCells(next1);
    expect(sortCells(next2)).toEqual(sortCells(horizontal));
  });

  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // L shape: produces a new cell at (1,1)
    const living: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const next = nextGenerationCells(living);
    expect(sortCells(next)).toEqual(
      sortCells([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
  });

  it("a live cell with 4+ neighbors dies (overpopulation)", () => {
    // Center cell at (0,0) surrounded by 4 neighbors
    const living: Cell[] = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const nextSet = nextGeneration(cellsToSet(living));
    expect(nextSet.has("0,0")).toBe(false);
  });

  it("handles negative coordinates", () => {
    const blinker: Cell[] = [
      [-1000, -1000],
      [-999, -1000],
      [-998, -1000],
    ];
    const expected: Cell[] = [
      [-999, -1001],
      [-999, -1000],
      [-999, -999],
    ];
    const next = nextGenerationCells(blinker);
    expect(sortCells(next)).toEqual(sortCells(expected));
  });

  it("does not allocate cells far away (sparse)", () => {
    const blinker: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
    ];
    const next = nextGeneration(cellsToSet(blinker));
    expect(next.size).toBe(3);
  });

  it("glider moves correctly after one generation", () => {
    // Classic glider
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
    const next = nextGenerationCells(glider);
    expect(sortCells(next)).toEqual(sortCells(expected));
  });

  it("glider returns to original shape (translated) after 4 generations", () => {
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGenerationCells(cells);
    }
    // After 4 generations a glider translates by (1, 1)
    const expected: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3],
      [2, 3],
      [3, 3],
    ];
    expect(sortCells(cells)).toEqual(sortCells(expected));
  });

  it("does not mutate the input set", () => {
    const input = cellsToSet([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
    const snapshot = new Set(input);
    nextGeneration(input);
    expect(input).toEqual(snapshot);
  });
});
