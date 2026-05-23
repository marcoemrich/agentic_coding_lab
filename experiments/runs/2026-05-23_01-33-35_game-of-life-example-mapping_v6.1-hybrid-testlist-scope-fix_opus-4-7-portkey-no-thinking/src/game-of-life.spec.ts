import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty input produces empty output", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("Rule 1 - underpopulation: single live cell with 0 neighbors dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 - underpopulation: two adjacent live cells each with 1 neighbor die — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 - overpopulation: center cell with 4 live neighbors dies — full 3x3 block center (1,1) does not survive", () => {
    const fullBlock: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const next = nextGeneration(fullBlock);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("Rule 4 - reproduction: dead cell with exactly 3 live neighbors becomes alive — L-shape produces (1,1)", () => {
    const lShape: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const next = nextGeneration(lShape);
    expect(next).toContainEqual([1, 1]);
  });
  it("Rule 2 - survival: live cell with 2 live neighbors lives on — middle of row of three (1,0) survives", () => {
    const rowOfThree: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const next = nextGeneration(rowOfThree);
    expect(next).toContainEqual([1, 0]);
  });
  it("Block still life - [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("Blinker oscillator - vertical [(0,0),(0,1),(0,2)] becomes horizontal [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const next = nextGeneration(vertical);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
  it("Handles negative coordinates - blinker in negative space [(-5,-5),(-4,-5),(-3,-5)] becomes vertical [(-4,-6),(-4,-5),(-4,-4)]", () => {
    const horizontal: [number, number][] = [[-5, -5], [-4, -5], [-3, -5]];
    const expected: [number, number][] = [[-4, -6], [-4, -5], [-4, -4]];
    const next = nextGeneration(horizontal);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
});
