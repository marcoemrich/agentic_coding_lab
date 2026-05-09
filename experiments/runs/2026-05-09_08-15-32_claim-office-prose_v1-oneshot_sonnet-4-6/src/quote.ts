import { Customer, ItemSpec, Policy } from "./types.js";

const MAIN_ITEMS: Record<string, { insuredValue: number; basePremium: number }> = {
  sword: { insuredValue: 1000, basePremium: 100 },
  amulet: { insuredValue: 600, basePremium: 60 },
  staff: { insuredValue: 800, basePremium: 80 },
  potion: { insuredValue: 400, basePremium: 40 },
};

const COMPONENT_INSURED_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_PREMIUM = 60;
const BUNDLE_SIZE = 3;
const PROCESSING_FEE = 5;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.15;

function itemRiskMultiplier(item: ItemSpec): number {
  let multiplier = 1.0;
  if (item.cursed) multiplier += CURSED_SURCHARGE;
  if (item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) multiplier += HIGH_ENCHANTMENT_SURCHARGE;
  return multiplier;
}

function isComponent(type: string): boolean {
  return !(type in MAIN_ITEMS);
}

type ComponentKey = string;

function componentKey(item: ItemSpec): ComponentKey {
  return `${item.type}|${item.material}|${item.enchantment}|${item.cursed}`;
}

export function quotePolicy(
  customer: Customer,
  items: ItemSpec[],
  quoteCount: number
): { premium: number; policy: Policy } {
  let rawPremium = 0;
  let insuranceSum = 0;

  // Main items
  for (const item of items) {
    if (!isComponent(item.type)) {
      const { insuredValue, basePremium } = MAIN_ITEMS[item.type];
      insuranceSum += insuredValue;
      rawPremium += basePremium * itemRiskMultiplier(item);
    }
  }

  // Components: group "alike" (same type, material, enchantment, cursed)
  const componentGroups = new Map<ComponentKey, ItemSpec[]>();
  for (const item of items) {
    if (isComponent(item.type)) {
      const key = componentKey(item);
      if (!componentGroups.has(key)) componentGroups.set(key, []);
      componentGroups.get(key)!.push(item);
    }
  }

  for (const [, group] of componentGroups) {
    const representative = group[0];
    const count = group.length;
    insuranceSum += count * COMPONENT_INSURED_VALUE;

    const bundles = Math.floor(count / BUNDLE_SIZE);
    const singles = count % BUNDLE_SIZE;
    const multiplier = itemRiskMultiplier(representative);
    rawPremium += bundles * COMPONENT_BUNDLE_PREMIUM * multiplier;
    rawPremium += singles * COMPONENT_BASE_PREMIUM * multiplier;
  }

  // Customer-level modifiers
  const isFirstEver = quoteCount === 0 && customer.yearsWithMHPCO === 0;
  let customerMultiplier = 1.0;
  if (isFirstEver) {
    customerMultiplier += FIRST_INSURANCE_SURCHARGE;
  } else {
    customerMultiplier -= SUBSEQUENT_CONTRACT_DISCOUNT;
  }
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    customerMultiplier -= LOYALTY_DISCOUNT;
  }

  // Round ceiling in MHPCO's favor; snap to 4dp first to eliminate IEEE 754 noise
  const total = rawPremium * customerMultiplier + PROCESSING_FEE;
  const premium = Math.ceil(Math.round(total * 1e4) / 1e4);

  const policy: Policy = {
    items,
    insuranceSum,
    remainingCap: 2 * insuranceSum,
  };

  return { premium, policy };
}
