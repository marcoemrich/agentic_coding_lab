import { describe, it, expect } from 'vitest';
import { calculateQuote, processClaim } from './core';
import type { Policy } from './types';

describe('Quote Calculation', () => {
  describe('base premiums for main items', () => {
    it('calculates premium for a single sword', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
      );
      // 100 G base + 10 G first insurance (10% of 100) + 5 G fee = 115 G
      expect(result.premium).toBe(115);
    });

    it('calculates premium for a single amulet', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }]
      );
      // 60 G base + 6 G first insurance (10% of 60) + 5 G fee = 71 G
      expect(result.premium).toBe(71);
    });

    it('calculates premium for a single staff', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'staff', material: 'oak', enchantment: 0, cursed: false }]
      );
      // 80 G base + 8 G first insurance (10% of 80) + 5 G fee = 93 G
      expect(result.premium).toBe(93);
    });

    it('calculates premium for a single potion', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'potion', material: 'liquid', enchantment: 0, cursed: false }]
      );
      // 40 G base + 4 G first insurance (10% of 40) + 5 G fee = 49 G
      expect(result.premium).toBe(49);
    });
  });

  describe('components', () => {
    it('calculates premium for a single rune', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }]
      );
      // 25 G base + 2.5 G first insurance (10% of 25) + 5 G fee = 32.5 → ceil = 33 G
      expect(result.premium).toBe(33);
    });

    it('calculates premium for 2 runes', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false }
        ]
      );
      // 50 G base (2 × 25) + 5 G first insurance (10% of 50) + 5 G fee = 60 G
      expect(result.premium).toBe(60);
    });

    it('calculates premium for 3 runes (block applies)', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false }
        ]
      );
      // 60 G base (block) + 6 G first insurance (10% of 60) + 5 G fee = 71 G
      expect(result.premium).toBe(71);
    });

    it('calculates premium for 4 runes (no block)', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false }
        ]
      );
      // 100 G base (4 × 25) + 10 G first insurance (10% of 100) + 5 G fee = 115 G
      expect(result.premium).toBe(115);
    });

    it('calculates premium for 7 runes', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false })
      );
      // 175 G base (7 × 25) + 17.5 G first insurance + 5 G fee = 197.5 → ceil = 198 G
      expect(result.premium).toBe(198);
    });

    it('does not apply block for 3 runes when mixed with other types', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'moonstone', material: 'gem', enchantment: 0, cursed: false }
        ]
      );
      // 75 G base (2 runes × 25 + 1 moonstone × 25) + 7.5 G first insurance + 5 G fee = 87.5 → ceil = 88 G
      expect(result.premium).toBe(88);
    });

    it('applies block separately for different component types', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'rune', material: 'stone', enchantment: 0, cursed: false },
          { type: 'moonstone', material: 'gem', enchantment: 0, cursed: false },
          { type: 'moonstone', material: 'gem', enchantment: 0, cursed: false },
          { type: 'moonstone', material: 'gem', enchantment: 0, cursed: false }
        ]
      );
      // 120 G base (60 G rune block + 60 G moonstone block) + 12 G first insurance + 5 G fee = 137 G
      expect(result.premium).toBe(137);
    });
  });

  describe('cursed modifier', () => {
    it('adds 50% surcharge to a cursed sword', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: true }]
      );
      // 100 G base + 50 G curse (50% of 100) + 10 G first insurance + 5 G fee = 165 G
      expect(result.premium).toBe(165);
    });

    it('applies curse surcharge only to the cursed item', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: true },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }
        ]
      );
      // 100 G sword base + 50 G curse + 60 G amulet base = 210 G
      // + 16 G first insurance (10% of 160) + 5 G fee = 231 G
      expect(result.premium).toBe(231);
    });
  });

  describe('high enchantment modifier', () => {
    it('adds 30% surcharge for enchantment >= 5', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: false }]
      );
      // 100 G base + 30 G enchantment (30% of 100) + 10 G first insurance + 5 G fee = 145 G
      expect(result.premium).toBe(145);
    });

    it('does not add surcharge for enchantment < 5', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 4, cursed: false }]
      );
      // 100 G base + 10 G first insurance + 5 G fee = 115 G
      expect(result.premium).toBe(115);
    });

    it('applies both curse and enchantment surcharges', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 5, cursed: true }]
      );
      // 100 G base + 50 G curse + 30 G enchantment + 10 G first insurance + 5 G fee = 195 G
      expect(result.premium).toBe(195);
    });
  });

  describe('loyalty discount', () => {
    it('applies 20% loyalty discount for customers with >= 2 years', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 2 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
      );
      // 100 G base + 10 G first insurance - 20 G loyalty (20% of 100) + 5 G fee = 95 G
      expect(result.premium).toBe(95);
    });

    it('does not apply loyalty discount for < 2 years', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 1 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
      );
      // 100 G base + 10 G first insurance + 5 G fee = 115 G
      expect(result.premium).toBe(115);
    });
  });

  describe('first insurance surcharge', () => {
    it('applies 10% first insurance surcharge', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 5 },
        [{ type: 'amulet', material: 'silver', enchantment: 0, cursed: false }]
      );
      // 60 G base + 6 G first insurance - 12 G loyalty (20% of 60) + 5 G fee = 59 G
      expect(result.premium).toBe(59);
    });
  });

  describe('processing fee', () => {
    it('adds 5 G processing fee', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
      );
      // Premium without fee would be 110 G, with fee is 115 G
      expect(result.premium).toBe(115);
    });

    it('adds 5 G processing fee for empty item list', () => {
      const result = calculateQuote({ yearsWithMHPCO: 0 }, []);
      expect(result.premium).toBe(5);
    });
  });

  describe('rounding in MHPCO favor', () => {
    it('rounds up premiums when fractional', () => {
      // Test with a value that should round up
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        Array(7).fill({ type: 'rune', material: 'stone', enchantment: 0, cursed: false })
      );
      // 175 + 17.5 + 5 = 197.5 → ceil = 198
      expect(result.premium).toBe(198);
    });
  });

  describe('policy creation', () => {
    it('returns policy with correct insurance sum', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }
        ]
      );
      // Insurance sum: 1000 (sword) + 600 (amulet) = 1600
      expect(result.policy.insuranceSum).toBe(1600);
    });

    it('calculates cap as twice the insurance sum', () => {
      const result = calculateQuote(
        { yearsWithMHPCO: 0 },
        [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }]
      );
      // Cap: 2 × 1000 = 2000
      expect(result.policy.cap).toBe(2000);
    });

    it('includes items in policy', () => {
      const items = [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }];
      const result = calculateQuote({ yearsWithMHPCO: 0 }, items);
      expect(result.policy.items).toEqual(items);
    });
  });

  describe('error handling', () => {
    it('raises error for unknown item type', () => {
      expect(() => {
        calculateQuote(
          { yearsWithMHPCO: 0 },
          [{ type: 'broomstick', material: 'wood', enchantment: 0, cursed: false } as any]
        );
      }).toThrow();
    });
  });
});

