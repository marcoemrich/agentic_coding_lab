import { describe, it, expect } from 'vitest';
import { Rover } from './mars-rover';

describe('Mars Rover', () => {
  describe('initial state', () => {
    it('starts at given position and heading', () => {
      const rover = new Rover(0, 0, 'N');
      expect(rover.x).toBe(0);
      expect(rover.y).toBe(0);
      expect(rover.heading).toBe('N');
    });
  });

  describe('turning left', () => {
    it('turns from N to W', () => {
      const rover = new Rover(0, 0, 'N');
      rover.execute('L');
      expect(rover.heading).toBe('W');
    });

    it('turns from W to S', () => {
      const rover = new Rover(0, 0, 'W');
      rover.execute('L');
      expect(rover.heading).toBe('S');
    });

    it('turns from S to E', () => {
      const rover = new Rover(0, 0, 'S');
      rover.execute('L');
      expect(rover.heading).toBe('E');
    });

    it('turns from E to N', () => {
      const rover = new Rover(0, 0, 'E');
      rover.execute('L');
      expect(rover.heading).toBe('N');
    });
  });

  describe('turning right', () => {
    it('turns from N to E', () => {
      const rover = new Rover(0, 0, 'N');
      rover.execute('R');
      expect(rover.heading).toBe('E');
    });

    it('turns from E to S', () => {
      const rover = new Rover(0, 0, 'E');
      rover.execute('R');
      expect(rover.heading).toBe('S');
    });

    it('turns from S to W', () => {
      const rover = new Rover(0, 0, 'S');
      rover.execute('R');
      expect(rover.heading).toBe('W');
    });

    it('turns from W to N', () => {
      const rover = new Rover(0, 0, 'W');
      rover.execute('R');
      expect(rover.heading).toBe('N');
    });
  });

  describe('moving forward', () => {
    it('moves north increases y', () => {
      const rover = new Rover(0, 0, 'N');
      rover.execute('F');
      expect(rover.x).toBe(0);
      expect(rover.y).toBe(1);
    });

    it('moves east increases x', () => {
      const rover = new Rover(0, 0, 'E');
      rover.execute('F');
      expect(rover.x).toBe(1);
      expect(rover.y).toBe(0);
    });

    it('moves south decreases y', () => {
      const rover = new Rover(0, 0, 'S');
      rover.execute('F');
      expect(rover.x).toBe(0);
      expect(rover.y).toBe(-1);
    });

    it('moves west decreases x', () => {
      const rover = new Rover(0, 0, 'W');
      rover.execute('F');
      expect(rover.x).toBe(-1);
      expect(rover.y).toBe(0);
    });
  });

  describe('command sequences', () => {
    it('executes multiple commands', () => {
      const rover = new Rover(0, 0, 'N');
      rover.execute('FFRFF');
      expect(rover.x).toBe(2);
      expect(rover.y).toBe(2);
      expect(rover.heading).toBe('E');
    });

    it('can turn and move', () => {
      const rover = new Rover(0, 0, 'N');
      rover.execute('RFFLFF');
      expect(rover.x).toBe(2);
      expect(rover.y).toBe(2);
      expect(rover.heading).toBe('N');
    });

    it('handles negative coordinates', () => {
      const rover = new Rover(0, 0, 'S');
      rover.execute('FFF');
      expect(rover.x).toBe(0);
      expect(rover.y).toBe(-3);
    });

    it('starts at non-zero position', () => {
      const rover = new Rover(3, 5, 'E');
      rover.execute('FF');
      expect(rover.x).toBe(5);
      expect(rover.y).toBe(5);
    });
  });
});
