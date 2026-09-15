import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftX === rightX ? leftY - rightY : leftX - rightX,
  );
}

describe("Game of Life - next generation", () => {
  it("an empty sparse grid produces []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell [(0,0)] dies, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("the underpopulated pair [(0,1),(1,1)] dies, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly 2 live neighbors survives", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("a live cell with exactly 3 live neighbors survives", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("a live cell with exactly 4 live neighbors dies", () => {
    const cross: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    expect(nextGeneration(cross)).not.toContainEqual([0, 0]);
  });
  it("the L-shaped input [(0,0),(1,0),(0,1)] reproduces at (1,1), producing a 2x2 block", () => {
    const input: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const expected: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  });
  it("the vertical blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const input: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  });
  it("the blinker returns to its vertical state after two generations", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const secondGeneration = nextGeneration(nextGeneration(vertical));
    expect(sorted(secondGeneration)).toEqual(sorted(vertical));
  });
  it("the block [(0,0),(1,0),(0,1),(1,1)] remains unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("a vertical blinker spanning negative coordinates evolves across the negative boundary", () => {
    const input: Cell[] = [[-2, -1], [-2, 0], [-2, 1]];
    const expected: Cell[] = [[-3, 0], [-2, 0], [-1, 0]];
    expect(sorted(nextGeneration(input))).toEqual(sorted(expected));
  });
});

