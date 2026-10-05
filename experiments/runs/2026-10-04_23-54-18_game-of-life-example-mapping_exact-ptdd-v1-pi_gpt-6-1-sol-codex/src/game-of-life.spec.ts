import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

describe('nextGeneration', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell (0,0) dies with zero neighbors', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('pair (0,1),(1,1) dies with one neighbor each', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives', () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center with three neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it('live center with four neighbors dies', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it('dead (1,1) with three neighbors is born, completing a block', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it('dead center with two neighbors remains dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it('dead center with four neighbors remains dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it('survival diagram produces (1,-1),(1,0),(0,1),(2,1) under Conway rules', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[1, -1], [1, 0], [0, 1], [2, 1]]));
  });
  it('overpopulation diagram produces eight cells and kills center with six neighbors', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining([
      [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3],
    ]));
  });
  it('vertical blinker becomes horizontal including negative x', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it('blinker returns to initial coordinates after two generations', () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(nextGeneration(initial));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(initial));
  });
  it('block remains unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it('translated blinker handles large positive x and negative y without bounds', () => {
    const result = nextGeneration([
      [1_000_000_000, -1_000_000_000],
      [1_000_000_000, -999_999_999],
      [1_000_000_000, -999_999_998],
    ]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([
      [999_999_999, -999_999_999],
      [1_000_000_000, -999_999_999],
      [1_000_000_001, -999_999_999],
    ]));
  });
});
