// claim-office.ts

export type Customer = {
  yearsWithMHPCO: number;
  previousContracts?: number;
};

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type QuoteInput = {
  customer: Customer;
  items: Item[];
};

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS_THRESHOLD = 2;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const COMPONENT_BASE = 25;
const COMPONENT_BLOCK_PREMIUM = 60;
const CLAIM_DEDUCTIBLE = 100;
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const CLAIM_HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

export const KNOWN_ITEM_TYPES: Set<string> = new Set(Object.keys(ITEM_BASE_PREMIUMS));

export function isKnownItemType(type: string): boolean {
  return KNOWN_ITEM_TYPES.has(type);
}

function isComponentType(type: string): boolean {
  return ITEM_BASE_PREMIUMS[type] === COMPONENT_BASE;
}

function groupItemsByType(items: Item[]): Map<string, Item[]> {
  const groups = new Map<string, Item[]>();
  for (const item of items) {
    const group = groups.get(item.type) ?? [];
    group.push(item);
    groups.set(item.type, group);
  }
  return groups;
}

function totalSurchargeRate(item: Item): number {
  const cursedRate = item.cursed ? CURSED_SURCHARGE_RATE : 0;
  const highEnchantmentRate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return cursedRate + highEnchantmentRate;
}

function calculateItemSurcharge(type: string, item: Item): number {
  const base = ITEM_BASE_PREMIUMS[type];
  return base * totalSurchargeRate(item);
}

function calculateGroupBase(type: string, group: Item[]): number {
  if (isComponentType(type) && group.length === 3) {
    return COMPONENT_BLOCK_PREMIUM;
  }
  return group.length * ITEM_BASE_PREMIUMS[type];
}

function calculatePolicyBase(items: Item[]): number {
  const groups = groupItemsByType(items);
  return Array.from(groups).reduce(
    (total, [type, group]) => total + calculateGroupBase(type, group),
    0
  );
}

function calculateItemSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + calculateItemSurcharge(item.type, item),
    0
  );
}

function calculateLoyaltyDiscount(customer: Customer, policyBase: number): number {
  if (customer.yearsWithMHPCO < LOYALTY_YEARS_THRESHOLD) {
    return 0;
  }
  return policyBase * LOYALTY_DISCOUNT_RATE;
}

function calculateFollowUpDiscount(customer: Customer, policyBase: number): number {
  const hasPreviousContracts = (customer.previousContracts ?? 0) >= 1;
  if (!hasPreviousContracts) {
    return 0;
  }
  return policyBase * FOLLOW_UP_DISCOUNT_RATE;
}

function calculateFirstInsuranceSurcharge(policyBase: number): number {
  return policyBase * FIRST_INSURANCE_RATE;
}

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type PolicyState = {
  items: Item[];
  remainingCap: number;
};

export type ClaimInput = {
  policy: PolicyState;
  incident: Incident;
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

function isHighEnchantmentForClaim(item: Item | undefined): boolean {
  return (item?.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;
}

function calculateDamagePayout(damage: Damage, items: Item[]): number {
  const item = items.find((i) => i.type === damage.itemType);
  const adjustedDamage = isHighEnchantmentForClaim(item)
    ? damage.amount * CLAIM_HIGH_ENCHANTMENT_PAYOUT_RATE
    : damage.amount;
  return Math.max(adjustedDamage - CLAIM_DEDUCTIBLE, 0);
}

function sumDamagePayouts(damages: Damage[], items: Item[]): number {
  return damages.reduce(
    (total, damage) => total + calculateDamagePayout(damage, items),
    0
  );
}

function capPayout(payout: number, remainingCap: number): number {
  return Math.min(payout, remainingCap);
}

export function claim(input: ClaimInput): ClaimResult {
  const rawPayout = Math.floor(sumDamagePayouts(input.incident.damages, input.policy.items));
  const payout = capPayout(rawPayout, input.policy.remainingCap);
  return { payout, remainingCap: input.policy.remainingCap - payout };
}

const ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;

export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + ITEM_INSURANCE_VALUES[item.type], 0);
}

export function cap(items: Item[]): number {
  return CAP_MULTIPLIER * insuranceSum(items);
}

export function quote(input: QuoteInput): number {
  const policyBase = calculatePolicyBase(input.items);
  const itemSurcharges = calculateItemSurcharges(input.items);
  const firstInsuranceSurcharge = calculateFirstInsuranceSurcharge(policyBase);
  const loyaltyDiscount = calculateLoyaltyDiscount(input.customer, policyBase);
  const followUpDiscount = calculateFollowUpDiscount(input.customer, policyBase);
  return Math.ceil(
    policyBase +
      itemSurcharges +
      firstInsuranceSurcharge +
      PROCESSING_FEE -
      loyaltyDiscount -
      followUpDiscount
  );
}
