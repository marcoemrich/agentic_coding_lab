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

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface ScenarioResults {
  results: StepResult[];
}

export type StepResult = QuoteResult | ClaimResult;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const PROCESSING_FEE = 5;

/**
 * The MHPCO price list. `kind` decides which pricing rules govern a type:
 * components are eligible for the building-block premium, main items are not.
 */
const PRICE_LIST: Record<string, { basePremium: number; kind: "main" | "component" }> = {
  sword: { basePremium: 100, kind: "main" },
  amulet: { basePremium: 60, kind: "main" },
  staff: { basePremium: 80, kind: "main" },
  potion: { basePremium: 40, kind: "main" },
  rune: { basePremium: 25, kind: "component" },
  moonstone: { basePremium: 25, kind: "component" },
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return PRICE_LIST[item.type]?.kind === "component";
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);
  }
  return total;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((total, item) => total + itemBasePremium(item), 0);
}

function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter((item) => !isComponent(item))) +
    componentsBasePremium(items.filter(isComponent))
  );
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;
}

function basePremiumOf(type: string): number {
  const entry = PRICE_LIST[type];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }

  return entry.basePremium;
}

function itemBasePremium(item: Item): number {
  return basePremiumOf(item.type);
}

function itemSurchargeRate(item: Item): number {
  return (
    (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((total, item) => total + itemBasePremium(item) * itemSurchargeRate(item), 0);
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS_THRESHOLD = 2;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  return (
    FIRST_INSURANCE_SURCHARGE_RATE +
    (isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0) +
    (previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0)
  );
}

/** The MHPCO rounds premiums in its own favor: always up. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  const basePremium = policyBasePremium(items);

  return roundPremium(
    basePremium +
      basePremium * policyModifierRate(customer, previousContracts) +
      itemSurcharges(items) +
      PROCESSING_FEE,
  );
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function isHeavilyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_THRESHOLD;
}

/**
 * Damage to heavily enchanted items is reimbursed at 50 %; everything else is
 * reimbursed in full. Dragon material also grants full reimbursement, which is
 * the default rate, and the 50 % clause takes precedence where both apply --
 * so the dragon clause needs no rate of its own.
 */
function reimbursementRate(item: Item): number {
  return isHeavilyEnchanted(item) ? REDUCED_REIMBURSEMENT_RATE : 1;
}

/** The MHPCO rounds payouts in its own favor: always down. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

function damagePayout(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

/**
 * Each damage entry is a separate damage to a separate insured item, so the
 * entries of one incident consume the covered items of their type.
 */
function damagedItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];

  return damages.map((damage) => {
    const index = available.findIndex((candidate) => candidate.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a further item of type "${damage.itemType}"`);
    }

    return available.splice(index, 1)[0];
  });
}

function rejectNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
    }
  }
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  rejectNegativeAmounts(incident.damages);
  const items = damagedItems(policy, incident.damages);
  const desired = incident.damages.reduce(
    (total, damage, index) => total + damagePayout(damage, items[index]),
    0,
  );
  const payout = roundPayout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): ScenarioResults {
  const policies = new Map<number, Policy>();
  let quoteCount = 0;

  const results = scenario.steps.map((step, index): StepResult => {
    if (step.op === "quote") {
      const premium = quotePremium(step.items, scenario.customer, quoteCount);
      quoteCount += 1;
      policies.set(index, createPolicy(step.items));

      return { premium };
    }

    return settleClaim(policies.get(step.policy)!, step.incident);
  });

  return { results };
}
