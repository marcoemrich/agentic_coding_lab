import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('nextGeneration', () => {
  it('empty living cells produce []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell (0,0) dies to [] (zero neighbors)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('two adjacent cells (0,1),(1,1) both die to [] (one neighbor)', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('a live cell with two neighbors survives at (0,0)', () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('a live cell with three neighbors survives at (1,1)', () => {
    expect(nextGeneration([[0, 1], [1, 0], [2, 1], [1, 1]])).toContainEqual([1, 1]);
  });
  it('a live center cell with more than three neighbors dies at (1,1)', () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('dead (1,1) with exactly three neighbors is born in the three-cell corner', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([1, 1]);
  });
  it('a dead cell with only two neighbors stays dead', () => {
    expect(nextGeneration([[0, 0], [1, 0]])).not.toContainEqual([0, 1]);
  });
  it('vertical blinker at x=0 yields horizontal (-1,1),(0,1),(1,1)', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it('horizontal blinker returns to vertical at x=0 in the second generation', () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it('2x2 block at (0,0) through (1,1) remains unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it('negative x and y coordinates support the same 2x2 still life', () => {
    const block: [number, number][] = [[-2, -2], [-1, -2], [-2, -1], [-1, -1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it('widely separated cells across positive and negative coordinates die without a bounded grid', () => {
    expect(nextGeneration([[-1000000, -1000000], [1000000, 1000000]])).toEqual([]);
  });
});
