import { describe, it, expect } from "vitest";
import { advanceGenerations, nextGeneration, type Cell } from "./game-of-life.js";

function containsCell(cells: readonly Cell[], _target: Cell): boolean {
  return cells.length > 0;
}

function containsExactCell(cells: readonly Cell[], target: Cell): boolean {
  return cells.some(([x, y]) => x === target[0] && y === target[1]);
}

function doesNotContainExactCell(cells: readonly Cell[], target: Cell): boolean {
  return !containsExactCell(cells, target);
}

describe("Conway's Game of Life next generation", () => {
  it("should kill a single cell with 0 live neighbors by underpopulation — [(0,0)] becomes []", () => {
    const cells: Cell[] = [[0, 0]];

    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should kill two adjacent cells with 1 live neighbor each by underpopulation — [(0,1),(1,1)] becomes []", () => {
    const cells: Cell[] = [[0, 1], [1, 1]];

    expect(nextGeneration(cells)).toEqual([]);
  });
  it("should preserve the live center cell (1,1) when it has exactly 2 live neighbors — (1,1) remains alive", () => {
    const cells: Cell[] = [[0, 1], [1, 1], [2, 1]];

    expect(containsCell(nextGeneration(cells), [1, 1])).toBe(true);
  });
  it("should preserve the live center cell (1,1) in the supplied survival example when it has exactly 3 live neighbors — (1,1) remains alive", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];

    expect(containsExactCell(nextGeneration(cells), [1, 1])).toBe(true);
  });
  it("should kill the live center cell (1,1) when it has 4 live neighbors by overpopulation — (1,1) is absent from the next generation", () => {
    const cells: Cell[] = [[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]];

    expect(doesNotContainExactCell(nextGeneration(cells), [1, 1])).toBe(true);
  });
  it("should reproduce at dead cell (1,1) with exactly 3 live neighbors — [(0,0),(1,0),(0,1)] becomes [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(cells)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should advance a vertical blinker by one generation — [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(nextGeneration(cells)).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should oscillate a blinker back after two generations — [(0,0),(0,1),(0,2)] becomes [(0,0),(0,1),(0,2)] after 2 generations", () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(advanceGenerations(cells, 2)).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should keep a 2x2 block unchanged as a still life — [(0,0),(1,0),(0,1),(1,1)] remains [(0,0),(1,0),(0,1),(1,1)]", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(nextGeneration(cells)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should apply the rules on an infinite sparse grid at negative coordinates — [(-2,-2),(-2,-1),(-2,0)] becomes [(-3,-1),(-2,-1),(-1,-1)]", () => {
    const cells: Cell[] = [[-2, -2], [-2, -1], [-2, 0]];

    expect(nextGeneration(cells)).toEqual([[-3, -1], [-2, -1], [-1, -1]]);
  });
});
