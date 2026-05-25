export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type Step = QuoteStep | ClaimStep;
export type QuoteStep = { op: 'quote'; items: Item[] };
export type ClaimStep = { op: 'claim'; policy: number; incident: Incident };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type Damage = { itemType: string; amount: number };

export type Result = QuoteResult | ClaimResult;
export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.10;
const CURSED_RATE = 0.50;
const HIGH_ENCHANT_RATE = 0.30;
const LOYALTY_RATE = 0.20;
const FOLLOW_UP_RATE = 0.15;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANT_THRESHOLD = 5;

const MAIN_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_INSURANCE_VALUE = 250;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isKnownItemType(type: string): boolean {
  return type in MAIN_BASE_PREMIUM || COMPONENT_TYPES.has(type);
}

function itemBasePremium(item: Item): number {
  if (isComponent(item)) return COMPONENT_BASE_PREMIUM;
  return MAIN_BASE_PREMIUM[item.type] ?? 0;
}

function componentBlockSavings(items: Item[]): number {
  // For each component type, every full block of 3 saves (3*25 - 60) = 15 G.
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item)) counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let savings = 0;
  for (const n of Object.values(counts)) {
    // A block applies only when the count of alike components is EXACTLY the block size.
    if (n === COMPONENT_BLOCK_SIZE) {
      savings += COMPONENT_BLOCK_SIZE * COMPONENT_BASE_PREMIUM - COMPONENT_BLOCK_PREMIUM;
    }
  }
  return savings;
}

function itemSurcharges(item: Item): number {
  const base = itemBasePremium(item);
  let s = 0;
  if (item.cursed) s += base * CURSED_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_THRESHOLD) s += base * HIGH_ENCHANT_RATE;
  return s;
}

function quote(
  step: QuoteStep,
  customer: { yearsWithMHPCO: number },
  priorContracts: number,
): QuoteResult {
  for (const item of step.items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`unknown item type '${item.type}'`);
    }
  }
  let policyBase = 0;
  let itemSurchargeTotal = 0;
  for (const item of step.items) {
    policyBase += itemBasePremium(item);
    itemSurchargeTotal += itemSurcharges(item);
  }
  policyBase -= componentBlockSavings(step.items);
  let policyMods = 0;
  policyMods += policyBase * FIRST_INSURANCE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    policyMods -= policyBase * LOYALTY_RATE;
  }
  if (priorContracts >= 1) {
    policyMods -= policyBase * FOLLOW_UP_RATE;
  }
  const total = policyBase + itemSurchargeTotal + policyMods + PROCESSING_FEE;
  return { premium: roundUp(total) };
}

function roundUp(n: number): number {
  return Math.ceil(n);
}

type Policy = {
  items: Item[];
  remainingCap: number;
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_PAYOUT_RATE = 0.5;

function itemInsuranceValue(item: Item): number {
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return MAIN_INSURANCE_VALUE[item.type] ?? 0;
}

function makePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((s, it) => s + itemInsuranceValue(it), 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursementRate(item: Item): number {
  // Default is full reimbursement. High-enchantment (>=8) overrides to 50% even for dragon material:
  // the prompt explicitly states the 50% rule wins when both clauses would apply.
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD) return HIGH_ENCHANT_PAYOUT_RATE;
  return 1;
}

function processClaim(step: ClaimStep, policy: Policy): ClaimResult {
  const damageCountByType: Record<string, number> = {};
  for (const damage of step.incident.damages) {
    damageCountByType[damage.itemType] = (damageCountByType[damage.itemType] ?? 0) + 1;
  }
  const insuredCountByType: Record<string, number> = {};
  for (const it of policy.items) {
    insuredCountByType[it.type] = (insuredCountByType[it.type] ?? 0) + 1;
  }
  for (const [type, count] of Object.entries(damageCountByType)) {
    if ((insuredCountByType[type] ?? 0) < count) {
      throw new Error(
        `damages contain ${count} ${type} entries but policy insures only ${insuredCountByType[type] ?? 0}`,
      );
    }
  }
  let payout = 0;
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${damage.amount}`);
    }
    const item = policy.items.find((it) => it.type === damage.itemType);
    if (!item) {
      throw new Error(`damage references item '${damage.itemType}' not part of policy`);
    }
    const reimbursed = damage.amount * reimbursementRate(item);
    const afterDeductible = Math.max(0, reimbursed - DEDUCTIBLE);
    payout += afterDeductible;
  }
  const capped = Math.min(payout, policy.remainingCap);
  const paid = roundDown(capped);
  policy.remainingCap -= paid;
  return { payout: paid, remainingCap: policy.remainingCap };
}

function roundDown(n: number): number {
  return Math.floor(n);
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies: Record<number, Policy> = {};
  let contractCount = 0;
  scenario.steps.forEach((step, idx) => {
    if (step.op === 'quote') {
      results.push(quote(step, scenario.customer, contractCount));
      policies[idx] = makePolicy(step.items);
      contractCount += 1;
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`claim references unknown policy index ${step.policy}`);
      results.push(processClaim(step, policy));
    }
  });
  return { results };
}
