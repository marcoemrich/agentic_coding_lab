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
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

type Result = { premium: number } | { payout: number; remainingCap: number };
type Policy = { items: Item[]; remainingCap: number };

const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };
const INSURANCE_VALUE: Record<string, number> = { sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250 };
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_DISCOUNT = 15;
const CURSE_DIVISOR = 2;
const HIGH_ENCHANTMENT_PREMIUM_LEVEL = 5;
const HIGH_ENCHANTMENT_PREMIUM_NUMERATOR = 3;
const HIGH_ENCHANTMENT_PREMIUM_DENOMINATOR = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DIVISOR = 5;
const FOLLOW_UP_NUMERATOR = 3;
const FOLLOW_UP_DENOMINATOR = 20;
const ASSESSED_PREMIUM_NUMERATOR = 11;
const ASSESSED_PREMIUM_DENOMINATOR = 10;
const PROCESSING_FEE = 5;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR = 2;
const DEDUCTIBLE = 100;

function quoteBasePremium(items: Item[]): number {
  const unitTotal = items.reduce((total, item) => total + BASE_PREMIUM[item.type], 0);
  const blockDiscount = ["rune", "moonstone"].reduce((discount, type) => {
    const count = items.filter((item) => item.type === type).length;
    return discount + (count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_DISCOUNT : 0);
  }, 0);
  return unitTotal - blockDiscount;
}

function quotePremium(items: Item[], years: number, contractIndex: number): number {
  const unknownItem = items.find((item) => BASE_PREMIUM[item.type] === undefined);
  if (unknownItem) throw new Error(`unknown item type: ${unknownItem.type}`);
  const base = quoteBasePremium(items);
  const curse = items.reduce((sum, item) => sum + (item.cursed ? BASE_PREMIUM[item.type] / CURSE_DIVISOR : 0), 0);
  const enchantment = items.reduce((sum, item) => {
    const surcharge = (BASE_PREMIUM[item.type] * HIGH_ENCHANTMENT_PREMIUM_NUMERATOR) / HIGH_ENCHANTMENT_PREMIUM_DENOMINATOR;
    return sum + ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_LEVEL ? surcharge : 0);
  }, 0);
  const loyalty = years >= LOYALTY_YEARS ? base / LOYALTY_DIVISOR : 0;
  const followUp = contractIndex > 0 ? (base * FOLLOW_UP_NUMERATOR) / FOLLOW_UP_DENOMINATOR : 0;
  const assessedBase = (base * ASSESSED_PREMIUM_NUMERATOR) / ASSESSED_PREMIUM_DENOMINATOR;
  return Math.ceil(assessedBase + curse + enchantment - loyalty - followUp + PROCESSING_FEE);
}

function policyFor(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);
  return { items, remainingCap: insuranceSum * CAP_MULTIPLIER };
}

function reimbursement(damage: Damage, item: Item): number {
  const isHighlyEnchanted = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL;
  const coveredAmount = isHighlyEnchanted ? damage.amount / HIGH_ENCHANTMENT_REIMBURSEMENT_DIVISOR : damage.amount;
  return Math.max(0, coveredAmount - DEDUCTIBLE);
}

function processClaim(step: ClaimStep, policy: Policy): Result {
  const availableItems = [...policy.items];
  const desired = step.incident.damages.reduce((sum, damage) => {
    if (damage.amount < 0) throw new Error("negative damage amount");
    const itemIndex = availableItems.findIndex((item) => item.type === damage.itemType);
    if (itemIndex < 0) throw new Error("damages outnumber insured items");
    const [item] = availableItems.splice(itemIndex, 1);
    return sum + reimbursement(damage, item);
  }, 0);
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const results: Result[] = [];
  const policies = new Map<number, Policy>();
  let contractIndex = 0;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, contractIndex) });
      policies.set(stepIndex, policyFor(step.items));
      contractIndex += 1;
    } else {
      results.push(processClaim(step, policies.get(step.policy)!));
    }
  });
  return { results };
}
