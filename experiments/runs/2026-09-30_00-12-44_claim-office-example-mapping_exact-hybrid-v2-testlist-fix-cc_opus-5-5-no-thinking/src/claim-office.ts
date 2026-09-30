export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteStep {
  op: "quote";
  items: Item[];
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: (QuoteStep | ClaimStep)[];
}

export interface QuoteResult {
  premium: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface ScenarioResult {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const priceListEntryOf = (type: string): PriceListEntry => {
  if (!Object.hasOwn(PRICE_LIST, type)) throw new Error(`Unknown item type: ${type}`);
  return PRICE_LIST[type];
};

const basePremiumOf = (item: Item): number => priceListEntryOf(item.type).basePremium;

const insuranceValueOf = (item: Item): number => priceListEntryOf(item.type).insuranceValue;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * priceListEntryOf(type).basePremium;

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

const countOfType = (items: Item[], type: string): number => items.filter((item) => item.type === type).length;

const mainItemsPremium = (items: Item[]): number =>
  sum(items.filter((item) => !isComponent(item)).map(basePremiumOf));

const componentsPremium = (items: Item[]): number =>
  sum(COMPONENT_TYPES.map((type) => componentGroupPremium(type, countOfType(items, type))));

const policyBasePremium = (items: Item[]): number => mainItemsPremium(items) + componentsPremium(items);

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;

const riskSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) + (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemRiskSurcharges = (items: Item[]): number =>
  sum(items.map((item) => percentOf(basePremiumOf(item), riskSurchargePercent(item))));

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;

const isLoyalCustomer = (yearsWithMHPCO: number): boolean => yearsWithMHPCO >= LOYALTY_YEARS;

const isFollowUpContract = (stepIndex: number): boolean => stepIndex > 0;

const discountPercent = (yearsWithMHPCO: number, isFollowUp: boolean): number =>
  (isLoyalCustomer(yearsWithMHPCO) ? LOYALTY_DISCOUNT_PERCENT : 0) + (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const policyBase = policyBasePremium(items);
  const firstInsuranceSurcharge = percentOf(policyBase, FIRST_INSURANCE_SURCHARGE_PERCENT);
  const discount = percentOf(policyBase, discountPercent(yearsWithMHPCO, isFollowUp));
  return Math.ceil(policyBase + itemRiskSurcharges(items) + firstInsuranceSurcharge - discount + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number => sum(items.map(insuranceValueOf));

const policyCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

const REDUCED_REIMBURSEMENT_ENCHANTMENT = 8;
const REDUCED_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;

const reimbursablePercent = (item: Item): number =>
  enchantmentOf(item) >= REDUCED_REIMBURSEMENT_ENCHANTMENT
    ? REDUCED_REIMBURSEMENT_PERCENT
    : FULL_REIMBURSEMENT_PERCENT;

const insuredItemOf = (policy: QuoteStep, itemType: string): Item => {
  const insured = policy.items.find((item) => item.type === itemType);
  if (!insured) throw new Error(`Damaged item is not insured by the policy: ${itemType}`);
  return insured;
};

const damagePayout = (damage: Damage, policy: QuoteStep): number =>
  percentOf(damage.amount, reimbursablePercent(insuredItemOf(policy, damage.itemType))) - DEDUCTIBLE;

const roundInMHPCOsFavour = Math.floor;

const damagedCountOf = (damages: Damage[], itemType: string): number =>
  damages.filter((damage) => damage.itemType === itemType).length;

const assertNoNegativeAmounts = (damages: Damage[]): void => {
  if (damages.some((damage) => damage.amount < 0)) throw new Error("Damage amounts must not be negative");
};

const assertDamagesCovered = (damages: Damage[], policy: QuoteStep): void => {
  for (const itemType of new Set(damages.map((damage) => damage.itemType))) {
    if (damagedCountOf(damages, itemType) > countOfType(policy.items, itemType)) {
      throw new Error(`More damaged ${itemType} entries than insured by the policy`);
    }
  }
};

const claimPayout = (damages: Damage[], policy: QuoteStep): number => {
  assertNoNegativeAmounts(damages);
  assertDamagesCovered(damages, policy);
  return roundInMHPCOsFavour(sum(damages.map((damage) => damagePayout(damage, policy))));
};

const processClaim = (step: ClaimStep, policy: QuoteStep, alreadyPaid: number): ClaimResult => {
  const availableCap = policyCap(policy.items) - alreadyPaid;
  const payout = Math.min(claimPayout(step.incident.damages, policy), availableCap);
  return { payout, remainingCap: availableCap - payout };
};

const processQuote = (step: QuoteStep, yearsWithMHPCO: number, isFollowUp: boolean): QuoteResult => ({
  premium: quotePremium(step.items, yearsWithMHPCO, isFollowUp),
});

const policyOf = (claim: ClaimStep, steps: Scenario["steps"]): QuoteStep => steps[claim.policy] as QuoteStep;

const settleClaim = (claim: ClaimStep, policy: QuoteStep, paidPerPolicy: Map<number, number>): ClaimResult => {
  const alreadyPaid = paidPerPolicy.get(claim.policy) ?? 0;
  const result = processClaim(claim, policy, alreadyPaid);
  paidPerPolicy.set(claim.policy, alreadyPaid + result.payout);
  return result;
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const paidPerPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      step.op === "quote"
        ? processQuote(step, scenario.customer.yearsWithMHPCO, isFollowUpContract(index))
        : settleClaim(step, policyOf(step, scenario.steps), paidPerPolicy),
    ),
  };
};
