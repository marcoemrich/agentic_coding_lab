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

export type StepResult =
  | { premium: number }
  | { payout: number; remainingCap: number };

export interface ScenarioResult {
  results: StepResult[];
}

const PROCESSING_FEE = 5;

const BASE_PREMIUMS = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
} as const satisfies Record<string, number>;

type InsurableItemType = keyof typeof BASE_PREMIUMS;

const isInsurable = (type: string): type is InsurableItemType =>
  type in BASE_PREMIUMS;

/**
 * The single gate every per-type lookup passes through: an item the MHPCO does
 * not insure is rejected here rather than yielding an undefined rate later.
 */
const insurableTypeOf = (item: Item): InsurableItemType => {
  if (!isInsurable(item.type)) {
    throw new Error(`The MHPCO does not insure a ${item.type}`);
  }
  return item.type;
};

const basePremiumOf = (item: Item): number =>
  BASE_PREMIUMS[insurableTypeOf(item)];

/** Premiums are rounded up — in MHPCO's favour. */
const roundPremium = (amount: number): number => Math.ceil(amount);

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

/** Items of a single type, kept together so the block rule can be applied. */
type SameTypeGroup = Item[];

const groupByType = (items: Item[]): SameTypeGroup[] => {
  const groups = new Map<string, SameTypeGroup>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const sumBasePremiums = (group: SameTypeGroup): number =>
  group.reduce((sum, item) => sum + basePremiumOf(item), 0);

/**
 * Exactly three alike items form a building block priced at a flat premium;
 * any other count is priced per item.
 */
const blockAwareBasePremium = (group: SameTypeGroup): number =>
  group.length === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : sumBasePremiums(group);

const policyBasePremiumFor = (items: Item[]): number =>
  groupByType(items).reduce(
    (sum, group) => sum + blockAwareBasePremium(group),
    0,
  );

const HIGH_ENCHANTMENT_LEVEL = 5;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

/**
 * An item-specific surcharge: when the item triggers the clause, it is charged
 * a rate of that item's own base premium — never of the whole policy's.
 */
interface ItemSurcharge {
  appliesTo: (item: Item) => boolean;
  rate: number;
}

const ITEM_SURCHARGES: ItemSurcharge[] = [
  { appliesTo: isCursed, rate: 0.5 },
  { appliesTo: isHighlyEnchanted, rate: 0.3 },
];

/** Every clause the item triggers stacks, each on that item's base premium. */
const surchargeRateFor = (item: Item): number =>
  ITEM_SURCHARGES.reduce(
    (rate, surcharge) =>
      surcharge.appliesTo(item) ? rate + surcharge.rate : rate,
    0,
  );

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + basePremiumOf(item) * surchargeRateFor(item),
    0,
  );

/** Every quote is an initial assessment, so this surcharge always applies. */
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS = 2;

const FOLLOW_UP_DISCOUNT_RATE = -0.15;

/** What the MHPCO knows about the customer when pricing a particular quote. */
interface QuoteContext {
  customer: Customer;
  previousContracts: number;
}

const isLoyal = ({ customer }: QuoteContext): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;
const isFollowUpContract = ({ previousContracts }: QuoteContext): boolean =>
  previousContracts > 0;

/**
 * A policy-wide modifier: when the customer triggers the clause, the whole
 * policy's base premium is adjusted by that rate — never a single item's.
 * A negative rate is a discount.
 */
interface PolicyModifier {
  appliesTo: (context: QuoteContext) => boolean;
  rate: number;
}

/** Conditional clauses, on top of the surcharge every quote already carries. */
const POLICY_MODIFIERS: PolicyModifier[] = [
  { appliesTo: isLoyal, rate: LOYALTY_DISCOUNT_RATE },
  { appliesTo: isFollowUpContract, rate: FOLLOW_UP_DISCOUNT_RATE },
];

/** Every clause the customer triggers stacks on the policy base premium. */
const policyModifierRateFor = (context: QuoteContext): number =>
  POLICY_MODIFIERS.reduce(
    (rate, modifier) =>
      modifier.appliesTo(context) ? rate + modifier.rate : rate,
    FIRST_INSURANCE_SURCHARGE_RATE,
  );

const quotePremium = (items: Item[], context: QuoteContext): number => {
  const policyBasePremium = policyBasePremiumFor(items);
  return roundPremium(
    policyBasePremium +
      policyBasePremium * policyModifierRateFor(context) +
      itemSurchargesFor(items) +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUES = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
} as const satisfies Record<InsurableItemType, number>;

const insuranceValueOf = (item: Item): number =>
  INSURANCE_VALUES[insurableTypeOf(item)];

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

/** Payouts are rounded down — in MHPCO's favour. */
const roundPayout = (amount: number): number => Math.floor(amount);

/** A policy created by a quote step, tracked so later claims can draw on it. */
interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueOf(item), 0);

const openPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSumOf(items),
});

const FULL_REIMBURSEMENT_RATE = 1;

const REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

/** Damage to a very highly enchanted item is only half reimbursed. */
const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

/** The deductible can absorb a small damage entirely, but never turns it into a debt. */
const afterDeductible = (amount: number): number =>
  Math.max(0, amount - DEDUCTIBLE);

const payoutForDamage = (damage: Damage, item: Item): number =>
  afterDeductible(damage.amount * reimbursementRateFor(item));

/**
 * Settling draws the payout from the policy's cap, so it yields the policy as
 * it stands afterwards rather than modifying the one passed in — the caller
 * decides whether to keep the drawn-down policy.
 */
interface Settlement {
  result: StepResult;
  policy: Policy;
}

/** A damage entry together with the insured item it will be settled against. */
interface ClaimedDamage {
  damage: Damage;
  item: Item;
}

/**
 * Each damage entry is settled against a distinct insured item, so claiming
 * for more items of a type than the policy covers is rejected outright — as is
 * a damage that could never have happened. Both are checked before any money is
 * computed, so an unsettleable claim is rejected whole rather than in part.
 */
const matchDamagesToInsuredItems = (
  policy: Policy,
  damages: Damage[],
): ClaimedDamage[] => {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
    }
    const index = unclaimed.findIndex(({ type }) => type === damage.itemType);
    if (index === -1) {
      throw new Error(`${damage.itemType} is not insured by this policy`);
    }
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

const settleClaim = (policy: Policy, incident: Incident): Settlement => {
  const claimedPayout = matchDamagesToInsuredItems(
    policy,
    incident.damages,
  ).reduce((sum, { damage, item }) => sum + payoutForDamage(damage, item), 0);
  const payout = roundPayout(Math.min(claimedPayout, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout, remainingCap },
    policy: { ...policy, remainingCap },
  };
};

/** A claim may only draw on a policy that an earlier quote step actually opened. */
const policyOpenedBy = (
  policies: Map<number, Policy>,
  step: number,
): Policy => {
  const policy = policies.get(step);
  if (policy === undefined) {
    throw new Error(`No policy created by step ${step}`);
  }
  return policy;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, Policy>();
  let previousContracts = 0;

  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const context = { customer: scenario.customer, previousContracts };
      previousContracts += 1;
      policies.set(index, openPolicy(step.items));
      return { premium: quotePremium(step.items, context) };
    }

    const settlement = settleClaim(
      policyOpenedBy(policies, step.policy),
      step.incident,
    );
    policies.set(step.policy, settlement.policy);
    return settlement.result;
  });

  return { results };
};
