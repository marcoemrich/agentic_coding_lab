export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const POLICY_CAP_MULTIPLIER = 2;
const FIRST_INSURANCE_PERCENT = 10;
const WHOLE_PERCENT = 100;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_PERCENT = 50;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const DAMAGE_DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const PRICE_LIST: Record<string, { premium: number; value: number }> = {
  sword: { premium: 100, value: 1000 },
  amulet: { premium: 60, value: 600 },
  staff: { premium: 80, value: 800 },
  potion: { premium: 40, value: 400 },
  rune: { premium: 25, value: 250 },
  moonstone: { premium: 25, value: 250 },
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

function itemBasePremium(item: Item, policyItems: Item[]): number {
  const componentCount = policyItems.filter((candidate) => candidate.type === item.type).length;
  const receivesBlockPrice = (item.type === "rune" || item.type === "moonstone") && componentCount === COMPONENT_BLOCK_SIZE;
  return receivesBlockPrice ? COMPONENT_BLOCK_PREMIUM / COMPONENT_BLOCK_SIZE : PRICE_LIST[item.type].premium;
}

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (PRICE_LIST[item.type] === undefined) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const insuredCount = policy.items.filter((item) => item.type === damage.itemType).length;
    const damageCount = damages.filter((candidate) => candidate.itemType === damage.itemType).length;
    if (insuredCount === 0) throw new Error(`Damage item is not insured: ${damage.itemType}`);
    if (damageCount > insuredCount) throw new Error(`More ${damage.itemType} damages than insured items`);
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamages(policy, damages);
  const desiredPayout = damages.reduce((sum, damage) => {
    const insuredItem = policy.items.find((item) => item.type === damage.itemType);
    if (insuredItem === undefined) throw new Error(`Damage item is not insured: ${damage.itemType}`);
    const reimbursementRate = (insuredItem.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT / WHOLE_PERCENT : 1;
    return sum + Math.max(0, damage.amount * reimbursementRate - DAMAGE_DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function calculatePremium(items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number {
  const basePremium = items.reduce((sum, item) => sum + itemBasePremium(item, items), 0);
  const curseSurcharge = items.reduce((sum, item) => sum + (item.cursed === true ? itemBasePremium(item, items) * CURSE_SURCHARGE_PERCENT / WHOLE_PERCENT : 0), 0);
  const enchantmentSurcharge = items.reduce((sum, item) => sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? itemBasePremium(item, items) * HIGH_ENCHANTMENT_SURCHARGE_PERCENT / WHOLE_PERCENT : 0), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_PERCENT / WHOLE_PERCENT : 0;
  const followUpDiscount = isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_PERCENT / WHOLE_PERCENT : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + (basePremium * FIRST_INSURANCE_PERCENT) / WHOLE_PERCENT - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results: ScenarioResult["results"] = [];

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      validateItems(step.items);
      const insuranceSum = step.items.reduce((sum, item) => sum + PRICE_LIST[item.type].value, 0);
      const premium = calculatePremium(step.items, scenario.customer.yearsWithMHPCO, policies.size > 0);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER });
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) throw new Error("Policy not found");
    results.push(processClaim(policy, step.incident.damages));
  });

  return { results };
}
