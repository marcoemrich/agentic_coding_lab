export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE_G = 5;

const MAIN_ITEM_BASE_PREMIUM_G: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM_G = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM_G = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function componentGroupBasePremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM_G;
  }
  return count * COMPONENT_BASE_PREMIUM_G;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const count of countByType(components).values()) {
    total += componentGroupBasePremium(count);
  }
  return total;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargeRate(item: Item): number {
  const curseRate = item.cursed === true ? CURSE_SURCHARGE_RATE : 0;
  const enchantmentRate = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0;
  return curseRate + enchantmentRate;
}

function isInsurable(item: Item): boolean {
  return isComponent(item) || item.type in MAIN_ITEM_BASE_PREMIUM_G;
}

function rejectUninsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurable(item)) {
      throw new Error(`MHPCO does not insure items of type "${item.type}"`);
    }
  }
}

function mainItemsOf(items: Item[]): Item[] {
  return items.filter((item) => !isComponent(item));
}

function mainItemListedPremium(item: Item): number {
  return MAIN_ITEM_BASE_PREMIUM_G[item.type];
}

function listedPremium(items: Item[]): number {
  const mainTotal = mainItemsOf(items).reduce(
    (total, item) => total + mainItemListedPremium(item),
    0,
  );
  return mainTotal + componentsBasePremium(items.filter(isComponent));
}

function itemSurcharges(items: Item[]): number {
  return mainItemsOf(items).reduce(
    (total, item) => total + mainItemListedPremium(item) * itemSurchargeRate(item),
    0,
  );
}

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierRate(customer: Customer, contractIndex: number): number {
  const loyaltyRate = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUpRate = contractIndex > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;
  return loyaltyRate + followUpRate + FIRST_INSURANCE_SURCHARGE_RATE;
}

export function quote(customer: Customer, items: Item[], contractIndex: number): number {
  rejectUninsurableItems(items);
  const listed = listedPremium(items);
  const premium =
    listed +
    itemSurcharges(items) +
    listed * policyModifierRate(customer, contractIndex) +
    PROCESSING_FEE_G;
  return roundPremiumInMHPCOsFavour(premium);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

const INSURANCE_VALUE_G: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE_G = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;

function reimbursementRate(item: Item): number {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL ? REDUCED_REIMBURSEMENT_RATE : 1;
}

function damagePayout(item: Item, damage: Damage): number {
  return damage.amount * reimbursementRate(item) - DEDUCTIBLE_G;
}

function insuranceSum(policy: Item[]): number {
  return policy.reduce((total, item) => total + INSURANCE_VALUE_G[item.type], 0);
}

function policyCap(policy: Item[]): number {
  return insuranceSum(policy) * CAP_MULTIPLIER;
}

function insuredItemFor(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex((candidate) => candidate.type === damage.itemType);
  if (index === -1) {
    throw new Error(`The policy does not cover an item of type "${damage.itemType}"`);
  }
  return unclaimed.splice(index, 1)[0];
}

function rejectNegativeDamageAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
    }
  }
}

function totalDamagePayout(policy: Item[], incident: Incident): number {
  const unclaimed = [...policy];
  let total = 0;
  for (const damage of incident.damages) {
    total += damagePayout(insuredItemFor(unclaimed, damage), damage);
  }
  return total;
}

function payoutWithinCap(desired: number, availableCap: number): number {
  return Math.min(desired, availableCap);
}

export function claim(policy: Item[], incident: Incident, remainingCap?: number): ClaimResult {
  rejectNegativeDamageAmounts(incident);
  const availableCap = remainingCap ?? policyCap(policy);
  const total = totalDamagePayout(policy, incident);
  const payout = payoutWithinCap(roundPayoutInMHPCOsFavour(total), availableCap);
  return { payout, remainingCap: availableCap - payout };
}
