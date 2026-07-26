import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: two adjacent live cells die -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sortCells(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sortCells([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
  });
  it("survival: live cell with 3 neighbors lives on -- center (1,1) of [(0,0),(1,0),(2,0),(1,1)] survives in next gen", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
    ]);
    expect(next).toContainEqual([1, 1]);
  });
  it("block still life remains unchanged -- [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const block: [number, number][] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
  it("overpopulation: live cell with >3 neighbors dies -- center (1,1) of 3x3 cross dies", () => {
    const next = nextGeneration([
      [0, 0],
      [1, 0],
      [2, 0],
      [1, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("blinker oscillates horizontal to vertical -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(
      sortCells(nextGeneration([
        [0, 0],
        [0, 1],
        [0, 2],
      ]))
    ).toEqual(
      sortCells([
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
    );
  });
  it("blinker returns to original after two generations -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const sortCells = (cells: [number, number][]) =>
      [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(
      sortCells(nextGeneration([
        [-1, 1],
        [0, 1],
        [1, 1],
      ]))
    ).toEqual(
      sortCells([
        [0, 0],
        [0, 1],
        [0, 2],
      ])
    );
  });
});
