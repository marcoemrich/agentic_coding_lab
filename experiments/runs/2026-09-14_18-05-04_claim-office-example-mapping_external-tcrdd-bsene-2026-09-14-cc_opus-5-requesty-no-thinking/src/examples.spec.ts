import { describe, it, expect } from 'vitest';
import { quote } from './quote';
import { Policy, insuranceSum } from './policy';

/**
 * The worked examples from the MHPCO specification, kept as regression
 * tests over the behaviour driven out in the unit specs.
 */
describe('MHPCO specification examples', () => {
  describe('building block of 3 alike components', () => {
    const runes = (count: number) => Array.from({ length: count }, () => ({ type: 'rune' }));

    it('prices blocks only at exactly three of a kind', () => {
      // premiums below include the 10 % first-insurance surcharge and the 5 G fee
      expect(quote(runes(2))).toBe(60); // base 50
      expect(quote(runes(3))).toBe(71); // base 60 (block)
      expect(quote(runes(4))).toBe(115); // base 100
      expect(quote(runes(7))).toBe(198); // base 175
    });

    it('treats alike as the same component type', () => {
      expect(quote([{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }])).toBe(88); // base 75
      expect(
        quote([...runes(3), { type: 'moonstone' }, { type: 'moonstone' }, { type: 'moonstone' }]),
      ).toBe(137); // base 120, two blocks
    });
  });

  describe('modifier scope on multi-item policies', () => {
    it('applies curse to the cursed item only', () => {
      // base 160, curse 50, first insurance 16, fee 5
      expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toBe(231);
    });
  });

  describe('modifier thresholds', () => {
    it('grants loyalty at exactly two years', () => {
      expect(quote([{ type: 'sword' }], { yearsWithMHPCO: 2 })).toBe(95);
    });

    it('surcharges at exactly enchantment 5, and stacks with a curse', () => {
      expect(quote([{ type: 'sword', enchantment: 5 }])).toBe(145);
      expect(quote([{ type: 'sword', enchantment: 5, cursed: true }])).toBe(195);
      expect(quote([{ type: 'sword', enchantment: 4 }])).toBe(115);
      expect(quote([{ type: 'sword', enchantment: 4, cursed: true }])).toBe(165);
    });

    it('halves the payout at exactly enchantment 8', () => {
      const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
      expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
    });
  });

  describe('deductible per damage event', () => {
    it('deducts 100 G once per damaged item', () => {
      const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
      expect(
        policy.claim([
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 },
        ]).payout,
      ).toBe(600);
    });
  });

  describe('standard reimbursement', () => {
    it('reimburses in full minus the deductible when no clause applies', () => {
      const sword = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
      expect(sword.claim([{ itemType: 'sword', amount: 500 }]).payout).toBe(400);

      const rune = new Policy([{ type: 'rune' }]);
      expect(rune.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
    });
  });

  describe('enchantment threshold vs. dragon material', () => {
    it('lets the 50 % rule win over full dragon reimbursement', () => {
      const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
      expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
    });

    it('reimburses dragon material in full below the enchantment threshold', () => {
      const policy = new Policy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
      expect(policy.claim([{ itemType: 'sword', amount: 800 }]).payout).toBe(700);
    });

    it('halves the payout for a highly enchanted item of ordinary material', () => {
      const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
      expect(policy.claim([{ itemType: 'sword', amount: 1000 }]).payout).toBe(400);
    });
  });

  describe('multiple items of the same type', () => {
    it('insures each copy separately', () => {
      expect(insuranceSum([{ type: 'sword' }, { type: 'sword' }])).toBe(2000);
    });

    it('gives each damage entry its own deductible', () => {
      const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
      expect(
        policy.claim([
          { itemType: 'sword', amount: 500 },
          { itemType: 'sword', amount: 500 },
        ]).payout,
      ).toBe(800);
    });
  });

  describe('cap exhaustion', () => {
    it('bases the cap on unmodified insurance values', () => {
      expect(insuranceSum([{ type: 'sword' }, { type: 'amulet' }])).toBe(1600);
      expect(quote([{ type: 'sword', cursed: true }])).toBe(165);
      expect(insuranceSum([{ type: 'sword', cursed: true }])).toBe(1000);
      expect(
        insuranceSum([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]),
      ).toBe(1750);
    });
  });

  describe('integration examples', () => {
    it('quotes a newcomer with a cursed sword at 165 G', () => {
      expect(
        quote([{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }], {
          yearsWithMHPCO: 0,
        }),
      ).toBe(165);
    });

    it("quotes a long-standing customer's second contract at 160 G", () => {
      expect(
        quote(
          [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
          { yearsWithMHPCO: 3 },
          1,
        ),
      ).toBe(160);
    });
  });

  describe('edge cases', () => {
    it('charges only the processing fee for an empty item list', () => {
      expect(quote([])).toBe(5);
    });
  });
});
