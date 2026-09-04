import { describe, it, expect } from "vitest";
import { nextGeneration } from "./game-of-life.js";

describe("Game of Life - Next Generation", () => {
  it.todo("returns an empty grid for an empty grid — [] → []");
  it.todo("kills a single live cell with no neighbors — [(0,0)] → []");
  it.todo(
    "Rule 1 Underpopulation: kills two adjacent cells that each have 1 neighbor — [(0,1),(1,1)] → []",
  );
  // NOTE: the spec's Rule 2 prose ("center cell (1,1) has 3 live neighbors")
  // does not match its own diagram, where (1,1) is dead in Gen 0 and the
  // separated (1,2) cell has 0 neighbors. Worked by hand from the diagram,
  // Gen 1 is [(1,0)], not the [(1,0),(1,1)] the diagram shows. Using a
  // survival case that is unambiguous under the four rules instead; the
  // diagram discrepancy is raised in the summary.
  it.todo(
    "Rule 2 Survival: a live cell with 2 live neighbors lives on — [(0,0),(1,0),(2,0)] → (1,0) survives",
  );
  it.todo(
    "Rule 3 Overpopulation: the live cell (1,1) with 4 live neighbors dies — (1,1) is absent from the next generation",
  );
  it.todo(
    "Rule 4 Reproduction: a dead cell with exactly 3 live neighbors becomes alive — [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]",
  );
  it.todo(
    "Block still life: [(0,0),(1,0),(0,1),(1,1)] → unchanged [(0,0),(1,0),(0,1),(1,1)]",
  );
  it.todo(
    "Blinker generation 1: vertical [(0,0),(0,1),(0,2)] → horizontal [(-1,1),(0,1),(1,1)]",
  );
  it.todo(
    "Blinker generation 2: horizontal [(-1,1),(0,1),(1,1)] → vertical [(0,0),(0,1),(0,2)]",
  );
  it.todo(
    "handles negative coordinates — a blinker at negative coordinates oscillates the same way",
  );
});
