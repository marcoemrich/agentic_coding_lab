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

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

/**
 * A fractional amount is always rounded in the MHPCO's favour, once, at the end
 * of the calculation it concludes. Which direction that is depends on who pays:
 * the customer pays a premium, so it rounds up; the MHPCO pays a claim, so it
 * rounds down. Intermediate amounts stay fractional.
 */
const roundPremiumInMHPCOsFavour = Math.ceil;
const roundPayoutInMHPCOsFavour = Math.floor;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

/** Components are the small parts — runes, moonstones — as opposed to main items. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** The block discount is a components-only offer. */
const ALIKE_ITEMS_BLOCK = { size: 3, basePremium: 60 };

const formsBlock = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === ALIKE_ITEMS_BLOCK.size;

const basePremiumForItemType = (type: string, count: number): number =>
  formsBlock(type, count)
    ? ALIKE_ITEMS_BLOCK.basePremium
    : count * BASE_PREMIUMS[type];

/**
 * Tallies a list of type names. Callers project their own shape onto the type
 * it names, so a policy's items and a claim's damages — which spell the field
 * differently — are counted by the same rule.
 */
const countByType = (types: readonly string[]): Map<string, number> =>
  types.reduce(
    (counts, type) => counts.set(type, (counts.get(type) ?? 0) + 1),
    new Map<string, number>(),
  );

const policyBasePremium = (items: Item[]): number =>
  [...countByType(items.map((item) => item.type))].reduce(
    (total, [type, count]) => total + basePremiumForItemType(type, count),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

interface RiskFactor {
  applies: (item: Item) => boolean;
  rate: number;
}

const RISK_FACTORS: RiskFactor[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE_RATE },
  { applies: isHighlyEnchanted, rate: HIGH_ENCHANTMENT_SURCHARGE_RATE },
];

const itemRiskSurcharge = (item: Item): number =>
  RISK_FACTORS.reduce(
    (total, { applies, rate }) =>
      applies(item) ? total + BASE_PREMIUMS[item.type] * rate : total,
    0,
  );

const totalRiskSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemRiskSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = -0.2;
const LOYALTY_YEARS = 2;

const isLoyal = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = -0.15;

/** A quote in the context of the customer's history with the MHPCO. */
interface Contract {
  customer: Customer;
  /** Zero-based ordinal of this quote among the customer's quotes. */
  ordinal: number;
}

const isFollowUpContract = (contract: Contract): boolean =>
  contract.ordinal > 0;

/**
 * Policy-wide modifiers are charged on the policy base premium, unlike the
 * item-specific RISK_FACTORS which are charged on each affected item's own
 * base premium. Rates are signed: negative is a discount.
 */
interface PolicyFactor {
  applies: (contract: Contract) => boolean;
  rate: number;
}

const POLICY_FACTORS: PolicyFactor[] = [
  {
    applies: ({ customer }) => isLoyal(customer),
    rate: LOYALTY_DISCOUNT_RATE,
  },
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE_RATE },
  {
    applies: isFollowUpContract,
    rate: FOLLOW_UP_CONTRACT_DISCOUNT_RATE,
  },
];

const totalPolicyAdjustments = (
  policyBase: number,
  contract: Contract,
): number =>
  POLICY_FACTORS.reduce(
    (total, { applies, rate }) =>
      applies(contract) ? total + policyBase * rate : total,
    0,
  );

/** The MHPCO only insures what is on its price list. */
const rejectUnknownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new ClaimOfficeError(
        `the MHPCO does not insure items of type ${item.type}`,
      );
    }
  }
};

const quotePremium = (items: Item[], contract: Contract): number => {
  rejectUnknownItemTypes(items);
  const policyBase = policyBasePremium(items);
  return roundPremiumInMHPCOsFavour(
    policyBase +
      totalRiskSurcharges(items) +
      totalPolicyAdjustments(policyBase, contract) +
      PROCESSING_FEE,
  );
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

const insuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);

const payoutCap = (items: Item[]): number =>
  insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;

/**
 * Distinct from the premium side's HIGH_ENCHANTMENT_LEVEL of 5: the payout
 * rule and the surcharge rule share a shape but not a threshold.
 */
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

/**
 * The share of a damage amount the MHPCO reimburses, before the deductible.
 * Damage to a heavily enchanted item is reimbursed at half.
 */
const reimbursementRate = (item: Item): number =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL
    ? HALF_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

/** Business the MHPCO refuses to transact. Reported to the customer as-is. */
export class ClaimOfficeError extends Error {}

/**
 * What a policy covers, indexed by item type: how many of that type are
 * insured, and — since the reimbursement rate depends on the item's own
 * enchantment — one insured item to read that rate from.
 *
 * Both claim-side questions are asked of this one structure: the overclaim
 * guard reads `count`, the payout reads `insuredItem`.
 *
 * When a policy covers several items of one type with differing enchantments,
 * `insuredItem` is the FIRST such item, and every damage of that type is
 * reimbursed at its rate. No example in the spec pins which item a damage
 * entry attaches to, so this preserves the original behaviour rather than
 * inventing a rule; revisit if the spec ever distinguishes them.
 */
