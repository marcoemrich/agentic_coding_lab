import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftX === rightX ? leftY - rightY : leftX - rightX,
  );
}

describe("nextGeneration", () => {
  it("kills a single cell with no neighbors -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps the center live cell with three neighbors alive -- includes (1,1)", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("kills the overpopulated center from the shown input -- excludes (1,1)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces a dead cell with exactly three neighbors -- [(0,0),(0,1),(1,0),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(sorted(nextGeneration(cells))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("turns a vertical blinker into the horizontal blinker, including negative x -- [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(sorted(nextGeneration(cells))).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns the horizontal blinker back into the vertical blinker after a second generation -- [(0,0),(0,1),(0,2)]", () => {
    const generationZero: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(sorted(nextGeneration(nextGeneration(generationZero)))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("keeps a block still life unchanged -- [(0,0),(0,1),(1,0),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
