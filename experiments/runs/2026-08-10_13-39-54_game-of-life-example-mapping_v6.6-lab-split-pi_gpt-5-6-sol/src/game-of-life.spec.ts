import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

function sorted(cells: [number, number][]): [number, number][] {
  return [...cells].sort(([xA, yA], [xB, yB]) => xA - xB || yA - yB);
}

describe("Game of Life - next generation", () => {
  it("a single live cell dies -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation kills adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with 2 neighbors survives -- center (1,1) remains alive", () => {
    expect(nextGeneration([[0, 1], [1, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("a live cell with 3 neighbors survives -- center (1,1) remains alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("overpopulation kills a live cell with 4 neighbors -- center (1,1) is absent", () => {
    const next = nextGeneration([[0, 1], [1, 0], [1, 1], [2, 1], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("reproduction births a dead cell with 3 neighbors -- (1,1) becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a block is a still life -- [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toEqual([
      [0, 0], [1, 0], [0, 1], [1, 1],
    ]);
  });
  it("a blinker oscillates over two generations -- vertical becomes horizontal with negative x then vertical", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[0, 1], [-1, 1], [1, 1]];

    const generationOne = nextGeneration(vertical);
    expect(sorted(generationOne)).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(generationOne))).toEqual(sorted(vertical));
  });
});
