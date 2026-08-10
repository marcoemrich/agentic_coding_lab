import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - next generation", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("applies survival -- a live cell with 2 or 3 live neighbors remains alive", () => {
    const withTwoNeighbors: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const withThreeNeighbors: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1]];

    expect(nextGeneration(withTwoNeighbors)).toContainEqual([1, 0]);
    expect(nextGeneration(withThreeNeighbors)).toContainEqual([1, 0]);
  });
  it("applies overpopulation -- a live cell with more than 3 live neighbors dies", () => {
    const overcrowded: [number, number][] = [
      [1, 1], [0, 0], [1, 0], [2, 0], [0, 1],
    ];

    expect(nextGeneration(overcrowded)).not.toContainEqual([1, 1]);
  });
  it("applies reproduction -- [(0,0),(1,0),(0,1)] becomes a 2x2 block including (1,1)", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
  });
  it("preserves the block still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates a blinker over two generations -- vertical becomes [(-1,1),(0,1),(1,1)] then vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);

    expect(sorted(generationOne)).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(generationOne))).toEqual(sorted(vertical));
  });
});
