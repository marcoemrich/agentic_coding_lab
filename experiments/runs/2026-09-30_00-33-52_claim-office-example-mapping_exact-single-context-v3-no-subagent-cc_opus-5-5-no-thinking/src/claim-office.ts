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

export type StepResult = QuoteResult | ClaimResult;

export interface ScenarioOutput {
  results: StepResult[];
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
  isComponent: boolean;
}

const COMPONENT: PriceListEntry = { insuranceValue: 250, basePremium: 25, isComponent: true };

const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100, isComponent: false },
  amulet: { insuranceValue: 600, basePremium: 60, isComponent: false },
  staff: { insuranceValue: 800, basePremium: 80, isComponent: false },
  potion: { insuranceValue: 400, basePremium: 40, isComponent: false },
  rune: COMPONENT,
  moonstone: COMPONENT,
};

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isKnownType = (type: string): boolean => type in PRICE_LIST;

const assertKnownItems = (items: Item[]): void => {
  const unknown = items.find((item) => !isKnownType(item.type));
  if (unknown) throw new Error(`Unknown item type: ${unknown.type}`);
};

const sum = (amounts: number[]): number => amounts.reduce((total, amount) => total + amount, 0);

const basePremiumForTypeGroup = (type: string, count: number): number => {
  const { basePremium, isComponent } = PRICE_LIST[type];
  if (isComponent && count === BLOCK_SIZE) return BLOCK_BASE_PREMIUM;
  return count * basePremium;
};

const policyBasePremium = (items: Item[]): number => {
  const types = [...new Set(items.map((item) => item.type))];
  return sum(types.map((type) => basePremiumForTypeGroup(type, items.filter((item) => item.type === type).length)));
};

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const isHighlyEnchanted = (item: Item): boolean => enchantmentOf(item) >= HIGH_ENCHANTMENT_LEVEL;

const isLongStanding = (customer: Customer): boolean => customer.yearsWithMHPCO >= LOYALTY_YEARS;

const itemRiskSurcharge = (item: Item): number => {
  const itemBase = PRICE_LIST[item.type].basePremium;
  const curse = item.cursed ? itemBase * CURSE_SURCHARGE : 0;
  const highEnchantment = isHighlyEnchanted(item) ? itemBase * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnchantment;
};

// Rounding is always in the MHPCO's favor.
const roundPremiumUp = (amount: number): number => Math.ceil(amount);
const roundPayoutDown = (amount: number): number => Math.floor(amount);

const policyModifiers = (policyBase: number, customer: Customer, isFollowUp: boolean): number => {
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyalty = isLongStanding(customer) ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? policyBase * FOLLOW_UP_DISCOUNT : 0;
  return firstInsurance - loyalty - followUp;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  assertKnownItems(items);
  const policyBase = policyBasePremium(items);
  const riskSurcharges = sum(items.map(itemRiskSurcharge));
  return roundPremiumUp(policyBase + riskSurcharges + policyModifiers(policyBase, customer, isFollowUp) + PROCESSING_FEE);
};

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  enchantmentOf(item) >= HALF_REIMBURSEMENT_ENCHANTMENT_LEVEL ? damage.amount * HALF_REIMBURSEMENT_RATE : damage.amount;

const assertValidAmount = (damage: Damage): void => {
  if (damage.amount < 0) throw new Error(`Damage amount must not be negative: ${damage.amount}`);
};

const damagePayout = (damage: Damage, item: Item): number => reimbursableAmount(damage, item) - DEDUCTIBLE;

// Each damage entry is matched to its own insured item; removes the match from the pool.
const takeInsuredItem = (unclaimedItems: Item[], itemType: string): Item => {
  const index = unclaimedItems.findIndex((insured) => insured.type === itemType);
  if (index < 0) throw new Error(`Damaged item is not insured by this policy: ${itemType}`);
  return unclaimedItems.splice(index, 1)[0];
};

const claimPayout = (step: ClaimStep, insuredItems: Item[]): number => {
  const unclaimedItems = [...insuredItems];
  const payouts = step.incident.damages.map((damage) => {
    assertValidAmount(damage);
    return damagePayout(damage, takeInsuredItem(unclaimedItems, damage.itemType));
  });
  return roundPayoutDown(sum(payouts));
};

const CAP_MULTIPLIER = 2;

const insuranceSum = (items: Item[]): number => sum(items.map((item) => PRICE_LIST[item.type].insuranceValue));

const payoutCap = (items: Item[]): number => CAP_MULTIPLIER * insuranceSum(items);

const insuredItemsOf = (scenario: Scenario, policyIndex: number): Item[] =>
  (scenario.steps[policyIndex] as QuoteStep).items;

const processClaim = (scenario: Scenario, step: ClaimStep, alreadyPaid: number): ClaimResult => {
  const insuredItems = insuredItemsOf(scenario, step.policy);
  const capLeft = payoutCap(insuredItems) - alreadyPaid;
  const payout = Math.min(claimPayout(step, insuredItems), capLeft);
  return { payout, remainingCap: capLeft - payout };
};

export const runScenario = (scenario: Scenario): ScenarioOutput => {
  const paidByPolicy = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index): StepResult => {
      if (step.op === "claim") {
        const alreadyPaid = paidByPolicy.get(step.policy) ?? 0;
        const result = processClaim(scenario, step, alreadyPaid);
        paidByPolicy.set(step.policy, alreadyPaid + result.payout);
        return result;
      }
      const isFollowUpContract = index > 0;
      return { premium: quotePremium(step.items, scenario.customer, isFollowUpContract) };
    }),
  };
};
