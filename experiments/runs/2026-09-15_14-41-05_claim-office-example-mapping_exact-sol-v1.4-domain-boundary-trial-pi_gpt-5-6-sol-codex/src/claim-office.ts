export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

export interface ScenarioResult {
  results: Array<{ premium: number } | { payout: number; remainingCap: number }>;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;
const PROCESSING_FEE = 5;

function componentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function itemRiskSurcharge(item: Item): number {
  const base = BASE_PREMIUMS[item.type];
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, priorContracts: number): number {
  const mainPremium = items
    .filter((item) => !COMPONENT_TYPES.has(item.type))
    .reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
  const basePremium = mainPremium
    + componentPremium(items, "rune")
    + componentPremium(items, "moonstone");
  const riskSurcharge = items.reduce((total, item) => total + itemRiskSurcharge(item), 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_RATE : 0;
  const followUpDiscount = priorContracts > 0 ? basePremium * FOLLOW_UP_RATE : 0;
  return Math.ceil(basePremium + riskSurcharge + basePremium * INITIAL_ASSESSMENT_RATE
    - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function rawReimbursement(item: Item | undefined, damage: number): number {
  return (item?.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
    ? damage * HIGH_ENCHANTMENT_REIMBURSEMENT
    : damage;
}

function takeInsuredItem(availableItems: Item[], itemType: string): Item {
  const itemIndex = availableItems.findIndex((item) => item.type === itemType);
  if (itemIndex < 0) throw new Error("Damage item is not insured");
  return availableItems.splice(itemIndex, 1)[0];
}

function validateDamageAmount(amount: number): void {
  if (amount < 0) throw new Error("Damage amount cannot be negative");
}

function settleClaim(policy: Policy, incident: Incident | undefined): { payout: number; remainingCap: number } {
  const availableItems = [...policy.items];
  const desiredPayout = (incident?.damages ?? []).reduce((total, damage) => {
    validateDamageAmount(damage.amount);
    const item = takeInsuredItem(availableItems, damage.itemType);
    return total + Math.max(0, rawReimbursement(item, damage.amount) - DEDUCTIBLE);
  }, 0);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function validatePolicyItems(items: Item[]): void {
  if (items.some((item) => !(item.type in INSURANCE_VALUES))) {
    throw new Error("Unknown item type");
  }
}

export function runScenario(scenario: Scenario): ScenarioResult {
  let priorContracts = 0;
  const policies = new Map<number, Policy>();
  const results: ScenarioResult["results"] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      validatePolicyItems(items);
      const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
      policies.set(index, { items, remainingCap: insuranceSum * CAP_MULTIPLIER });
      results.push({ premium: quotePremium(items, scenario.customer.yearsWithMHPCO, priorContracts) });
      priorContracts += 1;
      return;
    }
    const policy = policies.get(step.policy ?? -1);
    if (policy === undefined) throw new Error("Policy not found");
    results.push(settleClaim(policy, step.incident));
  });
  return { results };
}
