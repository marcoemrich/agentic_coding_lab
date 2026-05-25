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
  op: 'quote';
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: 'claim';
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type Result = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: Result[];
}

const MAIN_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function isMainItem(item: Item): boolean {
  return item.type in MAIN_BASE_PREMIUMS;
}

function validateItems(items: Item[]): void {
  for (const it of items) {
    if (!isMainItem(it) && !isComponent(it)) {
      throw new Error(`Unknown item type: ${it.type}`);
    }
  }
}

function mainItemBasePremium(item: Item): number {
  return MAIN_BASE_PREMIUMS[item.type];
}

function componentsBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const it of items) {
    counts.set(it.type, (counts.get(it.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    total += count === 3 ? 60 : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

function mainItemPremiumWithModifiers(item: Item): number {
  const base = mainItemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  return base + surcharge;
}

function quotePremium(items: Item[], customer: Customer, quoteIndex: number): number {
  const mains = items.filter(isMainItem);
  const comps = items.filter(isComponent);

  const mainsBase = mains.reduce((s, it) => s + mainItemBasePremium(it), 0);
  const compsBase = componentsBasePremium(comps);
  const policyBase = mainsBase + compsBase;

  const mainsWithMods = mains.reduce((s, it) => s + mainItemPremiumWithModifiers(it), 0);
  const itemsTotal = mainsWithMods + compsBase;

  const firstInsurance = policyBase * 0.1;
  const loyalty = customer.yearsWithMHPCO >= 2 ? policyBase * 0.2 : 0;
  const followUp = quoteIndex > 0 ? policyBase * 0.15 : 0;

  const beforeFee = itemsTotal + firstInsurance - loyalty - followUp;
  return Math.ceil(beforeFee + 5);
}

function itemInsuranceValue(item: Item): number {
  if (isMainItem(item)) return MAIN_INSURANCE_VALUES[item.type];
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  return 0;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((s, it) => s + itemInsuranceValue(it), 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const remainingByType = new Map<string, number>();
  for (const it of policy.items) {
    remainingByType.set(it.type, (remainingByType.get(it.type) ?? 0) + 1);
  }
  let totalRaw = 0;
  for (const dmg of incident.damages) {
    if (dmg.amount < 0) {
      throw new Error(`Negative damage amount not allowed: ${dmg.amount}`);
    }
    const available = remainingByType.get(dmg.itemType) ?? 0;
    if (available <= 0) {
      throw new Error(
        `Damaged item type "${dmg.itemType}" is not covered by the policy (or exceeds insured count)`,
      );
    }
    remainingByType.set(dmg.itemType, available - 1);
    const item = policy.items.find((it) => it.type === dmg.itemType)!;
    const reimbursement = computeReimbursement(item, dmg.amount);
    totalRaw += Math.max(0, reimbursement - DEDUCTIBLE);
  }
  const desired = Math.floor(totalRaw);
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function computeReimbursement(item: Item, damage: number): number {
  if ((item.enchantment ?? 0) >= 8) return damage * 0.5;
  return damage;
}

export function runScenario(scenario: Scenario): ScenarioOutput {
  const results: Result[] = [];
  const policies: Policy[] = [];
  let quoteIndex = 0;
  for (const step of scenario.steps) {
    if (step.op === 'quote') {
      validateItems(step.items);
      results.push({ premium: quotePremium(step.items, scenario.customer, quoteIndex) });
      policies.push({ items: step.items, remainingCap: insuranceSum(step.items) * 2 });
      quoteIndex++;
    } else {
      const policy = policies[step.policy];
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
}
