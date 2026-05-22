interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Customer {
  yearsWithMHPCO?: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface Policy {
  items: Item[];
  remainingCap?: number;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

interface Scenario {
  customer: Customer;
  steps: (QuoteStep | ClaimStep)[];
}

interface QuoteResult {
  premium: number;
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function countBy<T>(items: T[], keyFn: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyFn(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}

function calculateBasePremium(typeCounts: Record<string, number>): number {
  let total = 0;
  for (const [type, count] of Object.entries(typeCounts)) {
    if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * (BASE_PREMIUM[type] ?? 0);
    }
  }
  return total;
}

const CURSED_SURCHARGE_RATE = 0.5;
const ENCHANTMENT_SURCHARGE_RATE = 0.3;
const ENCHANTMENT_THRESHOLD = 5;

function calculateItemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = BASE_PREMIUM[item.type] ?? 0;
    if (item.cursed) {
      total += base * CURSED_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= ENCHANTMENT_THRESHOLD) {
      total += base * ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return total;
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function calculateQuotePremium(items: Item[], customer: Customer, quoteIndex: number): number {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const typeCounts = countBy(items, (item) => item.type);
  const basePremium = calculateBasePremium(typeCounts);
  const itemSurcharges = calculateItemSurcharges(items);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = (customer.yearsWithMHPCO ?? 0) >= LOYALTY_THRESHOLD_YEARS
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = quoteIndex >= 1
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const adjustedPremium = basePremium + itemSurcharges + firstInsurance - loyaltyDiscount - followUpDiscount;
  return Math.ceil(adjustedPremium + PROCESSING_FEE);
}

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

function calculateInsuranceSum(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (INSURANCE_VALUE[item.type] ?? 0),
    0
  );
}

function calculateDamageReimbursement(damage: Damage, policyItems: Item[]): number {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
  const policyItem = policyItems.find((item) => item.type === damage.itemType);
  if (!policyItem) throw new Error(`Item type "${damage.itemType}" is not covered by this policy`);
  const enchantment = policyItem.enchantment ?? 0;
  const reimbursement = enchantment >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursement - DEDUCTIBLE;
}

function calculateClaimResult(policy: Policy, incident: Incident): ClaimResult {
  const damageCounts = countBy(incident.damages, (d) => d.itemType);
  const policyCounts = countBy(policy.items, (item) => item.type);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[type] ?? 0)) {
      throw new Error(`More damage entries for "${type}" than policy covers`);
    }
  }

  if (policy.remainingCap === undefined) {
    const insuranceSum = calculateInsuranceSum(policy.items);
    policy.remainingCap = insuranceSum * CAP_MULTIPLIER;
  }
  const desiredPayout = Math.floor(
    incident.damages.reduce(
      (sum: number, damage) => sum + calculateDamageReimbursement(damage, policy.items),
      0
    )
  );
  const totalPayout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= totalPayout;
  return { payout: totalPayout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  const policies: Policy[] = [];
  const results: (QuoteResult | ClaimResult)[] = [];
  let quoteIndex = 0;

  for (const step of scenario.steps) {
    if (step.op === "quote") {
      policies.push({ items: step.items });
      results.push({
        premium: calculateQuotePremium(step.items, scenario.customer, quoteIndex),
      });
      quoteIndex++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      results.push(calculateClaimResult(policy, step.incident));
    }
  }

  return { results };
}
