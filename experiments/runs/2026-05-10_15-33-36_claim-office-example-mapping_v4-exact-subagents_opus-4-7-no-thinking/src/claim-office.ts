// claim-office.ts

type Customer = { yearsWithMHPCO: number; previousContracts?: number };
type ItemType = "sword" | "amulet" | "staff" | "potion" | "rune" | "moonstone";
type Item = {
  type: ItemType;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Damage = { itemType: ItemType; amount: number };
export type Incident = { cause: string; damages: Damage[] };
export type Policy = { items: Item[]; cap: number; remainingCap: number };
export type ClaimResult = { payout: number; remainingCap: number };

const PROCESSING_FEE = 5;
const INSURANCE_SURCHARGE_RATE = 0.1;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PRICE = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!(item.type in BASE_PREMIUMS)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function itemSurchargeRate(item: Item): number {
  const curseRate = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const highEnchantmentRate =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
      ? HIGH_ENCHANTMENT_SURCHARGE_RATE
      : 0;
  return curseRate + highEnchantmentRate;
}

function itemSurcharge(item: Item): number {
  return BASE_PREMIUMS[item.type] * itemSurchargeRate(item);
}

function componentBlockPremium(count: number, unitPrice: number): number {
  return count === COMPONENT_BLOCK_SIZE
    ? COMPONENT_BLOCK_PRICE
    : count * unitPrice;
}

// Sum of item base premiums (with component block discount applied,
// but without item-level surcharges).
function policyBasePremium(items: Item[]): number {
  const componentCounts: Record<string, number> = {};
  let nonComponentBase = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      nonComponentBase += BASE_PREMIUMS[item.type];
    }
  }
  const componentBase = Object.entries(componentCounts).reduce(
    (total, [type, count]) =>
      total + componentBlockPremium(count, BASE_PREMIUMS[type]),
    0
  );
  return nonComponentBase + componentBase;
}

function totalItemSurcharges(items: Item[]): number {
  return items
    .filter((i) => !COMPONENT_TYPES.has(i.type))
    .reduce((total, item) => total + itemSurcharge(item), 0);
}

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

export function createPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce(
    (total, item) => total + INSURANCE_VALUES[item.type],
    0
  );
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, cap, remainingCap: cap };
}

function findMatchingItem(items: Item[], itemType: ItemType, used: Set<number>): Item | undefined {
  for (let i = 0; i < items.length; i++) {
    if (!used.has(i) && items[i].type === itemType) {
      used.add(i);
      return items[i];
    }
  }
  return undefined;
}

function reimbursementForItem(item: Item, damageAmount: number): number {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD) {
    return damageAmount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return damageAmount;
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const used = new Set<number>();
  let totalPayout = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`negative damage amount: ${damage.amount}`);
    }
    const item = findMatchingItem(policy.items, damage.itemType, used);
    if (!item) {
      throw new Error(`damage references item not in policy: ${damage.itemType}`);
    }
    const reimbursement = reimbursementForItem(item, damage.amount);
    const afterDeductible = Math.max(0, reimbursement - DEDUCTIBLE);
    totalPayout += afterDeductible;
  }
  const cappedPayout = Math.min(totalPayout, policy.remainingCap);
  const finalPayout = Math.floor(cappedPayout);
  policy.remainingCap -= finalPayout;
  return { payout: finalPayout, remainingCap: policy.remainingCap };
}

export function quote(customer: Customer, items: Item[]): number {
  assertKnownItemTypes(items);
  const policyBase = policyBasePremium(items);
  const itemSurcharges = totalItemSurcharges(items);
  const insuranceSurcharge = policyBase * INSURANCE_SURCHARGE_RATE;
  const loyaltyDiscount =
    customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
      ? policyBase * LOYALTY_DISCOUNT_RATE
      : 0;
  const followUpDiscount =
    (customer.previousContracts ?? 0) > 0
      ? policyBase * FOLLOW_UP_DISCOUNT_RATE
      : 0;
  return Math.ceil(
    policyBase
      + itemSurcharges
      + insuranceSurcharge
      - loyaltyDiscount
      - followUpDiscount
      + PROCESSING_FEE
  );
}
