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

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const LOYALTY_YEARS = 2;

const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const CAP_MULTIPLIER = 2;
const DEDUCTIBLE = 100;
const REDUCED_REIMBURSEMENT_RATE = 0.5;
const REDUCED_REIMBURSEMENT_LEVEL = 8;
const FULL_REIMBURSEMENT_RATE = 1;

const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
}

function formsBuildingBlock(count: number): boolean {
  return count === BLOCK_SIZE;
}

function premiumForAlikeItems(type: string, count: number): number {
  if (formsBuildingBlock(count)) {
    return BLOCK_PREMIUM;
  }
  return count * BASE_PREMIUMS[type];
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_LEVEL;
}

function riskSurchargeFor(item: Item): number {
  const basePremium = BASE_PREMIUMS[item.type];
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += basePremium * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

function isFollowUpContract(previousContracts: number): boolean {
  return previousContracts > 0;
}

function customerAdjustmentFor(
  customer: Customer,
  previousContracts: number,
  basePremium: number,
): number {
  let adjustment = basePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStandingCustomer(customer)) {
    adjustment -= basePremium * LOYALTY_DISCOUNT_RATE;
  }
  if (isFollowUpContract(previousContracts)) {
    adjustment -= basePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return adjustment;
}

function insurableItemOrThrow(item: Item): Item {
  if (BASE_PREMIUMS[item.type] === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return item;
}

function roundPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

function roundPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

export function quote(customer: Customer, items: Item[], previousContracts: number): number {
  items.forEach(insurableItemOrThrow);
  let basePremium = 0;
  for (const [type, count] of countByType(items)) {
    basePremium += premiumForAlikeItems(type, count);
  }
  const riskSurcharges = items.reduce((total, item) => total + riskSurchargeFor(item), 0);
  const customerAdjustment = customerAdjustmentFor(customer, previousContracts, basePremium);
  const premium = basePremium + riskSurcharges + customerAdjustment + PROCESSING_FEE;
  return roundPremiumInMHPCOsFavour(premium);
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  items.forEach(insurableItemOrThrow);
  const insuranceSum = items.reduce((total, item) => total + INSURANCE_VALUES[item.type], 0);
  const cap = insuranceSum * CAP_MULTIPLIER;
  return { items, insuranceSum, cap, remainingCap: cap };
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

function isHeavilyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= REDUCED_REIMBURSEMENT_LEVEL;
}

/**
 * Heavily enchanted damage is reimbursed at 50 %; everything else in full.
 * Dragon material is reimbursed in full, which is the default rate, and the
 * heavy-enchantment clause takes precedence where both apply.
 */
function reimbursementRateFor(item: Item): number {
  if (isHeavilyEnchanted(item)) {
    return REDUCED_REIMBURSEMENT_RATE;
  }
  return FULL_REIMBURSEMENT_RATE;
}

function payoutForDamage(item: Item, damage: Damage): number {
  return damage.amount * reimbursementRateFor(item) - DEDUCTIBLE;
}

function reportedDamageOrThrow(damage: Damage): Damage {
  if (damage.amount < 0) {
    throw new Error(`a damage amount cannot be negative, but was ${damage.amount}`);
  }
  return damage;
}

/** Each damage must name a distinct covered item; a policy pays for what it insures, once each. */
function matchDamagesToCoveredItems(policy: Policy, damages: Damage[]): Item[] {
  const unmatched = [...policy.items];
  return damages.map((damage) => {
    const index = unmatched.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      throw new Error(`the policy does not cover a further item of type "${damage.itemType}"`);
    }
    return unmatched.splice(index, 1)[0];
  });
}

function desiredPayoutFor(policy: Policy, incident: Incident): number {
  incident.damages.forEach(reportedDamageOrThrow);
  const coveredItems = matchDamagesToCoveredItems(policy, incident.damages);
  return incident.damages.reduce(
    (total, damage, index) => total + payoutForDamage(coveredItems[index], damage),
    0,
  );
}

/** The total payout per policy is capped at twice the insurance sum, across all claims. */
function drawFromRemainingCap(policy: Policy, desiredPayout: number): number {
  const payout = Math.min(desiredPayout, policy.remainingCap);
  policy.remainingCap -= payout;
  return payout;
}

export function processClaim(policy: Policy, incident: Incident): ClaimResult {
  const payout = roundPayoutInMHPCOsFavour(
    drawFromRemainingCap(policy, desiredPayoutFor(policy, incident)),
  );
  return { payout, remainingCap: policy.remainingCap };
}
