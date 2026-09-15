import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

function expectCells(actual: [number, number][], expected: [number, number][]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

const VERTICAL_BLINKER: [number, number][] = [[0, 0], [0, 1], [0, 2]];
const HORIZONTAL_BLINKER: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

describe("Game of Life - next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies to [] from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("adjacent pair [(0,1),(1,1)] dies to [] from underpopulation", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live cell with two neighbors survives in a three-cell blinker transition to [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration(VERTICAL_BLINKER), HORIZONTAL_BLINKER);
  });
  it("live cell with three neighbors survives while applying the complete next-generation rules", () => {
    const cells: [number, number][] = [[0, 0], [-1, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [
      [-1, 1], [0, 1], [1, 1],
      [-1, 0], [0, 0], [1, 0],
      [0, -1],
    ];
    expectCells(nextGeneration(cells), expected);
  });
  it("center of the pictured seven-cell pattern dies with more than three neighbors on the infinite grid", () => {
    const cells: [number, number][] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const expected: [number, number][] = [
      [0, 2], [1, 2], [2, 2], [1, 3],
      [0, 0], [1, 0], [2, 0], [1, -1],
    ];
    expectCells(nextGeneration(cells), expected);
  });
  it("dead cell (1,1) with exactly three neighbors reproduces, turning [(0,0),(1,0),(0,1)] into a block", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const expected: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(cells), expected);
  });
  it("vertical blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration(VERTICAL_BLINKER), HORIZONTAL_BLINKER);
  });
  it("horizontal blinker [(-1,1),(0,1),(1,1)] returns to [(0,0),(0,1),(0,2)]", () => {
    expectCells(nextGeneration(HORIZONTAL_BLINKER), VERTICAL_BLINKER);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("translated blinker at negative x and y coordinates evolves correctly", () => {
    const vertical: [number, number][] = [[-5, -4], [-5, -3], [-5, -2]];
    const horizontal: [number, number][] = [[-6, -3], [-5, -3], [-4, -3]];
    expectCells(nextGeneration(vertical), horizontal);
  });
});
