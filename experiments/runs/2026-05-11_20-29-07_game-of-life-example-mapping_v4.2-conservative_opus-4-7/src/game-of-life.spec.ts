import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty for empty input", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell (underpopulation)", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells (underpopulation, rule 1)", () => {
    expect(nextGeneration([[0, 0], [0, 1]])).toEqual([]);
  });
  it("should keep a block stable (still life)", () => {
    const block: Array<[number, number]> = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(new Set(result.map(c => `${c[0]},${c[1]}`))).toEqual(
      new Set(block.map(c => `${c[0]},${c[1]}`))
    );
  });
  it("should let a live cell with 3 neighbors survive (rule 2)", () => {
    // Three cells in a row plus one cell two rows down.
    // The center cell (1,1) has 3 live neighbors (the two in its row at (0,1) and (2,1), and (1,3)?)
    // Actually: three cells in a row at y=1: (0,1), (1,1), (2,1), plus (1,3) two rows down.
    // Wait — "two rows down" from the row. Let's interpret as (1,3).
    // Neighbors of (1,1): (0,1) and (2,1) are live = 2 neighbors. (1,3) is not adjacent.
    // Let me reconsider: three in a row at y=0: (0,0),(1,0),(2,0), plus (1,2) two rows down.
    // Neighbors of (1,0): (0,0),(2,0) -> 2. Still not 3.
    // The spec says center cell has 3 live neighbors, so the configuration must have it.
    // Try: cells = [[0,0],[1,0],[2,0],[1,2]]. Center cell (1,1) is dead, but it has neighbors
    // (0,0),(1,0),(2,0),(1,2) -> 4 neighbors. Not the right interpretation.
    // Reading again: "live cell with 3 neighbors survive". The center (1,1) should be live with 3 neighbors.
    // Configuration: [[0,1],[1,1],[2,1],[1,3]]: (1,1) is live. Its neighbors are (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2).
    // Live neighbors: (0,1),(2,1) = 2. Not 3.
    // Configuration: [[0,1],[1,1],[2,1],[1,2]]: (1,1) neighbors include (0,1),(2,1),(1,2) = 3 live neighbors. Yes!
    const cells: Array<[number, number]> = [[0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should kill a live cell with more than 3 neighbors (rule 3, overpopulation)", () => {
    // Gen 0: 3x3 grid all alive except center (1,1)... wait, spec says center is alive
    // Gen 0:       Gen 1:
    //  ###          #.#
    //  .#.    →     #.#
    //  ###          #.#
    // Reading the spec: row 0: ###, row 1: .#., row 2: ###
    // Live cells: (0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)
    // Center (1,1) has 4 live neighbors: (0,0),(1,0),(2,0),(0,2)... wait let me count
    // Neighbors of (1,1): (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
    // Live: (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6 live neighbors. Dies from overpopulation.
    const cells: Array<[number, number]> = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2]
    ];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(false);
  });
  it("should bring a dead cell with exactly 3 neighbors to life (rule 4, reproduction)", () => {
    // Gen 0:       Gen 1:
    //  ##.          ##.
    //  #..    →     ##.
    //  ...          ...
    // Live cells Gen 0: (0,0), (1,0), (0,1).
    // Dead cell (1,1) has 3 live neighbors: (0,0), (1,0), (0,1) → becomes alive.
    const cells: Array<[number, number]> = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(cells);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    expect(resultSet.has("1,1")).toBe(true);
  });
  it("should oscillate a vertical blinker to a horizontal blinker", () => {
    // Gen 0: vertical blinker at (0,0), (0,1), (0,2)
    // Gen 1: horizontal blinker at (-1,1), (0,1), (1,1)
    const verticalBlinker: Array<[number, number]> = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(verticalBlinker);
    const resultSet = new Set(result.map(c => `${c[0]},${c[1]}`));
    const expectedSet = new Set(["-1,1", "0,1", "1,1"]);
    expect(resultSet).toEqual(expectedSet);
  });
});
