import { describe, it, expect } from 'vitest';
import { computeQuote, computeClaim, processScenario } from './engine.js';
import { Policy, QuoteStep, ClaimStep } from './types.js';

// ── helpers ──────────────────────────────────────────────────────────────────

const newCustomer = { yearsWithMHPCO: 0 };
const veteranCustomer = { yearsWithMHPCO: 5 };

function quoteStep(items: QuoteStep['items']): QuoteStep {
  return { op: 'quote', items };
}

function sword(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'sword', material: 'steel', enchantment: 0, cursed: false, ...overrides };
}
function amulet(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'amulet', material: 'silver', enchantment: 0, cursed: false, ...overrides };
}
function staff(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'staff', material: 'wood', enchantment: 0, cursed: false, ...overrides };
}
function potion(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'potion', material: 'glass', enchantment: 0, cursed: false, ...overrides };
}
function rune(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'rune', material: 'stone', enchantment: 0, cursed: false, ...overrides };
}
function moonstone(overrides: Partial<{ material: string; enchantment: number; cursed: boolean }> = {}) {
  return { type: 'moonstone', material: 'crystal', enchantment: 0, cursed: false, ...overrides };
}

// ── Quote: base premiums ──────────────────────────────────────────────────────

describe('quote – base premiums (new customer, first contract)', () => {
  it('sword: base 100, first contract +10%, +5 fee = ceil(100*1.1)+5 = 115', () => {
    // 100 * 1.1 = 110, + 5 = 115
    const { premium } = computeQuote(quoteStep([sword()]), newCustomer, 0);
    expect(premium).toBe(115);
  });

  it('amulet: 60 * 1.1 + 5 = 71', () => {
    const { premium } = computeQuote(quoteStep([amulet()]), newCustomer, 0);
    expect(premium).toBe(71);
  });

  it('staff: 80 * 1.1 + 5 = 93', () => {
    const { premium } = computeQuote(quoteStep([staff()]), newCustomer, 0);
    expect(premium).toBe(93);
  });

  it('potion: 40 * 1.1 + 5 = 49', () => {
    const { premium } = computeQuote(quoteStep([potion()]), newCustomer, 0);
    expect(premium).toBe(49);
  });

  it('single rune (component): 25 * 1.1 + 5 = ceil(32.5) = 33', () => {
    const { premium } = computeQuote(quoteStep([rune()]), newCustomer, 0);
    expect(premium).toBe(33);
  });

  it('two runes: 50 * 1.1 + 5 = 60', () => {
    const { premium } = computeQuote(quoteStep([rune(), rune()]), newCustomer, 0);
    expect(premium).toBe(60);
  });

  it('three runes = bundle: 60 * 1.1 + 5 = 71', () => {
    const { premium } = computeQuote(quoteStep([rune(), rune(), rune()]), newCustomer, 0);
    expect(premium).toBe(71);
  });

  it('four runes = 1 bundle + 1 single: (60+25) * 1.1 + 5 = ceil(93.5) + 5 = ... wait, 85*1.1=93.5, ceil=94, +5=99', () => {
    // bundle: 3 runes * 20 = 60, individual: 1 rune * 25 = 25, total base = 85
    // 85 * 1.1 = 93.5, ceil = 94, + 5 = 99
    const { premium } = computeQuote(quoteStep([rune(), rune(), rune(), rune()]), newCustomer, 0);
    expect(premium).toBe(99);
  });

  it('insurance sum for sword is 1000', () => {
    const { insuranceSum } = computeQuote(quoteStep([sword()]), newCustomer, 0);
    expect(insuranceSum).toBe(1000);
  });

  it('insurance sum for rune is 250', () => {
    const { insuranceSum } = computeQuote(quoteStep([rune()]), newCustomer, 0);
    expect(insuranceSum).toBe(250);
  });
});

// ── Quote: item-level surcharges ──────────────────────────────────────────────

describe('quote – item surcharges', () => {
  it('cursed sword: 100 * 1.5 * 1.1 + 5 = ceil(165) + 5 = 170', () => {
    // 100 * 1.5 = 150, * 1.1 = 165, + 5 = 170
    const { premium } = computeQuote(quoteStep([sword({ cursed: true })]), newCustomer, 0);
    expect(premium).toBe(170);
  });

  it('enchantment ≥5 sword: 100 * 1.3 * 1.1 + 5 = ceil(143) + 5 = 148', () => {
    // 100 * 1.3 = 130, * 1.1 = 143, + 5 = 148
    const { premium } = computeQuote(quoteStep([sword({ enchantment: 5 })]), newCustomer, 0);
    expect(premium).toBe(148);
  });

  it('cursed + highly enchanted sword: 100 * 1.5 * 1.3 * 1.1 + 5 = ceil(214.5) + 5 = 220', () => {
    // 100 * 1.5 = 150, * 1.3 = 195, * 1.1 = 214.5, ceil = 215, + 5 = 220
    const { premium } = computeQuote(quoteStep([sword({ cursed: true, enchantment: 5 })]), newCustomer, 0);
    expect(premium).toBe(220);
  });

  it('enchantment 4 does not trigger surcharge', () => {
    const { premium } = computeQuote(quoteStep([sword({ enchantment: 4 })]), newCustomer, 0);
    expect(premium).toBe(115); // same as plain sword
  });
});

