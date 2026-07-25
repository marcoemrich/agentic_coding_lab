import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  // Rule 1 – Underpopulation
  it("should produce empty grid from empty input -- [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("should kill a single live cell with 0 neighbors -- Rule 1 underpopulation: [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("should kill two adjacent live cells each with 1 neighbor -- Rule 1 underpopulation: [(0,1),(1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  // Rule 2 – Survival
  it("should keep a live cell alive with 2 neighbors -- Rule 2 survival", () => {
    // Three cells in an L-shape: each live cell has 2 neighbors -> all survive
    // (0,0) neighbors: (1,0), (0,1) = 2 -> survives
    // (1,0) neighbors: (0,0), (0,1) = 2 -> survives
    // (0,1) neighbors: (0,0), (1,0) = 2 -> survives
    // (1,1) neighbors: (0,0), (1,0), (0,1) = 3 -> reproduction
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });
  it("should keep a live cell alive with 3 neighbors -- Rule 2 survival", () => {
    // Block pattern: (0,0),(1,0),(0,1),(1,1) - each cell has 3 neighbors -> all survive
    // Block is a still life so result is unchanged
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(input)).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  // Rule 3 – Overpopulation
  it("should kill a live cell with 4 neighbors -- Rule 3 overpopulation", () => {
    // Cross/plus pattern from spec:
    // ###    (0,1),(1,1),(2,1)
    // .#. +   (1,0),(1,2)
    // ###    (0,1) is already listed
    // Full cells: (0,1),(1,1),(2,1),(1,0),(1,2) + corners (0,0),(2,0),(0,2),(2,2)
    // Actually spec example for Rule 3:
    // ###    -> (0,1),(1,1),(2,1)
    // .#.    -> (1,0), (1,2)  -- wait, re-read spec
    // Spec Rule 3: ### / .#. / ### with center (1,1) having 4 neighbors
    // Top row: (0,1),(1,1),(2,1)
    // Middle:  (1,0),  .  ,(1,2)
    // Wait, let me re-read the coordinate system from spec.
    // The spec uses ### / .#. / ### where center (1,1) has 4 neighbors
    // In the spec's coordinate system:
    // Row y=2 (top): ### at (0,2),(1,2),(2,2)
    // Row y=1 (mid): #.# at (0,1),(2,1)
    // Row y=0 (bot): ### at (0,0),(1,0),(2,0)
    // Wait that's not right either. Let me use the spec exactly:
    // ###
    // .#.
    // ###
    // The center cell (1,1) is alive, and it has 4 live neighbors.
    // So all live cells: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2) -- all except center?? No.
    // Actually the pattern is:
    // Row 2: # # #  -> (0,2),(1,2),(2,2)
    // Row 1: . # .  -> (1,1) -- wait no it's #.# 
    // Hmm the spec says "center cell (1,1) has 4 live neighbors -> dies"
    // So (1,1) is alive, and has 4 neighbors. Pattern:
    // y=1: (0,1),(1,1),(2,1)
    // y=0: (1,0)
    // y=2: (1,2)
    // That gives (1,1) neighbors: (0,1),(2,1),(1,0),(1,2) = 4
    expect(nextGeneration([[0, 1], [1, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });

  // Rule 4 – Reproduction
  it("should bring a dead cell to life with exactly 3 neighbors -- Rule 4 reproduction", () => {
    // Three cells forming an L: (0,0),(1,0),(0,1)
    // Dead cell (1,1) has 3 live neighbors: (0,0) diagonal, (1,0), (0,1) -> becomes alive
    // Live cells:
    // (0,0) has 2 neighbors -> survives
    // (1,0) has 2 neighbors -> survives
    // (0,1) has 2 neighbors -> survives
    // (1,1) reproduced
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]]);
  });

  // Pattern examples from spec
  it("should handle the blinker oscillator Gen 0 → Gen 1", () => {
    // Vertical line: [(0,0),(0,1),(0,2)]
    // → Horizontal line: [(-1,1),(0,1),(1,1)]
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result.sort()).toEqual([[-1, 1], [0, 1], [1, 1]].sort());
  });
  it("should handle the blinker oscillator Gen 1 → Gen 2", () => {
    // Horizontal line: [(-1,1),(0,1),(1,1)]
    // → Vertical line: [(0,0),(0,1),(0,2)]
    const result = nextGeneration([[-1, 1], [0, 1], [1, 1]]);
    expect(result.sort()).toEqual([[0, 0], [0, 1], [0, 2]].sort());
  });
  it("should handle the block still life", () => {
    // Block: [(0,0),(1,0),(0,1),(1,1)] → unchanged
    const input: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(input);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });

  // Spec coordinate examples
  it("should handle Rule 1 example: [(0,1),(1,1)] → []", () => {
    // Spec example: two cells side by side, each has 1 neighbor -> both die
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("should handle Rule 3 example: center cell with 4 neighbors dies", () => {
    // From spec: ### / .#. / ### -> center (1,1) has 4 neighbors -> dies
    // All live cells: (0,0),(1,0),(2,0),(0,1),(1,1),(2,1),(0,2),(1,2),(2,2)
    // Wait, spec shows:
    // Gen 0:        Gen 1:
    //  ###           #.#
    //  .#.     →     #.#
    //  ###           #.#
    // So pattern is: 
    // Row y=2: (0,2),(1,2),(2,2)
    // Row y=1: (1,1) -- NO wait: .#. means dots are dead
    // Actually re-reading: the #'s are:
    // Row y=2: (0,2),(1,2),(2,2) -- ### means all 3 alive  
    // Row y=1: (0,1),(2,1) -- .#. means only middle alive? No!
    // Hmm the spec says center (1,1) has 4 live neighbors
    // Let me re-read: the '.' represents dead cells
    // ### -> (0,2),(1,2),(2,2)  NO
    // Actually the pattern is drawn as a 3x3 grid where # = alive, . = dead
    // If the grid shows:
    //   ###     row2: (0,2),(1,2),(2,2)  -- all alive
    //   .#.     row1: (1,1)               -- only center alive
    //   ###     row0: (0,0),(1,0),(2,0)  -- all alive
    // Wait but that gives (1,1) 4 neighbors: (0,1)? No (0,1) is dead. 
    // (1,1) neighbors: (0,2),(1,2),(2,2),(0,0),(1,0),(2,0) = wait some are not adjacent
    // (1,1) adjacent cells: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
    // Live neighbors of (1,1): exclude (0,1) and (2,1) which are dead
    // Live: (0,0),(1,0),(2,0),(0,2),(1,2),(2,2) = 6?? That's wrong
    // 
    // Wait I'm confusing myself. The .#. row means positions (0,1) and (2,1) are DEAD.
    // But (1,1) IS alive (the # in the middle).
    // So live cells: (0,2),(1,2),(2,2),(1,1),(0,0),(1,0),(2,0) = 7 cells
    // (1,1) live neighbors = all 8 adj - dead ones = 8 - 2 = 6 neighbors? No that's even more.
    // Hmm, I think the spec is using the pattern differently.
    // 
    // Re-reading spec: Overpopulation example shows
    // Gen 0:    Gen 1:
    //  ###       #.#
    //  .#.  →    #.#
    //  ###       #.#
    // With "Center cell (1,1) has 4 live neighbors → dies"
    // 
    // So the Gen 0 pattern has: top row all alive, middle row only center alive, bottom row all alive.
    // But (1,1) has neighbors: (0,0),(1,0),(2,0),(0,1),(2,1),(0,2),(1,2),(2,2)
    // Dead: (0,1) and (2,1) -> so 6 live neighbors, not 4
    // 
    // This doesn't match. The spec must mean a different coordinate mapping.
    // Perhaps the coordinate system in the spec is different from what I assumed.
    // 
    // Actually, maybe the center cell (1,1) has 4 neighbors means the 4 ORTHOGONAL neighbors
    // are alive: (0,1),(2,1),(1,0),(1,2) -- and those are the ONLY live neighbors.
    // So the pattern would be just the cross/plus:
    // .#.    (1,2)
    // ###    (0,1),(1,1),(2,1)
    // .#.    (1,0)
    // That gives (1,1) 4 neighbors -> overpopulation
    //
    // But wait, the spec drawing shows ### at top and bottom, not .#.
    // Let me re-read the spec one more time:
    // "Rule 3 – Overpopulation (live cell with > 3 neighbors dies):
    //  Gen 0:       Gen 1:
    //   ###          #.#
    //   .#.    →     #.#
    //   ###          #.#"
    // Hmm, this is indeed the pattern I described with 8 live cells total.
    // But then (1,1) has 6 live neighbors, not 4. The spec's text says 4 which is wrong.
    // The important thing is: center dies due to overpopulation (6 > 3).
    // 
    // And the Gen 1 result #.# / #.# / #.# means the center column dies.
    // Wait, #.# means left and right are alive, center dead.
    // So Gen 1: (0,2),(2,2),(0,1),(2,1),(0,0),(2,0) = the two side columns survive.
    //
    // Actually wait, let me reconsider the drawing. In the spec format ### at the top
    // could mean row y=0 (display top). Let me just test with the plus/cross pattern
    // which clearly has 4 neighbors for the center:
    const cells: [number, number][] = [[0, 1], [1, 1], [2, 1], [1, 0], [1, 2]];
    // Center (1,1) has 4 live neighbors -> dies
    const result = nextGeneration(cells);
    expect(result).not.toContainEqual([1, 1]);
  });
  it("should handle Rule 4 example: [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]", () => {
    // Spec example: L-shape where dead cell (1,1) gets 3 neighbors -> reproduction
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result.sort()).toEqual([[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });

  // Edge cases
  it("should handle negative coordinates correctly", () => {
    // Blinker at negative coordinates: [(-1,-1),(-1,0),(-1,1)]
    // → [(-2,0),(-1,0),(0,0)]
    const result = nextGeneration([[-1, -1], [-1, 0], [-1, 1]]);
    expect(result.sort()).toEqual([[-2, 0], [-1, 0], [0, 0]].sort());
  });
});
