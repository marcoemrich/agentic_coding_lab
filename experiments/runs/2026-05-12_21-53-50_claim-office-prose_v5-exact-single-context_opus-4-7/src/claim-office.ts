export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export type QuoteStep = { op: "quote"; items: Item[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
};

const INSURANCE_SUMS: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
};

const DEDUCTIBLE = 100;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 1.1;
const CURSED_SURCHARGE = 1.5;
const HIGH_ENCHANT_SURCHARGE = 1.3;
const HIGH_ENCHANT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.8;
const LOYALTY_THRESHOLD = 2;
const SUBSEQUENT_CONTRACT_DISCOUNT = 0.85;

// Round up to whole G "in MHPCO's favor", tolerating FP error from percentage math.
function ceilGold(amount: number): number {
  return Math.ceil(Math.round(amount * 1000) / 1000);
}

const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

function itemRiskFactor(item: Item): number {
  let factor = 1;
  if (item.cursed) factor *= CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) factor *= HIGH_ENCHANT_SURCHARGE;
  return factor;
}

function basePremiumOf(items: Item[]): number {
  const groups = new Map<string, Item[]>();
  for (const it of items) {
    const list = groups.get(it.type) ?? [];
    list.push(it);
    groups.set(it.type, list);
  }
  let total = 0;
  for (const [type, group] of groups) {
    const base = BASE_PREMIUMS[type];
    if (base === COMPONENT_BASE) {
      const blocks = Math.floor(group.length / COMPONENT_BLOCK_SIZE);
      const remainder = group.length - blocks * COMPONENT_BLOCK_SIZE;
      total += blocks * COMPONENT_BLOCK_BASE + remainder * COMPONENT_BASE;
    } else {
      for (const it of group) {
        total += base * itemRiskFactor(it);
      }
    }
  }
  return total;
}

function computeQuotePremium(items: Item[], customer: Customer, contractIndex: number): number {
  let amount = basePremiumOf(items);
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD) amount *= LOYALTY_DISCOUNT;
  amount *= contractIndex === 0 ? FIRST_INSURANCE_SURCHARGE : SUBSEQUENT_CONTRACT_DISCOUNT;
  return ceilGold(amount) + PROCESSING_FEE;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function policyOf(items: Item[]): Policy {
  let insuranceSum = 0;
  for (const it of items) insuranceSum += INSURANCE_SUMS[it.type] ?? 0;
  return { items, remainingCap: 2 * insuranceSum };
}

const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_REIMBURSEMENT = 0.5;
const DRAGON_MATERIAL = "dragon";

function reimbursableFraction(item: Item | undefined): number {
  if (item?.material === DRAGON_MATERIAL) return 1;
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD) {
    return HIGH_ENCHANT_REIMBURSEMENT;
  }
  return 1;
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  let reimbursable = 0;
  for (const d of incident.damages) {
    const item = policy.items.find((it) => it.type === d.itemType);
    reimbursable += d.amount * reimbursableFraction(item);
  }
  const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
  const payout = Math.min(afterDeductible, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const customer = scenario.customer;
  let contractIndex = 0;
  const policies: Policy[] = [];
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = computeQuotePremium(step.items, customer, contractIndex);
      contractIndex++;
      policies.push(policyOf(step.items));
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
}