// ── Quote: customer-level modifiers ──────────────────────────────────────────

describe('quote – customer modifiers', () => {
  it('new customer, second contract: 100 * 0.85 + 5 = 90', () => {
    // 100 * 0.85 = 85, + 5 = 90
    const { premium } = computeQuote(quoteStep([sword()]), newCustomer, 1);
    expect(premium).toBe(90);
  });

  it('veteran (≥2 yrs), first quote in scenario: -20% loyalty + -15% subsequent = 100*0.8*0.85 + 5 = ceil(68)+5=73', () => {
    // A veteran is not getting their "first insurance" even if quoteCount==0
    // 100 * 0.8 * 0.85 = 68, + 5 = 73
    const { premium } = computeQuote(quoteStep([sword()]), veteranCustomer, 0);
    expect(premium).toBe(73);
  });

  it('veteran, second quote in scenario: same as first (both subsequent)', () => {
    const { premium } = computeQuote(quoteStep([sword()]), veteranCustomer, 1);
    expect(premium).toBe(73);
  });

  it('1-year customer (no loyalty), second contract: 100 * 0.85 + 5 = 90', () => {
    const { premium } = computeQuote(quoteStep([sword()]), { yearsWithMHPCO: 1 }, 1);
    expect(premium).toBe(90);
  });
});

// ── Quote: mixed item list ────────────────────────────────────────────────────

describe('quote – mixed item list (new customer, first contract)', () => {
  it('sword + amulet: (100+60)*1.1 + 5 = 176 + 5 = 181', () => {
    // 160 * 1.1 = 176, + 5 = 181
    const { premium } = computeQuote(quoteStep([sword(), amulet()]), newCustomer, 0);
    expect(premium).toBe(181);
  });
});

// ── Claim: reimbursement rates ────────────────────────────────────────────────

describe('claim – reimbursement rules', () => {
  function makePolicy(items: Policy['items'], insuranceSum: number): Policy {
    return { insuranceSum, remainingCap: insuranceSum * 2, items };
  }

  it('normal item: 100% reimbursement, minus deductible', () => {
    const policy = makePolicy([amulet({ enchantment: 2 })], 600);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
    };
    const { payout } = computeClaim(step, policy);
    // 300 * 100% - 100 deductible = 200
    expect(payout).toBe(200);
  });

  it('enchantment ≥8 item: 50% reimbursement, minus deductible', () => {
    const policy = makePolicy([sword({ enchantment: 8 })], 1000);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'battle', damages: [{ itemType: 'sword', amount: 400 }] },
    };
    const { payout } = computeClaim(step, policy);
    // 400 * 50% = 200 - 100 = 100
    expect(payout).toBe(100);
  });

  it('dragon material item: 100% reimbursement', () => {
    const policy = makePolicy([sword({ material: 'dragon', enchantment: 0 })], 1000);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'curse', damages: [{ itemType: 'sword', amount: 400 }] },
    };
    const { payout } = computeClaim(step, policy);
    // 400 * 100% - 100 = 300
    expect(payout).toBe(300);
  });

  it('dragon material overrides enchantment ≥8 penalty', () => {
    const policy = makePolicy([sword({ material: 'dragon', enchantment: 9 })], 1000);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'curse', damages: [{ itemType: 'sword', amount: 400 }] },
    };
    const { payout } = computeClaim(step, policy);
    // Dragon = 100%, so 400 - 100 = 300
    expect(payout).toBe(300);
  });

  it('deductible: damage ≤ 100 yields 0 payout', () => {
    const policy = makePolicy([amulet()], 600);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 80 }] },
    };
    const { payout } = computeClaim(step, policy);
    expect(payout).toBe(0);
  });

  it('cap: payout cannot exceed remaining cap', () => {
    const policy = makePolicy([sword()], 1000);
    policy.remainingCap = 150;
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: { cause: 'fire', damages: [{ itemType: 'sword', amount: 500 }] },
    };
    const { payout, remainingCap } = computeClaim(step, policy);
    expect(payout).toBe(150);
    expect(remainingCap).toBe(0);
  });

  it('multiple damages in one incident share one deductible', () => {
    const policy = makePolicy([sword(), amulet()], 1600);
    const step: ClaimStep = {
      op: 'claim',
      policy: 0,
      incident: {
        cause: 'fire',
        damages: [
          { itemType: 'sword', amount: 200 },
          { itemType: 'amulet', amount: 150 },
        ],
      },
    };
    const { payout } = computeClaim(step, policy);
    // total reimbursement = 200 + 150 = 350, minus 100 deductible = 250
    expect(payout).toBe(250);
  });

  it('remaining cap decreases across multiple claims', () => {
    const policy = makePolicy([amulet()], 600); // cap = 1200
    const claim1: ClaimStep = {
      op: 'claim', policy: 0,
      incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 600 }] },
    };
    const claim2: ClaimStep = {
      op: 'claim', policy: 0,
      incident: { cause: 'flood', damages: [{ itemType: 'amulet', amount: 600 }] },
    };
    const r1 = computeClaim(claim1, policy);
    expect(r1.payout).toBe(500); // 600 - 100 deductible
    expect(r1.remainingCap).toBe(700);

    const r2 = computeClaim(claim2, policy);
    expect(r2.payout).toBe(500); // 600 - 100 deductible, cap allows it
    expect(r2.remainingCap).toBe(200);
  });
});

