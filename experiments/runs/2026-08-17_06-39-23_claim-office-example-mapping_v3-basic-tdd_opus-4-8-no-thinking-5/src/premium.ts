export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteContext {
  customer: Customer;
  /** How many quotes (contracts) the customer has already made before this one. */
  priorContracts: number;
}

const MAIN_ITEM_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

const COMPONENT_TYPES = new Set(['rune', 'moonstone']);
const COMPONENT_PREMIUM = 25;
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

// Item-specific surcharge fractions.
const CURSE_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;

// Policy-wide modifier fractions.
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const FIRST_INSURANCE_SURCHARGE = 0.1;
const FOLLOWUP_CONTRACT_DISCOUNT = 0.15;

export class UnknownItemTypeError extends Error {
  constructor(type: string) {
    super(`Unknown item type: ${type}`);
    this.name = 'UnknownItemTypeError';
  }
}

function isComponent(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

function isMainItem(type: string): boolean {
  return Object.prototype.hasOwnProperty.call(MAIN_ITEM_PREMIUMS, type);
}

/** Item-specific surcharge fraction for a main item (cursed, high enchantment). */
function itemSurchargeFraction(item: Item): number {
  let fraction = 0;
  if (item.cursed) {
    fraction += CURSE_SURCHARGE;
  }
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    fraction += HIGH_ENCHANTMENT_SURCHARGE;
  }
  return fraction;
}

/**
 * Base premium for a group of alike components.
 *
 * The block discount applies only when a group has *exactly* BLOCK_SIZE alike
 * components (e.g. exactly 3 runes → 60 G). Any other count is charged per
 * component (4 runes → 100 G, 7 runes → 175 G).
 */
function componentBasePremium(count: number): number {
  if (count === BLOCK_SIZE) {
    return BLOCK_PREMIUM;
  }
  return count * COMPONENT_PREMIUM;
}

/** Group component items by type and count how many of each there are. */
function componentCounts(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (isComponent(item.type)) {
      counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
    }
  }
  return counts;
}

interface PolicyBase {
  /** Sum of all item base premiums. */
  policyBase: number;
  /** Sum of item-specific surcharges (curse, high enchantment). */
  itemSurcharges: number;
}

/** Compute the policy base premium and item-specific surcharges. */
function computePolicyBase(items: Item[]): PolicyBase {
  let policyBase = 0;
  let itemSurcharges = 0;

  for (const item of items) {
    if (isMainItem(item.type)) {
      const base = MAIN_ITEM_PREMIUMS[item.type];
      policyBase += base;
      itemSurcharges += base * itemSurchargeFraction(item);
    }
  }

  for (const count of componentCounts(items).values()) {
    policyBase += componentBasePremium(count);
  }

  return { policyBase, itemSurcharges };
}

/**
 * Policy-wide modifier fraction applied to the policy base premium.
 *
 * Loyalty discount (≥ 2 years), first-insurance surcharge (every quote), and
 * follow-up-contract discount (every quote after the customer's first).
 */
function policyModifierFraction(ctx: QuoteContext): number {
  let fraction = FIRST_INSURANCE_SURCHARGE;
  if (ctx.customer.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    fraction -= LOYALTY_DISCOUNT;
  }
  if (ctx.priorContracts >= 1) {
    fraction -= FOLLOWUP_CONTRACT_DISCOUNT;
  }
  return fraction;
}

function assertKnownItemTypes(items: Item[]): void {
  for (const item of items) {
    if (!isMainItem(item.type) && !isComponent(item.type)) {
      throw new UnknownItemTypeError(item.type);
    }
  }
}

/**
 * Compute the total premium for a quote.
 *
 * - Item base premiums are summed into the policy base premium.
 * - Item-specific modifiers (cursed, high enchantment) apply to each item's
 *   base premium.
 * - Policy-wide modifiers (loyalty, first insurance, follow-up contract) apply
 *   to the policy base premium.
 * - A processing fee is added at the very end and the result is rounded up
 *   (in the MHPCO's favor).
 */
export function computePremium(items: Item[], ctx: QuoteContext): number {
  assertKnownItemTypes(items);

  const { policyBase, itemSurcharges } = computePolicyBase(items);
  const policyModifiers = policyBase * policyModifierFraction(ctx);

  const total = policyBase + itemSurcharges + policyModifiers + PROCESSING_FEE;
  return Math.ceil(total);
}
