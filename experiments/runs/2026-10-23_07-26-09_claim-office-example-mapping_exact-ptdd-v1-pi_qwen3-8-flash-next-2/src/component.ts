import type { ItemInput } from "./scenario.js";

export const COMPONENT_TYPES = ["rune", "moonstone"];

export function isComponent(item: ItemInput): boolean {
  return COMPONENT_TYPES.includes(item.type);
}
