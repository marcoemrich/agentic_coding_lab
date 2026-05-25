// ---- Domain types ----
type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type QuoteStep = { op: "quote"; items: Item[] };
type Scenario = {
  customer: { yearsWithMHPCO: number };
  steps: QuoteStep[];
};
type QuoteResult = { premium: number };
type ScenarioResult = { results: QuoteResult[] };

// ---- Pricing constants ----
const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_OF_THREE_PREMIUM = 60;

// ---- Base-premium calculation (per type group) ----
const basePremiumForType = (type: string, count: number): number =>
  COMPONENT_TYPES.has(type) && count === BLOCK_SIZE
    ? BLOCK_OF_THREE_PREMIUM
    : count * BASE_PREMIUM[type];

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

const sumBasePremiums = (items: Item[]): number =>
  Array.from(countByType(items)).reduce(
    (total, [type, count]) => total + basePremiumForType(type, count),
    0,
  );

// ---- Per-item surcharges ----
const isCursed = (item: Item): boolean => item.cursed === true;
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD;

const itemSurcharge = (item: Item): number => {
  const base = BASE_PREMIUM[item.type];
  const curseRate = isCursed(item) ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return base * (curseRate + enchantmentRate);
};

const sumItemSurcharges = (items: Item[]): number =>
  items.reduce((total, item) => total + itemSurcharge(item), 0);

// ---- Quote assembly ----
const quotePremium = (items: Item[]): number => {
  const policyBase = sumBasePremiums(items);
  const itemSurcharges = sumItemSurcharges(items);
  const initialAssessment = policyBase * INITIAL_ASSESSMENT_SURCHARGE_RATE;
  return Math.ceil(policyBase + itemSurcharges + initialAssessment) + PROCESSING_FEE;
};

export const runScenario = (input: Scenario): ScenarioResult => {
  const results = input.steps.map((step) => ({ premium: quotePremium(step.items) }));
  return { results };
};
