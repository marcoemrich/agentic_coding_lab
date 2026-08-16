import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

function sorted(cells: Cell[]): Cell[] {
  return [...cells].sort(([ax, ay], [bx, by]) => ax - bx || ay - by);
}

describe('nextGeneration', () => {
  it('keeps an empty generation empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a lone cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills adjacent cells when each has only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('turns a vertical blinker horizontal through survival and reproduction', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 2]];

    expect(sorted(nextGeneration(cells))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });

  it('turns the blinker vertical again in its second generation', () => {
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(horizontal))).toEqual(sorted([[0, 0], [0, 1], [0, 2]]));
  });

  it('keeps a block unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('reproduces a dead cell with exactly three neighbors', () => {
    const corner: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];

    expect(sorted(nextGeneration(corner))).toEqual(sorted(block));
  });

  it('kills an overpopulated cell with four neighbors', () => {
    const plus: Cell[] = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]];
    const ring: Cell[] = [
      [-1, -1], [-1, 0], [-1, 1], [0, -1],
      [0, 1], [1, -1], [1, 0], [1, 1],
    ];

    expect(sorted(nextGeneration(plus))).toEqual(sorted(ring));
  });

  it('supports negative coordinates', () => {
    const cells: Cell[] = [[-5, -3], [-5, -2], [-5, -1]];
    const expected: Cell[] = [[-6, -2], [-5, -2], [-4, -2]];

    expect(sorted(nextGeneration(cells))).toEqual(sorted(expected));
  });

  it('treats repeated coordinates as one living cell', () => {
    const cells: Cell[] = [[0, 0], [0, 1], [0, 1], [0, 2]];

    expect(sorted(nextGeneration(cells))).toEqual(sorted([[-1, 1], [0, 1], [1, 1]]));
  });
});
