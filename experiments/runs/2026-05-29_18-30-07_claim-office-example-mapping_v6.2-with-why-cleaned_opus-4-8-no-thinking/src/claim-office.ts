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
// Base premiums for main (non-component) items. Components such as runes are
// priced separately via componentBasePremium and never read from this table.
const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};
const FIRST_INSURANCE_RATE = 0.1;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_RATE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_THRESHOLD_YEARS = 2;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOWUP_DISCOUNT_RATE = 0.15;

const sum = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0);

// Policy-wide discounts, each a rate applied to the policy base premium when its
// condition holds. Parallels mainItemSurchargeRates as the single source of
// truth for the discount model.
const policyWideDiscountRates = (
  customer: Customer,
  contractIndex: number,
): number[] => [
  ...(customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS
    ? [LOYALTY_DISCOUNT_RATE]
    : []),
  ...(contractIndex >= 1 ? [FOLLOWUP_DISCOUNT_RATE] : []),
];

// Item-specific surcharges, each a rate applied additively to the base premium
// when its condition holds. First insurance always applies; the rest are
// conditional on the item.
const mainItemSurchargeRates = (item: Item): number[] => [
  FIRST_INSURANCE_RATE,
  ...(item.cursed ? [CURSE_SURCHARGE_RATE] : []),
  ...((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD
    ? [HIGH_ENCHANTMENT_RATE]
    : []),
];

// The additive surcharge model: a base premium scaled by 1 plus the sum of all
// applicable rates. Shared by every premium path (single source of truth).
const applyRates = (basePremium: number, rates: number[]): number =>
  basePremium * (1 + sum(rates));

// A main item's raw base premium, before any surcharges — the basis for both the
// surcharged premium and the policy-wide discount.
const mainItemBase = (item: Item): number => BASE_PREMIUMS[item.type];

// A main item's premium: its base premium with all applicable surcharge rates applied.
const mainItemPremium = (item: Item): number =>
  applyRates(mainItemBase(item), mainItemSurchargeRates(item));

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_PREMIUM = 60;

const isComponent = (item: Item): boolean =>
  COMPONENT_TYPES.includes(item.type);

// A type we can price: either a known component or a known main item. Anything
// else has no base premium and cannot be quoted.
const isKnownItemType = (item: Item): boolean =>
  isComponent(item) || item.type in BASE_PREMIUMS;

// Base premium for `count` alike components: a block premium applies only for
// exactly one block's worth (3) of components; otherwise each is priced individually.
const componentBasePremium = (count: number): number => {
  if (count === COMPONENT_BLOCK_SIZE) return COMPONENT_BLOCK_PREMIUM;
  return count * COMPONENT_BASE_PREMIUM;
};

const countByType = (items: Item[]): Map<string, number> => {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  return counts;
};

// The block rule is per-type ("alike" = same type), so price each type's count
// independently. componentBasePremium(count) is the raw per-type base; both the
// surcharged premium and the policy-wide raw base build on it.
const componentTypeBases = (componentItems: Item[]): number[] =>
  [...countByType(componentItems).values()].map(componentBasePremium);

// Every item is treated as first insurance today, so the surcharge is applied
// uniformly to each base premium, using the same additive rate as main items.
const withFirstInsurance = (basePremium: number): number =>
  applyRates(basePremium, [FIRST_INSURANCE_RATE]);

const componentItemsPremium = (componentItems: Item[]): number =>
  sum(componentTypeBases(componentItems).map(withFirstInsurance));

// The policy base premium is the sum of raw item base premiums (no item
// surcharges); policy-wide discounts are percentages of this amount.
const policyBasePremium = (mainItems: Item[], componentItems: Item[]): number =>
  sum(mainItems.map(mainItemBase)) + sum(componentTypeBases(componentItems));

// Round up in MHPCO's favour, guarding against floating-point noise
// (e.g. 197.50000000001 should still round to 198, not 199).
const roundUpInMHPCOFavor = (amount: number): number =>
  Math.ceil(Number(amount.toFixed(6)));

// Payouts round down in MHPCO's favour — the mirror of roundUpInMHPCOFavor for
// premiums. Same floating-point guard so e.g. 350.49999999 still floors to 350.
const roundDownInMHPCOFavor = (amount: number): number =>
  Math.floor(Number(amount.toFixed(6)));

// Every insured item must be a known main item or a known component; an
// unrecognised type cannot be priced.
const requireKnownItemTypes = (items: Item[]): void => {
  for (const item of items) {
    if (!isKnownItemType(item)) {
      throw new Error(`Unknown item type: ${item.type}`);
    }
  }
};

export const quote = (
  items: Item[],
  customer: Customer,
  contractIndex: number,
): number => {
  requireKnownItemTypes(items);
  const mainItems = items.filter((item) => !isComponent(item));
  const componentItems = items.filter((item) => isComponent(item));

  const mainPremium = sum(mainItems.map(mainItemPremium));
  const componentPremium = componentItemsPremium(componentItems);

  const policyWideDiscount =
    sum(policyWideDiscountRates(customer, contractIndex)) *
    policyBasePremium(mainItems, componentItems);

  return roundUpInMHPCOFavor(
    mainPremium + componentPremium - policyWideDiscount + PROCESSING_FEE,
  );
};

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
}

