const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENT_VALUE = 250;
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);

export function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function isMainItem(type: string): boolean {
  return type in MAIN_ITEMS;
}

export function isKnownItem(type: string): boolean {
  return isMainItem(type) || isComponent(type);
}

export function getItemInsuranceValue(type: string): number {
  if (isComponent(type)) return COMPONENT_VALUE;
  const item = MAIN_ITEMS[type];
  if (!item) throw new Error(`Unknown item type: ${type}`);
  return item.value;
}

export function getItemBasePremium(type: string): number {
  if (isComponent(type)) return COMPONENT_PREMIUM;
  const item = MAIN_ITEMS[type];
  if (!item) throw new Error(`Unknown item type: ${type}`);
  return item.premium;
}

export function computeComponentsPremium(components: { type: string }[]): number {
  const groups = new Map<string, number>();
  for (const c of components) {
    groups.set(c.type, (groups.get(c.type) ?? 0) + 1);
  }

  let total = 0;
  for (const [, count] of groups) {
    if (count === BLOCK_SIZE) {
      total += BLOCK_PREMIUM;
    } else {
      total += count * COMPONENT_PREMIUM;
    }
  }
  return total;
}
