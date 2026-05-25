const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;
const CURSED_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const BLOCK_SIZE = 3;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const INSURANCE_VALUE_MULTIPLIER = 10;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export type ItemInput = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type ScenarioInput = {
  customer: { yearsWithMHPCO: number };
  steps: Array<{
    op: string;
    items?: Array<ItemInput>;
    policy?: number;
    incident?: {
      cause: string;
      damages: Array<{
        itemType: string;
        amount: number;
      }>;
    };
  }>;
};

export type ScenarioResult = {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
};

type Policy = {
  items: ItemInput[];
  insuranceSum: number;
  remainingCap: number;
};

const VALID_TYPES = new Set([...Object.keys(MAIN_ITEM_BASE_PREMIUMS), ...COMPONENT_TYPES]);

function validateItemType(type: string): void {
  if (!VALID_TYPES.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function calculateItemSurcharges(item: ItemInput): number {
  const itemBase = MAIN_ITEM_BASE_PREMIUMS[item.type] ?? 0;
  let surcharge = 0;
  if (item.cursed) {
    surcharge += itemBase * CURSED_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += itemBase * HIGH_ENCHANTMENT_RATE;
  }
  return surcharge;
}

function calculatePolicyWideModifiers(basePremium: number, yearsWithMHPCO: number, isFollowUp: boolean): number {
  let modifiers = basePremium * FIRST_INSURANCE_RATE;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    modifiers -= basePremium * LOYALTY_RATE;
  }
  if (isFollowUp) {
    modifiers -= basePremium * FOLLOW_UP_RATE;
  }
  return modifiers;
}

function calculateItemInsuranceValue(item: ItemInput): number {
  if (COMPONENT_TYPES.has(item.type)) {
    return COMPONENT_PREMIUM * INSURANCE_VALUE_MULTIPLIER;
  }
  return MAIN_ITEM_BASE_PREMIUMS[item.type] * INSURANCE_VALUE_MULTIPLIER;
}

function countByType(items: ItemInput[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function calculateInsuranceSum(items: ItemInput[]): number {
  let sum = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      sum += calculateItemInsuranceValue(item);
    }
  }
  for (const [, count] of Object.entries(componentCounts)) {
    sum += count * COMPONENT_PREMIUM * INSURANCE_VALUE_MULTIPLIER;
  }
  return sum;
}

function calculateQuotePremium(items: ItemInput[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  if (items.length === 0) {
    return PROCESSING_FEE;
  }
  let basePremium = 0;
  let itemSurcharges = 0;
  const componentCounts: Record<string, number> = {};
  for (const item of items) {
    validateItemType(item.type);
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      basePremium += MAIN_ITEM_BASE_PREMIUMS[item.type];
      itemSurcharges += calculateItemSurcharges(item);
    }
  }
  for (const [, count] of Object.entries(componentCounts)) {
    if (count === BLOCK_SIZE) {
      basePremium += BLOCK_PREMIUM;
    } else {
      basePremium += count * COMPONENT_PREMIUM;
    }
  }
  const policyModifiers = calculatePolicyWideModifiers(basePremium, yearsWithMHPCO, isFollowUp);
  return Math.ceil(basePremium + itemSurcharges + policyModifiers + PROCESSING_FEE);
}

function findMatchingItem(items: ItemInput[], itemType: string, usedIndices: Set<number>): ItemInput | undefined {
  for (let i = 0; i < items.length; i++) {
    if (!usedIndices.has(i) && items[i].type === itemType) {
      usedIndices.add(i);
      return items[i];
    }
  }
  return undefined;
}

function calculateReimbursement(item: ItemInput | undefined, amount: number): number {
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function validateDamages(damages: Array<{ itemType: string; amount: number }>, typeCounts: Record<string, number>): void {
  const damageTypeCounts: Record<string, number> = {};
  for (const damage of damages) {
    validateItemType(damage.itemType);
    if (damage.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
    damageTypeCounts[damage.itemType] = (damageTypeCounts[damage.itemType] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageTypeCounts)) {
    if ((typeCounts[type] ?? 0) < count) {
      throw new Error(`Claim references item type not in policy: ${type}`);
    }
  }
}

function calculateClaimPayout(policy: Policy, damages: Array<{ itemType: string; amount: number }>): { payout: number; remainingCap: number } {
  const typeCounts = countByType(policy.items);
  validateDamages(damages, typeCounts);
  const usedIndices = new Set<number>();
  let totalPayout = 0;
  for (const damage of damages) {
    const item = findMatchingItem(policy.items, damage.itemType, usedIndices);
    const reimbursed = calculateReimbursement(item, damage.amount);
    totalPayout += Math.max(0, reimbursed - DEDUCTIBLE);
  }
  const payout = Math.floor(Math.min(totalPayout, policy.remainingCap));
  return { payout, remainingCap: policy.remainingCap - payout };
}

export function processScenario(input: ScenarioInput): ScenarioResult {
  const results: ScenarioResult["results"] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of input.steps) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      const isFollowUp = quoteCount > 0;
      const premium = calculateQuotePremium(items, input.customer.yearsWithMHPCO, isFollowUp);
      const insuranceSum = calculateInsuranceSum(items);
      policies.push({ items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policyIndex = step.policy ?? 0;
      const policy = policies[policyIndex];
      const damages = step.incident?.damages ?? [];
      const result = calculateClaimPayout(policy, damages);
      policy.remainingCap = result.remainingCap;
      results.push(result);
    }
  }
  return { results };
}
