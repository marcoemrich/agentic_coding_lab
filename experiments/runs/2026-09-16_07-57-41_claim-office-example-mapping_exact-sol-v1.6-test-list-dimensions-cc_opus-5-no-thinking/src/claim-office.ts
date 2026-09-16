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

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export type StepResult = QuoteResult | ClaimResult;

const DEDUCTIBLE_PER_DAMAGE = 100;
const PAYOUT_CAP_MULTIPLE = 2;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

/** The MHPCO price list: every insurable item type and what it is worth. */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

/** The MHPCO only insures items on its price list. */
function priceListEntryOf(item: Item): PriceListEntry {
  const entry = PRICE_LIST[item.type];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
  }

  return entry;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

function basePremiumOf(item: Item): number {
  return priceListEntryOf(item).basePremium;
}

/**
 * A building block of exactly 3 alike components is offered at a special
 * base premium; any other count is priced per component.
 */
function basePremiumOfAlikeComponents(component: Item, count: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_BASE_PREMIUM
    : count * basePremiumOf(component);
}

function groupByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    groups.set(item.type, [...(groups.get(item.type) ?? []), item]);
  }
  return groups;
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;
}

/** Item-specific modifiers apply to the base premium of the affected item. */
function itemSurcharges(item: Item, itemBasePremium: number): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;

  return itemBasePremium * (curse + enchantment);
}

function policyBasePremium(items: Item[]): number {
  let base = 0;
  for (const alike of groupByType(items).values()) {
    base += COMPONENT_TYPES.has(alike[0].type)
      ? basePremiumOfAlikeComponents(alike[0], alike.length)
      : alike.reduce((sum, item) => sum + basePremiumOf(item), 0);
  }
  return base;
}

/** Premiums are rounded up: every fraction of a G favours the MHPCO. */
function roundInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

/** Policy-wide modifiers apply to the policy base premium. */
function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

  return FIRST_INSURANCE_SURCHARGE_RATE + loyalty + followUp;
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const policyBase = policyBasePremium(items);
  const itemModifiers = items.reduce(
    (sum, item) => sum + itemSurcharges(item, basePremiumOf(item)),
    0,
  );
  const policyModifiers = policyBase * policyModifierRate(customer, previousContracts);

  return roundInMHPCOsFavor(
    policyBase + itemModifiers + policyModifiers + PROCESSING_FEE,
  );
}

interface Policy {
  coveredItems: Item[];
  remainingCap: number;
}

function insuranceValueOf(item: Item): number {
  return priceListEntryOf(item).insuranceValue;
}

function issuePolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

  return { coveredItems: items, remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLE };
}

/** Payouts are rounded down: every fraction of a G favours the MHPCO. */
function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

/** Damage to items with enchantment >= 8 is reimbursed at 50 %. */
function coveredShareOf(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
}

/** A deductible of 100 G applies per damage event and never reverses a payout. */
function reimbursementFor(damage: Damage, damagedItem: Item): number {
  const covered = damage.amount * coveredShareOf(damagedItem);

  return Math.max(covered - DEDUCTIBLE_PER_DAMAGE, 0);
}

/**
 * Each damage entry is a separate damaged item, so it claims one of the
 * policy's covered items; a claim for more items than are insured is rejected.
 */
function claimCoveredItem(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`The policy does not cover a damaged item of type "${damage.itemType}"`);
  }

  return unclaimed.splice(index, 1)[0];
}

/** A damage report must describe real losses. */
function rejectInvalidDamages(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  rejectInvalidDamages(incident);

  const unclaimed = [...policy.coveredItems];
  const reimbursement = incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, claimCoveredItem(unclaimed, damage)),
    0,
  );
  const payout = roundPayoutInMHPCOsFavor(Math.min(reimbursement, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step.items, scenario.customer, contractsSoFar),
      });
      policies.set(index, issuePolicy(step.items));
      contractsSoFar += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Step ${step.policy} did not create a policy`);
    }
    results.push(settleClaim(policy, step.incident));
  });

  return results;
}
