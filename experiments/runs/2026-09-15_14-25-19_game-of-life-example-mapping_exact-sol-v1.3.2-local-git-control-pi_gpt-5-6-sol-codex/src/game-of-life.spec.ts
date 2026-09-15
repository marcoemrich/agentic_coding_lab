import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]): [number, number][] =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("Game of Life - Next Generation", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single isolated cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation to the example pair -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("lets a cell with two neighbors survive -- a horizontal row becomes a vertical row", () => {
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(sorted(result)).toEqual([[0, -1], [0, 0], [0, 1]]);
  });
  it("lets cells with three neighbors survive -- a four-cell block is unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("applies overpopulation to the seven-cell example -- the center dies", () => {
    const cells: [number, number][] = [
      [0, 2], [1, 2], [2, 2], [1, 1], [0, 0], [1, 0], [2, 0],
    ];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });
  it("reproduces the dead cell in the L-shaped example -- three cells become a block", () => {
    const result = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expect(sorted(result)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("advances the blinker from Gen 0 to the specified Gen 1", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(sorted(result)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("advances the blinker from Gen 1 to the specified Gen 2", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(sorted(result)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("evolves a blinker across negative coordinates -- no boundary exists at the origin", () => {
    const result = nextGeneration([[-2, -2], [-2, -1], [-2, 0]]);

    expect(sorted(result)).toEqual([[-3, -1], [-2, -1], [-1, -1]]);
  });
});