// ── Full scenario integration ─────────────────────────────────────────────────

describe('processScenario', () => {
  it('schema example 1 shape: single quote', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [{ type: 'sword', material: 'steel', enchantment: 3, cursed: false }] },
      ],
    });
    expect(result.results).toHaveLength(1);
    expect(result.results[0]).toHaveProperty('premium');
    expect(typeof (result.results[0] as { premium: number }).premium).toBe('number');
  });

  it('schema example 2 shape: quote then two claims', () => {
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'spell mishap', damages: [{ itemType: 'amulet', amount: 250 }] },
        },
      ],
    });

    expect(result.results).toHaveLength(3);
    expect(result.results[0]).toHaveProperty('premium');
    expect(result.results[1]).toHaveProperty('payout');
    expect(result.results[1]).toHaveProperty('remainingCap');
    expect(result.results[2]).toHaveProperty('payout');
    expect(result.results[2]).toHaveProperty('remainingCap');
  });

  it('schema example 2 values: veteran with amulet', () => {
    // Customer: 5 years → loyalty -20%, subsequent -15% (not first ever)
    // Amulet base premium: 60
    // Modifiers: 60 * 0.8 * 0.85 = 40.8, ceil = 41, + 5 = 46
    const result = processScenario({
      customer: { yearsWithMHPCO: 5 },
      steps: [
        {
          op: 'quote',
          items: [{ type: 'amulet', material: 'silver', enchantment: 2, cursed: false }],
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 200 }] },
        },
        {
          op: 'claim',
          policy: 0,
          incident: { cause: 'spell mishap', damages: [{ itemType: 'amulet', amount: 250 }] },
        },
      ],
    });

    // premium: 60 * 0.8 * 0.85 = 40.8 → ceil=41 + 5 = 46
    expect((result.results[0] as { premium: number }).premium).toBe(46);

    // Insurance sum: 600, cap = 1200
    // Claim 1: 200 - 100 = 100 payout, cap = 1100
    const r1 = result.results[1] as { payout: number; remainingCap: number };
    expect(r1.payout).toBe(100);
    expect(r1.remainingCap).toBe(1100);

    // Claim 2: 250 - 100 = 150 payout, cap = 950
    const r2 = result.results[2] as { payout: number; remainingCap: number };
    expect(r2.payout).toBe(150);
    expect(r2.remainingCap).toBe(950);
  });

  it('policy index refers to step index, not quote count', () => {
    // Step 0: claim (won't create a policy)
    // But per the spec, steps are quote or claim.
    // Let's test: step 0 = quote, step 1 = quote, step 2 = claim referencing step 1
    const result = processScenario({
      customer: { yearsWithMHPCO: 0 },
      steps: [
        { op: 'quote', items: [sword()] },   // index 0
        { op: 'quote', items: [amulet()] },  // index 1
        {
          op: 'claim',
          policy: 1,
          incident: { cause: 'fire', damages: [{ itemType: 'amulet', amount: 300 }] },
        },
      ],
    });
    const r = result.results[2] as { payout: number; remainingCap: number };
    // amulet insurance sum = 600, cap = 1200
    // damage 300 - 100 deductible = 200
    expect(r.payout).toBe(200);
    expect(r.remainingCap).toBe(1000);
  });
});
