import { describe, it, expect } from 'vitest';
import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  it('empty grid stays empty', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('single cell dies (underpopulation)', () => {
    expect(nextGeneration([[0, 0]])).toEqual([]);
  });

  it('two cells die (underpopulation - rule 1)', () => {
    const gen0: [number, number][] = [[0, 1], [1, 1]];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('live cell with 2 neighbors survives (rule 2)', () => {
    // Block: 2x2 - each cell has 3 neighbors and survives
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it('live cell with more than 3 neighbors dies (overpopulation - rule 3)', () => {
    // Center cell (1,1) with 4+ neighbors dies
    const gen0: [number, number][] = [
      [0, 0], [1, 0], [2, 0],
      [1, 1],
      [0, 2], [1, 2], [2, 2],
    ];
    const result = nextGeneration(gen0);
    const hasCenter = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasCenter).toBe(false);
  });

  it('dead cell with exactly 3 neighbors becomes alive (reproduction - rule 4)', () => {
    // Dead cell (1,1) has exactly 3 live neighbors
    const gen0: [number, number][] = [[0, 0], [1, 0], [0, 1]];
    const result = nextGeneration(gen0);
    const hasNewCell = result.some(([x, y]) => x === 1 && y === 1);
    expect(hasNewCell).toBe(true);
  });

  it('blinker oscillates - gen 0 to gen 1', () => {
    const gen0: [number, number][] = [[0, 0], [0, 1], [0, 2]];
    const result = nextGeneration(gen0);
    const sorted = result.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[-1, 1], [0, 1], [1, 1]]);
  });

  it('blinker oscillates - gen 1 to gen 2', () => {
    const gen1: [number, number][] = [[-1, 1], [0, 1], [1, 1]];
    const result = nextGeneration(gen1);
    const sorted = result.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [0, 2]]);
  });

  it('block is a still life', () => {
    const block: [number, number][] = [[0, 0], [1, 0], [0, 1], [1, 1]];
    const result = nextGeneration(block);
    const sorted = result.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
  });

  it('handles negative coordinates', () => {
    const gen: [number, number][] = [[-1, -1], [0, -1], [-1, 0]];
    const result = nextGeneration(gen);
    const hasNewCell = result.some(([x, y]) => x === 0 && y === 0);
    expect(hasNewCell).toBe(true);
  });
});
