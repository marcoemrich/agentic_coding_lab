const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEAR_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const FRAGILE_ENCHANTMENT_THRESHOLD = 8;
const FRAGILE_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

type ItemTypeInfo = {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
};

const ITEM_REGISTRY: Record<string, ItemTypeInfo> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const itemInfo = (type: string): ItemTypeInfo => {
  const info = ITEM_REGISTRY[type];
  if (info === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return info;
};

const basePremiumFor = (type: string): number => itemInfo(type).basePremium;

const insuranceValueFor = (type: string): number => itemInfo(type).insuranceValue;

type Item = {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
};
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

type Policy = { items: Item[]; remainingCap: number };

// Rounding favours MHPCO: premiums round up (customer pays more),
// payouts round down (MHPCO pays less).
const roundPremiumInMHPCOsFavor = Math.ceil;
const roundPayoutInMHPCOsFavor = Math.floor;

const groupedBasePremium = (type: string, count: number): number => {
  const info = itemInfo(type);
  if (info.isComponent && count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return count * info.basePremium;
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

const sumBasePremiums = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + groupedBasePremium(type, count),
    0,
  );

const surchargeFor = (item: Item, applies: boolean, rate: number): number =>
  applies ? basePremiumFor(item.type) * rate : 0;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeFor = (item: Item): number =>
  surchargeFor(item, isCursed(item), CURSE_SURCHARGE_RATE) +
  surchargeFor(item, isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_RATE);

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeFor(item), 0);

const firstInsuranceSurcharge = (basePremium: number): number =>
  basePremium * FIRST_INSURANCE_RATE;

const loyaltyDiscount = (basePremium: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEAR_THRESHOLD
    ? basePremium * LOYALTY_DISCOUNT_RATE
    : 0;

const followUpDiscount = (basePremium: number, isFollowUp: boolean): number =>
  isFollowUp ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (
  items: Item[],
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const basePremium = sumBasePremiums(items);
  const insurancePremium = roundPremiumInMHPCOsFavor(
    basePremium +
      sumItemSurcharges(items) +
      firstInsuranceSurcharge(basePremium) -
      loyaltyDiscount(basePremium, customer) -
      followUpDiscount(basePremium, isFollowUp),
  );
  return insurancePremium + PROCESSING_FEE;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item.type), 0);

const isFragile = (item: Item): boolean =>
  (item.enchantment ?? 0) >= FRAGILE_ENCHANTMENT_THRESHOLD;

const reimbursementRate = (item: Item): number =>
  isFragile(item) ? FRAGILE_REIMBURSEMENT_RATE : 1;

const findInsuredItem = (items: Item[], itemType: string): Item => {
  const insuredItem = items.find((item) => item.type === itemType);
  if (insuredItem === undefined) {
    throw new Error(`Item not insured by policy: ${itemType}`);
  }
  return insuredItem;
};

const damagePayout = (damage: Damage, items: Item[]): number => {
  if (damage.amount < 0) {
    throw new Error(`Negative damage amount: ${damage.amount}`);
  }
  const item = findInsuredItem(items, damage.itemType);
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE;
};

const runQuote = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): { result: { premium: number }; policy: Policy } => {
  const premium = quotePremium(step.items, customer, isFollowUp);
  const policy: Policy = {
    items: step.items,
    remainingCap: insuranceSum(step.items) * CAP_MULTIPLIER,
  };
  return { result: { premium }, policy };
};

const sumDamagePayouts = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, damage) => sum + damagePayout(damage, items), 0);

const assertDamagesWithinInsured = (
  damages: Damage[],
  items: Item[],
): void => {
  const insuredCounts = countByType(items);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, count] of damageCounts) {
    const insured = insuredCounts.get(type) ?? 0;
    if (insured === 0) {
      throw new Error(`Item not insured by policy: ${type}`);
    }
    if (count > insured) {
      throw new Error(`More damages than insured items for type: ${type}`);
    }
  }
};

const runClaim = (
  step: ClaimStep,
  policies: Policy[],
): { result: { payout: number; remainingCap: number }; policy: Policy } => {
  const policy = policies[step.policy];
  assertDamagesWithinInsured(step.incident.damages, policy.items);
  const rawPayout = sumDamagePayouts(step.incident.damages, policy.items);
  const payout = Math.min(roundPayoutInMHPCOsFavor(rawPayout), policy.remainingCap);
  const remainingCap = policy.remainingCap - payout;
  return {
    result: { payout, remainingCap },
    policy: { ...policy, remainingCap },
  };
};

export const runScenario = (scenario: Scenario): unknown => {
  const policies: Policy[] = [];
  const results = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUp = index > 0;
      const { result, policy } = runQuote(step, scenario.customer, isFollowUp);
      policies.push(policy);
      return result;
    }
    const { result, policy } = runClaim(step, policies);
    policies[step.policy] = policy;
    return result;
  });
  return { results };
};
