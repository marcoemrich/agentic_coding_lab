// Policy creation: assembles a Policy from a list of insured items.
// Decides the insurance sum and the cap (2x insurance sum), independent of
// any premium modifiers.

import type { ComponentType, ItemType, MainItemType, Policy, QuoteItem } from "./domain.js";
import { DomainError } from "./domain.js";
import {
  CAP_MULTIPLIER,
  COMPONENT_BASE_PREMIUM,
  COMPONENT_BLOCK_PREMIUM,
  COMPONENT_BLOCK_SIZE,
  COMPONENT_INSURANCE,
  MAIN_ITEM_BASE_PREMIUM,
  MAIN_ITEM_INSURANCE,
} from "./domain.js";

export function isMainItemType(type: ItemType): type is MainItemType {
  return type in MAIN_ITEM_INSURANCE;
}

export function isComponentType(type: ItemType): type is ComponentType {
  return type in COMPONENT_INSURANCE;
}

export function isKnownItemType(type: string): type is ItemType {
  return isMainItemType(type as ItemType) || isComponentType(type as ItemType);
}

function validateItemType(type: string): void {
  if (!isKnownItemType(type)) {
    throw new DomainError(`Unknown item type: ${type}`);
  }
}

export function calculateBasePremium(items: QuoteItem[]): number {
  let total = 0;
  const componentCounts: Partial<Record<ComponentType, number>> = {};

  for (const item of items) {
    validateItemType(item.type);
    if (isMainItemType(item.type)) {
      total += MAIN_ITEM_BASE_PREMIUM[item.type];
    } else {
      componentCounts[item.type] = (componentCounts[item.type] ?? 0) + 1;
    }
  }

  for (const type of Object.keys(componentCounts) as ComponentType[]) {
    const count = componentCounts[type] ?? 0;
    if (count === COMPONENT_BLOCK_SIZE) {
      total += COMPONENT_BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_BASE_PREMIUM;
    }
  }

  return total;
}

export function calculateInsuranceSum(items: QuoteItem[]): number {
  let total = 0;
  for (const item of items) {
    validateItemType(item.type);
    if (isMainItemType(item.type)) {
      total += MAIN_ITEM_INSURANCE[item.type];
    } else if (isComponentType(item.type)) {
      total += COMPONENT_INSURANCE[item.type];
    }
  }
  return total;
}

export function createPolicy(items: QuoteItem[]): Policy {
  const insuranceSum = calculateInsuranceSum(items);
  const cap = CAP_MULTIPLIER * insuranceSum;
  return { items, insuranceSum, cap, remainingCap: cap };
}
