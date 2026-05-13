export type Customer = { yearsWithMHPCO: number };
export type Item = { type: string; material?: string; enchantment?: number; cursed?: boolean };
export type Damage = { itemType: string; amount: number };
export type Incident = { cause?: string; damages: Damage[] };
export type Step =
  | { op: "quote"; items: Item[] }
  | { op: "claim"; policy: number; incident: Incident };
export type Scenario = { customer: Customer; steps: Step[] };
export type Result = { premium: number } | { payout: number; remainingCap: number };

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const PROCESSING_FEE = 5;

const MAIN_ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = new Set<string>(["rune", "moonstone"]);
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_BLOCK_SIZE = 3;

const CURSE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_RATE = 0.15;

const componentsBaseTotal = (items: Item[]): number => {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  let total = 0;
  for (const count of counts.values()) {
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }
  return total;
};

const mainItemsBaseTotal = (items: Item[]): number =>
  items
    .filter((i) => i.type in MAIN_ITEM_BASE_PREMIUM)
    .reduce((sum, i) => sum + MAIN_ITEM_BASE_PREMIUM[i.type], 0);

const itemSurcharges = (item: Item): number => {
  const base = MAIN_ITEM_BASE_PREMIUM[item.type] ?? 0;
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += base * HIGH_ENCHANTMENT_RATE;
  return surcharge;
};

const totalSurcharges = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemSurcharges(item), 0);

const policyBasePremium = (items: Item[]): number =>
  mainItemsBaseTotal(items) + componentsBaseTotal(items);

const isKnownItemType = (type: string): boolean =>
  type in MAIN_ITEM_BASE_PREMIUM || COMPONENT_TYPES.has(type);

const validateItems = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item.type)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const quotePremium = (customer: Customer, items: Item[], priorQuoteCount: number): number => {
  validateItems(items);
  const policyBase = policyBasePremium(items);
  const itemSpecific = totalSurcharges(items);
  let policyWide = 0;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) policyWide -= policyBase * LOYALTY_RATE;
  policyWide += policyBase * FIRST_INSURANCE_RATE;
  if (priorQuoteCount > 0) policyWide -= policyBase * FOLLOW_UP_RATE;
  const total = policyBase + itemSpecific + policyWide + PROCESSING_FEE;
  return Math.ceil(total);
};

const itemInsuranceValue = (item: Item): number => {
  if (item.type in MAIN_ITEM_INSURANCE_VALUE) return MAIN_ITEM_INSURANCE_VALUE[item.type];
  if (COMPONENT_TYPES.has(item.type)) return COMPONENT_INSURANCE_VALUE;
  return 0;
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);

type Policy = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_DAMAGE_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const reimbursableAmount = (item: Item, damageAmount: number): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_DAMAGE_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
};

const findItem = (items: Item[], itemType: string): Item | undefined =>
  items.find((i) => i.type === itemType);

const tally = (keys: string[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const k of keys) counts.set(k, (counts.get(k) ?? 0) + 1);
  return counts;
};

const processClaim = (policy: Policy, incident: Incident): { payout: number; remainingCap: number } => {
  const policyCounts = tally(policy.items.map((i) => i.type));
  const damageCounts = tally(incident.damages.map((d) => d.itemType));
  for (const [type, count] of damageCounts) {
    const insured = policyCounts.get(type) ?? 0;
    if (count > insured) {
      throw new Error(`More damage entries (${count}) of type ${type} than insured (${insured})`);
    }
  }
  let payout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    const item = findItem(policy.items, damage.itemType)!; // guaranteed by count check above
    const reimbursable = reimbursableAmount(item, damage.amount);
    const after = reimbursable - DEDUCTIBLE;
    if (after > 0) payout += after;
  }
  const capped = Math.min(payout, policy.remainingCap);
  const finalPayout = Math.floor(capped);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
};

export const runScenario = (scenario: Scenario): { results: Result[] } => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results: Result[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const premium = quotePremium(scenario.customer, step.items, quoteCount);
      quoteCount += 1;
      const cap = insuranceSum(step.items) * CAP_MULTIPLIER;
      policies.push({ items: step.items, remainingCap: cap });
      return { premium };
    }
    const policy = policies[step.policy];
    return processClaim(policy, step.incident);
  });
  return { results };
};
