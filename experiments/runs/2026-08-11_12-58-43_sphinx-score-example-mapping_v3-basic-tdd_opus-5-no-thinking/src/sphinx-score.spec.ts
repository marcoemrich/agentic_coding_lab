import { describe, it, expect } from 'vitest';
import { sphinxScore, type Army } from './sphinx-score.js';

const army = (...cards: Array<string | [string, number]>): Army =>
  cards.map((card) =>
    typeof card === 'string'
      ? { monster: card as Army[number]['monster'] }
      : { monster: card[0] as Army[number]['monster'], rank: card[1] },
  );

describe('sphinx scoring', () => {
  describe('a sphinx does not count itself towards the types', () => {
    it('scores 2 for a sphinx alongside two other types', () => {
      expect(sphinxScore(army('sphinx', 'chimera', 'orthrus'))).toBe(2);
    });

    it('scores 3 for a sphinx alongside four other types', () => {
      expect(
        sphinxScore(army('sphinx', 'chimera', 'orthrus', 'zombie', 'hydra')),
      ).toBe(3);
    });

    it('scores 5 for a sphinx alongside five other types', () => {
      expect(
        sphinxScore(
          army('sphinx', 'chimera', 'orthrus', 'zombie', 'hydra', 'cyclops'),
        ),
      ).toBe(5);
    });
  });

  describe('a second sphinx counts as a type for the other sphinx', () => {
    it('scores 4 when two sphinxes each see three types', () => {
      expect(sphinxScore(army('sphinx', 'sphinx', 'chimera', 'orthrus'))).toBe(
        4,
      );
    });

    it('scores 6 when two sphinxes each see four types', () => {
      expect(
        sphinxScore(army('sphinx', 'sphinx', 'chimera', 'orthrus', 'zombie')),
      ).toBe(6);
    });
  });

  describe('the "else 1" bonus is awarded once, not per type', () => {
    it('scores 2 for a sphinx with a single other type', () => {
      expect(sphinxScore(army('sphinx', 'cyclops'))).toBe(2);
    });

    it('scores 2 for a sphinx with exactly three types', () => {
      expect(sphinxScore(army('sphinx', 'chimera', 'orthrus'))).toBe(2);
    });
  });

  describe('undead warrior variants are a single type', () => {
    it('treats two ranks of undead warrior as one type', () => {
      expect(
        sphinxScore(
          army('sphinx', ['undead-warrior', 1], ['undead-warrior', 3], 'chimera'),
        ),
      ).toBe(2);
    });

    it('treats all three ranks of undead warrior as one type', () => {
      expect(
        sphinxScore(
          army(
            'sphinx',
            ['undead-warrior', 1],
            ['undead-warrior', 2],
            ['undead-warrior', 3],
            'cyclops',
            'orthrus',
            'chimera',
          ),
        ),
      ).toBe(3);
    });
  });

  describe('duplicate cards of the same monster', () => {
    it('counts repeated monsters as a single type', () => {
      expect(
        sphinxScore(
          army('sphinx', 'chimera', 'chimera', 'chimera', 'orthrus', 'orthrus'),
        ),
      ).toBe(2);
    });
  });

  describe('armies without a sphinx', () => {
    it('scores 0 when no sphinx is present', () => {
      expect(sphinxScore(army('chimera', 'orthrus', 'zombie'))).toBe(0);
    });

    it('scores 0 for an empty army', () => {
      expect(sphinxScore(army())).toBe(0);
    });
  });

  describe('a lone sphinx', () => {
    it('scores 2: one point for the card and the "else 1" bonus', () => {
      expect(sphinxScore(army('sphinx'))).toBe(2);
    });
  });
});
