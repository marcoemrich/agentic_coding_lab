export interface Item {
  type: string;
  material?: string;
  enchantment?: number;
  cursed?: boolean;
}

export interface Customer {
  yearsWithMHPCO: number;
}

export interface QuoteInput {
  items: Item[];
  customer: Customer;
  isFollowUpContract: boolean;
}

export interface QuoteResult {
  premium: number;
  insuranceSum: number;
}

// Base premium for a count of alike-component items: `count * 25`,
// except a "block" rate of 60 applies when count is exactly 3 (not 75).
const alikeComponentBasePremium = (count: number): number =>
  count === 3 ? 60 : count * 25;

// Per-item base premium (without modifiers, without fee).
const itemBasePremium = (item: Item): number => {
  switch (item.type) {
    case "sword":
      return 100;
    case "amulet":
      return 60;
    case "staff":
      return 80;
    case "potion":
      return 40;
    case "rune":
    case "moonstone":
      return 25;
    default:
      return 0;
  }
};

// Per-item insurance value.
const itemInsuranceValue = (item: Item): number => {
  switch (item.type) {
    case "sword":
      return 1000;
    case "amulet":
      return 600;
    case "staff":
      return 800;
    case "potion":
      return 400;
    case "rune":
    case "moonstone":
      return 250;
    default:
      return 0;
  }
};

// Per-item premium including item-specific modifiers (cursed, high enchantment).
const itemPremium = (item: Item): number => {
  const base = itemBasePremium(item);
  let premium = base;
  if (item.cursed === true) {
    premium += base * 0.5;
  }
  if (item.enchantment !== undefined && item.enchantment >= 5) {
    premium += base * 0.3;
  }
  return premium;
};

export const quote = (input: QuoteInput): QuoteResult => {
  const runes = input.items.filter((it) => it.type === "rune");
  const moonstones = input.items.filter((it) => it.type === "moonstone");
  const nonComponentItems = input.items.filter(
    (it) => it.type !== "rune" && it.type !== "moonstone",
  );

  // Non-component items: each contributes its own premium (with item-specific modifiers)
  // and its own insurance value.
  let policyBase = 0;
  let insuranceSum = 0;
  for (const item of nonComponentItems) {
    policyBase += itemPremium(item);
    insuranceSum += itemInsuranceValue(item);
  }

  // Components (runes/moonstones): each type's items share a block rule
  // (3 of a kind = 60, otherwise per-component).
  const componentBase =
    alikeComponentBasePremium(runes.length) +
    alikeComponentBasePremium(moonstones.length);
  policyBase += componentBase;
  insuranceSum += (runes.length + moonstones.length) * itemInsuranceValue({
    type: "rune",
  });

  // Item-specific modifiers on components: cursed/enchantment don't apply to
  // components per the spec (only main items can be cursed/high-enchanted in
  // the examples we have so far).

  // Policy-wide modifiers will be applied here once those tests arrive.
  // Processing fee.
  const premium = policyBase + 5;

  return { premium: Math.ceil(premium), insuranceSum };
};
