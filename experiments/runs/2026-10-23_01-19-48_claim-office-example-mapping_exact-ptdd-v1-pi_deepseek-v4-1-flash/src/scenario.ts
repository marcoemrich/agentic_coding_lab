export interface Customer {
  yearsWithMHPCO: number;
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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
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

export type Result = QuoteResult | ClaimResult;

export function runScenario(scenario: Scenario): Result[] {
  const policies = new Map<number, Policy>();
  return scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = quotesBefore(scenario.steps, index) > 0;
      policies.set(index, { items: step.items, remainingCap: capOf(step.items) });
      return quotePremium(step, scenario.customer, isFollowUp);
    }
    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`claim references unknown policy ${step.policy}`);
    }
    return settleClaim(policy, step.incident.damages);
  });
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function capOf(items: Item[]): number {
  return insuranceSumOf(items) * CAP_MULTIPLIER;
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + priceRowOf(item.type).insuranceValue, 0);
}

function settleClaim(policy: Policy, damages: Damage[]): ClaimResult {
  const claimed = damages.reduce((sum, damage) => sum + reimbursableFor(policy, damage), 0);
  const payout = roundDownInFavorOfMhpco(Math.min(claimed, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

function reimbursableFor(policy: Policy, damage: Damage): number {
  const insuredItem = policy.items.find((item) => item.type === damage.itemType);
  if (insuredItem === undefined) {
    throw new Error(`${damage.itemType} is not covered by this policy`);
  }
  return reimbursedAmount(damage.amount, insuredItem) - DEDUCTIBLE;
}

function reimbursedAmount(amount: number, insuredItem: Item): number {
  return isHighlyEnchantedForClaim(insuredItem)
    ? percentOf(amount, HIGH_ENCHANTMENT_CLAIM_PERCENT)
    : amount;
}

function isHighlyEnchantedForClaim(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

function quotesBefore(steps: Step[], index: number): number {
  return steps.slice(0, index).filter((step) => step.op === "quote").length;
}

const PROCESSING_FEE = 5;
const CENTS_PER_G = 100;
const PERCENT = 100;
const FIRST_INSURANCE_PERCENT = 10;
const CURSED_SURCHARGE_PERCENT = 50;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_PERCENT = 50;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

interface PriceRow {
  insuranceValue: number;
  basePremium: number;
}

const COMPONENT_ROW: PriceRow = { insuranceValue: 250, basePremium: 25 };
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const PRICE_LIST: Record<string, PriceRow> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: COMPONENT_ROW,
  moonstone: COMPONENT_ROW,
};

function quotePremium(step: QuoteStep, customer: Customer, isFollowUp: boolean): QuoteResult {
  const baseCents = basePremiumOf(step.items) * CENTS_PER_G;
  const riskCents = step.items.reduce((sum, item) => sum + riskSurchargeCentsOf(item), 0);
  const assessedCents = withPolicyModifiers(baseCents, customer, isFollowUp) + riskCents;
  const totalG = roundUpInFavorOfMhpco(assessedCents / CENTS_PER_G + PROCESSING_FEE);
  return { premium: totalG };
}

function withPolicyModifiers(baseCents: number, customer: Customer, isFollowUp: boolean): number {
  const loyaltyPercent = isLongStanding(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUpPercent = isFollowUp ? -FOLLOW_UP_DISCOUNT_PERCENT : 0;
  const modifierPercent = PERCENT + FIRST_INSURANCE_PERCENT + loyaltyPercent + followUpPercent;
  return percentOf(baseCents, modifierPercent);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function riskSurchargeCentsOf(item: Item): number {
  const baseCents = priceRowOf(item.type).basePremium * CENTS_PER_G;
  const cursedCents = item.cursed === true ? percentOf(baseCents, CURSED_SURCHARGE_PERCENT) : 0;
  const enchantedCents = isHighlyEnchanted(item)
    ? percentOf(baseCents, HIGH_ENCHANTMENT_PERCENT)
    : 0;
  return cursedCents + enchantedCents;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function roundUpInFavorOfMhpco(amount: number): number {
  return Math.ceil(amount);
}

function roundDownInFavorOfMhpco(amount: number): number {
  return Math.floor(amount);
}

function percentOf(amount: number, percent: number): number {
  return (amount * percent) / PERCENT;
}

function priceRowOf(type: string): PriceRow {
  const row = PRICE_LIST[type];
  if (row === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return row;
}

function basePremiumOf(items: Item[]): number {
  const components = items.filter((item) => COMPONENT_TYPES.has(item.type));
  const mainItems = items.filter((item) => !COMPONENT_TYPES.has(item.type));
  const mainBase = mainItems.reduce((sum, item) => sum + priceRowOf(item.type).basePremium, 0);
  return mainBase + componentBaseOf(components);
}

function componentBaseOf(components: Item[]): number {
  const counts = new Map<string, number>();
  for (const component of components) {
    counts.set(component.type, (counts.get(component.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of counts.values()) {
    total += groupBasePremium(count);
  }
  return total;
}

function groupBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_ROW.basePremium;
}
