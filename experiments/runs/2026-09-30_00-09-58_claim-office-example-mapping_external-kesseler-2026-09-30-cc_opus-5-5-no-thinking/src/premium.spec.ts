import { quote } from './premium';

const newcomer = { yearsWithMHPCO: 0, previousContracts: 0 };

describe('quote', () => {
  it('charges only the processing fee for an empty item list', () => {
    const items: never[] = [];

    const premium = quote(items, newcomer);

    expect(premium).toBe(5);
  });

  it('charges base premium plus first insurance surcharge plus fee for a plain sword', () => {
    const items = [{ type: 'sword' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(115);
  });

  it.each([
    ['amulet', 71],
    ['staff', 93],
    ['potion', 49],
  ])('uses the price list base premium for a %s', (type, expected) => {
    const items = [{ type }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(expected);
  });

  it('adds the curse surcharge for a newcomer with a cursed sword', () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 3, cursed: true }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(165);
  });

  it('adds the high-enchantment surcharge for a sword with exactly enchantment 5', () => {
    const items = [{ type: 'sword', enchantment: 5 }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(145);
  });

  it('adds no high-enchantment surcharge for a sword with enchantment 4', () => {
    const items = [{ type: 'sword', enchantment: 4 }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(115);
  });

  it('adds both surcharges for a cursed sword with enchantment 5', () => {
    const items = [{ type: 'sword', enchantment: 5, cursed: true }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(195);
  });

  it('grants the loyalty discount to a customer with exactly 2 years', () => {
    const items = [{ type: 'sword' }];
    const customer = { yearsWithMHPCO: 2, previousContracts: 0 };

    const premium = quote(items, customer);

    expect(premium).toBe(95);
  });

  it('grants no loyalty discount to a customer with 1 year', () => {
    const items = [{ type: 'sword' }];
    const customer = { yearsWithMHPCO: 1, previousContracts: 0 };

    const premium = quote(items, customer);

    expect(premium).toBe(115);
  });

  it('grants the follow-up discount on a contract after the first', () => {
    const items = [{ type: 'sword' }];
    const customer = { yearsWithMHPCO: 0, previousContracts: 1 };

    const premium = quote(items, customer);

    expect(premium).toBe(100);
  });

  it("stacks all modifiers on a long-standing customer's second contract", () => {
    const items = [{ type: 'sword', material: 'steel', enchantment: 7, cursed: true }];
    const customer = { yearsWithMHPCO: 3, previousContracts: 1 };

    const premium = quote(items, customer);

    expect(premium).toBe(160);
  });

  it('applies the curse surcharge only to the cursed item of a multi-item policy', () => {
    const items = [{ type: 'sword', cursed: true }, { type: 'amulet' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(231);
  });

  it('charges 25 base premium per rune for 2 runes', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(60);
  });

  it('charges the block base premium of 60 for exactly 3 runes', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'rune' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(71);
  });

  it('charges no block for 4 runes because a block requires exactly 3', () => {
    const items = Array.from({ length: 4 }, () => ({ type: 'rune' }));

    const premium = quote(items, newcomer);

    expect(premium).toBe(115);
  });

  it('charges no block for 3 swords because only components form blocks', () => {
    const items = Array.from({ length: 3 }, () => ({ type: 'sword' }));

    const premium = quote(items, newcomer);

    expect(premium).toBe(335);
  });

  it('rounds the premium of 7 runes up from 197.5 to 198', () => {
    const items = Array.from({ length: 7 }, () => ({ type: 'rune' }));

    const premium = quote(items, newcomer);

    expect(premium).toBe(198);
  });

  it('forms no block from 2 runes and 1 moonstone because they are different types', () => {
    const items = [{ type: 'rune' }, { type: 'rune' }, { type: 'moonstone' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(88);
  });

  it('forms two separate blocks from 3 runes and 3 moonstones', () => {
    const runes = Array.from({ length: 3 }, () => ({ type: 'rune' }));
    const moonstones = Array.from({ length: 3 }, () => ({ type: 'moonstone' }));

    const premium = quote([...runes, ...moonstones], newcomer);

    expect(premium).toBe(137);
  });

  it('charges no block for 6 runes because a block requires exactly 3', () => {
    const items = Array.from({ length: 6 }, () => ({ type: 'rune' }));

    const premium = quote(items, newcomer);

    expect(premium).toBe(170);
  });

  it("applies the curse surcharge to a cursed rune's share of the block premium", () => {
    const items = [{ type: 'rune', cursed: true }, { type: 'rune' }, { type: 'rune' }];

    const premium = quote(items, newcomer);

    expect(premium).toBe(81);
  });

  it('rejects an item with an unknown type', () => {
    const items = [{ type: 'broomstick' }];

    const quoting = () => quote(items, newcomer);

    expect(quoting).toThrow(/unknown item type: broomstick/i);
  });
});
