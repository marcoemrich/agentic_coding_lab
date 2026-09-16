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
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE = 2;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

/** Decimal places kept before rounding, to absorb binary floating-point error. */
const AMOUNT_PRECISION_DIGITS = 6;

/**
 * The MHPCO rounds every amount to whole G in its own favour: premiums up.
 * Binary floating point represents exact decimal amounts such as 110 as
 * 110.00000000000001, so amounts are snapped back to their decimal value
 * before rounding.
 */
function roundPremiumUp(amount: number): number {
  return Math.ceil(Number(amount.toFixed(AMOUNT_PRECISION_DIGITS)));
}

/** A payout is rounded down -- also in the MHPCO's favour. */
function roundPayoutDown(amount: number): number {
  return Math.floor(Number(amount.toFixed(AMOUNT_PRECISION_DIGITS)));
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/**
 * Components of one type are charged per piece, except that a building block of
 * exactly three alike components is offered at a special block premium.
 */
function basePremiumForType(type: string, count: number): number {
  if (!(type in BASE_PREMIUMS)) {
    throw new Error(`The MHPCO does not insure items of type "${type}"`);
  }
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
}

/**
 * An item-specific surcharge is a percentage of the affected item's own base
 * premium -- its share of the base premium charged for its type group.
 */
function itemRiskSurcharge(item: Item, ownBasePremium: number): number {
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += ownBasePremium * CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += ownBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

/** An item's share of the base premium charged for its whole type group. */
function ownBasePremium(type: string, counts: Map<string, number>): number {
  const count = counts.get(type) ?? 1;
  return basePremiumForType(type, count) / count;
}

/**
 * Policy-wide modifiers are percentages of the policy base premium and are
 * added together before being applied.
 */
function policyModifierRate(
  customer: Customer,
  previousContracts: number,
): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return rate;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const counts = countByType(items);

  let policyBasePremium = 0;
  for (const [type, count] of counts) {
    policyBasePremium += basePremiumForType(type, count);
  }

  let riskSurcharges = 0;
  for (const item of items) {
    riskSurcharges += itemRiskSurcharge(
      item,
      ownBasePremium(item.type, counts),
    );
  }

  const policyModifiers =
    policyBasePremium * policyModifierRate(customer, previousContracts);

  return roundPremiumUp(
    policyBasePremium + riskSurcharges + policyModifiers + PROCESSING_FEE,
  );
}

/** The MHPCO insures each item at its listed insurance value. */
function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

/**
 * Damage is reimbursed in full, except that damage to a highly enchanted item
 * is reimbursed at half the damage amount. The dragon-material clause also
 * grants full reimbursement, which is already the default, and the half rule
 * takes precedence where both apply -- so dragon material needs no branch.
 * The deductible is applied to the reimbursed amount afterwards.
 */
function reimbursementFor(item: Item, damage: Damage): number {
  let reimbursed = damage.amount;
  if ((item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL) {
    reimbursed *= HALF_REIMBURSEMENT_RATE;
  }
  return Math.max(0, reimbursed - DEDUCTIBLE_PER_DAMAGE);
}

/** The MHPCO does not accept a damage report for a negative amount. */
function rejectIllFormedDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
  }
}

/**
 * Every damage must name a distinct insured item: a policy covering one sword
 * cannot answer two sword damages. Matching consumes the item it matches.
 */
interface DamagedItem {
  item: Item;
  damage: Damage;
}

function matchDamagesToInsuredItems(
  policy: Policy,
  damages: Damage[],
): DamagedItem[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    rejectIllFormedDamage(damage);
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(
        `The policy does not cover a damaged item of type "${damage.itemType}"`,
      );
    }
    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

function claimPayout(policy: Policy, incident: Incident): ClaimResult {
  const damagedItems = matchDamagesToInsuredItems(policy, incident.damages);

  let desiredPayout = 0;
  for (const { item, damage } of damagedItems) {
    desiredPayout += reimbursementFor(item, damage);
  }

  const payout = roundPayoutDown(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const results: StepResult[] = [];
  const policies = new Map<number, Policy>();
  let contracts = 0;

  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      results.push({
        premium: quotePremium(step.items, scenario.customer, contracts),
      });
      policies.set(index, {
        items: step.items,
        remainingCap: insuranceSum(step.items) * CAP_MULTIPLE,
      });
      contracts += 1;
      return;
    }

    const policy = policies.get(step.policy);
    if (policy === undefined) {
      throw new Error(`Step ${step.policy} did not create a policy`);
    }
    results.push(claimPayout(policy, step.incident));
  });

  return results;
}
