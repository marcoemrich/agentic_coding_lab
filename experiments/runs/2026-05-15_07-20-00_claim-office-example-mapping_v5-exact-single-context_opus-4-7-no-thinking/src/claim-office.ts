// MHPCO Claim Office: quote and claim operations

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

// --- Constants ---

const PROCESSING_FEE = 5;
const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400 };
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_INSURANCE_VALUE = 250;

const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANT_RATE = 0.3;
const HIGH_ENCHANT_PREMIUM_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANT_CLAIM_RATE = 0.5;

// --- Item classification ---

const isComponent = (type: string): boolean => !(type in BASE_PREMIUM);

const itemBase = (item: Item): number => {
  if (isComponent(item.type)) return COMPONENT_PREMIUM;
  return BASE_PREMIUM[item.type];
};

const itemInsuranceValue = (item: Item): number => {
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  return INSURANCE_VALUE[item.type];
};

// --- Quote calculation ---

const componentGroupBase = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
};

const groupCountsByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const itemSurcharge = (item: Item, base: number): number => {
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_PREMIUM_THRESHOLD) surcharge += base * HIGH_ENCHANT_RATE;
  return surcharge;
};

const policyBasePremium = (items: Item[]): number => {
  const mainItems = items.filter((i) => !isComponent(i.type));
  const componentItems = items.filter((i) => isComponent(i.type));
  const mainBase = mainItems.reduce((sum, item) => sum + itemBase(item), 0);
  let componentBase = 0;
  for (const [, count] of groupCountsByType(componentItems)) {
    componentBase += componentGroupBase(count);
  }
  return mainBase + componentBase;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const mainItems = items.filter((i) => !isComponent(i.type));
  const policyBase = policyBasePremium(items);
  const surcharges = mainItems.reduce((sum, item) => sum + itemSurcharge(item, itemBase(item)), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_THRESHOLD ? policyBase * LOYALTY_RATE : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_RATE : 0;
  return Math.ceil(policyBase + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
};

// --- Policy / Claim state ---

type Policy = { items: Item[]; insuranceSum: number; remainingCap: number };

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: CAP_MULTIPLIER * insuranceSum };
};

// Match a damage to an item in the policy (by type, accounting for duplicates already used).
// Returns the item index, or -1 if not matched.
const matchDamageToItem = (policy: Policy, damage: Damage, usedIndices: Set<number>): number => {
  for (let i = 0; i < policy.items.length; i++) {
    if (usedIndices.has(i)) continue;
    if (policy.items[i].type === damage.itemType) return i;
  }
  return -1;
};

const reimbursementForDamage = (item: Item, amount: number): number => {
  let reimbursed = amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANT_CLAIM_THRESHOLD) {
    reimbursed = amount * HIGH_ENCHANT_CLAIM_RATE;
  } else if (item.material === "dragon") {
    reimbursed = amount;
  }
  // After the per-item clause, apply deductible
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  let totalPayout = 0;
  const usedIndices = new Set<number>();
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
    const idx = matchDamageToItem(policy, damage, usedIndices);
    if (idx === -1) throw new Error(`damage references unknown or unavailable item: ${damage.itemType}`);
    usedIndices.add(idx);
    const item = policy.items[idx];
    const payout = reimbursementForDamage(item, damage.amount);
    totalPayout += payout;
  }
  // Apply cap, then round the final payout
  const capped = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(capped);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

// --- Scenario execution ---

// Known component types so we can distinguish them from unknown main-item types.
const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (item.type in BASE_PREMIUM) continue;
    if (KNOWN_COMPONENT_TYPES.has(item.type)) continue;
    throw new Error(`unknown item type: ${item.type}`);
  }
};

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const isFollowUp = quoteCount > 0;
      quoteCount++;
      const premium = quotePremium(step.items, scenario.customer, isFollowUp);
      policies.push(buildPolicy(step.items));
      return { premium };
    }
    const policy = policies[step.policy];
    return processClaim(policy, step.incident);
  });
  return { results };
};

