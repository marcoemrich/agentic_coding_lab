const PROCESSING_FEE = 5;
const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_RATE = 0.5;
const ROUNDING_PRECISION = 1000;
const CAP_MULTIPLIER = 2;

const VALID_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
}

function roundUp(value: number): number {
  return Math.ceil(Math.round(value * ROUNDING_PRECISION) / ROUNDING_PRECISION);
}

function roundDown(value: number): number {
  return Math.floor(Math.round(value * ROUNDING_PRECISION) / ROUNDING_PRECISION);
}

function validateQuoteItems(items: Item[]): void {
  for (const item of items) {
    if (!VALID_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function validateDamageEntry(damage: Damage, availableCounts: Record<string, number>, damageCounts: Record<string, number>): void {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  if (!VALID_TYPES.has(damage.itemType)) {
    throw new Error(`Unknown item type in damage: ${damage.itemType}`);
  }
  if (!(damage.itemType in availableCounts)) {
    throw new Error(`Item not in policy: ${damage.itemType}`);
  }
  damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
  if (damageCounts[damage.itemType] > (availableCounts[damage.itemType] ?? 0)) {
    throw new Error(`More ${damage.itemType} damages than items covered`);
  }
}

function validateClaimDamages(damages: Damage[], policyItems: Item[]): void {
  const availableCounts: Record<string, number> = {};
  for (const item of policyItems) {
    availableCounts[item.type] = (availableCounts[item.type] ?? 0) + 1;
  }

  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    validateDamageEntry(damage, availableCounts, damageCounts);
  }
}

function countComponents(items: Item[]): { nonComponentItems: Item[]; componentCounts: Record<string, number> } {
  const componentCounts: Record<string, number> = {};
  const nonComponentItems: Item[] = [];

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      nonComponentItems.push(item);
    }
  }

  return { nonComponentItems, componentCounts };
}

function calculateBasePremium(items: Item[]): number {
  const { nonComponentItems, componentCounts } = countComponents(items);
  let total = 0;

  for (const item of nonComponentItems) {
    total += BASE_PREMIUMS[item.type] ?? 0;
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === BLOCK_SIZE) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * (BASE_PREMIUMS[type] ?? 0);
    }
  }

  return total;
}

function calculateItemSpecificSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    const base = BASE_PREMIUMS[item.type] ?? 0;
    if (item.cursed) total += base * CURSE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_RATE;
    }
  }
  return total;
}

function calculatePolicyWideModifiers(basePremium: number, yearsWithMHPCO: number, quoteIndex: number): number {
  let total = basePremium * FIRST_INSURANCE_RATE;
  if (yearsWithMHPCO >= LOYALTY_THRESHOLD) {
    total -= basePremium * LOYALTY_RATE;
  }
  if (quoteIndex > 0) {
    total -= basePremium * FOLLOW_UP_RATE;
  }
  return total;
}

function calculateInsuranceSum(items: Item[]): number {
  const { nonComponentItems, componentCounts } = countComponents(items);
  let total = 0;

  for (const item of nonComponentItems) {
    total += INSURANCE_VALUES[item.type] ?? 0;
  }

  for (const [type, count] of Object.entries(componentCounts)) {
    total += count * (INSURANCE_VALUES[type] ?? 0);
  }

  return total;
}

function calculateDamageReimbursement(amount: number, item: Item): number {
  const isHighEnchantment = (item.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
  if (isHighEnchantment) {
    return amount * CLAIM_HIGH_ENCHANTMENT_RATE;
  }
  return amount;
}

function processClaim(policy: Policy, damages: Damage[]): { payout: number; remainingCap: number } {
  validateClaimDamages(damages, policy.items);

  const itemPool = [...policy.items];
  let totalPayout = 0;

  for (const damage of damages) {
    const poolIndex = itemPool.findIndex((item) => item.type === damage.itemType);
    const item = poolIndex >= 0 ? itemPool[poolIndex] : { type: damage.itemType };
    if (poolIndex >= 0) itemPool.splice(poolIndex, 1);

    const reimbursement = calculateDamageReimbursement(damage.amount, item);
    const payout = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += payout;
  }

  const rawPayout = Math.min(totalPayout, policy.remainingCap);
  const payout = roundDown(rawPayout);
  const remainingCap = policy.remainingCap - payout;

  return { payout, remainingCap };
}

interface Step {
  op: string;
  items?: Item[];
  policy?: number;
  incident?: { cause: string; damages: Damage[] };
}

interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

function processQuote(items: Item[], yearsWithMHPCO: number, quoteIndex: number): { premium: number } {
  validateQuoteItems(items);
  if (items.length === 0) {
    return { premium: PROCESSING_FEE };
  }
  const basePremium = calculateBasePremium(items);
  const itemSurcharges = calculateItemSpecificSurcharges(items);
  const policyWide = calculatePolicyWideModifiers(basePremium, yearsWithMHPCO, quoteIndex);
  const premium = roundUp(basePremium + itemSurcharges + policyWide + PROCESSING_FEE);
  return { premium };
}

export function processScenario(input: ScenarioInput): { results: unknown[] } {
  const { customer, steps } = input;
  const results: unknown[] = [];
  const policies: Policy[] = [];
  let quoteIndex = 0;

  for (const step of steps) {
    if (step.op === "quote") {
      const items = step.items ?? [];
      results.push(processQuote(items, customer.yearsWithMHPCO, quoteIndex));
      const insuranceSum = calculateInsuranceSum(items);
      policies.push({ items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER });
      quoteIndex++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy ?? 0];
      const claimResult = processClaim(policy, step.incident?.damages ?? []);
      policy.remainingCap = claimResult.remainingCap;
      results.push(claimResult);
    }
  }

  return { results };
}
