import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

describe('nextGeneration', () => {
  it('empty living grid stays []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell [(0,0)] dies with zero neighbors, yielding []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('underpopulation pair [(0,1),(1,1)] dies, yielding []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center (0,0) with two neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center (1,1) with three neighbors survives', () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it('live center (1,1) with four neighbors dies', () => {
    expect(nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('overpopulation drawing: center (1,1) with six neighbors dies', () => {
    expect(nextGeneration([
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ])).not.toContainEqual([1, 1]);
  });
  it('reproduction L [(0,0),(1,0),(0,1)] becomes a four-cell block', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).sort()).toEqual(
      [[0, 0], [1, 0], [0, 1], [1, 1]].sort());
  });
  it('dead center with two neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0]])).not.toContainEqual([0, 0]);
  });
  it('dead center with four neighbors stays dead', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it('survival drawing evolves to [(1,-1),(1,0),(0,1),(2,1)] under eight-neighbor rules', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]).sort()).toEqual(
      [[1, -1], [1, 0], [0, 1], [2, 1]].sort());
  });
  it('blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).sort()).toEqual(
      [[-1, 1], [0, 1], [1, 1]].sort());
  });
  it('blinker returns to its initial coordinates after two generations', () => {
    const initial: Cell[] = [[0, 0], [0, 1], [0, 2]];
    expect(nextGeneration(nextGeneration(initial)).sort()).toEqual(initial.slice().sort());
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block).sort()).toEqual(block.slice().sort());
  });
  it('far positive and negative blocks remain unchanged on the unbounded sparse grid', () => {
    const cells: Cell[] = [
      [1000000000, 1000000000], [1000000001, 1000000000],
      [1000000000, 1000000001], [1000000001, 1000000001],
      [-1000000000, -1000000000], [-999999999, -1000000000],
      [-1000000000, -999999999], [-999999999, -999999999],
    ];
    expect(nextGeneration(cells).sort()).toEqual(cells.slice().sort());
  });
});
