export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteStep = { op: "quote"; items: Item[] };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type ClaimStep = { op: "claim"; policy: number; incident: Incident };
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
// Premiums are accumulated in hundredths of a gold piece so we can apply
// percentage surcharges/discounts (10%, 15%, 20%, 30%, 50%) with integer math
// and round once at the end (avoids floating-point artifacts).
const HUNDREDTHS_PER_UNIT = 100;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const basePremium = (item: Item): number => BASE_PREMIUM_BY_TYPE[item.type] ?? 0;

const sumBasePremiums = (items: Item[]): number =>
  items.reduce((sum, item) => sum + basePremium(item), 0);

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const groupByType = (items: Item[]): Item[][] => {
  const groups: Record<string, Item[]> = {};
  for (const item of items) {
    (groups[item.type] ??= []).push(item);
  }
  return Object.values(groups);
};

const componentGroupBasePremium = (group: Item[]): number =>
  group.length === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : sumBasePremiums(group);

const itemsBasePremium = (items: Item[]): number => {
  const components = items.filter(isComponent);
  const mains = items.filter((item) => !isComponent(item));
  const componentTotal = groupByType(components)
    .map(componentGroupBasePremium)
    .reduce((sum, premium) => sum + premium, 0);
  return sumBasePremiums(mains) + componentTotal;
};

const roundUpHundredthsToUnits = (h: number): number => Math.ceil(h / HUNDREDTHS_PER_UNIT);

// Modifier rates are expressed in hundredths-per-gold of base premium (i.e. percentage points).
// Item-specific modifiers attach to a single item's base premium.
// Policy-wide modifiers attach to the total base premium of the policy.
const CURSE_SURCHARGE = 50;
const HIGH_ENCHANTMENT_SURCHARGE = 30;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_QUOTE_SURCHARGE = 10;
const LOYALTY_DISCOUNT = 20;
const LOYALTY_THRESHOLD_YEARS = 2;
const FOLLOWUP_DISCOUNT = 15;

const itemModifierRate = (item: Item): number => {
  let rate = 0;
  if (item.cursed) rate += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
};

const itemSurchargeHundredths = (item: Item): number => basePremium(item) * itemModifierRate(item);

const sumItemSurchargesHundredths = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurchargeHundredths(item), 0);

type Customer = { yearsWithMHPCO: number };

const policyModifierRate = (customer: Customer, quoteIndex: number): number => {
  let rate = FIRST_QUOTE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) rate -= LOYALTY_DISCOUNT;
  if (quoteIndex > 0) rate -= FOLLOWUP_DISCOUNT;
  return rate;
};

const validateKnownItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUM_BY_TYPE)) {
      throw new Error(`unknown item type: "${item.type}"`);
    }
  }
};

const quote = (step: QuoteStep, customer: Customer, quoteIndex: number): QuoteResult => {
  validateKnownItems(step.items);
  const baseGold = itemsBasePremium(step.items);
  const baseHundredths = baseGold * HUNDREDTHS_PER_UNIT;
  const itemSurchargesHundredths = sumItemSurchargesHundredths(step.items);
  const policySurchargeHundredths = baseGold * policyModifierRate(customer, quoteIndex);
  const totalHundredths = baseHundredths + itemSurchargesHundredths + policySurchargeHundredths;
  return { premium: roundUpHundredthsToUnits(totalHundredths) + PROCESSING_FEE };
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000, amulet: 600, staff: 800, potion: 400, rune: 250, moonstone: 250,
};
const DEDUCTIBLE = 100;
const HIGH_ENCH_PAYOUT_THRESHOLD = 8;

type Policy = { items: Item[]; cap: number };

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + (INSURANCE_VALUE_BY_TYPE[item.type] ?? 0), 0);

const findInsuredItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((item) => item.type === itemType);

const damagePayoutGold = (item: Item, damageAmount: number): number => {
  const reimbursed =
    (item.enchantment ?? 0) >= HIGH_ENCH_PAYOUT_THRESHOLD ? damageAmount / 2 : damageAmount;
  return Math.max(0, reimbursed - DEDUCTIBLE);
};

const totalPayoutGold = (insuredItems: Item[], damages: Damage[]): number =>
  damages.reduce((sum, damage) => {
    const item = findInsuredItem(insuredItems, damage.itemType);
    return item ? sum + damagePayoutGold(item, damage.amount) : sum;
  }, 0);

const countBy = <T>(items: T[], key: (item: T) => string): Record<string, number> =>
  items.reduce<Record<string, number>>((acc, item) => {
    const k = key(item);
    acc[k] = (acc[k] ?? 0) + 1;
    return acc;
  }, {});

const validateDamageCounts = (policy: Policy, damages: Damage[]): void => {
  const insuredCounts = countBy(policy.items, (item) => item.type);
  const damageCounts = countBy(damages, (damage) => damage.itemType);
  for (const [itemType, damageCount] of Object.entries(damageCounts)) {
    const insuredCount = insuredCounts[itemType] ?? 0;
    if (damageCount > insuredCount) {
      throw new Error(
        `claim has ${damageCount} damages of type "${itemType}" but policy covers only ${insuredCount}`,
      );
    }
  }
};

const validateDamageAmounts = (damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${damage.amount}`);
    }
  }
};

const claim = (step: ClaimStep, policy: Policy): ClaimResult => {
  validateDamageAmounts(step.incident.damages);
  validateDamageCounts(policy, step.incident.damages);
  const computed = Math.floor(totalPayoutGold(policy.items, step.incident.damages));
  const payout = Math.min(computed, policy.cap);
  policy.cap -= payout;
  return { payout, remainingCap: policy.cap };
};

export const runScenario = (scenario: Scenario): ScenarioResult => {
  let quoteIndex = 0;
  const results: StepResult[] = [];
  const policies: Policy[] = [];
  for (const step of scenario.steps) {
    if (step.op === "quote") {
      results.push(quote(step, scenario.customer, quoteIndex));
      policies.push({ items: step.items, cap: 2 * insuranceSum(step.items) });
      quoteIndex += 1;
    } else {
      results.push(claim(step, policies[step.policy]));
    }
  }
  return { results };
};
