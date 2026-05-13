export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };

export type Customer = { yearsWithMHPCO: number };

export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause?: string; damages: Damage[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: Customer;
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;

export type ScenarioResult = {
  results: StepResult[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOW_UP_DISCOUNT = 0.15;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE_PER_DAMAGE = 100;
const PAYOUT_CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_DAMAGE_RATE = 0.5;
const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;

const COMPONENT_BLOCK_OF_THREE_PREMIUM = 60;
const COMPONENT_TYPES = new Set<string>(["rune", "moonstone"]);
const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const itemBasePremium = (item: Item): number => {
  const base = MAIN_ITEM_BASE_PREMIUM[item.type];
  if (base === undefined) throw new Error(`unknown item type: ${item.type}`);
  return base;
};

const componentGroupPremium = (type: string, count: number): number => {
  if (count === 3) return COMPONENT_BLOCK_OF_THREE_PREMIUM;
  return count * itemBasePremium({ type });
};

const policyBasePremium = (items: Item[]): number => {
  const componentCounts: Record<string, number> = {};
  let mainItemsTotal = 0;
  for (const item of items) {
    if (isComponent(item)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      mainItemsTotal += itemBasePremium(item);
    }
  }
  const componentsTotal = Object.entries(componentCounts).reduce(
    (sum, [type, count]) => sum + componentGroupPremium(type, count),
    0,
  );
  return mainItemsTotal + componentsTotal;
};

const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurchargeRate = (item: Item): number =>
  (item.cursed ? CURSE_SURCHARGE : 0) +
  (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE : 0);

const itemSurcharges = (item: Item): number => itemBasePremium(item) * itemSurchargeRate(item);

const isLongStanding = (customer: Customer): boolean =>
  customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS;

const policyModifierRate = (customer: Customer, isFollowUpContract: boolean): number =>
  FIRST_INSURANCE_SURCHARGE
  - (isLongStanding(customer) ? LOYALTY_DISCOUNT : 0)
  - (isFollowUpContract ? FOLLOW_UP_DISCOUNT : 0);

const quotePremium = (items: Item[], customer: Customer, isFollowUpContract: boolean): number => {
  const policyBase = policyBasePremium(items);
  const surchargesTotal = items.reduce((sum, item) => sum + itemSurcharges(item), 0);
  return policyBase + surchargesTotal + policyBase * policyModifierRate(customer, isFollowUpContract) + PROCESSING_FEE;
};

type PolicyState = { items: Item[]; insuranceSum: number; remainingCap: number };

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);

const isHighEnchantmentDamage = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD;

const damagePayout = (damage: Damage, item: Item): number => {
  const reimbursable = isHighEnchantmentDamage(item)
    ? damage.amount * HIGH_ENCHANTMENT_DAMAGE_RATE
    : damage.amount;
  return Math.max(0, reimbursable - DEDUCTIBLE_PER_DAMAGE);
};

const matchDamagesToItems = (items: Item[], damages: Damage[]): Item[] => {
  const remaining = [...items];
  return damages.map((damage) => {
    const idx = remaining.findIndex((item) => item.type === damage.itemType);
    if (idx === -1) {
      throw new Error(`claim references item not in policy: ${damage.itemType}`);
    }
    const [matched] = remaining.splice(idx, 1);
    return matched;
  });
};

const processClaim = (policy: PolicyState, incident: Incident): ClaimResult => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
  const matchedItems = matchDamagesToItems(policy.items, incident.damages);
  const desiredPayout = incident.damages.reduce(
    (sum, d, i) => sum + damagePayout(d, matchedItems[i]),
    0,
  );
  const payout = Math.floor(Math.min(desiredPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const processScenario = (scenario: Scenario): ScenarioResult => {
  const policies: Record<number, PolicyState> = {};
  let priorQuoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const isFollowUpContract = priorQuoteCount > 0;
      priorQuoteCount += 1;
      const insuranceSum = policyInsuranceSum(step.items);
      policies[index] = {
        items: step.items,
        insuranceSum,
        remainingCap: insuranceSum * PAYOUT_CAP_MULTIPLIER,
      };
      return { premium: Math.ceil(quotePremium(step.items, scenario.customer, isFollowUpContract)) };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
