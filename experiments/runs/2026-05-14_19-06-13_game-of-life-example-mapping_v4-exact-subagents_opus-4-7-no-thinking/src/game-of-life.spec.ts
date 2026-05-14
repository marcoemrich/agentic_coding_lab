// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Conway's Game of Life - nextGeneration", () => {
  it("should return empty array when given empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell due to underpopulation (0 neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells due to underpopulation (1 neighbor each)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("should preserve a 2x2 block still life unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("should rotate a horizontal blinker (3 in a row) 90 degrees to vertical", () => {
    const horizontal: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(horizontal);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("should kill a live cell with more than 3 live neighbors due to overpopulation", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    expect(result).toEqual(expect.not.arrayContaining([[0, 0]]));
  });
  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction)", () => {
    const lShape: Cell[] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(lShape);
    expect(result).toEqual(expect.arrayContaining<Cell>([[1, 0]]));
  });
  it("should correctly compute the next generation with negative coordinates", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
});
