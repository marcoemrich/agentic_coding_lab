import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function sorted(cells: [number, number][]): [number, number][] {
  return [...cells].sort(([x, y], [otherX, otherY]) => x - otherX || y - otherY);
}

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell with zero neighbors -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills both adjacent cells with one neighbor -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with two neighbors alive -- center remains present", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a live cell with three neighbors alive -- center remains present", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills a live cell with four neighbors -- center is absent", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces a dead cell with exactly three neighbors -- three-cell corner becomes a block", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("does not reproduce a dead cell with two neighbors -- target remains absent", () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it("does not reproduce a dead cell with four neighbors -- target remains absent", () => {
    const next = nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("turns a vertical blinker into [(-1,1), (0,1), (1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(next)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("returns the blinker to [(0,0), (0,1), (0,2)] after two generations", () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];

    expect(sorted(nextGeneration(nextGeneration(initial)))).toEqual(initial);
  });
  it("leaves the block [(0,0), (1,0), (0,1), (1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("supports an unbounded sparse grid at large positive and negative coordinates -- translated block unchanged", () => {
    const block: [number, number][] = [
      [1_000_000, -1_000_000], [1_000_001, -1_000_000],
      [1_000_000, -999_999], [1_000_001, -999_999],
    ];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
