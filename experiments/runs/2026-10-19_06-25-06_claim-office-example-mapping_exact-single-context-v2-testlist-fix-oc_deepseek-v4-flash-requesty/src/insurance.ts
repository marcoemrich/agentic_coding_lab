export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

const MAIN_BASE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_BASE = 25;

export function basePremium(items: Item[]): number {
  return items.reduce(
    (sum, item) => sum + (MAIN_BASE[item.type] ?? COMPONENT_BASE),
    0,
  );
}