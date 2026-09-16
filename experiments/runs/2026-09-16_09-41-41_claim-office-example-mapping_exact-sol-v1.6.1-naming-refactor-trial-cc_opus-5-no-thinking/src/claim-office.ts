export interface Customer {
  yearsWithMHPCO: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const FRAGILE_ENCHANTMENT_LEVEL = 8;
const FRAGILE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const COMPONENT_INSURANCE_VALUE = 250;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: COMPONENT_INSURANCE_VALUE,
  moonstone: COMPONENT_INSURANCE_VALUE,
};

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: COMPONENT_BASE_PREMIUM,
  moonstone: COMPONENT_BASE_PREMIUM,
};

function priceListEntry(catalogue: Record<string, number>, type: string): number {
  const entry = catalogue[type];
  if (entry === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return entry;
}

function insuredValueOf(type: string): number {
  return priceListEntry(INSURANCE_VALUES, type);
}

function basePremiumOf(type: string): number {
  return priceListEntry(BASE_PREMIUMS, type);
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + insuredValueOf(item.type), 0);
}

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function countAlikeItems(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumForAlikeItems(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumOf(type);
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countAlikeItems(items)) {
    total += basePremiumForAlikeItems(type, count);
  }
  return total;
}

function riskSurchargeRate(item: Item): number {
  let rate = 0;
  if (item.cursed === true) {
    rate += CURSE_SURCHARGE_RATE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL) {
    rate += HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return rate;
}

function itemRiskSurcharges(items: Item[]): number {
  return items.reduce(
    (total, item) => total + basePremiumOf(item.type) * riskSurchargeRate(item),
    0,
  );
}

function customerModifierRate(customer: Customer, previousQuoteCount: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousQuoteCount > 0) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
}

export function quote(
  customer: Customer,
  items: Item[],
  previousQuoteCount: number,
): number {
  const basePremium = policyBasePremium(items);
  const premium =
    basePremium +
    itemRiskSurcharges(items) +
    basePremium * customerModifierRate(customer, previousQuoteCount) +
    PROCESSING_FEE;
  return roundPremiumInMHPCOsFavour(premium);
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

// The total payout per policy is capped at twice the insurance sum.
export function policyFor(items: Item[]): Policy {
  return { items, remainingCap: insuranceSum(items) * CAP_FACTOR };
}

// Dragon-material damage is fully reimbursed, which is also the rate for an
// item with no special clause; the 50 % high-enchantment clause overrides both.
function reimbursementRate(item: Item): number {
  if ((item.enchantment ?? 0) >= FRAGILE_ENCHANTMENT_LEVEL) {
    return FRAGILE_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}

function reimbursementFor(item: Item, damage: Damage): number {
  return Math.max(0, damage.amount * reimbursementRate(item) - DEDUCTIBLE);
}

function validateReportedDamage(damage: Damage): void {
  if (damage.amount < 0) {
    throw new Error(`a damage amount cannot be negative: ${damage.amount}`);
  }
}

// Each damage entry consumes one insured item of its type, so a second entry
// for a type the policy covers only once is not covered.
function damagedItems(policy: Policy, damages: Damage[]): Item[] {
  const uncovered = [...policy.items];
  return damages.map((damage) => {
    validateReportedDamage(damage);
    const index = uncovered.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`the policy does not cover a damaged "${damage.itemType}"`);
    }
    return uncovered.splice(index, 1)[0];
  });
}

function reimbursementForIncident(policy: Policy, damages: Damage[]): number {
  const items = damagedItems(policy, damages);
  return damages.reduce(
    (total, damage, index) => total + reimbursementFor(items[index], damage),
    0,
  );
}

export function claim(policy: Policy, damages: Damage[]): ClaimResult {
  const payout = roundPayoutInMHPCOsFavour(
    Math.min(reimbursementForIncident(policy, damages), policy.remainingCap),
  );
  return { payout, remainingCap: policy.remainingCap - payout };
}
