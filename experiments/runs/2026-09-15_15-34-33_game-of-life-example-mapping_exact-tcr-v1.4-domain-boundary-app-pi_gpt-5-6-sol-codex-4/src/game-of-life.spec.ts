import { describe, expect, it } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

function expectCells(actual: Cell[], expected: Cell[]): void {
  expect(actual.map(String).sort()).toEqual(expected.map(String).sort());
}

describe("Game of Life next generation", () => {
  it("returns [] when the current generation is empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)] because it dies from underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] for adjacent cells [(0,1),(1,1)] because each has only one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps a live cell with exactly 2 live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps center cell (1,1) with exactly 3 live neighbors alive, as in the survival rule example", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("removes center cell (1,1) with exactly 4 live neighbors because of overpopulation", () => {
    const next = nextGeneration([[1, 1], [1, 0], [0, 1], [2, 1], [1, 2]]);
    expect(next).not.toContainEqual([1, 1]);
  });
  it("changes [(0,0),(1,0),(0,1)] to [(0,0),(1,0),(0,1),(1,1)] by reproduction", () => {
    expectCells(
      nextGeneration([[0, 0], [1, 0], [0, 1]]),
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    );
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged as a still life", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectCells(nextGeneration(block), block);
  });
  it("changes vertical blinker [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)], including a negative coordinate", () => {
    expectCells(
      nextGeneration([[0, 0], [0, 1], [0, 2]]),
      [[-1, 1], [0, 1], [1, 1]],
    );
  });
  it("changes the blinker back to [(0,0),(0,1),(0,2)] after two generations", () => {
    const verticalBlinker: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectCells(nextGeneration(nextGeneration(verticalBlinker)), verticalBlinker);
  });
});
