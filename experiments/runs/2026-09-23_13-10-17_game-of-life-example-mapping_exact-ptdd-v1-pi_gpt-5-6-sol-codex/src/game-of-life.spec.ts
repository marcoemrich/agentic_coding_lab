import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("keeps an empty sparse grid empty -- [] becomes []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("applies underpopulation to an isolated live cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies the underpopulation example to two adjacent cells -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps the live center cell with exactly 3 live neighbors alive", () => {
    const cells: [number, number][] = [[0, 0], [-1, -1], [0, -1], [1, -1]];

    expect(nextGeneration(cells)).toContainEqual([0, 0]);
  });
  it("kills a live center cell with exactly 4 live neighbors", () => {
    const cells: [number, number][] = [[0, 0], [0, -1], [1, 0], [0, 1], [-1, 0]];

    expect(nextGeneration(cells)).not.toContainEqual([0, 0]);
  });
  it("applies the reproduction example -- [(0,1),(1,1),(0,0)] becomes a 2x2 block", () => {
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("advances the vertical blinker to [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it("advances the horizontal blinker back to [(0,0),(0,1),(0,2)]", () => {
    const next = nextGeneration([[-1, 1], [0, 1], [1, 1]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it("keeps the block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)]", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("handles negative coordinates on the infinite grid -- a negative vertical blinker oscillates horizontally", () => {
    const next = nextGeneration([[-3, -2], [-3, -1], [-3, 0]]);

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-4, -1], [-3, -1], [-2, -1]]));
  });
});
