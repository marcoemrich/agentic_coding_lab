// claim-office.ts

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const KNOWN_ITEM_TYPES = new Set<string>(Object.keys(BASE_PREMIUM_BY_ITEM_TYPE));

const COMPONENT_TYPES = new Set<string>(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function loyaltyDiscountFor(yearsInsured: number, baseTotal: number): number {
  return yearsInsured >= LOYALTY_YEARS_THRESHOLD ? baseTotal * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscountFor(contractNumber: number, baseTotal: number): number {
  return contractNumber > 1 ? baseTotal * FOLLOW_UP_DISCOUNT_RATE : 0;
}

function withFirstInsurance(basePremium: number): number {
  return basePremium + basePremium * FIRST_INSURANCE_RATE;
}

function premiumForTypeGroup(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE) {
    return withFirstInsurance(COMPONENT_BLOCK_BASE_PREMIUM);
  }
  return count * withFirstInsurance(BASE_PREMIUM_BY_ITEM_TYPE[type]);
}

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };

function surchargeRateForItem(item: Item): number {
  const cursedRate = item.cursed ? CURSED_SURCHARGE_RATE : 0;
  const enchantmentRate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return cursedRate + enchantmentRate;
}

function surchargeForItem(item: Item): number {
  return BASE_PREMIUM_BY_ITEM_TYPE[item.type] * surchargeRateForItem(item);
}

const CLAIM_DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const MATERIALS_EXEMPT_FROM_REDUCED_REIMBURSEMENT = new Set<string>(["dragon"]);

const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Damage = { type: string; amount: number };

function insuranceCapFor(items: Item[]): number {
  const insuranceSum = items.reduce(
    (sum, item) => sum + INSURANCE_VALUE_BY_ITEM_TYPE[item.type],
    0,
  );
  return insuranceSum * CAP_MULTIPLIER;
}

function isExemptFromReducedReimbursement(item: Item): boolean {
  return (
    COMPONENT_TYPES.has(item.type) ||
    MATERIALS_EXEMPT_FROM_REDUCED_REIMBURSEMENT.has(item.material ?? "")
  );
}

function hasReducedReimbursement(item: Item): boolean {
  if (isExemptFromReducedReimbursement(item)) return false;
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
}

function reimbursementFor(damage: Damage, items: Item[]): number {
  const matchingItem = items.find((item) => item.type === damage.type);
  if (matchingItem && hasReducedReimbursement(matchingItem)) {
    return damage.amount * REDUCED_REIMBURSEMENT_RATE;
  }
  return damage.amount;
}

function rawPayoutFor(damages: Damage[], items: Item[]): number {
  const reimbursementTotal = damages.reduce(
    (sum, d) => sum + reimbursementFor(d, items),
    0,
  );
  return reimbursementTotal - CLAIM_DEDUCTIBLE;
}

function payoutAgainstCap(damages: Damage[], items: Item[], remainingCap: number): number {
  return Math.floor(Math.min(rawPayoutFor(damages, items), remainingCap));
}

function handleClaim(scenario: any): { payout: number; remainingCap: number } {
  const damages: Damage[] = scenario.damages ?? [];
  const items: Item[] = scenario.items ?? [];
  const cap = insuranceCapFor(items);
  const payout = payoutAgainstCap(damages, items, cap);
  return { payout, remainingCap: cap - payout };
}

function countsByTypeOf(items: Item[]): Record<string, number> {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});
}

function sumOf<T>(values: T[], project: (value: T) => number): number {
  return values.reduce((total, value) => total + project(value), 0);
}

function itemsTotalFor(items: Item[]): number {
  const counts = countsByTypeOf(items);
  return sumOf(Object.keys(counts), (type) => premiumForTypeGroup(type, counts[type]));
}

function handleQuote(scenario: any): { premium: number } {
  const items: Item[] = scenario.items ?? [];
  const itemsTotal = itemsTotalFor(items);
  const surchargesTotal = sumOf(items, surchargeForItem);
  const baseTotal = sumOf(items, (item) => BASE_PREMIUM_BY_ITEM_TYPE[item.type]);
  const yearsInsured = scenario.customer?.yearsInsured ?? 0;
  const contractNumber = scenario.customer?.contractNumber ?? 1;
  const loyaltyDiscount = loyaltyDiscountFor(yearsInsured, baseTotal);
  const followUpDiscount = followUpDiscountFor(contractNumber, baseTotal);
  return {
    premium: Math.ceil(itemsTotal + surchargesTotal - loyaltyDiscount - followUpDiscount + PROCESSING_FEE),
  };
}

function runSteps(scenario: any): unknown {
  const customer = scenario.customer;
  const policies: { items: Item[]; remainingCap: number }[] = [];
  const results: unknown[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const items: Item[] = step.items ?? [];
      results.push(handleQuote({ customer, items }));
      policies.push({ items, remainingCap: insuranceCapFor(items) });
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const damages: Damage[] = step.damages ?? [];
      const payout = payoutAgainstCap(damages, policy.items, policy.remainingCap);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}

export function runScenario(scenario: any): unknown {
  if (scenario.steps) {
    return runSteps(scenario);
  }
  if (scenario.command === "claim") {
    return handleClaim(scenario);
  }
  return handleQuote(scenario);
}
