// The MHPCO price list: insurance values and base premiums per item type.

export const ITEM_BASE_PREMIUMS: Record<string, number | undefined> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
};

export const COMPONENT_TYPES = ["rune", "moonstone"];
export const COMPONENT_BASE_PREMIUM = 25;

export const INSURANCE_VALUES: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  rune: 250,
};
