export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<Record<string, unknown>>;
}

export interface ScenarioResult {
  results: Array<Record<string, number>>;
}

const PROCESSING_FEE = 5;
const INITIAL_ASSESSMENT_RATE = 0.1;
const CURSE_RATE = 0.5;
const LOYALTY_YEARS = 2;
const LOYALTY_RATE = 0.2;
const HIGH_ENCHANTMENT = 5;
const ENCHANTMENT_RATE = 0.3;
const FOLLOW_UP_RATE = 0.15;
const DEDUCTIBLE = 100;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;
const CAP_MULTIPLIER = 2;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};
const KNOWN_ITEM_TYPES = new Set(Object.keys(INSURANCE_VALUES));
const COMPONENT_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

function groupPremium(type: string, count: number): number {
  const listedPremium = BASE_PREMIUMS[type];
  if (listedPremium !== undefined) return listedPremium * count;
  return count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_PREMIUM : COMPONENT_PREMIUM * count;
}

export function basePremium(items: Array<{ type: string }>): number {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return [...counts].reduce((total, [type, count]) => total + groupPremium(type, count), 0);
}

interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

function curseRisk(item: Item, itemBase: number): number {
  return item.cursed ? itemBase * CURSE_RATE : 0;
}

function enchantmentRisk(item: Item, itemBase: number): number {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT ? itemBase * ENCHANTMENT_RATE : 0;
}

function itemRiskSurcharge(items: Item[]): number {
  return items.reduce((total, item) => {
    const itemBase = BASE_PREMIUMS[item.type] ?? COMPONENT_PREMIUM;
    return total + curseRisk(item, itemBase) + enchantmentRisk(item, itemBase);
  }, 0);
}

function loyaltyDiscount(base: number, yearsWithMHPCO: number): number {
  return yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_RATE : 0;
}

function followUpDiscount(base: number, priorQuotes: number): number {
  return priorQuotes > 0 ? base * FOLLOW_UP_RATE : 0;
}

function quote(step: Record<string, unknown>, yearsWithMHPCO: number, priorQuotes: number): number {
  const items = step.items as Item[];
  const base = basePremium(items);
  return Math.ceil(
    base + itemRiskSurcharge(items) + base * INITIAL_ASSESSMENT_RATE
      - loyaltyDiscount(base, yearsWithMHPCO) - followUpDiscount(base, priorQuotes) + PROCESSING_FEE,
  );
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + (INSURANCE_VALUES[item.type] ?? 0), 0);
}

function validateQuoteItems(items: Item[]): void {
  const unknownItem = items.find((item) => !KNOWN_ITEM_TYPES.has(item.type));
  if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

interface Damage {
  itemType: string;
  amount: number;
}

function reimbursement(item: Item, amount: number): number {
  const rate = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD ? HIGH_ENCHANTMENT_REIMBURSEMENT : 1;
  return Math.max(0, amount * rate - DEDUCTIBLE);
}

function allocateDamages(damages: Damage[], coveredItems: Item[]): Item[] {
  const available = [...coveredItems];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index < 0) throw new Error(`Damage item is not covered: ${damage.itemType}`);
    return available.splice(index, 1)[0]!;
  });
}

function settledPayout(desired: number, remainingCap: number): number {
  return Math.floor(Math.min(desired, remainingCap));
}

function processClaim(step: Record<string, unknown>, policy: Policy): Record<string, number> {
  const incident = step.incident as { damages: Damage[] };
  if (incident.damages.some((damage) => damage.amount < 0)) throw new Error("Damage amount must not be negative");
  const damagedItems = allocateDamages(incident.damages, policy.items);
  const desired = incident.damages.reduce((total, damage, index) => {
    return total + reimbursement(damagedItems[index]!, damage.amount);
  }, 0);
  const payout = settledPayout(desired, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): ScenarioResult {
  let quoteCount = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return processClaim(step, policies.get(step.policy as number)!);
    const items = step.items as Item[];
    validateQuoteItems(items);
    const premium = quote(step, scenario.customer.yearsWithMHPCO, quoteCount);
    policies.set(index, { items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER });
    quoteCount += 1;
    return { premium };
  });
  return { results };
}
