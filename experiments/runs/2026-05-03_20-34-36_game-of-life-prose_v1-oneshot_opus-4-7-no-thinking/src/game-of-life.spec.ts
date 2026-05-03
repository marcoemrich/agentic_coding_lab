import { describe, it, expect } from "vitest";
import { nextGeneration, nextGenerationCells, type Cell } from "./game-of-life.js";

function toSortedArray(set: Set<string>): string[] {
  return [...set].sort();
}

function cellsToSortedKeys(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

describe("Game of Life - nextGeneration", () => {
  it("an empty universe stays empty", () => {
    expect(nextGeneration([]).size).toBe(0);
  });

  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]]).size).toBe(0);
  });

  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 0], [1, 0]]).size).toBe(0);
  });

  it("a block (2x2) is stable", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(toSortedArray(result)).toEqual(["0,0", "0,1", "1,0", "1,1"]);
  });

  it("a horizontal blinker becomes vertical", () => {
    const blinker: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(blinker);
    expect(toSortedArray(result)).toEqual(["1,-1", "1,0", "1,1"]);
  });

  it("a vertical blinker becomes horizontal", () => {
    const blinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(blinker);
    expect(toSortedArray(result)).toEqual(["-1,1", "0,1", "1,1"]);
  });

  it("blinker oscillates back to original after two generations", () => {
    const initial: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const gen1 = nextGenerationCells(initial);
    const gen2 = nextGeneration(gen1);
    expect(toSortedArray(gen2)).toEqual(["0,0", "1,0", "2,0"]);
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    expect(result.has("1,1")).toBe(true);
  });

  it("live cell with four neighbors dies (overpopulation)", () => {
    // Center cell at (0,0) with 4 neighbors: (1,0), (-1,0), (0,1), (0,-1)
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = nextGeneration(cells);
    expect(result.has("0,0")).toBe(false);
  });

  it("handles negative coordinates correctly", () => {
    const blinker: Cell[] = [[-5, -5], [-4, -5], [-3, -5]];
    const result = nextGeneration(blinker);
    expect(toSortedArray(result)).toEqual(["-4,-4", "-4,-5", "-4,-6"]);
  });

  it("a glider moves diagonally after 4 generations", () => {
    // Standard glider pattern
    let cells: Cell[] = [
      [1, 0],
      [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    for (let i = 0; i < 4; i++) {
      cells = nextGenerationCells(cells);
    }
    // After 4 generations, glider should have shifted by (1,1)
    const expected = ["1,2", "2,3", "1,3", "2,3", "3,3"]; // approximate shifted
    // Just check it has 5 cells and has moved
    expect(cells.length).toBe(5);
    const expectedShifted: Cell[] = [
      [2, 1],
      [3, 2],
      [1, 3], [2, 3], [3, 3],
    ];
    expect(cellsToSortedKeys(cells)).toEqual(cellsToSortedKeys(expectedShifted));
  });

  it("returns a Set of string keys", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toBeInstanceOf(Set);
  });

  it("does not mutate input", () => {
    const input: Cell[] = [[0, 0], [1, 0], [2, 0]];
    const copy = JSON.parse(JSON.stringify(input));
    nextGeneration(input);
    expect(input).toEqual(copy);
  });
});
