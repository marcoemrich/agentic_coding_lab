type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number; previousContracts?: number };
type Scenario = { customer: Customer; steps: Step[] };

const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLIER = 2;
const PROCESSING_FEE = 5;
const INSURANCE_VALUE_TO_BASE_RATIO = 10;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const insuranceValueForItem = (item: Item): number =>
  baseForType(item.type) * INSURANCE_VALUE_TO_BASE_RATIO;

const insuranceSumForItems = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueForItem(item), 0);

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MIN_YEARS = 2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const baseForType = (type: string): number => BASE_PREMIUM_BY_TYPE[type] ?? 0;

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: Item): number =>
  (isCursed(item) ? CURSED_SURCHARGE_RATE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0);

const premiumForItem = (item: Item): number =>
  baseForType(item.type) * (1 + itemSurchargeRate(item));

const countItemsOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const premiumForComponentType = (items: Item[], type: string): number => {
  const count = countItemsOfType(items, type);
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * baseForType(type);
};

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const totalForItems = (items: Item[], priceForItem: (item: Item) => number): number => {
  const componentsTotal = COMPONENT_TYPES.reduce(
    (sum, type) => sum + premiumForComponentType(items, type),
    0,
  );
  const nonComponentsTotal = items
    .filter((item) => !isComponent(item))
    .reduce((sum, item) => sum + priceForItem(item), 0);
  return componentsTotal + nonComponentsTotal;
};

const itemsTotalWithItemSurcharges = (items: Item[]): number =>
  totalForItems(items, premiumForItem);

const itemsTotalBasePricesOnly = (items: Item[]): number =>
  totalForItems(items, (item) => baseForType(item.type));

const loyaltyRate = (customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_MIN_YEARS ? -LOYALTY_DISCOUNT_RATE : 0;

const firstInsuranceRate = (customer: Customer): number =>
  customer.previousContracts !== undefined ? FIRST_INSURANCE_SURCHARGE_RATE : 0;

const followUpRate = (customer: Customer): number =>
  (customer.previousContracts ?? 0) >= 1 ? -FOLLOW_UP_DISCOUNT_RATE : 0;

const policyAdjustmentRate = (customer: Customer): number =>
  loyaltyRate(customer) + firstInsuranceRate(customer) + followUpRate(customer);

const roundUpInMHPCOFavor = (value: number): number => Math.ceil(value);

const quotePremium = (items: Item[], customer: Customer): number => {
  const itemsTotal = itemsTotalWithItemSurcharges(items);
  const policyBase = itemsTotalBasePricesOnly(items);
  const policyAdjustment = policyBase * policyAdjustmentRate(customer);
  return roundUpInMHPCOFavor(itemsTotal + policyAdjustment + PROCESSING_FEE);
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

type PolicyState = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const findItemByType = (items: Item[], type: string): Item | undefined =>
  items.find((item) => item.type === type);

const qualifiesForHighEnchantmentClaim = (item: Item | undefined): boolean =>
  item !== undefined && enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursementForDamage = (damage: Damage, items: Item[]): number => {
  const item = findItemByType(items, damage.itemType);
  const rate = qualifiesForHighEnchantmentClaim(item)
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;
  return damage.amount * rate;
};

const payoutForDamage = (damage: Damage, items: Item[]): number =>
  reimbursementForDamage(damage, items) - DEDUCTIBLE_PER_DAMAGE;

const payoutForClaim = (incident: Incident, items: Item[]): number =>
  incident.damages.reduce((sum, damage) => sum + payoutForDamage(damage, items), 0);

const openPolicy = (items: Item[]): PolicyState => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSumForItems(items),
});

const isKnownItemType = (type: string): boolean => type in BASE_PREMIUM_BY_TYPE;

const validateItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownItemType(item.type));
  if (unknown !== undefined) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

const handleQuote = (
  step: QuoteStep,
  customer: Customer,
  policies: PolicyState[],
): QuoteResult => {
  const { items } = step;
  validateItemTypes(items);
  policies.push(openPolicy(items));
  return { premium: quotePremium(items, customer) };
};

const damageRefersToItemNotInPolicy = (damage: Damage, items: Item[]): boolean =>
  findItemByType(items, damage.itemType) === undefined;

const damageHasNegativeAmount = (damage: Damage): boolean => damage.amount < 0;

const validateDamagesAgainstPolicy = (incident: Incident, items: Item[]): void => {
  for (const damage of incident.damages) {
    if (damageRefersToItemNotInPolicy(damage, items)) {
      throw new Error(`Damaged item not in policy: ${damage.itemType}`);
    }
    if (damageHasNegativeAmount(damage)) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
  }
};

const applyClaimToPolicy = (policy: PolicyState, incident: Incident): ClaimResult => {
  validateDamagesAgainstPolicy(incident, policy.items);
  const requestedPayout = payoutForClaim(incident, policy.items);
  const payout = Math.min(requestedPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const handleClaim = (step: ClaimStep, policies: PolicyState[]): ClaimResult =>
  applyClaimToPolicy(policies[step.policy], step.incident);

export const runScenario = (input: unknown): { results: StepResult[] } => {
  const { customer, steps } = input as Scenario;
  const policies: PolicyState[] = [];
  const results: StepResult[] = steps.map((step) =>
    step.op === "quote"
      ? handleQuote(step, customer, policies)
      : handleClaim(step, policies),
  );
  return { results };
};
