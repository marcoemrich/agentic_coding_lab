import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const norm = (cells: [number, number][]) =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: live cells with < 2 neighbors die -- [(0,1),(1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 3 Overpopulation: live cell with > 3 neighbors dies -- center of full ring dies", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]];
    const gen1: [number, number][] = [[0, 0], [0, 2], [1, -1], [1, 0], [1, 2], [1, 3], [2, 0], [2, 2]];
    expect(norm(nextGeneration(gen0))).toEqual(norm(gen1));
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 neighbors becomes alive", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const gen1: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];
    expect(norm(nextGeneration(gen0))).toEqual(norm(gen1));
  });
  it("Block still life: [(0,0),(1,0),(0,1),(1,1)] stays unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(norm(nextGeneration(block))).toEqual(norm(block));
  });
  it("Rule 2 Survival: center cell with 2 or 3 neighbors lives on", () => {
    // middle cell (1,0) has exactly 2 live neighbors -> survives
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const gen1: [number, number][] = [[1, -1], [1, 0], [1, 1]];
    expect(norm(nextGeneration(gen0))).toEqual(norm(gen1));
  });
  it("Blinker oscillator gen0 -> gen1: [(0,0),(0,1),(0,2)] -> [(-1,1),(0,1),(1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(norm(nextGeneration(gen0))).toEqual(norm(gen1));
  });
  it("Blinker oscillator gen1 -> gen2 returns to vertical", () => {
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const gen2: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    expect(norm(nextGeneration(gen1))).toEqual(norm(gen2));
  });
});
