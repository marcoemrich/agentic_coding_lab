type Item = { type?: string; material?: string; enchantment?: number; cursed?: boolean };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: { yearsWithMHPCO: number }; steps: Step[] };
type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type ScenarioOutcome = { results: (QuoteResult | ClaimResult)[] };

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};
const PROCESSING_FEE = 5;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_DISCOUNT = 15;

const sumOf = <T>(values: T[], valueOf: (value: T) => number): number =>
  values.reduce((sum, value) => sum + valueOf(value), 0);

const itemBasePremium = (item: Item): number => {
  const premium = BASE_PREMIUMS[item.type ?? ""];
  if (premium === undefined) throw new Error(`Unknown item type: ${item.type}`);
  return premium;
};

const countOfType = (items: Item[], type: string): number =>
  items.filter((item) => item.type === type).length;

const blockDiscount = (items: Item[]): number =>
  COMPONENT_TYPES.filter((componentType) => countOfType(items, componentType) === BLOCK_SIZE)
    .length * BLOCK_DISCOUNT;

const calculateBasePremium = (items: Item[]): number =>
  sumOf(items, itemBasePremium) - blockDiscount(items);

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const firstInsuranceSurcharge = (basePremium: number): number =>
  percentOf(basePremium, FIRST_INSURANCE_SURCHARGE_PERCENT);

const itemSurcharge = (
  items: Item[],
  appliesTo: (item: Item) => boolean,
  percent: number,
): number =>
  sumOf(items.filter(appliesTo), (item) => percentOf(itemBasePremium(item), percent));

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const curseSurcharge = (items: Item[]): number =>
  itemSurcharge(items, isCursed, CURSE_SURCHARGE_PERCENT);

const highEnchantmentSurcharge = (items: Item[]): number =>
  itemSurcharge(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_PERCENT);

const LOYALTY_MIN_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;

const loyaltyDiscount = (basePremium: number, yearsWithMHPCO: number): number =>
  yearsWithMHPCO >= LOYALTY_MIN_YEARS ? percentOf(basePremium, LOYALTY_DISCOUNT_PERCENT) : 0;

const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const followUpDiscount = (basePremium: number, previousContracts: number): number =>
  previousContracts > 0 ? percentOf(basePremium, FOLLOW_UP_DISCOUNT_PERCENT) : 0;

const quotePremium = (items: Item[], yearsWithMHPCO: number, previousContracts: number): number => {
  const basePremium = calculateBasePremium(items);
  return Math.ceil(
    basePremium +
      curseSurcharge(items) +
      highEnchantmentSurcharge(items) +
      firstInsuranceSurcharge(basePremium) -
      loyaltyDiscount(basePremium, yearsWithMHPCO) -
      followUpDiscount(basePremium, previousContracts) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const COVERAGE_CAP_MULTIPLIER = 2;

const itemInsuranceValue = (item: Item): number => INSURANCE_VALUES[item.type ?? ""];

const coverageCap = (items: Item[]): number =>
  COVERAGE_CAP_MULTIPLIER * sumOf(items, itemInsuranceValue);

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? percentOf(damage.amount, HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT)
    : damage.amount;

type DamagedItem = { damage: Damage; item: Item };

const assertValidDamageAmount = (damage: Damage): void => {
  if (damage.amount < 0) throw new Error(`Invalid damage amount: ${damage.amount}`);
};

const matchDamagesToInsuredItems = (damages: Damage[], policyItems: Item[]): DamagedItem[] => {
  const undamagedItems = [...policyItems];
  return damages.map((damage) => {
    assertValidDamageAmount(damage);
    const index = undamagedItems.findIndex((item) => item.type === damage.itemType);
    if (index === -1) throw new Error(`Damaged item not insured by policy: ${damage.itemType}`);
    const [item] = undamagedItems.splice(index, 1);
    return { damage, item };
  });
};

const damagePayout = ({ damage, item }: DamagedItem): number =>
  reimbursableAmount(damage, item) - DEDUCTIBLE;

const claimPayout = (claim: ClaimStep, policyItems: Item[]): number =>
  Math.floor(sumOf(matchDamagesToInsuredItems(claim.incident.damages, policyItems), damagePayout));

const settleClaim = (claim: ClaimStep, policyItems: Item[], availableCap: number): ClaimResult => {
  const payout = Math.min(claimPayout(claim, policyItems), availableCap);
  return { payout, remainingCap: availableCap - payout };
};

const insuredItemsOf = (steps: Step[], policy: number): Item[] =>
  (steps[policy] as QuoteStep).items;

const quotesBefore = (steps: Step[], index: number): number =>
  steps.slice(0, index).filter((step) => step.op === "quote").length;

const settleAgainstRemainingCap = (
  claim: ClaimStep,
  steps: Step[],
  remainingCaps: Map<number, number>,
): ClaimResult => {
  const policyItems = insuredItemsOf(steps, claim.policy);
  const availableCap = remainingCaps.get(claim.policy) ?? coverageCap(policyItems);
  const result = settleClaim(claim, policyItems, availableCap);
  remainingCaps.set(claim.policy, result.remainingCap);
  return result;
};

export const processScenario = (scenario: Scenario): ScenarioOutcome => {
  const { steps, customer } = scenario;
  const remainingCaps = new Map<number, number>();
  const results = steps.map((step, index) =>
    step.op === "claim"
      ? settleAgainstRemainingCap(step, steps, remainingCaps)
      : { premium: quotePremium(step.items, customer.yearsWithMHPCO, quotesBefore(steps, index)) },
  );
  return { results };
};
