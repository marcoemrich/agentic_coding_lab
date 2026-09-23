import { priceOf } from "./price-list.js";
import type { Item } from "./item.js";
import { riskSurchargeRate } from "./risk-surcharges.js";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function groupAlikeItems(items: Item[]): Item[][] {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const alike = groups.get(item.type) ?? [];
    alike.push(item);
    groups.set(item.type, alike);
  }
  return [...groups.values()];
}

function qualifiesAsBlock(alike: Item[]): boolean {
  return alike.length === BLOCK_SIZE;
}

function alikeBasePremium(alike: Item[]): number {
  const catalogued = priceOf(alike[0].type).basePremium;
  if (qualifiesAsBlock(alike)) {
    return BLOCK_BASE_PREMIUM;
  }
  return alike.length * catalogued;
}

function alikeRiskSurcharge(alike: Item[]): number {
  const sharePerItem = alikeBasePremium(alike) / alike.length;
  return alike.reduce(
    (surcharge, item) => surcharge + sharePerItem * riskSurchargeRate(item),
    0,
  );
}

export function itemsBasePremium(items: Item[]): number {
  return groupAlikeItems(items).reduce(
    (total, alike) => total + alikeBasePremium(alike),
    0,
  );
}

export function itemsRiskSurcharge(items: Item[]): number {
  return groupAlikeItems(items).reduce(
    (total, alike) => total + alikeRiskSurcharge(alike),
    0,
  );
}
