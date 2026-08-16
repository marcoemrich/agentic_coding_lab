import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns no living cells for an empty generation -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a lone living cell with fewer than two neighbors -- []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("keeps a living cell with exactly two live neighbors alive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps a living cell with exactly three live neighbors alive", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("kills a living cell with four live neighbors by overpopulation", () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);
    expect(next).not.toContainEqual([0, 0]);
  });
  it("creates a living cell with exactly three live neighbors", () => {
    expect(nextGeneration([[-1, 0], [0, -1], [-1, -1]])).toContainEqual([0, 0]);
  });
  it("evolves a blinker oscillator into its perpendicular orientation", () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[0, -1], [0, 0], [0, 1]]));
  });
  it("handles a blinker at negative coordinates", () => {
    const next = nextGeneration([[-6, -4], [-5, -4], [-4, -4]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-5, -5], [-5, -4], [-5, -3]]));
  });
  it("tracks only relevant cells on the infinite plane when populations are far apart", () => {
    const next = nextGeneration([
      [-1, 0], [0, 0], [1, 0],
      [999999, 1000000], [1000000, 1000000], [1000001, 1000000],
    ]);
    expect(next).toHaveLength(6);
    expect(next).toEqual(expect.arrayContaining([
      [0, -1], [0, 0], [0, 1],
      [1000000, 999999], [1000000, 1000000], [1000000, 1000001],
    ]));
  });
});
