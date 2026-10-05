import { describe, expect, it } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life';

describe('nextGeneration', () => {
  it('empty living grid remains []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single cell [(0,0)] dies to []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('adjacent pair [(0,1),(1,1)] dies to []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0]])).toContainEqual([0, 0]);
  });
  it('live center with three neighbors survives', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it('live center with four neighbors dies', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, 1], [0, -1]]))
      .not.toContainEqual([0, 0]);
  });
  it('live center with eight neighbors dies', () => {
    expect(nextGeneration([
      [-1, -1], [0, -1], [1, -1],
      [-1, 0], [0, 0], [1, 0],
      [-1, 1], [0, 1], [1, 1],
    ])).not.toContainEqual([0, 0]);
  });
  it('three-cell L reproduces at (1,1), forming a block', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] stays unchanged', () => {
    const result = nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
  });
  it('survival illustration evolves by the rules to [(0,1),(1,-1),(1,0),(2,1)]', () => {
    const result = nextGeneration([[0, 0], [1, 0], [2, 0], [1, 2]]);
    expect(result).toHaveLength(4);
    expect(result).toEqual(expect.arrayContaining([[0, 1], [1, -1], [1, 0], [2, 1]]));
  });
  it('overpopulation illustration retains top/bottom rows plus births (1,-1),(1,3)', () => {
    const result = nextGeneration([
      [0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2],
    ]);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining([
      [0, 0], [1, 0], [2, 0], [0, 2], [1, 2], [2, 2], [1, -1], [1, 3],
    ]));
  });
  it('vertical blinker becomes [(-1,1),(0,1),(1,1)]', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
  });
  it('blinker returns to its initial cells after two generations', () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
  });
  it('blocks at distant positive and negative coordinates stay unchanged without a finite boundary', () => {
    const cells: Cell[] = [
      [1000000000, -1000000000], [1000000001, -1000000000],
      [1000000000, -999999999], [1000000001, -999999999],
      [-1000000000, 1000000000], [-999999999, 1000000000],
      [-1000000000, 1000000001], [-999999999, 1000000001],
    ];
    const result = nextGeneration(cells);
    expect(result).toHaveLength(8);
    expect(result).toEqual(expect.arrayContaining(cells));
  });
});
