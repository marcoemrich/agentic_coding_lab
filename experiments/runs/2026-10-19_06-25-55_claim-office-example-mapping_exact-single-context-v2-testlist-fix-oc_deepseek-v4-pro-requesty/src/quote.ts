const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const COMPONENT_BLOCK_COUNT = 3;
const COMPONENT_BLOCK_PREMIUM = 60;
const COMPONENT_UNIT_PREMIUM = 25;

const CURSED_SURCHARGE = 0.5;
const HIGH_ENCHANTMENT_SURCHARGE = 0.3;
const HIGH_ENCHANTMENT_THRESHOLD = 5;
const FIRST_INSURANCE_RATE = 0.1;
const LOYALTY_DISCOUNT = 0.2;
const LOYALTY_THRESHOLD = 2;
const FOLLOW_UP_DISCOUNT = 0.15;
const FOLLOW_UP_CONTRACT_THRESHOLD = 2;
const PROCESSING_FEE = 5;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export function basePremium(items: Item[]): number {
  const components: Record<string, number> = {};
  let mainPremium = 0;

  for (const item of items) {
    assertKnownType(item.type);
    if (COMPONENT_TYPES.has(item.type)) {
      components[item.type] = (components[item.type] ?? 0) + 1;
    } else {
      mainPremium += BASE_PREMIUM[item.type];
    }
  }

  let componentPremium = 0;
  for (const type of Object.keys(components)) {
    const count = components[type];
    componentPremium +=
      count === COMPONENT_BLOCK_COUNT ? COMPONENT_BLOCK_PREMIUM : count * COMPONENT_UNIT_PREMIUM;
  }

  return mainPremium + componentPremium;
}

export function quote(customer: Customer, items: Item[], contractNumber: number): number {
  const policyBase = basePremium(items);
  const itemSurcharge = computeItemSurcharge(items);
  const policyModifier = computePolicyModifier(customer.yearsWithMHPCO, contractNumber, policyBase);

  return Math.ceil(policyBase + itemSurcharge + policyModifier + PROCESSING_FEE);
}

function computeItemSurcharge(items: Item[]): number {
  let surcharge = 0;
  for (const item of items) {
    if (item.cursed) surcharge += CURSED_SURCHARGE * BASE_PREMIUM[item.type];
    if ((item.enchantment ?? 0) >= HIGH_ENCHANTMENT_THRESHOLD) {
      surcharge += HIGH_ENCHANTMENT_SURCHARGE * BASE_PREMIUM[item.type];
    }
  }
  return surcharge;
}

function computePolicyModifier(years: number, contractNumber: number, policyBase: number): number {
  let modifier = FIRST_INSURANCE_RATE * policyBase;
  if (years >= LOYALTY_THRESHOLD) modifier -= LOYALTY_DISCOUNT * policyBase;
  if (contractNumber >= FOLLOW_UP_CONTRACT_THRESHOLD) modifier -= FOLLOW_UP_DISCOUNT * policyBase;
  return modifier;
}

function assertKnownType(type: string): void {
  if (!(type in BASE_PREMIUM)) {
    throw new Error(`unknown item type: ${type}`);
  }
}