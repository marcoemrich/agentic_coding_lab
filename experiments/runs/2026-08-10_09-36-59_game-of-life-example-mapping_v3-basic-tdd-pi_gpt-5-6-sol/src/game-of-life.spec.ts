import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life";

const sorted = (cells: [number, number][]): [number, number][] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("keeps an empty generation empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills live cells with fewer than two neighbors", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("preserves a block still life", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("lets a live cell with two or three neighbors survive", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];

    expect(nextGeneration(cells)).toContainEqual([1, 0]);
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it("kills a live cell with more than three neighbors", () => {
    const crowded: [number, number][] = [
      [0, 0], [-1, -1], [0, -1], [1, -1], [-1, 0],
    ];

    expect(nextGeneration(crowded)).not.toContainEqual([0, 0]);
  });

  it("reproduces a dead cell with exactly three neighbors", () => {
    const cells: [number, number][] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it("oscillates a blinker over two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });

  it("handles patterns at negative coordinates", () => {
    const block: [number, number][] = [[-3, -4], [-2, -4], [-3, -3], [-2, -3]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("treats repeated coordinates as one living cell", () => {
    expect(nextGeneration([[0, 0], [0, 0], [1, 0]])).toEqual([]);
  });
});
