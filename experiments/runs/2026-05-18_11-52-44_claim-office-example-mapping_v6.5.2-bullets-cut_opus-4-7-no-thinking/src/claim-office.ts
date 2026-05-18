type Item = { type: string; cursed?: boolean; enchantment?: number };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_INSURANCE_VALUE = 250;

type Tariff = { base: number; insurance: number };

const MAIN_ITEM_TARIFF: Record<string, Tariff> = {
  sword: { base: 100, insurance: 1000 },
  amulet: { base: 60, insurance: 600 },
};

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isMainItem = (item: Item): boolean => item.type in MAIN_ITEM_TARIFF;

const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEM_TARIFF || KNOWN_COMPONENT_TYPES.has(type);

const assertNoneMatch = <T>(items: T[], predicate: (item: T) => boolean, message: (item: T) => string): void => {
  const offender = items.find(predicate);
  if (offender) throw new Error(message(offender));
};

const assertKnownItemTypes = (items: Item[]): void =>
  assertNoneMatch(
    items,
    (item) => !isKnownItemType(item.type),
    (item) => `Unknown item type: ${item.type}`,
  );

const itemInsuranceValue = (item: Item): number =>
  MAIN_ITEM_TARIFF[item.type]?.insurance ?? COMPONENT_INSURANCE_VALUE;

const ceilWithEpsilon = (n: number): number => Math.ceil(Math.round(n * 1e8) / 1e8);

const sumBy = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const rateAmount = (base: number, applies: boolean, rate: number): number =>
  applies ? base * rate : 0;

const enchantmentLevel = (item: Item | undefined): number => item?.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const mainItemBase = (item: Item): number => MAIN_ITEM_TARIFF[item.type].base;

const mainItemSurcharges = (item: Item): number => {
  const base = mainItemBase(item);
  return (
    rateAmount(base, item.cursed === true, CURSE_SURCHARGE) +
    rateAmount(base, isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE)
  );
};

const componentGroupBase = (count: number): number => {
  const blocks = Math.floor(count / COMPONENT_BLOCK_SIZE);
  const leftover = count % COMPONENT_BLOCK_SIZE;
  return blocks * COMPONENT_BLOCK_BASE_PREMIUM + leftover * COMPONENT_BASE_PREMIUM;
};

const countByKey = <T>(items: T[], keyOf: (item: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(keyOf(item), (counts.get(keyOf(item)) ?? 0) + 1);
  }
  return counts;
};

const itemTypeOf = (item: Item): string => item.type;
const damageItemTypeOf = (damage: Damage): string => damage.itemType;

const sumComponentGroupBases = (components: Item[]): number =>
  sumBy([...countByKey(components, itemTypeOf).values()], componentGroupBase);

const partitionItems = (items: Item[]): { mainItems: Item[]; components: Item[] } => ({
  mainItems: items.filter(isMainItem),
  components: items.filter((item) => !isMainItem(item)),
});

const sumMainItemBases = (mainItems: Item[]): number => sumBy(mainItems, mainItemBase);

const sumMainItemSurcharges = (mainItems: Item[]): number => sumBy(mainItems, mainItemSurcharges);

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const totalDiscount = (policyBase: number, customer: Customer, isFollowUp: boolean): number =>
  rateAmount(policyBase, isLoyalCustomer(customer), LOYALTY_DISCOUNT) +
  rateAmount(policyBase, isFollowUp, FOLLOWUP_DISCOUNT);

const priceQuote = (step: QuoteStep, customer: Customer, isFollowUp: boolean): { premium: number } => {
  assertKnownItemTypes(step.items);
  const { mainItems, components } = partitionItems(step.items);
  const policyBase = sumMainItemBases(mainItems) + sumComponentGroupBases(components);
  const surcharges = sumMainItemSurcharges(mainItems);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const discounts = totalDiscount(policyBase, customer, isFollowUp);
  return {
    premium: ceilWithEpsilon(policyBase + surcharges + firstInsurance - discounts + PROCESSING_FEE),
  };
};

const countQuotesBefore = (steps: Step[], index: number): number =>
  steps.slice(0, index).filter((s) => s.op === "quote").length;

const insuranceSumOf = (step: QuoteStep): number => sumBy(step.items, itemInsuranceValue);

const findInsuredItem = (policyStep: QuoteStep, itemType: string): Item | undefined =>
  policyStep.items.find((item) => item.type === itemType);

const reimbursementRate = (item: Item | undefined): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : 1;

const damagePayout = (damage: Damage, policyStep: QuoteStep): number => {
  const item = findInsuredItem(policyStep, damage.itemType);
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
};

const totalPayout = (damages: Damage[], policyStep: QuoteStep): number =>
  sumBy(damages, (d) => damagePayout(d, policyStep));

const initialCap = (policyStep: QuoteStep): number =>
  CAP_MULTIPLIER * insuranceSumOf(policyStep);

const assertDamagesInPolicy = (damages: Damage[], policyStep: QuoteStep): void =>
  assertNoneMatch(
    damages,
    (d) => !findInsuredItem(policyStep, d.itemType),
    (d) => `Damage references item not in policy: ${d.itemType}`,
  );

const assertNonNegativeDamages = (damages: Damage[]): void =>
  assertNoneMatch(
    damages,
    (d) => d.amount < 0,
    (d) => `Damage amount must be non-negative: ${d.amount}`,
  );

const assertDamageCountsWithinPolicy = (damages: Damage[], policyStep: QuoteStep): void => {
  const insured = countByKey(policyStep.items, itemTypeOf);
  const damaged = countByKey(damages, damageItemTypeOf);
  for (const [itemType, count] of damaged) {
    if (count > (insured.get(itemType) ?? 0)) {
      throw new Error(`More damage entries for ${itemType} than items insured`);
    }
  }
};

const validateClaim = (damages: Damage[], policyStep: QuoteStep): void => {
  assertNonNegativeDamages(damages);
  assertDamagesInPolicy(damages, policyStep);
  assertDamageCountsWithinPolicy(damages, policyStep);
};

const processClaim = (
  step: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): { payout: number; remainingCap: number } => {
  const policyStep = steps[step.policy] as QuoteStep;
  validateClaim(step.incident.damages, policyStep);
  const availableCap = remainingCaps.get(step.policy) ?? initialCap(policyStep);
  const requestedPayout = totalPayout(step.incident.damages, policyStep);
  const payout = Math.min(requestedPayout, availableCap);
  const remainingCap = availableCap - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): { results: unknown[] } => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, i) =>
      step.op === "quote"
        ? priceQuote(step, scenario.customer, countQuotesBefore(scenario.steps, i) > 0)
        : processClaim(step, scenario.steps, remainingCaps),
    ),
  };
};
