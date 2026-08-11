import { describe, expect, it } from 'vitest';

import { scoreArmy, type Card } from './sphinx-score.js';

const sphinx: Card = { monster: 'sphinx' };
const chimera: Card = { monster: 'chimera' };
const orthrus: Card = { monster: 'orthrus' };
const zombie: Card = { monster: 'zombie' };
const hydra: Card = { monster: 'hydra' };
const cyclops: Card = { monster: 'cyclops' };
const undeadWarrior = (rank: 1 | 2 | 3): Card => ({ monster: 'undead-warrior', rank });

describe('scoreArmy', () => {
  it('scores nothing for an army without a Sphinx', () => {
    expect(scoreArmy([chimera, orthrus, zombie])).toBe(0);
  });

  it('scores nothing for an empty army', () => {
    expect(scoreArmy([])).toBe(0);
  });

  describe('a Sphinx does not count itself as a type', () => {
    it('scores 2 for a Sphinx among two other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2);
    });

    it('scores 3 for a Sphinx among four other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra])).toBe(3);
    });

    it('scores 5 for a Sphinx among five other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra, cyclops])).toBe(5);
    });
  });

  describe('a second Sphinx', () => {
    it('counts the other Sphinx as a type, for each of them', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus])).toBe(4);
    });

    it('scores each Sphinx beyond three types once the other Sphinx tips the count', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus, zombie])).toBe(6);
    });
  });

  describe('at most three types scores one point once, not one per type', () => {
    it('scores 2 for a Sphinx with a single other type', () => {
      expect(scoreArmy([sphinx, cyclops])).toBe(2);
    });
  });

  describe('Undead Warrior variants are a single type', () => {
    it('treats two ranks as one type', () => {
      expect(scoreArmy([sphinx, undeadWarrior(1), undeadWarrior(3), chimera])).toBe(2);
    });

    it('treats all three ranks as one type', () => {
      expect(
        scoreArmy([
          sphinx,
          undeadWarrior(1),
          undeadWarrior(2),
          undeadWarrior(3),
          cyclops,
          orthrus,
          chimera,
        ]),
      ).toBe(3);
    });
  });

  describe('duplicate cards of the same monster', () => {
    it('counts a monster once however many copies are in the army', () => {
      expect(scoreArmy([sphinx, chimera, chimera, chimera, orthrus, orthrus])).toBe(2);
    });
  });
});
