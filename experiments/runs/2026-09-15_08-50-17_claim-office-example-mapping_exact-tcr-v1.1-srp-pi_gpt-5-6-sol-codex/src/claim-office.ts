export interface Scenario {
  customer: { yearsWithMHPCO: number };
  steps: Array<{ op: string; items?: Item[]; policy?: number; incident?: Incident }>;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface Incident {
  cause: string;
  damages: Array<{ itemType: string; amount: number }>;
}

interface Price {
  insuranceValue: number;
  basePremium: number;
}

const PRICE_LIST: Record<string, Price> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_SAVING = 15;
const CURSE_DIVISOR = 2;
const ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const ENCHANTMENT_SURCHARGE_NUMERATOR = 3;
const ENCHANTMENT_SURCHARGE_DENOMINATOR = 10;
const LOYALTY_YEARS = 2;
const LOYALTY_DIVISOR = 5;
const FOLLOW_UP_DISCOUNT_NUMERATOR = 3;
const FOLLOW_UP_DISCOUNT_DENOMINATOR = 20;
const INITIAL_ASSESSMENT_DIVISOR = 10;
const PROCESSING_FEE = 5;
const CLAIM_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_REDUCTION_DIVISOR = 2;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

function quoteBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  for (const item of items.filter(({ type }) => type === "rune" || type === "moonstone")) {
    componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
  }
  return items.reduce((sum, item) => sum + (PRICE_LIST[item.type]?.basePremium ?? 0), 0)
    - [...componentCounts.values()].filter((count) => count === COMPONENT_BLOCK_SIZE).length * COMPONENT_BLOCK_SAVING;
}

function quotePremium(items: Item[], yearsWithMHPCO: number, previousContracts: number): number {
  const basePremium = quoteBasePremium(items);
  const curseSurcharge = items
    .filter(({ cursed }) => cursed)
    .reduce((sum, item) => sum + (PRICE_LIST[item.type]?.basePremium ?? 0) / CURSE_DIVISOR, 0);
  const enchantmentSurcharge = items
    .filter(({ enchantment }) => (enchantment ?? 0) >= ENCHANTMENT_PREMIUM_THRESHOLD)
    .reduce((sum, item) => sum + (PRICE_LIST[item.type]?.basePremium ?? 0) * ENCHANTMENT_SURCHARGE_NUMERATOR / ENCHANTMENT_SURCHARGE_DENOMINATOR, 0);
  const loyaltyDiscount = yearsWithMHPCO >= LOYALTY_YEARS ? basePremium / LOYALTY_DIVISOR : 0;
  const followUpDiscount = previousContracts > 0 ? basePremium * FOLLOW_UP_DISCOUNT_NUMERATOR / FOLLOW_UP_DISCOUNT_DENOMINATOR : 0;
  return Math.ceil(basePremium + curseSurcharge + enchantmentSurcharge + basePremium / INITIAL_ASSESSMENT_DIVISOR - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function claimPolicy(policy: Policy, incident: Incident): Record<string, number> {
  const available = [...policy.items];
  const negativeDamage = incident.damages.find(({ amount }) => amount < 0);
  if (negativeDamage) throw new Error("Damage amount cannot be negative");
  const rawPayout = incident.damages.reduce((total, damage) => {
    const index = available.findIndex(({ type }) => type === damage.itemType);
    if (index < 0) throw new Error(`Item ${damage.itemType} is not covered by policy`);
    const [item] = available.splice(index, 1);
    const reimbursed = (item.enchantment ?? 0) >= CLAIM_ENCHANTMENT_THRESHOLD
      ? damage.amount / CLAIM_REDUCTION_DIVISOR : damage.amount;
    return total + Math.max(0, reimbursed - DEDUCTIBLE);
  }, 0);
  const payout = Math.min(Math.floor(rawPayout), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export function processScenario(scenario: Scenario): { results: Array<Record<string, number>> } {
  let previousContracts = 0;
  const policies = new Map<number, Policy>();
  const results = scenario.steps.map((step, index) => {
    if (step.op === "claim") return claimPolicy(policies.get(step.policy ?? -1)!, step.incident!);
    const items = step.items ?? [];
    const unknownItem = items.find(({ type }) => PRICE_LIST[type] === undefined);
    if (unknownItem) throw new Error(`Unknown item type: ${unknownItem.type}`);
    const insuranceSum = items.reduce((sum, item) => sum + PRICE_LIST[item.type].insuranceValue, 0);
    policies.set(index, { items, remainingCap: insuranceSum * CAP_MULTIPLIER });
    const result = { premium: quotePremium(items, scenario.customer.yearsWithMHPCO, previousContracts) };
    previousContracts += 1;
    return result;
  });
  return { results };
}
