import { describe, it, expect } from "vitest";
import { type Cell, nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell due to underpopulation", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent cells due to underpopulation (Rule 1 example)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should keep block still life unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(block);
  });

  it("should apply reproduction rule: L-shape becomes 2x2 block", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should apply overpopulation rule: live cell with >3 neighbors dies", () => {
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [2, 0]];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 0]);
  });

  it("should oscillate blinker from horizontal to vertical", () => {
    const horizontal: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const vertical: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(nextGeneration(horizontal)).toEqual(expect.arrayContaining(vertical));
    expect(nextGeneration(horizontal)).toHaveLength(vertical.length);
  });

  it("should oscillate blinker back from vertical to horizontal", () => {
    const vertical: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    const horizontal: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(vertical)).toEqual(expect.arrayContaining(horizontal));
    expect(nextGeneration(vertical)).toHaveLength(horizontal.length);
  });

  it("should handle negative coordinates in blinker oscillation", () => {
    const horizontal: Cell[] = [[-5, -5], [-5, -4], [-5, -3]];
    const vertical: Cell[] = [[-6, -4], [-5, -4], [-4, -4]];
    expect(nextGeneration(horizontal)).toEqual(expect.arrayContaining(vertical));
    expect(nextGeneration(horizontal)).toHaveLength(vertical.length);
  });
});