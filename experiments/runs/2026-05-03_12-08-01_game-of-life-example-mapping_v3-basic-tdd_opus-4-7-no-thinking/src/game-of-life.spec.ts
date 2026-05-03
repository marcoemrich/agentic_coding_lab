import { describe, it, expect } from 'vitest';
import { nextGeneration, type Cell } from './game-of-life.js';

describe('Game of Life - nextGeneration', () => {
  it('returns empty when given empty input', () => {
    expect(nextGeneration([])).toEqual([]);
  });

  it('kills a single live cell (underpopulation, 0 neighbors)', () => {
    const gen0: Cell[] = [[0, 0]];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('kills two adjacent live cells (each has 1 neighbor)', () => {
    const gen0: Cell[] = [
      [0, 1],
      [1, 1],
    ];
    expect(nextGeneration(gen0)).toEqual([]);
  });

  it('kills a live cell with more than 3 neighbors (overpopulation)', () => {
    // Center (1,1) has 4 neighbors
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [0, 2],
      [1, 2],
      [2, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).not.toContainEqual([1, 1]);
  });

  it('keeps a live cell alive with 2 neighbors (survival)', () => {
    // Blinker: vertical line at (0,0), (0,1), (0,2)
    // Center cell (0,1) has 2 neighbors and survives
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const result = nextGeneration(gen0);
    expect(result).toContainEqual([0, 1]);
  });

  it('revives a dead cell with exactly 3 neighbors (reproduction)', () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
    ];
    const result = nextGeneration(gen0);
    // Dead cell (1,1) has 3 neighbors -> alive
    expect(result).toContainEqual([1, 1]);
  });

  it('blinker oscillates: vertical to horizontal', () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen1 = nextGeneration(gen0);
    const sorted = [...gen1].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [-1, 1],
      [0, 1],
      [1, 1],
    ]);
  });

  it('blinker returns to original after two generations', () => {
    const gen0: Cell[] = [
      [0, 0],
      [0, 1],
      [0, 2],
    ];
    const gen2 = nextGeneration(nextGeneration(gen0));
    const sorted = [...gen2].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [0, 0],
      [0, 1],
      [0, 2],
    ]);
  });

  it('block (still life) remains unchanged', () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const gen1 = nextGeneration(gen0);
    const sorted = [...gen1].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]);
  });

  it('handles negative coordinates', () => {
    // Blinker placed at negative coordinates
    const gen0: Cell[] = [
      [-5, -5],
      [-5, -4],
      [-5, -3],
    ];
    const gen1 = nextGeneration(gen0);
    const sorted = [...gen1].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    expect(sorted).toEqual([
      [-6, -4],
      [-5, -4],
      [-4, -4],
    ]);
  });

  it('does not return duplicate cells', () => {
    const gen0: Cell[] = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    const gen1 = nextGeneration(gen0);
    const seen = new Set(gen1.map(([x, y]) => `${x},${y}`));
    expect(seen.size).toBe(gen1.length);
  });
});
