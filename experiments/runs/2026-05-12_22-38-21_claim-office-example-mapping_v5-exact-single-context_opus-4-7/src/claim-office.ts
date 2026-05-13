type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};
type Customer = { yearsWithMHPCO: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: Incident };
type Step = QuoteStep | ClaimStep;
type Scenario = { customer: Customer; steps: Step[] };

const MAIN_ITEM_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
};

const MAIN_ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};
const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_BASE = 60;
const COMPONENT_BLOCK_SIZE = 3;

const componentsBase = (items: Item[]): number => {
  const countByType: Record<string, number> = {};
  for (const i of items) {
    if (COMPONENT_TYPES.has(i.type)) {
      countByType[i.type] = (countByType[i.type] ?? 0) + 1;
    }
  }
  let total = 0;
  for (const count of Object.values(countByType)) {
    total += count === COMPONENT_BLOCK_SIZE ? COMPONENT_BLOCK_BASE : count * COMPONENT_BASE;
  }
  return total;
};

const KNOWN_ITEM_TYPES = new Set([...Object.keys(MAIN_ITEM_BASE), ...COMPONENT_TYPES]);

const mainItemBase = (item: Item): number => MAIN_ITEM_BASE[item.type] ?? 0;

const mainItemsBase = (items: Item[]): number =>
  items
    .filter((i) => !COMPONENT_TYPES.has(i.type))
    .reduce((sum, i) => sum + mainItemBase(i), 0);

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const itemSurcharges = (items: Item[]): number => {
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) continue;
    const base = mainItemBase(item);
    if (item.cursed) total += base * CURSE_SURCHARGE;
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      total += base * HIGH_ENCHANTMENT_SURCHARGE;
    }
  }
  return total;
};

const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

const computeQuote = (
  items: Item[],
  customer: Customer,
  quoteIndex: number,
): { premium: number } => {
  const policyBase = mainItemsBase(items) + componentsBase(items);
  const surcharges = itemSurcharges(items);
  const firstInsurance = policyBase * FIRST_INSURANCE_SURCHARGE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUpDiscount = quoteIndex > 0 ? policyBase * FOLLOWUP_DISCOUNT : 0;
  const premium =
    policyBase + surcharges + firstInsurance - loyaltyDiscount - followUpDiscount + PROCESSING_FEE;
  return { premium: Math.ceil(premium) };
};

const itemInsuranceValue = (item: Item): number =>
  COMPONENT_TYPES.has(item.type)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEM_INSURANCE_VALUE[item.type] ?? 0;

const policyInsuranceSum = (items: Item[]): number =>
  items.reduce((sum, i) => sum + itemInsuranceValue(i), 0);

type Policy = { items: Item[]; remainingCap: number };

const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_CLAIM_RATE = 0.5;
const DRAGON_MATERIAL = "dragon";

const reimbursableAmount = (item: Item | undefined, damageAmount: number): number => {
  if (item && (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_CLAIM_RATE;
  }
  return damageAmount;
};

const computeClaim = (
  policy: Policy,
  incident: Incident,
): { payout: number; remainingCap: number } => {
  let totalPayout = 0;
  const insuredItemsByType: Item[] = [...policy.items];
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
    const itemIdx = insuredItemsByType.findIndex((i) => i.type === damage.itemType);
    if (itemIdx < 0) {
      throw new Error(`No insured ${damage.itemType} available for damage claim`);
    }
    const [item] = insuredItemsByType.splice(itemIdx, 1);
    const reimbursable = reimbursableAmount(item, damage.amount);
    const afterDeductible = Math.max(0, reimbursable - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  return {
    payout: Math.floor(cappedPayout),
    remainingCap: policy.remainingCap - cappedPayout,
  };
};

export const processScenario = (scenario: Scenario): unknown => {
  let quoteCount = 0;
  const policies: Policy[] = [];
  const results = scenario.steps.map((step) => {
    if (step.op === "quote") {
      for (const item of step.items) {
        if (!KNOWN_ITEM_TYPES.has(item.type)) {
          throw new Error(`Unknown item type: ${item.type}`);
        }
      }
      const r = computeQuote(step.items, scenario.customer, quoteCount);
      quoteCount += 1;
      policies.push({
        items: step.items,
        remainingCap: policyInsuranceSum(step.items) * CAP_MULTIPLIER,
      });
      return r;
    }
    const policy = policies[step.policy];
    const claimResult = computeClaim(policy, step.incident);
    policy.remainingCap = claimResult.remainingCap;
    return claimResult;
  });
  return { results };
};
