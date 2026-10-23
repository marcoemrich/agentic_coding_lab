export interface Customer {
  readonly yearsWithMHPCO: number;
}

export interface Item {
  readonly type: string;
  // Declared by the scenario input schema, but read by no rule: no premium rule
  // mentions material, and the claim side's dragon-material clause is subsumed by
  // its default share (see `reimbursableShareOf` in claim.ts).
  readonly material?: string;
  readonly cursed?: boolean;
  readonly enchantment?: number;
}

const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FOLLOW_UP_CONTRACT_DISCOUNT_RATE = 0.15;
const LONG_STANDING_MINIMUM_YEARS = 2;
const CURSE_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
// The premium side's own threshold for "highly enchanted". The claim side sets a
// separate, higher one for its reimbursement clause: the surcharge level and the
// reimbursement level are independent policies that happen to read the same
// item attribute, so neither may be derived from the other.
const HIGH_ENCHANTMENT_SURCHARGE_LEVEL = 5;

const MAIN_ITEM_BASE_PREMIUM_PRICE_LIST: Readonly<Record<string, number>> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_INSURANCE_VALUE = 250;

const MAIN_ITEM_INSURANCE_VALUE_PRICE_LIST: Readonly<Record<string, number>> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_TYPES: readonly string[] = ["rune", "moonstone"];
const COMPONENT_BASE_PREMIUM = 25;
const ALIKE_COMPONENTS_PER_BLOCK = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function mainItemsOf(items: readonly Item[]): readonly Item[] {
  return items.filter((item) => !isComponent(item));
}

function componentsOf(items: readonly Item[]): readonly Item[] {
  return items.filter(isComponent);
}

// Every MHPCO price list is also a register of what the office insures: a type
// absent from it is refused rather than priced. That is why this takes the list
// as a parameter instead of consulting one fixed table -- the base-premium and
// insurance-value lists stay the independent policies they are (see
// `MAIN_ITEM_INSURANCE_VALUE_PRICE_LIST`), and each refuses on its own entries.
// The refusal cannot be lifted out of the lookup: a type is refused precisely
// because the list it is being priced against has no figure for it, so checking
// and pricing are one decision made once per list.
function listedPriceFor(priceList: Readonly<Record<string, number>>, item: Item): number {
  const listedPrice = priceList[item.type];
  if (listedPrice === undefined) {
    throw new Error(`the MHPCO does not insure items of type ${item.type}`);
  }
  return listedPrice;
}

function mainItemBasePremiumOf(item: Item): number {
  return listedPriceFor(MAIN_ITEM_BASE_PREMIUM_PRICE_LIST, item);
}

// "Alike" means the same item type, not the same family: 2 runes + 1 moonstone
// form no block.
function countAlikeComponents(components: readonly Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const component of components) {
    counts.set(component.type, (counts.get(component.type) ?? 0) + 1);
  }
  return counts;
}

function alikeComponentsBasePremiumOf(alikeCount: number): number {
  if (alikeCount === ALIKE_COMPONENTS_PER_BLOCK) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return alikeCount * COMPONENT_BASE_PREMIUM;
}

function componentsBasePremiumOf(components: readonly Item[]): number {
  let total = 0;
  for (const alikeCount of countAlikeComponents(components).values()) {
    total += alikeComponentsBasePremiumOf(alikeCount);
  }
  return total;
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_SURCHARGE_LEVEL;
}

function itemSpecificSurchargesOn(item: Item, itemBasePremium: number): number {
  const curse = isCursed(item) ? itemBasePremium * CURSE_SURCHARGE_RATE : 0;
  const highEnchantment = isHighlyEnchanted(item)
    ? itemBasePremium * HIGH_ENCHANTMENT_SURCHARGE_RATE
    : 0;
  return curse + highEnchantment;
}

