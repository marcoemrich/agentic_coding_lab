interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: Incident;
}

type Step = QuoteStep | ClaimStep;

interface Customer {
  yearsWithMHPCO: number;
}

interface Scenario {
  customer: Customer;
  steps: Step[];
}

interface QuoteResult {
  premium: number;
}
interface ClaimResult {
  payout: number;
  remainingCap: number;
}
type StepResult = QuoteResult | ClaimResult;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const PROCESSING_FEE_G = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1; // 10% surcharge on policy base
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE_G = 60;
const CURSE_SURCHARGE_RATE = 0.5; // 50% of cursed item's base premium
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3; // 30% of enchanted item's base premium
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const COMPONENT_TYPES = ["rune", "moonstone"];

const priceForComponentGroup = (count: number, unitPrice: number): number =>
  count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PRICE_G : count * unitPrice;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.includes(item.type);

const isCursed = (item: Item): boolean => item.cursed === true;
const enchantmentLevel = (item: Item): number => item.enchantment ?? 0;
const isHighlyEnchanted = (item: Item): boolean =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_THRESHOLD;

const surchargeFor = (items: Item[], predicate: (i: Item) => boolean, rate: number): number =>
  items.filter(predicate).reduce((sum, item) => sum + BASE_PREMIUMS[item.type] * rate, 0);

const LOYALTY_YEARS_THRESHOLD = 2;
const LOYALTY_DISCOUNT_RATE = 0.2; // 20% discount on policy base
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15; // 15% discount on policy base for contracts after the first

const isLoyalCustomer = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;

const componentsBase = (items: Item[]): number =>
  COMPONENT_TYPES.reduce((sum, type) => {
    const count = items.filter((i) => i.type === type).length;
    return sum + priceForComponentGroup(count, BASE_PREMIUMS[type]);
  }, 0);

const nonComponentsBase = (items: Item[]): number =>
  items.filter((i) => !isComponent(i)).reduce((sum, item) => sum + BASE_PREMIUMS[item.type], 0);

const policyBaseFor = (items: Item[]): number =>
  componentsBase(items) + nonComponentsBase(items);

const discountIf = (applies: boolean, base: number, rate: number): number =>
  applies ? base * rate : 0;

const quotePremium = (items: Item[], customer: Customer, isFollowUpContract: boolean): number => {
  const policyBase = policyBaseFor(items);
  const curseSurcharge = surchargeFor(items, isCursed, CURSE_SURCHARGE_RATE);
  const enchantmentSurcharge = surchargeFor(items, isHighlyEnchanted, HIGH_ENCHANTMENT_SURCHARGE_RATE);
  const firstInsuranceSurcharge = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount = discountIf(isLoyalCustomer(customer), policyBase, LOYALTY_DISCOUNT_RATE);
  const followUpDiscount = discountIf(isFollowUpContract, policyBase, FOLLOW_UP_CONTRACT_DISCOUNT_RATE);
  return Math.ceil(
    policyBase +
      curseSurcharge +
      enchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE_G,
  );
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const DEDUCTIBLE_G = 100;
const CAP_MULTIPLIER = 2;

interface PolicyState {
  items: Item[];
  remainingCap: number;
}

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmountFor = (damage: Damage, item: Item): number =>
  enchantmentLevel(item) >= HIGH_ENCHANTMENT_REIMBURSEMENT_THRESHOLD
    ? damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE
    : damage.amount;

const openPolicy = (items: Item[]): PolicyState => ({
  items,
  remainingCap: CAP_MULTIPLIER * insuranceSumFor(items),
});

const insuredItemFor = (policy: PolicyState, itemType: string): Item => {
  const item = policy.items.find((i) => i.type === itemType);
  if (!item) {
    throw new Error(`Damaged item not in policy: ${itemType}`);
  }
  return item;
};

const payoutForDamageIn = (policy: PolicyState, damage: Damage): number => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
  }
  return reimbursableAmountFor(damage, insuredItemFor(policy, damage.itemType)) - DEDUCTIBLE_G;
};

const countBy = <T>(xs: T[], key: (x: T) => string): Record<string, number> =>
  xs.reduce<Record<string, number>>((acc, x) => {
    const k = key(x);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

const assertDamagesMatchPolicy = (policy: PolicyState, incident: Incident): void => {
  const damageCounts = countBy(incident.damages, (d) => d.itemType);
  const insuredCounts = countBy(policy.items, (i) => i.type);
  const excess = Object.entries(damageCounts).find(
    ([type, count]) => count > (insuredCounts[type] ?? 0),
  );
  if (excess) {
    throw new Error(`More damages of type ${excess[0]} than insured items`);
  }
};

const settleClaim = (policy: PolicyState, incident: Incident): ClaimResult => {
  assertDamagesMatchPolicy(policy, incident);
  const rawPayout = incident.damages.reduce(
    (sum, d) => sum + payoutForDamageIn(policy, d),
    0,
  );
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const assertKnownItemTypes = (items: Item[]): void => {
  const unknown = items.find((item) => !(item.type in BASE_PREMIUMS));
  if (unknown) {
    throw new Error(`Unknown item type: ${unknown.type}`);
  }
};

export const processScenario = (scenario: Scenario): { results: StepResult[] } => {
  const policies: Record<number, PolicyState> = {};

  const handleQuote = (step: QuoteStep, index: number): QuoteResult => {
    assertKnownItemTypes(step.items);
    const isFollowUpContract = Object.keys(policies).length > 0;
    const premium = quotePremium(step.items, scenario.customer, isFollowUpContract);
    policies[index] = openPolicy(step.items);
    return { premium };
  };

  const handleStep = (step: Step, index: number): StepResult =>
    step.op === "quote" ? handleQuote(step, index) : settleClaim(policies[step.policy], step.incident);

  return { results: scenario.steps.map(handleStep) };
};
