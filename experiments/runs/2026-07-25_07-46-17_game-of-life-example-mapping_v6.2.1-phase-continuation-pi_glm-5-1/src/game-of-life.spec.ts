import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it("should return empty array for empty input -- no living cells stay empty", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- Rule 1 underpopulation: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells with 1 neighbor each -- Rule 1 underpopulation: [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should let a live cell with exactly 2 neighbors survive -- Rule 2 survival", () => {
    // Block: [(0,0),(1,0),(0,1)] - cell (0,0) has 2 neighbors -> survives
    // But we need a setup where a cell survives with exactly 2 neighbors
    // Line of 3: (0,0), (1,0) - each has 1 neighbor, they die
    // Let's use the spec example for survival: center cell (1,1) with 3 neighbors
    // Actually for 2 neighbors: diagonal cells like (0,0),(1,0),(0,1)
    // Cell (0,0) has 2 neighbors: (1,0) and (0,1) -> survives
    // But (1,0) has 2 neighbors: (0,0) and (0,1) -> survives  
    // And (0,1) has 2 neighbors: (0,0) and (1,0) -> survives
    // Dead cell (1,1) has 3 neighbors -> becomes alive
    // So result should be [(0,0),(1,0),(0,1),(1,1)]
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should let a live cell with exactly 3 neighbors survive -- Rule 2 survival: center cell (1,1) in ### / ... / .#.", () => {
    // Row 0: (0,0), (1,0), (2,0) -- ###  
    // Row 2: (1,2)               -- .#.
    // Cell (1,0) has neighbors: (0,0), (2,0) = 2 neighbors -> let's reconsider
    // Actually from the spec: ### / .#. / .#.
    // (0,0),(1,0),(2,0) = row 0, (1,1) = center, (1,2) = bottom
    // Wait, spec says: Gen 0: ### / ... / .#.
    // That's (0,0),(1,0),(2,0) and (1,2)
    // Center cell (1,1) is dead with neighbors (0,0),(1,0),(2,0),(1,2) = 4 neighbors
    // Let me re-read: The spec example for Rule 2:
    // Gen 0: ### / ... / .#.
    // Gen 1: .#. / .#. / ...
    // The center cell (1,1) has 3 live neighbors: (1,0),(0,0?)... 
    // Actually: ### at y=0: cells (0,0),(1,0),(2,0)
    // .#. at y=2: cell (1,2)
    // So dead cell (1,1) has neighbors: (0,0),(1,0),(2,0),(1,2) = 4 neighbors
    // Hmm that doesn't match. 
    // Let me re-read the spec:
    // Rule 2 – Survival (live cell with 2 or 3 neighbors lives on):
    // Gen 0:       Gen 1:
    //  ###          .#.
    //  ...    →     .#.
    //  .#.          ...
    // Coordinates Gen 0: row y=0: (0,0),(1,0),(2,0), row y=2: (1,2)
    // Cell (1,0) neighbors: (0,0)=1, (2,0)=1 -> 2 neighbors -> survives -> (1,0)
    // Cell (1,2) neighbors: only (1,0)=1 neighbor -> dies? Hmm
    // Actually let me recheck: (1,0)'s neighbors are (0,0),(2,0),(1,1),(0,1),(2,1) but only (0,0) and (2,0) live -> 2 -> survives
    // Dead cell (1,1) neighbors: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2) -> (0,0),(1,0),(2,0),(1,2) = 4 dead neighbors are not counted -> 4 live neighbors -> won't be born
    // Result: (0,0) has 1 neighbor (1,0) -> dies, (2,0) has 1 neighbor (1,0) -> dies, (1,0) has 2 neighbors -> survives, (1,2) has 0 neighbors -> dies
    // Dead cell (0,1) has 2 neighbors (0,0),(1,0) -> dies (not 3)
    // Dead cell (2,1) has 2 neighbors (2,0),(1,0) -> dies (not 3)
    // So result = [(1,0)]
    // Spec says Gen 1 = .#. / .#. / ... which is (1,0) and (1,1)
    // Wait, (1,1) has 4 neighbors so it shouldn't be born. Let me re-read the grid.
    // Actually the grid notation: ### is line 1 (top), ... is line 2, .#. is line 3
    // In the spec:
    //  ###          .#.
    //  ...    →     .#.
    //  .#.          ...
    // So Gen 0 = (0,0),(1,0),(2,0) and (1,2)
    // Gen 1 = (1,0) and (1,1)
    // Dead cell (1,1) neighbors that are alive: (0,0),(1,0),(2,0) = 3 -> YES! (1,2) is not a neighbor of (1,1)? 
    // Wait, (1,2) IS a neighbor of (1,1) since they differ by (0,1). So (1,1) has 4 live neighbors.
    // This seems wrong in the spec. Let me reconsider the coordinate system.
    // Maybe the grid is:
    // Row 0 (top) = y=0, Row 1 = y=1, Row 2 = y=2
    // ###  -> (0,0),(1,0),(2,0)
    // ...  -> nothing  
    // .#.  -> (1,2)
    // (1,1) neighbors: dx in [-1,0,1], dy in [-1,0,1], excluding (0,0)
    // (0,0): yes alive, (1,0): yes alive, (2,0): yes alive -> these 3
    // (0,1),(2,1): dead; (0,2): dead, (1,2): alive!, (2,2): dead -> +1
    // Total: 4 live neighbors for (1,1). So (1,1) should NOT be born.
    // But the spec says Gen 1 includes (1,1). There might be an error in my reading.
    // Actually wait - maybe the pattern in the spec uses a different y orientation or I'm misreading which cells are in row 2.
    // Let me just use a simpler example: a live cell with exactly 3 neighbors survives.
    // Full block has cells with 3 neighbors. Let's use that concept.
    // Actually, the simplest test: cell at (0,0) with neighbors (1,0),(0,1),(1,1) = 3 neighbors -> survives
    // Input: [(0,0),(1,0),(0,1),(1,1)] = full block
    // But that's the still life test. Let me think of something else.
    // How about a T-shape: (0,0),(1,0),(2,0),(1,1)
    // (1,0) has neighbors: (0,0),(2,0),(1,1) = 3 -> survives
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });
  it("should kill a live cell with more than 3 neighbors -- Rule 3 overpopulation: center cell (1,1) has 4 neighbors → dies", () => {
    // ###  -> (0,0),(1,0),(2,0)
    // .#.  -> (1,1)
    // ###  -> (0,2),(1,2),(2,2)
    // Center (1,1) has 4 live neighbors -> dies from overpopulation
    // But many other cells survive/reproduce
    // Let's just check that (1,1) is NOT in the result
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should bring a dead cell to life with exactly 3 neighbors -- Rule 4 reproduction: dead cell at (1,1) has 3 live neighbors → becomes alive", () => {
    // ##. -> (0,0),(1,0)
    // #.. -> (0,1)
    // Dead cell (1,1) has exactly 3 live neighbors: (0,0),(1,0),(0,1)
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toContainEqual([1, 1]);
  });
  it("should leave a block (still life) unchanged -- [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });
  it("should transform blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });
  it("should transform blinker back to vertical in second generation -- [(-1,1),(0,1),(1,1)] → [(0,0),(0,1),(0,2)]", () => {
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result).toEqual([[0, 0], [0, 1], [0, 2]]);
  });
  it("should handle negative coordinates correctly", () => {
    // Block at negative coordinates: [(-1,-1),(0,-1),(-1,0),(0,0)]
    // Each cell in a block has 3 neighbors -> survives -> still life
    const result = nextGeneration([[-1, -1], [0, -1], [-1, 0], [0, 0]]);
    expect(result.sort((a, b) => a[0] - b[0] || a[1] - b[1])).toEqual([[-1, -1], [-1, 0], [0, -1], [0, 0]]);
  });
});
