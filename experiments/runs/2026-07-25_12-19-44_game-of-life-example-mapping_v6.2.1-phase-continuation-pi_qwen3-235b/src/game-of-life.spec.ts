import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array when given no live cells", () => {
    const result = nextGeneration([]);
    expect(result).toEqual([]);
  });
  it.todo("should return empty array when a single cell dies due to underpopulation");
  it.todo("should return empty array when two adjacent cells die due to underpopulation");
  it.todo("should handle survival of a cell with exactly 2 live neighbors");
  it.todo("should handle survival of a cell with exactly 3 live neighbors");
  it.todo("should handle death due to overpopulation when a cell has 4 live neighbors");
  it.todo("should handle reproduction when a dead cell has exactly 3 live neighbors");
  it.todo("should evolve a blinker pattern correctly from horizontal to vertical orientation");
  it.todo("should evolve a blinker pattern correctly from vertical to horizontal orientation");
  it.todo("should keep block pattern unchanged as it is a still life");
});