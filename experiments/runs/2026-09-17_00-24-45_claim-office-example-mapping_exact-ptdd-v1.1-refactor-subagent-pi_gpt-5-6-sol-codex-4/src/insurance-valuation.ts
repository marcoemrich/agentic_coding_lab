const INSURANCE_VALUE_BY_ITEM_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

export interface InsuredItem {
  type: string;
}

function insuranceValueOf(item: InsuredItem): number {
  return INSURANCE_VALUE_BY_ITEM_TYPE[item.type];
}

export function calculateInsuranceSum(items: InsuredItem[]): number {
  return items.reduce((sum, item) => sum + insuranceValueOf(item), 0);
}
