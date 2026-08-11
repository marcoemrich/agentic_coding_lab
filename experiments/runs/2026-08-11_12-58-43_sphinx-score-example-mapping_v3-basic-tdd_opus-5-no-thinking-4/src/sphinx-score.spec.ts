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
  describe('a Sphinx counts the other monsters in the army', () => {
    it('scores 2 for three types, which is not beyond three', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2);
    });

    it('scores 3 when one type lies beyond three', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra])).toBe(3);
    });

    it('scores 5 when two types lie beyond three', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra, cyclops])).toBe(5);
    });
  });

  describe('a second Sphinx', () => {
    it('lets each Sphinx count the other as a type', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus])).toBe(4);
    });

    it('pushes both Sphinxes beyond three types', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus, zombie])).toBe(6);
    });
  });

  describe('the "else 1" bonus is awarded once, not per type', () => {
    it('scores 2 for a lone companion', () => {
      expect(scoreArmy([sphinx, cyclops])).toBe(2);
    });

    it('scores 2 for two companions', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2);
    });
  });

  describe('Undead Warrior variants are one type', () => {
    it('treats ranks 1 and 3 as a single type', () => {
      expect(scoreArmy([sphinx, undeadWarrior(1), undeadWarrior(3), chimera])).toBe(2);
    });

    it('treats all three ranks as a single type', () => {
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

  describe('duplicates', () => {
    it('counts several cards of the same monster as one type', () => {
      expect(scoreArmy([sphinx, chimera, chimera, chimera, orthrus, orthrus])).toBe(2);
    });
  });

  describe('no Sphinx', () => {
    it('scores nothing', () => {
      expect(scoreArmy([chimera, orthrus, zombie])).toBe(0);
    });

    it('scores nothing for an empty army', () => {
      expect(scoreArmy([])).toBe(0);
    });
  });

  describe('a lone Sphinx', () => {
    it('scores its own point plus the flat bonus', () => {
      expect(scoreArmy([sphinx])).toBe(2);
    });
  });
});
