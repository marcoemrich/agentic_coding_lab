const PROCESSING_FEE = 5;
const INITIAL_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_SURCHARGE = 0.3;
const FOLLOWUP_DISCOUNT = 0.15;
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const CLAIM_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT = 0.5;
const COMPONENT_TYPES = ["rune", "moonstone"];

const PREMIUMS: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const VALUES: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Scenario = { customer: { yearsWithMHPCO: number }; steps: (QuoteStep | ClaimStep)[] };
type Policy = { items: Item[]; remainingCap: number };

function validateItems(items: Item[]): void {
  if (items.some((item) => !(item.type in PREMIUMS))) {
    throw new Error("unknown item type");
  }
}

function premium(items: Item[], yearsWithMHPCO: number, isFollowup: boolean): number {
  const regularBase = items.reduce((total, item) => total + PREMIUMS[item.type], 0);
  const blocks = COMPONENT_TYPES.filter((type) => items.filter((item) => item.type === type).length === BLOCK_SIZE).length;
  const base = regularBase - blocks * BLOCK_DISCOUNT;
  const curse = items.filter((item) => item.cursed).reduce((total, item) => total + PREMIUMS[item.type] * CURSE_SURCHARGE, 0);
  const enchantment = items.filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT)
    .reduce((total, item) => total + PREMIUMS[item.type] * ENCHANTMENT_SURCHARGE, 0);
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followup = isFollowup ? base * FOLLOWUP_DISCOUNT : 0;
  return Math.ceil(base + curse + enchantment + base * INITIAL_SURCHARGE - loyalty - followup + PROCESSING_FEE);
}

function policyFor(items: Item[]): Policy {
  return { items, remainingCap: items.reduce((sum, item) => sum + VALUES[item.type], 0) * CAP_MULTIPLIER };
}

function damagePayout(policy: Policy, damage: Damage): number {
  const item = policy.items.find((covered) => covered.type === damage.itemType)!;
  const reimbursement = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT ? damage.amount * HALF_REIMBURSEMENT : damage.amount;
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("damage amount must not be negative");
  }
  for (const type of new Set(damages.map((damage) => damage.itemType))) {
    if (damages.filter((damage) => damage.itemType === type).length > policy.items.filter((item) => item.type === type).length) {
      throw new Error("damage entries exceed covered items");
    }
  }
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateDamages(policy, damages);
  const desired = damages.reduce((total, damage) => total + damagePayout(policy, damage), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(input: unknown): { results: unknown[] } {
  const scenario = input as Scenario;
  const results: unknown[] = [];
  const policies = new Map<number, Policy>();
  let quotes = 0;
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      validateItems(step.items);
      results.push({ premium: premium(step.items, scenario.customer.yearsWithMHPCO, quotes > 0) });
      policies.set(index, policyFor(step.items));
      quotes += 1;
    } else {
      results.push(processClaim(policies.get(step.policy)!, step.incident.damages));
    }
  });
  return { results };
}
