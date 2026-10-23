export interface QuoteItem {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

interface CatalogEntry {
  insuranceValue: number;
  basePremium: number;
}

const SWORD: CatalogEntry = { insuranceValue: 1000, basePremium: 100 };
const AMULET: CatalogEntry = { insuranceValue: 600, basePremium: 60 };
const STAFF: CatalogEntry = { insuranceValue: 800, basePremium: 80 };
const POTION: CatalogEntry = { insuranceValue: 400, basePremium: 40 };

const MAIN_ITEMS: Record<string, CatalogEntry> = {
  sword: SWORD,
  amulet: AMULET,
  staff: STAFF,
  potion: POTION,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const COMPONENT_INSURANCE_VALUE = 250;
const COMPONENT_BASE_PREMIUM = 25;
const ALIKE_BLOCK_SIZE = 3;
const ALIKE_BLOCK_PREMIUM = 60;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;

const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const LOYALTY_DISCOUNT_RATE = 0.2;
const LOYALTY_THRESHOLD_YEARS = 2;
const PROCESSING_FEE = 5;

export interface QuoteRequest {
  items: QuoteItem[];
  yearsWithMHPCO: number;
  followUpContract: boolean;
}

function assertKnownItemType(type: string): void {
  if (!(type in MAIN_ITEMS) && !COMPONENT_TYPES.has(type)) {
    throw new Error(`Unknown item type: ${type}`);
  }
}

function catalogBasePremium(item: QuoteItem): number {
  const main = MAIN_ITEMS[item.type];
  return main ? main.basePremium : COMPONENT_BASE_PREMIUM;
}

function componentGroupPremium(count: number): number {
  return count === ALIKE_BLOCK_SIZE ? ALIKE_BLOCK_PREMIUM : count * COMPONENT_BASE_PREMIUM;
}

export function basePremium(items: QuoteItem[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    assertKnownItemType(item.type);
    counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  }
  let total = 0;
  for (const [type, count] of counts) {
    const main = MAIN_ITEMS[type];
    if (main) {
      total += main.basePremium * count;
    } else {
      total += componentGroupPremium(count);
    }
  }
  return total;
}

export function insuranceValueOf(type: string): number {
  const main = MAIN_ITEMS[type];
  return main ? main.insuranceValue : COMPONENT_INSURANCE_VALUE;
}

function itemSpecificSurcharge(item: QuoteItem): number {
  const itemBase = catalogBasePremium(item);
  let surcharge = 0;
  if (item.cursed) surcharge += itemBase * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) surcharge += itemBase * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  return surcharge;
}

export function quotePremium(request: QuoteRequest): number {
  const base = basePremium(request.items);
  let premium = base;
  for (const item of request.items) {
    premium += itemSpecificSurcharge(item);
  }
  // Every item in a quote is treated as a first insurance, regardless of history.
  premium += base * FIRST_INSURANCE_RATE;
  if (request.followUpContract) {
    premium -= base * FOLLOW_UP_DISCOUNT_RATE;
  }
  if (request.yearsWithMHPCO >= LOYALTY_THRESHOLD_YEARS) {
    premium -= base * LOYALTY_DISCOUNT_RATE;
  }
  premium += PROCESSING_FEE;
  return Math.ceil(premium);
}
