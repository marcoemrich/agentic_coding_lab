// MHPCO Claim Office - scenario processor
// Main entry point for processing a sequence of quote/claim steps.

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;
export type ScenarioResult = { results: Result[] };

export type Policy = {
  items: Item[];
  premium: number;
  insuranceSum: number;
  cap: number;
  payoutSoFar: number;
};

const FIRST_INSURANCE_RATE = 0.1;
const PROCESSING_FEE = 5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = -0.2;
const FOLLOWUP_DISCOUNT_RATE = -0.15;
const DEDUCTIBLE = 100;
const VERY_HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BUILDING_BLOCK_TYPES = new Set(["rune", "moonstone"]);
const BUILDING_BLOCK_COUNT = 3;
const BUILDING_BLOCK_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const VERY_HIGH_ENCHANTMENT_THRESHOLD = 8;

function lookupItemValue(record: Record<string, number>, type: string): number {
  const value = record[type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return value;
}

function basePremiumOf(type: string): number {
  return lookupItemValue(ITEM_BASE_PREMIUMS, type);
}

function insuranceValueOf(type: string): number {
  return lookupItemValue(ITEM_INSURANCE_VALUES, type);
}

function isHighEnchantment(item: Item): boolean {
  return (
    item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD
  );
}

function isVeryHighEnchantment(item: Item): boolean {
  return (
    item.enchantment !== undefined &&
    item.enchantment >= VERY_HIGH_ENCHANTMENT_THRESHOLD
  );
}

function policyModifierTotal(policyBase: number, customer: Customer, quoteIndex: number): number {
  const loyaltyRate =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? LOYALTY_DISCOUNT_RATE : 0;
  const followupRate = quoteIndex >= 1 ? FOLLOWUP_DISCOUNT_RATE : 0;
  return policyBase * (loyaltyRate + followupRate + FIRST_INSURANCE_RATE);
}

function itemModifierTotal(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (item.cursed) {
      total += CURSE_SURCHARGE_RATE * basePremiumOf(item.type);
    }
    if (isHighEnchantment(item)) {
      total += HIGH_ENCHANTMENT_SURCHARGE_RATE * basePremiumOf(item.type);
    }
  }
  return total;
}

function policyBasePremium(items: Item[]): number {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let total = 0;
  for (const [type, count] of Object.entries(counts)) {
    const base = basePremiumOf(type);
    if (BUILDING_BLOCK_TYPES.has(type) && count === BUILDING_BLOCK_COUNT) {
      total += BUILDING_BLOCK_PREMIUM;
    } else {
      total += count * base;
    }
  }
  return total;
}

function computeQuote(items: Item[], customer: Customer, quoteIndex: number): QuoteResult {
  const policyBase = policyBasePremium(items);
  const itemMods = itemModifierTotal(items);
  const policyMods = policyModifierTotal(policyBase, customer, quoteIndex);
  const premium = Math.ceil(policyBase + itemMods + policyMods + PROCESSING_FEE);
  return { premium };
}

function computeInsuranceSum(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    total += insuranceValueOf(item.type);
  }
  return total;
}

type ClaimOutcome = {
  result: ClaimResult;
  policy: Policy;
};

function matchDamages(items: Item[], damages: Damage[]): Map<number, Damage> {
  const typeToIndices: Record<string, number[]> = {};
  for (let i = 0; i < items.length; i++) {
    const type = items[i].type;
    if (typeToIndices[type] === undefined) typeToIndices[type] = [];
    typeToIndices[type].push(i);
  }

  const usedCount: Record<string, number> = {};
  const matched = new Map<number, Damage>();
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const indices = typeToIndices[damage.itemType];
    if (indices === undefined) {
      throw new Error(`Damage for item not in policy: ${damage.itemType}`);
    }
    const used = usedCount[damage.itemType] ?? 0;
    if (used >= indices.length) {
      throw new Error(`Too many damages for item type: ${damage.itemType}`);
    }
    matched.set(indices[used], damage);
    usedCount[damage.itemType] = used + 1;
  }
  return matched;
}

function payoutForDamage(item: Item, damage: Damage): number {
  const clauseAmount = isVeryHighEnchantment(item)
    ? damage.amount * VERY_HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;
  return Math.max(0, clauseAmount - DEDUCTIBLE);
}

function processClaim(policy: Policy, incident: ClaimStep["incident"]): ClaimOutcome {
  const matched = matchDamages(policy.items, incident.damages);

  let totalPayout = 0;
  for (const [itemIndex, damage] of matched) {
    totalPayout += payoutForDamage(policy.items[itemIndex], damage);
  }

  const remaining = Math.max(0, policy.cap - policy.payoutSoFar);
  const cappedPayout = Math.min(totalPayout, remaining);
  // Round down to whole G in MHPCO's favor; only the final payout is rounded.
  const payout = Math.floor(cappedPayout);
  const newPayoutSoFar = policy.payoutSoFar + payout;
  return {
    result: { payout, remainingCap: policy.cap - newPayoutSoFar },
    policy: { ...policy, payoutSoFar: newPayoutSoFar },
  };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: Result[] = [];
  const policies: (Policy | undefined)[] = [];
  let quoteIndex = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const insuranceSum = computeInsuranceSum(step.items);
      const cap = 2 * insuranceSum;
      const policy: Policy = {
        items: step.items,
        premium: computeQuote(step.items, scenario.customer, quoteIndex).premium,
        insuranceSum,
        cap,
        payoutSoFar: 0,
      };
      policies.push(policy);
      results.push({ premium: policy.premium });
      quoteIndex++;
    } else {
      const currentPolicy = policies[step.policy];
      if (currentPolicy === undefined) {
        throw new Error(`Invalid policy reference: ${step.policy}`);
      }
      const { result, policy: updatedPolicy } = processClaim(
        currentPolicy,
        step.incident,
      );
      policies[step.policy] = updatedPolicy;
      results.push(result);
    }
  }
  return { results };
}
