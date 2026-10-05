import { priceForItemType } from './catalogue.js';
import type { Item } from './item.js';

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;

function curseSurchargeRate(item: Item): number {
  return item.cursed ? CURSE_SURCHARGE_RATE : 0;
}

function enchantmentSurchargeRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? ENCHANTMENT_SURCHARGE_RATE : 0;
}

export function itemRiskSurcharge(item: Item): number {
  return priceForItemType(item.type).basePremium * (curseSurchargeRate(item) + enchantmentSurchargeRate(item));
}
