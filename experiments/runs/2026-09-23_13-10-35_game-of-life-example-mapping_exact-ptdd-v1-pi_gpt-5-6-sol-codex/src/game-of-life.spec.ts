import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell [(0,0)] dies from underpopulation, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells [(0,1),(1,1)] each have one neighbor and die, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly 2 neighbors survives", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0]]);

    expect(next).toContainEqual([0, 0]);
  });
  it("center cell (1,1) with exactly 3 live neighbors survives", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("center cell (1,1) with 4 live neighbors dies from overpopulation", () => {
    const next = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("dead cell (1,1) with exactly 3 neighbors is born, completing [(0,0),(1,0),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("block [(0,0),(1,0),(0,1),(1,1)] is unchanged after one generation", () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);

    expect(next).toHaveLength(block.length);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("vertical blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected = [[-1, 1], [0, 1], [1, 1]] as [number, number][];

    expect(next).toHaveLength(expected.length);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
  it("blinker returns to [(0,0),(0,1),(0,2)] after a second generation", () => {
    const first = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const second = nextGeneration(first);
    const expected = [[0, 0], [0, 1], [0, 2]] as [number, number][];

    expect(second).toHaveLength(expected.length);
    expect(second).toEqual(expect.arrayContaining(expected));
  });
  it("translated blinker spanning negative x and y coordinates evolves correctly", () => {
    const next = nextGeneration([[-2, -2], [-2, -1], [-2, 0]]);
    const expected = [[-3, -1], [-2, -1], [-1, -1]] as [number, number][];

    expect(next).toHaveLength(expected.length);
    expect(next).toEqual(expect.arrayContaining(expected));
  });
});
