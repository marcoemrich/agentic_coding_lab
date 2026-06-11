// game-of-life.spec.ts
import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should return empty array for two adjacent cells, each with one neighbor (underpopulation)", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should keep alive a cell with three live neighbors (survival)", () => {
    // ###
    // .#.   the focal cell (1,1) has 3 live neighbors -> it survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it("should kill a live cell with more than three live neighbors (overpopulation)", () => {
    // ###
    // .#.   the focal cell (1,1) has 4 live neighbors -> it dies
    // ###
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it("should bring to life a dead cell with exactly three live neighbors (reproduction)", () => {
    // ##.      ##.
    // #..  ->  ##.   the dead cell (1,1) has 3 live neighbors -> it is born
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it("should keep a block still life unchanged", () => {
    // ##      ##
    // ##  ->  ##   every block cell has exactly 3 live neighbors -> all survive, no births
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it("should rotate a vertical blinker into a horizontal blinker including negative coordinates", () => {
    // .#.      ...
    // .#.  ->  ###   (0,1) survives with 2 neighbors; (-1,1) and (1,1) are born
    // .#.      ...
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
});
