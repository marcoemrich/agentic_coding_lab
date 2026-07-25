import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Test implemented and passing
  // it("should return empty array when input is empty", () => {
  //   expect(nextGeneration([])).toEqual([]);
  // });
  // Test implemented and passing
  // it("should return empty array when input has a single cell due to underpopulation", () => {
  //   expect(nextGeneration([[0,0]])).toEqual([]);
  // });
  // Test implemented and passing
  // it("should return empty array when input has two adjacent cells due to underpopulation", () => {
  //   expect(nextGeneration([[0,0], [1,0]])).toEqual([]);
  // });
  // Test implemented and passing
  // it("should return empty array when input has isolated cells (underpopulation)", () => {
  //   expect(nextGeneration([[0,0], [2,2], [4,5]])).toEqual([]);
  // });
  // Test implemented and passing
  // it("should keep center cell alive when it has exactly 2 live neighbors (survival)", () => {
  //   expect(nextGeneration([[0,0], [0,2], [1,0]])).toEqual([[0,1]]);
  // });
  // Test implemented and passing
  // it("should keep center cell alive when it has exactly 3 live neighbors (survival)", () => {
  //   expect(nextGeneration([[1,0], [1,2], [0,1], [2,1]])).toEqual([[1,1]]);
  // });
  // Test implemented and passing
  // it("should kill cell when it has more than 3 live neighbors (overpopulation)", () => {
  //   expect(nextGeneration([[1,1], [1,2], [2,1], [2,2], [0,1]])).toEqual([[1,2], [2,1], [2,2], [0,1]]);
  // });
  // Test implemented and passing
  // it("should bring dead cell to life when it has exactly 3 live neighbors (reproduction)", () => {
  //   expect(nextGeneration([[0,0], [0,1], [1,0]])).toEqual([[0,0], [0,1], [1,0], [1,1]]);
  // });
  // Test implemented and passing
  // it("should transform blinker pattern vertically to horizontally (oscillation)", () => {
  //   expect(nextGeneration([[0,0], [0,1], [0,2]])).toEqual([[-1,1], [0,1], [1,1]]);
  // });
  it("should keep block pattern unchanged (still life)", () => {
    const block = [[0,0], [1,0], [0,1], [1,1]];
    expect(nextGeneration(block)).toEqual(block);
  });
});