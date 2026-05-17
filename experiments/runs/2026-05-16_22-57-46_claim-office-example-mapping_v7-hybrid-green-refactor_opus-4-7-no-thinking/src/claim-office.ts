const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Customer = { yearsWithMHPCO: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type ItemKind = {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
};

const ITEM_CATALOG: Record<string, ItemKind> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const BLOCK_PRICE = 60;
const BLOCK_SIZE = 3;

const countByType = (items: Item[]): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    counts[item.type] = (counts[item.type] ?? 0) + 1;
    return counts;
  }, {});

const premiumForTypeGroup = (type: string, count: number): number => {
  const kind = ITEM_CATALOG[type];
  const formsBlock = kind.isComponent && count === BLOCK_SIZE;
  return formsBlock ? BLOCK_PRICE : kind.basePremium * count;
};

const policyBaseFor = (items: Item[]): number =>
  Object.entries(countByType(items)).reduce(
    (total, [type, count]) => total + premiumForTypeGroup(type, count),
    0,
  );

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeFor = (item: Item): number => {
  const basePremium = ITEM_CATALOG[item.type].basePremium;
  const curseSurcharge = isCursed(item) ? basePremium * CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentSurcharge = isHighlyEnchanted(item)
    ? basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curseSurcharge + highEnchantmentSurcharge;
};

const perItemSurchargesFor = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurchargeFor(item), 0);

const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const percentOf = (amount: number, percent: number): number =>
  (amount * percent) / 100;

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const percentOfIf = (amount: number, percent: number, condition: boolean): number =>
  condition ? percentOf(amount, percent) : 0;

const applyPolicyModifiers = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const firstInsuranceSurcharge = percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const loyaltyDiscount = percentOfIf(policyBase, LOYALTY_DISCOUNT_PERCENT, isLoyalCustomer(customer));
  const followUpDiscount = percentOfIf(policyBase, FOLLOW_UP_DISCOUNT_PERCENT, isFollowUp);
  return policyBase + firstInsuranceSurcharge - loyaltyDiscount - followUpDiscount;
};

const premiumFor = (items: Item[], customer: Customer, isFollowUp: boolean): number =>
  Math.ceil(
    applyPolicyModifiers(policyBaseFor(items), customer, isFollowUp) +
      perItemSurchargesFor(items) +
      PROCESSING_FEE,
  );

const runQuoteStep = (
  step: QuoteStep,
  customer: Customer,
  isFollowUp: boolean,
): { premium: number } => ({
  premium: premiumFor(step.items, customer, isFollowUp),
});

const DEDUCTIBLE = 100;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((total, item) => total + ITEM_CATALOG[item.type].insuranceValue, 0);

type PolicyState = { remainingCap: number; items: Item[] };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const findItemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

const reimbursableAmount = (damage: Damage, items: Item[]): number => {
  const item = findItemByType(items, damage.itemType);
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const payoutForDamage = (damage: Damage, items: Item[]): number =>
  Math.max(0, reimbursableAmount(damage, items) - DEDUCTIBLE);

const validateDamages = (damages: Damage[], items: Item[]): void => {
  damages.forEach((damage) => {
    if (!findItemByType(items, damage.itemType)) {
      throw new Error(`Item ${damage.itemType} not in policy`);
    }
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount`);
    }
  });
};

const totalPayoutWithinCap = (damages: Damage[], items: Item[], cap: number): number =>
  damages.reduce((total, damage) => {
    const remainingRoom = cap - total;
    return total + Math.min(payoutForDamage(damage, items), remainingRoom);
  }, 0);

const runClaimStep = (
  step: ClaimStep,
  policies: PolicyState[],
): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy];
  validateDamages(step.incident.damages, policy.items);
  const payout = totalPayoutWithinCap(step.incident.damages, policy.items, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: PolicyState[] = [];
  let quoteCount = 0;
  const results = scenario.steps.map((step) => {
    if (step.op === "claim") {
      return runClaimStep(step, policies);
    }
    const isFollowUp = quoteCount > 0;
    quoteCount++;
    policies.push({ remainingCap: insuranceSumFor(step.items) * 2, items: step.items });
    return runQuoteStep(step, scenario.customer, isFollowUp);
  });
  return { results };
};
