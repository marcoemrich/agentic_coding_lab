export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export class ValidationError extends Error {}

const MAIN_ITEMS: Record<string, { value: number; premium: number }> = {
  sword: { value: 1000, premium: 100 },
  amulet: { value: 600, premium: 60 },
  staff: { value: 800, premium: 80 },
  potion: { value: 400, premium: 40 },
};

const COMPONENTS = new Set(['rune', 'moonstone']);

export const COMPONENT_VALUE = 250;
export const COMPONENT_PREMIUM = 25;
export const COMPONENT_BLOCK_SIZE = 3;
export const COMPONENT_BLOCK_PREMIUM = 60;

export function isComponent(type: string): boolean {
  return COMPONENTS.has(type);
}

export function isKnownType(type: string): boolean {
  return type in MAIN_ITEMS || isComponent(type);
}

export function assertKnownType(type: unknown): asserts type is string {
  if (typeof type !== 'string' || !isKnownType(type)) {
    throw new ValidationError(`Unknown item type: ${String(type)}`);
  }
}

export function mainItemPremium(type: string): number {
  return MAIN_ITEMS[type].premium;
}

export function insuranceValue(type: string): number {
  return isComponent(type) ? COMPONENT_VALUE : MAIN_ITEMS[type].value;
}
