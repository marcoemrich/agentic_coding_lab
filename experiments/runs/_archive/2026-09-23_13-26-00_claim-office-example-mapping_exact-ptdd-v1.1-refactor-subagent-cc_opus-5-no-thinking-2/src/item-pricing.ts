export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

/** The MHPCO price list for main items: one base premium per item type. */
const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

/** The MHPCO price list for main items: one insurance value per item type. */
const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

/** Components (runes, moonstones) are all priced at the same rate per component. */
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BLOCK_SIZE = 3;
const COMPONENT_BLOCK_BASE_PREMIUM = 60;

/** Whether the MHPCO prices this object as a component rather than a main item. */
function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

/**
 * Which components the MHPCO considers "alike", and therefore eligible to form a
 * block together: components of exactly the same type.
 */
function alikeComponentGroupKey(item: Item): string {
  return item.type;
}

/**
 * The MHPCO's coverage decision: a main item is covered only if its type appears
 * in the office's price list, and an object the list does not name is refused.
 * Every figure the list quotes for a main item is read through here, so the one
 * rule about what the office covers is stated once.
 */
function listedMainItemFigure(pricelist: Record<string, number>, item: Item): number {
  const listedFigure = pricelist[item.type];
  if (listedFigure === undefined) {
    throw new Error(`The MHPCO price list does not cover items of type "${item.type}"`);
  }
  return listedFigure;
}

/** The base premium the MHPCO charges for a single main item, per its price list. */
function mainItemBasePremium(item: Item): number {
  return listedMainItemFigure(MAIN_ITEM_BASE_PREMIUMS, item);
}

/** The sizes of the groups of alike components the policy covers. */
function alikeComponentGroupSizes(components: Item[]): number[] {
  const sizes = new Map<string, number>();
  for (const component of components) {
    const key = alikeComponentGroupKey(component);
    sizes.set(key, (sizes.get(key) ?? 0) + 1);
  }
  return [...sizes.values()];
}

/**
 * Alike components are offered as a block: a group of exactly the block size
 * is charged the special block base premium instead of the per-component rate.
 */
function componentsBasePremium(count: number): number {
  if (count === COMPONENT_BLOCK_SIZE) {
    return COMPONENT_BLOCK_BASE_PREMIUM;
  }
  return count * COMPONENT_BASE_PREMIUM;
}

/**
 * The amount an item-specific risk surcharge is levied on: the base premium the
 * price list attaches to the single object, per its own rate. A component is
 * rated per component here even when it sits in a block, because the block
 * price is a property of the group rather than of any one component; the office
 * has issued no rule for surcharging a component inside a block.
 */
export function surchargeableBasePremiumOf(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_BASE_PREMIUM;
  }
  return mainItemBasePremium(item);
}

function sum(amounts: number[]): number {
  return amounts.reduce((running, amount) => running + amount, 0);
}

/**
 * The policy base premium: the sum of the base premiums of all insured items,
 * before any policy-wide modifier or the processing fee.
 */
export function policyBasePremium(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item));
  const components = items.filter(isComponent);
  return (
    sum(mainItems.map(mainItemBasePremium)) +
    sum(alikeComponentGroupSizes(components).map(componentsBasePremium))
  );
}

/** The value the MHPCO insures a single object for, per its price list. */
export function insuranceValueOf(item: Item): number {
  if (isComponent(item)) {
    return COMPONENT_INSURANCE_VALUE;
  }
  return listedMainItemFigure(MAIN_ITEM_INSURANCE_VALUES, item);
}

/**
 * The insurance sum of a policy: the sum of the insurance values of the items it
 * covers. Premium discounts such as the component block do not reduce it.
 */
export function policyInsuranceSum(items: Item[]): number {
  return sum(items.map(insuranceValueOf));
}
