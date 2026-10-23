const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

import { isComponent } from "./catalogue.js";

const FIRST_INSURANCE_SURCHARGE_NUMERATOR = 11;
const FIRST_INSURANCE_SURCHARGE_DENOMINATOR = 10;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_NUMERATOR = 1;
const LOYALTY_DISCOUNT_DENOMINATOR = 5;
const FOLLOW_UP_DISCOUNT_NUMERATOR = 3;
const FOLLOW_UP_DISCOUNT_DENOMINATOR = 20;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_NUMERATOR = 3;
const HIGH_ENCHANTMENT_SURCHARGE_DENOMINATOR = 10;
const CURSE_SURCHARGE_NUMERATOR = 1;
const CURSE_SURCHARGE_DENOMINATOR = 2;

export interface Item {
  type: string;
  enchantment?: number;
  cursed?: boolean;
}

function basePremium(items: Item[]): number {
  const countByType = new Map<string, number>();
  for (const item of items) {
    countByType.set(item.type, (countByType.get(item.type) ?? 0) + 1);
  }
  let base = 0;
  for (const [type, count] of countByType) {
    if (isComponent(type)) {
      base +=
        count === COMPONENT_BLOCK_SIZE
          ? COMPONENT_BLOCK_BASE_PREMIUM
          : count * COMPONENT_BASE_PREMIUM;
    } else {
      base += count * MAIN_ITEM_BASE_PREMIUMS[type];
    }
  }
  return base;
}

function itemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      continue;
    }
    const itemBase = MAIN_ITEM_BASE_PREMIUMS[item.type];
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge +=
        (itemBase * HIGH_ENCHANTMENT_SURCHARGE_NUMERATOR) /
        HIGH_ENCHANTMENT_SURCHARGE_DENOMINATOR;
    }
    if (item.cursed === true) {
      surcharge +=
        (itemBase * CURSE_SURCHARGE_NUMERATOR) / CURSE_SURCHARGE_DENOMINATOR;
    }
  }
  return surcharge;
}

function applyPolicyWideModifiers(
  base: number,
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  let amount =
    (base * FIRST_INSURANCE_SURCHARGE_NUMERATOR) /
    FIRST_INSURANCE_SURCHARGE_DENOMINATOR;
  if (yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    amount -= (base * LOYALTY_DISCOUNT_NUMERATOR) / LOYALTY_DISCOUNT_DENOMINATOR;
  }
  if (isFollowUpContract) {
    amount -=
      (base * FOLLOW_UP_DISCOUNT_NUMERATOR) / FOLLOW_UP_DISCOUNT_DENOMINATOR;
  }
  return amount;
}

export function quotePremium(
  items: Item[],
  yearsWithMHPCO: number,
  isFollowUpContract: boolean,
): number {
  const base = basePremium(items);
  const policyAmount = applyPolicyWideModifiers(
    base,
    yearsWithMHPCO,
    isFollowUpContract,
  );
  return Math.ceil(policyAmount + itemSurcharges(items) + PROCESSING_FEE);
}