describe('Claim Processing', () => {
  describe('base payout calculation', () => {
    it('calculates payout with 100 G deductible', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 500 }]
      });
      // Payout: 500 - 100 (deductible) = 400
      expect(result.payout).toBe(400);
    });

    it('processes rune damage without special clause', () => {
      const policy: Policy = {
        insuranceSum: 250,
        cap: 500,
        items: [{ type: 'rune', material: 'stone', enchantment: 0, cursed: false }],
        remainingCap: 500
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'rune', amount: 200 }]
      });
      // Payout: 200 - 100 (deductible) = 100
      expect(result.payout).toBe(100);
    });
  });

  describe('high enchantment clause (>=8)', () => {
    it('reimburses at 50% for enchantment >= 8', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 8, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1000 }]
      });
      // Payout: (1000 × 50%) - 100 (deductible) = 500 - 100 = 400
      expect(result.payout).toBe(400);
    });

    it('does not apply 50% clause for enchantment < 8', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 7, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1000 }]
      });
      // Payout: 1000 - 100 (deductible) = 900
      expect(result.payout).toBe(900);
    });
  });

  describe('dragon material clause', () => {
    it('fully reimburses dragon material damage', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'dragon', enchantment: 3, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 500 }]
      });
      // Payout: 500 - 100 (deductible) = 400
      expect(result.payout).toBe(400);
    });

    it('applies 50% clause when both high enchantment and dragon material exist', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'dragon', enchantment: 8, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1000 }]
      });
      // Both clauses apply; 50% wins: (1000 × 50%) - 100 = 400
      expect(result.payout).toBe(400);
    });

    it('applies dragon material clause with enchantment < 8', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'dragon', enchantment: 5, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 800 }]
      });
      // Only dragon clause applies: 800 - 100 = 700
      expect(result.payout).toBe(700);
    });
  });

  describe('multiple damages per event', () => {
    it('applies deductible per damaged item', () => {
      const policy: Policy = {
        insuranceSum: 1600,
        cap: 3200,
        items: [
          { type: 'sword', material: 'steel', enchantment: 0, cursed: false },
          { type: 'amulet', material: 'silver', enchantment: 0, cursed: false }
        ],
        remainingCap: 3200
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 500 },
          { itemType: 'amulet', amount: 300 }
        ]
      });
      // Payout: (500 - 100) + (300 - 100) = 400 + 200 = 600
      expect(result.payout).toBe(600);
    });
  });

  describe('cap exhaustion', () => {
    it('caps payout at twice insurance sum', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        remainingCap: 2000
      };
      const result = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 3000 }]
      });
      // Damage is 3000, deductible 100 → 2900, capped at 2000
      expect(result.payout).toBe(2000);
    });

    it('tracks remaining cap across claims', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        remainingCap: 2000
      };
      const claim1 = processClaim(policy, {
        cause: 'fire',
        damages: [{ itemType: 'sword', amount: 1500 }]
      });
      // Payout: 1500 - 100 = 1400
      expect(claim1.payout).toBe(1400);
      expect(claim1.remainingCap).toBe(600);

      const policy2 = { ...policy, remainingCap: claim1.remainingCap };
      const claim2 = processClaim(policy2, {
        cause: 'dragon',
        damages: [{ itemType: 'sword', amount: 1500 }]
      });
      // Damage 1500 - 100 = 1400, but capped at 600 remaining
      expect(claim2.payout).toBe(600);
      expect(claim2.remainingCap).toBe(0);
    });
  });

  describe('error handling', () => {
    it('raises error for unknown item type in damage', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        remainingCap: 2000
      };
      expect(() => {
        processClaim(policy, {
          cause: 'fire',
          damages: [{ itemType: 'amulet', amount: 500 }]
        });
      }).toThrow();
    });

    it('raises error for negative damage amount', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        remainingCap: 2000
      };
      expect(() => {
        processClaim(policy, {
          cause: 'fire',
          damages: [{ itemType: 'sword', amount: -200 }]
        });
      }).toThrow();
    });

    it('raises error for more damages than insured items', () => {
      const policy: Policy = {
        insuranceSum: 1000,
        cap: 2000,
        items: [{ type: 'sword', material: 'steel', enchantment: 0, cursed: false }],
        remainingCap: 2000
      };
      expect(() => {
        processClaim(policy, {
          cause: 'fire',
          damages: [
            { itemType: 'sword', amount: 500 },
            { itemType: 'sword', amount: 300 }
          ]
        });
      }).toThrow();
    });
  });
});

describe('Integration examples', () => {
  it('handles newcomer with cursed sword', () => {
    const result = calculateQuote(
      { yearsWithMHPCO: 0 },
      [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }]
    );
    // 100 G base + 50 G curse + 10 G first insurance + 5 G fee = 165 G
    expect(result.premium).toBe(165);
  });

  it('handles long-standing customer second contract', () => {
    // This is the customer's second quote, so isFollowUp = true
    const result = calculateQuote(
      { yearsWithMHPCO: 3 },
      [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }],
      true // isFollowUp
    );
    // 100 G base + 50 G curse + 30 G enchantment - 20 G loyalty + 10 G first insurance - 15 G follow-up + 5 G fee
    // = 100 + 50 + 30 - 20 + 10 - 15 + 5 = 160 G
    expect(result.premium).toBe(160);
  });
});
