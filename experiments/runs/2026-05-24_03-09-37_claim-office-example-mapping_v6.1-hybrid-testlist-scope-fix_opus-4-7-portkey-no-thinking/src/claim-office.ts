const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOWUP_DISCOUNT = 0.15;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCH_CLAIM_THRESHOLD = 8;
const HIGH_ENCH_REIMBURSEMENT = 0.5;

type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

type Damage = { itemType: string; amount: number };

type Customer = { yearsWithMHPCO: number };

type QuoteStep = { op: "quote"; items: Item[] };
type ClaimStep = { op: "claim"; policy: number; incident: { cause: string; damages: Damage[] } };
type Step = QuoteStep | ClaimStep;

type Scenario = { customer: Customer; steps: Step[] };

type QuoteResult = { premium: number };
type ClaimResult = { payout: number; remainingCap: number };

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

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const itemBase = (item: Item): number => {
  if (!(item.type in BASE_PREMIUMS)) {
    throw new Error(`unknown item type: ${item.type}`);
  }
  return BASE_PREMIUMS[item.type];
};

const itemSurcharge = (item: Item): number => {
  const base = itemBase(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE : 0;
  const highEnch =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnch;
};

const componentGroupBase = (count: number, perItem: number): number => {
  if (count === BLOCK_SIZE) return BLOCK_PRICE;
  return count * perItem;
};

const policyBaseAndSurcharges = (items: Item[]): { base: number; surcharges: number } => {
  const componentCounts = new Map<string, number>();
  let mainBase = 0;
  let surcharges = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      mainBase += itemBase(item);
      surcharges += itemSurcharge(item);
    }
  }
  let componentBase = 0;
  for (const [type, count] of componentCounts) {
    componentBase += componentGroupBase(count, BASE_PREMIUMS[type]);
  }
  return { base: mainBase + componentBase, surcharges };
};

const quotePremium = (items: Item[], customer: Customer, isFollowUp: boolean): number => {
  const { base, surcharges } = policyBaseAndSurcharges(items);
  const firstInsurance = base * FIRST_INSURANCE_SURCHARGE;
  const loyalty = customer.yearsWithMHPCO >= LOYALTY_YEARS ? base * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUp ? base * FOLLOWUP_DISCOUNT : 0;
  return Math.ceil(base + surcharges + firstInsurance - loyalty - followUp + PROCESSING_FEE);
};

const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, it) => sum + INSURANCE_VALUES[it.type], 0);

type Policy = { items: Item[]; remainingCap: number };

const isHighlyEnchantedForClaim = (item: Item): boolean =>
  (item.enchantment ?? 0) >= HIGH_ENCH_CLAIM_THRESHOLD;

const reimbursableAmount = (damage: Damage, item: Item): number =>
  isHighlyEnchantedForClaim(item) ? damage.amount * HIGH_ENCH_REIMBURSEMENT : damage.amount;

const damagePayout = (damage: Damage, item: Item): number =>
  Math.max(0, reimbursableAmount(damage, item) - DEDUCTIBLE);

const findItem = (policy: Policy, itemType: string): Item =>
  policy.items.find((it) => it.type === itemType)!;

const validateDamages = (policy: Policy, damages: Damage[]): void => {
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`damage amount must be non-negative, got ${d.amount}`);
    }
  }
  const itemCounts = new Map<string, number>();
  for (const it of policy.items) {
    itemCounts.set(it.type, (itemCounts.get(it.type) ?? 0) + 1);
  }
  const damageCounts = new Map<string, number>();
  for (const d of damages) {
    damageCounts.set(d.itemType, (damageCounts.get(d.itemType) ?? 0) + 1);
  }
  for (const [type, count] of damageCounts) {
    if ((itemCounts.get(type) ?? 0) < count) {
      throw new Error(`damage entries for ${type} exceed insured count`);
    }
  }
};

const processClaim = (policy: Policy, damages: Damage[]): ClaimResult => {
  validateDamages(policy, damages);
  const rawPayout = damages.reduce(
    (sum, d) => sum + damagePayout(d, findItem(policy, d.itemType)),
    0,
  );
  const payout = Math.floor(Math.min(rawPayout, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

export const runScenario = (input: unknown): unknown => {
  const scenario = input as Scenario;
  const policies: Policy[] = [];
  let quoteCount = 0;
  const results: (QuoteResult | ClaimResult)[] = scenario.steps.map((step) => {
    if (step.op === "quote") {
      const isFollowUp = quoteCount > 0;
      quoteCount += 1;
      const items = step.items;
      const premium = quotePremium(items, scenario.customer, isFollowUp);
      policies.push({ items, remainingCap: insuranceSum(items) * CAP_MULTIPLIER });
      return { premium };
    }
    return processClaim(policies[step.policy], step.incident.damages);
  });
  return { results };
};
