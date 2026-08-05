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

export interface ScenarioResult {
  results: StepResult[];
}

/** Flat fee charged on every quote, in gold. */
const PROCESSING_FEE_G = 5;

/** Base premium in gold, looked up by the type of a non-component item. */
const BASE_PREMIUM_G_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

/** Surcharge on a cursed item's base premium. */
const CURSE_SURCHARGE_RATE = 0.5;

/** Surcharge on the base premium of a highly enchanted item. */
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

/** An item is highly enchanted from this enchantment level upwards. */
const HIGH_ENCHANTMENT_LEVEL = 5;

/** Surcharge on the base premium when the policy is taken out for the first time. */
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/** Discount on the base premium of each contract after the customer's first. */
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

/** Discount on the base premium for a long-standing customer. */
const LOYALTY_DISCOUNT_RATE = 0.2;

/** A customer counts as long-standing from this many years with the MHPCO. */
const LOYALTY_YEARS = 2;

/** Item types that count as components and qualify for block pricing. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** Base premium in gold of a single component, the same for every component type. */
const COMPONENT_BASE_PREMIUM_G = 25;

/** A block of exactly this many alike components is priced as a unit. */
const COMPONENT_BLOCK_SIZE = 3;

/** Base premium in gold for a block of alike components. */
const COMPONENT_BLOCK_BASE_PREMIUM_G = 60;

/** How many of the values share each key. */
const countByKey = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

/** How many items of each type are on the quote. */
const itemCountByType = (items: Item[]): Map<string, number> =>
  countByKey(items, (item) => item.type);

/** Whether these alike items form exactly one block of components. */
const formsComponentBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

/**
 * Builds a gold lookup by item type in which every component type shares one
 * value while every other item type has its own.
 */
const goldLookupByItemType =
  (goldByNonComponentType: Record<string, number>, goldPerComponent: number) =>
  (type: string): number =>
    COMPONENT_TYPES.has(type) ? goldPerComponent : goldByNonComponentType[type];

/** Base premium in gold of a single item of the given type. */
const basePremiumForItemType = goldLookupByItemType(
  BASE_PREMIUM_G_BY_ITEM_TYPE,
  COMPONENT_BASE_PREMIUM_G,
);

/** Base premium in gold for all items of one type, applying the component-block rule. */
const basePremiumForAlikeItems = (type: string, count: number): number =>
  formsComponentBlock(type, count)
    ? COMPONENT_BLOCK_BASE_PREMIUM_G
    : count * basePremiumForItemType(type);

/** Sum of the base premiums of every item on the quote, in gold. */
const basePremiumFor = (items: Item[]): number =>
  [...itemCountByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

/** Whether an item's enchantment reaches the given level; unenchanted items are level 0. */
const hasEnchantmentAtLeast = (item: Item, level: number): boolean =>
  (item.enchantment ?? 0) >= level;

/** Combined surcharge rate an item earns through its own properties. */
const itemSurchargeRateFor = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (hasEnchantmentAtLeast(item, HIGH_ENCHANTMENT_LEVEL)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0);

/** Surcharges that attach to the base premiums of the individual items, in gold. */
const itemSurchargesFor = (items: Item[]): number =>
  items.reduce(
    (total, item) =>
      total + basePremiumForItemType(item.type) * itemSurchargeRateFor(item),
    0,
  );

/** Whether the customer has been with the MHPCO long enough to earn the loyalty discount. */
const isLongStandingCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

/** Every contract a customer takes out after their first is a follow-up contract. */
const isFollowUpContract = (contractNumber: number): boolean => contractNumber > 1;

/** Combined rate of the modifiers that apply to the whole policy's base premium. */
const policyModifierRateFor = (customer: Customer, contractNumber: number): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  (isLongStandingCustomer(customer) ? LOYALTY_DISCOUNT_RATE : 0) -
  (isFollowUpContract(contractNumber) ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0);

/** Premiums are billed in whole gold, rounded up, i.e. in the MHPCO's favour. */
const roundUpToWholeGold = (gold: number): number => Math.ceil(gold);

/** Premium for one quote, in whole gold. */
const quotePremiumFor = (
  items: Item[],
  customer: Customer,
  contractNumber: number,
): number => {
  const basePremium = basePremiumFor(items);
  return roundUpToWholeGold(
    basePremium +
      itemSurchargesFor(items) +
      basePremium * policyModifierRateFor(customer, contractNumber) +
      PROCESSING_FEE_G,
  );
};

/** The total payout of a policy is capped at this multiple of its insurance sum. */
const CAP_MULTIPLE = 2;

/** Insurance value in gold, looked up by the type of a non-component item. */
const INSURANCE_VALUE_G_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};

