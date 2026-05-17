const PROCESSING_FEE = 5;
const BLOCK_SIZE = 3;
const BLOCK_PRICE = 60;
const COMPONENT_BASE = 25;
const FIRST_INS_SURCHARGE = 0.1;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCH_SURCHARGE = 0.3;
const HIGH_ENCH_THRESHOLD = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const DEDUCTIBLE = 100;
const HIGH_ENCH_CLAIM_THRESHOLD = 8;
const HIGH_ENCH_CLAIM_FACTOR = 0.5;
const INSURANCE_VALUE_MULTIPLIER = 10;

const BASE_PREMIUM_BY_ITEM_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export type Item = {
  type: string;
  enchantment?: number;
  cursed?: boolean;
  material?: string;
};

export type Customer = {
  yearsWithMHPCO?: number;
};

export type QuoteInput = {
  customer?: Customer;
  items: Item[];
  isFollowUp?: boolean;
};

export type QuoteResult = {
  premium: number;
};

export type DamageEntry = {
  itemType: string;
  amount: number;
};

export type Policy = {
  items: Item[];
  remainingCap: number;
};

export type Incident = {
  cause?: string;
  damages: DamageEntry[];
};

export type ClaimInput = {
  policy: Policy;
  incident: Incident;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

export const isKnownItemType = (type: string): boolean =>
  type in BASE_PREMIUM_BY_ITEM_TYPE;

export const insuranceValueFor = (item: Item): number =>
  (BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0) * INSURANCE_VALUE_MULTIPLIER;

const baseForItem = (item: Item): number =>
  BASE_PREMIUM_BY_ITEM_TYPE[item.type] ?? 0;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.has(item.type);

const itemModifierSum = (item: Item): number => {
  let mod = FIRST_INS_SURCHARGE;
  if (item.cursed) mod += CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCH_THRESHOLD) mod += HIGH_ENCH_SURCHARGE;
  return mod;
};

const itemCharge = (item: Item): number =>
  baseForItem(item) * (1 + itemModifierSum(item));

type Pricing = { base: number; charge: number };

const addPricing = (a: Pricing, b: Pricing): Pricing => ({
  base: a.base + b.base,
  charge: a.charge + b.charge,
});

const componentGroupBase = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PRICE : count * COMPONENT_BASE;

const componentsPricing = (items: Item[]): Pricing => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (isComponent(item)) counts[item.type] = (counts[item.type] ?? 0) + 1;
  }
  let base = 0;
  for (const type in counts) base += componentGroupBase(counts[type]);
  return { base, charge: base * (1 + FIRST_INS_SURCHARGE) };
};

const nonComponentsPricing = (items: Item[]): Pricing =>
  items
    .filter((item) => !isComponent(item))
    .reduce<Pricing>(
      (acc, item) => ({
        base: acc.base + baseForItem(item),
        charge: acc.charge + itemCharge(item),
      }),
      { base: 0, charge: 0 },
    );

const policyDiscountRate = (input: QuoteInput): number => {
  let rate = 0;
  if ((input.customer?.yearsWithMHPCO ?? 0) >= LOYALTY_THRESHOLD) rate += LOYALTY_DISCOUNT;
  if (input.isFollowUp) rate += FOLLOW_UP_DISCOUNT;
  return rate;
};

// Round to 8 decimals to scrub floating-point noise, then round up to whole gold.
const roundUpToWholeGold = (value: number): number =>
  Math.ceil(Math.round(value * 1e8) / 1e8);

export function quote(input: QuoteInput): QuoteResult {
  const { base, charge } = addPricing(
    nonComponentsPricing(input.items),
    componentsPricing(input.items),
  );
  const raw = charge - base * policyDiscountRate(input) + PROCESSING_FEE;
  return { premium: roundUpToWholeGold(raw) };
}

const isHighEnchantment = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= HIGH_ENCH_CLAIM_THRESHOLD;

const damagePayout = (damage: DamageEntry, items: Item[]): number => {
  const item = items.find((i) => i.type === damage.itemType);
  const reimbursable = isHighEnchantment(item)
    ? damage.amount * HIGH_ENCH_CLAIM_FACTOR
    : damage.amount;
  return reimbursable - DEDUCTIBLE;
};

export function claim(input: ClaimInput): ClaimResult {
  const requested = input.incident.damages.reduce(
    (sum, damage) => sum + damagePayout(damage, input.policy.items),
    0,
  );
  const payout = Math.min(requested, input.policy.remainingCap);
  return { payout, remainingCap: input.policy.remainingCap - payout };
}
