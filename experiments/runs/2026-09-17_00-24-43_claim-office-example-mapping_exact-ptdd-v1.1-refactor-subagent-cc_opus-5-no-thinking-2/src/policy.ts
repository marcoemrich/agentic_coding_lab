/** The MHPCO's shared vocabulary for what a policy covers. */

export interface Customer {
  readonly yearsWithMHPCO: number;
}

export interface Item {
  readonly type: string;
  readonly material?: string;
  readonly enchantment?: number;
  readonly cursed?: boolean;
}

/**
 * An item that carries no enchantment level at all -- a rune, a moonstone --
 * counts as unenchanted rather than as unknown. This is a fact about the
 * vocabulary, not about any one rule: the premium side and the claim side
 * both rely on it while setting their own thresholds independently.
 */
const UNENCHANTED = 0;

export function enchantmentLevelOf(item: Item): number {
  return item.enchantment ?? UNENCHANTED;
}
