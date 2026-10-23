import type { ItemInput } from "./scenario.js";
import { COMPONENT_TYPES, isComponent } from "./component.js";

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function countOf(items: ItemInput[], type: string): number {
  return items.filter((item) => item.type === type).length;
}

function componentBlockBasePremium(count: number, unitPremium: number): number {
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitPremium;
}

export function itemBasePremium(item: ItemInput): number {
  const basePremium = BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`unknown item type "${item.type}"`);
  }
  return basePremium;
}

export function catalogBasePremium(items: ItemInput[]): number {
  let total = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  for (const componentType of COMPONENT_TYPES) {
    const count = countOf(items, componentType);
    total += componentBlockBasePremium(count, BASE_PREMIUMS[componentType]);
  }
  return total;
}
