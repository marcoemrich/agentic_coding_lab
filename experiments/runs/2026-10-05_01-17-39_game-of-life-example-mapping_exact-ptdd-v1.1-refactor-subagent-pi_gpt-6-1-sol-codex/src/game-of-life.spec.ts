import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('nextGeneration', () => {
  it('empty world remains []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell at (0,0) dies to []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('pair [(0,1),(1,1)] with one neighbor each dies to []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live cell with two neighbors survives: blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it('live cell with three neighbors survives: block stays unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining(block));
  });
  it('live center with four neighbors dies', () => {
    const result = nextGeneration([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]]);
    expect(result).not.toContainEqual([1, 1]);
  });
  it('dead (1,1) with three neighbors is born: L becomes block', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it('dead cells with two or four neighbors remain dead', () => {
    expect(nextGeneration([[0, 1], [2, 1]])).not.toContainEqual([1, 1]);
    expect(nextGeneration([[0, 1], [2, 1], [1, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('survival drawing: becomes [(1,-1),(1,0),(0,1),(2,1)] on the infinite grid', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[1, -1], [1, 0], [0, 1], [2, 1]]));
  });
  it('overpopulation drawing: center with six neighbors dies, producing eight surrounding cells', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]]);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining([
      [1, -1], [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, 3],
    ]));
  });
  it('blinker returns to [(0,0),(0,1),(0,2)] after two generations', () => {
    const original: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(nextGeneration(original));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining(original));
  });
  it('negative and distant positive/negative coordinates evolve without grid boundaries', () => {
    const origins: [number, number][] = [
      [-10, -10], [-1_000_000_000, -1_000_000_000],
      [-1_000_000_000, 1_000_000_000], [1_000_000_000, -1_000_000_000],
      [1_000_000_000, 1_000_000_000],
    ];
    const cells = origins.flatMap(([x, y]): [number, number][] => [[x, y], [x, y + 1], [x, y + 2]]);
    const expected = origins.flatMap(([x, y]): [number, number][] => [[x - 1, y + 1], [x, y + 1], [x + 1, y + 1]]);
    const result = nextGeneration(cells);
    expect(result).toHaveLength(expected.length);
    expect(result).toEqual(expect.arrayContaining(expected));
  });
});