function riskAdjustedMainItemPremiumOf(mainItem: Item): number {
  const itemBasePremium = mainItemBasePremiumOf(mainItem);
  return itemBasePremium + itemSpecificSurchargesOn(mainItem, itemBasePremium);
}

function riskAdjustedMainItemsPremiumOf(mainItems: readonly Item[]): number {
  return mainItems.reduce((sum, mainItem) => sum + riskAdjustedMainItemPremiumOf(mainItem), 0);
}

function mainItemsBasePremiumOf(mainItems: readonly Item[]): number {
  return mainItems.reduce((sum, mainItem) => sum + mainItemBasePremiumOf(mainItem), 0);
}

// The policy base premium is the sum of all item base premiums, before any
// item-specific surcharge. Policy-wide modifiers are percentages of it.
function policyBasePremiumOf(items: readonly Item[]): number {
  return mainItemsBasePremiumOf(mainItemsOf(items)) + componentsBasePremiumOf(componentsOf(items));
}

// Only main items carry item-specific surcharges: components have no curse flag,
// enchantment level, or material in the MHPCO item model.
function riskAdjustedItemsPremiumOf(items: readonly Item[]): number {
  return (
    riskAdjustedMainItemsPremiumOf(mainItemsOf(items)) +
    componentsBasePremiumOf(componentsOf(items))
  );
}

// Deliberately takes no customer: "first insurance" is a property of the quoted
// item, not of the customer's history. Each item in a quote is treated as a first
// insurance, so the surcharge applies even on a follow-up contract.
function firstInsuranceSurchargeOn(policyBasePremium: number): number {
  return policyBasePremium * FIRST_INSURANCE_SURCHARGE_RATE;
}

function isLongStanding(customer: Customer): boolean {
  return customer.yearsWithMHPCO >= LONG_STANDING_MINIMUM_YEARS;
}

function loyaltyDiscountOn(customer: Customer, policyBasePremium: number): number {
  return isLongStanding(customer) ? policyBasePremium * LOYALTY_DISCOUNT_RATE : 0;
}

// A contract after the customer's first earns the follow-up discount; the first
// contract does not.
function followUpContractDiscountOn(precedingContracts: number, policyBasePremium: number): number {
  return precedingContracts > 0 ? policyBasePremium * FOLLOW_UP_CONTRACT_DISCOUNT_RATE : 0;
}

// Policy-wide modifiers (first insurance, loyalty, follow-up contract) are
// percentages of the policy base premium; the net signed sum is what the premium
// carries.
function policyWideModifiersOn(
  customer: Customer,
  precedingContracts: number,
  policyBasePremium: number,
): number {
  return (
    firstInsuranceSurchargeOn(policyBasePremium) -
    loyaltyDiscountOn(customer, policyBasePremium) -
    followUpContractDiscountOn(precedingContracts, policyBasePremium)
  );
}

function roundPremiumInOfficesFavour(premium: number): number {
  return Math.ceil(premium);
}

export function quote(
  customer: Customer,
  items: readonly Item[],
  precedingContracts = 0,
): number {
  return roundPremiumInOfficesFavour(
    riskAdjustedItemsPremiumOf(items) +
      policyWideModifiersOn(customer, precedingContracts, policyBasePremiumOf(items)) +
      PROCESSING_FEE,
  );
}

// Determined by the item's type alone. Premium modifiers (curse, high
// enchantment, the component block discount, and every policy-wide modifier)
// price risk, never insured worth, so none of them may reach this price-list
// lookup: a cursed sword with premium 165 G still has insurance value 1000 G.
function insuranceValueOf(item: Item): number {
  return isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : listedPriceFor(MAIN_ITEM_INSURANCE_VALUE_PRICE_LIST, item);
}

// The insurance sum is the sum of the items' unmodified insurance values: every
// insured entry counts once, so two swords sum to 2000 G. Because it carries no
// premium modifier, the cap derived from it cannot be raised by one.
export function insuranceSumOf(items: readonly Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}
