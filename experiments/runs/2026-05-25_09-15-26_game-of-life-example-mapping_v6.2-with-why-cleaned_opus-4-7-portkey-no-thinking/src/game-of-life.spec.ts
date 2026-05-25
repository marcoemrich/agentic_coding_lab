import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

describe("Game of Life - nextGeneration", () => {
  it("empty grid stays empty — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it("single cell dies from underpopulation — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it("two adjacent cells both die from underpopulation — [(0,1), (1,1)] → []", () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it("block still life stays unchanged — [(0,0),(1,0),(0,1),(1,1)] → same", () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it("rule 2 survival: middle of row survives with 2 neighbors — [(0,0),(1,0),(2,0)] includes (1,0)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);
    expect(result).toEqual(expect.arrayContaining([[1, 0]]));
  });
  it("rule 3 overpopulation: center of plus-shape with 4 neighbors dies", () => {
    const plus: Cell[] = [[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]];
    const result = nextGeneration(plus);
    expect(result).not.toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("rule 4 reproduction: L-shape becomes block — [(0,0),(1,0),(0,1)] → adds (1,1)", () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toEqual(expect.arrayContaining([[1, 1]]));
  });
  it("blinker oscillates vertical → horizontal — [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]", () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining<Cell>([[-1, 1], [0, 1], [1, 1]]));
  });
  it("handles negative coordinates — blinker at (-5,-5) rotates", () => {
    const result = nextGeneration([[-5, -6], [-5, -5], [-5, -4]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining<Cell>([[-6, -5], [-5, -5], [-4, -5]]),
    );
  });
});
