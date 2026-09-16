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
const FIRST_INSURANCE_SURCHARGE = 0.1;

// The MHPCO rounds every final amount to whole G in its own favour: premiums
// the customer owes go up, payouts the MHPCO owes go down. Intermediate
// amounts are kept as fractions.
function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

function basePremiumOf(type: string): number {
  const basePremium = BASE_PREMIUMS[type];

  if (basePremium === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }

  return basePremium;
}

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }

  return counts;
}

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function basePremiumOfAlikeGroup(type: string, count: number): number {
  if (isComponent(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }

  return count * basePremiumOf(type);
}

function policyBasePremiumOf(items: Item[]): number {
  let total = 0;

  for (const [type, count] of countByType(items)) {
    total += basePremiumOfAlikeGroup(type, count);
  }

  return total;
}

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function surchargeRateOf(item: Item): number {
  let rate = 0;

  if (item.cursed === true) {
    rate += CURSE_SURCHARGE;
  }

  if (isHighlyEnchanted(item)) {
    rate += HIGH_ENCHANTMENT_SURCHARGE;
  }

  return rate;
}

function itemSurchargeOf(item: Item): number {
  return basePremiumOf(item.type) * surchargeRateOf(item);
}

function totalItemSurchargesOf(items: Item[]): number {
  return items.reduce((total, item) => total + itemSurchargeOf(item), 0);
}

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

function policyModifierRateOf(
  customer: Customer,
  previousContracts: number,
): number {
  let rate = FIRST_INSURANCE_SURCHARGE;

  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT;
  }

  if (previousContracts > 0) {
    rate -= FOLLOW_UP_CONTRACT_DISCOUNT;
  }

  return rate;
}

function quotePremium(
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number {
  const policyBasePremium = policyBasePremiumOf(items);
  const policyModifiers =
    policyBasePremium * policyModifierRateOf(customer, previousContracts);

  return roundPremiumInMHPCOsFavour(
    policyBasePremium +
      totalItemSurchargesOf(items) +
      policyModifiers +
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

function insuranceValueOf(type: string): number {
  const value = INSURANCE_VALUES[type];

  if (value === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }

  return value;
}

function insuranceSumOf(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface DamagedItem {
  item: Item;
  damage: Damage;
}

// Each damage entry refers to one distinct insured item, so a type may be
// claimed no more often than the policy covers it.
function damagedItems(policy: Policy, damages: Damage[]): DamagedItem[] {
  const unclaimed = [...policy.items];

  return damages.map((damage) => {
    const index = unclaimed.findIndex(
      (insured) => insured.type === damage.itemType,
    );

    if (index === -1) {
      throw new Error(`Policy does not cover item type: ${damage.itemType}`);
    }

    return { item: unclaimed.splice(index, 1)[0], damage };
  });
}

const HIGH_ENCHANTMENT_DAMAGE_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const FULL_REIMBURSEMENT = 1;

// The specification names two reimbursement clauses: damage to items with
// enchantment >= 8 is reimbursed at 50 %, and damage to dragon-material items
// is reimbursed in full. Where both apply the 50 % rule wins. Since full
// reimbursement is also the rate for items with no applicable clause, the
// dragon-material clause never changes an outcome under these rules and needs
// no branch of its own -- every dragon example in the specification
// (enchantment 5 -> 800-100, enchantment 8 and 9 -> 500-100) is produced by
// the high-enchantment rule and this default.
function reimbursementRateOf(item: Item): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_LEVEL) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT;
  }

  return FULL_REIMBURSEMENT;
}

function payoutForDamage(item: Item, damage: Damage): number {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }

  const reimbursement = damage.amount * reimbursementRateOf(item);

  return Math.max(0, reimbursement - DEDUCTIBLE);
}

function settleClaimAgainst(policy: Policy, incident: Incident): ClaimResult {
  const desiredPayout = damagedItems(policy, incident.damages).reduce(
    (total, { item, damage }) => total + payoutForDamage(item, damage),
    0,
  );
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(desiredPayout, policy.remainingCap),
  );

  policy.remainingCap -= payout;

  return { payout, remainingCap: policy.remainingCap };
}

export function runScenario(scenario: Scenario): StepResult[] {
  const policies = new Map<number, Policy>();
  let contracts = 0;

  return scenario.steps.map((step, index) => {
    if (step.op === "claim") {
      const policy = policies.get(step.policy);

      if (policy === undefined) {
        throw new Error(`Step ${step.policy} did not create a policy`);
      }

      return settleClaimAgainst(policy, step.incident);
    }

    const premium = quotePremium(step.items, scenario.customer, contracts);
    contracts += 1;
    policies.set(index, {
      items: step.items,
      remainingCap: insuranceSumOf(step.items) * CAP_MULTIPLIER,
    });

    return { premium };
  });
}
