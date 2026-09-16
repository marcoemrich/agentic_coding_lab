import { describe, expect, it } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("nextGeneration", () => {
  it("returns [] when no cells are alive", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("returns [] when the only live cell is [0, 0] (underpopulation with zero neighbors)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("returns [] when adjacent live cells are [0, 0] and [1, 0] (underpopulation with one neighbor)", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });
  it("keeps [0, 0] alive with exactly two live neighbors at [-1, 0] and [1, 0]", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it("keeps [0, 0] alive with exactly three live neighbors at [-1, 0], [1, 0], and [0, 1]", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it("kills [0, 0] with four live neighbors (overpopulation)", () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("keeps dead [0, 0] dead when only [1, 0] and [0, 1] are alive", () => {
    expect(nextGeneration([[1, 0], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it("births dead [0, 0] when exactly [1, 0], [0, 1], and [1, 1] are alive", () => {
    expect(nextGeneration([[1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it("leaves the four-cell block [[0, 0], [1, 0], [0, 1], [1, 1]] unchanged", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);

    expect(result).toHaveLength(block.length);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("turns horizontal blinker [[-1, 0], [0, 0], [1, 0]] into vertical [[0, -1], [0, 0], [0, 1]]", () => {
    const expected: [number, number][] = [[0, -1], [0, 0], [0, 1]];
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("applies neighbor rules across negative coordinates by turning [[-2, -1], [-1, -1], [0, -1]] vertical", () => {
    const expected: [number, number][] = [[-1, -2], [-1, -1], [-1, 0]];
    const result = nextGeneration([[-2, -1], [-1, -1], [0, -1]]);

    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
  it("evolves cells around [1000000, 1000000] without allocating the infinite plane", () => {
    const expected: [number, number][] = [
      [1000000, 999999], [1000000, 1000000], [1000000, 1000001],
    ];
    const result = nextGeneration([
      [999999, 1000000], [1000000, 1000000], [1000001, 1000000],
    ]);

    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
