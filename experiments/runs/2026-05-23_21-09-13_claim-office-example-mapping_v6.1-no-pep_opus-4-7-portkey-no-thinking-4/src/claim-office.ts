const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };

type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };

type Step = QuoteStep | ClaimStep;

type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_OF_3_PREMIUM = 60;
const COMPONENT_INSURANCE_VALUE = 250;

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isComponent = (type: string): boolean => KNOWN_COMPONENT_TYPES.has(type);

const baseForItem = (item: Item): number => {
  if (item.type in BASE_PREMIUM) return BASE_PREMIUM[item.type];
  if (isComponent(item.type)) return COMPONENT_BASE_PREMIUM;
  throw new Error(`Unknown item type: ${item.type}`);
};

const insuranceValueForItem = (item: Item): number => {
  if (item.type in INSURANCE_VALUE) return INSURANCE_VALUE[item.type];
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
};

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= 5;

const isCursed = (item: Item): boolean => item.cursed === true;

// Sum of base premiums for the policy, applying the block-of-3 discount per
// component type. A block requires EXACTLY 3 alike components of the same type.
const policyBaseSum = (items: Item[]): number => {
  // Group components by type for block computation.
  const componentCounts: Record<string, number> = {};
  let nonComponentBase = 0;
  for (const item of items) {
    if (isComponent(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      nonComponentBase += baseForItem(item);
    }
  }
  let componentBase = 0;
  for (const count of Object.values(componentCounts)) {
    if (count === 3) {
      componentBase += COMPONENT_BLOCK_OF_3_PREMIUM;
    } else {
      componentBase += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return nonComponentBase + componentBase;
};

// Item-level surcharges (cursed + high enchantment + first-insurance), as a
// fractional amount added on top of the item's base premium. Block-discounted
// components still contribute their share of these surcharges based on the
// per-item base (NOT the block-discounted base), since the spec only mentions
// the block discount for the base premium itself.
//
// All items in a quote are treated as a first insurance.
const itemSurcharges = (item: Item): number => {
  const base = baseForItem(item);
  let surcharge = 0;
  if (isCursed(item)) surcharge += base * 0.5;
  if (isHighEnchantment(item)) surcharge += base * 0.3;
  surcharge += base * 0.1; // first insurance, per spec
  return surcharge;
};

// Validate all item types up-front so we throw before any output is produced.
const validateItems = (items: Item[]): void => {
  for (const item of items) {
    baseForItem(item);
  }
};

const quotePremium = (
  step: QuoteStep,
  customerYears: number,
  isFollowUpContract: boolean,
): number => {
  validateItems(step.items);

  const baseSum = policyBaseSum(step.items);
  const surchargesSum = step.items.reduce(
    (sum, item) => sum + itemSurcharges(item),
    0,
  );
  // Policy-wide discounts apply to the policy base sum.
  let policyDiscounts = 0;
  if (customerYears >= 2) policyDiscounts += baseSum * 0.2; // loyalty
  if (isFollowUpContract) policyDiscounts += baseSum * 0.15; // follow-up

  const total = baseSum + surchargesSum - policyDiscounts;
  return Math.ceil(total) + PROCESSING_FEE;
};

const buildPolicy = (items: Item[]): Policy => {
  validateItems(items);
  const insuranceSum = items.reduce(
    (sum, item) => sum + insuranceValueForItem(item),
    0,
  );
  return {
    items,
    insuranceSum,
    remainingCap: insuranceSum * 2,
  };
};

// Process a single damage entry against the policy, mutating remainingCap.
// Returns the payout for this damage.
const processDamage = (policy: Policy, damage: Damage): number => {
  // The damaged item must exist in the policy (by type). The "no double
  // counting" rule is enforced separately by ensuring damages-of-type ≤
  // items-of-type before processing.
  const item = policy.items.find((i) => i.type === damage.itemType);
  if (!item) throw new Error(`Damage references item not in policy: ${damage.itemType}`);

  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);

  let reimbursable = damage.amount;
  // High enchantment clause (>=8) halves the damage. It "wins" over the
  // dragon-material clause; otherwise dragon material gives full reimbursement,
  // which is also the default, so we only need to check the enchantment clause.
  if ((item.enchantment ?? 0) >= 8) {
    reimbursable = reimbursable / 2;
  }

  let payout = reimbursable - DEDUCTIBLE;
  if (payout < 0) payout = 0;
  if (payout > policy.remainingCap) payout = policy.remainingCap;

  const finalPayout = Math.floor(payout);
  policy.remainingCap -= finalPayout;
  return finalPayout;
};

const validateClaimAgainstPolicy = (policy: Policy, incident: Incident): void => {
  // Check every damage refers to a known item type.
  for (const damage of incident.damages) {
    if (!(damage.itemType in INSURANCE_VALUE) && !isComponent(damage.itemType)) {
      throw new Error(`Unknown damaged item type: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
  // Check that for each type, damages count ≤ insured count.
  const insuredCount: Record<string, number> = {};
  for (const item of policy.items) {
    insuredCount[item.type] = (insuredCount[item.type] ?? 0) + 1;
  }
  const damagedCount: Record<string, number> = {};
  for (const damage of incident.damages) {
    damagedCount[damage.itemType] = (damagedCount[damage.itemType] ?? 0) + 1;
    if (damagedCount[damage.itemType] > (insuredCount[damage.itemType] ?? 0)) {
      throw new Error(
        `Too many damages of type ${damage.itemType}: not covered by policy`,
      );
    }
  }
};

const processClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  validateClaimAgainstPolicy(policy, incident);
  let totalPayout = 0;
  for (const damage of incident.damages) {
    totalPayout += processDamage(policy, damage);
  }
  return { payout: totalPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount >= 1;
      const premium = quotePremium(step, scenario.customer.yearsWithMHPCO, isFollowUp);
      policies[index] = buildPolicy(step.items);
      quoteCount += 1;
      return { premium };
    }
    // claim
    const policy = policies[step.policy];
    if (!policy) throw new Error(`Claim references unknown policy: ${step.policy}`);
    return processClaim(policy, step.incident);
  });

  return { results };
};
