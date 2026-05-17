type Item = { type: string; cursed?: boolean; enchantment?: number };
type Damage = { itemType: string; amount: number };
type Incident = { cause: string; damages: Damage[] };
type Step = { op: string; items?: Item[]; policy?: number; incident?: Incident };
type Customer = { yearsWithMHPCO: number };
type Input = { customer: Customer; steps: Step[] };
type Policy = { items: Item[]; remainingCap: number };

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_PAYOUT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

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

const sum = (values: number[]): number => values.reduce((a, b) => a + b, 0);

const itemBasePremium = (item: Item): number => BASE_PREMIUMS[item.type] ?? 0;

const isComponent = (item: Item): boolean => COMPONENT_TYPES.has(item.type);

const splitByComponentStatus = (items: Item[]): { components: Item[]; nonComponents: Item[] } => ({
  components: items.filter(isComponent),
  nonComponents: items.filter((item) => !isComponent(item)),
});

const groupByType = (items: Item[]): Item[][] => {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return [...groups.values()];
};

const componentGroupBasePremium = (group: Item[]): number =>
  group.length === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : sum(group.map(itemBasePremium));

const componentGroupBasePremiums = (components: Item[]): number[] =>
  groupByType(components).map(componentGroupBasePremium);

const policyBasePremium = (items: Item[]): number => {
  const { components, nonComponents } = splitByComponentStatus(items);
  return sum(nonComponents.map(itemBasePremium)) + sum(componentGroupBasePremiums(components));
};

const itemSurcharges = (item: Item): number => {
  const base = itemBasePremium(item);
  const curse = item.cursed ? base * CURSE_SURCHARGE_RATE : 0;
  const highEnch = (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD ? base * HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curse + highEnch;
};

const itemsSubtotal = (items: Item[]): number => {
  const { components, nonComponents } = splitByComponentStatus(items);
  const nonComponentPremiums = nonComponents.map(
    (item) => itemBasePremium(item) + itemSurcharges(item) + itemBasePremium(item) * FIRST_INSURANCE_SURCHARGE_RATE,
  );
  const componentGroupPremiums = componentGroupBasePremiums(components).map(
    (base) => base + base * FIRST_INSURANCE_SURCHARGE_RATE,
  );
  return sum(nonComponentPremiums) + sum(componentGroupPremiums);
};

const quotePremium = (items: Item[], customer: Customer, quoteIndex: number): number => {
  const subtotal = itemsSubtotal(items);
  const policyBase = policyBasePremium(items);
  const loyaltyDiscount = customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD ? policyBase * LOYALTY_DISCOUNT_RATE : 0;
  const followUpDiscount = quoteIndex >= 1 ? policyBase * FOLLOW_UP_DISCOUNT_RATE : 0;
  return Math.ceil(subtotal - loyaltyDiscount - followUpDiscount) + PROCESSING_FEE;
};

const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type] ?? 0));

const damageReimbursement = (item: Item | undefined, amount: number): number => {
  const enchantment = item?.enchantment ?? 0;
  const reimbursable = enchantment >= HIGH_ENCHANTMENT_PAYOUT_THRESHOLD ? amount * HIGH_ENCHANTMENT_PAYOUT_RATE : amount;
  return reimbursable - DEDUCTIBLE;
};

const processClaim = (step: Step, policies: Policy[]): { payout: number; remainingCap: number } => {
  const policy = policies[step.policy ?? 0];
  const damages = step.incident?.damages ?? [];
  const totalReimbursement = sum(
    damages.map((d) => damageReimbursement(policy.items.find((i) => i.type === d.itemType), d.amount)),
  );
  const payout = Math.min(Math.floor(totalReimbursement), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
};

const countByType = (items: { type?: string; itemType?: string }[], key: "type" | "itemType"): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    const t = item[key] as string;
    counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return counts;
};

const validateQuoteItems = (items: Item[]): void => {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

const validateClaim = (step: Step, policies: Policy[]): void => {
  const policy = policies[step.policy ?? 0];
  const damages = step.incident?.damages ?? [];
  const policyTypeCounts = countByType(policy.items, "type");
  const damageTypeCounts = new Map<string, number>();
  for (const d of damages) {
    if (d.amount < 0) {
      throw new Error(`Negative damage amount: ${d.amount}`);
    }
    if (!policyTypeCounts.has(d.itemType)) {
      throw new Error(`Claim against item not in policy: ${d.itemType}`);
    }
    damageTypeCounts.set(d.itemType, (damageTypeCounts.get(d.itemType) ?? 0) + 1);
    if (damageTypeCounts.get(d.itemType)! > policyTypeCounts.get(d.itemType)!) {
      throw new Error(`More damages of type ${d.itemType} than insured items`);
    }
  }
};

export const runScenario = (input: unknown): unknown => {
  const { customer, steps } = input as Input;
  let quoteIndex = 0;
  const policies: Policy[] = [];
  const results = steps.map((step) => {
    if (step.op === "quote") {
      const items = step.items ?? [];
      validateQuoteItems(items);
      const premium = quotePremium(items, customer, quoteIndex);
      quoteIndex++;
      policies.push({ items, remainingCap: CAP_MULTIPLIER * insuranceSum(items) });
      return { premium };
    }
    validateClaim(step, policies);
    return processClaim(step, policies);
  });
  return { results };
};
