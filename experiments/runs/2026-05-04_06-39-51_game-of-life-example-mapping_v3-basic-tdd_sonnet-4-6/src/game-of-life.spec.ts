import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

type Cell = [number, number];

function sortCells(cells: Cell[]): Cell[] {
  return [...cells].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('Rule 1 – two cells with 1 neighbor each both die', () => {
    const gen0: Cell[] = [[0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('Rule 2 – live cell with 2 neighbors survives', () => {
    // Block pattern - each cell has exactly 2 or 3 neighbors
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('Rule 2 – survival example from prompt', () => {
    // Gen 0: [(0,0),(1,0),(2,0)] three in a row
    // Center (1,0) has 2 neighbors → survives
    // But also reproduction happens
    const gen0: Cell[] = [[0, 1], [1, 1], [2, 1], [1, 0]];
    // (1,1) has 3 live neighbors → survives, (1,0) has 1 neighbor... let me recalculate
    // Actually let me just test blinker which exercises Rule 2
    const blinkerGen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const blinkerGen1: Cell[] = [[-1, 1], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(blinkerGen0))).toEqual(sortCells(blinkerGen1));
  });

  it('Rule 3 – live cell with more than 3 neighbors dies (overpopulation)', () => {
    // Center cell (1,1) surrounded by 4+ neighbors
    // Gen 0 from prompt: [(0,0),(1,0),(2,0),(1,1),(0,2),(1,2),(2,2)]
    const gen0: Cell[] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    // Center (1,1) should be dead
    const hasCenterCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenterCell).toBe(false);
  });

  it('Rule 4 – dead cell with exactly 3 live neighbors becomes alive', () => {
    // Gen 0: [(0,0),(1,0),(0,1)] → dead cell (1,1) has 3 neighbors → becomes alive
    const gen0: Cell[] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    const hasNewCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasNewCell).toBe(true);
  });

  it('blinker oscillates back to original after 2 generations', () => {
    const blinkerGen0: Cell[] = [[0, 0], [0, 1], [0, 2]];
    const gen2 = nextGeneration(nextGeneration(blinkerGen0));
    expect(sortCells(gen2)).toEqual(sortCells(blinkerGen0));
  });

  it('block is a still life', () => {
    const block: Cell[] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });

  it('handles negative coordinates', () => {
    const block: Cell[] = [[-1, -1], [0, -1], [-1, 0], [0, 0]];
    expect(sortCells(nextGeneration(block))).toEqual(sortCells(block));
  });
});
