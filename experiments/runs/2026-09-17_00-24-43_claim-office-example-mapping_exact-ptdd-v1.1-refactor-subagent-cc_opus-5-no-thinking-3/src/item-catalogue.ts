// The MHPCO price list: which items the office insures at all, and what each
// one is worth to it. This is catalogue knowledge, not pricing policy -- it
// changes when the office revises its tariffs or takes on a new kind of item,
// independently of how premiums or payouts are assessed from it.

import { ClaimOfficeRefusal } from "./claim-office-refusal.js";

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_ITEM_INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const MAIN_ITEM_BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

// Components -- for example runes and moonstones -- share a single list price.
const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
export const COMPONENT_BASE_PREMIUM = 25;
const COMPONENT_INSURANCE_VALUE = 250;

// The office insures only the items in its catalogue; anything else is
// refused rather than priced.
function isInsurable(item: Item): boolean {
  return isComponent(item) || item.type in MAIN_ITEM_BASE_PREMIUMS;
}

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}

// The office will not quote a policy over an item it does not insure; it
// refuses the scenario and names every offending type.
export function refuseUninsurableItems(items: Item[]): void {
  const uninsurable = items.filter((item) => !isInsurable(item));
  if (uninsurable.length > 0) {
    throw new ClaimOfficeRefusal(
      `the MHPCO does not insure items of type: ${uninsurable
        .map((item) => item.type)
        .join(", ")}`,
    );
  }
}

export function mainItemBasePremium(item: Item): number {
  return MAIN_ITEM_BASE_PREMIUMS[item.type];
}

// An item's own list price, whatever kind of item it is.
export function listedBasePremium(item: Item): number {
  return isComponent(item) ? COMPONENT_BASE_PREMIUM : mainItemBasePremium(item);
}

// What the office insures an item for, independently of what it charges.
export function insuranceValue(item: Item): number {
  return isComponent(item)
    ? COMPONENT_INSURANCE_VALUE
    : MAIN_ITEM_INSURANCE_VALUES[item.type];
}
