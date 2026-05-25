type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

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

const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const PROCESSING_FEE = 5;
const CURSED_SURCHARGE = 0.5;
const HIGH_ENCH_SURCHARGE = 0.3;
const HIGH_ENCH_THRESHOLD = 5;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCH_CLAIM_THRESHOLD = 8;
const HIGH_ENCH_CLAIM_RATE = 0.5;
const CAP_MULTIPLIER = 2;

function computeBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;

  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += BASE_PREMIUMS[item.type] ?? 0;
    }
  }

  for (const [compType, count] of Object.entries(componentCounts)) {
    if (count % BLOCK_SIZE === 0) {
      total += (count / BLOCK_SIZE) * BLOCK_PRICE;
    } else {
      total += count * BASE_PREMIUMS[compType];
    }
  }

  return total;
}

function computeItemSurcharges(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    const base = BASE_PREMIUMS[item.type] ?? 0;
    if (item.cursed) surcharge += base * CURSED_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCH_THRESHOLD) surcharge += base * HIGH_ENCH_SURCHARGE;
  }
  return surcharge;
}

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Array<{ itemType: string; amount: number }> } };
type Step = QuoteStep | ClaimStep;

type Policy = { items: Item[]; insuranceSum: number; cap: number; remainingCap: number };

function computePolicyWideModifiers(basePremium: number, yearsWithMHPCO: number, quoteIndex: number): number {
  let modifier = 0;
  if (yearsWithMHPCO >= LOYALTY_YEARS) modifier -= basePremium * LOYALTY_DISCOUNT;
  modifier += basePremium * FIRST_INSURANCE_SURCHARGE;
  if (quoteIndex > 0) modifier -= basePremium * FOLLOWUP_DISCOUNT;
  return modifier;
}

function computeInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function countByType(items: Item[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function validateDamages(incident: { cause: string; damages: Array<{ itemType: string; amount: number }> }, policyItemCounts: Record<string, number>): void {
  const damageItemCounts: Record<string, number> = {};
  for (const d of incident.damages) {
    if (d.amount < 0) throw new Error("Claim rejected: negative damage amount");
    damageItemCounts[d.itemType] = (damageItemCounts[d.itemType] ?? 0) + 1;
  }

  for (const [type, count] of Object.entries(damageItemCounts)) {
    if ((policyItemCounts[type] ?? 0) < count) {
      throw new Error(`Claim rejected: more ${type} damages than policy covers`);
    }
  }
}

function computeReimbursable(damage: { itemType: string; amount: number }, policyItem: Item): number {
  if ((policyItem.enchantment ?? 0) >= HIGH_ENCH_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCH_CLAIM_RATE;
  }
  if (policyItem.material === "dragon") {
    return damage.amount;
  }
  return damage.amount;
}

function processClaim(policy: Policy, incident: { cause: string; damages: Array<{ itemType: string; amount: number }> }): { payout: number; remainingCap: number } {
  validateDamages(incident, countByType(policy.items));

  let totalPayout = 0;
  for (const damage of incident.damages) {
    const policyItem = policy.items.find(i => i.type === damage.itemType);
    if (!policyItem) throw new Error(`Claim rejected: ${damage.itemType} not in policy`);

    const reimbursable = computeReimbursable(damage, policyItem);
    const payout = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += payout;
  }

  totalPayout = Math.floor(totalPayout);
  totalPayout = Math.min(totalPayout, policy.remainingCap);
  const remainingCap = policy.remainingCap - totalPayout;
  policy.remainingCap = remainingCap;

  return { payout: totalPayout, remainingCap };
}

const VALID_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!VALID_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

export function processScenario(input: { customer: { yearsWithMHPCO: number }; steps: Step[] }): { results: Result[] } {
  const results: Result[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;

  for (const step of input.steps) {
    if (step.op === "quote") {
      validateItems(step.items);
      const basePremium = computeBasePremium(step.items);
      const itemSurcharges = computeItemSurcharges(step.items);
      const policyWideModifiers = computePolicyWideModifiers(basePremium, input.customer.yearsWithMHPCO, quoteCount);
      const premium = Math.ceil(basePremium + itemSurcharges + policyWideModifiers + PROCESSING_FEE);
      const insuranceSum = computeInsuranceSum(step.items);
      const cap = insuranceSum * CAP_MULTIPLIER;
      policies.push({ items: step.items, insuranceSum, cap, remainingCap: cap });
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const claimResult = processClaim(policy, step.incident);
      results.push(claimResult);
    }
  }

  return { results };
}
