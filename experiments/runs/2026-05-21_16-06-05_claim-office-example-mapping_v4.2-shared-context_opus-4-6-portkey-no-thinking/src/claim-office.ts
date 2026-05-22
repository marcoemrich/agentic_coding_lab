interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface Damage {
  type: string;
  amount: number;
}

interface Step {
  type: string;
  items?: Item[];
  policy?: number;
  damages?: Damage[];
}

interface Customer {
  yearsWithMHPCO: number;
  quoteNumber?: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const FULL_REIMBURSEMENT_RATE = 1;
const CLAIM_HALF_REIMBURSEMENT_RATE = 0.5;
const INSURANCE_CAP_MULTIPLIER = 2;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  rune: 250,
  amulet: 600,
};

function countByType(items: { type: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] || 0) + 1;
  }
  return counts;
}

function calculateBasePremium(items: Item[]): number {
  const typeCounts = countByType(items);

  return Object.entries(typeCounts).reduce((total, [type, count]) => {
    const premium = COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
      ? BLOCK_PREMIUM
      : count * BASE_PREMIUM[type];
    return total + premium;
  }, 0);
}

function calculateLoyaltyDiscount(customer: Customer, basePremium: number): number {
  return customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
}

function calculateFollowUpDiscount(customer: Customer, basePremium: number): number {
  return (customer.quoteNumber ?? 1) >= 2
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
}

function calculateItemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemBasePremium = BASE_PREMIUM[item.type];
    const curseSurcharge = item.cursed ? itemBasePremium * CURSE_SURCHARGE_RATE : 0;
    const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
    return total + curseSurcharge + enchantmentSurcharge;
  }, 0);
}

function calculateInsuranceCap(policyItems: Item[]): number {
  const insuranceSum = policyItems.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return insuranceSum * INSURANCE_CAP_MULTIPLIER;
}

function validateDamageCounts(damages: Damage[], policyItems: Item[]): void {
  const damageCounts = countByType(damages);
  const policyCounts = countByType(policyItems);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] || 0)) {
      throw new Error(`Damages exceed insured item count for type: ${type}`);
    }
  }
}

function calculateDamageReimbursement(damage: Damage, policyItems: Item[]): number {
  const matchingItem = policyItems.find(item => item.type === damage.type);
  const hasHighEnchantment = matchingItem !== undefined && (matchingItem.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
  const reimbursementRate = hasHighEnchantment ? CLAIM_HALF_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
  return Math.max(damage.amount * reimbursementRate - DEDUCTIBLE, 0);
}

function calculateClaimPayout(damages: Damage[], policyItems: Item[]): number {
  return damages.reduce((sum, damage) => sum + calculateDamageReimbursement(damage, policyItems), 0);
}

function validateDamageAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
}

function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function calculateQuotePremium(customer: Customer, items: Item[]): number {
  validateItemTypes(items);
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSurcharges(items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = calculateLoyaltyDiscount(customer, basePremium);
  const followUpDiscount = calculateFollowUpDiscount(customer, basePremium);
  return Math.ceil(basePremium + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

export function processScenario(scenario: Scenario): unknown[] {
  const results: unknown[] = [];
  const policyPayouts: Record<number, number> = {};

  for (const step of scenario.steps) {
    if (step.type === "quote") {
      const premium = calculateQuotePremium(scenario.customer, step.items!);
      results.push({ premium });
    } else if (step.type === "claim") {
      const policyIndex = step.policy!;
      const policyItems = scenario.steps[policyIndex].items!;
      validateDamageAmounts(step.damages!);
      validateDamageCounts(step.damages!, policyItems);

      const priorPayouts = policyPayouts[policyIndex] || 0;
      const currentCap = calculateInsuranceCap(policyItems) - priorPayouts;
      const totalPayout = calculateClaimPayout(step.damages!, policyItems);
      const payout = Math.floor(Math.min(totalPayout, currentCap));
      const remainingCap = currentCap - payout;
      policyPayouts[policyIndex] = priorPayouts + payout;
      results.push({ payout, remainingCap });
    }
  }

  return results;
}