export interface ClaimResult {
  payout: number;
  remainingCap: number;
}

// Unmodified insurance value per item; the policy's insurance sum (and hence
// its payout cap) is derived from these, never from premium modifiers.
const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export const insuranceSum = (items: Item[]): number =>
  sum(items.map((item) => INSURANCE_VALUES[item.type]));

const DEDUCTIBLE_PER_EVENT = 100;
const ENCHANTMENT_REIMBURSEMENT_THRESHOLD = 8;
const ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1;

// Highly enchanted items (enchantment >= 8) are reimbursed at a reduced rate,
// reflecting their volatility under repair.
const isHighlyEnchanted = (item: Item): boolean =>
  (item.enchantment ?? 0) >= ENCHANTMENT_REIMBURSEMENT_THRESHOLD;

// The insured item a damage refers to, looked up by type from the policy, or a
// thrown error if the policy does not cover that item type. Damage to an
// uninsured item is never reimbursable, and the returned (non-undefined) item
// supplies the attributes the reimbursement rate depends on.
const requireInsuredItem = (damage: Damage, policy: Policy): Item => {
  const item = policy.items.find((item) => item.type === damage.itemType);
  if (!item) {
    throw new Error(`Damaged item not covered by policy: ${damage.itemType}`);
  }
  return item;
};

// A single damage's reimbursement: the covered amount net of the per-event
// deductible. The covered amount is the full damage, except for highly
// enchanted items, which are covered at ENCHANTMENT_REIMBURSEMENT_RATE.
// Input preconditions (non-negative amounts, covered counts) are checked at
// claim entry, so this need only compute.
const damageReimbursement = (damage: Damage, policy: Policy): number => {
  const item = requireInsuredItem(damage, policy);
  const rate = isHighlyEnchanted(item)
    ? ENCHANTMENT_REIMBURSEMENT_RATE
    : FULL_REIMBURSEMENT_RATE;
  const coveredAmount = rate * damage.amount;
  return coveredAmount - DEDUCTIBLE_PER_EVENT;
};

// A damage amount is the value lost, so it can never be negative.
const requireNonNegativeDamages = (incident: Incident): void => {
  for (const damage of incident.damages) {
    if (damage.amount < 0) {
      throw new Error(`Damage amount must be non-negative: ${damage.amount}`);
    }
  }
};

// A policy cannot be claimed for more damages of a type than it insures items
// of that type (e.g. two sword damages against a single insured sword).
const requireDamagesWithinCover = (incident: Incident, policy: Policy): void => {
  const insuredCounts = countByType(policy.items);
  const damageCounts = countByType(
    incident.damages.map((damage) => ({ type: damage.itemType })),
  );
  for (const [type, damaged] of damageCounts) {
    if (damaged > (insuredCounts.get(type) ?? 0)) {
      throw new Error(`More damages than insured items for type: ${type}`);
    }
  }
};

export const claim = (
  policy: Policy,
  incident: Incident,
  remainingCap: number,
): ClaimResult => {
  requireNonNegativeDamages(incident);
  requireDamagesWithinCover(incident, policy);
  const grossPayout = roundDownInMHPCOFavor(
    sum(incident.damages.map((damage) => damageReimbursement(damage, policy))),
  );
  // The policy's remaining cap limits the payout; the desired amount is reduced
  // to whatever cap is left.
  const payout = Math.min(grossPayout, remainingCap);
  return { payout, remainingCap: remainingCap - payout };
};
