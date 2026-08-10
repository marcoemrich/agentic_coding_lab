export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Array<{ itemType: string; amount: number }>;
  };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: "quote"; items: Item[] } | ClaimStep>;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

const PRICE_LIST: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
  rune: { value: 250, premium: 25 },
  moonstone: { value: 250, premium: 25 },
};

const componentTypes = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_ITEM_PREMIUM = 20;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const INITIAL_ASSESSMENT_RATE = 0.1;
const PROCESSING_FEE = 5;
const POLICY_CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;

function priceFor(type: string): { value: number; premium: number } {
  const price = PRICE_LIST[type];
  if (!price) throw new Error(`Unknown item type: ${type}`);
  return price;
}

function basePremiums(items: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    priceFor(item.type);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return items.map((item) =>
    componentTypes.has(item.type) && counts.get(item.type) === COMPONENT_BLOCK_SIZE
      ? COMPONENT_BLOCK_ITEM_PREMIUM
      : priceFor(item.type).premium,
  );
}

function quotePremium(items: Item[], yearsWithMHPCO: number, priorContracts: number): number {
  const bases = basePremiums(items);
  const policyBase = bases.reduce((sum, premium) => sum + premium, 0);
  const itemSurcharges = items.reduce((sum, item, index) => {
    const base = bases[index];
    return sum + (item.cursed ? base * CURSE_SURCHARGE_RATE : 0)
      + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);
  }, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = priorContracts > 0 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(policyBase + itemSurcharges - loyaltyDiscount
    + policyBase * INITIAL_ASSESSMENT_RATE - followUpDiscount + PROCESSING_FEE);

}

function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + priceFor(item.type).value, 0);
  return { items: items.map((item) => ({ ...item })), remainingCap: insuranceSum * POLICY_CAP_MULTIPLIER };
}

function payoutAfterDeductible(item: Item, damageAmount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? damageAmount * CLAIM_ENCHANTMENT_REIMBURSEMENT_RATE
    : damageAmount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function claim(policy: Policy, step: ClaimStep): { payout: number; remainingCap: number } {
  const available = new Map<string, Item[]>();
  for (const item of policy.items) {
    const typedItems = available.get(item.type) ?? [];
    typedItems.push(item);
    available.set(item.type, typedItems);
  }

  let rawPayout = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    if (!PRICE_LIST[damage.itemType]) throw new Error(`Unknown item type: ${damage.itemType}`);
    const insuredItem = available.get(damage.itemType)?.shift();
    if (!insuredItem) throw new Error(`Damage item is not covered by policy: ${damage.itemType}`);
    rawPayout += payoutAfterDeductible(insuredItem, damage.amount);
  }

  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: ScenarioResult["results"] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      policies.set(stepIndex, createPolicy(step.items));
      quoteCount += 1;
      results.push({ premium });
      return;
    }

    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy does not reference an earlier quote: ${step.policy}`);
    results.push(claim(policy, step));
  });

  return { results };
}
