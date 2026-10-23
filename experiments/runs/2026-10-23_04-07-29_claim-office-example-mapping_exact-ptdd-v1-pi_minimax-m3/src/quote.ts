import type {
  QuoteInput,
  QuoteResult,
  Policy,
  Item,
  ItemType,
} from "./types.js";
import {
  PROCESSING_FEE,
  isValidItemType,
  isComponent,
  ITEM_BASE_PREMIUMS,
  ITEM_INSURANCE_VALUES,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_BLOCK_PREMIUM,
  FIRST_INSURANCE_RATE,
  CURSED_SURCHARGE_RATE,
  HIGH_ENCHANTMENT_SURCHARGE_RATE,
  HIGH_ENCHANTMENT_THRESHOLD,
  LOYALTY_DISCOUNT_RATE,
  LOYALTY_THRESHOLD,
  FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  CAP_MULTIPLIER,
} from "./types.js";

function normalizeItems(items: QuoteInput["items"]): Item[] {
  const result: Item[] = [];
  for (const input of items) {
    if (!isValidItemType(input.type)) {
      throw new Error(`Unknown item type: ${input.type}`);
    }
    result.push({
      type: input.type,
      material: input.material,
      enchantment: input.enchantment,
      cursed: input.cursed,
    });
  }
  return result;
}

function computePolicyBase(items: Item[]): number {
  let base = 0;
  const counts = new Map<ItemType, number>();
  for (const item of items) {
    base += ITEM_BASE_PREMIUMS[item.type];
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }

  let blockDiscount = 0;
  for (const [type, count] of counts) {
    if (count === COMPONENT_BLOCK_SIZE) {
      const fullCost = count * ITEM_BASE_PREMIUMS[type];
      blockDiscount += fullCost - COMPONENT_BLOCK_PREMIUM;
    }
  }

  return base - blockDiscount;
}

function computeItemModifierSurcharge(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    const itemBase = ITEM_BASE_PREMIUMS[item.type];
    if (item.cursed) {
      surcharge += CURSED_SURCHARGE_RATE * itemBase;
    }
    if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += HIGH_ENCHANTMENT_SURCHARGE_RATE * itemBase;
    }
  }
  return surcharge;
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    sum += ITEM_INSURANCE_VALUES[item.type];
  }
  return sum;
}

function computePolicyWideModifiers(
  policyBase: number,
  yearsWithMHPCO: number,
  quoteNumber: number,
): number {
  let modifier = 0;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    modifier -= LOYALTY_DISCOUNT_RATE * policyBase;
  }
  if (quoteNumber >= 1) {
    modifier -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE * policyBase;
  }
  return modifier;
}

export function quote(input: QuoteInput): QuoteResult {
  const items = normalizeItems(input.items);

  const policyBase = computePolicyBase(items);
  const insuranceSum = computeInsuranceSum(items);

  const itemModifiers = computeItemModifierSurcharge(items);
  const policyWide = computePolicyWideModifiers(
    policyBase,
    input.customer.yearsWithMHPCO,
    input.quoteNumber,
  );
  const firstInsurance = FIRST_INSURANCE_RATE * policyBase;

  const premiumRaw = policyBase + itemModifiers + policyWide + firstInsurance + PROCESSING_FEE;
  const premium = Math.ceil(premiumRaw);

  const cap = CAP_MULTIPLIER * insuranceSum;
  const policy: Policy = {
    items,
    insuranceSum,
    cap,
    remainingCap: cap,
    premium,
  };
  return { premium, policy };
}
