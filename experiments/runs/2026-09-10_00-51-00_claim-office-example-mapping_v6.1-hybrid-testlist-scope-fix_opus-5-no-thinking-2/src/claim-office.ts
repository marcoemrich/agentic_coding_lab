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

export type Result = QuoteResult | ClaimResult;

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResults {
  results: Result[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

// Intermediate amounts are kept as fractions; only the final figure is rounded.
// Binary floating point makes sums like 100 * 1.1 + 5 land on 115.00000000000001,
// so that noise is trimmed before rounding. Twelve digits is comfortably more
// precision than any figure in Gold needs, and comfortably less than the
// seventeen at which the noise itself becomes visible.
const SIGNIFICANT_DIGITS = 12;

const withoutFloatingPointNoise = (amount: number): number =>
  Number(amount.toPrecision(SIGNIFICANT_DIGITS));

// Rounding always favours MHPCO, which means up for what the customer pays.
const roundPremiumInMHPCOsFavor = (amount: number): number =>
  Math.ceil(withoutFloatingPointNoise(amount));

// Three alike components form a building block priced as a unit.
// "Alike" means the same item type, so each group below is one candidate block
// and a list may contain several blocks.
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const alikeGroupsOf = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const alike = groups.get(item.type);
    if (alike) alike.push(item);
    else groups.set(item.type, [item]);
  }
  return [...groups.values()];
};

const formsABlock = (group: Item[]): boolean => group.length === BLOCK_SIZE;

// MHPCO insures only what its price list names. Every per-type figure is read
// through here, so a type the price list does not name can never reach a
// calculation as a missing number.
const priceListEntry = (
  priceList: Record<string, number>,
  item: Item,
): number => {
  const price = priceList[item.type];
  if (price === undefined) {
    throw new Error(`Not on the MHPCO price list: ${item.type}`);
  }
  return price;
};

const basePremiumOfItem = (item: Item): number =>
  priceListEntry(BASE_PREMIUMS, item);

const sumOfIndividualBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremiumOfItem(item), 0);

const basePremiumOfGroup = (group: Item[]): number =>
  formsABlock(group) ? BLOCK_BASE_PREMIUM : sumOfIndividualBasePremiums(group);

const basePremiumOf = (items: Item[]): number =>
  alikeGroupsOf(items).reduce(
    (sum, group) => sum + basePremiumOfGroup(group),
    0,
  );

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

// Every surcharge an item can attract, each applying independently of the rest.
const ITEM_SURCHARGES: { applies: (item: Item) => boolean; rate: number }[] = [
  { applies: (item) => item.cursed === true, rate: CURSE_SURCHARGE },
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL,
    rate: HIGH_ENCHANTMENT_SURCHARGE,
  },
];

// Item-specific surcharges are charged on the affected item's own base premium,
// not on the policy total.
const itemSurchargeRateOf = (item: Item): number =>
  ITEM_SURCHARGES.reduce(
    (total, { applies, rate }) => (applies(item) ? total + rate : total),
    0,
  );

const itemSurchargesOf = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + basePremiumOfItem(item) * itemSurchargeRateOf(item),
    0,
  );

const LOYALTY_DISCOUNT = -0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = -0.15;

// What a policy-wide modifier may look at: the customer, and how many contracts
// this customer already holds in the scenario.
interface PolicyContext {
  customer: Customer;
  previousContracts: number;
}

// Every policy-wide modifier, each charged on the policy base premium and each
// applying independently of the rest. Surcharges carry a positive rate,
// discounts a negative one, so all of them combine by plain addition.
const POLICY_MODIFIERS: {
  applies: (context: PolicyContext) => boolean;
  rate: number;
}[] = [
  { applies: () => true, rate: FIRST_INSURANCE_SURCHARGE },
  {
    applies: ({ customer }) => customer.yearsWithMHPCO >= LOYALTY_YEARS,
    rate: LOYALTY_DISCOUNT,
  },
  {
    applies: ({ previousContracts }) => previousContracts > 0,
    rate: FOLLOW_UP_CONTRACT_DISCOUNT,
  },
];

const policyModifiersOn = (
  policyBase: number,
  context: PolicyContext,
): number =>
  POLICY_MODIFIERS.reduce(
    (sum, { applies, rate }) =>
      applies(context) ? sum + policyBase * rate : sum,
    0,
  );

const withProcessingFee = (amount: number): number => amount + PROCESSING_FEE;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLE = 2;

// A policy created by a quote step: the items it covers and how much of its
// payout cap is still available.
interface Policy {
  items: Item[];
  remainingCap: number;
}

const insuranceSumOf = (items: Item[]): number =>
  items.reduce((sum, item) => sum + priceListEntry(INSURANCE_VALUES, item), 0);

