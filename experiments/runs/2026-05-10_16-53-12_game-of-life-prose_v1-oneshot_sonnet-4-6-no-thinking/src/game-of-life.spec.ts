import { describe, it, expect } from 'vitest';
import { createGrid, getCells, nextGeneration, type Cell } from './game-of-life';

function toSortedKeys(cells: Cell[]): string[] {
  return cells.map(([x, y]) => `${x},${y}`).sort();
}

function nextGen(cells: Cell[]): Cell[] {
  return getCells(nextGeneration(createGrid(cells)));
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGen([])).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    expect(nextGen([[0, 0]])).toEqual([]);
  });

  it('two cells die (underpopulation)', () => {
    expect(nextGen([[0, 0], [1, 0]])).toEqual([]);
  });

  it('live cell with 2 neighbors survives', () => {
    // Blinker center cell has 2 neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0]];
    const result = toSortedKeys(nextGen(cells));
    expect(result).toContain('0,-1');
    expect(result).toContain('0,0');
    expect(result).toContain('0,1');
  });

  it('live cell with 3 neighbors survives', () => {
    const cells: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = toSortedKeys(nextGen(cells));
    expect(result).toContain('0,0');
    expect(result).toContain('1,0');
    expect(result).toContain('0,1');
    expect(result).toContain('1,1');
  });

  it('live cell with 4+ neighbors dies (overpopulation)', () => {
    // center cell at (0,0) surrounded by 4 live neighbors
    const cells: Cell[] = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const result = toSortedKeys(nextGen(cells));
    expect(result).not.toContain('0,0');
  });

  it('dead cell with exactly 3 neighbors becomes alive', () => {
    const cells: Cell[] = [[1, 0], [-1, 0], [0, 1]];
    const result = toSortedKeys(nextGen(cells));
    expect(result).toContain('0,0');
  });

  it('blinker oscillates', () => {
    const horizontal: Cell[] = [[-1, 0], [0, 0], [1, 0]];
    const vertical: Cell[] = [[0, -1], [0, 0], [0, 1]];

    const gen1 = toSortedKeys(nextGen(horizontal));
    expect(gen1).toEqual(toSortedKeys(vertical));

    const gen2 = toSortedKeys(nextGen(vertical));
    expect(gen2).toEqual(toSortedKeys(horizontal));
  });

  it('block (2x2) is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = toSortedKeys(nextGen(block));
    expect(result).toEqual(toSortedKeys(block));
  });

  it('handles negative coordinates', () => {
    const cells: Cell[] = [[-10, -10], [-9, -10], [-10, -9]];
    const result = toSortedKeys(nextGen(cells));
    expect(result).toContain('-10,-10');
    expect(result).toContain('-9,-10');
    expect(result).toContain('-10,-9');
    expect(result).toContain('-9,-9');
  });

  it('glider moves correctly after one generation', () => {
    // Standard glider
    const glider: Cell[] = [[1, 0], [2, 1], [0, 2], [1, 2], [2, 2]];
    const gen1 = toSortedKeys(nextGen(glider));
    // After one step, glider shifts
    expect(gen1).toContain('0,1');
    expect(gen1).toContain('2,1');
    expect(gen1).toContain('1,2');
    expect(gen1).toContain('2,2');
    expect(gen1).toContain('1,3');
  });
});
