import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The order cells come back in is an implementation detail, not part of the
// spec — compare as sets by sorting both sides.
const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("Game of Life - next generation", () => {
  it("keeps an empty grid empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("lets a single cell die of underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("lets two neighboring cells die of underpopulation (rule 1) — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });

  it("keeps a live cell with 2 neighbors alive (rule 2, survival) — the middle of [(0,0), (1,0), (2,0)] survives", () => {
    const survivors = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
    ]);

    expectSameCells(survivors, [
      [1, 0],
      [1, -1],
      [1, 1],
    ]);
  });

  it("kills an overcrowded live cell (rule 3, overpopulation) — the centre (1,1) has 6 live neighbours and dies", () => {
    const before: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];

    const after = nextGeneration(before);

    expect(after).not.toContainEqual([1, 1]);
    expectSameCells(after, [
      [0, 0],
      [1, 0],
      [2, 0],
      [1, -1],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 3],
    ]);
  });

  it("brings a dead cell with exactly 3 neighbours to life (rule 4, reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const after = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expect(after).toContainEqual([1, 1]);
    expectSameCells(after, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });

  it("keeps a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expectSameCells(nextGeneration(block), block);
  });

  it("oscillates a vertical blinker into a horizontal one — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const after = nextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);

    expectSameCells(after, [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it("oscillates a horizontal blinker back into a vertical one — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const vertical: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const horizontal = nextGeneration(vertical);

    // Period 2: a second generation returns the blinker to its starting state.
    expectSameCells(nextGeneration(horizontal), vertical);
  });

  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    const after = nextGeneration([
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ]);

    expectSameCells(after, [
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ]);
  });
});
