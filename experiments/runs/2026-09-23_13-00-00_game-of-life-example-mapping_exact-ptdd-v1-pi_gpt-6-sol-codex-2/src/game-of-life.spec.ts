import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual.map(cell => JSON.stringify(cell)).sort()).toEqual(
    expected.map(cell => JSON.stringify(cell)).sort(),
  );
}

describe("nextGeneration", () => {
  it("an empty infinite grid stays empty: [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell at (0,0) dies: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells each with one neighbor die: [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with two neighbors survives at (0,0)", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("a live cell with three neighbors survives at (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a live cell with four neighbors dies at (1,1)", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });
  it("a live cell with eight neighbors dies at (1,1) as in the overpopulation diagram", () => {
    const square: [number, number][] = [];
    for (let y = 0; y <= 2; y++) {
      for (let x = 0; x <= 2; x++) square.push([x, y]);
    }
    expect(nextGeneration(square)).not.toContainEqual([1, 1]);
  });
  it("a dead cell with two neighbors stays dead at (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).not.toContainEqual([1, 1]);
  });
  it("a dead cell with four neighbors stays dead at (1,1)", () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [0, 1]])).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly three neighbors is born at (1,1) from [(0,0),(1,0),(0,1)]", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("a blinker at [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expectCells(result, [[-1, 1], [0, 1], [1, 1]]);
  });
  it("the blinker returns to [(0,0),(0,1),(0,2)] after a second generation", () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expectCells(result, [[0, 0], [0, 1], [0, 2]]);
  });
  it("a block at [(0,0),(1,0),(0,1),(1,1)] is unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("a translated pattern across negative x and y follows the same rules", () => {
    expectCells(nextGeneration([[-4, -5], [-4, -4], [-4, -3]]), [[-5, -4], [-4, -4], [-3, -4]]);
  });
});
