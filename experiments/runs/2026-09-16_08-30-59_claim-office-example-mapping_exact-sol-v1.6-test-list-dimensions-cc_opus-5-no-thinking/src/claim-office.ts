/**
 * All premium rates are multiples of 5 %, so the MHPCO's calculation is kept in
 * exact integer percent-of-a-G units. Only the final premium is converted to G,
 * which keeps intermediate amounts fractions as the price list requires.
 */
const PERCENT = 100;

const PROCESSING_FEE = 5;
const COMPONENT_BASE_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;
const CURSE_SURCHARGE_PERCENT = 50;
const HIGH_ENCHANTMENT_SURCHARGE_PERCENT = 30;
const HIGH_ENCHANTMENT_PREMIUM_THRESHOLD = 5;
const LOYALTY_DISCOUNT_PERCENT = 20;
const LOYALTY_YEARS_THRESHOLD = 2;
const FIRST_INSURANCE_SURCHARGE_PERCENT = 10;
const FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT = 15;
const DEDUCTIBLE_PER_DAMAGE = 100;
const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};
const COMPONENT_INSURANCE_VALUE = 250;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT = 50;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export type Item = {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
};

export type Customer = {
  yearsWithMHPCO: number;
};

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function alikeComponentsBasePremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremium(components: Item[]): number {
  let total = 0;
  for (const count of countByType(components).values()) {
    total += alikeComponentsBasePremium(count);
  }
  return total;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_PREMIUM_THRESHOLD;
}

function itemSurchargePercent(item: Item): number {
  const curse = isCursed(item) ? CURSE_SURCHARGE_PERCENT : 0;
  const enchantment = isHighlyEnchanted(item) ? HIGH_ENCHANTMENT_SURCHARGE_PERCENT : 0;
  return curse + enchantment;
}

/** The MHPCO only insures items on its price list. */
function listedBasePremium(item: Item): number {
  const basePremium = MAIN_ITEM_BASE_PREMIUMS[item.type];
  if (basePremium === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
  }
  return basePremium;
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + listedBasePremium(item), 0);
}

/** Risk surcharges in percent-of-a-G units, each a share of its own item's base premium. */
function itemSurchargesPercent(mainItems: Item[]): number {
  return mainItems.reduce(
    (sum, item) => sum + listedBasePremium(item) * itemSurchargePercent(item),
    0,
  );
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD;
}

function policyModifierPercent(customer: Customer, previousContracts: number): number {
  const loyalty = isLongStanding(customer) ? -LOYALTY_DISCOUNT_PERCENT : 0;
  const followUp = previousContracts > 0 ? -FOLLOW_UP_CONTRACT_DISCOUNT_PERCENT : 0;
  return loyalty + FIRST_INSURANCE_SURCHARGE_PERCENT + followUp;
}

/** The MHPCO rounds a payout down, never up. */
function payoutRoundedInMhpcosFavour(payout: number): number {
  return Math.floor(payout);
}

/** The MHPCO rounds a premium up, never down. */
function premiumRoundedInMhpcosFavour(premiumPercent: number): number {
  return Math.ceil(premiumPercent / PERCENT);
}

function premiumFor(items: Item[], customer: Customer, previousContracts: number): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const basePremium =
    mainItemsBasePremium(mainItems) + componentsBasePremium(items.filter(isComponent));
  const modifiersPercent =
    itemSurchargesPercent(mainItems) +
    basePremium * policyModifierPercent(customer, previousContracts);
  return premiumRoundedInMhpcosFavour((basePremium + PROCESSING_FEE) * PERCENT + modifiersPercent);
}

export function quote(items: Item[], customer: Customer): number {
  return premiumFor(items, customer, 0);
}

export type Damage = {
  itemType: string;
  amount: number;
};

export type Incident = {
  cause: string;
  damages: Damage[];
};

export type ClaimResult = {
  payout: number;
  remainingCap: number;
};

function insuranceValueOf(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return MAIN_ITEM_INSURANCE_VALUES[item.type];
}

function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}

/**
 * Each damage is settled against one covered item, so a policy covering a single
 * sword cannot answer two sword damages.
 */
function takeDamagedItem(uncovered: Item[], itemType: string): Item {
  const index = uncovered.findIndex((candidate) => candidate.type === itemType);
  if (index < 0) {
    throw new Error(`The policy does not cover a further item of type "${itemType}"`);
  }
  return uncovered.splice(index, 1)[0];
}

/** What the MHPCO owes for an incident, before the policy cap is applied. */
function incidentReimbursement(coveredItems: Item[], incident: Incident): number {
  const unclaimed = [...coveredItems];
  return incident.damages.reduce(
    (sum, damage) => sum + reimbursementFor(damage, takeDamagedItem(unclaimed, damage.itemType)),
    0,
  );
}

type Policy = {
  items: Item[];
  remainingCap: number;
};

function isHighlyEnchantedForClaims(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD;
}

/** The share of a damage the MHPCO reimburses before the deductible. */
function reimbursedSharePercent(item: Item): number {
  if (isHighlyEnchantedForClaims(item)) {
    return HIGH_ENCHANTMENT_REIMBURSEMENT_PERCENT;
  }
  return PERCENT;
}

function reimbursementFor(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error(`A damage amount cannot be negative, but was ${damage.amount}`);
  }
  const reimbursed = (damage.amount * reimbursedSharePercent(item)) / PERCENT;
  return Math.max(0, reimbursed - DEDUCTIBLE_PER_DAMAGE);
}

/** Issues policies to one customer; each contract after the first is discounted. */
export class ClaimOffice {
  private readonly policies: Policy[] = [];

  constructor(private readonly customer: Customer) {}

  quote(items: Item[]): number {
    const premium = premiumFor(items, this.customer, this.policies.length);
    this.policies.push({
      items,
      remainingCap: insuranceSum(items) * CAP_MULTIPLE_OF_INSURANCE_SUM,
    });
    return premium;
  }

  claim(policyIndex: number, incident: Incident): ClaimResult {
    const policy = this.policies[policyIndex];
    const desired = incidentReimbursement(policy.items, incident);
    const payout = payoutRoundedInMhpcosFavour(Math.min(desired, policy.remainingCap));
    policy.remainingCap -= payout;
    return { payout, remainingCap: policy.remainingCap };
  }
}
