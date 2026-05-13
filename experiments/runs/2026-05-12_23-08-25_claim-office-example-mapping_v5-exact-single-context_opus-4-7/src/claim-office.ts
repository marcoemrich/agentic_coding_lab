type Item = { type: string; cursed?: boolean; enchantment?: number; material?: string };
type QuoteStep = { op: "quote"; items: Item[] };
type Damage = { itemType: string; amount: number };
type ClaimStep = {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
};
type Step = QuoteStep | ClaimStep;
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: Step[];
};

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type StepResult = QuoteResult | ClaimResult;

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE = 250;
const COMPONENT_BASE_PER_ITEM = 25;
const COMPONENT_BLOCK_BASE = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;
const PROCESSING_FEE = 5;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;

const isMainItem = (item: Item): boolean => item.type in MAIN_ITEM_BASE;

const mainItemBase = (item: Item): number => MAIN_ITEM_BASE[item.type];

const itemInsuranceValue = (item: Item): number =>
  isMainItem(item) ? MAIN_ITEM_INSURANCE[item.type] : COMPONENT_INSURANCE;

const componentsBase = (items: Item[]): number => {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const count of countsByType.values()) {
    total += count === 3 ? COMPONENT_BLOCK_BASE : count * COMPONENT_BASE_PER_ITEM;
  }
  return total;
};

const KNOWN_COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const isKnownItem = (item: Item): boolean =>
  isMainItem(item) || KNOWN_COMPONENT_TYPES.has(item.type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItem(item)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
};

const policyBase = (items: Item[]): number => {
  const mainItems = items.filter(isMainItem);
  const components = items.filter((i) => !isMainItem(i));
  const mainTotal = mainItems.reduce((sum, item) => sum + mainItemBase(item), 0);
  return mainTotal + componentsBase(components);
};

const itemSurcharges = (items: Item[]): number => {
  return items.filter(isMainItem).reduce((sum, item) => {
    const base = mainItemBase(item);
    const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
    const highEnch =
      (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_RATE : 0;
    return sum + curse + highEnch;
  }, 0);
};

type Policy = {
  items: Item[];
  insuranceSum: number;
  remainingCap: number;
};

const buildPolicy = (items: Item[]): Policy => {
  const insuranceSum = items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
  return { items, insuranceSum, remainingCap: insuranceSum * CAP_MULTIPLIER };
};

const computePremium = (
  items: Item[],
  yearsWithMHPCO: number,
  quoteIndex: number,
): number => {
  const base = policyBase(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = base * FIRST_INSURANCE_RATE;
  const loyalty = yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? base * LOYALTY_DISCOUNT_RATE : 0;
  const followUp = quoteIndex > 0 ? base * FOLLOWUP_DISCOUNT_RATE : 0;
  return Math.ceil(base + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
};

const reimbursableAmount = (item: Item, damage: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damage * HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return damage;
};

const countByType = (items: { type?: string; itemType?: string }[], key: "type" | "itemType"): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const t = item[key]!;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
};

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
  }
  const policyCounts = countByType(policy.items, "type");
  const damageCounts = countByType(damages, "itemType");
  for (const [type, count] of damageCounts) {
    if ((policyCounts.get(type) ?? 0) < count) {
      throw new Error(`damage entries for "${type}" (${count}) exceed policy coverage`);
    }
  }
};

const processClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  validateDamages(policy, damages);
  let totalPayout = 0;
  for (const damage of damages) {
    const item = policy.items.find((i) => i.type === damage.itemType)!;
    const reimbursable = reimbursableAmount(item, damage.amount);
    const payout = Math.max(0, Math.floor(reimbursable - DEDUCTIBLE));
    totalPayout += payout;
  }
  const capped = Math.min(totalPayout, policy.remainingCap);
  policy.remainingCap -= capped;
  return { payout: capped, remainingCap: policy.remainingCap };
};

export const processScenario = (
  scenario: Scenario,
): { results: StepResult[] } => {
  const policies: Record<number, Policy> = {};
  let quoteCount = 0;
  const results: StepResult[] = scenario.steps.map((step, stepIndex) => {
    if (step.op === "quote") {
      validateItems(step.items);
      const premium = computePremium(step.items, scenario.customer.yearsWithMHPCO, quoteCount);
      policies[stepIndex] = buildPolicy(step.items);
      quoteCount += 1;
      return { premium };
    }
    const policy = policies[step.policy];
    return processClaim(policy, step.incident.damages);
  });
  return { results };
};
