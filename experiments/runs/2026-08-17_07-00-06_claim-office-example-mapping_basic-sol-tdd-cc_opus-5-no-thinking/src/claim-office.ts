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

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export type Step = QuoteStep | ClaimStep;

export interface Scenario {
  customer: Customer;
  steps: Step[];
}

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_PERCENT = 10;
const PERCENT = 100;

interface PriceListEntry {
  basePremium: number;
  insuranceValue: number;
  component?: true;
}

/** The MHPCO price list: every item type the office insures. */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250, component: true },
  moonstone: { basePremium: 25, insuranceValue: 250, component: true },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function priceListEntry(type: string): PriceListEntry {
  const entry = PRICE_LIST[type];

  if (entry === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }

  return entry;
}

function isComponent(item: Item): boolean {
  return priceListEntry(item.type).component === true;
}

function unitBasePremium(type: string): number {
  return priceListEntry(type).basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
}

/**
 * A building block is exactly BLOCK_SIZE alike components -- "alike" meaning
 * the same component type. Any other count is priced per unit.
 */
function componentsBasePremium(items: Item[]): number {
  let total = 0;

  for (const [type, count] of countByType(items.filter(isComponent))) {
    total +=
      count === BLOCK_SIZE ? BLOCK_PREMIUM : count * unitBasePremium(type);
  }

  return total;
}

function mainItemsBasePremium(items: Item[]): number {
  return items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + unitBasePremium(item.type), 0);
}

const CURSE_PERCENT = 50;
const HIGH_ENCHANTMENT_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function surchargePercentFor(item: Item): number {
  const curse = item.cursed === true ? CURSE_PERCENT : 0;
  const enchanted =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_PERCENT
      : 0;

  return curse + enchanted;
}

/**
 * Item-specific modifiers apply to the base premium of the affected item;
 * they do not enlarge the policy base premium that policy-wide modifiers
 * scale.
 */
function itemSurcharges(items: Item[]): number {
  return items.reduce(
    (sum, item) =>
      sum + (unitBasePremium(item.type) * surchargePercentFor(item)) / PERCENT,
    0,
  );
}

const LOYALTY_PERCENT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_PERCENT = 15;

/**
 * Policy-wide modifiers apply to the policy base premium, i.e. the sum of the
 * item base premiums before any item-specific surcharge. The first-insurance
 * surcharge applies to every quote regardless of customer history; the
 * follow-up discount applies to each contract after the customer's first.
 */
function policyPercentFor(customer: Customer, previousQuotes: number): number {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS ? -LOYALTY_PERCENT : 0;
  const followUp = previousQuotes > 0 ? -FOLLOW_UP_PERCENT : 0;

  return FIRST_INSURANCE_PERCENT + loyalty + followUp;
}

/**
 * Premiums are accumulated in percent-scaled units so that percentage
 * modifiers stay exact; only the final amount is rounded (up, in the
 * MHPCO's favour).
 */
function quotePremium(
  items: Item[],
  customer: Customer,
  previousQuotes: number,
): number {
  const base = mainItemsBasePremium(items) + componentsBasePremium(items);
  const scaled =
    (base + itemSurcharges(items)) * PERCENT +
    base * policyPercentFor(customer, previousQuotes);

  return Math.ceil(scaled / PERCENT) + PROCESSING_FEE;
}

const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;

interface Policy {
  items: Item[];
  remainingCap: number;
}

function insuranceSum(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + priceListEntry(item.type).insuranceValue,
    0,
  );
}

const REIMBURSEMENT_THRESHOLD = 8;
const HALF = 2;

/**
 * Damage to a highly enchanted item is reimbursed at 50 %; the deductible is
 * then withheld per damage event.
 */
function payoutFor(damage: Damage, insured: Item): number {
  const reimbursed =
    (insured.enchantment ?? 0) >= REIMBURSEMENT_THRESHOLD
      ? damage.amount / HALF
      : damage.amount;

  return Math.max(0, reimbursed - DEDUCTIBLE);
}

/**
 * Validates every damage entry and pairs it with a distinct insured item, so a
 * policy covering one sword cannot absorb two sword damages. Runs to
 * completion before any settlement, so a rejected claim leaves the cap
 * untouched.
 */
function validateAndMatchDamages(policy: Policy, damages: Damage[]): Item[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(
        `damage amount must not be negative: ${String(damage.amount)}`,
      );
    }

    const index = unclaimed.findIndex((item) => item.type === damage.itemType);

    if (index === -1) {
      throw new Error(`item not covered by the policy: ${damage.itemType}`);
    }

    return unclaimed.splice(index, 1)[0];
  });
}

function settleClaim(policy: Policy, step: ClaimStep): StepResult {
  const damages = step.incident.damages;
  const insuredItems = validateAndMatchDamages(policy, damages);
  const desired = damages.reduce(
    (sum, damage, index) => sum + payoutFor(damage, insuredItems[index]),
    0,
  );
  const payout = Math.min(Math.floor(desired), policy.remainingCap);
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let quotesSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);

      if (policy === undefined) {
        throw new Error(`step ${String(step.policy)} is not a policy`);
      }

      return settleClaim(policy, step);
    }

    const premium = quotePremium(step.items, scenario.customer, quotesSoFar);
    quotesSoFar += 1;
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_FACTOR,
    });

    return { premium };
  });
}
