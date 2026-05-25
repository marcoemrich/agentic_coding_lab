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

export interface QuoteResult {
  premium: number;
}
export interface ClaimResult {
  payout: number;
  remainingCap: number;
}
export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioResult {
  results: StepResult[];
}

const MAIN_ITEM_PRICES: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_INSURANCE_VALUE = 250;

function itemInsuranceValue(item: Item): number {
  const main = MAIN_ITEM_PRICES[item.type];
  if (main) return main.value;
  if (isComponent(item)) return COMPONENT_INSURANCE_VALUE;
  throw new Error(`Unknown item type: ${item.type}`);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, it) => sum + itemInsuranceValue(it), 0);
}

function isMainItem(item: Item): boolean {
  return item.type in MAIN_ITEM_PRICES;
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function mainItemBasePremium(item: Item): number {
  const main = MAIN_ITEM_PRICES[item.type];
  if (!main) throw new Error(`Unknown item type: ${item.type}`);
  return main.premium;
}

function componentsBasePremium(items: Item[]): number {
  const counts = new Map<string, number>();
  for (const it of items) {
    counts.set(it.type, (counts.get(it.type) ?? 0) + 1);
  }
  let total = 0;
  for (const n of counts.values()) {
    total += n === 3 ? 60 : n * 25;
  }
  return total;
}

function validateItem(item: Item): void {
  if (!isMainItem(item) && !isComponent(item)) {
    throw new Error(`Unknown item type: ${item.type}`);
  }
}

function policyBasePremium(items: Item[]): number {
  items.forEach(validateItem);
  const mains = items.filter(isMainItem);
  const components = items.filter(isComponent);
  let total = components.length > 0 ? componentsBasePremium(components) : 0;
  for (const m of mains) total += mainItemBasePremium(m);
  return total;
}

function itemSurcharge(item: Item): number {
  if (!isMainItem(item)) return 0;
  const base = mainItemBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += base * 0.5;
  if ((item.enchantment ?? 0) >= 5) surcharge += base * 0.3;
  return surcharge;
}

function quoteStepPremium(items: Item[], customer: Customer, contractIndex: number): number {
  const policyBase = policyBasePremium(items);
  let itemSurcharges = 0;
  for (const it of items) itemSurcharges += itemSurcharge(it);
  let policyMods = 0;
  if (customer.yearsWithMHPCO >= 2) policyMods -= policyBase * 0.2;
  policyMods += policyBase * 0.1; // first insurance surcharge
  if (contractIndex > 0) policyMods -= policyBase * 0.15; // follow-up discount
  const total = policyBase + itemSurcharges + policyMods + 5;
  return Math.ceil(total);
}

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

function damagePayout(item: Item, amount: number): number {
  const reimbursement = (item.enchantment ?? 0) >= 8 ? amount * 0.5 : amount;
  return Math.max(0, reimbursement - 100);
}

function processClaim(policy: PolicyState, incident: Incident): ClaimResult {
  const insuredCounts = new Map<string, number>();
  for (const it of policy.items) {
    insuredCounts.set(it.type, (insuredCounts.get(it.type) ?? 0) + 1);
  }
  const damageCounts = new Map<string, number>();
  for (const damage of incident.damages) {
    damageCounts.set(damage.itemType, (damageCounts.get(damage.itemType) ?? 0) + 1);
  }
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: got ${damage.amount}`);
    }
  }
  for (const [type, count] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (insured === 0) {
      throw new Error(`Damage references item not in policy: ${type}`);
    }
    if (count > insured) {
      throw new Error(`More damages of type ${type} (${count}) than insured (${insured})`);
    }
  }
  let totalPayout = 0;
  for (const damage of incident.damages) {
    const item = policy.items.find(i => i.type === damage.itemType)!;
    totalPayout += damagePayout(item, damage.amount);
  }
  const actualPayout = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= actualPayout;
  return { payout: Math.floor(actualPayout), remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const results: StepResult[] = [];
  const policies: (PolicyState | null)[] = [];
  let contractIndex = 0;
  for (const step of scenario.steps) {
    if (step.op === 'quote') {
      results.push({ premium: quoteStepPremium(step.items, scenario.customer, contractIndex) });
      const sum = insuranceSum(step.items);
      policies.push({ items: step.items, remainingCap: 2 * sum });
      contractIndex++;
    } else {
      const policy = policies[step.policy];
      if (!policy) throw new Error(`Claim references unknown policy index: ${step.policy}`);
      results.push(processClaim(policy, step.incident));
    }
  }
  return { results };
}
