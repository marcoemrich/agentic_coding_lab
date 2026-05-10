// claim-office.ts

const BASE_PREMIUMS: Record<string, number> = {
  Sword: 100,
  Amulet: 60,
  Staff: 80,
  Potion: 40,
  Rune: 25,
  Moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  Sword: 1000,
  Amulet: 600,
  Staff: 800,
  Potion: 400,
  Rune: 250,
  Moonstone: 250,
};

const FIRST_INSURANCE_PERCENT = 110;
const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;

type Item = { type: string; cursed?: boolean; enchantment?: number };
type Customer = { name: string; years: number; contracts: number };

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const COMPONENT_TYPES = new Set(["Rune", "Moonstone"]);
const BLOCK_OF_3_BASE_PREMIUM = 60;
const BLOCK_OF_3_SIZE = 3;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE = 0.5;

const enchantmentLevelOf = (item: Item | undefined): number =>
  item?.enchantment ?? 0;

const isBlockOf3Components = (type: string, count: number): boolean =>
  COMPONENT_TYPES.has(type) && count === BLOCK_OF_3_SIZE;

const baseForGroup = (type: string, count: number): number =>
  isBlockOf3Components(type, count)
    ? BLOCK_OF_3_BASE_PREMIUM
    : BASE_PREMIUMS[type] * count;

const countBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> =>
  items.reduce<Record<string, number>>((counts, item) => {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
    return counts;
  }, {});

const baseTotalFor = (items: Item[]): number =>
  Object.entries(countBy(items, (item) => item.type))
    .reduce((total, [type, count]) => total + baseForGroup(type, count), 0);

const surchargeOnBase = (item: Item, applies: boolean, rate: number): number =>
  applies ? BASE_PREMIUMS[item.type] * rate : 0;

const cursedSurchargeFor = (item: Item): number =>
  surchargeOnBase(item, item.cursed === true, CURSED_SURCHARGE_RATE);

const highEnchantmentSurchargeFor = (item: Item): number =>
  surchargeOnBase(item, enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_THRESHOLD, HIGH_ENCHANTMENT_SURCHARGE_RATE);

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce((total, item) => total + cursedSurchargeFor(item) + highEnchantmentSurchargeFor(item), 0);

const loyaltyDiscountFor = (customer: Customer, baseTotal: number): number =>
  customer.years >= LOYALTY_YEARS_THRESHOLD ? baseTotal * LOYALTY_DISCOUNT_RATE : 0;

const applyFirstInsurance = (baseTotal: number): number =>
  (baseTotal * FIRST_INSURANCE_PERCENT) / 100;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const followUpDiscountFor = (isFollowUp: boolean, baseTotal: number): number =>
  isFollowUp ? baseTotal * FOLLOW_UP_DISCOUNT_RATE : 0;

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const baseTotal = baseTotalFor(items);
  const policyBase = applyFirstInsurance(baseTotal);
  const itemSurcharges = itemSurchargesFor(items);
  const loyaltyDiscount = loyaltyDiscountFor(customer, baseTotal);
  const followUpDiscount = followUpDiscountFor(isFollowUp, baseTotal);
  return Math.ceil(policyBase + itemSurcharges - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
};

type Policy = { items: Item[]; cap: number; remainingCap: number };
type Damage = { itemType: string; amount: number };
type ClaimStep = { type: "claim"; policy: number; incident: { damages: Damage[] } };
type QuoteStep = { type: "quote"; items: Item[] };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type ClaimResult = { payout: number; remainingCap: number };
type QuoteResult = { premium: number };

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const payoutForDamage = (damage: Damage, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType);
  const isHighEnchantmentClaim = enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
  const reimbursable = isHighEnchantmentClaim
    ? damage.amount * HIGH_ENCHANTMENT_CLAIM_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE_PER_DAMAGE);
};

const totalPayoutFor = (damages: Damage[], items: Item[]): number =>
  Math.floor(damages.reduce((total, damage) => total + payoutForDamage(damage, items), 0));

const clampToCap = (amount: number, remainingCap: number): number =>
  Math.min(amount, remainingCap);

const validateDamagesMatchPolicy = (damages: Damage[], items: Item[]): void => {
  const policyCounts = countBy(items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, count] of Object.entries(damageCounts)) {
    if (count > (policyCounts[itemType] ?? 0)) {
      throw new Error(`Damage refers to item not covered by policy: ${itemType}`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("Negative damage amount");
  }
};

const validateClaim = (damages: Damage[], items: Item[]): void => {
  validateDamageAmounts(damages);
  validateDamagesMatchPolicy(damages, items);
};

const processClaim = (step: ClaimStep, policies: Policy[]): ClaimResult => {
  const policy = policies[step.policy];
  validateClaim(step.incident.damages, policy.items);
  const payout = clampToCap(totalPayoutFor(step.incident.damages, policy.items), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const newPolicyFor = (items: Item[]): Policy => {
  const cap = CAP_MULTIPLIER * insuranceSumFor(items);
  return { items, cap, remainingCap: cap };
};

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUMS;

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const processQuote = (step: QuoteStep, customer: Customer, isFollowUp: boolean, policies: Policy[]): QuoteResult => {
  validateItemTypes(step.items);
  policies.push(newPolicyFor(step.items));
  return { premium: quotePremium(step.items, customer, isFollowUp) };
};

export function processScenario(scenario: any): unknown {
  const policies: Policy[] = [];
  const results = (scenario.steps as Step[]).map((step, index) =>
    step.type === "claim"
      ? processClaim(step, policies)
      : processQuote(step, scenario.customer, index > 0, policies),
  );
  return { results };
}
