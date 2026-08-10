import { describe, expect, it } from 'vitest';

import { nextGeneration, type Cell } from './game-of-life.js';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([xA, yA], [xB, yB]) => xA - xB || yA - yB);
}

describe('nextGeneration', () => {
  it('returns no living cells after a single cell dies from underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills live cells that each have only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('keeps a live cell with two live neighbors alive', () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });

  it('keeps a live cell with three live neighbors alive', () => {
    const cells: Cell[] = [[1, 1], [0, 0], [1, 0], [2, 0]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it('kills a live cell with more than three live neighbors', () => {
    const cells: Cell[] = [[1, 1], [0, 0], [1, 0], [2, 0], [0, 1]];

    expect(nextGeneration(cells)).not.toContainEqual([1, 1]);
  });

  it('reproduces a dead cell with exactly three live neighbors', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1]];

    expect(nextGeneration(cells)).toContainEqual([1, 1]);
  });

  it('oscillates a blinker through two generations', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    const generationOne = nextGeneration(vertical);
    expect(sorted(generationOne)).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(generationOne))).toEqual(sorted(vertical));
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('supports patterns spanning negative coordinates', () => {
    const block: Cell[] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('returns an empty generation for an empty generation', () => {
    expect(nextGeneration([])).toEqual([]);
  });
});
