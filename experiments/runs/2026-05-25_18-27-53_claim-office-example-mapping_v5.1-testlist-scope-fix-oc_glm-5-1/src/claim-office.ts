export type QuoteItem = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = {
  op: "quote";
  items: QuoteItem[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: { itemType: string; amount: number }[];
  };
};

export type Step = QuoteStep | ClaimStep;

export type ScenarioInput = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioOutput = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const BLOCK_PREMIUM = 60;
const BLOCK_SIZE = 3;

function computeComponentBasePremium(count: number, perUnit: number): number {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * perUnit;
}

function computeItemSurcharges(items: QuoteItem[]): number {
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    const base = BASE_PREMIUMS[item.type] ?? 0;
    if (item.cursed) total += base * 0.5;
    if ((item.enchantment ?? 0) >= 5) total += base * 0.3;
  }
  return total;
}

const KNOWN_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

function validateItemTypes(items: QuoteItem[]): void {
  for (const item of items) {
    if (!KNOWN_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

function countByType(items: QuoteItem[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  return counts;
}

function computePolicyBasePremium(items: QuoteItem[]): number {
  const counts = countByType(items);
  let total = 0;
  for (const [type, count] of Object.entries(counts)) {
    if (COMPONENT_TYPES.has(type)) {
      total += computeComponentBasePremium(count, BASE_PREMIUMS[type] ?? 25);
    } else {
      total += (BASE_PREMIUMS[type] ?? 0) * count;
    }
  }
  return total;
}

const DEDUCTIBLE = 100;

type Policy = {
  items: QuoteItem[];
  insuranceSum: number;
  remainingCap: number;
};

function computeInsuranceSum(items: QuoteItem[]): number {
  const counts = countByType(items);
  let total = 0;
  for (const [type, count] of Object.entries(counts)) {
    total += count * (INSURANCE_VALUES[type] ?? 0);
  }
  return total;
}

function computeDamagePayout(damage: { itemType: string; amount: number }, policyItems: QuoteItem[]): number {
  const matchingItem = policyItems.find((item) => item.type === damage.itemType);
  if (!matchingItem) throw new Error(`Damage to item not in policy: ${damage.itemType}`);
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);

  const isHighEnchant = !COMPONENT_TYPES.has(damage.itemType) && (matchingItem.enchantment ?? 0) >= 8;
  const isDragon = !COMPONENT_TYPES.has(damage.itemType) && matchingItem.material === "dragon";

  let payout = damage.amount;
  if (isHighEnchant) {
    payout = payout * 0.5;
  } else if (isDragon) {
    // full reimbursement
  }
  payout -= DEDUCTIBLE;
  return payout;
}

export function processScenario(input: ScenarioInput): ScenarioOutput {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of input.steps) {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const policyBasePremium = computePolicyBasePremium(step.items);
      const itemSurcharges = computeItemSurcharges(step.items);
      const firstInsurance = policyBasePremium * 0.1;
      const loyalty = input.customer.yearsWithMHPCO >= 2 ? policyBasePremium * 0.2 : 0;
      const followUp = quoteCount > 0 ? policyBasePremium * 0.15 : 0;
      const subtotal = policyBasePremium + itemSurcharges + firstInsurance - loyalty - followUp;
      const premium = Math.ceil(subtotal + PROCESSING_FEE);
      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({ items: step.items, insuranceSum, remainingCap: insuranceSum * 2 });
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const itemCounts = countByType(policy.items);
      const damageCounts = countByType(
        step.incident.damages.map((d) => ({ type: d.itemType })),
      );
      for (const [type, count] of Object.entries(damageCounts)) {
        if ((itemCounts[type] ?? 0) < count) {
          throw new Error(`More ${type} damage entries than ${type} items insured`);
        }
      }
      const damagePayouts = step.incident.damages.map((d) => computeDamagePayout(d, policy.items));
      const totalPayoutRaw = damagePayouts.reduce((sum, p) => sum + p, 0);
      const cappedPayout = Math.min(totalPayoutRaw, policy.remainingCap);
      const payout = Math.floor(cappedPayout);
      policy.remainingCap -= payout;
      results.push({ payout, remainingCap: policy.remainingCap });
    }
  }
  return { results };
}
