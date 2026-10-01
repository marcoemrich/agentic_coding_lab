// The MHPCO price list: which items the office insures, what each is worth to
// it, and what it charges to insure them. These figures change together
// whenever the office revises its tariff, independently of risk clauses and
// customer discounts.

export interface Item {
  type: string;
  material?: string;
  cursed?: boolean;
  enchantment?: number;
}

// One tariff row per main item type the office insures: an item type is in the
// catalogue exactly when it has a row, and a row carries both of its figures.
interface Tariff {
  insuranceValue: number;
  basePremium: number;
}

const MAIN_ITEM_TARIFFS: Record<string, Tariff> = {
  sword: { insuranceValue: 1000, basePremium: 100 },
  amulet: { insuranceValue: 600, basePremium: 60 },
  staff: { insuranceValue: 800, basePremium: 80 },
  potion: { insuranceValue: 400, basePremium: 40 },
};

const COMPONENT_TYPES = ["rune", "moonstone"];
const COMPONENT_TARIFF: Tariff = { insuranceValue: 250, basePremium: 25 };
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.includes(item.type);
}

function isMainItem(item: Item): boolean {
  return !isComponent(item);
}

// The office's catalogue decision: an item type it does not list is not insured
// at all, so neither its premium nor its insurance value can be quoted.
function mainItemTariffOf(item: Item): Tariff {
  const tariff = MAIN_ITEM_TARIFFS[item.type];
  if (tariff === undefined) {
    throw new Error(`The MHPCO does not insure items of type "${item.type}"`);
  }
  return tariff;
}

function tariffOf(item: Item): Tariff {
  return isComponent(item) ? COMPONENT_TARIFF : mainItemTariffOf(item);
}

function mainItemsBasePremiumOf(mainItems: Item[]): number {
  return mainItems.reduce(
    (total, item) => total + mainItemTariffOf(item).basePremium,
    0,
  );
}

// "Alike" components are components of exactly the same type, so 2 runes and
// a moonstone form no building block.
function countsPerAlikeGroup(components: Item[]): number[] {
  const counts = new Map<string, number>();
  for (const component of components) {
    counts.set(component.type, (counts.get(component.type) ?? 0) + 1);
  }
  return [...counts.values()];
}

function alikeComponentsBasePremiumOf(count: number): number {
  return count === BLOCK_SIZE
    ? BLOCK_BASE_PREMIUM
    : count * COMPONENT_TARIFF.basePremium;
}

function componentsBasePremiumOf(components: Item[]): number {
  return countsPerAlikeGroup(components).reduce(
    (total, count) => total + alikeComponentsBasePremiumOf(count),
    0,
  );
}

export function policyBasePremiumOf(items: Item[]): number {
  return (
    mainItemsBasePremiumOf(items.filter(isMainItem)) +
    componentsBasePremiumOf(items.filter(isComponent))
  );
}

// Item-specific modifiers apply to the affected item's own base premium,
// so a component is surcharged on its single-component rate rather than on
// its share of a discounted building block.
export function surchargeableBasePremiumOf(item: Item): number {
  return tariffOf(item).basePremium;
}

// The insurance value an item contributes to the policy's insurance sum. The
// building-block discount lowers the premium only, never the insurance sum.
export function insuranceValueOf(item: Item): number {
  return tariffOf(item).insuranceValue;
}
