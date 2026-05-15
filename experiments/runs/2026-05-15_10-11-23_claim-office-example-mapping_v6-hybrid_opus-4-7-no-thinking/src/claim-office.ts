type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Customer = { yearsWithMHPCO: number };
type Scenario = { customer: Customer; steps: Step[] };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const insuranceValueForType = (type: string): number => INSURANCE_VALUE_BY_TYPE[type] ?? 0;

const KNOWN_ITEM_TYPES = new Set(Object.keys(BASE_PREMIUM_BY_TYPE));

const validateItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!KNOWN_ITEM_TYPES.has(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const policyInsuranceSum = (items: Item[]): number =>
  sum(items.map((item) => insuranceValueForType(item.type)));

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (damage: Damage, item: Item | undefined): number => {
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damage.amount;
};

const damagePayout = (damage: Damage, item: Item | undefined): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const countBy = <T>(xs: T[], keyOf: (x: T) => string): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const x of xs) {
    const k = keyOf(x);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
};

const validateDamageCounts = (items: Item[], damages: Damage[]): void => {
  const itemCounts = countBy(items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [type, damageCount] of damageCounts) {
    const insuredCount = itemCounts.get(type) ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(`Claim has ${damageCount} damages of type ${type} but policy covers only ${insuredCount}`);
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

const processClaim = (
  items: Item[],
  incident: Incident,
  remainingCap: number,
): { payout: number; remainingCap: number } => {
  validateDamageAmounts(incident.damages);
  validateDamageCounts(items, incident.damages);
  const rawPayout = sum(
    incident.damages.map((damage) =>
      damagePayout(damage, items.find((item) => item.type === damage.itemType)),
    ),
  );
  const payout = Math.floor(Math.min(rawPayout, remainingCap));
  return { payout, remainingCap: remainingCap - payout };
};

const basePremiumForType = (type: string): number => BASE_PREMIUM_BY_TYPE[type] ?? 0;
const itemBasePremium = (item: Item): number => basePremiumForType(item.type);

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_OF_THREE_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_OF_THREE_BASE_PREMIUM : count * basePremiumForType(type);

const sum = (values: number[]): number => values.reduce((total, value) => total + value, 0);

const policyBasePremium = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const componentItems = items.filter(isComponent);
  const componentCounts = countBy(componentItems, (item) => item.type);

  const mainTotal = sum(mainItems.map(itemBasePremium));
  const componentTotal = sum(
    [...componentCounts].map(([type, count]) => componentGroupPremium(type, count)),
  );

  return mainTotal + componentTotal;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnch =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curse + highEnch;
};

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const perItemSurcharges = (items: Item[]): number => sum(items.map(itemSurcharges));

const policyWideDiscounts = (
  basePremium: number,
  customer: Customer,
  isFollowUp: boolean,
): number => {
  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = isFollowUp ? basePremium * FOLLOWUP_DISCOUNT_RATE : 0;
  return loyalty + followUp;
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const basePremium = policyBasePremium(items);
  const surcharges = perItemSurcharges(items);
  const discounts = policyWideDiscounts(basePremium, customer, isFollowUp);
  const firstInsurance = basePremium * FIRST_INSURANCE_RATE;
  const premiumBeforeFee = Math.ceil(basePremium + surcharges - discounts + firstInsurance);
  return premiumBeforeFee + PROCESSING_FEE;
};

type PolicyState = { items: Item[]; remainingCap: number };

const newPolicyState = (items: Item[]): PolicyState => ({
  items,
  remainingCap: policyInsuranceSum(items) * CAP_MULTIPLIER,
});

export const runScenario = (scenario: Scenario): unknown => {
  const policies: PolicyState[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      validateItemTypes(step.items);
      const isFollowUp = policies.length > 0;
      policies.push(newPolicyState(step.items));
      return { premium: quotePremium(step.items, scenario.customer, isFollowUp) };
    }
    const policy = policies[step.policy];
    const result = processClaim(policy.items, step.incident, policy.remainingCap);
    policy.remainingCap = result.remainingCap;
    return result;
  });
  return { results };
};
