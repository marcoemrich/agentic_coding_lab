import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('nextGeneration', () => {
  it('empty generation remains []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('single live cell [(0,0)] dies to [] (zero neighbors)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('adjacent pair [(0,1),(1,1)] dies to [] (one neighbor each)', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('live center with two neighbors survives: block corner (0,0) remains alive', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]])).toContainEqual([0, 0]);
  });
  it('live center with exactly three neighbors survives: (0,0) remains alive', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]])).toContainEqual([0, 0]);
  });
  it('live center with four neighbors dies: (0,0) absent from next generation', () => {
    expect(nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it('live center with six neighbors dies: (1,1) absent from next generation (rule over inconsistent diagram)', () => {
    expect(nextGeneration([[0, 0], [1, 0], [2, 0], [1, 1], [0, 2], [1, 2], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it('dead cell with two neighbors stays dead: (1,1) absent', () => {
    expect(nextGeneration([[0, 0], [2, 2]])).not.toContainEqual([1, 1]);
  });
  it('dead cell with exactly three neighbors is born: [(0,0),(1,0),(0,1)] becomes [(0,0),(1,0),(0,1),(1,1)]', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1]]).map(cell => cell.join(',')).sort())
      .toEqual(['0,0', '1,0', '0,1', '1,1'].sort());
  });
  it('dead cell with four neighbors stays dead: (0,0) absent', () => {
    expect(nextGeneration([[-1, 0], [1, 0], [0, -1], [0, 1]])).not.toContainEqual([0, 0]);
  });
  it('block [(0,0),(1,0),(0,1),(1,1)] remains unchanged', () => {
    expect(nextGeneration([[0, 0], [1, 0], [0, 1], [1, 1]]).map(cell => cell.join(',')).sort())
      .toEqual(['0,0', '1,0', '0,1', '1,1'].sort());
  });
  it('vertical blinker [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]', () => {
    expect(nextGeneration([[0, 0], [0, 1], [0, 2]]).map(cell => cell.join(',')).sort())
      .toEqual(['-1,1', '0,1', '1,1'].sort());
  });
  it('horizontal blinker [(-1,1),(0,1),(1,1)] becomes [(0,0),(0,1),(0,2)]', () => {
    const generationOne = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    expect(nextGeneration(generationOne).map(cell => cell.join(',')).sort())
      .toEqual(['0,0', '0,1', '0,2'].sort());
  });
  it('negative x and y block [(-2,-2),(-1,-2),(-2,-1),(-1,-1)] remains unchanged', () => {
    expect(nextGeneration([[-2, -2], [-1, -2], [-2, -1], [-1, -1]]).map(cell => cell.join(',')).sort())
      .toEqual(['-2,-2', '-1,-2', '-2,-1', '-1,-1'].sort());
  });
  it('distant live cells [(1000000,-1000000),(-1000000,1000000)] die without a finite grid boundary', () => {
    expect(nextGeneration([[1000000, -1000000], [-1000000, 1000000]])).toEqual([]);
  });
});
