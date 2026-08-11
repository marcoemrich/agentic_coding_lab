import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

/** Asserts the next generation of `cells`, ignoring the order of the result. */
const expectNextGeneration = (cells: Cell[]) => ({
  toBe: (expected: Cell[]) =>
    expect(sortCells(nextGeneration(cells))).toEqual(sortCells(expected)),
});

describe("Game of Life - Next Generation", () => {
  it("should return an empty grid for an empty grid — [] → []", () => {
    expectNextGeneration([]).toBe([]);
  });
  it("should kill a single lonely cell — [(0,0)] → []", () => {
    expectNextGeneration([[0, 0]]).toBe([]);
  });
  it("Rule 1 – Underpopulation: two adjacent cells each with 1 neighbor die — [(0,1), (1,1)] → []", () => {
    expectNextGeneration([
      [0, 1],
      [1, 1],
    ]).toBe([]);
  });
  it("Rule 4 – Reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    expectNextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
    ]).toBe([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  // NOTE: the spec's Rule 2 diagram is internally inconsistent — it says the
  // center (1,1) has 3 neighbors, but its own grid gives it 4 (it is adjacent to
  // all of (0,0), (1,0), (2,0) and (1,2)), and the drawn Gen 1 follows from
  // neither. This test asserts the true Conway result: (1,0) survives on 2
  // neighbors, and (0,1), (1,-1), (2,1) are born on exactly 3.
  it("Rule 2 – Survival: live cell (1,0) with 2 live neighbors lives on — [(0,0), (1,0), (2,0), (1,2)] → [(1,-1), (0,1), (1,0), (2,1)]", () => {
    expectNextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 2],
    ]).toBe([
      [1, -1],
      [0, 1],
      [1, 0],
      [2, 1],
    ]);
  });
  // NOTE: the spec's Rule 3 drawn Gen 1 is incorrect. It shows (0,1) and (2,1)
  // alive, but each has 5 live neighbors (a dead cell needs exactly 3), and it
  // shows (1,0)/(1,2) dead, but each is alive with 3 neighbors (survival). Its
  // 3x3 window also cannot show the cells born at y=-1 and y=3. The rule being
  // illustrated does hold: the overcrowded center (1,1) dies.
  it("Rule 3 – Overpopulation: overcrowded center cell (1,1) dies — [(0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2)] → [(1,-1), (0,0), (1,0), (2,0), (0,2), (1,2), (2,2), (1,3)]", () => {
    expectNextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]).toBe([
      [1, -1],
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 2],
      [1, 2],
      [2, 2],
      [1, 3],
    ]);
  });
  it("Block (still life): [(0,0), (1,0), (0,1), (1,1)] stays unchanged", () => {
    expectNextGeneration([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]).toBe([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker gen 0 → gen 1: vertical [(0,0), (0,1), (0,2)] becomes horizontal [(-1,1), (0,1), (1,1)]", () => {
    expectNextGeneration([
      [0, 0],
      [0, 1],
      [0, 2],
    ]).toBe([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });
  it("Blinker gen 1 → gen 2: horizontal [(-1,1), (0,1), (1,1)] becomes vertical [(0,0), (0,1), (0,2)]", () => {
    expectNextGeneration([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]).toBe([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });
});
