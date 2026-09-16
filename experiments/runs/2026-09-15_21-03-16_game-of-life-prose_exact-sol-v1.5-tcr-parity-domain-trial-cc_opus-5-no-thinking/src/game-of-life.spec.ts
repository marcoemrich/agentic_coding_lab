import { describe, it } from "vitest";

describe("Game of Life -- nextGeneration", () => {
  // Simplest case: nothing alive
  it.todo("returns no living cells for an empty input -- [] -> []");

  // Underpopulation: a living cell with fewer than two live neighbors dies
  it.todo("kills a single living cell with zero live neighbors -- [[0,0]] -> []");
  it.todo("kills both cells of a living pair, each having one live neighbor -- [[0,0],[1,0]] -> []");

  // Survival: a living cell with two or three live neighbors lives on
  it.todo("keeps a living cell with exactly two live neighbors alive -- center of [[0,0],[1,0],[2,0]] keeps [1,0]");
  it.todo("keeps a living cell with exactly three live neighbors alive -- [1,1] of the 2x2 block [[0,0],[1,0],[0,1],[1,1]] stays alive");

  // Overpopulation: a living cell with more than three live neighbors dies
  it.todo("kills a living cell with four live neighbors -- center [1,1] dies in [[1,1],[0,0],[2,0],[0,2],[2,2]]");

  // Reproduction: a dead cell with exactly three live neighbors becomes alive
  it.todo("brings a dead cell with exactly three live neighbors to life -- [[0,0],[1,0],[0,1]] gives birth at [1,1]");
  it.todo("leaves a dead cell with only two live neighbors dead -- no birth at [1,1] from [[0,0],[1,0]]");

  // Neighborhood is the eight surrounding cells, including diagonals
  it.todo("counts diagonal cells as neighbors -- blinker [[0,0],[1,1],[2,2]] keeps only [1,1] alive");

  // Combined rules on a whole generation
  it.todo("keeps the 2x2 block stable across a generation -- [[0,0],[1,0],[0,1],[1,1]] is unchanged");
  it.todo("oscillates the horizontal blinker into a vertical blinker -- [[0,0],[1,0],[2,0]] -> [[1,-1],[1,0],[1,1]]");

  // Infinite grid: negative coordinates behave like any other region
  it.todo("applies the rules at negative coordinates -- blinker [[-1,-5],[-2,-5],[-3,-5]] -> [[-2,-4],[-2,-5],[-2,-6]]");
  it.todo("gives birth at a negative coordinate outside the bounding box of the input -- [[0,0],[0,-1],[-1,0]] gives birth at [-1,-1]");
});
