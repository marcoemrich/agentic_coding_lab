import { describe, expect, it } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

function expectSameLivingCells(actual: Cell[], expected: Cell[]): void {
  expect(new Set(actual.map(String))).toEqual(new Set(expected.map(String)));
}

describe("Game of Life -- nextGeneration", () => {
  it("returns no living cells for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single living cell dies of underpopulation (0 live neighbors) -- [[0,0]] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("both cells of a living pair die of underpopulation (1 live neighbor each) -- [[0,0],[1,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("a living cell with 2 live neighbors survives -- blinker [[0,0],[1,0],[2,0]] keeps [1,0] alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("a living cell with 3 live neighbors survives -- block [[0,0],[1,0],[0,1],[1,1]] keeps all four alive", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameLivingCells(nextGeneration(block), block);
  });
  it("a living cell with more than 3 live neighbors dies of overpopulation -- centre of [[0,0],[-1,0],[1,0],[0,-1],[0,1]] is dead next generation", () => {
    const plus: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    expect(nextGeneration(plus)).not.toContainEqual([0, 0]);
  });
  it("a dead cell with exactly 3 live neighbors becomes alive by reproduction -- blinker [[0,0],[1,0],[2,0]] -> [[1,-1],[1,0],[1,1]]", () => {
    const horizontalBlinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    expectSameLivingCells(nextGeneration(horizontalBlinker), [
      [1, -1],
      [1, 0],
      [1, 1],
    ]);
  });
  it("a dead cell with 2 live neighbors stays dead -- [[0,0],[2,0]] produces no cell at [1,0]", () => {
    expect(nextGeneration([[0, 0], [2, 0]])).not.toContainEqual([1, 0]);
  });
  it("a dead cell with 4 live neighbors stays dead -- [[-1,-1],[1,-1],[-1,1],[1,1]] produces no cell at [0,0]", () => {
    const diagonals: Cell[] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
    expect(nextGeneration(diagonals)).not.toContainEqual([0, 0]);
  });
  it("a still life is unchanged across a generation -- block [[0,0],[1,0],[0,1],[1,1]] -> same four cells", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameLivingCells(nextGeneration(block), block);
    expect(nextGeneration(block)).toHaveLength(block.length);
  });
  it("an oscillator alternates -- vertical blinker [[1,-1],[1,0],[1,1]] -> horizontal [[0,0],[1,0],[2,0]]", () => {
    const verticalBlinker: Cell[] = [[1, -1], [1, 0], [1, 1]];
    expectSameLivingCells(nextGeneration(verticalBlinker), [
      [0, 0],
      [1, 0],
      [2, 0],
    ]);
  });
  it("handles negative coordinates -- blinker at [[-5,-5],[-4,-5],[-3,-5]] -> [[-4,-6],[-4,-5],[-4,-4]]", () => {
    const negativeBlinker: Cell[] = [[-5, -5], [-4, -5], [-3, -5]];
    expectSameLivingCells(nextGeneration(negativeBlinker), [
      [-4, -6],
      [-4, -5],
      [-4, -4],
    ]);
  });
  it("uses a sparse representation -- a glider far from the origin [[1000,1000],[1001,1001],[999,1002],[1000,1002],[1001,1002]] advances to its next glider phase", () => {
    const glider: Cell[] = [
      [1000, 1000],
      [1001, 1001],
      [999, 1002],
      [1000, 1002],
      [1001, 1002],
    ];
    expectSameLivingCells(nextGeneration(glider), [
      [999, 1001],
      [1001, 1001],
      [1000, 1002],
      [1001, 1002],
      [1000, 1003],
    ]);
  });
  it("returns each living cell exactly once -- output of a block contains no duplicate coordinates", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(String)).size).toBe(result.length);
  });
});
