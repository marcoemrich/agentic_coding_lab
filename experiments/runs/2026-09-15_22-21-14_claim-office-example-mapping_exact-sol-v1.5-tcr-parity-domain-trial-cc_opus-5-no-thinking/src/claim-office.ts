const PROCESSING_FEE = 5;

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
};

const CAP_MULTIPLE_OF_INSURANCE_SUM = 2;
const DEDUCTIBLE_PER_DAMAGE = 100;
const SEVERE_ENCHANTMENT_LEVEL = 8;
const SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;

const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const ALIKE_COMPONENTS_PER_BLOCK = 3;
const BLOCK_BASE_PREMIUM = 60;

const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_YEARS = 2;

const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;

const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const HIGH_ENCHANTMENT_LEVEL = 5;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContracts = 0,
): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);

  const componentsPremium = componentsBasePremium(components);

  // Item-specific surcharges raise the premium itself, but policy-wide rates
  // apply to the unmodified base premiums (see the spec's integration examples).
  const itemsPremium = sumOf(mainItems, itemPremium) + componentsPremium;
  const policyBasePremium = sumOf(mainItems, basePremiumFor) + componentsPremium;

  const modifiers = policyModifiers(customer, previousContracts, policyBasePremium);
  return roundedPremiumInMHPCOsFavour(itemsPremium + modifiers + PROCESSING_FEE);
}

function sumOf<T>(entries: T[], amountFor: (entry: T) => number): number {
  return entries.reduce((total, entry) => total + amountFor(entry), 0);
}

/** Premiums round up: the MHPCO's favour is the larger amount. */
function roundedPremiumInMHPCOsFavour(premium: number): number {
  return Math.ceil(premium);
}

/** Payouts round down: the MHPCO's favour is the smaller amount. */
function roundedPayoutInMHPCOsFavour(payout: number): number {
  return Math.floor(payout);
}

function policyModifiers(
  customer: Customer,
  previousContracts: number,
  policyBasePremium: number,
): number {
  let modifiers = policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
  if (isLongStandingCustomer(customer)) {
    modifiers -= policyBasePremium * LOYALTY_DISCOUNT_RATE;
  }
  if (previousContracts > 0) {
    modifiers -= policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE;
  }
  return modifiers;
}

function isLongStandingCustomer(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LOYALTY_YEARS;
}

export interface Policy {
  items: Item[];
  insuranceSum: number;
  cap: number;
  /** Cap still available; successive claims consume it. */
  remainingCap: number;
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

export function claimOn(policy: Policy, damages: Damage[]): ClaimResult {
  const unclaimed = [...policy.items];
  const assessed = roundedPayoutInMHPCOsFavour(
    sumOf(damages, (damage) =>
      reimbursementFor(damage, claimDamagedItem(unclaimed, damage)),
    ),
  );
  const payout = Math.min(assessed, policy.remainingCap);
  policy.remainingCap -= payout;
  return { payout, remainingCap: policy.remainingCap };
}

/**
 * Each damage claims one insured item, so a policy covering a single sword
 * cannot answer two sword damages.
 */
function claimDamagedItem(unclaimed: Item[], damage: Damage): Item {
  const index = unclaimed.findIndex(({ type }) => type === damage.itemType);
  if (index === -1) {
    throw new Error(
      `the policy does not cover a further item of type "${damage.itemType}"`,
    );
  }
  return unclaimed.splice(index, 1)[0];
}

function reimbursementFor(damage: Damage, item: Item): number {
  if (damage.amount < 0) {
    throw new Error(
      `a damage amount cannot be negative, but was ${damage.amount}`,
    );
  }
  return reimbursedDamage(damage.amount, item) - DEDUCTIBLE_PER_DAMAGE;
}

/** Special clauses reduce the damage amount before the deductible applies. */
function reimbursedDamage(amount: number, item: Item): number {
  if (isSeverelyEnchanted(item)) {
    return amount * SEVERE_ENCHANTMENT_REIMBURSEMENT_RATE;
  }
  return amount;
}

function isSeverelyEnchanted(item: Item): boolean {
  return (
    item.enchantment !== undefined && item.enchantment >= SEVERE_ENCHANTMENT_LEVEL
  );
}

export function policyFor(items: Item[]): Policy {
  const insuranceSum = sumOf(items, insuranceValueFor);
  const cap = insuranceSum * CAP_MULTIPLE_OF_INSURANCE_SUM;
  return { items, insuranceSum, cap, remainingCap: cap };
}

function insuranceValueFor(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return catalogueAmount(MAIN_ITEM_INSURANCE_VALUES, item);
}

/** The MHPCO insures only catalogued item types; an unlisted type is refused. */
function catalogueAmount(amounts: Record<string, number>, item: Item): number {
  const amount = amounts[item.type];
  if (amount === undefined) {
    throw new Error(`MHPCO does not insure items of type "${item.type}"`);
  }
  return amount;
}

function itemPremium(item: Item): number {
  const basePremium = basePremiumFor(item);
  return basePremium + riskSurcharge(item, basePremium);
}

function riskSurcharge(item: Item, basePremium: number): number {
  let surcharge = 0;
  if (item.cursed === true) {
    surcharge += basePremium * CURSE_SURCHARGE_RATE;
  }
  if (isHighlyEnchanted(item)) {
    surcharge += basePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_LEVEL;
}

function basePremiumFor(item: Item): number {
  return catalogueAmount(MAIN_ITEM_BASE_PREMIUMS, item);
}

function componentsBasePremium(components: Item[]): number {
  return countByType(components)
    .map(alikeComponentsBasePremium)
    .reduce((total, premium) => total + premium, 0);
}

function alikeComponentsBasePremium(count: number): number {
  if (count === ALIKE_COMPONENTS_PER_BLOCK) {
    return BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

function countByType(items: Item[]): number[] {
  const countsByType = new Map<string, number>();
  for (const item of items) {
    countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
  }
  return [...countsByType.values()];
}
