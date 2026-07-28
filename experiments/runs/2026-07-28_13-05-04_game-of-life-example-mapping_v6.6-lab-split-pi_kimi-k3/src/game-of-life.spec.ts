import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty for an empty grid -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation, 0 neighbors) -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, 1 neighbor each) -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should revive a dead cell with exactly 3 live neighbors (reproduction) -- [(0,0),(1,0),(0,1)] -> block", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const gen1: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(sorted(nextGeneration(gen0))).toEqual(gen1);
  });
  it("should keep a live cell with 3 live neighbors alive (survival) -- center (1,1) survives", () => {
    // T-tetromino: center (1,1) has exactly 3 live neighbors -> survives (spec Rule 2 claim)
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1]];
    const gen1: Cell[] = [[0, 0], [0, 1], [1, -1], [1, 0], [1, 1], [2, 0], [2, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]); // the 3-neighbor cell survives
    expect(sorted(result)).toEqual(gen1);
  });
  it("should kill a live cell with 4 live neighbors (overpopulation) -- center (1,1) dies", () => {
    // Plus pentomino: ### / .#. / ### -> center (1,1) has 4 live neighbors -> dies
    const gen0: Cell[] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]); // overpopulated center dies
  });
  it("should leave a block still life unchanged -- [(0,0),(1,0),(0,1),(1,1)] -> same", () => {
    const block: Cell[] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(block);
  });
  it("should rotate a vertical blinker to horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(gen0))).toEqual(gen1);
  });
  it("should rotate a horizontal blinker back to vertical (oscillation) -- gen1 -> gen2", () => {
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const gen2: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(sorted(nextGeneration(gen1))).toEqual(gen2);
  });
});
