import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectSameCells(actual: Cell[], expected: Cell[]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 Underpopulation: kills a single cell with 0 neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: kills two adjacent cells with 1 neighbor each — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ]),
    ).toEqual([]);
  });
  it("Rule 2 Survival: a live cell with 3 live neighbors lives on — [(0,0), (1,0), (2,0), (1,1)] keeps (1,1) alive", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
      ]),
    ).toContainEqual([1, 1]);
  });
  it("Rule 3 Overpopulation: a live cell with more than 3 live neighbors dies — [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] drops (1,1)", () => {
    expect(
      nextGeneration([
        [0, 0],
        [1, 0],
        [2, 0],
        [1, 1],
        [0, 2],
        [1, 2],
        [2, 2],
      ]),
    ).not.toContainEqual([1, 1]);
  });
  it("Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]);

    expectSameCells(result, [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("handles negative coordinates — a block at [(-5,-7), (-4,-7), (-5,-6), (-4,-6)] survives unchanged", () => {
    const result = nextGeneration([
      [-5, -7],
      [-4, -7],
      [-5, -6],
      [-4, -6],
    ]);

    expectSameCells(result, [
      [-5, -7],
      [-4, -7],
      [-5, -6],
      [-4, -6],
    ]);
  });
  it("Block still life stays unchanged — [(0,0), (1,0), (0,1), (1,1)] → same 4 cells", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];

    expectSameCells(nextGeneration(block), block);
  });
  it("Blinker oscillates from vertical to horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    expectSameCells(nextGeneration(verticalBlinker), [
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker oscillates back to vertical after two generations — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const verticalBlinker: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];

    const afterTwoGenerations = nextGeneration(nextGeneration(verticalBlinker));

    expectSameCells(afterTwoGenerations, verticalBlinker);
  });
});
