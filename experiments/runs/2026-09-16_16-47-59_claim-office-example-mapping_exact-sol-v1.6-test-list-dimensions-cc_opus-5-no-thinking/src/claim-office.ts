const PROCESSING_FEE = 5;

const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = ["rune", "moonstone"];

const COMPONENT_INSURANCE_VALUE = 250;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

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

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const count of countByType(components).values()) {
    total += count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_BASE_PREMIUM;
  }
  return total;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;
}

function riskSurchargeRate(item: Item): number {
  const curse = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + enchantment;
}

function riskSurcharges(item: Item, listedPremium: number): number {
  return listedPremium * riskSurchargeRate(item);
}

function insurableValue(listed: number | undefined, itemType: string): number {
  if (listed === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${itemType}"`);
  }
  return listed;
}

function insuranceValueOf(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return insurableValue(MAIN_ITEM_INSURANCE_VALUES[item.type], item.type);
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValueOf(item), 0);
}

export function payoutCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

function listedPremiumOf(item: Item): number {
  return insurableValue(MAIN_ITEM_BASE_PREMIUMS[item.type], item.type);
}

type ItemSurcharges = (item: Item, listedPremium: number) => number;

function policyPremium(items: Item[], surcharges: ItemSurcharges): number {
  const mainItemsTotal = items
    .filter((item) => !isComponent(item))
    .reduce((total, item) => {
      const listedPremium = listedPremiumOf(item);
      return total + listedPremium + surcharges(item, listedPremium);
    }, 0);
  return mainItemsTotal + componentsBasePremium(items.filter(isComponent));
}

export function listedBasePremium(items: Item[]): number {
  return policyPremium(items, () => 0);
}

export function basePremium(items: Item[]): number {
  return policyPremium(items, riskSurcharges);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
  return loyalty + FIRST_INSURANCE_SURCHARGE_RATE + followUp;
}

/**
 * The MHPCO rounds every final amount in its own favour: a premium it collects
 * upwards, a payout it hands out downwards. Intermediate amounts stay fractional.
 */
const inMHPCOsFavour = {
  premium: (amount: number): number => Math.ceil(amount),
  payout: (amount: number): number => Math.floor(amount),
};

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const listedTotal = listedBasePremium(items);
  const premium =
    basePremium(items) +
    listedTotal * policyModifierRate(customer, previousContracts) +
    PROCESSING_FEE;
  return inMHPCOsFavour.premium(premium);
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

interface Policy {
  items: Item[];
  remainingCap: number;
}

/**
 * The MHPCO reimburses half the damage to a highly enchanted item. Dragon
 * material is reimbursed in full, which is also the default, so the
 * high-enchantment clause wins wherever both apply.
 */
function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function reimbursement(item: Item, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
  }
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE_PER_DAMAGE;
}

function damagedItems(policy: Policy, incident: Incident): [Item, Damage][] {
  const available = [...policy.items];
  return incident.damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
    }
    const [item] = available.splice(index, 1);
    return [item, damage];
  });
}

function settle(policy: Policy, incident: Incident): ClaimResult {
  const desired = damagedItems(policy, incident).reduce(
    (total, [item, damage]) => total + reimbursement(item, damage),
    0,
  );
  const payout = inMHPCOsFavour.payout(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): { results: (QuoteResult | ClaimResult)[] } {
  let contracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);
      if (policy === undefined) {
        throw new Error(`Step ${index} claims against step ${step.policy}, which is not a policy`);
      }
      return settle(policy, step.incident);
    }
    const premium = quote(scenario.customer, step.items, contracts);
    contracts += 1;
    policies.set(index, { items: step.items, remainingCap: payoutCap(step.items) });
    return { premium };
  });
  return { results };
}
