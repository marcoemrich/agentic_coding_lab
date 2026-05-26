// --- Types ---
interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Array<{ itemType: string; amount: number }> };
}
type Step = QuoteStep | ClaimStep;

interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

// --- Pricing constants ---
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

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

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

// --- Component block pricing ---
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function basePremiumForGroup(type: string, groupItems: Item[]): number {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${type}`);
  }
  if (groupItems.length === BLOCK_SIZE && COMPONENT_TYPES.has(type)) {
    return BLOCK_PREMIUM;
  }
  return groupItems.length * BASE_PREMIUMS[type];
}

function basePremiumFor(items: Item[]): number {
  let total = 0;
  for (const [type, groupItems] of groupByType(items)) {
    total += basePremiumForGroup(type, groupItems);
  }
  return total;
}

function itemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    const base = BASE_PREMIUMS[item.type];
    if (item.cursed) total += base * CURSE_SURCHARGE_RATE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
  }
  return total;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, priorQuoteCount: number): number {
  const basePremium = basePremiumFor(items);
  const surcharges = itemSurcharges(items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followupDiscount = priorQuoteCount > 0 ? basePremium * FOLLOWUP_DISCOUNT_RATE : 0;
  return Math.ceil(
    basePremium + surcharges + firstInsuranceSurcharge - loyaltyDiscount - followupDiscount +
      PROCESSING_FEE,
  );
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function payoutForDamage(item: Item, amount: number): number {
  let reimbursable = amount;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    reimbursable = amount * HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
  return afterDeductible;
}

function processClaim(policy: Policy, damages: Array<{ itemType: string; amount: number }>): {
  payout: number;
  remainingCap: number;
} {
  // Count damages per type and ensure policy has at least that many of each.
  const damageCounts = new Map<string, number>();
  for (const d of damages) {
    damageCounts.set(d.itemType, (damageCounts.get(d.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    const insuredCount = policy.items.filter((i) => i.type === type).length;
    if (insuredCount < count) {
      throw new Error(`more damages of type ${type} than insured items`);
    }
  }
  let totalPayout = 0;
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
    const item = policy.items.find((i) => i.type === damage.itemType);
    if (!item) throw new Error(`item not in policy: ${damage.itemType}`);
    totalPayout += payoutForDamage(item, damage.amount);
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const roundedPayout = Math.floor(cappedPayout);
  policy.remainingCap -= roundedPayout;
  return { payout: roundedPayout, remainingCap: policy.remainingCap };
}

function insuranceSumFor(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (!(item.type in INSURANCE_VALUES)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
    total += INSURANCE_VALUES[item.type];
  }
  return total;
}

export function runScenario(input: unknown): unknown {
  const scenario = input as Scenario;
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};
  const results = scenario.steps.map((step, idx) => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      quoteCount++;
      const insuranceSum = insuranceSumFor(step.items);
      policies[idx] = { items: step.items, remainingCap: insuranceSum * CAP_MULTIPLIER };
      return { premium };
    }
    // claim
    const policy = policies[step.policy];
    return processClaim(policy, step.incident.damages);
  });
  return { results };
}
