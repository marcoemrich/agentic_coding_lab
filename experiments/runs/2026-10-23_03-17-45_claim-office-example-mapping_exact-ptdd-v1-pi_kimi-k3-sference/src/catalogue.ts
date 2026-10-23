const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const MAIN_ITEM_TYPES = new Set(["sword", "amulet", "staff", "potion"]);

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isKnownItemType(type: string): boolean {
  return COMPONENT_TYPES.has(type) || MAIN_ITEM_TYPES.has(type);
}
