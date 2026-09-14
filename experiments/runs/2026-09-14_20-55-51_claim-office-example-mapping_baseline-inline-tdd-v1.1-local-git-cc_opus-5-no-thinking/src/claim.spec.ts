import { describe, it, expect } from 'vitest';
import { computeClaim, ClaimError } from './claim.js';
import { UnknownItemTypeError } from './domain.js';

const incident = (damages: { itemType: string; amount: number }[]) => ({
  cause: 'dragon attack',
  damages,
});
const UNLIMITED = Number.POSITIVE_INFINITY;

describe('standard reimbursement', () => {
  it('reimburses a regular sword in full minus the deductible', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3 }];
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 500 }]), UNLIMITED);
    expect(payout).toBe(400);
  });

  it('reimburses a rune, which has no enchantment or material', () => {
    const { payout } = computeClaim(
      [{ type: 'rune' }],
      incident([{ itemType: 'rune', amount: 200 }]),
      UNLIMITED,
    );
    expect(payout).toBe(100);
  });
});

describe('enchantment threshold vs dragon material', () => {
  it('halves before the deductible at exactly enchantment 8', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 8 }];
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 1000 }]), UNLIMITED);
    expect(payout).toBe(400);
  });

  it('lets the 50 % rule win when both clauses apply', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 9 }];
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 1000 }]), UNLIMITED);
    expect(payout).toBe(400);
  });

  it('reimburses dragon material in full below the enchantment threshold', () => {
    const items = [{ type: 'sword', material: 'dragon', enchantment: 5 }];
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 800 }]), UNLIMITED);
    expect(payout).toBe(700);
  });

  it('halves for a highly enchanted steel sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 1000 }]), UNLIMITED);
    expect(payout).toBe(400);
  });
});

describe('deductible per damage event', () => {
  it('applies the deductible once per damaged item', () => {
    const items = [{ type: 'sword' }, { type: 'amulet' }];
    const { payout } = computeClaim(
      items,
      incident([
        { itemType: 'sword', amount: 500 },
        { itemType: 'amulet', amount: 300 },
      ]),
      UNLIMITED,
    );
    expect(payout).toBe(600);
  });

  it('treats two damages of the same type as separate events', () => {
    const items = [{ type: 'sword' }, { type: 'sword' }];
    const { payout } = computeClaim(
      items,
      incident([
        { itemType: 'sword', amount: 500 },
        { itemType: 'sword', amount: 300 },
      ]),
      UNLIMITED,
    );
    expect(payout).toBe(600);
  });

  it('never pays out below zero for damage under the deductible', () => {
    const { payout } = computeClaim(
      [{ type: 'rune' }],
      incident([{ itemType: 'rune', amount: 40 }]),
      UNLIMITED,
    );
    expect(payout).toBe(0);
  });
});

describe('cap exhaustion', () => {
  it('reduces the payout to the remaining cap and tracks it across claims', () => {
    const items = [{ type: 'sword' }];
    const first = computeClaim(items, incident([{ itemType: 'sword', amount: 1500 }]), 2000);
    expect(first).toEqual({ payout: 1400, remainingCap: 600 });

    const second = computeClaim(items, incident([{ itemType: 'sword', amount: 1500 }]), first.remainingCap);
    expect(second).toEqual({ payout: 600, remainingCap: 0 });
  });
});

describe('rounding in the MHPCO favour', () => {
  it('rounds a fractional payout down', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 9 }];
    // 901 halved = 450.5, minus the 100 deductible = 350.5 -> 350
    const { payout } = computeClaim(items, incident([{ itemType: 'sword', amount: 901 }]), UNLIMITED);
    expect(payout).toBe(350);
  });
});

describe('invalid claims', () => {
  it('rejects a damage to an item not covered by the policy', () => {
    expect(() =>
      computeClaim([{ type: 'sword' }], incident([{ itemType: 'amulet', amount: 200 }]), UNLIMITED),
    ).toThrow(ClaimError);
  });

  it('rejects more damages of a type than the policy covers', () => {
    expect(() =>
      computeClaim(
        [{ type: 'sword' }],
        incident([
          { itemType: 'sword', amount: 200 },
          { itemType: 'sword', amount: 200 },
        ]),
        UNLIMITED,
      ),
    ).toThrow(ClaimError);
  });

  it('rejects an unknown damaged item type', () => {
    expect(() =>
      computeClaim([{ type: 'sword' }], incident([{ itemType: 'broomstick', amount: 200 }]), UNLIMITED),
    ).toThrow(UnknownItemTypeError);
  });

  it('rejects a negative damage amount', () => {
    expect(() =>
      computeClaim([{ type: 'sword' }], incident([{ itemType: 'sword', amount: -200 }]), UNLIMITED),
    ).toThrow(ClaimError);
  });
});
