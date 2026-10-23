import type { Scenario, Result, Item, Customer, Damage } from "./scenario.js";

const PROCESSING_FEE = 5;
const NOT_IMPLEMENTED = "not implemented";
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const CURSE_RATE = 0.5;
const HIGH_ENCHANT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANT_SURCHARGE_THRESHOLD = 5;
const HIGH_ENCHANT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANT_REIMBURSEMENT_THRESHOLD = 8;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const INSURANCE_CAP_MULTIPLIER = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const isCursed = (item: Item): boolean => item.cursed === true;

const hasEnchantmentAtLeast = (item: Item, threshold: number): boolean =>
  item.enchantment !== undefined && item.enchantment >= threshold;

const triggersHighEnchantSurcharge = (item: Item): boolean =>
  hasEnchantmentAtLeast(item, HIGH_ENCHANT_SURCHARGE_THRESHOLD);

interface PerItemSurchargeRule {
  rate: number;
  matches: (item: Item) => boolean;
}

const PER_ITEM_SURCHARGE_RULES: PerItemSurchargeRule[] = [
  { rate: CURSE_RATE, matches: isCursed },
  { rate: HIGH_ENCHANT_SURCHARGE_RATE, matches: triggersHighEnchantSurcharge },
];

function itemSurcharge(item: Item, base: number): number {
  let surcharge = 0;
  for (const rule of PER_ITEM_SURCHARGE_RULES) {
    if (rule.matches(item)) {
      surcharge += rule.rate * base;
    }
  }
  return surcharge;
}

function roundUpForPremium(value: number): number {
  return Math.ceil(value);
}
function roundDownForPayout(value: number): number {
  return Math.floor(value);
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
  premium: number;
}

export function runScenario(scenario: Scenario): Result[] {
  const policies: Policy[] = [];
  const results: Result[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const policy = createPolicy(step.items, scenario.customer, isFollowUp);
      policies.push(policy);
      results.push({ premium: policy.premium });
    } else {
      const policy = policies[step.policy];
      const result = processClaim(policy, step.incident.damages);
      results.push(result);
    }
  }
  return results;
}

function createPolicy(items: Item[], customer: Customer, isFollowUp: boolean): Policy {
  const premium = quote(items, customer, isFollowUp);
  let insuranceSum = 0;
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUES)) {
      throw new Error(NOT_IMPLEMENTED);
    }
    insuranceSum += INSURANCE_VALUES[item.type];
  }
  const cap = INSURANCE_CAP_MULTIPLIER * insuranceSum;
  return {
    items: [...items],
    insuranceSum,
    cap,
    remainingCap: cap,
    premium,
  };
}

function quote(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const counts: Record<string, number> = {};
  let perItemSurchargeTotal = 0;
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(NOT_IMPLEMENTED);
    }
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    perItemSurchargeTotal += itemSurcharge(item, BASE_PREMIUMS[item.type]);
  }

  let policyBase = 0;
  for (const [type, count] of Object.entries(counts)) {
    policyBase += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * BASE_PREMIUMS[type];
  }

  let loyaltyDiscount = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    loyaltyDiscount = LOYALTY_DISCOUNT * policyBase;
  }

  let followUpDiscount = 0;
  if (isFollowUp) {
    followUpDiscount = FOLLOW_UP_DISCOUNT * policyBase;
  }

  const firstInsuranceSurcharge = FIRST_INSURANCE_RATE * policyBase;

  const subtotal =
    policyBase + perItemSurchargeTotal - loyaltyDiscount - followUpDiscount + firstInsuranceSurcharge + PROCESSING_FEE;
  return roundUpForPremium(subtotal);
}

function processClaim(policy: Policy, damages: Damage[]): Result {
  // Count damages by item type
  const damageCounts: Record<string, number> = {};
  for (const d of damages) {
    damageCounts[d.itemType] = (damageCounts[d.itemType] ?? 0) + 1;
  }

  // Count items in policy by type
  const itemCounts: Record<string, number> = {};
  for (const item of policy.items) {
    itemCounts[item.type] = (itemCounts[item.type] ?? 0) + 1;
  }

  // Verify all damage types are valid items in policy
  for (const d of damages) {
    if (!(d.itemType in itemCounts)) {
      throw new Error("damage item not in policy");
    }
    if (d.amount < 0) {
      throw new Error("negative damage amount");
    }
  }

  // Verify damage counts don't exceed policy counts
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > itemCounts[type]) {
      throw new Error("more damages than insured items");
    }
  }

  const remainingItems: Item[] = [...policy.items];
  let totalReimbursement = 0;

  for (const damage of damages) {
    const itemIndex = remainingItems.findIndex((i) => i.type === damage.itemType);
    if (itemIndex === -1) {
      throw new Error("damage item not in policy");
    }
    const item = remainingItems[itemIndex];
    remainingItems.splice(itemIndex, 1);

    // Per-item reimbursement rate:
    // high enchantment (>=8) halves the reimbursement; all other items (including dragon-material)
    // are reimbursed at the full rate.
    const reimbursementRate = hasEnchantmentAtLeast(item, HIGH_ENCHANT_REIMBURSEMENT_THRESHOLD)
      ? HIGH_ENCHANT_REIMBURSEMENT_RATE
      : 1;

    const net = reimbursementRate * damage.amount - DEDUCTIBLE;
    if (net > 0) {
      totalReimbursement += net;
    }
  }

  const payout = roundDownForPayout(Math.min(totalReimbursement, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  policy.remainingCap = remainingCap;

  return { payout, remainingCap };
}
