import { describe, it, expect } from "vitest";
import { step } from "./gameOfLife.js";

describe("Game of Life", () => {
  it("should return empty when no alive cells and steps is 0", () => {
    expect(step([], 0)).toEqual([]);
  });
  it("should return same cells when steps is 0", () => {
    expect(step([[1, 2], [3, 4]], 0)).toEqual([[1, 2], [3, 4]]);
  });
  it("should kill a lone cell after 1 step (underpopulation)", () => {
    expect(step([[0, 0]], 1)).toEqual([]);
  });
  it("should kill two isolated cells after 1 step (underpopulation)", () => {
    expect(step([[0, 0], [10, 10]], 1)).toEqual([]);
  });
  it("should keep a 2x2 block stable after 1 step", () => {
    expect(step([[0, 0], [0, 1], [1, 0], [1, 1]], 1)).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should oscillate a blinker after 1 step", () => {
    expect(step([[0, 0], [1, 0], [2, 0]], 1)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });
});
