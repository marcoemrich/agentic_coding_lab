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
  it('scores nothing when the army has no Sphinx', () => {
    expect(scoreArmy([chimera, orthrus, zombie])).toBe(0);
  });

  it('scores nothing for an empty army', () => {
    expect(scoreArmy([])).toBe(0);
  });

  describe('a Sphinx counts itself among the types', () => {
    it('scores 2 for three types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2);
    });

    it('scores 5 for six types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra, cyclops])).toBe(5);
    });
  });

  describe('"else 1" is a single point, not one per type', () => {
    it('scores 2 for two types', () => {
      expect(scoreArmy([sphinx, cyclops])).toBe(2);
    });

    it('scores 2 for three types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2);
    });
  });

  describe('a second Sphinx scores in its own right', () => {
    it('scores each of two Sphinxes at three types', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus])).toBe(4);
    });

    it('scores each of two Sphinxes at four types', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus, zombie])).toBe(6);
    });
  });

  describe('Undead Warrior variants are one type, not three', () => {
    it('counts two ranks as a single type', () => {
      expect(scoreArmy([sphinx, undeadWarrior(1), undeadWarrior(3), chimera])).toBe(2);
    });

    it('counts all three ranks as a single type', () => {
      const army = [
        sphinx,
        undeadWarrior(1),
        undeadWarrior(2),
        undeadWarrior(3),
        cyclops,
        orthrus,
        chimera,
      ];
      // Five types: sphinx, undead-warrior, cyclops, orthrus, chimera.
      expect(scoreArmy(army)).toBe(3);
    });
  });

  it('counts repeated cards of one monster as a single type', () => {
    expect(scoreArmy([sphinx, chimera, chimera, chimera, orthrus, orthrus])).toBe(2);
  });

  it('gains 2 points for every second type beyond three', () => {
    const beyondThree = [zombie, hydra, cyclops, undeadWarrior(2)];
    const scoreWith = (extra: Card[]) => scoreArmy([sphinx, chimera, orthrus, ...extra]);

    expect(scoreWith(beyondThree.slice(0, 0))).toBe(2); // 3 types
    expect(scoreWith(beyondThree.slice(0, 1))).toBe(3); // 4 types
    expect(scoreWith(beyondThree.slice(0, 2))).toBe(3); // 5 types
    expect(scoreWith(beyondThree.slice(0, 3))).toBe(5); // 6 types
    expect(scoreWith(beyondThree.slice(0, 4))).toBe(5); // 7 types
  });

  it('scores 3 for five types', () => {
    expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra])).toBe(3);
  });
});
