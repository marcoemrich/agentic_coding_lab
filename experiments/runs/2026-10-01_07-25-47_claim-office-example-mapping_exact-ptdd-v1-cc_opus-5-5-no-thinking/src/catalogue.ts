export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export function isComponent(item: Item): boolean {
  return COMPONENT_TYPES.has(item.type);
}
