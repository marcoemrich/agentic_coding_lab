import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("returns empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("a single live cell dies (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent live cells both die (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("a live cell with 2 live neighbors survives", () => {
    // Blinker: vertical column. Center (0,1) has 2 live neighbors and survives.
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toContainEqual([0, 1]);
  });
  it("a live cell with more than 3 live neighbors dies (overpopulation)", () => {
    // Center (1,1) has 4 live neighbors (the 4 corners), should die.
    const result = nextGeneration([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("a dead cell with exactly 3 live neighbors becomes alive (reproduction)", () => {
    // Cells form an L; dead cell (1,1) has exactly 3 live neighbors (0,0), (1,0), (0,1).
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates: vertical becomes horizontal", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("block is a still life (unchanged)", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("handles negative coordinates", () => {
    // Blinker centered at (-5, -4)
    const result = nextGeneration([[-5, -5], [-5, -4], [-5, -3]]);
    expect(result).toEqual(expect.arrayContaining([[-6, -4], [-5, -4], [-4, -4]]));
    expect(result).toHaveLength(3);
  });
});
