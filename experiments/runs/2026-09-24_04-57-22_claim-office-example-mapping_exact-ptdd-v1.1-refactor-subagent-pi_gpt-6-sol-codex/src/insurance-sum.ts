import { insuranceValueFor } from './insurance-value.js';

type Item = { type: string };

export function policyInsuranceSum(items: Item[]): number {
  return items.reduce((sum, item) => sum + insuranceValueFor(item), 0);
}
