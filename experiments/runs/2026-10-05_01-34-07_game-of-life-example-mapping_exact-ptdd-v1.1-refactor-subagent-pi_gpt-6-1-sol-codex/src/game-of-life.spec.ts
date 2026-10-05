import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life.js';

describe('nextGeneration', () => {
  it('empty living grid stays []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell at (0,0) dies to []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('pair at (0,1),(1,1) dies to []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives', () => {
    expect(nextGeneration([[-1, 0], [0, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center (1,1) with three neighbors survives', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1]])).toContainEqual([1, 1]);
  });
  it('live center (1,1) with four neighbors dies', () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]))
      .not.toContainEqual([1, 1]);
  });
  it('drawn dense pattern center with six neighbors dies', () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it('dead (1,1) with three neighbors is born; L becomes block', () => {
    const next = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(next).toHaveLength(4);
    expect(next).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it('dead center with two neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it('dead center with four neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]]))
      .not.toContainEqual([0, 0]);
  });
  it('vertical blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(next).toHaveLength(3);
    expect(next).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it('blinker returns to initial coordinates after two generations', () => {
    const initial: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const next = nextGeneration(nextGeneration(initial));
    expect(next).toHaveLength(initial.length);
    expect(next).toEqual(expect.arrayContaining(initial));
  });
  it('block at [(0,0),(1,0),(0,1),(1,1)] stays unchanged', () => {
    const initial: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration(initial);
    expect(next).toHaveLength(initial.length);
    expect(next).toEqual(expect.arrayContaining(initial));
  });
  it('far negative and positive x/y blinkers evolve without finite boundaries', () => {
    const initial: [number, number][] = [
      [-1000000000, -1000000000], [-1000000000, -999999999], [-1000000000, -999999998],
      [1000000000, 1000000000], [1000000000, 1000000001], [1000000000, 1000000002],
    ];
    const next = nextGeneration(initial);
    expect(next).toHaveLength(6);
    expect(next).toEqual(expect.arrayContaining([
      [-1000000001, -999999999], [-1000000000, -999999999], [-999999999, -999999999],
      [999999999, 1000000001], [1000000000, 1000000001], [1000000001, 1000000001],
    ]));
  });
});
