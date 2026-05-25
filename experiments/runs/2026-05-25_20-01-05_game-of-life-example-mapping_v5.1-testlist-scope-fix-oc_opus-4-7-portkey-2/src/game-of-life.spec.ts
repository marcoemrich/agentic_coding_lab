import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

const sortCells = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

const expectSameCells = (actual: Cell[], expected: Cell[]): void => {
  expect(sortCells(actual)).toEqual(sortCells(expected));
};

describe("Game of Life - nextGeneration", () => {
  // Simplest case: single cell with no neighbors (Rule 1 - Underpopulation)
  it("single live cell dies from underpopulation -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1 - Underpopulation: two adjacent cells each have only 1 neighbor
  it("two horizontally-adjacent cells both die from underpopulation -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 3 - Overpopulation: center cell has 4+ neighbors and dies
  it("center cell with 4 live neighbors dies from overpopulation (rule 3 example) -- center (1,1) dies", () => {
    // Gen 0: ### / .#. / ### — center (1,1) has 4 live neighbors (corners)
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // The center (1,1) had 4 neighbors so must NOT be alive
    expect(result).not.toContainEqual([1, 1]);
  });

  // Rule 4 - Reproduction: dead cell with exactly 3 live neighbors becomes alive
  it("dead cell with exactly 3 live neighbors becomes alive (rule 4 example) -- (1,1) becomes alive", () => {
    // Gen 0: ## . / # . . / . . . → dead (1,1) has 3 live neighbors (0,0),(1,0),(0,1)
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 1]);
  });

  // Rule 2 - Survival: live cell with 2 neighbors lives on
  // Vertical blinker [(0,0),(0,1),(0,2)] - center (0,1) has 2 live neighbors → survives
  it("live cell with 2 live neighbors survives (rule 2) -- blinker center (0,1) survives", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([0, 1]);
  });

  // Block still life (Rule 2 + no Rule 4 triggers)
  it("block pattern is a still life -- [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(block), block);
  });

  // Blinker oscillator Gen 0 -> Gen 1
  it("vertical blinker becomes horizontal -- [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const expected: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expectSameCells(nextGeneration(gen0), expected);
  });

  // Blinker oscillator Gen 1 -> Gen 2 (back to vertical)
  it("horizontal blinker becomes vertical -- [(-1,1),(0,1),(1,1)] -> [(0,0),(0,1),(0,2)]", () => {
    const gen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const expected: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expectSameCells(nextGeneration(gen1), expected);
  });

  // Negative coordinates handling
  it("handles negative coordinates -- block at negative coords is still life", () => {
    const block: Cell[] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    expectSameCells(nextGeneration(block), block);
  });
});
