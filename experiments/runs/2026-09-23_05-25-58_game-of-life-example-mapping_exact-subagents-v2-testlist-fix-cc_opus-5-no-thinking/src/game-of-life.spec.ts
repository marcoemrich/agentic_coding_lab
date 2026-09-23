import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  const sort = (cells: Cell[]) =>
    [...cells].sort((a, b) => a[1] - b[1] || a[0] - b[0]);

  it("should return an empty array for an empty input — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("should kill a single live cell with 0 neighbors (underpopulation) — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("should kill two adjacent live cells that each have 1 neighbor (underpopulation) — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it("should let a live cell with exactly 2 neighbors survive (survival) — [(0,0), (1,0), (2,0)] → [(1,-1), (1,0), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(sort(result)).toEqual([[1, -1], [1, 0], [1, 1]]);
  });

  it("should let a live cell with exactly 3 neighbors survive (survival) — block corner [(0,0), (1,0), (0,1), (1,1)] each cell has 3 neighbors and all survive", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sort(result)).toEqual(sort([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should kill a live cell with 4 neighbors (overpopulation) — plus shape [(1,0), (0,1), (1,1), (2,1), (1,2)]: the centre (1,1) has 4 neighbors and dies → [(0,0), (1,0), (2,0), (0,1), (2,1), (0,2), (1,2), (2,2)]", () => {
    const result = nextGeneration([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]);
    expect(sort(result)).toEqual(
      sort([[0, 0], [1, 0], [2, 0], [0, 1], [2, 1], [0, 2], [1, 2], [2, 2]]),
    );
  });

  it("should bring a dead cell with exactly 3 live neighbors to life (reproduction) — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(sort(result)).toEqual(sort([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should keep a block unchanged (still life) — [(0,0), (1,0), (0,1), (1,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(sort(result)).toEqual(sort([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });

  it("should turn a vertical blinker into a horizontal one, using negative coordinates — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(sort(result)).toEqual(sort([[-1, 1], [0, 1], [1, 1]]));
  });

  it("should turn a horizontal blinker back into a vertical one after a second generation — [(-1,1), (0,1), (1,1)] → [(0,0), (0,1), (0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(sort(result)).toEqual(sort([[0, 0], [0, 1], [0, 2]]));
  });

  it("should handle patterns located entirely at negative coordinates — block at [(-2,-2), (-1,-2), (-2,-1), (-1,-1)] stays unchanged", () => {
    const result = nextGeneration([[-2, -2], [-1, -2], [-2, -1], [-1, -1]]);
    expect(sort(result)).toEqual(sort([[-2, -2], [-1, -2], [-2, -1], [-1, -1]]));
  });
});
