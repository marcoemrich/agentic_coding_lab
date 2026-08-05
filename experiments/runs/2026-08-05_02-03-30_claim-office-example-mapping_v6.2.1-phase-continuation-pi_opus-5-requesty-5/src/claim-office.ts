const PROCESSING_FEE_IN_GOLD = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 10 / 100;
const CURSE_SURCHARGE_RATE = 50 / 100;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 30 / 100;
const HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 20 / 100;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 15 / 100;

export type Customer = { yearsWithMHPCO: number };

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };

export type Damage = { itemType: string; amount: number };

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type ScenarioResults = { results: Array<QuoteResult | ClaimResult> };

// A component type is priced as a block when sold in exactly the block size;
// types without a block premium are never sold as blocks.
type Tariff = {
  basePremium: number;
  insuranceValue: number;
  componentBlockPremium?: number;
};

const COMPONENT_BLOCK_SIZE = 3;

// One tariff table per insurable item type: the type catalogue lives in a single place,
// so premium, block pricing and insurance value can never cover different sets of types.
const TARIFF_BY_TYPE: Record<string, Tariff> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250, componentBlockPremium: 60 },
  moonstone: { basePremium: 25, insuranceValue: 250, componentBlockPremium: 60 },
};

const tariffForType = (type: string): Tariff => {
  const tariff = TARIFF_BY_TYPE[type];
  if (tariff === undefined) {
    throw new Error(`unknown item type: ${type}`);
  }
  return tariff;
};

const countBy = <T>(values: T[], keyOf: (value: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const value of values) {
    const key = keyOf(value);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
};

const countByType = (items: Item[]): Map<string, number> =>
  countBy(items, (item) => item.type);

const countByDamagedType = (damages: Damage[]): Map<string, number> =>
  countBy(damages, (damage) => damage.itemType);

// Components of one type sold as a block of exactly 3 are priced as one block.
const basePremiumForItemGroup = (type: string, count: number): number => {
  const { basePremium, componentBlockPremium } = tariffForType(type);
  return count === COMPONENT_BLOCK_SIZE && componentBlockPremium !== undefined
    ? componentBlockPremium
    : count * basePremium;
};

const basePremiumForItems = (items: Item[]): number =>
  [...countByType(items)].reduce(
    (sum, [type, count]) => sum + basePremiumForItemGroup(type, count),
    0,
  );

// Premiums are always rounded in MHPCO's favour, i.e. upwards.
const roundUpInMHPCOsFavour = Math.ceil;

// Items without an explicit enchantment are plain, i.e. enchantment 0.
const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_SURCHARGE_THRESHOLD;

// Surcharges are item-scoped: each applicable rate applies to that item's own base premium.
const surchargeRateForItem = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const itemScopedSurchargesForItems = (items: Item[]): number =>
  items.reduce(
    (sum, item) =>
      sum + tariffForType(item.type).basePremium * surchargeRateForItem(item),
    0,
  );

// Policy-scoped rates apply to the policy's whole base premium.
const loyaltyDiscountRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? LOYALTY_DISCOUNT_RATE : 0;

const followUpContractDiscountRate = (isFollowUpContract: boolean): number =>
  isFollowUpContract ? FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;

// Surcharges are positive, discounts negative; together they scale the policy's base premium.
// Kept as a separate additive term (not `base * (1 + rate)`) so floating-point results match
// the arithmetic the tariff is specified in before rounding.
const policyScopedRate = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  loyaltyDiscountRate(customer) -
  followUpContractDiscountRate(isFollowUpContract);

const premiumForPolicy = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = basePremiumForItems(items);
  return roundUpInMHPCOsFavour(
    basePremium +
      basePremium * policyScopedRate(customer, isFollowUpContract) +
      itemScopedSurchargesForItems(items) +
      PROCESSING_FEE_IN_GOLD,
  );
};

const DEDUCTIBLE_IN_GOLD = 100;
const CAP_MULTIPLIER = 2;

// Payouts are always rounded in MHPCO's favour, i.e. downwards.
const roundDownInMHPCOsFavour = Math.floor;

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + tariffForType(item.type).insuranceValue, 0);

// A policy's cap limits the total it can ever pay out.
const capForItems = (items: Item[]): number =>
  CAP_MULTIPLIER * insuranceSumForItems(items);

const PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const PARTIAL_REIMBURSEMENT_RATE = 50 / 100;
const FULL_REIMBURSEMENT_RATE = 1;

type Policy = { items: Item[]; remainingCap: number };

// Damage to a heavily enchanted item is only reimbursed in part.
const reimbursementRateForItem = (item: Item): number =>
  enchantmentOf(item) >= PARTIAL_REIMBURSEMENT_ENCHANTMENT_THRESHOLD
    ? PARTIAL_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;

// The deductible is withheld once per damaged item.
const payoutForDamage = (damage: Damage, item: Item): number =>
  damage.amount * reimbursementRateForItem(item) - DEDUCTIBLE_IN_GOLD;

// A damage entry names an item type; the reimbursement depends on the insured item itself.
const insuredItemFor = (damage: Damage, policy: Policy): Item =>
  policy.items.find((item) => item.type === damage.itemType)!;

// The payout an incident earns before the policy's remaining cap is applied.
const uncappedPayoutForIncident = (
  incident: ClaimStep["incident"],
  policy: Policy,
): number =>
  roundDownInMHPCOsFavour(
    incident.damages.reduce(
      (sum, damage) => sum + payoutForDamage(damage, insuredItemFor(damage, policy)),
      0,
    ),
  );

// A damage amount is a loss, never a gain.
const rejectNegativeDamageAmounts = (incident: ClaimStep["incident"]): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must not be negative: ${damage.amount}`);
    }
  }
};

// A claim is rejected as a whole if it reports more damages of a type than the policy covers.
const rejectOverclaimedTypes = (incident: ClaimStep["incident"], policy: Policy): void => {
  const insuredCounts = countByType(policy.items);
  const damagedCounts = countByDamagedType(incident.damages);
  for (const [type, damagedCount] of damagedCounts) {
    const insuredCount = insuredCounts.get(type) ?? 0;
    if (damagedCount > insuredCount) {
      throw new Error(
        `claim reports ${damagedCount} damaged ${type}(s) but the policy covers ${insuredCount}`,
      );
    }
  }
};

// The remaining cap limits every single payout and is consumed by it.
const withdrawFromRemainingCap = (policy: Policy, uncappedPayout: number): number => {
  const payout = Math.min(uncappedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  // A policy is identified by the index of the quote step that created it.
  const policiesByStepIndex = new Map<number, Policy>();

  // Every quote after the customer's first one in a scenario is a follow-up contract.
  const issueQuote = (step: QuoteStep, stepIndex: number): QuoteResult => {
    const isFollowUpContract = policiesByStepIndex.size > 0;
    policiesByStepIndex.set(stepIndex, {
      items: step.items,
      remainingCap: capForItems(step.items),
    });
    return {
      premium: premiumForPolicy(step.items, scenario.customer, isFollowUpContract),
    };
  };

  const settleClaim = (step: ClaimStep): ClaimResult => {
    const policy = policiesByStepIndex.get(step.policy)!;
    rejectNegativeDamageAmounts(step.incident);
    rejectOverclaimedTypes(step.incident, policy);
    const payout = withdrawFromRemainingCap(
      policy,
      uncappedPayoutForIncident(step.incident, policy),
    );
    return { payout, remainingCap: policy.remainingCap };
  };

  return {
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "quote" ? issueQuote(step, stepIndex) : settleClaim(step),
    ),
  };
};
