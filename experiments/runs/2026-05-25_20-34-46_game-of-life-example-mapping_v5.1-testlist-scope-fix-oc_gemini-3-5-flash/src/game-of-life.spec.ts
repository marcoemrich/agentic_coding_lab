import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life", () => {
  it("should return empty grid when input is empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should die when single cell exists -- [(0,0)] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should die due to underpopulation -- [(0,1), (1,1)] -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should survive when center cell has 3 live neighbors -- [(0,1), (1,1), (2,1), (1,0)] -> (1,1) survives", () => {
    const input: [number, number][] = [[0, 1], [1, 1], [2, 1], [1, 0]];
    const result = nextGeneration(input);
    expect(result).toContainEqual([1, 1]);
  });
  it("should die due to overpopulation -- center has 4 neighbors -> center dies", () => {
    const input: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
    const result = nextGeneration(input);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should reproduce when dead cell has exactly 3 live neighbors -- [(0,1), (1,1), (0,0)] -> (1,1) survives and (1,0) reproduces", () => {
    const input: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(input);
    // (1,0) has neighbors: (0,0), (0,1), (1,1) -> exactly 3. So (1,0) must become alive.
    expect(result).toContainEqual([1, 0]);
  });
  it("should oscillate blinker pattern -- [(0,0), (0,1), (0,2)] -> [(-1,1), (0,1), (1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const gen1 = nextGeneration(gen0);
    expect(gen1).toHaveLength(3);
    expect(gen1).toContainEqual([-1, 1]);
    expect(gen1).toContainEqual([0, 1]);
    expect(gen1).toContainEqual([1, 1]);
  });
  it("should keep block still life unchanged -- [(0,0), (1,0), (0,1), (1,1)] -> unchanged", () => {
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result).toHaveLength(4);
    expect(result).toContainEqual([0, 0]);
    expect(result).toContainEqual([1, 0]);
    expect(result).toContainEqual([0, 1]);
    expect(result).toContainEqual([1, 1]);
  });
});
