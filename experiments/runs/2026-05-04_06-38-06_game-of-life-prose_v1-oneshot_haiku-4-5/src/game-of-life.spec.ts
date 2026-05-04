import { nextGeneration } from './game-of-life';

describe('Game of Life', () => {
  describe('nextGeneration', () => {
    it('should return empty set for empty input', () => {
      const living = new Set<string>();
      const result = nextGeneration(living);
      expect(result.size).toBe(0);
    });

    it('should kill a living cell with no neighbors', () => {
      const living = new Set(['0,0']);
      const result = nextGeneration(living);
      expect(result.size).toBe(0);
    });

    it('should kill a living cell with one neighbor', () => {
      const living = new Set(['0,0', '1,0']);
      const result = nextGeneration(living);
      expect(result.size).toBe(0);
    });

    it('should keep a living cell with two neighbors alive', () => {
      const living = new Set(['0,0', '1,0', '2,0']);
      const result = nextGeneration(living);
      expect(result.has('1,0')).toBe(true);
    });

    it('should keep a living cell with three neighbors alive', () => {
      const living = new Set(['0,0', '1,0', '0,1', '1,-1']);
      const result = nextGeneration(living);
      expect(result.has('1,0')).toBe(true);
    });

    it('should kill a living cell with four neighbors', () => {
      const living = new Set(['0,0', '1,0', '0,1', '1,1', '2,0']);
      const result = nextGeneration(living);
      expect(result.has('1,0')).toBe(false);
    });

    it('should create a living cell from dead cell with exactly three neighbors', () => {
      const living = new Set(['0,0', '1,0', '0,1']);
      const result = nextGeneration(living);
      expect(result.has('1,1')).toBe(true);
    });

    it('should handle negative coordinates', () => {
      const living = new Set(['-1,-1', '0,-1', '1,-1']);
      const result = nextGeneration(living);
      expect(result.has('0,-2')).toBe(true);
    });

    it('should handle a blinker pattern', () => {
      // Vertical blinker: becomes horizontal
      const living = new Set(['0,0', '0,1', '0,2']);
      const result = nextGeneration(living);
      expect(result.has('-1,1')).toBe(true);
      expect(result.has('0,1')).toBe(true);
      expect(result.has('1,1')).toBe(true);
      expect(result.size).toBe(3);
    });

    it('should handle a block pattern (stable)', () => {
      // 2x2 block stays the same
      const living = new Set(['0,0', '1,0', '0,1', '1,1']);
      const result = nextGeneration(living);
      expect(result.size).toBe(4);
      expect(result.has('0,0')).toBe(true);
      expect(result.has('1,0')).toBe(true);
      expect(result.has('0,1')).toBe(true);
      expect(result.has('1,1')).toBe(true);
    });

    it('should handle a tub pattern (stable)', () => {
      // Tub pattern is stable: . * . / * . * / . * .
      const living = new Set(['1,0', '0,1', '2,1', '1,2']);
      const result = nextGeneration(living);
      expect(result.size).toBe(4);
      expect(result.has('1,0')).toBe(true);
      expect(result.has('0,1')).toBe(true);
      expect(result.has('2,1')).toBe(true);
      expect(result.has('1,2')).toBe(true);
    });
  });
});
