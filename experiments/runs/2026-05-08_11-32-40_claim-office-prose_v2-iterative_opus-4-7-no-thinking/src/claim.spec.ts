import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import { Policy } from './types.js';

describe('processClaim', () => {
  it('applies the 100 G deductible per damage event', () => {
    const policy: Policy = {
      items: [{ type: 'amulet', enchantment: 2 }],
      insuranceSum: 600,
      remainingCap: 1200,
    };
    const out = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(out.payout).toBe(100); // 200 - 100 deductible
    expect(out.remainingCap).toBe(1100);
  });

  it('reimburses 50% on items with enchantment >= 8', () => {
    const policy: Policy = {
      items: [{ type: 'staff', enchantment: 9 }],
      insuranceSum: 800,
      remainingCap: 1600,
    };
    const out = processClaim(policy, {
      damages: [{ itemType: 'staff', amount: 400 }],
    });
    // 400 * 0.5 = 200; 200 - 100 = 100
    expect(out.payout).toBe(100);
    expect(out.remainingCap).toBe(1500);
  });

  it('reimburses fully for dragon-material items even with high enchantment', () => {
    const policy: Policy = {
      items: [{ type: 'sword', material: 'dragon', enchantment: 10 }],
      insuranceSum: 1000,
      remainingCap: 2000,
    };
    const out = processClaim(policy, {
      damages: [{ itemType: 'sword', amount: 500 }],
    });
    // 500 - 100 = 400
    expect(out.payout).toBe(400);
    expect(out.remainingCap).toBe(1600);
  });

  it('payout is zero if damage is below deductible', () => {
    const policy: Policy = {
      items: [{ type: 'amulet' }],
      insuranceSum: 600,
      remainingCap: 1200,
    };
    const out = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 50 }],
    });
    expect(out.payout).toBe(0);
    expect(out.remainingCap).toBe(1200);
  });

  it('payout is capped at remaining cap', () => {
    const policy: Policy = {
      items: [{ type: 'amulet' }],
      insuranceSum: 600,
      remainingCap: 50,
    };
    const out = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 1000 }],
    });
    // 1000 - 100 = 900, but capped at 50
    expect(out.payout).toBe(50);
    expect(out.remainingCap).toBe(0);
  });

  it('cap is 2 x insurance sum and decreases across claims', () => {
    const policy: Policy = {
      items: [{ type: 'amulet' }],
      insuranceSum: 600,
      remainingCap: 1200,
    };
    const a = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 200 }],
    });
    expect(a.remainingCap).toBe(1100);
    const b = processClaim(policy, {
      damages: [{ itemType: 'amulet', amount: 250 }],
    });
    // 250 - 100 = 150; remaining 1100 - 150 = 950
    expect(b.payout).toBe(150);
    expect(b.remainingCap).toBe(950);
  });

  it('one deductible per incident, even with multiple damages', () => {
    const policy: Policy = {
      items: [
        { type: 'sword' },
        { type: 'amulet' },
      ],
      insuranceSum: 1600,
      remainingCap: 3200,
    };
    const out = processClaim(policy, {
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'amulet', amount: 150 },
      ],
    });
    // total reimbursable 200 + 150 = 350; minus 100 deductible = 250
    expect(out.payout).toBe(250);
    expect(out.remainingCap).toBe(2950);
  });
});
