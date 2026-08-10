import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort(([x1, y1], [x2, y2]) => x1 - x2 || y1 - y2);

describe("Game of Life - next generation", () => {
  it("keeps an empty grid empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1], [0, 0]]))).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("preserves a live cell with three neighbors -- center (1,1) survives from [(0,2),(1,2),(2,2),(1,1)]", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1]])).toContainEqual([1, 1]);
  });
  it("kills a live cell with more than three neighbors -- center (1,1) dies from [(0,2),(1,2),(2,2),(1,1),(0,0),(1,0),(2,0)]", () => {
    expect(nextGeneration([[0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0]])).not.toContainEqual([1, 1]);
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]))).toEqual([
      [0, 0], [0, 1], [1, 0], [1, 1],
    ]);
  });
  it("oscillates a blinker across negative coordinates -- vertical becomes horizontal and then vertical", () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(vertical))).toEqual(horizontal);
    expect(sorted(nextGeneration(horizontal))).toEqual(vertical);
  });
});
