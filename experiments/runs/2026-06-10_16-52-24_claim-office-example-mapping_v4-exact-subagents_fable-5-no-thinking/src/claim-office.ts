export type Customer = {
  yearsWithMHPCO: number;
};

export type Item = {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
};

export type QuoteStep = {
  op: "quote";
  items: Item[];
};

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimStep = {
  op: "claim";
  policy: number;
  incident: Incident;
};

export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export type Result = {
  premium?: number;
  payout?: number;
  remainingCap?: number;
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_MINIMUM = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_MINIMUM_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const groupBasePremium = ([type, count]: [string, number]): number =>
  count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PREMIUM
    : count * BASE_PREMIUMS[type];

const sumBy = <T>(values: T[], amount: (value: T) => number): number =>
  values.reduce((total, value) => total + amount(value), 0);

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const computeBasePremium = (items: Item[]): number =>
  sumBy([...countByType(items)], groupBasePremium);

const itemCurseSurcharge = (item: Item): number =>
  item.cursed ? BASE_PREMIUMS[item.type] * CURSE_SURCHARGE_RATE : 0;

const enchantmentOf = (item: Item): number => item.enchantment ?? 0;

const itemHighEnchantmentSurcharge = (item: Item): number =>
  enchantmentOf(item) >= HIGH_ENCHANTMENT_MINIMUM
    ? BASE_PREMIUMS[item.type] * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;

const quotePremium = (
  customer: Customer,
  items: Item[],
  isFollowUp: boolean,
): number => {
  const basePremium = computeBasePremium(items);
  const curseSurcharge = sumBy(items, itemCurseSurcharge);
  const highEnchantmentSurcharge = sumBy(items, itemHighEnchantmentSurcharge);
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_MINIMUM_YEARS
      ? basePremium * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount = isFollowUp
    ? basePremium * FOLLOW_UP_DISCOUNT_RATE
    : 0;
  const unroundedPremium =
    basePremium +
    curseSurcharge +
    highEnchantmentSurcharge +
    firstInsuranceSurcharge -
    loyaltyDiscount -
    followUpDiscount +
    PROCESSING_FEE;
  return Math.ceil(unroundedPremium);
};

const DEDUCTIBLE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_MINIMUM_ENCHANTMENT = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};

const insuranceValueOf = (item: Item): number => INSURANCE_VALUES[item.type];

const reimbursementFor = (insuredItem: Item, damage: Damage): number =>
  enchantmentOf(insuredItem) >= HALF_REIMBURSEMENT_MINIMUM_ENCHANTMENT
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;

const requireInsuredItem = (insuredItems: Item[], damage: Damage): Item => {
  const insuredItem = insuredItems.find((item) => item.type === damage.itemType);
  if (insuredItem === undefined) {
    throw new Error(`Item not in policy: ${damage.itemType}`);
  }
  return insuredItem;
};

const assertDamageCountsCovered = (
  insuredItems: Item[],
  damages: Damage[],
): void => {
  const insuredCounts = countByType(insuredItems);
  const damageCounts = new Map<string, number>();
  for (const damage of damages) {
    damageCounts.set(
      damage.itemType,
      (damageCounts.get(damage.itemType) ?? 0) + 1,
    );
  }
  for (const [type, count] of damageCounts) {
    if (count > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More ${type} damages than insured: ${type}`);
    }
  }
};

const damagePayout = (insuredItems: Item[], damage: Damage): number =>
  reimbursementFor(requireInsuredItem(insuredItems, damage), damage) -
  DEDUCTIBLE;

const settleClaim = (
  insuredItems: Item[],
  damages: Damage[],
  remainingCap: number,
): ClaimResult => {
  assertDamageCountsCovered(insuredItems, damages);
  const uncappedPayout = sumBy(damages, (damage) =>
    damagePayout(insuredItems, damage),
  );
  const unroundedPayout = Math.min(uncappedPayout, remainingCap);
  const payout = Math.floor(unroundedPayout);
  return { payout, remainingCap: remainingCap - payout };
};

const policyOf = (scenario: Scenario, claim: ClaimStep): QuoteStep =>
  scenario.steps[claim.policy] as QuoteStep;

const initialCapOf = (policy: QuoteStep): number =>
  PAYOUT_CAP_MULTIPLIER * sumBy(policy.items, insuranceValueOf);

export const processScenario = (scenario: Scenario): { results: Result[] } => {
  const remainingCaps = new Map<number, number>();
  return {
    results: scenario.steps.map((step, index) => {
      if (step.op === "quote") {
        assertKnownItemTypes(step.items);
        const isFollowUp = index > 0;
        return { premium: quotePremium(scenario.customer, step.items, isFollowUp) };
      }
      const policy = policyOf(scenario, step);
      const remainingCap =
        remainingCaps.get(step.policy) ?? initialCapOf(policy);
      const result = settleClaim(
        policy.items,
        step.incident.damages,
        remainingCap,
      );
      remainingCaps.set(step.policy, result.remainingCap);
      return result;
    }),
  };
};
