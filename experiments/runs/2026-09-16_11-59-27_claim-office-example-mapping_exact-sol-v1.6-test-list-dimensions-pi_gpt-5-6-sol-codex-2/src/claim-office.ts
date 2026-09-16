import { createPolicy, processClaim, type Damage, type Policy } from "./claims.js";

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const SWORD_BASE_PREMIUM = 100;
const AMULET_BASE_PREMIUM = 60;
const STAFF_BASE_PREMIUM = 80;
const POTION_BASE_PREMIUM = 40;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_TYPES = ["rune", "moonstone"];
const KNOWN_ITEM_TYPES = ["sword", "amulet", "staff", "potion", ...COMPONENT_TYPES];

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

interface QuoteStep {
  op: "quote";
  items: Item[];
}

interface ClaimStep {
  op: "claim";
  policy: number;
  incident: { cause: string; damages: Damage[] };
}

export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<QuoteStep | ClaimStep>;
}

export type Result = { premium: number } | { payout: number; remainingCap: number };

function assertKnownItems(items: Item[]): void {
  if (items.some((item) => !KNOWN_ITEM_TYPES.includes(item.type))) {
    throw new Error("Unknown insured item type");
  }
}

function itemBasePremium(item: Item): number {
  if (item.type === "amulet") return AMULET_BASE_PREMIUM;
  if (item.type === "staff") return STAFF_BASE_PREMIUM;
  if (item.type === "potion") return POTION_BASE_PREMIUM;
  if (item.type === "rune" || item.type === "moonstone") return COMPONENT_BASE_PREMIUM;
  return SWORD_BASE_PREMIUM;
}

function componentGroupPremium(items: Item[], type: string): number {
  const count = items.filter((item) => item.type === type).length;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

function policyBasePremium(items: Item[]): number {
  const componentPremium = COMPONENT_TYPES.reduce(
    (sum, type) => sum + componentGroupPremium(items, type),
    0,
  );
  const mainItemPremium = items
    .filter((item) => !COMPONENT_TYPES.includes(item.type))
    .reduce((sum, item) => sum + itemBasePremium(item), 0);
  return componentPremium + mainItemPremium;
}

function curseSurcharge(items: Item[]): number {
  return items
    .filter((item) => item.cursed)
    .reduce((sum, item) => sum + itemBasePremium(item) * CURSE_SURCHARGE_RATE, 0);
}

function highEnchantmentSurcharge(items: Item[]): number {
  return items
    .filter((item) => (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL)
    .reduce((sum, item) => sum + itemBasePremium(item) * HIGH_ENCHANTMENT_SURCHARGE_RATE, 0);
}

function loyaltyDiscount(basePremium: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? basePremium * LOYALTY_DISCOUNT_RATE : 0;
}

function followUpDiscount(basePremium: number, priorQuotes: number): number {
  return priorQuotes > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
}

export function quotePremium(items: Item[], yearsWithMHPCO = 0, priorQuotes = 0): number {
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium
      + curseSurcharge(items)
      + highEnchantmentSurcharge(items)
      + basePremium * FIRST_INSURANCE_RATE
      - loyaltyDiscount(basePremium, yearsWithMHPCO)
      - followUpDiscount(basePremium, priorQuotes)
      + PROCESSING_FEE,
  );
}

export function processScenario(scenario: Scenario): { results: Result[] } {
  let priorQuotes = 0;
  const policies: Array<Policy | undefined> = [];
  const results: Result[] = [];
  scenario.steps.forEach((step, index) => {
    if (step.op === "quote") {
      assertKnownItems(step.items);
      results.push({ premium: quotePremium(step.items, scenario.customer.yearsWithMHPCO, priorQuotes) });
      policies[index] = createPolicy(step.items);
      priorQuotes += 1;
    } else {
      results.push(processClaim(policies[step.policy]!, step.incident.damages));
    }
  });
  return { results };
}
