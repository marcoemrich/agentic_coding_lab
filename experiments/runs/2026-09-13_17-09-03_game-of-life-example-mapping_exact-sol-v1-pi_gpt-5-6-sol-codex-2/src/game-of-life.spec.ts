import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([leftX, leftY], [rightX, rightY]) =>
    leftX === rightX ? leftY - rightY : leftX - rightX,
  );
}

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("kills two adjacent cells through underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("keeps the example focal live cell with exactly 3 live neighbors alive", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("kills the example focal live cell with more than 3 live neighbors", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it("reproduces at (1,1) with exactly 3 neighbors -- [(0,0),(1,0),(0,1)] becomes a 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("keeps a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("advances a vertical blinker to [(-1,1),(0,1),(1,1)], handling negative coordinates", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(next)).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
  it("advances the horizontal blinker back to [(0,0),(0,1),(0,2)] in generation 2", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(sorted(next)).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });
});
