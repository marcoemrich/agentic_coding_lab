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

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

/** The MHPCO insures only the item types on its price list. */
function isInsurableType(type: string): boolean {
  return BASE_PREMIUMS[type] !== undefined;
}

function requireInsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurableType(item.type)) {
      throw new Error(`MHPCO does not insure items of type "${item.type}"`);
    }
  }
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** A building block of exactly 3 alike components is offered at a special base premium. */
function componentGroupBasePremium(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
}

/** Components are priced per type, so that alike components can form a building block. */
function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(components)) {
    total += componentGroupBasePremium(type, count);
  }
  return total;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((total, item) => total + BASE_PREMIUMS[item.type], 0);
}

function policyBasePremium(items: Item[]): number {
  return (
    mainItemsBasePremium(items.filter((item) => !isComponent(item))) +
    componentsBasePremium(items.filter(isComponent))
  );
}

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const SURCHARGE_ENCHANTMENT_LEVEL = 5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

/** Highly enchanted items (enchantment level >= 5) carry a risk surcharge. */
function carriesHighEnchantmentSurcharge(item: Item): boolean {
  return (item.enchantment ?? 0) >= SURCHARGE_ENCHANTMENT_LEVEL;
}

/** Item-specific risk surcharges apply to the base premium of the affected item. */
function itemRiskSurchargeRate(item: Item): number {
  let rate = 0;
  if (isCursed(item)) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if (carriesHighEnchantmentSurcharge(item)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + BASE_PREMIUMS[item.type] * itemRiskSurchargeRate(item),
    0,
  );
}

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** Policy-wide modifiers apply to the policy base premium, not to a single item. */
function policyModifierRate(customer: Customer, previousContracts: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStandingCustomer(customer)) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return rate;
}

/** Amounts are rounded in the MHPCO's favor: a premium rounds up. */
function roundPremium(amount: number): number {
  return Math.ceil(amount);
}

function quotePremium(items: Item[], customer: Customer, previousContracts: number): number {
  requireInsurableItems(items);
  const base = policyBasePremium(items);
  return roundPremium(
    base +
      base * policyModifierRate(customer, previousContracts) +
      itemRiskSurcharges(items) +
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

/** The insurance sum is the sum of the insured items' insurance values. */
function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function openPolicy(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER };
}

/** Amounts are rounded in the MHPCO's favor: a payout rounds down. */
function roundPayout(amount: number): number {
  return Math.floor(amount);
}

const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

/** Damage to items with enchantment level >= 8 is only partly reimbursed. */
function qualifiesForReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL;
}

/**
 * The share of a damage amount MHPCO reimburses. Damage is fully reimbursed --
 * which is also what the dragon-material clause grants -- unless the item is so
 * highly enchanted that the reduced-reimbursement clause applies. That clause
 * wins where both apply.
 */
function reimbursementRate(item: Item): number {
  if (qualifiesForReducedReimbursement(item)) {
    return REDUCED_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}

/** A deductible of 100 G applies per damage event; it never turns into a charge. */
function reimbursementForDamage(damage: Damage, item: Item): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

/**
 * Each damage entry must name a distinct insured item, so a policy covering one
 * sword cannot answer two sword damages.
 */
function matchDamagesToInsuredItems(policy: Policy, damages: Damage[]): Item[] {
  const unmatched = [...policy.items];
  return damages.map((damage) => {
    const index = unmatched.findIndex((insured) => insured.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a damaged "${damage.itemType}"`);
    }
    return unmatched.splice(index, 1)[0];
  });
}

/** A damage event cannot report a negative amount of damage. */
function requireReportableDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

/** What the incident reimburses before the policy's cap is considered. */
function reimbursableForIncident(damages: Damage[], damagedItems: Item[]): number {
  return damages.reduce(
    (total, damage, index) => total + reimbursementForDamage(damage, damagedItems[index]),
    0,
  );
}

/**
 * The total payout per policy is capped at twice the insurance sum, so a claim
 * is paid only up to what the policy's cap still allows, and draws that down.
 */
function drawFromCap(policy: Policy, reimbursable: number): number {
  const payout = Math.min(roundPayout(reimbursable), policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}

/**
 * The MHPCO accepts a claim only when every reported damage is reportable and
 * names a distinct item the policy actually covers.
 */
function admitClaim(policy: Policy, incident: Incident): Item[] {
  requireReportableDamages(incident.damages);
  return matchDamagesToInsuredItems(policy, incident.damages);
}

function settleClaim(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = admitClaim(policy, incident);
  const reimbursable = reimbursableForIncident(incident.damages, damagedItems);
  const payout = drawFromCap(policy, reimbursable);
  return { payout, remainingCap: policy.remainingCap };
}

/** A claim can only be made against a policy an earlier quote step created. */
function requirePolicy(policies: Map<number, Policy>, step: number): Policy {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`No policy was created by step ${step}`);
  }
  return policy;
}

export function runScenario(scenario: Scenario): StepResult[] {
  let contracts = 0;
  const policies = new Map<number, Policy>();

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      return settleClaim(requirePolicy(policies, step.policy), step.incident);
    }
    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, openPolicy(step.items));
    return { premium };
  });
}
