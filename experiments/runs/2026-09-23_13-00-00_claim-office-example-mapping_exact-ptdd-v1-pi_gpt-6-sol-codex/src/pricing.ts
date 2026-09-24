export const BASE_PREMIUM: Record<string, number> = { sword: 100, amulet: 60, staff: 80, potion: 40, rune: 25, moonstone: 25 };

export function basePremiumFor(type: string): number {
  const premium = BASE_PREMIUM[type];
  if (premium === undefined) throw new Error(`Unknown item type: ${type}`);
  return premium;
}
