import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

const sorted = (cells: [number, number][]) => [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe("nextGeneration", () => {
  it("keeps an empty generation empty -- []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("kills a single cell -- [(0,0)] becomes []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("applies underpopulation -- [(0,1),(1,1)] becomes []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("lets a live cell with exactly 2 neighbors survive", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("lets a live cell with exactly 3 neighbors survive", () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("applies reproduction -- dead (1,1) completes the specified 2x2 block", () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);

    expect(sorted(next)).toEqual(sorted([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("applies overpopulation -- the center of the specified crowded pattern dies", () => {
    const next = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);

    expect(next).not.toContainEqual([1, 1]);
  });
  it("keeps the specified 2x2 block unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });
  it("oscillates the specified blinker for two generations, including negative coordinates", () => {
    const vertical: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const generationOne = nextGeneration(vertical);

    expect(sorted(generationOne)).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(generationOne))).toEqual(sorted(vertical));
  });
});
