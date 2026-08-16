import { describe, expect, it } from 'vitest';

import { nextGeneration } from './game-of-life';

describe('nextGeneration', () => {
  it('keeps an empty generation empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single isolated cell through underpopulation', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('kills live cells with only one neighbor', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });

  it('keeps a live cell with exactly two neighbors alive', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0]]);

    expect(result).toContainEqual([1, 0]);
  });

  it('keeps a live cell with exactly three neighbors alive', () => {
    const result = nextGeneration([[0, 0], [-1, -1], [0, -1], [1, -1]]);

    expect(result).toContainEqual([0, 0]);
  });

  it('kills a live cell with more than three neighbors', () => {
    const result = nextGeneration([
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]);

    expect(result).not.toContainEqual([0, 0]);
  });

  it('reproduces a dead cell that has exactly three live neighbors', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it('turns a vertical blinker into a horizontal blinker', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]])).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it('returns a blinker to its original state after two generations', () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];

    expect(nextGeneration(nextGeneration(initial))).toEqual(initial);
  });

  it('leaves a block still life unchanged', () => {
    const block: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1]];

    expect(nextGeneration(block)).toEqual(block);
  });

  it('evolves cells at negative coordinates', () => {
    expect(nextGeneration([[-5, -7], [-5, -6], [-5, -5]])).toEqual([
      [-6, -6],
      [-5, -6],
      [-4, -6],
    ]);
  });

  it('is not bounded to a finite grid', () => {
    expect(nextGeneration([
      [1_000_000, 1_000_000],
      [1_000_000, 1_000_001],
      [1_000_000, 1_000_002],
    ])).toEqual([
      [999_999, 1_000_001],
      [1_000_000, 1_000_001],
      [1_000_001, 1_000_001],
    ]);
  });
});
