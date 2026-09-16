import { describe, expect, it } from "vitest";

import { nextGeneration } from "./game-of-life.js";

describe("Game of Life next generation", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell at (0,0) dies, producing []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells at (0,1) and (1,1) die from underpopulation, producing []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with exactly 2 live neighbors survives", () => {
    const next = nextGeneration([[0, 1], [1, 1], [2, 1]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("the live center cell with exactly 3 live neighbors survives (Rule 2 example intent)", () => {
    const next = nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]]);

    expect(next).toContainEqual([1, 1]);
  });
  it("the live center cell with more than 3 live neighbors dies (Rule 3 example intent)", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("dead cell (1,1) with exactly 3 live neighbors is born, producing a four-cell block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("four-cell block remains unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(block);

    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining(block));
  });
  it("vertical blinker becomes [(-1,1), (0,1), (1,1)], including a negative coordinate", () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];

    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining(horizontal));
  });
  it("blinker returns to [(0,0), (0,1), (0,2)] after two generations", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const afterTwoGenerations = nextGeneration(nextGeneration(vertical));

    expect(afterTwoGenerations).toHaveLength(3);
    expect(afterTwoGenerations).toEqual(expect.arrayContaining(vertical));
  });
});
