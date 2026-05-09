import { Item, Customer, Policy } from "./types.js";

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BUNDLE_PREMIUM = 60; // 3 alike components

const PROCESSING_FEE = 5;

function getInsuranceValue(item: Item): number {
  if (PRICE_LIST[item.type]) {
    return PRICE_LIST[item.type].insuranceValue;
  }
  if (COMPONENT_TYPES.includes(item.type)) {
    return COMPONENT_INSURANCE;
  }
  throw new Error(`Unknown item type: ${item.type}`);
}

function getBasePremium(items: Item[]): number {
  let totalBasePremium = 0;

  // Group components by type
  const componentCounts: Record<string, number> = {};
  const nonComponents: Item[] = [];

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      nonComponents.push(item);
    }
  }

  // Add premium for non-component items
  for (const item of nonComponents) {
    totalBasePremium += PRICE_LIST[item.type].basePremium;
  }

  // Add premium for components (with bundle discount)
  for (const componentType of Object.keys(componentCounts)) {
    const count = componentCounts[componentType];
    const bundles = Math.floor(count / 3);
    const remainder = count % 3;

    totalBasePremium += bundles * COMPONENT_BUNDLE_PREMIUM;
    totalBasePremium += remainder * COMPONENT_BASE_PREMIUM;
  }

  return totalBasePremium;
}

export function calculatePremium(
  items: Item[],
  customer: Customer,
  isFirstPolicy: boolean
): number {
  // Calculate premium for each item individually
  let basePremium = 0;
  let surcharges = 0;

  // Group components by type to handle bundling
  const componentCounts: Record<string, number> = {};
  const nonComponents: Array<{ item: Item; basePremium: number }> = [];

  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] || 0) + 1;
    } else {
      const itemBasePremium = PRICE_LIST[item.type].basePremium;
      nonComponents.push({ item, basePremium: itemBasePremium });
      basePremium += itemBasePremium;
    }
  }

  // Add component premiums with bundling
  for (const componentType of Object.keys(componentCounts)) {
    const count = componentCounts[componentType];
    const bundles = Math.floor(count / 3);
    const remainder = count % 3;

    basePremium += bundles * COMPONENT_BUNDLE_PREMIUM;
    basePremium += remainder * COMPONENT_BASE_PREMIUM;
  }

  // Apply item-specific surcharges
  for (const { item, basePremium: itemBasePremium } of nonComponents) {
    // Cursed items: +50% surcharge
    if (item.cursed) {
      surcharges += itemBasePremium * 0.5;
    }

    // Highly enchanted (≥ 5): +30% surcharge
    if (item.enchantment >= 5) {
      surcharges += itemBasePremium * 0.3;
    }
  }

  // Apply surcharges for components
  for (const componentType of Object.keys(componentCounts)) {
    const count = componentCounts[componentType];
    for (let i = 0; i < count; i++) {
      const item = items.find((it) => it.type === componentType);
      if (item) {
        if (item.cursed) {
          surcharges += COMPONENT_BASE_PREMIUM * 0.5;
        }
        if (item.enchantment >= 5) {
          surcharges += COMPONENT_BASE_PREMIUM * 0.3;
        }
      }
    }
  }

  let premium = basePremium + surcharges;

  // First insurance: +10% surcharge; later contracts: -15% discount
  if (isFirstPolicy) {
    premium *= 1.1;
  } else {
    premium *= 0.85;
  }

  // Long-standing customers (≥ 2 years): -20% discount
  if (customer.yearsWithMHPCO >= 2) {
    premium *= 0.8;
  }

  // Add processing fee (5 G)
  premium += PROCESSING_FEE;

  // Round up (in MHPCO's favor for charges)
  return Math.ceil(premium);
}

export function processClaimForItem(
  item: Item | null,
  damageAmount: number
): number {
  if (!item) {
    return damageAmount;
  }

  // Dragon material: 100% reimbursement (takes precedence)
  if (item.material === "dragon") {
    return damageAmount;
  }

  // Enchantment ≥ 8: 50% reimbursement
  if (item.enchantment >= 8) {
    return Math.ceil(damageAmount * 0.5);
  }

  // Otherwise: full reimbursement
  return damageAmount;
}

export function processClaim(
  policy: Policy,
  damages: Array<{ itemType: string; amount: number }>
): { payout: number; remainingCap: number } {
  let totalDamage = 0;

  // Calculate total damage with special reimbursement rates
  for (const damage of damages) {
    const item = policy.items.find((i) => i.type === damage.itemType);
    const reimbursedAmount = processClaimForItem(item || null, damage.amount);
    totalDamage += reimbursedAmount;
  }

  // Apply deductible (100 G per damage event)
  const deductible = 100;
  let payout = Math.max(0, totalDamage - deductible);

  // Cap at remaining cap
  payout = Math.min(payout, policy.remainingCap);

  // Update remaining cap
  const remainingCap = policy.remainingCap - payout;

  return { payout, remainingCap };
}

export function createPolicy(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const item of items) {
    insuranceSum += getInsuranceValue(item);
  }

  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * 2, // Cap is 2x insurance sum
  };
}
