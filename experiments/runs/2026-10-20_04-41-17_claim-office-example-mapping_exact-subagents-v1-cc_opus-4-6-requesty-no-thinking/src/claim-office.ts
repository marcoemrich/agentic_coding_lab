interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

type Step = QuoteStep | ClaimStep;

interface ScenarioInput {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const KNOWN_TYPES = new Set([...Object.keys(BASE_PREMIUMS), ...COMPONENT_TYPES]);

const COMPONENT_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;

function computeComponentBasePremium(count: number): number {
  if (count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * COMPONENT_PREMIUM;
}

function computeQuote(step: QuoteStep, customer: { yearsWithMHPCO: number }, quoteIndex: number) {
  for (const item of step.items) {
    if (!KNOWN_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }

  let policyBasePremium = 0;
  let itemSurcharges = 0;
  const componentCounts = new Map<string, number>();

  for (const item of step.items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      const base = BASE_PREMIUMS[item.type];
      policyBasePremium += base;
      if (item.cursed) itemSurcharges += base * 0.5;
      if ((item.enchantment ?? 0) >= 5) itemSurcharges += base * 0.3;
    }
  }

  for (const [, count] of componentCounts) {
    policyBasePremium += computeComponentBasePremium(count);
  }

  let premium = policyBasePremium + itemSurcharges;

  if (customer.yearsWithMHPCO >= 2) {
    premium -= policyBasePremium * 0.2;
  }

  premium += policyBasePremium * 0.1;

  if (quoteIndex > 0) {
    premium -= policyBasePremium * 0.15;
  }

  premium += PROCESSING_FEE;
  premium = Math.ceil(premium);

  return { premium };
}

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  totalPaidOut: number;
}

function computeClaim(step: ClaimStep, policies: Map<number, Policy>) {
  const policy = policies.get(step.policy);
  if (!policy) throw new Error(`No policy at step index ${step.policy}`);

  for (const damage of step.incident.damages) {
    if (!KNOWN_TYPES.has(damage.itemType)) {
      throw new Error(`Unknown item type: ${damage.itemType}`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }

  const policyItemCounts = new Map<string, number>();
  for (const item of policy.items) {
    policyItemCounts.set(item.type, (policyItemCounts.get(item.type) ?? 0) + 1);
  }

  const damageItemCounts = new Map<string, number>();
  for (const damage of step.incident.damages) {
    damageItemCounts.set(damage.itemType, (damageItemCounts.get(damage.itemType) ?? 0) + 1);
  }

  for (const [type, count] of damageItemCounts) {
    const insuredCount = policyItemCounts.get(type) ?? 0;
    if (count > insuredCount) {
      throw new Error(`Damage for ${type} exceeds insured count`);
    }
  }

  const policyItemsByType = new Map<string, Item[]>();
  for (const item of policy.items) {
    const list = policyItemsByType.get(item.type) ?? [];
    list.push(item);
    policyItemsByType.set(item.type, list);
  }

  const usedIndices = new Map<string, number>();
  let totalPayout = 0;

  for (const damage of step.incident.damages) {
    const items = policyItemsByType.get(damage.itemType)!;
    const idx = usedIndices.get(damage.itemType) ?? 0;
    const item = items[idx];
    usedIndices.set(damage.itemType, idx + 1);

    let reimbursement: number;
    const isComponent = COMPONENT_TYPES.has(damage.itemType);

    if (!isComponent && (item.enchantment ?? 0) >= 8) {
      reimbursement = damage.amount * 0.5;
    } else if (!isComponent && item.material === "dragon") {
      reimbursement = damage.amount;
    } else {
      reimbursement = damage.amount;
    }

    reimbursement = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += reimbursement;
  }

  const remainingCap = policy.cap - policy.totalPaidOut;
  if (totalPayout > remainingCap) {
    totalPayout = remainingCap;
  }

  totalPayout = Math.floor(totalPayout);
  policy.totalPaidOut += totalPayout;

  return { payout: totalPayout, remainingCap: policy.cap - policy.totalPaidOut };
}

export function processScenario(input: ScenarioInput) {
  const results: unknown[] = [];
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  for (let i = 0; i < input.steps.length; i++) {
    const step = input.steps[i];
    if (step.op === "quote") {
      const result = computeQuote(step, input.customer, quoteCount);
      quoteCount++;

      let insuranceSum = 0;
      for (const item of step.items) {
        if (COMPONENT_TYPES.has(item.type)) {
          insuranceSum += COMPONENT_INSURANCE_VALUE;
        } else {
          insuranceSum += INSURANCE_VALUES[item.type];
        }
      }

      policies.set(i, {
        items: step.items,
        insuranceSum,
        cap: insuranceSum * 2,
        totalPaidOut: 0,
      });

      results.push(result);
    } else {
      const result = computeClaim(step, policies);
      results.push(result);
    }
  }

  return { results };
}
