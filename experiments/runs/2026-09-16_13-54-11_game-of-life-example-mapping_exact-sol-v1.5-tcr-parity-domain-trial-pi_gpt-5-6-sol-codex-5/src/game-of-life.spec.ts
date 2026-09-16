import { describe, expect, it } from 'vitest';
import { nextGeneration } from './game-of-life.js';

function expectCells(actual: number[][], expected: number[][]): void {
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
}

describe('Game of Life next generation', () => {
  it('keeps an empty generation empty -- [] becomes []', () => {
    expect(nextGeneration([])).toEqual([]);
  });
  it('kills a single cell through underpopulation -- [(0,0)] becomes []', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });
  it('kills two adjacent cells with one neighbor each -- [(0,1),(1,1)] becomes []', () => {
    expect(nextGeneration([[0, 1], [1, 1]])).toEqual([]);
  });
  it('lets a live cell with two neighbors survive -- a three-cell line becomes its perpendicular line', () => {
    const next = nextGeneration([[-1, 0], [0, 0], [1, 0]]);

    expectCells(next, [[0, -1], [0, 0], [0, 1]]);
  });
  it('lets a live center cell with three neighbors survive -- a four-cell block remains a block', () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);

    expectCells(next, block);
  });
  it('kills a live center cell with four neighbors -- the plus-shape center is absent', () => {
    const next = nextGeneration([[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1]]);

    expect(next).not.toContainEqual([0, 0]);
  });
  it('reproduces a dead cell with exactly three neighbors -- [(0,1),(1,1),(0,0)] becomes a block', () => {
    const expected = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const next = nextGeneration([[0, 1], [1, 1], [0, 0]]);

    expectCells(next, expected);
  });
  it('advances a blinker from vertical to horizontal -- [(0,0),(0,1),(0,2)] becomes [(-1,1),(0,1),(1,1)]', () => {
    const next = nextGeneration([[0, 0], [0, 1], [0, 2]]);
    const expected = [[-1, 1], [0, 1], [1, 1]];

    expectCells(next, expected);
  });
  it('returns a blinker to vertical after two generations -- vertical becomes horizontal then vertical', () => {
    const vertical = [[0, 0], [0, 1], [0, 2]] as [number, number][];
    const afterTwoGenerations = nextGeneration(nextGeneration(vertical));

    expectCells(afterTwoGenerations, vertical);
  });
  it('keeps a 2x2 block unchanged -- [(0,0),(1,0),(0,1),(1,1)] is a still life', () => {
    const block = [[0, 0], [1, 0], [0, 1], [1, 1]] as [number, number][];
    const next = nextGeneration(block);

    expectCells(next, block);
  });
  it('handles negative coordinates without a grid boundary -- a blinker centered at (-2,-3) oscillates', () => {
    const next = nextGeneration([[-2, -4], [-2, -3], [-2, -2]]);

    expectCells(next, [[-3, -3], [-2, -3], [-1, -3]]);
  });
});
