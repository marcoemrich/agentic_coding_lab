export interface Customer {
  yearsWithMHPCO: number;
}

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

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

export type Step = QuoteStep | ClaimStep;

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

export interface ScenarioResults {
  results: (QuoteResult | ClaimResult)[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

interface ItemTypeSpec {
  basePremium: number;
  insuranceValue: number;
  isComponent: boolean;
}

const ITEM_TYPES: Record<string, ItemTypeSpec> = {
  sword: { basePremium: 100, insuranceValue: 1000, isComponent: false },
  amulet: { basePremium: 60, insuranceValue: 600, isComponent: false },
  staff: { basePremium: 80, insuranceValue: 800, isComponent: false },
  potion: { basePremium: 40, insuranceValue: 400, isComponent: false },
  rune: { basePremium: 25, insuranceValue: 250, isComponent: true },
  moonstone: { basePremium: 25, insuranceValue: 250, isComponent: true },
};

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const itemTypeSpecFor = (type: string): ItemTypeSpec => {
  const spec = ITEM_TYPES[type];
  if (spec === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return spec;
};

const isComponentType = (type: string): boolean => itemTypeSpecFor(type).isComponent;

const basePremiumForType = (type: string): number => itemTypeSpecFor(type).basePremium;

const countItemsByType = (items: Item[]): Map<string, number> =>
  items.reduce(
    (counts, item) => counts.set(item.type, (counts.get(item.type) ?? 0) + 1),
    new Map<string, number>(),
  );

const formsBlock = (type: string, count: number): boolean =>
  isComponentType(type) && count === BLOCK_SIZE;

const basePremiumForSameTypeItems = (type: string, count: number): number =>
  formsBlock(type, count) ? BLOCK_PREMIUM : count * basePremiumForType(type);

const basePremiumFor = (items: Item[]): number =>
  [...countItemsByType(items)].reduce(
    (total, [type, count]) => total + basePremiumForSameTypeItems(type, count),
    0,
  );

// MHPCO always rounds to whole gold in its own favour:
// amounts the customer pays go up, amounts MHPCO pays out go down.
const amountOwedToMHPCO = (amount: number): number => Math.ceil(amount);
const amountOwedByMHPCO = (amount: number): number => Math.floor(amount);

const isCursed = (item: Item): boolean => item.cursed === true;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;

// A rate applies only when its condition is met; rates then simply add up.
const rateIf = (applies: boolean, rate: number): number => (applies ? rate : 0);

const itemSurchargeRateFor = (item: Item): number =>
  rateIf(isCursed(item), CURSE_SURCHARGE_RATE) +
  rateIf(isHighlyEnchanted(item), HIGH_ENCHANTMENT_SURCHARGE_RATE);

const itemSurchargesFor = (items: Item[]): number =>
  items.reduce(
    (sum, item) => sum + basePremiumForType(item.type) * itemSurchargeRateFor(item),
    0,
  );

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS;

const policyWideRateFor = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE_RATE -
  rateIf(isLoyalCustomer(customer), LOYALTY_DISCOUNT_RATE) -
  rateIf(isFollowUpContract, FOLLOW_UP_CONTRACT_DISCOUNT_RATE);

const quotedPremiumFor = (
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number => {
  const basePremium = basePremiumFor(items);
  return amountOwedToMHPCO(
    basePremium +
      itemSurchargesFor(items) +
      basePremium * policyWideRateFor(customer, isFollowUpContract) +
      PROCESSING_FEE,
  );
};

const DEDUCTIBLE = 100;
const FRAGILE_ENCHANTMENT_LEVEL = 8;
const FRAGILE_REIMBURSEMENT_RATE = 0.5;

const isFragile = (item: Item): boolean =>
  enchantmentOf(item) >= FRAGILE_ENCHANTMENT_LEVEL;

const FULL_REIMBURSEMENT_RATE = 1;

const reimbursementRateFor = (item: Item): number =>
  isFragile(item) ? FRAGILE_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;

// A damage can only ever destroy value, never create it.
const acceptedAmountOf = (damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must not be negative: ${damage.amount}`);
  }
  return damage.amount;
};

const payoutForDamage = (damage: Damage, insuredItem: Item): number =>
  acceptedAmountOf(damage) * reimbursementRateFor(insuredItem) - DEDUCTIBLE;

// Each damage is settled against a distinct insured item, which is then
// removed from the pool so a second damage cannot claim the same item twice.
const takeInsuredItemFor = (damage: Damage, unclaimedItems: Item[]): Item => {
  const index = unclaimedItems.findIndex((item) => item.type === damage.itemType);
  if (index === -1) {
    throw new Error(`No unclaimed insured item for damaged type: ${damage.itemType}`);
  }
  return unclaimedItems.splice(index, 1)[0];
};

const claimedPayoutFor = (incident: Incident, insuredItems: Item[]): number => {
  const unclaimedItems = [...insuredItems];
  return incident.damages.reduce(
    (payout, damage) =>
      payout + payoutForDamage(damage, takeInsuredItemFor(damage, unclaimedItems)),
    0,
  );
};

const CAP_MULTIPLIER = 2;

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemTypeSpecFor(item.type).insuranceValue, 0);

const capFor = (items: Item[]): number => insuranceSumFor(items) * CAP_MULTIPLIER;

interface Policy {
  insuredItems: Item[];
  remainingCap: number;
}

type PolicyRegister = Map<number, Policy>;

const NO_POLICY: Policy = { insuredItems: [], remainingCap: 0 };

const policyIn = (register: PolicyRegister, policyNumber: number): Policy =>
  register.get(policyNumber) ?? NO_POLICY;

// A contract is a follow-up when the customer already holds a policy with MHPCO.
const holdsAnyPolicy = (register: PolicyRegister): boolean => register.size > 0;

const openPolicy = (
  step: QuoteStep,
  policyNumber: number,
  customer: Customer,
  register: PolicyRegister,
): QuoteResult => {
  const isFollowUpContract = holdsAnyPolicy(register);
  register.set(policyNumber, {
    insuredItems: step.items,
    remainingCap: capFor(step.items),
  });
  return { premium: quotedPremiumFor(step.items, customer, isFollowUpContract) };
};

const settleClaim = (step: ClaimStep, register: PolicyRegister): ClaimResult => {
  const policy = policyIn(register, step.policy);
  const claimedPayout = claimedPayoutFor(step.incident, policy.insuredItems);
  const payout = amountOwedByMHPCO(Math.min(claimedPayout, policy.remainingCap));
  const remainingCap = policy.remainingCap - payout;
  register.set(step.policy, { ...policy, remainingCap });
  return { payout, remainingCap };
};

export const runScenario = (scenario: Scenario): ScenarioResults => {
  const register: PolicyRegister = new Map();
  return {
    // A policy is identified by the index of the step that opened it.
    results: scenario.steps.map((step, stepIndex) =>
      step.op === "quote"
        ? openPolicy(step, stepIndex, scenario.customer, register)
        : settleClaim(step, register),
    ),
  };
};
