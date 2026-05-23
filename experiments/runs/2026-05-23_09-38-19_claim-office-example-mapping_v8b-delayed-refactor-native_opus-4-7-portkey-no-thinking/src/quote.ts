import {
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  isComponent,
  isKnownItem,
  specOf,
} from "./catalog.js";
import { Customer, Item } from "./types.js";

const PROCESSING_FEE = 5;

const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_DISCOUNT = 0.15;

export { isKnownItem };

export function getInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + specOf(item).insuranceValue, 0);
}

function isCursed(item: Item): boolean {
  return item.cursed === true;
}

function isHighlyEnchanted(item: Item): boolean {
  return item.enchantment !== undefined && item.enchantment >= HIGH_ENCHANTMENT_THRESHOLD;
}

function itemSurchargeRate(item: Item): number {
  let rate = 0;
  if (isCursed(item)) rate += CURSE_SURCHARGE;
  if (isHighlyEnchanted(item)) rate += HIGH_ENCHANTMENT_SURCHARGE;
  return rate;
}

interface ItemGroup {
  items: Item[];
  basePremium: number; // group base (with block discount if applicable)
}

function groupItems(items: Item[]): ItemGroup[] {
  const groups: ItemGroup[] = [];
  const componentsByType = new Map<string, Item[]>();

  for (const item of items) {
    if (isComponent(item)) {
      const list = componentsByType.get(item.type) ?? [];
      list.push(item);
      componentsByType.set(item.type, list);
    } else {
      groups.push({ items: [item], basePremium: specOf(item).basePremium });
    }
  }

  for (const [, components] of componentsByType) {
    const basePremium =
      components.length === COMPONENT_BLOCK_SIZE
        ? COMPONENT_BLOCK_PREMIUM
        : components.length * specOf(components[0]).basePremium;
    groups.push({ items: components, basePremium });
  }

  return groups;
}

function groupPremiumWithItemSurcharges(group: ItemGroup): number {
  let total = group.basePremium;
  for (const item of group.items) {
    total += specOf(item).basePremium * itemSurchargeRate(item);
  }
  return total;
}

export function computePremium(
  items: Item[],
  customer: Customer,
  isFollowUpContract: boolean,
): number {
  for (const item of items) {
    if (!isKnownItem(item)) throw new Error(`Unknown item type: ${item.type}`);
  }

  const groups = groupItems(items);

  const itemPremiums = groups.reduce(
    (sum, g) => sum + groupPremiumWithItemSurcharges(g),
    0,
  );
  const policyBase = groups.reduce((sum, g) => sum + g.basePremium, 0);

  const firstInsurance = items.reduce(
    (sum, item) => sum + specOf(item).basePremium * FIRST_INSURANCE_SURCHARGE,
    0,
  );

  const loyalty =
    customer.yearsWithMHPCO >= LOYALTY_YEARS ? policyBase * LOYALTY_DISCOUNT : 0;
  const followUp = isFollowUpContract ? policyBase * FOLLOWUP_DISCOUNT : 0;

  const premium = itemPremiums + firstInsurance - loyalty - followUp + PROCESSING_FEE;

  return Math.ceil(premium);
}