/** Insurance value in gold of a single component, the same for every component type. */
const COMPONENT_INSURANCE_VALUE_G = 250;

/** Insurance value in gold of a single item of the given type. */
const insuranceValueForItemType = goldLookupByItemType(
  INSURANCE_VALUE_G_BY_ITEM_TYPE,
  COMPONENT_INSURANCE_VALUE_G,
);

/** Sum of the insurance values of the insured items, in gold. */
const insuranceSumFor = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueForItemType(item.type), 0);

/** Payouts are paid in whole gold, rounded down, i.e. in the MHPCO's favour. */
const roundDownToWholeGold = (gold: number): number => Math.floor(gold);

/** Damage to an item this highly enchanted is only half reimbursed. */
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;

/** Share of the damage amount that is reimbursed for a very highly enchanted item. */
const HALF_REIMBURSEMENT_RATE = 0.5;

/** Share of the damage amount reimbursed for the damaged item, before the deductible. */
const reimbursementRateFor = (item: Item): number =>
  hasEnchantmentAtLeast(item, HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL)
    ? HALF_REIMBURSEMENT_RATE
    : 1;

/** Deductible withheld from every damage, in gold. */
const DEDUCTIBLE_G = 100;

/** Reimbursement for one damage, after the deductible, in gold. */
const payoutForDamage = (damage: Damage, item: Item): number =>
  Math.max(damage.amount * reimbursementRateFor(item) - DEDUCTIBLE_G, 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

/** A newly issued policy, with its full payout cap still available. */
const openPolicyFor = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumFor(items) * CAP_MULTIPLE,
});

/** Rejects a whole scenario the MHPCO cannot process. */
export class ClaimOfficeError extends Error {}

/** Whether the MHPCO insures items of this type at all. */
const isKnownItemType = (type: string): boolean =>
  COMPONENT_TYPES.has(type) || type in BASE_PREMIUM_G_BY_ITEM_TYPE;

/** Refuses to price items the MHPCO does not insure. */
const rejectUnknownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown !== undefined) {
    throw new ClaimOfficeError(`unknown item type: ${unknown.type}`);
  }
};

/** The insured item a damage was reported against. */
const insuredItemFor = (policy: Policy, damage: Damage): Item => {
  const insured = policy.items.find((item) => item.type === damage.itemType);
  if (insured === undefined) {
    throw new ClaimOfficeError(`item not insured by this policy: ${damage.itemType}`);
  }
  return insured;
};

/** Reimbursement for a whole incident, in whole gold. */
const payoutForIncident = (policy: Policy, incident: Incident): number =>
  roundDownToWholeGold(
    incident.damages.reduce(
      (total, damage) => total + payoutForDamage(damage, insuredItemFor(policy, damage)),
      0,
    ),
  );

/** Refuses an incident that damages more items of a type than the policy insures. */
const rejectOverClaimedTypes = (policy: Policy, incident: Incident): void => {
  const insuredCounts = itemCountByType(policy.items);
  for (const [type, claimed] of countByKey(
    incident.damages,
    (damage) => damage.itemType,
  )) {
    if (claimed > (insuredCounts.get(type) ?? 0)) {
      throw new ClaimOfficeError(`more ${type} damages claimed than insured`);
    }
  }
};

/** Pays out an incident from the policy, drawing the payout down from its cap. */
const settleClaimAgainst = (policy: Policy, incident: Incident): ClaimResult => {
  rejectOverClaimedTypes(policy, incident);
  const payout = Math.min(payoutForIncident(policy, incident), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  /** Every quote issues a policy; a claim refers to it by the index of that quote step. */
  const policiesByQuoteStep = new Map<number, Policy>();

  /** Issues the policy for a quote step and quotes the premium the customer pays for it. */
  const issuePolicyFor = (quoteStep: number, items: Item[]): QuoteResult => {
    rejectUnknownItemTypes(items);
    const contractNumber = policiesByQuoteStep.size + 1;
    policiesByQuoteStep.set(quoteStep, openPolicyFor(items));
    return { premium: quotePremiumFor(items, customer, contractNumber) };
  };

  /** Settles a claim against the policy issued by the quote step it refers to. */
  const settleClaim = ({ policy: quoteStep, incident }: ClaimStep): ClaimResult =>
    settleClaimAgainst(policiesByQuoteStep.get(quoteStep)!, incident);

  return {
    results: steps.map((step, stepIndex) =>
      step.op === "quote" ? issuePolicyFor(stepIndex, step.items) : settleClaim(step),
    ),
  };
};