interface Cover {
  count: number;
  insuredItem: Item;
}

const coverByType = (policyItems: Item[]): ReadonlyMap<string, Cover> =>
  policyItems.reduce((cover, item) => {
    const alreadyCovered = cover.get(item.type);
    return cover.set(item.type, {
      count: (alreadyCovered?.count ?? 0) + 1,
      insuredItem: alreadyCovered?.insuredItem ?? item,
    });
  }, new Map<string, Cover>());

/**
 * A claim is settled in full or not at all: damaging more items of a type than
 * the policy covers rejects the whole claim. An uninsured type — and an item
 * type the office does not know at all — is the zero-cover case.
 */
const rejectOverclaimedTypes = (
  damages: Damage[],
  cover: ReadonlyMap<string, Cover>,
): void => {
  for (const [type, claimed] of countByType(
    damages.map((damage) => damage.itemType),
  )) {
    const insured = cover.get(type)?.count ?? 0;
    if (claimed > insured) {
      throw new ClaimOfficeError(
        `claim covers ${claimed} ${type} damages but the policy insures ${insured}`,
      );
    }
  }
};

/**
 * The lookup cannot miss: `rejectOverclaimedTypes` runs first and rejects every
 * damage whose type the policy does not cover, uninsured and office-unknown
 * types alike (both are the zero-cover case). Asserted rather than re-checked,
 * so there is no second, unreachable rejection path to keep in step with the
 * first.
 */
const damagePayout = (
  damage: Damage,
  cover: ReadonlyMap<string, Cover>,
): number => {
  const { insuredItem } = cover.get(damage.itemType)!;
  return damage.amount * reimbursementRate(insuredItem) - DEDUCTIBLE_PER_DAMAGE;
};

/** Damage is a loss, never a gain. */
const rejectNegativeAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new ClaimOfficeError(
        `damage to a ${damage.itemType} cannot be negative: ${damage.amount}`,
      );
    }
  }
};

const claimResult = (
  step: ClaimStep,
  policyItems: Item[],
  capAlreadyUsed: number,
): ClaimResult => {
  rejectNegativeAmounts(step.incident.damages);
  const cover = coverByType(policyItems);
  rejectOverclaimedTypes(step.incident.damages, cover);
  const claimed = roundPayoutInMHPCOsFavour(
    step.incident.damages.reduce(
      (total, damage) => total + damagePayout(damage, cover),
      0,
    ),
  );
  // The cap covers the policy's whole lifetime, so a claim can only draw on
  // what earlier claims against the same policy have left.
  const capLeft = payoutCap(policyItems) - capAlreadyUsed;
  const payout = Math.min(claimed, capLeft);
  return { payout, remainingCap: capLeft - payout };
};

/**
 * The items covered by the policy a claim is filed against. A claim's `policy`
 * is the index of the quote step that established the policy.
 *
 * Assumes that step is in fact a quote; no test yet covers a claim pointing at
 * a non-quote step, so the assumption is asserted rather than checked.
 */
const policyItemsFor = (steps: Step[], claim: ClaimStep): Item[] =>
  (steps[claim.policy] as QuoteStep).items;

/**
 * What running the steps so far has established. Steps are settled in order and
 * each one reads this, so it carries everything a later step needs to know
 * about its predecessors.
 */
interface Ledger {
  /** Results of the steps settled so far, in step order. */
  results: StepResult[];
  /** Payout drawn against each policy so far, keyed by its quote step's index. */
  capUsedByPolicy: ReadonlyMap<number, number>;
  /** How many quotes have been settled: the next quote's contract ordinal. */
  quotesSoFar: number;
}

const EMPTY_LEDGER: Ledger = {
  results: [],
  capUsedByPolicy: new Map(),
  quotesSoFar: 0,
};

const settleQuote = (
  step: QuoteStep,
  customer: Customer,
  ledger: Ledger,
): Ledger => ({
  ...ledger,
  results: [
    ...ledger.results,
    {
      premium: quotePremium(step.items, {
        customer,
        ordinal: ledger.quotesSoFar,
      }),
    },
  ],
  quotesSoFar: ledger.quotesSoFar + 1,
});

const settleClaim = (
  step: ClaimStep,
  steps: Step[],
  ledger: Ledger,
): Ledger => {
  const capUsed = ledger.capUsedByPolicy.get(step.policy) ?? 0;
  const result = claimResult(step, policyItemsFor(steps, step), capUsed);
  return {
    ...ledger,
    results: [...ledger.results, result],
    capUsedByPolicy: new Map(ledger.capUsedByPolicy).set(
      step.policy,
      capUsed + result.payout,
    ),
  };
};

export const runScenario = ({ customer, steps }: Scenario): ScenarioResult => {
  const { results } = steps.reduce(
    (ledger, step) =>
      step.op === "claim"
        ? settleClaim(step, steps, ledger)
        : settleQuote(step, customer, ledger),
    EMPTY_LEDGER,
  );
  return { results };
};
