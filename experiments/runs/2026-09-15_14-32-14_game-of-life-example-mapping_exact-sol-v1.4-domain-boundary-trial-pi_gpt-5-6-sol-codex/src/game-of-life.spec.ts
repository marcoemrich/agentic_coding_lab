import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sortedCellKeys(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("Game of Life - next generation", () => {
  it("an empty generation remains empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies from underpopulation -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each die with one neighbor -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly two neighbors survives -- center remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it("a live cell with exactly three neighbors survives -- center remains alive (authoritative Rule 2 prose)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("a dead cell with exactly three neighbors is born -- [(0,0),(1,0),(0,1)] becomes a 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sortedCellKeys(next)).toEqual(sortedCellKeys([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("a live cell with more than three neighbors dies -- the Rule 3 example's center is absent", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("a 2x2 block is a still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortedCellKeys(nextGeneration(block))).toEqual(sortedCellKeys(block));
  });
  it("negative coordinates work on the infinite grid -- a 2x2 block spanning negative x/y is unchanged", () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(sortedCellKeys(nextGeneration(block))).toEqual(sortedCellKeys(block));
  });
  it("a vertical blinker becomes horizontal -- [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sortedCellKeys(next)).toEqual(sortedCellKeys([[-1, 1], [0, 1], [1, 1]]));
  });
  it("a blinker returns to its initial state after two generations -- vertical to horizontal to vertical", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const twoGenerationsLater = nextGeneration(nextGeneration(vertical));
    expect(sortedCellKeys(twoGenerationsLater)).toEqual(sortedCellKeys(vertical));
  });
});
