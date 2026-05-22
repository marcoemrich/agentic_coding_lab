export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: Damage[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Result = { premium: number } | { payout: number };

export interface ScenarioResult {
  results: Result[];
}

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BUILDING_BLOCK_PREMIUM = 60;
const CURSED_SURCHARGE = 0.50;
const HIGH_ENCHANTMENT_SURCHARGE = 0.30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_SURCHARGE = 0.10;
const LOYALTY_DISCOUNT = 0.20;
const LOYALTY_YEARS_THRESHOLD = 2;
const MULTI_CONTRACT_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const HIGH_DAMAGE_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.50;
const DRAGON_MATERIAL = "dragon";

const ceilG = (amount: number): number => Math.ceil(amount - 1e-9);

const itemRiskMultiplier = (item: Item): number => {
  let multiplier = 1;
  if (item.cursed) multiplier += CURSED_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) multiplier += HIGH_ENCHANTMENT_SURCHARGE;
  return multiplier;
};

const basePremiumForItems = (items: Item[]): number => {
  const componentItems: Item[] = [];
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentItems.push(item);
    } else {
      total += (BASE_PREMIUM[item.type] ?? 0) * itemRiskMultiplier(item);
    }
  }
  // Group components by type for building-block pricing
  const byType: Record<string, Item[]> = {};
  for (const item of componentItems) {
    (byType[item.type] ??= []).push(item);
  }
  for (const type of Object.keys(byType)) {
    const group = byType[type];
    const blocks = Math.floor(group.length / 3);
    const remainder = group.length % 3;
    // Apply blocks first (no per-item modifier since blocks are flat-priced)
    total += blocks * BUILDING_BLOCK_PREMIUM;
    // Remainder items priced individually with their modifiers
    for (let i = 0; i < remainder; i++) {
      total += BASE_PREMIUM[type] * itemRiskMultiplier(group[i]);
    }
  }
  return total;
};

const customerMultiplier = (customer: Customer): number => {
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    return 1 - LOYALTY_DISCOUNT;
  }
  return 1 + FIRST_INSURANCE_SURCHARGE;
};

const quoteItems = (items: Item[], customer: Customer, contractIndex: number): number => {
  const base = basePremiumForItems(items);
  let adjusted = base * customerMultiplier(customer);
  if (contractIndex > 0) {
    adjusted *= (1 - MULTI_CONTRACT_DISCOUNT);
  }
  return ceilG(adjusted) + PROCESSING_FEE;
};

const reimbursementForItem = (item: Item | undefined, damageAmount: number): number => {
  if (item?.material === DRAGON_MATERIAL) {
    return damageAmount;
  }
  if (item && (item.enchantment ?? 0) >= HIGH_DAMAGE_ENCHANTMENT_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT;
  }
  return damageAmount;
};

const processClaim = (step: ClaimStep, policies: Map<number, Item[]>): number => {
  const policyItems = policies.get(step.policy) ?? [];
  const reimbursable = step.incident.damages.reduce((sum, d) => {
    const item = policyItems.find((it) => it.type === d.itemType);
    return sum + reimbursementForItem(item, d.amount);
  }, 0);
  return Math.max(0, reimbursable - DEDUCTIBLE);
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let contractIndex = 0;
  const policies = new Map<number, Item[]>();
  const results: Result[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      const premium = quoteItems(step.items, scenario.customer, contractIndex);
      contractIndex += 1;
      policies.set(stepIndex, step.items);
      return { premium };
    }
    return { payout: processClaim(step, policies) };
  });
  return { results };
};
