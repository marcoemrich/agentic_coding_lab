export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

const PROCESSING_FEE = 5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;
const CAP_MULTIPLIER = 2;
const CLAIM_HALF_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HALF_RATE = 0.5;
const DEDUCTIBLE = 100;

const itemBaseValues: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const itemInsuranceValues: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const componentTypes = ["rune", "moonstone"];

function valueOf(table: Record<string, number>, type: string): number {
  return table[type] ?? 0;
}

export function insuranceSum(items: QuoteItem[]): number {
  return items.reduce(
    (sum, item) => sum + valueOf(itemInsuranceValues, item.type),
    0
  );
}

export function itemBasePremium(items: QuoteItem[]): number {
  const total = items.reduce(
    (sum, item) => sum + valueOf(itemBaseValues, item.type),
    0
  );
  return total - blockDiscount(items);
}

function blockDiscount(items: QuoteItem[]): number {
  let discount = 0;
  for (const type of componentTypes) {
    const count = items.filter((item) => item.type === type).length;
    if (count === BLOCK_SIZE) discount += BLOCK_DISCOUNT;
  }
  return discount;
}

export function itemPremium(items: QuoteItem[]): number {
  const base = itemBasePremium(items);
  const adjustments = items.reduce(
    (sum, item) => sum + itemAdjustment(item),
    0
  );
  return base + adjustments;
}

function itemAdjustment(item: QuoteItem): number {
  const base = valueOf(itemBaseValues, item.type);
  let adjustment = 0;
  if (item.cursed) adjustment += base * CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    adjustment += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return adjustment;
}

export function quote(
  customer: Customer,
  items: QuoteItem[],
  priorContracts = 0
): number {
  for (const item of items) {
    if (!(item.type in itemBaseValues)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
  const base = itemBasePremium(items);
  let adjusted = itemPremium(items);
  if (priorContracts >= 1) adjusted -= base * FOLLOW_UP_DISCOUNT;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    adjusted -= base * LOYALTY_DISCOUNT;
  }
  adjusted += base * FIRST_INSURANCE_SURCHARGE;
  return Math.ceil(adjusted + PROCESSING_FEE);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause?: string;
  damages: Damage[];
}

export interface Policy {
  items: QuoteItem[];
  insuranceSum: number;
  remainingCap: number;
}

export function createPolicy(items: QuoteItem[]): Policy {
  const sum = insuranceSum(items);
  return { items, insuranceSum: sum, remainingCap: sum * CAP_MULTIPLIER };
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function reimbursementFactor(item: QuoteItem): number {
  if ((item.enchantment ?? 0) >= CLAIM_HALF_ENCHANTMENT_THRESHOLD) {
    return CLAIM_HALF_RATE;
  }
  return 1;
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const availableItems = [...policy.items];
  let desired = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const index = availableItems.findIndex(
      (item) => item.type === damage.itemType
    );
    if (index === -1) {
      throw new Error(
        `damage references item not in policy: ${damage.itemType}`
      );
    }
    const item = availableItems.splice(index, 1)[0];
    const reimbursement =
      damage.amount * reimbursementFactor(item) - DEDUCTIBLE;
    desired += Math.max(0, reimbursement);
  }
  const payout = Math.min(policy.remainingCap, Math.floor(desired));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export type Step =
  | { op: "quote"; items: QuoteItem[] }
  | { op: "claim"; policy: number; incident: Incident };

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export function processScenario(scenario: Scenario): StepResult[] {
  const { customer, steps } = scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results: StepResult[] = [];
  for (const step of steps) {
    if (step.op === "quote") {
      policies.push(createPolicy(step.items));
      results.push({ premium: quote(customer, step.items, quoteCount) });
      quoteCount += 1;
    } else {
      const policy = policies[step.policy];
      if (policy === undefined) {
        throw new Error(`invalid policy index: ${step.policy}`);
      }
      const result = claim(policy, step.incident);
      results.push({
        payout: result.payout,
        remainingCap: result.remainingCap,
      });
    }
  }
  return results;
}