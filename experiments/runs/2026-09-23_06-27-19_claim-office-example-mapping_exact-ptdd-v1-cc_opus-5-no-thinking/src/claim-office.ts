export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

const PERCENT = 100;
const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const LOYALTY_YEARS = 2;
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_PERCENT = 50;
const CAP_FACTOR = 2;

const COMPONENT_TYPES = ["rune", "moonstone"];
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function roundInMHPCOFavour(premium: number): number {
  return Math.ceil(premium);
}

function basePremiumOf(type: string): number {
  const basePremium = BASE_PREMIUMS[type];
  if (basePremium === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return basePremium;
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function formsBuildingBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function basePremiumForType(type: string, count: number): number {
  return formsBuildingBlock(type, count) ? BLOCK_BASE_PREMIUM : count * basePremiumOf(type);
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function itemSurchargePercent(item: Item): number {
  const cursePercent = item.cursed ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantmentPercent = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return cursePercent + enchantmentPercent;
}

function itemSurchargeFor(item: Item): number {
  return (basePremiumOf(item.type) * itemSurchargePercent(item)) / PERCENT;
}

function itemSurcharges(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemSurchargeFor(item), 0);
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += basePremiumForType(type, count);
  }
  return total;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function loyaltyDiscountPercent(customer: Customer): number {
  return isLongStanding(customer) ? LOYALTY_DISCOUNT_PERCENT : 0;
}

function followUpContractDiscountPercent(previousContracts: number): number {
  return previousContracts > 0 ? FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
}

function policyModifierPercent(customer: Customer, previousContracts: number): number {
  return (
    FIRST_INSURANCE_SURCHARGE_PERCENT -
    loyaltyDiscountPercent(customer) -
    followUpContractDiscountPercent(previousContracts)
  );
}

export function quote(customer: Customer, items: Item[], previousContracts = 0): number {
  const basePremium = policyBasePremium(items);
  const policyAdjusted =
    (basePremium * (PERCENT + policyModifierPercent(customer, previousContracts))) / PERCENT;
  return roundInMHPCOFavour(policyAdjusted + itemSurcharges(items) + PROCESSING_FEE);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

function insuranceValueOf(type: string): number {
  const value = INSURANCE_VALUES[type];
  if (value === undefined) {
    throw new Error(`MHPCO does not insure items of type "${type}"`);
  }
  return value;
}

export function openPolicy(items: Item[]): Policy {
  const insuranceSum = items.reduce((sum, item) => sum + insuranceValueOf(item.type), 0);
  return { items, remainingCap: insuranceSum * CAP_FACTOR };
}

function isHalfReimbursed(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
}

function reimbursedShare(item: Item, amount: number): number {
  return isHalfReimbursed(item) ? (amount * HALF_REIMBURSEMENT_PERCENT) / PERCENT : amount;
}

function reimbursementFor(item: Item, damage: Damage): number {
  return Math.max(0, reimbursedShare(item, damage.amount) - DEDUCTIBLE);
}

function matchDamagesToInsuredItems(policy: Policy, damages: Damage[]): [Item, Damage][] {
  const uncovered = [...policy.items];
  return damages.map((damage) => {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
    }
    const index = uncovered.findIndex((candidate) => candidate.type === damage.itemType);
    if (index < 0) {
      throw new Error(`The policy does not cover a damaged item of type "${damage.itemType}"`);
    }
    return [uncovered.splice(index, 1)[0], damage];
  });
}

export function claim(policy: Policy, incident: Incident): ClaimResult {
  const matched = matchDamagesToInsuredItems(policy, incident.damages);
  const desired = matched.reduce((sum, [item, damage]) => sum + reimbursementFor(item, damage), 0);
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}
