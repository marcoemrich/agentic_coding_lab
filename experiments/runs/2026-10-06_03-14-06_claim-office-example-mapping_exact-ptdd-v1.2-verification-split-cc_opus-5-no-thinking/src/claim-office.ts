export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  cursed?: boolean;
  enchantment?: number;
  material?: string;
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
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const PARTIAL_REIMBURSEMENT_RATE = 0.5;
const PARTIAL_REIMBURSEMENT_LEVEL = 8;

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLE = 2;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function basePremiumOf(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return basePremium;
}

function requireInsurableItems(items: Item[]): void {
  for (const item of items) {
    basePremiumOf(item);
  }
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function alikeGroupBasePremium(type: string, count: number): number {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * basePremiumOf({ type });
}

function policyBasePremium(items: Item[]): number {
  let total = 0;
  for (const [type, count] of countByType(items)) {
    total += alikeGroupBasePremium(type, count);
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
    (total, item) => total + basePremiumOf(item) * riskSurchargeRate(item),
    0,
  );
}

function policyModifierRate(customer: Customer, previousContracts: number): number {
  let rate = FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS) {
    rate -= LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    rate -= FOLLOW_UP_DISCOUNT_RATE;
  }
  return rate;
}

function premiumFor(
  customer: Customer,
  items: Item[],
  previousContracts: number,
): number {
  requireInsurableItems(items);
  const basePremium = policyBasePremium(items);
  return Math.ceil(
    basePremium +
      itemRiskSurcharges(items) +
      basePremium * policyModifierRate(customer, previousContracts) +
      PROCESSING_FEE,
  );
}

function insuranceValueOf(item: Item): number {
  const insuranceValue = INSURANCE_VALUES[item.type];
  if (insuranceValue === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return insuranceValue;
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

function reimbursementFor(damage: Damage, item: Item): number {
  const covered =
    (item.enchantment ?? 0) >= PARTIAL_REIMBURSEMENT_LEVEL
      ? damage.amount * PARTIAL_REIMBURSEMENT_RATE
      : damage.amount;
  return covered - DEDUCTIBLE_PER_DAMAGE;
}

interface Policy {
  items: Item[];
  remainingCap: number;
}

function matchDamagesToCoveredItems(policy: Policy, damages: Damage[]): Item[] {
  const unclaimed = [...policy.items];
  return damages.map((damage) => {
    const index = unclaimed.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(
        `the policy does not cover a damaged item of type "${damage.itemType}"`,
      );
    }
    return unclaimed.splice(index, 1)[0];
  });
}

function requireWellFormedDamages(damages: Damage[]): void {
  for (const damage of damages) {
    if (damage.amount < 0) {
      throw new Error(`a damage amount cannot be negative: ${damage.amount}`);
    }
  }
}

function settle(policy: Policy, incident: Incident): ClaimResult {
  requireWellFormedDamages(incident.damages);
  const damagedItems = matchDamagesToCoveredItems(policy, incident.damages);
  const reimbursement = incident.damages.reduce(
    (total, damage, index) => total + reimbursementFor(damage, damagedItems[index]),
    0,
  );
  const payout = Math.min(Math.floor(reimbursement), policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

export class ClaimOffice {
  private readonly policies: Policy[] = [];

  constructor(private readonly customer: Customer) {}

  quote(items: Item[]): number {
    const premium = premiumFor(this.customer, items, this.policies.length);
    this.policies.push({
      items,
      remainingCap: insuranceSum(items) * CAP_MULTIPLE,
    });
    return premium;
  }

  claim(policyIndex: number, incident: Incident): ClaimResult {
    return settle(this.policies[policyIndex], incident);
  }
}
