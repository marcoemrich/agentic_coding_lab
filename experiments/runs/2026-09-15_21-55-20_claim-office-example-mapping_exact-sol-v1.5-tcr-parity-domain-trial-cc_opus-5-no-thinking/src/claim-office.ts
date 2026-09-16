export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
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

const PROCESSING_FEE = 5;
const DEDUCTIBLE_PER_DAMAGE = 100;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_CONTRACT_DISCOUNT = 0.15;

const COMPONENT_TYPES = ["rune", "moonstone"];

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;

interface PriceListEntry {
  insuranceValue: number;
  basePremium: number;
}

/** The MHPCO price list: every insurable type, with its insurance value and base premium. */
const PRICE_LIST: Record<string, PriceListEntry> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
  rune: { insuranceValue: 250, basePremium: 25 },
  moonstone: { insuranceValue: 250, basePremium: 25 },
};

/** The MHPCO insures only items on its price list. */
function priceListEntryFor(itemType: string): PriceListEntry {
  const entry = PRICE_LIST[itemType];
  if (entry === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${itemType}"`);
  }
  return entry;
}

function basePremiumFor(itemType: string): number {
  return priceListEntryFor(itemType).basePremium;
}

function isComponent(itemType: string): boolean {
  return COMPONENT_TYPES.includes(itemType);
}

/** A building block of exactly 3 alike components is offered at a special base premium. */
function basePremiumForComponentGroup(itemType: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumFor(itemType);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

/** The sum of all item base premiums, with alike components priced as groups. */
function policyBasePremiumFor(items: Item[]): number {
  let total = 0;
  for (const [itemType, count] of countByType(items)) {
    total += isComponent(itemType)
      ? basePremiumForComponentGroup(itemType, count)
      : count * basePremiumFor(itemType);
  }
  return total;
}

/** Enchantment level 5 or above counts as highly enchanted. */
function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

/** Item-specific risk surcharges apply to the base premium of the affected item. */
function riskSurchargeFor(item: Item): number {
  const itemBasePremium = basePremiumFor(item.type);
  const curse = item.cursed === true ? itemBasePremium * CURSE_SURCHARGE : 0;
  const highEnchantment = isHighlyEnchanted(item) ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE : 0;
  return curse + highEnchantment;
}

function riskSurchargesFor(items: Item[]): number {
  return items.reduce((total, item) => total + riskSurchargeFor(item), 0);
}

/** Two or more years of business with the MHPCO makes a customer long-standing. */
function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

/** Every contract after the customer's first earns a discount. */
function isFollowUpContract(contractIndex: number): boolean {
  return contractIndex > 0;
}

/**
 * Policy-wide modifiers apply to the policy base premium: the initial
 * assessment surcharge for a first insurance, the long-standing customer's
 * loyalty discount, and the discount on each contract after the first.
 * Returns the net adjustment, positive when the MHPCO charges more.
 */
function policyWideModifiersFor(
  customer: Customer,
  contractIndex: number,
  policyBasePremium: number,
): number {
  const firstInsurance = policyBasePremium * FIRST_INSURANCE_SURCHARGE;
  const loyalty = isLongStanding(customer) ? policyBasePremium * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUpContract(contractIndex)
    ? policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT
    : 0;
  return firstInsurance - loyalty - followUp;
}

/** Premiums round up: the MHPCO's favor is the higher figure. */
function roundPremiumInMHPCOsFavor(premium: number): number {
  return Math.ceil(premium);
}

/** Payouts round down: the MHPCO's favor is the lower figure. */
function roundPayoutInMHPCOsFavor(payout: number): number {
  return Math.floor(payout);
}

/** Damage to an item enchanted to level 8 or above is reimbursed at half. */
function isReducedReimbursement(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;
}

/** The share of the damage amount the MHPCO reimburses, before the deductible. */
function reimbursedShareOf(damage: Damage, item: Item): number {
  return isReducedReimbursement(item) ? damage.amount * REDUCED_REIMBURSEMENT_RATE : damage.amount;
}

/** A deductible of 100 G applies per damage event. */
function payoutForDamage(damage: Damage, item: Item): number {
  return reimbursedShareOf(damage, item) - DEDUCTIBLE_PER_DAMAGE;
}

/** A damage report cannot claim negative harm. */
function rejectNegativeAmounts(incident: Incident): void {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

/**
 * Assigns each damage entry to a distinct insured item: a policy covering two
 * swords can suffer two sword damages, but a single insured sword cannot be
 * damaged twice in one incident.
 */
function damagedItemsFor(incident: Incident, items: Item[]): Item[] {
  const unclaimed = [...items];
  return incident.damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a damaged item of type "${damage.itemType}"`);
    }
    return unclaimed.splice(index, 1)[0];
  });
}

function insuranceValueFor(itemType: string): number {
  return priceListEntryFor(itemType).insuranceValue;
}

/** The sum of the insured items' values, unaffected by premium modifiers or block discounts. */
function insuranceSumFor(items: Item[]): number {
  return items.reduce((total, item) => total + insuranceValueFor(item.type), 0);
}

/** The total payout per policy is capped at twice the insurance sum. */
function payoutCapFor(items: Item[]): number {
  return insuranceSumFor(items) * CAP_MULTIPLE_OF_INSURANCE_SUM;
}

export function claim(items: Item[], incident: Incident, remainingCap?: number): ClaimResult {
  rejectNegativeAmounts(incident);
  const capBeforeClaim = remainingCap ?? payoutCapFor(items);
  const damagedItems = damagedItemsFor(incident, items);
  const reimbursement = incident.damages.reduce(
    (total, damage, index) => total + payoutForDamage(damage, damagedItems[index]),
    0,
  );
  const payout = Math.min(roundPayoutInMHPCOsFavor(reimbursement), capBeforeClaim);
  return { payout, remainingCap: Math.max(0, capBeforeClaim - payout) };
}

export function quote(customer: Customer, items: Item[], contractIndex: number): number {
  const policyBasePremium = policyBasePremiumFor(items);
  const riskSurcharges = riskSurchargesFor(items);
  const policyWideModifiers = policyWideModifiersFor(customer, contractIndex, policyBasePremium);
  return roundPremiumInMHPCOsFavor(
    policyBasePremium + riskSurcharges + policyWideModifiers + PROCESSING_FEE,
  );
}
