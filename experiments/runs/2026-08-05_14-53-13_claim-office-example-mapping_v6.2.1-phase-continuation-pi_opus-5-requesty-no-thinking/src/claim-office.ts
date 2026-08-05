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

export interface ScenarioResults {
  results: StepResult[];
}

/** Flat administrative fee added to every premium. */
const PROCESSING_FEE = 5;

/** Surcharge rate applied to the base premium of newly insured items. */
const INITIAL_ASSESSMENT_RATE = 0.1;

/** What MHPCO charges for, and pays out on, one item of a given type. */
interface ListedPrice {
  basePremium: number;
  insuranceValue: number;
}

/** Every item type MHPCO insures, and its price. Types absent here are not insurable. */
const PRICE_LIST: Record<string, ListedPrice> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

/** The price list entry for this type, rejecting anything MHPCO does not insure. */
const listedPriceFor = (type: string): ListedPrice => {
  const listedPrice = PRICE_LIST[type];
  if (listedPrice === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return listedPrice;
};

/** The premium an item of this type is insured at before any modifiers. */
const basePremiumFor = (type: string): number => listedPriceFor(type).basePremium;

/** Insurance value of one item of this type, the basis for the payout cap. */
const insuranceValueFor = (type: string): number => listedPriceFor(type).insuranceValue;

/** Number of alike components that together form a discounted building block. */
const COMPONENT_BLOCK_SIZE = 3;

/** Base premium for a whole building block, cheaper than its components priced individually. */
const COMPONENT_BLOCK_PREMIUM = 60;

/** Item types that count as components and can form building blocks. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

/** How many times each distinct type occurs among the given type names. */
const countPerType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

/** Alike components earn the block price only when there are exactly three of them. */
const qualifiesForBlockPrice = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === COMPONENT_BLOCK_SIZE;

/** Base premium for all items of one type, honouring the building-block price. */
const basePremiumForAlikeItems = (type: string, count: number): number =>
  qualifiesForBlockPrice(type, count) ? COMPONENT_BLOCK_PREMIUM : count * basePremiumFor(type);

const calculatePolicyBasePremium = (items: Item[]): number =>
  [...countPerType(items.map((item) => item.type))].reduce(
    (total, [type, count]) => total + basePremiumForAlikeItems(type, count),
    0,
  );

/**
 * Risky items add a surcharge on their own base premium, so a risk is fully
 * described by what makes an item risky and by how much that risk costs.
 */
const calculatePolicyRiskSurcharge = (
  items: Item[],
  isRisky: (item: Item) => boolean,
  rate: number,
): number =>
  items.filter(isRisky).reduce((total, item) => total + basePremiumFor(item.type) * rate, 0);

/** Surcharge rate applied to the base premium of a cursed item. */
const CURSE_RATE = 0.5;

const isCursed = (item: Item): boolean => item.cursed === true;

/** Surcharge rate applied to the base premium of a highly enchanted item. */
const HIGH_ENCHANTMENT_RATE = 0.3;

/** From this enchantment level upwards an item counts as highly enchanted. */
const HIGH_ENCHANTMENT_LEVEL = 5;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;

/** Discount rate granted to long-standing customers. */
const LOYALTY_RATE = 0.2;

/** From this many years of business a customer counts as long-standing. */
const LOYALTY_YEARS = 2;

/** The discount rate a customer has earned on the policy base premium. */
const loyaltyRateFor = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS ? LOYALTY_RATE : 0;

/** Discount rate on every contract after a customer's first. */
const FOLLOW_UP_CONTRACT_RATE = 0.15;

/** The discount rate a returning customer has earned on the policy base premium. */
const followUpRateFor = (previousContracts: number): number =>
  previousContracts > 0 ? FOLLOW_UP_CONTRACT_RATE : 0;

/** The risk surcharges a policy's items attract on top of their base premium. */
const calculatePolicyRiskSurcharges = (items: Item[]): number =>
  calculatePolicyRiskSurcharge(items, isCursed, CURSE_RATE) +
  calculatePolicyRiskSurcharge(items, isHighlyEnchanted, HIGH_ENCHANTMENT_RATE);

/** Premiums are rounded up, so any fraction of a gold piece falls to MHPCO. */
const calculatePolicyPremium = (
  items: Item[],
  customer: Customer,
  previousContracts: number,
): number => {
  const policyBasePremium = calculatePolicyBasePremium(items);
  return Math.ceil(
    policyBasePremium +
      calculatePolicyRiskSurcharges(items) +
      policyBasePremium * INITIAL_ASSESSMENT_RATE -
      policyBasePremium * loyaltyRateFor(customer) -
      policyBasePremium * followUpRateFor(previousContracts) +
      PROCESSING_FEE,
  );
};

/** Amount the customer bears for each damaged item. */
const DEDUCTIBLE = 100;

/** The total payout of a policy is capped at this multiple of its insurance sum. */
const CAP_FACTOR = 2;

const calculateInsuranceSum = (items: Item[]): number =>
  items.reduce((total, item) => total + insuranceValueFor(item.type), 0);

/** The most a policy ever pays out, across all claims made against it together. */
const calculatePayoutCap = (items: Item[]): number =>
  calculateInsuranceSum(items) * CAP_FACTOR;

/** Damage to a heavily enchanted item is only partly reimbursed. */
const ENCHANTMENT_CLAUSE_LEVEL = 8;

/** Share of the damage MHPCO reimburses when the enchantment clause applies. */
const ENCHANTMENT_CLAUSE_RATE = 0.5;

const reimbursementRateFor = (item: Item): number =>
  (item.enchantment ?? 0) >= ENCHANTMENT_CLAUSE_LEVEL ? ENCHANTMENT_CLAUSE_RATE : 1;

/** What MHPCO reimburses for one damaged item, once the customer has borne the deductible. */
const reimbursementFor = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;

/** The insured item a damage entry refers to, which decides how that damage is reimbursed. */
const damagedItemIn = (policyItems: Item[], damage: Damage): Item => {
  const item = policyItems.find((candidate) => candidate.type === damage.itemType);
  if (item === undefined) {
    throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
  }
  return item;
};

/** A claim can only be made for as many items of a type as the policy actually covers. */
const assertDamagesAreCovered = (policyItems: Item[], damages: Damage[]): void => {
  const insured = countPerType(policyItems.map((item) => item.type));
  for (const [type, damaged] of countPerType(damages.map((damage) => damage.itemType))) {
    if (damaged > (insured.get(type) ?? 0)) {
      throw new Error(`The policy covers fewer items of type "${type}" than the claim reports`);
    }
  }
};

/** MHPCO only accepts damage reports that state a loss, never a gain. */
const assertDamageAmountsArePositive = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative, but the claim reports ${damage.amount}`);
    }
  }
};

/** Payouts are rounded down, so any fraction of a gold piece stays with MHPCO. */
const calculatePayout = (policyItems: Item[], damages: Damage[]): number =>
  Math.floor(
    damages.reduce(
      (total, damage) => total + reimbursementFor(damage, damagedItemIn(policyItems, damage)),
      0,
    ),
  );

/** MHPCO settles a claim only once the damages it reports make sense for the policy. */
const settleIncident = (
  policyItems: Item[],
  incident: Incident,
  availableCap: number,
): ClaimResult => {
  const { damages } = incident;
  assertDamagesAreCovered(policyItems, damages);
  assertDamageAmountsArePositive(damages);
  const payout = Math.min(calculatePayout(policyItems, damages), availableCap);
  return { payout, remainingCap: availableCap - payout };
};

/** The quote step a claim refers to, which holds the items that claim is covered by. */
const policyOf = (scenario: Scenario, claim: ClaimStep): QuoteStep => {
  const step = scenario.steps[claim.policy];
  if (step === undefined || step.op !== "quote") {
    throw new Error(`Step ${claim.policy} is not a policy a claim can be made against`);
  }
  return step;
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  /** All claims on a policy share one cap, so what is left of it outlives the step that used it. */
  const remainingCapByPolicy = new Map<number, number>();

  /** Each step so far is a contract, so a step's index counts the customer's previous contracts. */
  const issuePolicy = (quote: QuoteStep, policyIndex: number): QuoteResult => {
    remainingCapByPolicy.set(policyIndex, calculatePayoutCap(quote.items));
    return { premium: calculatePolicyPremium(quote.items, scenario.customer, policyIndex) };
  };

  const settleClaim = (claim: ClaimStep): ClaimResult => {
    const availableCap = remainingCapByPolicy.get(claim.policy) ?? 0;
    const settlement = settleIncident(policyOf(scenario, claim).items, claim.incident, availableCap);
    remainingCapByPolicy.set(claim.policy, settlement.remainingCap);
    return settlement;
  };

  const results = scenario.steps.map((step, stepIndex): StepResult =>
    step.op === "quote" ? issuePolicy(step, stepIndex) : settleClaim(step),
  );
  return { results };
};
