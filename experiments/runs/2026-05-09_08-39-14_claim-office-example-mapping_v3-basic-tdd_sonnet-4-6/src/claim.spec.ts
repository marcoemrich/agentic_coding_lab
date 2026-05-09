import { describe, it, expect } from 'vitest';
import { processClaim } from './claim.js';
import type { Item, Incident } from './types.js';

function makePolicy(items: Item[], remainingCap?: number) {
  const insuranceSum = items.reduce((sum, item) => {
    if (['sword', 'amulet', 'staff', 'potion'].includes(item.type)) {
      const vals: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
      return sum + vals[item.type];
    }
    return sum + 250; // component
  }, 0);
  const cap = insuranceSum * 2;
  return {
    items,
    insuranceSum,
    cap,
    remainingCap: remainingCap ?? cap,
  };
}

describe('claim processing', () => {
  it('regular sword (steel, enchantment 3), damage 500G → payout 400G', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 500 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
    expect(result.remainingCap).toBe(2000 - 400);
  });

  it('damage to rune (250G value), damage 200G → payout 100G', () => {
    const policy = makePolicy([{ type: 'rune' }]);
    const incident: Incident = { damages: [{ itemType: 'rune', amount: 200 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(100);
    expect(result.remainingCap).toBe(500 - 100);
  });

  it('enchantment ≥ 8 sword, damage 1000G → payout 400G (50% then deductible)', () => {
    // 50% of 1000 = 500, then -100 deductible = 400
    const policy = makePolicy([{ type: 'sword', enchantment: 8 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it('steel sword enchantment 9, damage 1000G → payout 400G (high-enchantment only)', () => {
    const policy = makePolicy([{ type: 'sword', material: 'steel', enchantment: 9 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it('dragon-material sword, damage 1000G → full reimbursement minus deductible', () => {
    // Dragon material: full payout - 100 deductible = 900
    const policy = makePolicy([{ type: 'sword', material: 'dragon' }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(900);
  });

  it('dragon sword enchantment 8, damage 1000G → payout 400G (50% rule wins)', () => {
    // both clauses: 50% wins over dragon full reimbursement
    // 50% of 1000 = 500, -100 = 400
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it('dragon sword enchantment 9, damage 1000G → payout 400G', () => {
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 9 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it('dragon sword enchantment 5, damage 800G → payout 700G (dragon only, enchantment < 8)', () => {
    // Only dragon clause: full reimbursement - 100 = 700
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 5 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 800 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(700);
  });

  it('dragon-material sword (enchantment 8, exactly) → payout 400G from damage 1000G', () => {
    // Example from prompt: "dragon-material sword with exactly enchantment 8, damage 1000 G → payout 400 G"
    const policy = makePolicy([{ type: 'sword', material: 'dragon', enchantment: 8 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 1000 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(400);
  });

  it('multiple items damaged: dragon attack on sword (500G) and amulet (300G) → payout 600G', () => {
    // Sword: full 500 - 100 deductible = 400
    // Amulet: full 300 - 100 deductible = 200
    // Total: 600G (deductible per item)
    const policy = makePolicy([{ type: 'sword' }, { type: 'amulet' }]);
    const incident: Incident = {
      cause: 'dragon',
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ],
    };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(600);
  });

  it('cap exhaustion: two successive claims on a sword (cap 2000G)', () => {
    const policy = makePolicy([{ type: 'sword' }]); // cap = 2000
    const incident1: Incident = { damages: [{ itemType: 'sword', amount: 1500 }] };
    const result1 = processClaim(policy, incident1);
    // Full 1500 - 100 = 1400; cap remaining = 2000 - 1400 = 600
    expect(result1.payout).toBe(1400);
    expect(result1.remainingCap).toBe(600);

    // Second claim with updated remaining cap
    const policy2 = { ...policy, remainingCap: result1.remainingCap };
    const incident2: Incident = { damages: [{ itemType: 'sword', amount: 1500 }] };
    const result2 = processClaim(policy2, incident2);
    // Desired = 1500 - 100 = 1400, but cap remaining = 600
    expect(result2.payout).toBe(600);
    expect(result2.remainingCap).toBe(0);
  });

  it('two swords policy: each damage entry treated separately with own deductible', () => {
    const policy = makePolicy([{ type: 'sword' }, { type: 'sword' }]); // cap = 4000
    const incident: Incident = {
      damages: [
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 500 },
      ],
    };
    const result = processClaim(policy, incident);
    // Each: 500 - 100 = 400; total = 800
    expect(result.payout).toBe(800);
    expect(result.remainingCap).toBe(4000 - 800);
  });

  it('rounding: payout rounded down in MHPCO favor', () => {
    // Need a fractional payout: enchantment >= 8 gives 50%
    // damage 901G: 50% = 450.5, -100 = 350.5 → rounded down to 350
    const policy = makePolicy([{ type: 'sword', enchantment: 9 }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: 901 }] };
    const result = processClaim(policy, incident);
    expect(result.payout).toBe(350);
  });
});

describe('claim validation errors', () => {
  it('damage to item not in policy → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const incident: Incident = { damages: [{ itemType: 'amulet', amount: 200 }] };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it('more damage entries than insured items of that type → throws error', () => {
    // One sword insured, two sword damage entries
    const policy = makePolicy([{ type: 'sword' }]);
    const incident: Incident = {
      damages: [
        { itemType: 'sword', amount: 200 },
        { itemType: 'sword', amount: 300 },
      ],
    };
    expect(() => processClaim(policy, incident)).toThrow();
  });

  it('negative damage amount → throws error', () => {
    const policy = makePolicy([{ type: 'sword' }]);
    const incident: Incident = { damages: [{ itemType: 'sword', amount: -200 }] };
    expect(() => processClaim(policy, incident)).toThrow();
  });
});
