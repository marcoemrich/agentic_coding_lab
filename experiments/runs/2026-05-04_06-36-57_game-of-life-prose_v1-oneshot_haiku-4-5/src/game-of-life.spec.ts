import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  it('should handle an empty grid', () => {
    const cells = new Set<string>();
    const result = nextGeneration(cells);
    expect(result.size).toBe(0);
  });

  it('should kill a lonely cell (underpopulation)', () => {
    const cells = new Set(['0,0']);
    const result = nextGeneration(cells);
    expect(result.size).toBe(0);
  });

  it('should kill a cell with one neighbor', () => {
    const cells = new Set(['0,0', '1,0']);
    const result = nextGeneration(cells);
    expect(result.size).toBe(0);
  });

  it('should keep a cell with two neighbors alive', () => {
    const cells = new Set(['0,0', '1,0', '0,1']);
    const result = nextGeneration(cells);
    expect(result.has('0,0')).toBe(true);
  });

  it('should keep a cell with three neighbors alive', () => {
    const cells = new Set(['0,0', '1,0', '0,1', '1,1']);
    const result = nextGeneration(cells);
    expect(result.has('0,0')).toBe(true);
  });

  it('should kill a cell with four neighbors (overpopulation)', () => {
    const cells = new Set(['0,0', '1,0', '0,1', '1,1', '2,1', '-1,0']);
    const result = nextGeneration(cells);
    expect(result.has('0,0')).toBe(false);
  });

  it('should resurrect a dead cell with exactly three neighbors', () => {
    const cells = new Set(['0,0', '1,0', '0,1']);
    const result = nextGeneration(cells);
    expect(result.has('1,1')).toBe(true);
  });

  it('should not resurrect a dead cell with two neighbors', () => {
    const cells = new Set(['0,0', '1,0']);
    const result = nextGeneration(cells);
    expect(result.has('0,1')).toBe(false);
  });

  it('should not resurrect a dead cell with fewer than three neighbors', () => {
    const cells = new Set(['0,0', '1,0', '2,0']);
    const result = nextGeneration(cells);
    // (1,1) has only 3 neighbors but let's test (0,1) which has only 2
    expect(result.has('0,1')).toBe(false);
  });

  it('should handle negative coordinates', () => {
    const cells = new Set(['-1,0', '0,0', '1,0']);
    const result = nextGeneration(cells);
    expect(result.has('0,-1')).toBe(true);
    expect(result.has('0,1')).toBe(true);
  });

  it('should implement the blinker pattern', () => {
    // Vertical blinker
    const cells = new Set(['0,0', '0,1', '0,2']);
    const result = nextGeneration(cells);
    expect(result.has('-1,1')).toBe(true);
    expect(result.has('0,1')).toBe(true);
    expect(result.has('1,1')).toBe(true);
    expect(result.has('0,0')).toBe(false);
    expect(result.has('0,2')).toBe(false);
  });

  it('should implement the block pattern (stable)', () => {
    // 2x2 block
    const cells = new Set(['0,0', '1,0', '0,1', '1,1']);
    const result = nextGeneration(cells);
    expect(result.size).toBe(4);
    expect(result.has('0,0')).toBe(true);
    expect(result.has('1,0')).toBe(true);
    expect(result.has('0,1')).toBe(true);
    expect(result.has('1,1')).toBe(true);
  });

  it('should handle a glider pattern', () => {
    // Initial glider configuration
    const cells = new Set(['0,1', '1,2', '2,0', '2,1', '2,2']);
    const result = nextGeneration(cells);
    // After one generation: should have specific cells alive
    expect(result.size).toBeGreaterThan(0);
  });
});
