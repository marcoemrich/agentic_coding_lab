const PROCESSING_FEE = 5;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

interface Customer {
  yearsWithMHPCO: number;
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Array<Damage>;
}

interface QuoteStep {
  op: "quote";
  items: Array<Item>;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const basePremiumFor = (type: string): number => BASE_PREMIUMS[type] ?? 0;

const itemSurcharge = (item: Item): number => {
  const base = basePremiumFor(item.type);
  const cursedSurcharge = item.cursed ? base * CURSED_SURCHARGE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return cursedSurcharge + enchantmentSurcharge;
};

const countBy = <T>(items: Array<T>, keyOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countByType = (items: Array<Item>): Record<string, number> =>
  countBy(items, (item) => item.type);

const policyBasePremiumFor = (items: Array<Item>): number => {
  const typeCounts = countByType(items);
  return Object.entries(typeCounts).reduce(
    (total, [type, count]) =>
      total + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE : count * basePremiumFor(type)),
    0,
  );
};

const quotePremium = (customer: Customer, items: Array<Item>, quoteIndex: number): number => {
  const policyBasePremium = policyBasePremiumFor(items);
  const totalSurcharges = items.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const firstInsurance = policyBasePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD
    ? policyBasePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = quoteIndex > 0
    ? policyBasePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const grossPremium = policyBasePremium + totalSurcharges + firstInsurance;
  const totalDiscounts = loyaltyDiscount + followUpDiscount;
  return Math.ceil(grossPremium - totalDiscounts + PROCESSING_FEE);
};

const INSURANCE_VALUE_MULTIPLIER = 10;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const insuranceSumFor = (policyItems: Array<Item>): number =>
  policyItems.reduce(
    (sum, item) => sum + basePremiumFor(item.type) * INSURANCE_VALUE_MULTIPLIER,
    0,
  );

const validateDamages = (damages: Array<Damage>): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
  }
};

const findPolicyItem = (policyItems: Array<Item>, itemType: string): Item => {
  const matchingItem = policyItems.find((item) => item.type === itemType);
  if (!matchingItem) {
    throw new Error(`Item type "${itemType}" not found in policy`);
  }
  return matchingItem;
};

const reimbursablePayoutFor = (damage: Damage, policyItems: Array<Item>): number => {
  const matchingItem = findPolicyItem(policyItems, damage.itemType);
  const enchantment = matchingItem.enchantment ?? 0;
  const reimbursableAmount = enchantment >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD
    ? damage.amount * CLAIM_HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursableAmount - DEDUCTIBLE);
};

const validateDamageCountsAgainstPolicy = (
  damages: Array<Damage>,
  policyItems: Array<Item>,
): void => {
  const damageCounts = countBy(damages, (d) => d.itemType);
  const policyCounts = countByType(policyItems);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damage entries for "${type}" than policy covers`);
    }
  }
};

const processClaim = (
  policyItems: Array<Item>,
  remainingCap: number,
  damages: Array<Damage>,
): ClaimResult => {
  validateDamages(damages);
  validateDamageCountsAgainstPolicy(damages, policyItems);
  const totalPayout = damages.reduce(
    (sum, damage) => sum + reimbursablePayoutFor(damage, policyItems),
    0,
  );
  const cappedPayout = Math.min(totalPayout, remainingCap);
  return {
    payout: Math.floor(cappedPayout),
    remainingCap: remainingCap - cappedPayout,
  };
};

export const processSteps = (customer: Customer, steps: Array<Step>): Array<QuoteResult | ClaimResult> => {
  const policies: Array<Array<Item>> = [];
  const policyCaps: Map<number, number> = new Map();
  return steps.map((step) => {
    if (step.op === "claim") {
      const remainingCap = policyCaps.get(step.policy) ?? CAP_MULTIPLIER * insuranceSumFor(policies[step.policy]);
      const result = processClaim(policies[step.policy], remainingCap, step.incident.damages);
      policyCaps.set(step.policy, result.remainingCap);
      return result;
    }
    const result = {
      premium: quotePremium(customer, step.items, policies.length),
    };
    policies.push(step.items);
    return result;
  });
};
