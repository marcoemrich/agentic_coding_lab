import type { Item } from "./quote.js";

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface ClaimInput {
  policyItems: Item[];
  incident: Incident;
}

const DEDUCTIBLE = 100;
const DRAGON_MATERIAL = "dragon";
const CLAIM_HIGH_ENCHANTMENT_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT_RATE = 0.5;
const FULL_REIMBURSEMENT_RATE = 1.0;

const itemByType = (items: Item[], type: string): Item | undefined =>
  items.find((i) => i.type === type);

const isDragon = (item: Item | undefined): boolean =>
  item?.material === DRAGON_MATERIAL;

const isHighlyEnchanted = (item: Item | undefined): boolean =>
  (item?.enchantment ?? 0) >= CLAIM_HIGH_ENCHANTMENT_THRESHOLD;

const reimbursableForDamage = (item: Item | undefined, damage: Damage): number => {
  if (isHighlyEnchanted(item)) return damage.amount * HIGH_ENCHANTMENT_REIMBURSEMENT_RATE;
  return damage.amount * FULL_REIMBURSEMENT_RATE;
};

export const claim = (input: ClaimInput): number => {
  const reimbursable = input.incident.damages.reduce((sum, d) => {
    return sum + reimbursableForDamage(itemByType(input.policyItems, d.itemType), d);
  }, 0);
  const allDragon = input.incident.damages.every((d) =>
    isDragon(itemByType(input.policyItems, d.itemType)),
  );
  const deductible = allDragon ? 0 : DEDUCTIBLE;
  return Math.max(0, reimbursable - deductible);
};
