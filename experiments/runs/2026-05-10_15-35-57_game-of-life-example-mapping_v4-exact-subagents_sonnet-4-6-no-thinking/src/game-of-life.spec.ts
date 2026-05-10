import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty grid for empty grid", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should return empty grid for single live cell (underpopulation)", () => {
    expect(nextGeneration([[true]])).toEqual([[false]]);
  });
  it("should return empty grid for two live cells (underpopulation)", () => {
    expect(nextGeneration([[true, true]])).toEqual([[false, false]]);
  });
  it("should keep a block (2x2) unchanged (still life)", () => {
    expect(nextGeneration([[true, true], [true, true]])).toEqual([[true, true], [true, true]]);
  });
  it("should reproduce a dead cell with exactly 3 live neighbors", () => {
    expect(nextGeneration([[true, true], [true, false]])).toEqual([[true, true], [true, true]]);
  });
  it("should transform a vertical blinker to a horizontal blinker", () => {
    const verticalBlinker = [
      [false, false, false],
      [true,  true,  true],
      [false, false, false],
    ];
    const horizontalBlinker = [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ];
    expect(nextGeneration(verticalBlinker)).toEqual(horizontalBlinker);
  });
  it("should transform a horizontal blinker back to a vertical blinker", () => {
    const horizontalBlinker = [
      [false, true,  false],
      [false, true,  false],
      [false, true,  false],
    ];
    const verticalBlinker = [
      [false, false, false],
      [true,  true,  true],
      [false, false, false],
    ];
    expect(nextGeneration(horizontalBlinker)).toEqual(verticalBlinker);
  });
});
