export interface Customer {
  yearsWithMHPCO: number;
}

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface QuoteInput {
  customer: Customer;
  items: Item[];
  contractIndex: number;
}

const BASE_PREMIUMS: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);
const BLOCK_SIZE = 3;
const BLOCK_PREMIUM = 60;
const PROCESSING_FEE = 5;

const HIGH_ENCHANTMENT_THRESHOLD = 5;
const LOYALTY_YEARS_THRESHOLD = 2;

const CURSED_SURCHARGE_RATE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE_RATE = 0.3;
const LOYALTY_DISCOUNT_RATE = 0.2;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;

export function isComponentType(type: string): boolean {
  return COMPONENT_TYPES.has(type);
}

export function baseInsuranceValue(type: string): number {
  const insuranceValues: Record<string, number> = {
    sword: 1000,
    amulet: 600,
    staff: 800,
    potion: 400,
    rune: 250,
    moonstone: 250,
  };
  const value = insuranceValues[type];
  if (value === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return value;
}

function basePremiumOfType(type: string): number {
  const base = BASE_PREMIUMS[type];
  if (base === undefined) {
    throw new Error(`Unknown item type: ${type}`);
  }
  return base;
}

function policyBasePremium(items: Item[]): number {
  const componentCounts = new Map<string, number>();
  let nonComponentBase = 0;
  for (const item of items) {
    if (isComponentType(item.type)) {
      componentCounts.set(item.type, (componentCounts.get(item.type) ?? 0) + 1);
    } else {
      nonComponentBase += basePremiumOfType(item.type);
    }
  }
  let componentBase = 0;
  for (const [type, count] of componentCounts) {
    componentBase += count === BLOCK_SIZE ? BLOCK_PREMIUM : count * basePremiumOfType(type);
  }
  return nonComponentBase + componentBase;
}

function itemModifierSurcharge(item: Item): number {
  const base = basePremiumOfType(item.type);
  let surcharge = 0;
  if (item.cursed) surcharge += base * CURSED_SURCHARGE_RATE;
  if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
    surcharge += base * HIGH_ENCHANTMENT_SURCHARGE_RATE;
  }
  return surcharge;
}

function policyModifierAdjustment(policyBase: number, customer: Customer, contractIndex: number): number {
  let adjustment = policyBase * FIRST_INSURANCE_SURCHARGE_RATE;
  if (customer.yearsWithMHPCO >= LOYALTY_YEARS_THRESHOLD) {
    adjustment -= policyBase * LOYALTY_DISCOUNT_RATE;
  }
  if (contractIndex > 0) {
    adjustment -= policyBase * FOLLOW_UP_DISCOUNT_RATE;
  }
  return adjustment;
}

export function quote(input: QuoteInput): number {
  // Eagerly validate item types so unknown ones throw before any computation.
  for (const item of input.items) {
    basePremiumOfType(item.type);
  }
  const policyBase = policyBasePremium(input.items);
  const itemSurcharges = input.items.reduce(
    (sum, item) => sum + itemModifierSurcharge(item),
    0,
  );
  const policyAdjustment = policyModifierAdjustment(policyBase, input.customer, input.contractIndex);
  const total = policyBase + itemSurcharges + policyAdjustment + PROCESSING_FEE;
  return Math.ceil(total);
}
