export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type ScenarioInput = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

export type ScenarioOutput = {
  results: Result[];
};

type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;

const MAIN_ITEMS: Record<string, { basePremium: number; insuranceValue: number }> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
};

function isValidItemType(type: string): boolean {
  return !!MAIN_ITEMS[type] || COMPONENT_TYPES.has(type);
}

function computeInsuranceSum(items: Item[]): number {
  let sum = 0;
  for (const item of items) {
    if (MAIN_ITEMS[item.type]) {
      sum += MAIN_ITEMS[item.type].insuranceValue;
    } else if (COMPONENT_TYPES.has(item.type)) {
      sum += COMPONENT_INSURANCE_VALUE;
    }
  }
  return sum;
}

function computeComponentBasePremium(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts[item.type] = (counts[item.type] || 0) + 1;
    }
  }
  let premium = 0;
  for (const count of Object.values(counts)) {
    premium += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return premium;
}

function computeQuotePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  let basePremium = 0;
  let itemSpecificSurcharges = 0;
  for (const item of items) {
    if (MAIN_ITEMS[item.type]) {
      const itemBase = MAIN_ITEMS[item.type].basePremium;
      basePremium += itemBase;
      if (item.cursed) itemSpecificSurcharges += itemBase * CURSED_SURCHARGE;
      if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
        itemSpecificSurcharges += itemBase * HIGH_ENCHANTMENT_SURCHARGE;
      }
    } else if (!COMPONENT_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  basePremium += computeComponentBasePremium(items);
  let policyWideModifiers = 0;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) policyWideModifiers -= basePremium * LOYALTY_DISCOUNT;
  policyWideModifiers += basePremium * FIRST_INSURANCE_SURCHARGE;
  if (isFollowUp) policyWideModifiers -= basePremium * FOLLOW_UP_DISCOUNT;
  return Math.ceil(basePremium + itemSpecificSurcharges + policyWideModifiers + PROCESSING_FEE);
}

function groupItemsByType(items: Item[]): Record<string, Item[]> {
  const groups: Record<string, Item[]> = {};
  for (const item of items) {
    if (!groups[item.type]) groups[item.type] = [];
    groups[item.type].push(item);
  }
  return groups;
}

function computeClaimPayout(step: ClaimStep, policy: Policy): { payout: number; remainingCap: number } {
  const itemsByType = groupItemsByType(policy.items);
  const damageCountsByType: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
    damageCountsByType[damage.itemType] = (damageCountsByType[damage.itemType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCountsByType)) {
    const policyCount = itemsByType[type]?.length ?? 0;
    if (policyCount === 0) throw new Error(`Item type ${type} is not part of the policy`);
    if (count > policyCount) throw new Error(`More ${type} damage entries than ${type} items insured`);
  }
  let totalPayout = 0;
  const usedItems: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    const itemIndex = usedItems[damage.itemType] ?? 0;
    const item = itemsByType[damage.itemType][itemIndex];
    usedItems[damage.itemType] = itemIndex + 1;
    let reimbursement = damage.amount;
    if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
      reimbursement = damage.amount * 0.5;
    }
    reimbursement -= DEDUCTIBLE;
    if (reimbursement < 0) reimbursement = 0;
    totalPayout += reimbursement;
  }
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - totalPayout;
  return { payout: Math.floor(totalPayout), remainingCap: Math.floor(remainingCap) };
}

export function processScenario(input: ScenarioInput): ScenarioOutput {
  const results: Result[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of input.steps) {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!isValidItemType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
      }
      const premium = computeQuotePremium(step.items, input.customer.yearsWithMHPCO, quoteCount > 0);
      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: 2 * insuranceSum });
      results.push({ premium });
      quoteCount++;
    } else {
      const policy = policies[step.policy];
      const claimResult = computeClaimPayout(step, policy);
      policies[step.policy] = { ...policy, remainingCap: claimResult.remainingCap };
      results.push(claimResult);
    }
  }
  return { results };
}