// Rounding always favours MHPCO, which means down for what MHPCO pays out.
const roundPayoutInMHPCOsFavor = (amount: number): number =>
  Math.floor(withoutFloatingPointNoise(amount));

const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// Every clause that can reimburse a damaged item at less than full value. A
// clause names the share of the damage amount it reimburses; where no clause
// applies the item is reimbursed in full.
const REIMBURSEMENT_CLAUSES: {
  applies: (item: Item) => boolean;
  rate: number;
}[] = [
  {
    applies: (item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_LEVEL,
    rate: HIGH_ENCHANTMENT_REIMBURSEMENT_RATE,
  },
];

const reimbursementRateFor = (item: Item): number =>
  REIMBURSEMENT_CLAUSES.find(({ applies }) => applies(item))?.rate ??
  FULL_REIMBURSEMENT_RATE;

// A clause reduces the damage amount first; the deductible is withheld
// afterwards, once per damaged item.
const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;

// A damage entry once matched to the covered item it was suffered by.
interface ResolvedDamage {
  damage: Damage;
  item: Item;
}

// A damage is a loss MHPCO makes good, so it can only ever run from zero
// upwards. A negative amount is not a smaller claim but a nonsensical one, and
// it rejects the whole claim.
const rejectNegative = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

// Every damage entry names a distinct covered item, so two entries of one type
// need two such items on the policy. A damage MHPCO cannot match to a covered
// item rejects the whole claim.
const resolveDamagesAgainst = (
  incident: Incident,
  policy: Policy,
): ResolvedDamage[] => {
  const unclaimed = [...policy.items];
  return incident.damages.map((damage) => {
    rejectNegative(damage);
    const index = unclaimed.findIndex(({ type }) => type === damage.itemType);
    if (index === -1) {
      throw new Error(`Not covered by this policy: ${damage.itemType}`);
    }
    return { damage, item: unclaimed.splice(index, 1)[0] };
  });
};

// What the incident entitles the customer to, before the policy's remaining
// cap is allowed to reduce it.
const amountOwedForIncident = (incident: Incident, policy: Policy): number =>
  roundPayoutInMHPCOsFavor(
    resolveDamagesAgainst(incident, policy).reduce(
      (sum, { damage, item }) => sum + payoutForDamage(damage, item),
      0,
    ),
  );

// Paying out draws the payout down from the policy's cap, so a claim both
// reports a figure and leaves the policy with less cover for later claims.
const drawFromCap = (policy: Policy, desired: number): ClaimResult => {
  const payout = Math.min(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const claimFor = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  return drawFromCap(policy, amountOwedForIncident(step.incident, policy));
};

// Item-specific modifiers are charged on the affected item's base premium;
// policy-wide modifiers are charged on the policy base premium (the sum of all
// item base premiums); the processing fee is added at the very end.
const premiumFor = (items: Item[], context: PolicyContext): number => {
  const policyBase = basePremiumOf(items);
  const modifiedPremium =
    policyBase +
    itemSurchargesOf(items) +
    policyModifiersOn(policyBase, context);
  return roundPremiumInMHPCOsFavor(withProcessingFee(modifiedPremium));
};

const quoteFor = (step: QuoteStep, context: PolicyContext): QuoteResult => ({
  premium: premiumFor(step.items, context),
});

const policyFor = (step: QuoteStep): Policy => ({
  items: step.items,
  remainingCap: CAP_MULTIPLE * insuranceSumOf(step.items),
});

// What one scenario's steps build up between them: the customer they are all
// for, the policies quoted so far, and how many contracts this customer already
// holds (which earns later quotes the follow-up discount).
interface Office {
  customer: Customer;
  policies: Policy[];
  contractsIssued: number;
}

// A quote both answers with a premium and leaves a policy behind for later
// claim steps to draw on. A claim names its policy by the index of the step
// that created it, so policies are keyed by step index rather than pushed:
// claim steps simply leave no entry.
const issuePolicy = (
  step: QuoteStep,
  stepIndex: number,
  office: Office,
): QuoteResult => {
  const quote = quoteFor(step, {
    customer: office.customer,
    previousContracts: office.contractsIssued,
  });
  office.policies[stepIndex] = policyFor(step);
  office.contractsIssued += 1;
  return quote;
};

// Results are pushed in step order, so a scenario answers each step in turn.
export const runScenario = (scenario: Scenario): ScenarioResults => {
  const office: Office = {
    customer: scenario.customer,
    policies: [],
    contractsIssued: 0,
  };
  const results = scenario.steps.map((step, stepIndex) =>
    step.op === "claim"
      ? claimFor(step, office.policies)
      : issuePolicy(step, stepIndex, office),
  );
  return { results };
};
