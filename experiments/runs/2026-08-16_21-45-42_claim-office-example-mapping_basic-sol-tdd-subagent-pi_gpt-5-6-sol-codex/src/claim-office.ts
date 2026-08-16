export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_BASE_PREMIUMS: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

export function basePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let totalBasePremium = 0;
  for (const item of items) {
    const mainPremium = MAIN_ITEM_BASE_PREMIUMS[item.type];
    if (mainPremium !== undefined) totalBasePremium += mainPremium;
    else componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
  }
  for (const count of componentCounts.values()) {
    totalBasePremium += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return totalBasePremium;
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function itemSurcharge(item: Item): number {
  const itemBase = basePremium([item]);
  const curseSurcharge = item.cursed ? itemBase * CURSE_SURCHARGE_RATE : 0;
  const enchantmentSurcharge = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL
    ? itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + enchantmentSurcharge;
}

export function premiumBeforePolicyModifiers(items: Item[]): number {
  return basePremium(items) + items.reduce(
    (surcharges, item) => surcharges + itemSurcharge(item),
    0,
  );
}

interface Customer { yearsWithMHPCO: number }
interface QuoteStep { op: "quote"; items: Item[] }
interface Damage { itemType: string; amount: number }
interface ClaimStep { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } }
type Step = QuoteStep | ClaimStep;
interface Scenario { customer: Customer; steps: Step[] }
type Result = { premium: number } | { payout: number; remainingCap: number };

const LOYALTY_ELIGIBILITY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const INITIAL_ASSESSMENT_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;

export function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(items: Item[], customer: Customer, isFollowUp: boolean): number {
  const policyBase = basePremium(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_ELIGIBILITY_YEARS
    ? policyBase * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return roundPremium(
    premiumBeforePolicyModifiers(items)
      + policyBase * INITIAL_ASSESSMENT_RATE
      - loyaltyDiscount
      - followUpDiscount
      + PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const KNOWN_ITEM_TYPES = new Set(Object.keys(INSURANCE_VALUES));
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const DEDUCTIBLE = 100;
interface Policy { items: Item[]; remainingCap: number }

function validateItems(items: Item[]): void {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function payoutBeforePolicyCap(policy: Policy, damages: Damage[]): number {
  return damages.reduce((sum, damage) => {
    const insuredItem = policy.items.find(({ type }) => type === damage.itemType);
    const reimbursement = (insuredItem?.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
      ? damage.amount * HALF_REIMBURSEMENT_RATE
      : damage.amount;
    return sum + Math.max(0, reimbursement - DEDUCTIBLE);
  }, 0);
}

function validateDamages(policy: Policy, damages: Damage[]): void {
  const available = new Map<string, number>();
  for (const item of policy.items) available.set(item.type, (available.get(item.type) ?? 0) + 1);
  for (const damage of damages) {
    if (damage.amount < 0) throw new Error("Damage amount cannot be negative");
    const availableCount = available.get(damage.itemType) ?? 0;
    if (availableCount === 0) throw new Error(`Damage exceeds insured ${damage.itemType} count`);
    available.set(damage.itemType, availableCount - 1);
  }
}

function settleClaim(policy: Policy, damages: Damage[]): Extract<Result, { payout: number }> {
  validateDamages(policy, damages);
  const payout = Math.floor(Math.min(payoutBeforePolicyCap(policy, damages), policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: Result[] } {
  const policies = new Map<number, Policy>();
  const results: Result[] = [];
  let hasPreviousQuote = false;
  scenario.steps.forEach((step, stepIndex) => {
    if (step.op === "quote") {
      validateItems(step.items);
      policies.set(stepIndex, { items: step.items, remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER });
      results.push({ premium: quotePremium(step.items, scenario.customer, hasPreviousQuote) });
      hasPreviousQuote = true;
    } else {
      const policy = policies.get(step.policy);
      if (policy === undefined) throw new Error("Policy not found");
      results.push(settleClaim(policy, step.incident.damages));
    }
  });
  return { results };
}
