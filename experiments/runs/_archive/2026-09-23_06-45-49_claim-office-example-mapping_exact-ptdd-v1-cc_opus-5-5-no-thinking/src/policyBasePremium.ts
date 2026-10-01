import { COMPONENT_PRICE, isComponent, mainItemBasePremium, type Item } from "./catalogue.js";

const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

function alikeComponentsBasePremium(count: number): number {
  return count === BLOCK_SIZE ? BLOCK_BASE_PREMIUM : count * COMPONENT_PRICE.basePremium;
}

function componentsBasePremium(components: Item[]): number {
  const countsByType = new Map<string, number>();
  components.forEach((item) => countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1));
  return [...countsByType.values()].reduce((sum, count) => sum + alikeComponentsBasePremium(count), 0);
}

function mainItemsBasePremium(mainItems: Item[]): number {
  return mainItems.reduce((sum, item) => sum + mainItemBasePremium(item), 0);
}

export function policyBasePremium(items: Item[]): number {
  const components = items.filter(isComponent);
  const mainItems = items.filter((item) => !isComponent(item));
  return mainItemsBasePremium(mainItems) + componentsBasePremium(components);
}
