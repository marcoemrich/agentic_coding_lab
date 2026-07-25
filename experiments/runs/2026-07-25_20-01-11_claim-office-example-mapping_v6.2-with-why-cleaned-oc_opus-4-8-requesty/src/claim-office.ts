const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

const COMPONENT_RATE = 25;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;

const priceForGroup = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_RATE;

const countByType = (types: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const type of types) {
    counts.set(type, (counts.get(type) ?? 0) + 1);
  }
  return counts;
};

export const basePremium = (items: { type: string }[]): number => {
  const countsByType = countByType(items.map((item) => item.type));
  return sum([...countsByType.values()].map(priceForGroup));
};

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// A conditional portion of a base amount. Used for both surcharges (curse,
// high-enchantment) and discounts (loyalty, follow-up): the caller decides
// whether the resulting portion is added or subtracted.
const proportionOf = (base: number, rate: number, applies: boolean): number =>
  applies ? base * rate : 0;

type MainItem = { type: string; cursed?: boolean; enchantment?: number; material?: string };

const rawBasePremium = (item: MainItem): number => MAIN_ITEM_BASE_PREMIUM[item.type];

const premiumForMainItem = (item: MainItem): number => {
  const base = rawBasePremium(item);
  const curseSurcharge = proportionOf(base, CURSE_SURCHARGE_RATE, item.cursed ?? false);
  const highEnchantmentSurcharge = proportionOf(
    base,
    HIGH_ENCHANTMENT_RATE,
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD,
  );
  return base + curseSurcharge + highEnchantmentSurcharge;
};

export const itemsPremiumBeforePolicyModifiers = (items: MainItem[]): number =>
  sum(items.map(premiumForMainItem));

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

// MHPCO always resolves fractional Gold in its own favor: money flowing in
// (premiums) rounds up, money flowing out (payouts) rounds down.
const roundInMHPCOFavor = (amount: number, flow: "in" | "out"): number =>
  flow === "in" ? Math.ceil(amount) : Math.floor(amount);

export const roundPremium = (amount: number): number =>
  roundInMHPCOFavor(amount, "in");

export const roundPayout = (amount: number): number =>
  roundInMHPCOFavor(amount, "out");

type QuoteStep = {
  op: "quote";
  items: MainItem[];
};
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const quotePremium = (
  customer: Customer,
  items: MainItem[],
  isFollowUpContract: boolean,
): number => {
  const itemsWithSurcharges = itemsPremiumBeforePolicyModifiers(items);
  const modifierBase = sum(items.map(rawBasePremium));
  const policyAdjustment = (rate: number, applies: boolean): number =>
    proportionOf(modifierBase, rate, applies);

  const isLoyal = customer.yearsWithMHPCO >= LOYALTY_YEARS;
  const firstInsuranceSurcharge = modifierBase * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = policyAdjustment(LOYALTY_RATE, isLoyal);
  const followUpDiscount = policyAdjustment(
    FOLLOWUP_DISCOUNT_RATE,
    isFollowUpContract,
  );

  const premium =
    itemsWithSurcharges +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;
  return roundPremium(premium);
};

type Policy = { items: MainItem[]; remainingCap: number };

const insuranceSum = (items: MainItem[]): number =>
  sum(items.map((item) => INSURANCE_VALUE_BY_TYPE[item.type]));

const REIMBURSEMENT_ENCHANTMENT_THRESHOLD = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

const findInsuredItem = (policy: Policy, damage: Damage): MainItem =>
  policy.items.find((item) => item.type === damage.itemType)!;

const payoutForDamage = (damage: Damage, insuredItem: MainItem): number => {
  const reducedByEnchantment =
    (insuredItem.enchantment ?? 0) >= REIMBURSEMENT_ENCHANTMENT_THRESHOLD;
  const reimbursed = reducedByEnchantment
    ? damage.amount * REDUCED_REIMBURSEMENT_RATE
    : damage.amount;
  return reimbursed - DEDUCTIBLE;
};

const desiredPayoutForClaim = (policy: Policy, damages: Damage[]): number =>
  roundPayout(
    sum(
      damages.map((damage) =>
        payoutForDamage(damage, findInsuredItem(policy, damage)),
      ),
    ),
  );

const validateDamageAmounts = (damages: Damage[]): void => {
  const negativeDamage = damages.find((damage) => damage.amount < 0);
  if (negativeDamage) {
    throw new Error(
      `Damage amount cannot be negative: ${negativeDamage.amount}`,
    );
  }
};

const validateClaimCoverage = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countByType(policy.items.map((item) => item.type));
  const damageCounts = countByType(damages.map((damage) => damage.itemType));
  for (const [type, damageCount] of damageCounts) {
    if (damageCount > (insuredCounts.get(type) ?? 0)) {
      throw new Error(
        `Claim references more ${type} damages than are insured`,
      );
    }
  }
};

const isKnownType = (type: string): boolean =>
  type in INSURANCE_VALUE_BY_TYPE;

const validateItemTypes = (items: MainItem[]): void => {
  const unknownItem = items.find((item) => !isKnownType(item.type));
  if (unknownItem) {
    throw new Error(`Unknown item type: ${unknownItem.type}`);
  }
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const policies: Policy[] = [];
  let quoteCount = 0;

  const handleQuoteStep = (step: QuoteStep) => {
    validateItemTypes(step.items);
    const premium = quotePremium(
      scenario.customer,
      step.items,
      quoteCount > 0,
    );
    quoteCount += 1;
    policies.push({
      items: step.items,
      remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
    });
    return { premium };
  };

  const handleClaimStep = (step: ClaimStep) => {
    const policy = policies[step.policy];
    const damages = step.incident.damages;
    validateDamageAmounts(damages);
    validateClaimCoverage(policy, damages);
    const desiredPayout = desiredPayoutForClaim(policy, damages);
    const payout = Math.min(desiredPayout, policy.remainingCap);
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  };

  const results = scenario.steps.map((step) =>
    step.op === "quote" ? handleQuoteStep(step) : handleClaimStep(step),
  );
  return { results };
};
