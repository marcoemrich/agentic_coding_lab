const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

type ItemTypeConfig = { basePremium: number; insuranceValue: number };

const ITEM_TYPE_CONFIG: Record<string, ItemTypeConfig> = {
  sword: { basePremium: 100, insuranceValue: 1000 },
  amulet: { basePremium: 60, insuranceValue: 600 },
  staff: { basePremium: 80, insuranceValue: 800 },
  potion: { basePremium: 40, insuranceValue: 400 },
  rune: { basePremium: 25, insuranceValue: 250 },
  moonstone: { basePremium: 25, insuranceValue: 250 },
};

type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const sumBy = <T>(items: T[], valueOf: (item: T) => number): number =>
  items.reduce((sum, item) => sum + valueOf(item), 0);

const basePremiumOf = (item: Item): number => ITEM_TYPE_CONFIG[item.type].basePremium;

const enchantmentLevelOf = (item: Item): number => item.enchantment ?? 0;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const sumBasePremiums = (items: Item[]): number => sumBy(items, basePremiumOf);

const componentGroupSubtotalOf = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : sumBasePremiums(group);

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type);
    if (group) {
      group.push(item);
    } else {
      groups.set(item.type, [item]);
    }
  }
  return [...groups.values()];
};

const componentSubtotalOf = (components: Item[]): number =>
  sumBy(groupByType(components), componentGroupSubtotalOf);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const policyBaseOf = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const standaloneItems = items.filter((item) => !isComponent(item));
  return sumBasePremiums(standaloneItems) + componentSubtotalOf(components);
};

const firstInsuranceSurchargeOf = (policyBase: number): number =>
  policyBase * FIRST_INSURANCE_SURCHARGE_RATE;

const cursedSurchargeOf = (item: Item): number =>
  item.cursed ? basePremiumOf(item) * CURSED_SURCHARGE_RATE : 0;

const highEnchantmentSurchargeOf = (item: Item): number =>
  enchantmentLevelOf(item) >= HIGH_ENCHANTMENT_THRESHOLD
    ? basePremiumOf(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const itemSurchargeOf = (item: Item): number =>
  cursedSurchargeOf(item) + highEnchantmentSurchargeOf(item);

const itemSurchargesOf = (items: Item[]): number => sumBy(items, itemSurchargeOf);

const roundUpInMHPCOFavor = (amount: number): number => Math.ceil(amount);

const loyaltyDiscountOf = (policyBase: number, customer: Customer): number =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;

const followUpDiscountOf = (policyBase: number, isFollowUp: boolean): number =>
  isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;

const policySurchargesOf = (policyBase: number): number =>
  firstInsuranceSurchargeOf(policyBase);

const policyDiscountsOf = (
  policyBase: number,
  customer: Customer,
  isFollowUp: boolean,
): number =>
  loyaltyDiscountOf(policyBase, customer) + followUpDiscountOf(policyBase, isFollowUp);

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const policyBase = policyBaseOf(items);
  const surcharges = itemSurchargesOf(items) + policySurchargesOf(policyBase);
  const discounts = policyDiscountsOf(policyBase, customer, isFollowUp);
  const rawPremium = policyBase + surcharges - discounts + PROCESSING_FEE;
  return roundUpInMHPCOFavor(rawPremium);
};

const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

const insuranceValueOf = (item: Item): number => ITEM_TYPE_CONFIG[item.type].insuranceValue;

const insuranceSumOf = (items: Item[]): number => sumBy(items, insuranceValueOf);

const reimbursableDamageOf = (damage: Damage, insuredItem: Item): number =>
  enchantmentLevelOf(insuredItem) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const damagePayoutOf = (damage: Damage, insuredItem: Item): number =>
  reimbursableDamageOf(damage, insuredItem) - DEDUCTIBLE;

const findInsuredItem = (itemType: string, items: Item[]): Item =>
  items.find((item) => item.type === itemType) as Item;

const incidentPayoutOf = (incident: Incident, policyItems: Item[]): number =>
  sumBy(incident.damages, (damage) =>
    damagePayoutOf(damage, findInsuredItem(damage.itemType, policyItems)),
  );

const policyCapOf = (policyItems: Item[]): number =>
  insuranceSumOf(policyItems) * CAP_MULTIPLIER;

const originatingQuoteOf = (claimStep: ClaimStep, scenario: Scenario): QuoteStep =>
  scenario.steps[claimStep.policy] as QuoteStep;

const processQuote = (
  quoteStep: QuoteStep,
  scenario: Scenario,
  stepIndex: number,
): QuoteResult => ({
  premium: quotePremium(quoteStep.items, scenario.customer, isFollowUpContract(stepIndex)),
});

const processClaim = (
  claimStep: ClaimStep,
  scenario: Scenario,
  priorPayout: number,
): ClaimResult => {
  const policyItems = originatingQuoteOf(claimStep, scenario).items;
  const availableCap = policyCapOf(policyItems) - priorPayout;
  const desiredPayout = incidentPayoutOf(claimStep.incident, policyItems);
  const payout = Math.min(desiredPayout, availableCap);
  return { payout, remainingCap: availableCap - payout };
};

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const payoutsByPolicy = new Map<number, number>();
  const results: StepResult[] = [];
  for (const [index, step] of scenario.steps.entries()) {
    if (step.op === "quote") {
      results.push(processQuote(step, scenario, index));
      continue;
    }
    const priorPayout = payoutsByPolicy.get(step.policy) ?? 0;
    const claimResult = processClaim(step, scenario, priorPayout);
    payoutsByPolicy.set(step.policy, priorPayout + claimResult.payout);
    results.push(claimResult);
  }
  return { results };
};
