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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;
const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT = 1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

/** The MHPCO insures only the items on its price list. */
function basePremiumForType(type: string): number {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
  return basePremium;
}

function basePremiumOf(item: Item): number {
  return basePremiumForType(item.type);
}

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** A building block of exactly 3 alike components is offered at a special rate. */
function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total +=
      count === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : count * basePremiumForType(type);
  }
  return total;
}

function policyBasePremiumOf(items: Item[]): number {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));

  return (
    mainItems.reduce((sum, item) => sum + basePremiumOf(item), 0) +
    componentsBasePremium(components)
  );
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

const RISK_SURCHARGE_RATES: readonly [(item: Item) => boolean, number][] = [
  [isCursed, CURSE_SURCHARGE_RATE],
  [isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_RATE],
];

/** Item-specific risk surcharges apply to the base premium of the affected item. */
function riskSurchargesFor(items: Item[]): number {
  return items.reduce((total, item) => {
    const rate = RISK_SURCHARGE_RATES.reduce(
      (sum, [applies, surchargeRate]) => sum + (applies(item) ? surchargeRate : 0),
      0,
    );
    return total + basePremiumOf(item) * rate;
  }, 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** Policy-wide modifiers apply to the sum of all item base premiums. */
function policyModifierRateFor(customer: Customer, precedingContracts: number): number {
  const loyaltyDiscount = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = precedingContracts > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;

  return FIRST_INSURANCE_SURCHARGE_RATE + loyaltyDiscount + followUpDiscount;
}

function premiumFor(items: Item[], customer: Customer, precedingContracts: number): number {
  const policyBasePremium = policyBasePremiumOf(items);

  return Math.ceil(
    policyBasePremium +
      riskSurchargesFor(items) +
      policyBasePremium * policyModifierRateFor(customer, precedingContracts) +
      PROCESSING_FEE,
  );
}

function insuranceValueForType(type: string): number {
  const insuranceValue = INSURANCE_VALUES[type];
  if (insuranceValue === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
  return insuranceValue;
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueForType(item.type), 0);
}

interface Policy {
  items: Item[];
  /** The MHPCO caps the total payout per policy at twice the insurance sum. */
  remainingCap: number;
}

function policyFor(items: Item[]): Policy {
  return { items, remainingCap: insuranceSumOf(items) * CAP_MULTIPLE };
}

function isSeverelyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= SEVERE_ENCHANTMENT_LEVEL;
}

/** Damage to severely enchanted items is reimbursed at half the damage amount. */
function reimbursementRateFor(item: Item): number {
  return isSeverelyEnchanted(item) ? SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT;
}

/** The MHPCO does not accept a damage report for a negative amount. */
function validateDamageAmount(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
}

/** A deductible applies per damage event, after the reimbursement clauses. */
function payoutForDamage(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRateFor(item) - DEDUCTIBLE);
}

function policyAt(policies: Map<number, Policy>, index: number): Policy {
  const policy = policies.get(index);
  if (policy === undefined) {
    throw new Error(`No policy was created by step ${index}`);
  }
  return policy;
}

/**
 * Each damage entry is settled against one distinct insured item of that type,
 * so a policy covering two swords can absorb two separate sword damages.
 */
function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    const position = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (position === -1) {
      throw new Error(
        `The policy does not cover an item of type "${damage.itemType}" for this damage`,
      );
    }
    return unclaimed.splice(position, 1)[0];
  });
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  incident.damages.forEach(validateDamageAmount);
  const damagedItems = matchDamagesToItems(policy, incident.damages);
  const desiredPayout = incident.damages.reduce(
    (total, damage, position) => total + payoutForDamage(damage, damagedItems[position]),
    0,
  );

  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contractsSoFar = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(policyAt(policies, step.policy), step.incident);
    }

    const premium = premiumFor(step.items, scenario.customer, contractsSoFar);
    contractsSoFar += 1;
    policies.set(index, policyFor(step.items));
    return { premium };
  });
}
