const ITEM_CATALOG: Record<string, { value: number; base: number; component?: boolean }> = {
  sword: { value: 1000, base: 100 },
  amulet: { value: 600, base: 60 },
  staff: { value: 800, base: 80 },
  potion: { value: 400, base: 40 },
  rune: { value: 250, base: 25, component: true },
  moonstone: { value: 250, base: 25, component: true },
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = {
  customer: Customer;
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

function itemBasePremium(item: Item): number {
  const entry = ITEM_CATALOG[item.type];
  if (!entry) throw new Error(`Unknown item type: ${item.type}`);
  return entry.base;
}

function isComponent(type: string): boolean {
  return ITEM_CATALOG[type]?.component === true;
}

function policyBasePremium(items: Item[]): number {
  for (const item of items) {
    if (!ITEM_CATALOG[item.type]) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const componentCounts = new Map<string, number>();
  let total = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      total += itemBasePremium(item);
    }
  }
  for (const [type, count] of componentCounts) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * ITEM_CATALOG[type].base;
    }
  }
  return total;
}

function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const entry = ITEM_CATALOG[item.type];
    if (!entry) continue;
    if (item.cursed) total += entry.base * CURSE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += entry.base * HIGH_ENCHANTMENT_RATE;
    }
  }
  return total;
}

function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const policyBase = policyBasePremium(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? policyBase * LOYALTY_RATE
    : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_RATE : 0;
  const totalBeforeFee = policyBase + surcharges + firstInsurance - loyalty - followUp;
  return Math.ceil(totalBeforeFee) + PROCESSING_FEE;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => {
    const entry = ITEM_CATALOG[item.type];
    if (!entry) throw new Error(`Unknown item type: ${item.type}`);
    return sum + entry.value;
  }, 0);
}

type Policy = {
  items: Item[];
  cap: number;
  remainingCap: number;
};

function findInsuredItem(policy: Policy, itemType: string, usedIndices: Set<number>): Item {
  for (let i = 0; i < policy.items.length; i++) {
    if (!usedIndices.has(i) && policy.items[i].type === itemType) {
      usedIndices.add(i);
      return policy.items[i];
    }
  }
  throw new Error(`Claim references item ${itemType} not in policy`);
}

const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

// Spec: high-enchantment (>=8) gets 50% reimbursement; dragon material gets full.
// When both apply, the 50% rule wins.
function reimbursableAmount(item: Item, damageAmount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return damageAmount; // full reimbursement (covers dragon material and standard case)
}

function processClaim(policy: Policy, damages: Damage[]): ClaimResult {
  // Validate: each damage must correspond to an insured item (typed, count-respecting)
  const usedIndices = new Set<number>();
  let payoutTotal = 0;
  for (const dmg of damages) {
    if (dmg.amount < 0) {
      throw new Error("Damage amount cannot be negative");
    }
    const item = findInsuredItem(policy, dmg.itemType, usedIndices);
    const raw = reimbursableAmount(item, dmg.amount);
    const afterDeductible = Math.max(0, raw - DEDUCTIBLE);
    payoutTotal += afterDeductible;
  }
  const cappedPayout = Math.min(payoutTotal, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: StepResult[] } {
  const policies: (Policy | undefined)[] = [];
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const cap = insuranceSum(step.items) * CAP_MULTIPLIER;
      policies.push({ items: step.items, cap, remainingCap: cap });
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Policy ${step.policy} not found`);
      policies.push(undefined);
      return processClaim(policy, step.incident.damages);
    }
  });
  return { results };
}
