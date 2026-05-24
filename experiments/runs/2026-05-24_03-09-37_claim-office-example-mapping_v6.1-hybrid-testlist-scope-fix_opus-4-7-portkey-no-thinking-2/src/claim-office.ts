export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
export type Step = QuoteStep | ClaimStep;

export type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

export type QuoteResult = { premium: number };
export type ClaimResult = { payout: number; remainingCap: number };
export type StepResult = QuoteResult | ClaimResult;
export type ScenarioResult = { results: StepResult[] };

const PROCESSING_FEE = 5;
const FIRST_CONTRACT_SURCHARGE_RATE = 0.1;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const countBy = <T>(items: T[], keyOf: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = keyOf(item);
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
};

const countItemsByType = (items: Item[]): Record<string, number> =>
  countBy(items, (item) => item.type);

const componentGroupPremium = (type: string, count: number): number =>
  count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * BASE_PREMIUMS[type];

const itemsBasePremium = (items: Item[]): number => {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  const mainTotal = mainItems.reduce(
    (sum, item) => sum + BASE_PREMIUMS[item.type],
    0,
  );
  const componentTotal = Object.entries(countItemsByType(components)).reduce(
    (sum, [type, count]) => sum + componentGroupPremium(type, count),
    0,
  );
  return mainTotal + componentTotal;
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemModifiersSurcharge = (item: Item): number => {
  const base = BASE_PREMIUMS[item.type];
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + highEnchantment;
};

const sumItemModifiers = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemModifiersSurcharge(item), 0);

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_CONTRACT_DISCOUNT_RATE = 0.15;

const policyLevelAdjustments = (basePremium: number, yearsWithMHPCO: number, isFollowupContract: boolean): number => {
  const firstContract = basePremium * FIRST_CONTRACT_SURCHARGE_RATE;
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? -basePremium * LOYALTY_DISCOUNT_RATE : 0;
  const followup = isFollowupContract ? -basePremium * FOLLOWUP_CONTRACT_DISCOUNT_RATE : 0;
  return firstContract + loyalty + followup;
};

const assertKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) throw new Error(`unknown item type: ${item.type}`);
  }
};

const quoteStep = (step: QuoteStep, yearsWithMHPCO: number, isFollowupContract: boolean): QuoteResult => {
  assertKnownItemTypes(step.items);
  const basePremium = itemsBasePremium(step.items);
  const itemModifiers = sumItemModifiers(step.items);
  const policyAdjustments = policyLevelAdjustments(basePremium, yearsWithMHPCO, isFollowupContract);
  const premium = basePremium + itemModifiers + policyAdjustments + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

type PolicyState = { items: Item[]; insuranceSum: number; remainingCap: number };

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUES[item.type], 0);

const isHighEnchantment = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;

const reimbursableAmount = (item: Item | undefined, amount: number): number =>
  isHighEnchantment(item) ? amount * HIGH_ENCHANTMENT_CLAIM_RATE : amount;

const damagePayout = (damage: Damage, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType);
  return reimbursableAmount(item, damage.amount) - DEDUCTIBLE;
};

const assertNonNegativeAmounts = (damages: Damage[]): void => {
  for (const dmg of damages) {
    if (dmg.amount < 0) throw new Error(`claim rejected: negative damage amount ${dmg.amount}`);
  }
};

const validateDamageCounts = (damages: Damage[], items: Item[]): void => {
  const itemCounts = countItemsByType(items);
  const damageCounts = countBy(damages, (dmg) => dmg.itemType);
  for (const [type, count] of Object.entries(damageCounts)) {
    if (count > (itemCounts[type] ?? 0)) throw new Error(`claim rejected: more damages of type ${type} than insured`);
  }
};

const totalDamagePayout = (damages: Damage[], items: Item[]): number =>
  damages.reduce((sum, dmg) => sum + damagePayout(dmg, items), 0);

// Payouts are rounded down so the rounding favors MHPCO, never the customer.
const roundInMHPCOsFavor = (amount: number): number => Math.floor(amount);

const claimStep = (step: ClaimStep, policies: Map<number, PolicyState>): ClaimResult => {
  const policy = policies.get(step.policy)!;
  assertNonNegativeAmounts(step.incident.damages);
  validateDamageCounts(step.incident.damages, policy.items);
  const uncappedPayout = totalDamagePayout(step.incident.damages, policy.items);
  const payout = roundInMHPCOsFavor(Math.min(uncappedPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const newPolicyState = (items: Item[]): PolicyState => {
  const sum = insuranceSum(items);
  return { items, insuranceSum: sum, remainingCap: sum * CAP_MULTIPLIER };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  const policies = new Map<number, PolicyState>();
  const results: StepResult[] = [];
  let hasPriorQuote = false;
  scenario.steps.forEach((step, idx) => {
    if (step.op === "quote") {
      results.push(quoteStep(step, scenario.customer.yearsWithMHPCO, hasPriorQuote));
      policies.set(idx, newPolicyState(step.items));
      hasPriorQuote = true;
    } else {
      results.push(claimStep(step, policies));
    }
  });
  return { results };
};
