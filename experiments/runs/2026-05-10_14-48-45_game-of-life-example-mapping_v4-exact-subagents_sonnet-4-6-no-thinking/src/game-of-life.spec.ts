import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[true]])).toEqual([[]]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[true, true]])).toEqual([[false, false]]);
  });
  it("should keep a block of four cells alive (still life)", () => {
    expect(
      nextGeneration([
        [true, true],
        [true, true],
      ])
    ).toEqual([
      [true, true],
      [true, true],
    ]);
  });
  it("should kill a live cell with more than 3 neighbors (overpopulation)", () => {
    expect(
      nextGeneration([
        [false, true, false],
        [true, true, true],
        [false, true, false],
      ])
    ).toEqual([
      [true, true, true],
      [true, false, true],
      [true, true, true],
    ]);
  });
  it("should bring a dead cell with exactly 3 neighbors alive (reproduction)", () => {
    expect(
      nextGeneration([
        [true, true, false],
        [true, false, false],
        [false, false, false],
      ])
    ).toEqual([
      [true, true, false],
      [true, true, false],
      [false, false, false],
    ]);
  });
  it("should transform a vertical blinker to a horizontal blinker (oscillator)", () => {
    expect(
      nextGeneration([
        [false, true, false],
        [false, true, false],
        [false, true, false],
      ])
    ).toEqual([
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ]);
  });
});
