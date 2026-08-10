import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: readonly (readonly [number, number])[]) =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - next generation", () => {
  it("a single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each have one neighbor and die -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly two neighbors survives", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("the survival example's center cell with three neighbors survives", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });
  it("a live center cell with more than three neighbors dies in the overpopulation example", () => {
    const next = nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]]);
    expect(next).not.toContainEqual([1, 1]);
    expect(next).toEqual(expect.arrayContaining([[0, 2], [2, 2], [0, 0], [2, 0]]));
  });
  it("a dead cell with exactly three neighbors becomes alive in the reproduction example", () => {
    expect(nextGeneration([[0, 1], [1, 1], [0, 0]])).toEqual(
      expect.arrayContaining([[0, 1], [1, 1], [0, 0], [1, 0]]),
    );
  });
  it("a vertical blinker becomes the specified horizontal blinker, including negative coordinates", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual(
      sorted([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("a blinker returns to its original state after two generations", () => {
    const initial = [[0, 0], [0, 1], [0, 2]] as const;
    expect(sorted(nextGeneration(nextGeneration([...initial])))).toEqual(sorted(initial));
  });
  it("a 2x2 block remains unchanged", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as const;
    expect(sorted(nextGeneration([...block]))).toEqual(sorted(block));
  });
});
