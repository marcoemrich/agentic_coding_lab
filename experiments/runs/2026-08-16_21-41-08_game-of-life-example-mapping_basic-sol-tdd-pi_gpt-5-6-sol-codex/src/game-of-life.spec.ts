import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([xA, yA], [xB, yB]) => xA - xB || yA - yB);
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(sorted(nextGeneration([]))).toEqual([]);
  });
  it("kills a single live cell -- []", () => {
    expect(sorted(nextGeneration([[0, 0]]))).toEqual([]);
  });
  it("kills two adjacent cells with one neighbor each -- []", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("keeps a live center cell with two neighbors alive -- includes (0,0)", () => {
    expect(sorted(nextGeneration([[-1, 0], [0, 0], [1, 0]]))).toContainEqual([0, 0]);
  });
  it("keeps a live center cell with three neighbors alive -- includes (0,0)", () => {
    expect(sorted(nextGeneration([[-1, 0], [0, 0], [1, 0], [0, 1]]))).toContainEqual([0, 0]);
  });
  it("kills a live center cell with four neighbors -- excludes (0,0)", () => {
    expect(sorted(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]))).not.toContainEqual([0, 0]);
  });
  it("births dead (1,1) with three neighbors -- [(0,0),(0,1),(1,0),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("turns a vertical blinker into horizontal -- [(-1,1),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [0, 1], [0, 2]]))).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("turns a horizontal blinker back into vertical -- [(0,0),(0,1),(0,2)]", () => {
    expect(sorted(nextGeneration([[-1, 1], [0, 1], [1, 1]]))).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("keeps a 2x2 block unchanged -- [(0,0),(0,1),(1,0),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
});
