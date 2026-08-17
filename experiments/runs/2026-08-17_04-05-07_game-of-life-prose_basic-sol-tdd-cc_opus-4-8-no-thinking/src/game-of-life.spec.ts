import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

type Cell = [number, number];

// Helper: order-independent comparison of cell sets.
function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty -- [] -> []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("single live cell dies of underpopulation (0 neighbors) -- [[0,0]] -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("live cell with exactly one live neighbor dies of underpopulation -- [[0,0],[1,0]] -> []", () => {
    expect(nextGeneration([[0, 0], [1, 0]])).toEqual([]);
  });

  it("live cell with two live neighbors survives -- middle cell of a horizontal triple stays alive", () => {
    const result = nextGeneration([[-1, 0], [0, 0], [1, 0]]);
    expect(result).toContainEqual([0, 0]);
  });

  it("live cell with three live neighbors survives -- cell with exactly 3 live neighbors stays alive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toContainEqual([0, 0]);
  });

  it("live cell with four live neighbors dies of overpopulation -- center of a plus shape dies", () => {
    const result = nextGeneration([[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]);
    expect(result).not.toContainEqual([0, 0]);
  });

  it("dead cell with exactly three live neighbors becomes alive (reproduction)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });

  it("dead cell with two live neighbors stays dead -- no reproduction with only 2", () => {
    const result = nextGeneration([[0, 0], [1, 0]]);
    expect(result).not.toContainEqual([0, 1]);
  });

  it("blinker oscillates -- vertical triple [[0,-1],[0,0],[0,1]] -> horizontal triple [[-1,0],[0,0],[1,0]]", () => {
    const result = nextGeneration([[0, -1], [0, 0], [0, 1]]);
    expect(sortCells(result)).toEqual(sortCells([[-1, 0], [0, 0], [1, 0]]));
  });

  it("block is a still life -- 2x2 square [[0,0],[1,0],[0,1],[1,1]] stays unchanged", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(sortCells(result)).toEqual(sortCells(block));
  });

  it("handles negative coordinates -- blinker centered at negative coords oscillates correctly", () => {
    const result = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    expect(sortCells(result)).toEqual(
      sortCells([[-6, -5], [-5, -5], [-4, -5]]),
    );
  });
});
