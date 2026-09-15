export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}
export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}
export interface OperationResult { premium?: number; payout?: number; remainingCap?: number }
interface Policy { items: Item[]; remainingCap: number }

const BASE_PREMIUM: Record<string, number> = {
  sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25,
};
const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const PERCENT = 100;
const INITIAL_ASSESSMENT_PERCENT = 10;
const CURSE_PERCENT = 50;
const ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;
const PROCESSING_FEE = 5;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const COMPONENT_TYPES = ["rune", "moonstone"];

function componentPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * BASE_PREMIUM[type];
}

function policyBasePremium(items: Item[]): number {
  const components = COMPONENT_TYPES.reduce((sum, type) => sum + componentPremium(items, type), 0);
  const mainItems = items.filter((item) => !COMPONENT_TYPES.includes(item.type));
  return components + mainItems.reduce((sum, item) => sum + BASE_PREMIUM[item.type], 0);
}

function percentageOfItems(items: Item[], percentage: number, applies: (item: Item) => boolean): number {
  return items.filter(applies).reduce((sum, item) => sum + BASE_PREMIUM[item.type] * percentage / PERCENT, 0);
}

function curseSurcharge(items: Item[]): number {
  return percentageOfItems(items, CURSE_PERCENT, (item) => item.cursed === true);
}

function enchantmentSurcharge(items: Item[]): number {
  return percentageOfItems(items, ENCHANTMENT_PERCENT, (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL);
}

function loyaltyDiscount(basePremium: number, years: number): number {
  return years >= LOYALTY_YEARS ? basePremium * LOYALTY_PERCENT / PERCENT : 0;
}

function initialAssessment(basePremium: number): number {
  return basePremium * INITIAL_ASSESSMENT_PERCENT / PERCENT;
}

function followUpDiscount(basePremium: number, contractIndex: number): number {
  return contractIndex > 0 ? basePremium * FOLLOW_UP_PERCENT / PERCENT : 0;
}

function assertKnownItems(items: Item[]): void {
  const unknown = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknown) throw new Error(`Unknown item type '${unknown.type}'`);
}

function quotePremium(items: Item[], years: number, contractIndex: number): number {
  assertKnownItems(items);
  const base = policyBasePremium(items);
  const assessment = initialAssessment(base);
  const curse = curseSurcharge(items);
  const enchantment = enchantmentSurcharge(items);
  const loyalty = loyaltyDiscount(base, years);
  const followUp = followUpDiscount(base, contractIndex);
  return Math.ceil(base + assessment + curse + enchantment - loyalty - followUp + PROCESSING_FEE);
}

function newPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function hasReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_LEVEL;
}

function damageReimbursement(damage: Damage, item: Item): number {
  const reimbursable = hasReducedReimbursement(item)
    ? damage.amount * HALF_REIMBURSEMENT
    : damage.amount;
  return Math.max(reimbursable - DEDUCTIBLE, 0);
}

function assertValidDamageAmount(damage: Damage): void {
  if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
}

function desiredClaimPayout(damages: Damage[], insuredItems: Item[]): number {
  const availableItems = [...insuredItems];
  return damages.reduce((sum, damage) => {
    assertValidDamageAmount(damage);
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error(`Damage item '${damage.itemType}' is not insured`);
    const [item] = availableItems.splice(itemIndex, 1);
    return sum + damageReimbursement(damage, item);
  }, 0);
}

function processClaim(step: ClaimStep, policy: Policy): OperationResult {
  const desired = desiredClaimPayout(step.incident.damages, policy.items);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: OperationResult[] } {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;
  const results = scenario.steps.map((step, stepIndex) => {
    if (step.op === "claim") return processClaim(step, policies.get(step.policy)!);
    const premium = quotePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount++);
    policies.set(stepIndex, newPolicy(step.items));
    return { premium };
  });
  return { results };
}
