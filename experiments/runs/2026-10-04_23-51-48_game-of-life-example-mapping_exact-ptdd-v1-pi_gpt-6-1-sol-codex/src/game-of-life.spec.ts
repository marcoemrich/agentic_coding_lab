import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cells = Parameters<typeof nextGeneration>[0];

function expectCells(actual: Cells, expected: Cells): void {
  expect(actual.map(cell => cell.join(",")).sort())
    .toEqual(expected.map(cell => cell.join(",")).sort());
}

describe("nextGeneration", () => {
  it("empty living grid remains []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell (0,0) dies to [] with zero neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("pair (0,1),(1,1) dies to [] with one neighbor each", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("live center (1,1) survives with two neighbors", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) survives with three neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("live center (1,1) dies with four neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("dead center (1,1) with three neighbors is born: L becomes block", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [0, 1]]), [[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("dead center (1,1) with two neighbors remains dead", () => {
    expect(nextGeneration([[0, 1], [2, 1]])).not.toContainEqual([1, 1]);
  });
  it("dead center (1,1) with four neighbors remains dead", () => {
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it("survival picture produces [(1,-1),(1,0),(0,1),(2,1)] under numbered rules", () => {
    expectCells(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]), [[1, -1], [1, 0], [0, 1], [2, 1]]);
  });
  it("overpopulation picture retains top/bottom rows and births (1,-1),(1,3); six-neighbor center dies", () => {
    expectCells(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ]), [
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3],
    ]);
  });
  it("vertical blinker becomes [(-1,1),(0,1),(1,1)]", () => {
    expectCells(nextGeneration([[0, 0], [0, 1], [0, 2]]), [[-1, 1], [0, 1], [1, 1]]);
  });
  it("blinker returns to [(0,0),(0,1),(0,2)] after two generations", () => {
    const initial: Cells = [[0, 0], [0, 1], [0, 2]];
    expectCells(nextGeneration(nextGeneration(initial)), initial);
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: Cells = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("blinker works at distant negative x/y without grid boundaries", () => {
    expectCells(nextGeneration([
      [-1_000_000_000, -2_000_000_000],
      [-1_000_000_000, -1_999_999_999],
      [-1_000_000_000, -1_999_999_998],
    ]), [
      [-1_000_000_001, -1_999_999_999],
      [-1_000_000_000, -1_999_999_999],
      [-999_999_999, -1_999_999_999],
    ]);
  });
  it("distant positive and negative blocks evolve together as sparse living cells", () => {
    const blocks: Cells = [
      [-1_000_000_000, -1_000_000_000], [-999_999_999, -1_000_000_000],
      [-1_000_000_000, -999_999_999], [-999_999_999, -999_999_999],
      [1_000_000_000, 1_000_000_000], [1_000_000_001, 1_000_000_000],
      [1_000_000_000, 1_000_000_001], [1_000_000_001, 1_000_000_001],
    ];
    expectCells(nextGeneration(blocks), blocks);
  });
});
