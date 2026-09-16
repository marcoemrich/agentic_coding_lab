export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_LEVEL = 5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;
const CAP_MULTIPLIER = 2;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

// The MHPCO rounds every amount to whole G in its own favour.
function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function isInsurableType(type: string): boolean {
  return type in BASE_PREMIUM_BY_TYPE;
}

function basePremiumFor(type: string): number {
  return BASE_PREMIUM_BY_TYPE[type];
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function basePremiumForAlikeComponents(type: string, count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumFor(type);
}

function policyBasePremiumFor(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += COMPONENT_TYPES.has(type)
      ? basePremiumForAlikeComponents(type, count)
      : count * basePremiumFor(type);
  }
  return total;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeRateFor(item: Item): number {
  const curse = item.cursed ? CURSE_SURCHARGE_RATE : 0;
  const enchantment = isHighlyEnchanted(item)
    ? HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + enchantment;
}

function riskSurchargeFor(item: Item): number {
  return basePremiumFor(item.type) * riskSurchargeRateFor(item);
}

function itemRiskSurchargesFor(items: Item[]): number {
  return items.reduce((total, item) => total + riskSurchargeFor(item), 0);
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function policyModifierRateFor(
  customer: Customer,
  previousContracts: number,
): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_RATE : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_DISCOUNT_RATE : 0;
  return FIRST_INSURANCE_SURCHARGE_RATE + loyalty + followUp;
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts = 0,
): number {
  const policyBasePremium = policyBasePremiumFor(items);
  const policyModifiers =
    policyBasePremium * policyModifierRateFor(customer, previousContracts);
  return roundPremiumInMHPCOsFavour(
    policyBasePremium +
      itemRiskSurchargesFor(items) +
      policyModifiers +
      PROCESSING_FEE,
  );
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

function insuranceSumFor(items: Item[]): number {
  return items.reduce(
    (total, item) => total + INSURANCE_VALUE_BY_TYPE[item.type],
    0,
  );
}

function isHeavilyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;
}

// Heavy enchantment halves the reimbursement and takes precedence; the
// dragon-material clause reimburses in full, as every other item already is.
function reimbursementRateFor(item: Item): number {
  return isHeavilyEnchanted(item)
    ? REDUCED_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
}

function payoutForDamage(damage: Damage, item: Item): number {
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
}

class Policy {
  remainingCap: number;

  constructor(readonly items: Item[]) {
    this.remainingCap = insuranceSumFor(items) * CAP_MULTIPLIER;
  }

  /** Matches each damage to a distinct insured item, so a type cannot be claimed more often than it is covered. */
  insuredItemsFor(damages: Damage[]): Item[] {
    const unclaimed = [...this.items];
    return damages.map((damage) => {
      const index = unclaimed.findIndex(
        (covered) => covered.type === damage.itemType,
      );
      if (index < 0) {
        throw new Error(`damage to an item not covered by the policy: ${damage.itemType}`);
      }
      return unclaimed.splice(index, 1)[0];
    });
  }

  payUpToCap(desiredPayout: number): number {
    const payout = roundPayoutInMHPCOsFavour(
      Math.min(desiredPayout, this.remainingCap),
    );
    this.remainingCap -= payout;
    return payout;
  }
}

function rejectUninsurableItems(items: Item[]): void {
  for (const item of items) {
    if (!isInsurableType(item.type)) {
      throw new Error(`unknown item type: ${item.type}`);
    }
  }
}

function rejectNegativeAmounts(damages: Damage[]): void {
  if (damages.some((damage) => damage.amount < 0)) {
    throw new Error("negative damage amount");
  }
}

function desiredPayoutFor(incident: Incident, policy: Policy): number {
  rejectNegativeAmounts(incident.damages);
  const insuredItems = policy.insuredItemsFor(incident.damages);
  return incident.damages.reduce(
    (total, damage, index) => total + payoutForDamage(damage, insuredItems[index]),
    0,
  );
}

export class ClaimOffice {
  private readonly policies: Policy[] = [];

  constructor(private readonly customer: Customer) {}

  quote(items: Item[]): number {
    rejectUninsurableItems(items);
    const premium = quote(this.customer, items, this.policies.length);
    this.policies.push(new Policy(items));
    return premium;
  }

  claim(policyIndex: number, incident: Incident): ClaimResult {
    const policy = this.policies[policyIndex];
    const payout = policy.payUpToCap(desiredPayoutFor(incident, policy));
    return { payout, remainingCap: policy.remainingCap };
  }
}
