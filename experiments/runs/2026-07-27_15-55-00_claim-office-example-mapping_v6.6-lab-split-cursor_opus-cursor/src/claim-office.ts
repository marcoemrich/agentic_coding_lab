const ITEM_BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const ITEM_INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const componentGroupPremium = (count: number): number =>
  count === BLOCK_SIZE ? BLOCK_PREMIUM : count * COMPONENT_PREMIUM;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const mainItemPremium = (item: Item): number => {
  const base = ITEM_BASE_PREMIUM[item.type];
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSE_SURCHARGE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE;
  }
  return base + surcharge;
};

const sumPolicyBase = (items: Item[], priceMainItem: (item: Item) => number): number => {
  const componentCounts: Record<string, number> = {};
  let total = 0;
  for (const item of items) {
    if (COMPONENT_TYPES.has(item.type)) {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    } else {
      total += priceMainItem(item);
    }
  }
  for (const count of Object.values(componentCounts)) {
    total += componentGroupPremium(count);
  }
  return total;
};

export const basePremium = (items: Item[]): number =>
  sumPolicyBase(items, mainItemPremium);

const CAP_MULTIPLIER = 2;

export const insuranceSum = (items: Item[]): number =>
  items.reduce((sum, item) => sum + ITEM_INSURANCE_VALUE[item.type], 0);

export const policyCap = (items: Item[]): number => insuranceSum(items) * CAP_MULTIPLIER;

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT = 0.2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;
const PROCESSING_FEE = 5;

interface Customer {
  yearsWithMHPCO: number;
}

const rawPolicyBase = (items: Item[]): number =>
  sumPolicyBase(items, (item) => ITEM_BASE_PREMIUM[item.type]);

const roundInFavor = (amount: number): number => Math.ceil(amount);

export const quote = (customer: Customer, items: Item[], contractIndex: number): number => {
  for (const item of items) {
    if (!COMPONENT_TYPES.has(item.type) && ITEM_BASE_PREMIUM[item.type] === undefined) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
  const policyBase = basePremium(items);
  const rawBase = rawPolicyBase(items);
  let premium = policyBase;
  premium += rawBase * FIRST_INSURANCE_SURCHARGE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    premium -= rawBase * LOYALTY_DISCOUNT;
  }
  if (contractIndex > 0) {
    premium -= rawBase * FOLLOWUP_DISCOUNT;
  }
  premium += PROCESSING_FEE;
  return roundInFavor(premium);
};

const DEDUCTIBLE = 100;

interface Policy {
  items: Item[];
}

interface Damage {
  itemType: string;
  amount: number;
}

interface Incident {
  cause: string;
  damages: Damage[];
}

interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const HIGH_ENCHANTMENT_PAYOUT_LEVEL = 8;
const HIGH_ENCHANTMENT_PAYOUT_RATE = 0.5;

const roundPayoutInFavor = (amount: number): number => Math.floor(amount);

const reimbursementRate = (item: Item): number => {
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PAYOUT_LEVEL) {
    return HIGH_ENCHANTMENT_PAYOUT_RATE;
  }
  return 1;
};

export const claim = (policy: Policy, incident: Incident, capRemaining: number): ClaimResult => {
  const available = [...policy.items];
  let raw = 0;
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Negative damage amount: ${damage.amount}`);
    }
    const index = available.findIndex((i) => i.type === damage.itemType);
    if (index === -1) {
      throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
    }
    const item = available.splice(index, 1)[0];
    const reimbursed = damage.amount * reimbursementRate(item);
    raw += Math.max(0, reimbursed - DEDUCTIBLE);
  }
  const payout = Math.min(roundPayoutInFavor(raw), capRemaining);
  return { payout, remainingCap: capRemaining - payout };
};
