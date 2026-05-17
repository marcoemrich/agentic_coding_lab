import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life";

function normalize(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function expectSameCells(actual: Cell[], expected: Cell[]) {
  expect(normalize(actual)).toEqual(normalize(expected));
}

describe("nextGeneration", () => {
  describe("Rule 1 - Underpopulation", () => {
    it("kills a live cell with no neighbors", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it("kills two adjacent live cells (each has 1 neighbor)", () => {
      expectSameCells(nextGeneration([[0, 1], [1, 1]]), []);
    });
  });

  describe("Rule 2 - Survival", () => {
    it("keeps a live cell with 2 neighbors alive", () => {
      // L-shape: (0,0), (1,0), (0,1) — (0,0) has 2 live neighbors
      const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
      // (0,0) has 2 neighbors → survives
      // (1,0) has 1 neighbor at (0,0) + (0,1) is at distance √2 - wait — neighbors are Moore (8-connected)
      // (1,0) neighbors among live: (0,0) and (0,1) — both within Moore distance → 2 neighbors → survives
      // (0,1) neighbors among live: (0,0) and (1,0) — both Moore neighbors → 2 → survives
      // Dead cell (1,1) neighbors: (0,0), (1,0), (0,1) → 3 → becomes alive
      expectSameCells(result, [[0, 0], [1, 0], [0, 1], [1, 1]]);
    });

    it("keeps a live cell with 3 neighbors alive (center of L-tromino plus one)", () => {
      // Example from prompt: ###/.../.#.  → .#./.#./...
      // Top row y=2: (0,2),(1,2),(2,2); middle row y=1: empty; bottom row y=0: (1,0)
      const gen0: Cell[] = [[0, 2], [1, 2], [2, 2], [1, 0]];
      const result = nextGeneration(gen0);
      // (1,2) neighbors: (0,2), (2,2) → 2 → survives
      // (0,2) has 1 live neighbor → dies; (2,2) has 1 → dies
      // (1,0) has 0 live neighbors → dies
      // (1,1) dead, neighbors: (0,2),(1,2),(2,2),(1,0) → 4 → stays dead
      // (0,1) dead, neighbors: (0,2),(1,2),(1,0) → 3 → becomes alive
      // (2,1) dead, neighbors: (2,2),(1,2),(1,0) → 3 → becomes alive
      // (1,3) dead, neighbors: (0,2),(1,2),(2,2) → 3 → becomes alive
      expectSameCells(result, [[1, 2], [0, 1], [2, 1], [1, 3]]);
    });
  });

  describe("Rule 3 - Overpopulation", () => {
    it("kills a live cell with 4 live neighbors", () => {
      // Center cell (1,1) surrounded by 4 cells in plus shape + itself
      // (1,1) live, neighbors: (0,1),(2,1),(1,0),(1,2) = 4 → dies from overpopulation
      const gen0: Cell[] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]];
      const result = nextGeneration(gen0);
      // Verify (1,1) is NOT in result
      const resultKeys = result.map(([x, y]) => `${x},${y}`);
      expect(resultKeys).not.toContain("1,1");
    });

    it("kills a live cell with more than 3 neighbors (5+)", () => {
      // Block + extra cell touching one corner gives the corner 4 neighbors
      // (0,0): neighbors among live = (1,0),(0,1),(1,1),(-1,1) = 4 → dies
      const gen0: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1], [-1, 1]];
      const result = nextGeneration(gen0);
      const resultKeys = result.map(([x, y]) => `${x},${y}`);
      expect(resultKeys).not.toContain("0,0");
    });
  });

  describe("Rule 4 - Reproduction", () => {
    it("brings a dead cell to life if it has exactly 3 live neighbors", () => {
      // From prompt: ##./#../... → ##./##./...
      // gen 0: (0,2),(1,2),(0,1)
      const gen0: Cell[] = [[0, 2], [1, 2], [0, 1]];
      const result = nextGeneration(gen0);
      // (1,1) dead, neighbors: (0,2),(1,2),(0,1) = 3 → becomes alive
      // (0,2) neighbors: (1,2),(0,1) = 2 → survives
      // (1,2) neighbors: (0,2),(0,1) = 2 → survives
      // (0,1) neighbors: (0,2),(1,2) = 2 → survives
      expectSameCells(result, [[0, 2], [1, 2], [0, 1], [1, 1]]);
    });

    it("does not bring dead cell to life with only 2 neighbors", () => {
      // L shape: only (1,1) qualifies for reproduction (3 neighbors)
      // Cell with exactly 2 neighbors stays dead
      const result = nextGeneration([[0, 0], [2, 0]]);
      // (1,0) dead, has 2 neighbors → stays dead
      expectSameCells(result, []);
    });

    it("does not bring dead cell with 4 live neighbors to life", () => {
      // 4 cells in a plus around (1,1): (0,1),(2,1),(1,0),(1,2)
      // (1,1) dead, has 4 live neighbors → stays dead
      const result = nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]]);
      const resultKeys = result.map(([x, y]) => `${x},${y}`);
      expect(resultKeys).not.toContain("1,1");
    });
  });

  describe("Pattern: Blinker (oscillator)", () => {
    it("vertical blinker becomes horizontal", () => {
      // Gen 0: (0,0), (0,1), (0,2) → Gen 1: (-1,1), (0,1), (1,1)
      const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
      expectSameCells(result, [[-1, 1], [0, 1], [1, 1]]);
    });

    it("horizontal blinker becomes vertical", () => {
      // Gen 0: (-1,1), (0,1), (1,1) → Gen 1: (0,0), (0,1), (0,2)
      const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
      expectSameCells(result, [[0, 0], [0, 1], [0, 2]]);
    });

    it("blinker oscillates back after 2 generations", () => {
      const gen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
      const gen2 = nextGeneration(nextGeneration(gen0));
      expectSameCells(gen2, gen0);
    });
  });

  describe("Pattern: Block (still life)", () => {
    it("block remains unchanged", () => {
      const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
      expectSameCells(nextGeneration(block), block);
    });
  });

  describe("Edge cases", () => {
    it("empty grid stays empty", () => {
      expectSameCells(nextGeneration([]), []);
    });

    it("single cell dies", () => {
      expectSameCells(nextGeneration([[0, 0]]), []);
    });

    it("handles negative coordinates", () => {
      // Blinker at large negative coordinates
      const gen0: Cell[] = [[-100, -100], [-100, -99], [-100, -98]];
      const result = nextGeneration(gen0);
      expectSameCells(result, [[-101, -99], [-100, -99], [-99, -99]]);
    });

    it("handles large coordinates", () => {
      const gen0: Cell[] = [[1000000, 1000000], [1000001, 1000000], [1000000, 1000001], [1000001, 1000001]];
      expectSameCells(nextGeneration(gen0), gen0);
    });

    it("does not duplicate cells in output", () => {
      const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
      const keys = result.map(([x, y]) => `${x},${y}`);
      expect(new Set(keys).size).toBe(keys.length);
    });
  });
});
