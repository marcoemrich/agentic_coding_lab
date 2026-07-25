const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HALF_REIMBURSEMENT_THRESHOLD = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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

interface Scenario {
  customer: { yearsWithMHPCO: number };
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
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const isKnownItemType = (item: Item): boolean =>
  isComponent(item) || item.type in BASE_PREMIUMS;

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const componentsBasePremium = (components: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const component of components) {
    countsByType.set(component.type, (countsByType.get(component.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    total += componentGroupPremium(count);
  }
  return total;
};

const basePremiumFor = (item: Item): number => BASE_PREMIUMS[item.type];

const surchargeFor = (
  mainItems: Item[],
  qualifies: (item: Item) => boolean,
  rate: number,
): number =>
  mainItems
    .filter(qualifies)
    .reduce((sum, item) => sum + basePremiumFor(item) * rate, 0);

const isCursed = (item: Item): boolean => item.cursed === true;

const isHighEnchantment = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const percentageWhen = (base: number, rate: number, applies: boolean): number =>
  applies ? base * rate : 0;

const isLoyalCustomer = (yearsWithMHPCO: number): boolean =>
  yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const quotePremium = (items: Item[], yearsWithMHPCO: number, isFollowUp: boolean): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  const basePremium =
    mainItems.reduce((sum, item) => sum + basePremiumFor(item), 0) +
    componentsBasePremium(components);
  const curseSurcharge = surchargeFor(mainItems, isCursed, CURSE_RATE);
  const highEnchantmentSurcharge = surchargeFor(
    mainItems,
    isHighEnchantment,
    HIGH_ENCHANTMENT_RATE,
  );
  const firstInsuranceSurcharge = basePremium * FIRST_INSURANCE_RATE;
  const loyaltyDiscount = percentageWhen(basePremium, LOYALTY_RATE, isLoyalCustomer(yearsWithMHPCO));
  const followUpDiscount = percentageWhen(basePremium, FOLLOW_UP_RATE, isFollowUp);
  return Math.ceil(
    basePremium +
      curseSurcharge +
      highEnchantmentSurcharge +
      firstInsuranceSurcharge -
      loyaltyDiscount -
      followUpDiscount +
      PROCESSING_FEE,
  );
};

const insuranceValueFor = (item: Item): number => INSURANCE_VALUES[item.type];

const insuranceSumFor = (items: Item[]): number =>
  items.reduce((sum, item) => sum + insuranceValueFor(item), 0);

interface Policy {
  items: Item[];
  remainingCap: number;
}

const qualifiesForHalfReimbursement = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_THRESHOLD;

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursed = qualifiesForHalfReimbursement(item)
    ? damage.amount * HALF_REIMBURSEMENT_RATE
    : damage.amount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const validateDamage = (damage: Damage): void => {
  if (damage.amount < 0) {
    throw new Error(`Damage amount cannot be negative: ${damage.amount}`);
  }
};

const matchDamageToInsuredItem = (damage: Damage, unmatchedItems: Item[]): Item => {
  const matchIndex = unmatchedItems.findIndex((item) => item.type === damage.itemType);
  if (matchIndex === -1) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  const [matchedItem] = unmatchedItems.splice(matchIndex, 1);
  return matchedItem;
};

const uncappedPayoutFor = (incident: Incident, items: Item[]): number => {
  const unmatchedItems = [...items];
  return incident.damages.reduce((sum, damage) => {
    validateDamage(damage);
    return sum + damagePayout(damage, matchDamageToInsuredItem(damage, unmatchedItems));
  }, 0);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const uncappedPayout = uncappedPayoutFor(incident, policy.items);
  const payout = Math.floor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const createPolicy = (items: Item[]): Policy => ({
  items,
  remainingCap: insuranceSumFor(items) * CAP_MULTIPLIER,
});

export const runScenario = (scenario: Scenario): { results: StepResult[] } => {
  let quoteCount = 0;
  const policies: Record<number, Policy> = {};

  const handleQuote = (step: QuoteStep, index: number): QuoteResult => {
    validateItemTypes(step.items);
    const isFollowUp = quoteCount > 0;
    quoteCount += 1;
    policies[index] = createPolicy(step.items);
    return {
      premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, isFollowUp),
    };
  };

  const results: StepResult[] = scenario.steps.map((step, index) =>
    step.op === "quote"
      ? handleQuote(step, index)
      : processClaim(policies[step.policy], step.incident),
  );
  return { results };
};
