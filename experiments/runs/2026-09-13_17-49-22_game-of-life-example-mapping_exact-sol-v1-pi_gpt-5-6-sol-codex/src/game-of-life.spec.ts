import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

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
  it("kills two adjacent live cells with one neighbor each -- []", () => {
    expect(sorted(nextGeneration([[0, 1], [1, 1]]))).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const next = sorted(nextGeneration([[-1, 0], [0, 0], [1, 0]]));

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps a live cell with exactly 3 live neighbors alive", () => {
    const next = sorted(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]));

    expect(next).toContainEqual([0, 0]);
  });
  it("kills a live cell with exactly 4 live neighbors", () => {
    const next = sorted(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]));

    expect(next).not.toContainEqual([0, 0]);
  });
  it("makes a dead cell with exactly 3 live neighbors alive at (1,1)", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("keeps the 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("turns vertical blinker [(0,0),(0,1),(0,2)] into [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(next)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("turns a horizontal blinker using negative coordinates back to vertical", () => {
    const next = nextGeneration([[-3, -2], [-2, -2], [-1, -2]]);

    expect(sorted(next)).toEqual(sorted([[-2, -3], [-2, -2], [-2, -1]]));
  });
});
