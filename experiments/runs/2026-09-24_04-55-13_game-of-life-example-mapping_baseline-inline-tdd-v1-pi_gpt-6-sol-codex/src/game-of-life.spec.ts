import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

const sorted = (cells: Cell[]): Cell[] => cells.sort(([ax, ay], [bx, by]) => ax - bx || ay - by);

describe('nextGeneration', () => {
  it('kills isolated cells and pairs (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('keeps live cells with two or three neighbors', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 0]);
  });

  it('kills live cells with more than three neighbors', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });

  it('births a dead cell with exactly three neighbors, but not with two', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
    expect(nextGeneration([[0, 0], [1, 0]])).not.toContainEqual([1, 1]);
  });

  it('oscillates a blinker across two generations, including negative coordinates', () => {
    const vertical: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const horizontal: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(vertical))).toEqual(sorted(horizontal));
    expect(sorted(nextGeneration(horizontal))).toEqual(sorted(vertical));
  });

  it('preserves a block still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sorted(nextGeneration(block))).toEqual(sorted(block));
  });

  it('does not birth a dead cell with four neighbors', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });

  it('evolves independent patterns far apart on the infinite grid', () => {
    const cells: Cell[] = [[-100, -100], [-100, -99], [-100, -98], [100, 100], [101, 100], [100, 101], [101, 101]];
    expect(sorted(nextGeneration(cells))).toEqual(sorted([
      [-101, -99], [-100, -99], [-99, -99],
      [100, 100], [101, 100], [100, 101], [101, 101],
    ]));
  });

  it('returns an empty generation for an empty grid', () => {
    expect(nextGeneration([])).toEqual([]);
  });
});
