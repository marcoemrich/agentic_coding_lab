import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life";

const sorted = (cells: [number, number][]) =>
  [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("returns [] for an empty generation", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] for the single live cell [(0,0)]", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] when adjacent cells [(0,1),(1,1)] each have one neighbor", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("keeps live (1,1) alive when it has exactly two live neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1]])).toContainEqual([1, 1]);
  });
  it("keeps live (1,1) alive when it has exactly three live neighbors", () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it("removes live (1,1) when it has four live neighbors", () => {
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("births dead (1,1) with three neighbors, producing [(0,0),(1,0),(0,1),(1,1)]", () => {
    expect(sorted(nextGeneration([[0, 0], [1, 0], [0, 1]]))).toEqual(
      sorted([[0, 0], [1, 0], [0, 1], [1, 1]])
    );
  });
  it("keeps block [(0,0),(1,0),(0,1),(1,1)] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("evolves blinker [(0,0),(0,1),(0,2)] to [(-1,1),(0,1),(1,1)] and back", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });
});
