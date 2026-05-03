import { describe, it, expect } from 'vitest';
import { moveRover } from './mars-rover.js';

describe('Mars Rover', () => {
  it('stays in place with no commands', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, '')).toEqual({ x: 0, y: 0, heading: 'N' });
  });

  it('moves forward north', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, 'F')).toEqual({ x: 0, y: 1, heading: 'N' });
  });

  it('moves forward east', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'E' }, 'F')).toEqual({ x: 1, y: 0, heading: 'E' });
  });

  it('moves forward south', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'S' }, 'F')).toEqual({ x: 0, y: -1, heading: 'S' });
  });

  it('moves forward west', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'W' }, 'F')).toEqual({ x: -1, y: 0, heading: 'W' });
  });

  it('turns left from north to west', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, 'L')).toEqual({ x: 0, y: 0, heading: 'W' });
  });

  it('turns right from north to east', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, 'R')).toEqual({ x: 0, y: 0, heading: 'E' });
  });

  it('turns left four times to face same direction', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, 'LLLL')).toEqual({ x: 0, y: 0, heading: 'N' });
  });

  it('turns right four times to face same direction', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'S' }, 'RRRR')).toEqual({ x: 0, y: 0, heading: 'S' });
  });

  it('handles a sequence of commands', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'N' }, 'FFRFF')).toEqual({ x: 2, y: 2, heading: 'E' });
  });

  it('supports negative coordinates', () => {
    expect(moveRover({ x: 0, y: 0, heading: 'S' }, 'FFF')).toEqual({ x: 0, y: -3, heading: 'S' });
  });

  it('works from non-origin start position', () => {
    expect(moveRover({ x: 3, y: 4, heading: 'W' }, 'FF')).toEqual({ x: 1, y: 4, heading: 'W' });
  });

  it('handles complex navigation', () => {
    // Start at (1,2) facing N, commands: LFLFLFLFF
    const result = moveRover({ x: 1, y: 2, heading: 'N' }, 'LFLFLFLFF');
    expect(result).toEqual({ x: 1, y: 3, heading: 'N' });
  });

  it('handles complex navigation 2', () => {
    // Start at (3,3) facing E, commands: FFRFFLF
    const result = moveRover({ x: 3, y: 3, heading: 'E' }, 'FFRFFLF');
    expect(result).toEqual({ x: 6, y: 1, heading: 'E' });
  });
});
