import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("single live cell dies -- [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("underpopulation: two adjacent live cells die -- [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("survival: live cell with 3 neighbors lives on -- center (1,1) survives", () => {
    // Gen 0: ### / ... / .#. — center (1,1) has 3 live neighbors → survives
    const gen0: [number, number][] = [[0, 1], [1, 1], [2, 1], [1, -1]];
    const result = nextGeneration(gen0);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("overpopulation: live cell with >3 neighbors dies -- center (1,1) dies", () => {
    // Gen 0: ### / .#. / ### — center (1,1) has >3 live neighbors → dies
    const gen0: [number, number][] = [
      [0, 2], [1, 2], [2, 2],
      [1, 1],
      [0, 0], [1, 0], [2, 0],
    ];
    const result = nextGeneration(gen0);
    expect(result.some(([x, y]) => x === 1 && y === 1)).toBe(false);
  });
  it("reproduction: dead cell with exactly 3 neighbors becomes alive -- (1,0) born", () => {
    // Gen 0: ##. / #.. / ...  → Gen 1: ##. / ##. / ...
    const gen0: [number, number][] = [[0, 1], [1, 1], [0, 0]];
    const result = nextGeneration(gen0);
    expect(result).toEqual(
      expect.arrayContaining([[0, 1], [1, 1], [0, 0], [1, 0]])
    );
    expect(result).toHaveLength(4);
  });
  it("block still life remains unchanged -- [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toEqual(expect.arrayContaining(block));
    expect(result).toHaveLength(4);
  });
  it("blinker oscillator Gen 0 → Gen 1 -- [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it("blinker oscillator Gen 1 → Gen 2 -- [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(gen1);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
  });
});
