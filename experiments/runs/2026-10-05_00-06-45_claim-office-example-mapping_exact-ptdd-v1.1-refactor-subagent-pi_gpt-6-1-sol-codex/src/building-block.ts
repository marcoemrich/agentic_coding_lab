import type { Item } from './item.js';

const BLOCK_SIZE = 3;
const BLOCK_SAVING = 15;

export function componentBlockDiscount(items: Item[]): number {
  return ['rune', 'moonstone'].reduce((saving, type) => {
    const count = items.filter(item => item.type === type).length;
    return saving + (count === BLOCK_SIZE ? BLOCK_SAVING : 0);
  }, 0);
}
