import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

const expectGeneration = (actual: Cell[], expected: Cell[]): void => {
  expect(sorted(actual)).toEqual(sorted(expected));
};

describe("nextGeneration", () => {
  it("an empty grid stays empty -- [] -> []", () => {
    expectGeneration(nextGeneration([]), []);
  });
  it("a single cell dies -- [(0,0)] -> []", () => {
    expectGeneration(nextGeneration([[0, 0]]), []);
  });
  it("underpopulation: two adjacent cells each with 1 neighbor die -- [(0,1),(1,1)] -> []", () => {
    expectGeneration(nextGeneration([[0, 1], [1, 1]]), []);
  });
  it("survival: live cell with 2 neighbors lives on -- (1,0) in [(0,0),(1,0),(2,0),(1,2)] survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]])).toContainEqual([1, 0]);
  });
  it("survival: live cell with 3 neighbors lives on -- (1,0) in [(0,0),(1,0),(2,0),(1,1)] survives", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("overpopulation: live cell with exactly 4 neighbors dies -- (1,1) in plus [(1,0),(0,1),(1,1),(2,1),(1,2)] dies", () => {
    expect(nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("overpopulation: centre of spec grid dies -- (1,1) in [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] dies", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- [(0,0),(1,0),(0,1)] -> [(0,0),(1,0),(0,1),(1,1)]", () => {
    expectGeneration(nextGeneration([[0, 0], [1, 0], [0, 1]]), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  // The spec diagram shows (1,1) alive in gen 1, but (1,1) has 4 live neighbors; the numbered rules are authoritative.
  it("survival spec grid full generation by the rules -- [(0,0),(1,0),(2,0),(1,2)] -> [(1,-1),(1,0),(0,1),(2,1)]", () => {
    expectGeneration(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]), [[1, -1], [1, 0], [0, 1], [2, 1]]);
  });
  // The spec diagram shows (1,0) and (1,2) dead in gen 1, but each has 3 live neighbors; the numbered rules are authoritative.
  it("overpopulation spec grid full generation by the rules -- [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)] -> [(1,-1),(0,0),(1,0),(2,0),(0,2),(1,2),(2,2),(1,3)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const expected: Cell[] = [[1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3]];
    expectGeneration(nextGeneration(cells), expected);
  });
  it("block is a still life -- [(0,0),(1,0),(0,1),(1,1)] -> unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectGeneration(nextGeneration(block), block);
  });
  it("blinker oscillates into negative coordinates -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    expectGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker returns to its original state in generation 2 -- [(0,0),(0,1),(0,2)] -> [(0,0),(0,1),(0,2)]", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectGeneration(nextGeneration(nextGeneration(blinker)), blinker);
  });
  it("blinker far in negative coordinates -- [(-10,-10),(-10,-9),(-10,-8)] -> [(-11,-9),(-10,-9),(-9,-9)]", () => {
    expectGeneration(nextGeneration([[-10, -10], [-10, -9], [-10, -8]]), [[-11, -9], [-10, -9], [-9, -9]]);
  });
});
