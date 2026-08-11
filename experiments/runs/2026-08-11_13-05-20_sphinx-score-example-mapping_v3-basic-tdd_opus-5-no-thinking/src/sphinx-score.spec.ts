import { describe, expect, it } from 'vitest';

import { scoreArmy, type Card } from './sphinx-score.js';

const cards = (...monsters: Card['monster'][]): Card[] =>
  monsters.map((monster) => ({ monster }));

const undeadWarrior = (rank: number): Card => ({
  monster: 'undead-warrior',
  rank,
});

describe('scoreArmy', () => {
  describe('a Sphinx counts the types around it', () => {
    it('scores 1 + 1 when the army holds three types or fewer', () => {
      expect(scoreArmy(cards('sphinx', 'chimera', 'orthrus'))).toBe(2);
    });

    it('scores 2 for each type beyond three', () => {
      expect(
        scoreArmy(cards('sphinx', 'chimera', 'orthrus', 'zombie', 'hydra')),
      ).toBe(3);

      expect(
        scoreArmy(
          cards('sphinx', 'chimera', 'orthrus', 'zombie', 'hydra', 'cyclops'),
        ),
      ).toBe(5);
    });
  });

  describe('a second Sphinx', () => {
    it('does not count itself, but does count the other Sphinx', () => {
      expect(scoreArmy(cards('sphinx', 'sphinx', 'chimera', 'orthrus'))).toBe(4);

      expect(
        scoreArmy(cards('sphinx', 'sphinx', 'chimera', 'orthrus', 'zombie')),
      ).toBe(6);
    });
  });

  describe('beyond three types', () => {
    it('awards the "else 1" once, not once per type', () => {
      expect(scoreArmy(cards('sphinx', 'cyclops'))).toBe(2);
    });
  });

  describe('Undead Warrior variants', () => {
    it('treats all three point variants as a single type', () => {
      expect(
        scoreArmy([
          { monster: 'sphinx' },
          undeadWarrior(1),
          undeadWarrior(3),
          { monster: 'chimera' },
        ]),
      ).toBe(2);

      expect(
        scoreArmy([
          { monster: 'sphinx' },
          undeadWarrior(1),
          undeadWarrior(2),
          undeadWarrior(3),
          { monster: 'cyclops' },
          { monster: 'orthrus' },
          { monster: 'chimera' },
        ]),
      ).toBe(3);
    });
  });

  describe('several cards of the same monster', () => {
    it('counts a repeated monster as one type', () => {
      expect(
        scoreArmy(
          cards('sphinx', 'chimera', 'chimera', 'chimera', 'orthrus', 'orthrus'),
        ),
      ).toBe(2);
    });
  });

  describe('armies without a Sphinx', () => {
    it('scores nothing', () => {
      expect(scoreArmy(cards('chimera', 'orthrus', 'zombie'))).toBe(0);
    });

    it('scores nothing for an empty army', () => {
      expect(scoreArmy([])).toBe(0);
    });
  });

  describe('a lone Sphinx', () => {
    it('scores its own point plus the "else 1"', () => {
      expect(scoreArmy(cards('sphinx'))).toBe(2);
    });
  });
});
