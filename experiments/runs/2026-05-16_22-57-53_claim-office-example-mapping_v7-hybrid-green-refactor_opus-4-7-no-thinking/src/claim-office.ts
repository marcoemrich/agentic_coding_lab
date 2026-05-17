const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

// Main items are insured individually at their base premium.
const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

// Components are grouped by type; exactly BLOCK_SIZE alike components
// form a "block" with a fixed base premium instead of per-item pricing.
const COMPONENT_BASE_PREMIUMS: Record<string, number> = {
  rune: 25,
  moonstone: 25,
};

const isComponent = (itemType: string): boolean =>
  itemType in COMPONENT_BASE_PREMIUMS;

const isMainItem = (itemType: string): boolean =>
  itemType in MAIN_ITEM_BASE_PREMIUMS;

const isKnownItemType = (itemType: string): boolean =>
  isMainItem(itemType) || isComponent(itemType);

const countBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const countByType = (items: { type: string }[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const componentGroupPremium = (componentType: string, count: number): number => {
  const perItem = COMPONENT_BASE_PREMIUMS[componentType];
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * perItem;
};

const computeBasePremium = (items: { type: string }[]): number => {
  const counts = countByType(items);
  return Object.entries(counts).reduce((total, [type, count]) => {
    if (isComponent(type)) {
      return total + componentGroupPremium(type, count);
    }
    return total + count * (MAIN_ITEM_BASE_PREMIUMS[type] ?? 0);
  }, 0);
};

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const computeItemSurcharges = (
  items: { type: string; cursed?: boolean; enchantment?: number }[],
): number =>
  items.reduce((total, item) => {
    if (!isMainItem(item.type)) {
      return total;
    }
    const base = MAIN_ITEM_BASE_PREMIUMS[item.type];
    let surcharge = 0;
    if (item.cursed) {
      surcharge += base * CURSED_SURCHARGE_RATE;
    }
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
    }
    return total + surcharge;
  }, 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

type PremiumContext = {
  items: { type: string; cursed?: boolean; enchantment?: number }[];
  isLoyalCustomer: boolean;
  isFollowUpContract: boolean;
};

const computeStepPremium = (context: PremiumContext): number => {
  const basePremium = computeBasePremium(context.items);
  const itemSurcharges = computeItemSurcharges(context.items);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = context.isLoyalCustomer
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;
  const followUpDiscount = context.isFollowUpContract
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  return (
    basePremium +
    itemSurcharges +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE
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
const CAP_MULTIPLIER = 2;

type PolicyItem = { type: string; enchantment?: number };

type PolicyState = {
  items: PolicyItem[];
  remainingCap: number;
};

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const computeInsuranceSum = (items: { type: string }[]): number =>
  items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);

const findPolicyItemOrThrow = (
  items: PolicyItem[],
  itemType: string,
): PolicyItem => {
  const item = items.find((i) => i.type === itemType);
  if (!item) {
    throw new Error(`Damaged item type not in policy: ${itemType}`);
  }
  return item;
};

const assertNonNegativeDamage = (amount: number): void => {
  if (amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${amount}`);
  }
};

type Damage = { itemType: string; amount: number };

const computeDamagePayout = (
  damage: Damage,
  items: PolicyItem[],
): number => {
  assertNonNegativeDamage(damage.amount);
  const item = findPolicyItemOrThrow(items, damage.itemType);
  const reimbursable =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
      : damage.amount;
  return reimbursable - DEDUCTIBLE_PER_DAMAGE;
};

const computeClaimPayout = (
  damages: Damage[],
  items: PolicyItem[],
): number =>
  damages.reduce((total, damage) => total + computeDamagePayout(damage, items), 0);

type QuoteContext = {
  items: { type: string; cursed?: boolean; enchantment?: number }[];
  isLoyalCustomer: boolean;
  isFollowUpContract: boolean;
};

const handleQuote = (
  step: any,
  index: number,
  policies: Record<number, PolicyState>,
  isLoyalCustomer: boolean,
): { premium: number } => {
  const items = step?.items ?? [];
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  policies[index] = {
    items,
    remainingCap: computeInsuranceSum(items) * CAP_MULTIPLIER,
  };
  const context: QuoteContext = {
    items,
    isLoyalCustomer,
    isFollowUpContract: index > 0,
  };
  return { premium: Math.ceil(computeStepPremium(context)) };
};

const assertDamageCountsWithinPolicy = (
  damages: Damage[],
  items: PolicyItem[],
): void => {
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  const itemCounts = countByType(items);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) {
      throw new Error(`More damage entries of type ${type} than insured`);
    }
  }
};

const handleClaim = (
  step: any,
  policies: Record<number, PolicyState>,
): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  const damages: Damage[] = step?.incident?.damages ?? [];
  assertDamageCountsWithinPolicy(damages, policy.items);
  const desiredPayout = computeClaimPayout(damages, policy.items);
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: any): unknown => {
  const steps = scenario?.steps ?? [];
  const isLoyalCustomer =
    (scenario?.customer?.yearsWithMHPCO ?? 0) >= LOYALTY_THRESHOLD_YEARS;
  const policies: Record<number, PolicyState> = {};
  const results = steps.map((step: any, index: number) =>
    step?.op === "claim"
      ? handleClaim(step, policies)
      : handleQuote(step, index, policies, isLoyalCustomer),
  );
  return { results };
};
