export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type Step = QuoteStep | ClaimStep;

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause?: string; damages: Damage[] };
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE = 250;

interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results: Result[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      // Group items: separate non-components from components by type.
      const componentCounts: Record<string, number> = {};
      const mainItems: Item[] = [];
      for (const item of step.items) {
        if (COMPONENT_TYPES.has(item.type)) {
          componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
        } else if (BASE_PREMIUMS[item.type] !== undefined) {
          mainItems.push(item);
        } else {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      let policyBaseSum = 0;
      let itemSubtotal = 0;
      for (const item of mainItems) {
        const base = BASE_PREMIUMS[item.type] ?? 0;
        policyBaseSum += base;
        let itemPremium = base;
        if (item.cursed) itemPremium += base * 0.5;
        if ((item.enchantment ?? 0) >= 5) itemPremium += base * 0.3;
        itemSubtotal += itemPremium;
      }
      for (const count of Object.values(componentCounts)) {
        const base = count === 3 ? 60 : count * COMPONENT_BASE;
        policyBaseSum += base;
        itemSubtotal += base;
      }
      // Policy-wide modifiers based on policyBaseSum
      let policyMods = 0;
      if (scenario.customer.yearsWithMHPCO >= 2) policyMods -= policyBaseSum * 0.2;
      policyMods += policyBaseSum * 0.1; // first insurance surcharge
      if (quoteCount > 0) policyMods -= policyBaseSum * 0.15;
      quoteCount += 1;
      const total = itemSubtotal + policyMods + 5;
      // Compute insurance sum for the policy
      let insuranceSum = 0;
      for (const item of step.items) {
        if (COMPONENT_TYPES.has(item.type)) {
          insuranceSum += COMPONENT_INSURANCE;
        } else {
          insuranceSum += INSURANCE_VALUES[item.type] ?? 0;
        }
      }
      const cap = insuranceSum * 2;
      policies.set(stepIndex, { items: step.items, insuranceSum, cap, remainingCap: cap });
      return { premium: Math.ceil(total) };
    }
    // claim
    const policy = policies.get(step.policy);
    if (!policy) throw new Error(`Policy not found at step ${step.policy}`);
    // Validate damage counts: each damage entry consumes one matching insured item.
    const remainingItems: Item[] = [...policy.items];
    let totalPayout = 0;
    for (const damage of step.incident.damages) {
      if (damage.amount < 0) throw new Error(`Negative damage amount`);
      const idx = remainingItems.findIndex((it) => it.type === damage.itemType);
      if (idx === -1) throw new Error(`Damage references item not on policy: ${damage.itemType}`);
      const item = remainingItems[idx];
      remainingItems.splice(idx, 1);
      let reimbursable = damage.amount;
      const isDragon = item.material === "dragon";
      const isHighEnch = (item.enchantment ?? 0) >= 8;
      if (isHighEnch && !isDragon) {
        reimbursable = damage.amount * 0.5;
      } else if (isHighEnch && isDragon) {
        reimbursable = damage.amount * 0.5;
      }
      // (dragon-only case: full reimbursement)
      let itemPayout = reimbursable - 100;
      if (itemPayout < 0) itemPayout = 0;
      totalPayout += itemPayout;
    }
    if (totalPayout > policy.remainingCap) totalPayout = policy.remainingCap;
    const finalPayout = Math.floor(totalPayout);
    policy.remainingCap -= finalPayout;
    return { payout: finalPayout, remainingCap: policy.remainingCap };
  });
  return { results };
}
