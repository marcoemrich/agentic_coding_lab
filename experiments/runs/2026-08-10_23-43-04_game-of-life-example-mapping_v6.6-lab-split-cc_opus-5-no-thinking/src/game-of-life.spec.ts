import { describe, it, expect } from "vitest";
import { nextGeneration, type Cell } from "./game-of-life.js";

// The API contract does not specify output ordering, so compare as sets.
const sorted = (cells: Cell[]): Cell[] =>
  [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);

describe("Game of Life - Next Generation", () => {
  it("returns an empty grid for an empty grid — [] → []", () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it("kills a single live cell with no neighbors — [(0,0)] → []", () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it("Rule 1 (underpopulation): kills live cells with fewer than 2 neighbors — [(0,1), (1,1)] → []", () => {
    expect(
      nextGeneration([
        [0, 1],
        [1, 1],
      ])
    ).toEqual([]);
  });

  // NOTE: the spec's Rule 2 diagram is internally inconsistent. Its prose claims
  // the center cell (1,1) "has 3 live neighbors → survives", but in its own Gen 0
  // diagram (1,1) is dead and has 4 live neighbors, so it stays dead. The spec's
  // printed Gen 1 [(1,0), (1,1)] is unreachable under Conway's rules. We keep the
  // spec's Gen 0 and assert the rule-correct Gen 1: (1,0) survives on 2 neighbors,
  // and three dead cells — (0,1), (1,-1), (2,1) — each have exactly 3 live
  // neighbors and are born.
  it("Rule 2 (survival): a live cell with 2 neighbors lives on — [(0,0), (1,0), (2,0), (1,2)] → [(1,0), (0,1), (1,-1), (2,1)]", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [2, 0],
          [1, 2],
        ])
      )
    ).toEqual(
      sorted([
        [1, 0],
        [0, 1],
        [1, -1],
        [2, 1],
      ])
    );
  });

  it("Rule 4 (reproduction): a dead cell with exactly 3 neighbors becomes alive — [(0,0), (1,0), (0,1)] → [(0,0), (1,0), (0,1), (1,1)]", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [0, 1],
        ])
      )
    ).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [0, 1],
        [1, 1],
      ])
    );
  });

  // NOTE: like Rule 2, the spec's Rule 3 diagram is not self-consistent. Its prose
  // says the center (1,1) "has 4 live neighbors"; in its own Gen 0 diagram it has 6.
  // Its printed Gen 1 "#.#"/"#.#"/"#.#" is unreachable: (0,1) and (2,1) have 5 live
  // neighbors each so cannot be born, while (1,0) and (1,2) survive on 3 but are
  // absent from it. We keep the spec's Gen 0 and assert the rule-correct Gen 1:
  // the center dies on 6 (overpopulation), the six other ring cells survive on
  // 2 or 3, and (1,-1) and (1,3) are born on exactly 3.
  it("Rule 3 (overpopulation): a live cell with more than 3 neighbors dies — center (1,1) with 6 neighbors dies", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [1, 0],
          [2, 0],
          [1, 1],
          [0, 2],
          [1, 2],
          [2, 2],
        ])
      )
    ).toEqual(
      sorted([
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 2],
        [1, 2],
        [2, 2],
        [1, -1],
        [1, 3],
      ])
    );
  });

  it("Block (still life): [(0,0), (1,0), (0,1), (1,1)] is unchanged", () => {
    const block: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it("Blinker: vertical [(0,0), (0,1), (0,2)] → horizontal [(-1,1), (0,1), (1,1)]", () => {
    expect(
      sorted(
        nextGeneration([
          [0, 0],
          [0, 1],
          [0, 2],
        ])
      )
    ).toEqual(
      sorted([
        [-1, 1],
        [0, 1],
        [1, 1],
      ])
    );
  });

  it("Blinker oscillates back after two generations: [(0,0), (0,1), (0,2)] → gen 2 is [(0,0), (0,1), (0,2)]", () => {
    const generation0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const generation2 = nextGeneration(nextGeneration(generation0));
    expect(sorted(generation2)).toEqual(sorted(generation0));
  });

  it("handles negative coordinates — blinker at [(-5,-5), (-5,-4), (-5,-3)] → [(-6,-4), (-5,-4), (-4,-4)]", () => {
    expect(
      sorted(
        nextGeneration([
          [-5, -5],
          [-5, -4],
          [-5, -3],
        ])
      )
    ).toEqual(
      sorted([
        [-6, -4],
        [-5, -4],
        [-4, -4],
      ])
    );
  });
});
