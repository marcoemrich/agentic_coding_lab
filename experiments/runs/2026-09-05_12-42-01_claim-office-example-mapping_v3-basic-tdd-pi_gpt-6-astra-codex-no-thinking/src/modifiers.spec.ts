import { expect, it } from 'vitest';
import { runScenario, type Item } from './office';
const quote = (items: Item[], years = 0) => runScenario({ customer: { yearsWithMHPCO: years }, steps: [{ op: 'quote', items }] }).results[0];
it.each([[4, false, 115], [4, true, 165], [5, false, 145], [5, true, 195]])('enchantment %i cursed %s', (enchantment, cursed, premium) => {
  expect(quote([{ type: 'sword', enchantment, cursed }])).toEqual({ premium });
});
it.each([[1, 115], [2, 95], [3, 95]])('loyalty at %i years', (years, premium) => expect(quote([{ type: 'sword' }], years)).toEqual({ premium }));
it('limits risk modifiers to affected items and adds policy modifiers independently', () => {
  expect(quote([{ type: 'sword', cursed: true }, { type: 'amulet' }])).toEqual({ premium: 231 });
});
it('charges first insurance on every quote while discounting subsequent contracts', () => {
  expect(runScenario({ customer: { yearsWithMHPCO: 3 }, steps: [
    { op: 'quote', items: [{ type: 'amulet' }] },
    { op: 'quote', items: [{ type: 'sword', cursed: true, enchantment: 7 }] },
    { op: 'quote', items: [{ type: 'sword' }] },
  ] }).results).toEqual([{ premium: 59 }, { premium: 160 }, { premium: 80 }]);
});
it('rounds only the final premium up', () => {
  expect(quote([{ type: 'rune', cursed: true }, { type: 'moonstone', cursed: true }])).toEqual({ premium: 85 });
  expect(quote(Array.from({ length: 7 }, () => ({ type: 'rune' })))).toEqual({ premium: 198 });
});
