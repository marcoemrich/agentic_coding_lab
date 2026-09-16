export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const PROCESSING_FEE = 5;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_TYPES = ["rune", "moonstone"];

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
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function qualifiesForBlock(type: string, count: number): boolean {
  return COMPONENT_TYPES.includes(type) && count === BLOCK_SIZE;
}

function groupBasePremium(type: string, count: number): number {
  if (qualifiesForBlock(type, count)) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
}

export function basePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += groupBasePremium(type, count);
  }
  return total;
}

const CURSE_SURCHARGE_RATE = 0.5;

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeRate(item: Item): number {
  return (
    (isCursed(item) ? CURSE_SURCHARGE_RATE : 0) +
    (isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_RATE : 0)
  );
}

function riskSurcharge(item: Item): number {
  return BASE_PREMIUMS[item.type] * riskSurchargeRate(item);
}

export function itemisedPremium(items: Item[]): number {
  return items.reduce((total, item) => total + riskSurcharge(item), basePremium(items));
}

const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;

const FOLLOW_UP_DISCOUNT_RATE = 0.15;

function policyModifierRate(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;
  return loyalty + FIRST_INSURANCE_SURCHARGE_RATE + followUp;
}

function roundPremiumInOfficesFavour(premium: number): number {
  return Math.ceil(premium);
}

function premiumFor(customer: Customer, items: Item[], previousContracts: number): number {
  const policyWide = basePremium(items) * policyModifierRate(customer, previousContracts);
  return roundPremiumInOfficesFavour(itemisedPremium(items) + policyWide + PROCESSING_FEE);
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

const DEDUCTIBLE = 100;
const HALF_REIMBURSEMENT_LEVEL = 8;
const HALF_REIMBURSEMENT_RATE = 0.5;

function roundPayoutInOfficesFavour(payout: number): number {
  return Math.floor(payout);
}

const FULL_REIMBURSEMENT_RATE = 1;

function isHeavilyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HALF_REIMBURSEMENT_LEVEL;
}

/**
 * The high-enchantment clause halves the reimbursement and takes precedence over the
 * dragon-material clause; dragon material reimburses in full, as does the default case,
 * so both are expressed by the full rate.
 */
function reimbursementRate(item: Item): number {
  return isHeavilyEnchanted(item) ? HALF_REIMBURSEMENT_RATE : FULL_REIMBURSEMENT_RATE;
}

interface DamagedItem {
  item: Item;
  amount: number;
}

function payoutForDamage({ item, amount }: DamagedItem): number {
  return amount * reimbursementRate(item) - DEDUCTIBLE;
}

const CAP_MULTIPLE = 2;

function isInsurable(type: string): boolean {
  return type in INSURANCE_VALUES;
}

function requireInsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurable(item.type)) {
      throw new Error(`The MHPCO does not insure items of type "${item.type}".`);
    }
  }
}

function insuranceSum(items: Item[]): number {
  return items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
}

function policyCap(items: Item[]): number {
  return insuranceSum(items) * CAP_MULTIPLE;
}

function requireNonNegativeAmounts(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`A damage amount cannot be negative: ${damage.amount}.`);
    }
  }
}

/**
 * Each damage entry is settled against a distinct insured item, so a policy covering one
 * sword cannot absorb two sword damages.
 */
function matchDamagesToItems(items: Item[], damages: Damage[]): DamagedItem[] {
  const unclaimed = [...items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`The policy does not cover a damaged "${damage.itemType}".`);
    }
    return { item: unclaimed.splice(index, 1)[0], amount: damage.amount };
  });
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

export class ClaimOffice {
  private contracts = 0;
  private readonly policies: Policy[] = [];

  constructor(private readonly customer: Customer) {}

  quote(items: Item[]): number {
    requireInsurableItems(items);
    const premium = premiumFor(this.customer, items, this.contracts);
    this.contracts += 1;
    this.policies.push({ items, remainingCap: policyCap(items) });
    return premium;
  }

  claim(policy: number, incident: Incident): ClaimResult {
    const covered = this.policies[policy];
    requireNonNegativeAmounts(incident.damages);
    const damaged = matchDamagesToItems(covered.items, incident.damages);
    const desired = damaged.reduce((total, entry) => total + payoutForDamage(entry), 0);
    const payout = roundPayoutInOfficesFavour(Math.min(desired, covered.remainingCap));
    covered.remainingCap -= payout;
    return { payout, remainingCap: covered.remainingCap };
  }
}
