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

export type Step = QuoteStep | ClaimStep;

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Scenario {
  customer: Customer;
  steps: Step[];
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

// Quote rules
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_PERCENT = 15;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];

// Claim rules
const DEDUCTIBLE = 100;
const HIGH_ENCHANTMENT_CLAIM_LEVEL = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;
const FULL_REIMBURSEMENT_PERCENT = 100;
const CAP_MULTIPLIER = 2;

const typePremium = (type: string, count: number): number => {
  if (COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE) return BLOCK_PREMIUM;
  return count * PRICE_LIST[type].basePremium;
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
};

const calculateBasePremium = (items: Item[]): number =>
  [...countByType(items)].reduce((total, [type, count]) => total + typePremium(type, count), 0);

const percentOf = (amount: number, percent: number): number => (amount * percent) / 100;

const isLoyalCustomer = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

const policyAdjustmentPercent = (customer: Customer, isFollowUp: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_PERCENT -
  (isLoyalCustomer(customer) ? LOYALTY_DISCOUNT_PERCENT : 0) -
  (isFollowUp ? FOLLOW_UP_DISCOUNT_PERCENT : 0);

const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentLevel(item) >= HIGH_ENCHANTMENT_LEVEL;

const itemSurchargePercent = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE_PERCENT : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0);

const itemSurcharge = (item: Item): number => percentOf(PRICE_LIST[item.type].basePremium, itemSurchargePercent(item));

const itemSurcharges = (items: Item[]): number => items.reduce((sum, item) => sum + itemSurcharge(item), 0);

const isKnownItemType = (type: string): boolean => Object.hasOwn(PRICE_LIST, type);

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) throw new Error(`Unknown item type: ${item.type}`);
  }
};

const quotePremium = (step: QuoteStep, customer: Customer, isFollowUp: boolean): number => {
  assertKnownItemTypes(step.items);
  const basePremium = calculateBasePremium(step.items);
  return Math.ceil(
    basePremium +
      itemSurcharges(step.items) +
      percentOf(basePremium, policyAdjustmentPercent(customer, isFollowUp)) +
      PROCESSING_FEE,
  );
};

const isFollowUpContract = (steps: Step[], stepIndex: number): boolean =>
  steps.slice(0, stepIndex).some((step) => step.op === "quote");

const reimbursementPercent = (item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_CLAIM_LEVEL ? HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT : FULL_REIMBURSEMENT_PERCENT;

const takeCoveredItem = (itemType: string, unclaimedItems: Item[]): Item => {
  const index = unclaimedItems.findIndex((candidate) => candidate.type === itemType);
  if (index === -1) throw new Error(`Damaged item not covered by policy: ${itemType}`);
  return unclaimedItems.splice(index, 1)[0];
};

const afterDeductible = (amount: number): number => Math.max(0, amount - DEDUCTIBLE);

const damagePayout = (damage: Damage, unclaimedItems: Item[]): number => {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  const item = takeCoveredItem(damage.itemType, unclaimedItems);
  return afterDeductible(percentOf(damage.amount, reimbursementPercent(item)));
};

const claimPayout = (step: ClaimStep, policyItems: Item[]): number => {
  const unclaimedItems = [...policyItems];
  return Math.floor(step.incident.damages.reduce((sum, damage) => sum + damagePayout(damage, unclaimedItems), 0));
};

const insuredItems = (steps: Step[], policy: number): Item[] => (steps[policy] as QuoteStep).items;

const coverageCap = (items: Item[]): number =>
  CAP_MULTIPLIER * items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);

const claimResult = (step: ClaimStep, steps: Step[], remainingCaps: Map<number, number>): ClaimResult => {
  const items = insuredItems(steps, step.policy);
  const capBefore = remainingCaps.get(step.policy) ?? coverageCap(items);
  const payout = Math.min(claimPayout(step, items), capBefore);
  const remainingCap = capBefore - payout;
  remainingCaps.set(step.policy, remainingCap);
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) =>
      step.op === "claim"
        ? claimResult(step, scenario.steps, remainingCaps)
        : { premium: quotePremium(step, scenario.customer, isFollowUpContract(scenario.steps, index)) },
    ),
  };
};
