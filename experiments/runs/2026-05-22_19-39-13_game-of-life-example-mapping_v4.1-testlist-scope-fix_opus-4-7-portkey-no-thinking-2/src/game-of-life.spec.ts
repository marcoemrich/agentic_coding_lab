import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  // Simplest: empty input
  it("returns [] for an empty input (no living cells)", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  // Single cell — underpopulation (0 neighbors)
  it("single cell [(0,0)] dies from underpopulation -> []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  // Rule 1: Underpopulation with two adjacent cells (each has 1 neighbor)
  it("Rule 1 underpopulation: [(0,1), (1,1)] both die (each has 1 neighbor) -> []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 4: Reproduction — dead cell with exactly 3 live neighbors becomes alive
  // From spec: ##. / #.. / ... — cells [(0,0), (1,0), (0,1)]; dead (1,1) has 3 neighbors -> alive
  it("Rule 4 reproduction: dead cell (1,1) with exactly 3 live neighbors becomes alive", () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  // Rule 2: Survival — live cell with 2 or 3 neighbors lives on
  // From spec: ### / ... / .#. — center (1,1) has 3 live neighbors and survives
  it("Rule 2 survival: center cell (1,1) with 3 live neighbors survives to next generation", () => {
    // Gen 0: ### / .#. (live cells: (0,0), (1,0), (2,0), (1,1))
    // (1,1) has 3 live neighbors: (0,0), (1,0), (2,0) -> survives
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });

  // Rule 3: Overpopulation — live cell with > 3 neighbors dies
  // From spec: ### / .#. / ### — center (1,1) has 4 neighbors -> dies
  it("Rule 3 overpopulation: center cell (1,1) with 4 live neighbors dies", () => {
    // Gen 0: ### / .#. / ### (live cells: (0,0), (1,0), (2,0), (1,1), (0,2), (1,2), (2,2))
    // (1,1) has 4 live neighbors: (0,0), (1,0), (2,0), (1,2) ... wait let me recount
    // Neighbors of (1,1): (0,0), (1,0), (2,0), (0,1), (2,1), (0,2), (1,2), (2,2)
    // Live among them: (0,0), (1,0), (2,0), (0,2), (1,2), (2,2) = 6 live neighbors
    // Actually with pattern ### / .#. / ### center has 6 neighbors (not 4)
    // Let me use pattern with exactly 4 neighbors:
    // ### / .#. / #.. -> (1,1) neighbors: (0,0)L, (1,0)L, (2,0)L, (0,2)L = 4 -> dies
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });

  // Block (still life) — every live cell has exactly 3 neighbors, no dead cell gains 3
  it("Block still life [(0,0), (1,0), (0,1), (1,1)] remains unchanged", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(result).toHaveLength(4);
  });

  // Blinker (oscillator) — vertical to horizontal, also exercises negative coordinates in output
  it("Blinker oscillator: vertical [(0,0), (0,1), (0,2)] becomes horizontal [(-1,1), (0,1), (1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
});
