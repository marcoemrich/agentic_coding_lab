import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('nextGeneration', () => {
  it('empty generation stays empty: [] → []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single live cell dies: [(0,0)] → []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('underpopulation: adjacent pair [(0,1),(1,1)] → []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('survival with two neighbors: middle of [(0,0),(1,0),(2,0)] remains (1,0)', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0]])).toContainEqual([1, 0]);
  });
  it('survival with three neighbors: [(1,1),(0,0),(1,0),(2,0)] retains (1,1)', () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0]])).toContainEqual([1, 1]);
  });
  it('overpopulation with four neighbors: [(1,1),(0,0),(1,0),(2,0),(1,2)] loses (1,1)', () => {
    expect(nextGeneration([[1, 1], [0, 0], [1, 0], [2, 0], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('reproduction: [(0,0),(1,0),(0,1)] → [(0,0),(1,0),(0,1),(1,1)]', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toEqual(expect.arrayContaining([[0, 0], [1, 0], [0, 1], [1, 1]]));
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toHaveLength(4);
  });
  it('block still life: [(0,0),(1,0),(0,1),(1,1)] → unchanged', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(nextGeneration(block)).toEqual(expect.arrayContaining(block));
    expect(nextGeneration(block)).toHaveLength(4);
  });
  it('blinker first step: [(0,0),(0,1),(0,2)] → [(-1,1),(0,1),(1,1)]', () => {
    const result = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(result).toEqual(expect.arrayContaining([[-1, 1], [0, 1], [1, 1]]));
    expect(result).toHaveLength(3);
  });
  it('blinker second step: vertical → horizontal → original vertical', () => {
    const result = nextGeneration(nextGeneration([[0, 0], [0, 1], [0, 2]]));
    expect(result).toEqual(expect.arrayContaining([[0, 0], [0, 1], [0, 2]]));
    expect(result).toHaveLength(3);
  });
  it('negative x and y: translated blinker oscillates around (-2,-2)', () => {
    const result = nextGeneration([[-2, -3], [-2, -2], [-2, -1]]);
    expect(result).toEqual(expect.arrayContaining([[-3, -2], [-2, -2], [-1, -2]]));
    expect(result).toHaveLength(3);
  });
  it('Rule 2 pictured input ###/.#./.#. has four neighbors at (1,1): center dies per rules, not pictured survival', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]])).not.toContainEqual([1, 1]);
  });
  it('Rule 3 pictured input ###/.#./### has six neighbors at (1,1): center dies', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
});
