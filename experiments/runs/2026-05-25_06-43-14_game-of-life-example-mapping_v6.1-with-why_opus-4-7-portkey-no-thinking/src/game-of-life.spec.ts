import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("single cell dies — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("Rule 1 Underpopulation: two adjacent cells both die — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("Rule 4 Reproduction: dead cell with exactly 3 live neighbors becomes alive — [(0,2), (1,2), (0,1)] → [(0,2), (1,2), (0,1), (1,1)]", () => {
    const input: [number, number][] = [[0, 2], [1, 2], [0, 1]];
    const expected: [number, number][] = [[0, 2], [1, 2], [0, 1], [1, 1]];
    expect(nextGeneration(input).sort()).toEqual(expected.sort());
  });
  it("Rule 2 Survival: middle of a horizontal triple survives — [(0,0),(1,0),(2,0)] includes (1,0) in next gen", () => {
    const gen0: [number, number][] = [[0, 0], [1, 0], [2, 0]];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([1, 0]);
  });
  it("Rule 3 Overpopulation: center cell with 4+ live neighbors dies — full 3x3 grid, (1,1) not in result", () => {
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("Block still life: 2x2 block remains unchanged — [(0,0),(1,0),(0,1),(1,1)] stays the same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result.sort()).toEqual(block.sort());
  });
  it("Blinker oscillator: vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const expected: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(vertical);
    expect(result.sort()).toEqual(expected.sort());
  });
  it("supports negative coordinates — blinker at negative origin oscillates correctly", () => {
    const vertical: [number, number][] = [[-5, -1], [-5, 0], [-5, 1]];
    const expected: [number, number][] = [[-6, 0], [-5, 0], [-4, 0]];
    expect(nextGeneration(vertical).sort()).toEqual(expected.sort());
  });
});
