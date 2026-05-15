const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOWUP_RATE = 0.15;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const BLOCK_SIZE = 3;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export const KNOWN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion", "rune", "moonstone"]);

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };
type Result = QuoteResult | ClaimResult;

type Policy = { items: Item[]; cap: number; remainingCap: number };

const isComponent = (item: Item) => COMPONENT_TYPES.has(item.type);

const baseForCount = (count: number): number =>
  count === BLOCK_SIZE ? COMPONENT_BLOCK_BASE : count * COMPONENT_BASE;

const countByType = (items: Item[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const item of items) counts[item.type] = (counts[item.type] ?? 0) + 1;
  return counts;
};

const componentBase = (items: Item[]): number =>
  Object.values(countByType(items)).reduce((sum, count) => sum + baseForCount(count), 0);

const itemBase = (item: Item): number => BASE_PREMIUM[item.type];

const itemSurcharge = (item: Item): number => {
  const base = itemBase(item);
  const curseSurcharge = item.cursed ? base * CURSE_RATE : 0;
  const enchantmentSurcharge =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_RATE : 0;
  return curseSurcharge + enchantmentSurcharge;
};

const quotePremium = (items: Item[], customer: Customer, contractIndex: number): number => {
  const components = items.filter(isComponent);
  const mains = items.filter((i) => !isComponent(i));
  const policyBase = mains.reduce((sum, item) => sum + itemBase(item), 0) + componentBase(components);
  const itemSurcharges = mains.reduce((sum, item) => sum + itemSurcharge(item), 0);
  const firstInsurance = policyBase * FIRST_INSURANCE_RATE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_RATE : 0;
  const followUp = contractIndex > 0 ? policyBase * FOLLOWUP_RATE : 0;
  return Math.ceil(policyBase + itemSurcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
};

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + INSURANCE_VALUE[item.type], 0);

const damagePayout = (damage: Damage, item: Item | undefined): number => {
  const enchantment = item?.enchantment ?? 0;
  const reimbursableFraction = enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD
    ? HIGH_ENCHANTMENT_PAYOUT_RATE
    : 1;
  return Math.max(0, damage.amount * reimbursableFraction - DEDUCTIBLE);
};

const processClaim = (policy: Policy, incident: Incident): ClaimResult => {
  const grossPayout = incident.damages.reduce((sum, d) => {
    const item = policy.items.find((i) => i.type === d.itemType);
    return sum + damagePayout(d, item);
  }, 0);
  const payout = Math.floor(Math.min(grossPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  const policies: Record<number, Policy> = {};
  const results: Result[] = scenario.steps.map((step, index) => {
    if (step.op === "quote") {
      const cap = policyInsuranceSum(step.items) * CAP_MULTIPLIER;
      policies[index] = { items: step.items, cap, remainingCap: cap };
      return { premium: quotePremium(step.items, scenario.customer, index) };
    }
    return processClaim(policies[step.policy], step.incident);
  });
  return { results };
};
