import { Policy } from './claim';

describe('claim processing', () => {
  it('reimburses regular damage minus the deductible', () => {
    const policy = new Policy([{ type: 'sword', material: 'steel', enchantment: 3 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 500 }])).toEqual({ payout: 400, remainingCap: 1600 });
  });

  it('reimburses components fully minus deductible', () => {
    const policy = new Policy([{ type: 'rune' }]);
    expect(policy.claim([{ itemType: 'rune', amount: 200 }]).payout).toBe(100);
  });

  it('applies the deductible per damaged item', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'amulet', amount: 300 },
    ])).toEqual({ payout: 600, remainingCap: 2600 });
  });

  it('never pays negative amounts for damage below the deductible', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'amulet' }]);
    expect(policy.claim([
      { itemType: 'sword', amount: 50 },
      { itemType: 'amulet', amount: 300 },
    ]).payout).toBe(200);
  });

  it.each([
    ['dragon', 8, 1000, 400],
    ['dragon', 9, 1000, 400],
    ['dragon', 5, 800, 700],
    ['steel', 9, 1000, 400],
  ])('%s sword with enchantment %i, damage %i pays %i', (material, enchantment, amount, payout) => {
    const policy = new Policy([{ type: 'sword', material, enchantment }]);
    expect(policy.claim([{ itemType: 'sword', amount }]).payout).toBe(payout);
  });

  it('rounds the payout down', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 8 }]);
    expect(policy.claim([{ itemType: 'sword', amount: 901 }]).payout).toBe(350);
  });

  it('caps total payouts at twice the insurance sum', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 1400, remainingCap: 600 });
    expect(policy.claim([{ itemType: 'sword', amount: 1500 }])).toEqual({ payout: 600, remainingCap: 0 });
  });

  it('bases the cap on unmodified insurance values', () => {
    expect(new Policy([{ type: 'sword', cursed: true }]).remainingCap).toBe(2000);
    expect(new Policy([{ type: 'sword' }, { type: 'amulet' }]).remainingCap).toBe(3200);
    expect(new Policy([{ type: 'sword' }, { type: 'rune' }, { type: 'rune' }, { type: 'rune' }]).remainingCap).toBe(3500);
  });

  it('treats multiple damages of the same type as separate items', () => {
    const policy = new Policy([{ type: 'sword' }, { type: 'sword' }]);
    expect(policy.remainingCap).toBe(4000);
    expect(policy.claim([
      { itemType: 'sword', amount: 500 },
      { itemType: 'sword', amount: 500 },
    ])).toEqual({ payout: 800, remainingCap: 3200 });
  });

  it('matches repeated damages to the insured items in order', () => {
    const policy = new Policy([{ type: 'sword', enchantment: 9 }, { type: 'sword', material: 'steel' }]);
    expect(policy.claim([
      { itemType: 'sword', amount: 1000 },
      { itemType: 'sword', amount: 1000 },
    ]).payout).toBe(400 + 900);
  });

  it('rejects more damages of a type than insured', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([
      { itemType: 'sword', amount: 100 },
      { itemType: 'sword', amount: 100 },
    ])).toThrow();
    expect(policy.remainingCap).toBe(2000);
  });

  it('rejects damages to uninsured or unknown items', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'amulet', amount: 100 }])).toThrow();
    expect(() => policy.claim([{ itemType: 'broomstick', amount: 100 }])).toThrow();
  });

  it('rejects negative damage amounts', () => {
    const policy = new Policy([{ type: 'sword' }]);
    expect(() => policy.claim([{ itemType: 'sword', amount: -200 }])).toThrow();
  });
});
