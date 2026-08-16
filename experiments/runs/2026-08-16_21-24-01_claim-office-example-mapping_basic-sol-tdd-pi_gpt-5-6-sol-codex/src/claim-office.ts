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

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function listedBasePremium(item: Item): number {
  const premium = BASE_PREMIUM[item.type];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
}

function basePremium(items: Item[]): number {
  const ordinary = items.reduce((total, item) => total + listedBasePremium(item), 0);
  const componentTypes = ["rune", "moonstone"];
  const blocks = componentTypes.filter((type) => items.filter((item) => item.type === type).length === COMPONENT_BLOCK_SIZE).length;
  return ordinary - blocks * COMPONENT_BLOCK_SAVING;
}

function itemSurcharges(item: Item): number {
  const base = BASE_PREMIUM[item.type] ?? 0;
  const curse = item.cursed ? base * CURSE_RATE : 0;
  const enchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL ? base * ENCHANTMENT_RATE : 0;
  return curse + enchantment;
}

function quote(items: Item[], yearsWithMHPCO: number, followUp: boolean): number {
  const base = basePremium(items);
  const surcharges = items.reduce((total, item) => total + itemSurcharges(item), 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
  const contractDiscount = followUp ? base * FOLLOW_UP_RATE : 0;
  return Math.ceil(base + surcharges + base * INITIAL_ASSESSMENT_RATE - loyalty - contractDiscount + PROCESSING_FEE);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUE[item.type] ?? 0), 0);
}

function damagePayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL
    ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
    : amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamageCoverage(policy: Policy, incident: Incident): void {
  const used = new Map<string, number>();
  incident.damages.forEach((damage) => {
    if (damage.amount < 0) throw new Error("Damage amount must not be negative");
    const next = (used.get(damage.itemType) ?? 0) + 1;
    const covered = policy.items.filter((item) => item.type === damage.itemType).length;
    if (next > covered) throw new Error(`Damage to uninsured item: ${damage.itemType}`);
    used.set(damage.itemType, next);
  });
}

function processClaim(policy: Policy, incident: Incident): Record<string, number> {
  validateDamageCoverage(policy, incident);
  const desired = incident.damages.reduce((total, damage) => {
    const item = policy.items.find((candidate) => candidate.type === damage.itemType);
    return total + damagePayout(item ?? { type: damage.itemType }, damage.amount);
  }, 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  const policies = new Map<number, Policy>();
  const results: Array<Record<string, number>> = [];
  let quoteCount = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      policies.set(index, { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER });
      results.push({ premium: quote(items, scenario.customer.yearsWithMHPCO, quoteCount > 0) });
      quoteCount += 1;
      return;
    }
    const policy = policies.get(step.policy ?? -1);
    if (!policy || !step.incident) throw new Error("Claim references no policy");
    results.push(processClaim(policy, step.incident));
  });
  return { results };
}
