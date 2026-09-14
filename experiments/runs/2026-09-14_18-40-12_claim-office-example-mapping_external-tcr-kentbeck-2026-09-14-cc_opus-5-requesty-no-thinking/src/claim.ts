import { Item, isComponent } from './premium';

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
};

const COMPONENT_INSURANCE_VALUE = 250;
const DEDUCTIBLE = 100;
const CAP_FACTOR = 2;
const HIGH_ENCHANTMENT_CLAIM_THRESHOLD = 8;
const HIGH_ENCHANTMENT_REIMBURSEMENT = 0.5;

export function itemInsuranceValue(item: Item): number {
  if (isComponent(item.type)) return COMPONENT_INSURANCE_VALUE;
  const value = INSURANCE_VALUE[item.type];
  if (value === undefined) throw new Error(`unknown item type: ${item.type}`);
  return value;
}

export function insuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + itemInsuranceValue(item), 0);
}

export function policyCap(items: Item[]): number {
  return CAP_FACTOR * insuranceSum(items);
}

export function reimbursement(item: Item, amount: number): number {
  const covered =
    (item.enchantment ?? 0) >= HIGH_ENCHANTMENT_CLAIM_THRESHOLD
      ? amount * HIGH_ENCHANTMENT_REIMBURSEMENT
      : amount;
  return Math.max(0, covered - DEDUCTIBLE);
}

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Policy {
  items: Item[];
  remainingCap: number;
}

export function createPolicy(items: Item[]): Policy {
  return { items, remainingCap: policyCap(items) };
}

function matchDamagesToItems(policy: Policy, damages: Damage[]): Item[] {
  const available = [...policy.items];
  return damages.map((damage) => {
    const index = available.findIndex((item) => item.type === damage.itemType);
    if (index === -1) {
      const insured = policy.items.some((item) => item.type === damage.itemType);
      throw new Error(
        insured
          ? `more damages of type ${damage.itemType} than the policy covers`
          : `item not covered by the policy: ${damage.itemType}`,
      );
    }
    return available.splice(index, 1)[0];
  });
}

export function settleClaim(policy: Policy, incident: Incident): number {
  for (const damage of incident.damages) {
    if (damage.amount < 0) throw new Error(`negative damage amount: ${damage.amount}`);
  }
  const items = matchDamagesToItems(policy, incident.damages);
  const desired = items.reduce(
    (sum, item, i) => sum + reimbursement(item, incident.damages[i].amount),
    0,
  );
  const payout = Math.floor(Math.min(desired, policy.remainingCap));
  policy.remainingCap -= payout;
  return payout;
}
