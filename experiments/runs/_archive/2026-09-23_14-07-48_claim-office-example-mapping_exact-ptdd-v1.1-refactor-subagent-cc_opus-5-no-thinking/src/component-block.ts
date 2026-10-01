import type { Item } from "./insured-item.js";
import { COMPONENT_BASE_PREMIUM } from "./price-list.js";

// The MHPCO's building-block offer: a group of 3 alike components is priced at
// one special base premium instead of the sum of its components' individual
// prices. "Alike" means the same component type, so components of different
// types never form a block together. The offer changes when the MHPCO revises
// the block -- its size or its price -- which is a decision of the price
// catalogue, not of the underwriter who sets surcharges and discounts.
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function alikeComponentGroupSizes(components: Item[]): number[] {
  const sizePerType = new Map<string, number>();
  for (const component of components) {
    sizePerType.set(component.type, (sizePerType.get(component.type) ?? 0) + 1);
  }
  return [...sizePerType.values()];
}

function alikeComponentGroupBasePremium(groupSize: number): number {
  return groupSize === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : groupSize * COMPONENT_BASE_PREMIUM;
}

export function componentsBasePremium(components: Item[]): number {
  return alikeComponentGroupSizes(components)
    .map(alikeComponentGroupBasePremium)
    .reduce((sum, premium) => sum + premium, 0);
}
