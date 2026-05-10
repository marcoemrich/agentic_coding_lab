import { describe, it, expect } from 'vitest';
import { processClaim, Policy } from './claim.js';

function makePolicy(items: Array<{ type: string; insurance?: number }>, capMultiplier = 2): Policy {
  const insuranceSum = items.reduce((sum, item) => {
    const val = item.insurance ?? getInsuranceValue(item.type);
    return sum + val;
  }, 0);
  return {
    items,
    insuranceSum,
    cap: insuranceSum * capMultiplier,
    remainingCap: insuranceSum * capMultiplier,
  };
}

function getInsuranceValue(type: string): number {
  switch (type) {
    case 'sword': return 1000;
    case 'amulet': return 600;
    case 'staff': return 800;
    case 'potion': return 400;
    case 'rune':
    case 'moonstone': return 250;
    default: return 0;
  }
}

describe('processClaim - standard reimbursement', () => {
  it('regular sword (steel, enchantment 3), damage 500 G → payout 400 G', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 500, material: 'steel', enchantment: 3 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(400);
  });

  it('rune damage 200 G → payout 100 G', () => {
    const policy = makePolicy([{ type: 'rune' }]);
    const damages = [{ itemType: 'rune', amount: 200 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(100);
  });

  it('damage ≤ deductible → payout 0', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 100, material: 'steel', enchantment: 0 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(0);
  });
});

describe('processClaim - high enchantment (≥8 → 50% reimbursement)', () => {
  it('dragon-material sword, enchantment 8, damage 1000 G → payout 400 G', () => {
    // 50% of 1000 = 500, minus deductible 100 = 400
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 1000, material: 'dragon', enchantment: 8 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(400);
  });

  it('steel sword, enchantment 9, damage 1000 G → payout 400 G', () => {
    // 50% of 1000 = 500, minus deductible 100 = 400
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 1000, material: 'steel', enchantment: 9 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(400);
  });
});

describe('processClaim - dragon material (full reimbursement)', () => {
  it('dragon-material sword, enchantment 5, damage 800 G → payout 700 G', () => {
    // Dragon full reimbursement: 800 - 100 = 700 (enchantment < 8 so no 50% rule)
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 800, material: 'dragon', enchantment: 5 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(700);
  });
});

describe('processClaim - both clauses: high enchantment wins', () => {
  it('dragon-material sword, enchantment 9, damage 1000 G → payout 400 G (50% wins)', () => {
    // Both apply: 50% of 1000 = 500, minus 100 = 400
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 1000, material: 'dragon', enchantment: 9 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(400);
  });
});

describe('processClaim - deductible per damage event', () => {
  it('dragon attack damages sword (500 G) and amulet (300 G) → payout 600 G', () => {
    // Each item: sword payout = 500-100=400, amulet payout = 300-100=200, total = 600
    const policy = makePolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const damages = [
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 }
    ];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(600);
  });
});

describe('processClaim - cap exhaustion', () => {
  it('first claim 1500 G on sword (cap 2000) → payout 1400, remaining 600', () => {
    const policy = makePolicy([{ type: 'sword' }]); // cap = 2000
    const damages = [{ itemType: 'sword', amount: 1500, material: 'steel', enchantment: 0 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(1400);
    expect(result.remainingCap).toBe(600);
  });

  it('second claim 1500 G with 600 remaining cap → payout 600, remaining 0', () => {
    const policy: Policy = {
      items: [{ type: 'sword' }],
      insuranceSum: 1000,
      cap: 2000,
      remainingCap: 600,
    };
    const damages = [{ itemType: 'sword', amount: 1500, material: 'steel', enchantment: 0 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(600);
    expect(result.remainingCap).toBe(0);
  });
});

describe('processClaim - multiple items of same type', () => {
  it('two swords policy, two sword damages → each treated separately', () => {
    const policy = makePolicy([{ type: 'sword' }, { type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 300 }
    ];
    const result = processClaim(policy, damages);
    // each: 200-100=100, 300-100=200, total=300
    expect(result.payout).toBe(300);
  });

  it('two sword damages but only one sword insured → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [
      { itemType: 'sword', amount: 200 },
      { itemType: 'sword', amount: 300 }
    ];
    expect(() => processClaim(policy, damages)).toThrow();
  });
});

describe('processClaim - error cases', () => {
  it('damage to uninsured item type → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'amulet', amount: 200 }];
    expect(() => processClaim(policy, damages)).toThrow();
  });

  it('unknown item type in damages → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'broomstick', amount: 200 }];
    expect(() => processClaim(policy, damages)).toThrow();
  });

  it('negative damage amount → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: -200 }];
    expect(() => processClaim(policy, damages)).toThrow();
  });
});

describe('processClaim - rounding in MHPCO favor (payout rounds down)', () => {
  it('payout 350.5 G → 350 G', () => {
    // 50% of damage, then deductible
    // We need enchantment >= 8 for 50% rule. damage X such that 0.5*X - 100 = 350.5
    // 0.5*X = 450.5 → X = 901. So damage=901, enchantment=8
    // 0.5*901 = 450.5 - 100 = 350.5 → floor = 350
    const policy = makePolicy([{ type: 'sword' }]);
    const damages = [{ itemType: 'sword', amount: 901, material: 'steel', enchantment: 8 }];
    const result = processClaim(policy, damages);
    expect(result.payout).toBe(350);
  });
});
