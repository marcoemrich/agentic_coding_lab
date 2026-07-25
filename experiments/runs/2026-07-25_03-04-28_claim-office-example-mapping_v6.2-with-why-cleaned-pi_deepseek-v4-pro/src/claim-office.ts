type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type Step = QuoteStep | ClaimStep;

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
}

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Policy {
  items: Item[];
  cap: number;
  remainingCap: number;
}

export function processScenario(scenario: Scenario): { results: StepResult[] } {
  validateItemTypes(scenario);
  const policies: Policy[] = [];
  const results: StepResult[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      quoteCount++;
      const insuranceSum = step.items.reduce((sum, item) => sum + getInsuranceValue(item.type), 0);
      const cap = insuranceSum * 2;
      policies.push({ items: step.items, cap, remainingCap: cap });
      results.push(computeQuotePremium(step, quoteCount, scenario.customer.yearsWithMHPCO));
    } else if (step.op === "claim") {
      validateClaim(step, policies);
      const policy = policies[step.policy];
      const payout = computeClaimPayout(step, policy);
      policies[step.policy] = { ...policy, remainingCap: policy.remainingCap - payout };
      results.push({ payout, remainingCap: policy.remainingCap - payout });
    }
  }
  return { results };
}

function computeQuotePremium(step: QuoteStep, quoteIndex: number, yearsWithMHPCO: number): StepResult {
  const items = step.items;
  if (items.length === 0) {
    return { premium: PROCESSING_FEE };
  }
  const basePremium = computeBasePremium(items);
  const itemModifiers = computeItemModifiers(items);
  let policyModifiers = percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PCT);
  if (yearsWithMHPCO >= 2) {
    policyModifiers -= percentOf(basePremium, LOYALTY_DISCOUNT_PCT);
  }
  if (quoteIndex > 1) {
    policyModifiers -= percentOf(basePremium, FOLLOW_UP_DISCOUNT_PCT);
  }
  const rawTotal = basePremium + itemModifiers + policyModifiers + PROCESSING_FEE;
  const premium = Math.ceil(rawTotal); // round in MHPCO's favor
  return { premium };
}

function computeClaimPayoutForDamage(damage: { itemType: string; amount: number }, policy: Policy): number {
  const policyItem = policy.items.find(i => i.type === damage.itemType);
  const reimbursement = computeReimbursementRate(damage.amount, policyItem);
  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function computeReimbursementRate(damageAmount :  number, policyItem: Item | undefined): number {
  if (policyItem && policyItem.enchantment !== undefined && policyItem.enchantment >= 8) {
    return Math.floor(damageAmount * 50 / 100);
  }
  return damageAmount;
}

function computeClaimPayout(step: ClaimStep, policy: Policy): number {
  const totalPayout = step.incident.damages.reduce(
    (sum, damage) => sum + computeClaimPayoutForDamage(damage, policy), 0
  );
  const actualPayout = Math.min(totalPayout, policy.remainingCap);
  return Math.floor(actualPayout);
}

function computeItemModifiers(items: Item[]): number {
  let mods = 0;
  for (const item of items) {
    if (item.cursed) {
      mods += percentOf(getUnitPrice(item.type), CURSED_SURCHARGE_PCT);
    }
    if (item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD) {
      mods += percentOf(getUnitPrice(item.type), HIGH_ENCHANTMENT_SURCHARGE_PCT);
    }
  }
  return mods;
}

function computeBasePremium(items: Item[]): number {
  // Group components by type for block pricing
  const componentCounts: Map<string, number> = new Map();
  let total = 0;
  for (const item of items) {
    if (BLOCK_PRICING_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) || 0) + 1);
    } else {
      total += getUnitPrice(item.type);
    }
  }
  // Apply block pricing for components: only exactly 3 of same type gets 60 G
  for (const [type, count] of componentCounts) {
    if (count === 3) {
      total += 60;
    } else {
      total += count * getUnitPrice(type);
    }
  }
  return total;
}

const BLOCK_PRICING_TYPES = new Set(["rune", "moonstone"]);

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function getUnitPrice(itemType: string): number {
  return BASE_PREMIUM[itemType] ?? 0;
}

type StepResult = { premium?: number; payout?: number; remainingCap?: number };

function validateItemTypes(scenario: Scenario): void {
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      checkAllItemTypesValid(step.items.map(i => i.type));
    } else if (step.op === "claim") {
      checkAllItemTypesValid(step.incident.damages.map(d => d.itemType));
    }
  }
}

const DEDUCTIBLE = 100;

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

function getInsuranceValue(itemType: string): number {
  return INSURANCE_VALUE[itemType] ?? 0;
}

function validateClaim(step: ClaimStep, policies: Policy[]): void {
  const policy = policies[step.policy];
  const coveredTypes = new Set(policy.items.map(i => i.type));
  // Count insured items by type
  const insuredCounts: Map<string, number> = new Map();
  for (const item of policy.items) {
    insuredCounts.set(item.type, (insuredCounts.get(item.type) || 0) + 1);
  }
  // Count damages by type
  const damageCounts: Map<string, number> = new Map();
  for (const damage of step.incident.damages) {
    if (damage.amount < 0) {
      throw new Error("Negative damage amount");
    }
    if (!coveredTypes.has(damage.itemType)) {
      throw new Error(`${damage.itemType} not covered by policy`);
    }
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) || 0) + 1);
  }
  // Check that damages don't exceed insured counts
  for (const [type, count] of damageCounts) {
    const insuredCount = insuredCounts.get(type) || 0;
    if (count > insuredCount) {
      throw new Error(`More ${type} damages than insured`);
    }
  }
}

function checkAllItemTypesValid(types: string[]): void {
  for (const type of types) {
    if (!VALID_ITEM_TYPES.has(type)) {
      throw new Error(`Unknown item type: ${type}`);
    }
  }
}

const PROCESSING_FEE = 5;
const VALID_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM));

// Policy-level modifier percentages
const FIRST_INSURANCE_SURCHARGE_PCT = 10;
const LOYALTY_DISCOUNT_PCT = 20;
const FOLLOW_UP_DISCOUNT_PCT = 15;
// Item-level modifier percentages
const CURSED_SURCHARGE_PCT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PCT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function percentOf(amount: number, pct: number): number {
  return amount * pct / 100;
}