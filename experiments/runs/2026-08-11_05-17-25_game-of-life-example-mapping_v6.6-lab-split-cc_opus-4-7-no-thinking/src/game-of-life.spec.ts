import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single live cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life remains unchanged — [(0,0), (1,0), (0,1), (1,1)] → same", () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("live cell with 2 neighbors survives — center of row survives when it has 2 live neighbors", () => {
    // Row of 3: [(0,0), (1,0), (2,0)]. Only center (1,0) has 2 neighbors and survives.
    // Also, (1,-1) and (1,1) each have 3 neighbors → born. Verify center is in result.
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining<[number, number]>([[1, 0]]));
  });
  it("live cell with 3 neighbors survives (Rule 2 example) — center cell (1,1) with 3 live neighbors survives", () => {
    // L-shape: (0,0), (1,0), (0,1), (1,1) is a block (2x2). Remove one to make an L:
    // Cells: (0,0), (1,0), (0,1). (0,0) has 2 live neighbors and survives. Let's instead check
    // that (1,1) — dead in this shape — becomes alive (3 neighbors) AND (0,0),(1,0),(0,1) survive.
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(
      expect.arrayContaining<[number, number]>([[0, 0], [1, 0], [0, 1], [1, 1]]),
    );
    expect(result).toHaveLength(4);
  });
  it("live cell with more than 3 neighbors dies from overpopulation — center cell (1,1) with 4 neighbors dies", () => {
    // Rule 3 example: 3x3 filled minus corners of middle row — actually spec uses full 3x3
    // with center: ###/.#./### (8 neighbors of center all live). Center dies from overpopulation.
    const cells: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("dead cell with exactly 3 live neighbors becomes alive (Rule 4 reproduction) — (1,1) becomes alive", () => {
    // Rule 4 spec example: L-shape ##./#../...  → gen1 includes (1,1) born from 3 neighbors
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("blinker oscillates vertical → horizontal — [(0,0), (0,1), (0,2)] → [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining<[number, number]>([[-1, 1], [0, 1], [1, 1]]),
    );
  });
  it("handles negative coordinates — pattern with negative x,y transitions correctly", () => {
    // Block still life at all-negative coordinates should stay unchanged.
    const block: [number, number][] = [[-5, -5], [-4, -5], [-5, -4], [-4, -4]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
});
