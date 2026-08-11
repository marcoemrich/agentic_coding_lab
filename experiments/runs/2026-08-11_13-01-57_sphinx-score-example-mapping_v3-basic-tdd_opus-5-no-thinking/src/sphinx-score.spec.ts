import { describe, expect, it } from 'vitest'
import { scoreArmy, type Card, type Rank } from './sphinx-score.js'

const sphinx: Card = { monster: 'sphinx' }
const chimera: Card = { monster: 'chimera' }
const orthrus: Card = { monster: 'orthrus' }
const zombie: Card = { monster: 'zombie' }
const hydra: Card = { monster: 'hydra' }
const cyclops: Card = { monster: 'cyclops' }
const undeadWarrior = (rank: Rank): Card => ({ monster: 'undead-warrior', rank })

describe('scoreArmy', () => {
  it('scores nothing for an army without a Sphinx', () => {
    expect(scoreArmy([chimera, orthrus, zombie])).toBe(0)
  })

  it('scores nothing for an empty army', () => {
    expect(scoreArmy([])).toBe(0)
  })

  describe('a Sphinx does not count itself towards the types', () => {
    it('scores 2 for a Sphinx among two other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus])).toBe(2)
    })

    it('scores 3 for a Sphinx among four other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra])).toBe(3)
    })

    it('scores 5 for a Sphinx among five other types', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra, cyclops])).toBe(5)
    })
  })

  describe('a second Sphinx', () => {
    it('counts the other Sphinx as a type', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus])).toBe(4)
    })

    it('scores each Sphinx separately', () => {
      expect(scoreArmy([sphinx, sphinx, chimera, orthrus, zombie])).toBe(6)
    })
  })

  describe('beyond three types', () => {
    it('awards a single point when not beyond three types', () => {
      expect(scoreArmy([sphinx, cyclops])).toBe(2)
    })

    it('awards two points per type beyond three', () => {
      expect(scoreArmy([sphinx, chimera, orthrus, zombie, hydra, cyclops])).toBe(5)
    })
  })

  describe('Undead Warrior variants', () => {
    it('treats all ranks as a single type', () => {
      expect(scoreArmy([sphinx, undeadWarrior(1), undeadWarrior(3), chimera])).toBe(2)
    })

    it('counts the Undead Warrior once among many types', () => {
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
      ).toBe(3)
    })
  })

  it('counts several cards of the same monster as one type', () => {
    expect(scoreArmy([sphinx, chimera, chimera, chimera, orthrus, orthrus])).toBe(2)
  })
})
