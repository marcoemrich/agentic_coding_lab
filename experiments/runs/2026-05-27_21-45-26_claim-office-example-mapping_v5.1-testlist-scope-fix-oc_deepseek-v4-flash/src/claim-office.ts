export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface DamageEntry {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: {
    cause: string;
    damages: DamageEntry[];
  };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const BLOCK_PREMIUM = 60;

function computeItemBasePremium(item: Item): number {
  const premium = BASE_PREMIUMS[item.type];
  if (premium === undefined) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
  return premium;
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: Item[];
  remainingCap: number;
}

export function processScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      const premium = computeQuotePremium(step.items, scenario.customer, quoteCount);
      const insuranceSum = computeInsuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: insuranceSum * 2 });
      results.push({ premium });
      quoteCount++;
    } else if (step.op === "claim") {
      const policy = policies[step.policy];
      const result = processClaim(step.incident.damages, policy);
      results.push(result);
    }
  }
  return { results };
}

function computeInsuranceSum(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += INSURANCE_VALUES[item.type] ?? 0;
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    total += count * INSURANCE_VALUES[type];
  }
  return total;
}

function processClaim(damages: DamageEntry[], policy: Policy): ClaimResult {
  const itemTypeCounts: Record<string, number> = {};
  for (const item of policy.items) {
    itemTypeCounts[item.type] = (itemTypeCounts[item.type] ?? 0) + 1;
  }
  const damageCounts: Record<string, number> = {};
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    if (!itemTypeCounts[damage.itemType]) {
      throw new Error(`No insured item of type ${damage.itemType}`);
    }
    damageCounts[damage.itemType] = (damageCounts[damage.itemType] ?? 0) + 1;
    if (damageCounts[damage.itemType] > (itemTypeCounts[damage.itemType] ?? 0)) {
      throw new Error(`More damages for ${damage.itemType} than insured items`);
    }
  }
  let totalPayout = 0;
  for (const damage of damages) {
    const matchingItems = policy.items.filter(i => i.type === damage.itemType);
    let payout = damage.amount;
    const item = matchingItems[0];
    if (item.enchantment !== undefined && item.enchantment >= 8) {
      payout = payout * 0.5;
    } else if (item.material === "dragon") {
      payout = payout;
    }
    payout = payout - 100;
    if (payout < 0) payout = 0;
    totalPayout += payout;
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= cappedPayout;
  return { payout: Math.floor(cappedPayout), remainingCap: policy.remainingCap };
}

function computePolicyWideModifiers(policyBase: number, customer: Customer, stepIndex: number): number {
  let total = policyBase * 0.1;
  if (customer.yearsWithMHPCO >= 2) {
    total -= policyBase * 0.2;
  }
  if (stepIndex > 0) {
    total -= policyBase * 0.15;
  }
  return total;
}

function computeQuotePremium(items: Item[], customer: Customer, stepIndex: number): number {
  const policyBase = computePolicyBasePremium(items);
  const itemSurcharges = computeItemSurcharges(items);
  const policyModifiers = computePolicyWideModifiers(policyBase, customer, stepIndex);
  const total = policyBase + itemSurcharges + policyModifiers + 5;
  return Math.ceil(total);
}

function computePolicyBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.includes(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += computeItemBasePremium(item);
    }
  }
  for (const [type, count] of Object.entries(componentCounts)) {
    if (count === 3) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * BASE_PREMIUMS[type];
    }
  }
  return total;
}

function computeItemSurcharges(items: Item[]): number {
  let total = 0;
  for (const item of items) {
    if (!COMPONENT_TYPES.includes(item.type)) {
      const base = computeItemBasePremium(item);
      if (item.cursed) {
        total += base * 0.5;
      }
      if (item.enchantment !== undefined && item.enchantment >= 5) {
        total += base * 0.3;
      }
    }
  }
  return total;
}

