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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
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

interface MainItemSpec {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEMS: Record<string, MainItemSpec> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const COMPONENT_INSURANCE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const PROCESSING_FEE = 5;

function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function validateItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isMainItem(item.type) && !isComponent(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function itemInsuranceValue(item: Item): number {
  return isMainItem(item.type) ? MAIN_ITEMS[item.type].insuranceValue : COMPONENT_INSURANCE;
}

function itemBasePremium(item: Item): number {
  return isMainItem(item.type) ? MAIN_ITEMS[item.type].basePremium : COMPONENT_PREMIUM;
}

function itemSurchargeMultiplier(item: Item): number {
  let mult = 1;
  if (item.cursed) mult += 0.5;
  if ((item.enchantment ?? 0) >= 5) mult += 0.3;
  return mult;
}

function priceForLikeComponents(count: number): number {
  // Exactly 3 alike components form a discounted block; otherwise price per item.
  return count === 3 ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;
}

function computeComponentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    total += priceForLikeComponents(count);
  }
  return total;
}

function computePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return {
    items: [...items],
    remainingCap: insuranceSum * 2,
  };
}

interface PremiumContext {
  yearsWithMHPCO: number;
  isFirstContract: boolean;
}

function sumMainItemsBase(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + itemBasePremium(item), 0);
}

function sumMainItemsSurcharged(mainItems: Item[]): number {
  return mainItems.reduce(
    (sum, item) => sum + itemBasePremium(item) * itemSurchargeMultiplier(item),
    0,
  );
}

function policyWideMultiplier(ctx: PremiumContext): number {
  // Each item is treated as a first insurance (10% always applies).
  // Loyalty discount (-20%) at 2+ years; renewal discount (-15%) when not first contract.
  let multiplier = 0.1;
  if (ctx.yearsWithMHPCO >= 2) multiplier -= 0.2;
  if (!ctx.isFirstContract) multiplier -= 0.15;
  return multiplier;
}

function computePremium(items: Item[], ctx: PremiumContext): number {
  if (items.length === 0) {
    return PROCESSING_FEE;
  }

  const mainItems = items.filter((i) => isMainItem(i.type));
  const components = items.filter((i) => isComponent(i.type));

  const componentsBase = computeComponentsBasePremium(components);
  const surchargedBase = sumMainItemsSurcharged(mainItems) + componentsBase;
  const plainBase = sumMainItemsBase(mainItems) + componentsBase;

  const total = surchargedBase + plainBase * policyWideMultiplier(ctx) + PROCESSING_FEE;
  return Math.ceil(total);
}

function reimbursementFor(item: Item, damageAmount: number): number {
  const isHighEnchant = (item.enchantment ?? 0) >= 8;
  return isHighEnchant ? damageAmount * 0.5 : damageAmount;
}

function payoutFor(item: Item, damageAmount: number): number {
  return Math.max(0, reimbursementFor(item, damageAmount) - DEDUCTIBLE);
}

function takeMatchingItem(available: Item[], itemType: string): Item {
  const index = available.findIndex((item) => item.type === itemType);
  if (index === -1) {
    throw new Error(`Damage references item not in policy: ${itemType}`);
  }
  return available.splice(index, 1)[0];
}

function processClaim(policy: Policy, incident: Incident): ClaimResult {
  if (incident.damages.some((d) => d.amount < 0)) {
    throw new Error("Damage amount cannot be negative");
  }

  const available = [...policy.items];
  const grossPayout = incident.damages.reduce((sum, damage) => {
    const matched = takeMatchingItem(available, damage.itemType);
    return sum + payoutFor(matched, damage.amount);
  }, 0);

  // Round down (in MHPCO's favor), then cap at remaining coverage.
  const payout = Math.min(Math.floor(grossPayout), policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

function handleQuote(
  step: QuoteStep,
  stepIndex: number,
  customer: Customer,
  policies: Map<number, Policy>,
): QuoteResult {
  validateItemTypes(step.items);
  const isFirstContract = policies.size === 0;
  const premium = computePremium(step.items, {
    yearsWithMHPCO: customer.yearsWithMHPCO,
    isFirstContract,
  });
  policies.set(stepIndex, computePolicy(step.items));
  return { premium };
}

function handleClaim(step: ClaimStep, policies: Map<number, Policy>): ClaimResult {
  const policy = policies.get(step.policy);
  if (!policy) {
    throw new Error(`Claim references unknown policy: ${step.policy}`);
  }
  return processClaim(policy, step.incident);
}

export function runScenario(scenario: Scenario): ScenarioResult {
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, i) =>
    step.op === "quote"
      ? handleQuote(step, i, scenario.customer, policies)
      : handleClaim(step, policies),
  );
  return { results };
}
