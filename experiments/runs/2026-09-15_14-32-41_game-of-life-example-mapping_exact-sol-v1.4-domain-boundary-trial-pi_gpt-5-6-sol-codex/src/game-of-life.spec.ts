import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - next generation", () => {
  it("an empty generation remains empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies from underpopulation -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each have one neighbor and die -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly two neighbors survives -- center [0, 0] remains alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("a live cell with exactly three neighbors survives -- center [1, 1] remains alive", () => {
    const cells: Cell[] = [[1, 1], [0, 2], [1, 2], [2, 2]];
    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbors is reproduced -- [(0,0), (1,0), (0,1), (1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("a live cell with more than three neighbors dies -- center [0, 0] is absent", () => {
    const cells: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    expect(nextGeneration(cells)).not.toContainEqual([0, 0]);
  });
  it("a vertical blinker becomes horizontal and returns vertically after two generations", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);
    expect(sorted(generationOne)).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(generationOne))).toEqual(sorted(vertical));
  });
  it("a 2x2 block is a still life -- its four coordinates are unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("negative coordinates support the infinite grid -- translated blinker evolves across negative x and y", () => {
    const vertical: Cell[] = [[-2, -3], [-2, -2], [-2, -1]];
    const horizontal: Cell[] = [[-3, -2], [-2, -2], [-1, -2]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
  });
});
