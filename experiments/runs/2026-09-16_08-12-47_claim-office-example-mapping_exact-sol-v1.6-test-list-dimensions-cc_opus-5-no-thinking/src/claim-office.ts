import { componentGroupBasePremiumInG } from "./component-block.js";
import { policyModifierPercent } from "./customer-modifiers.js";
export { createPolicy, type Policy } from "./policy.js";
export { settleClaim, type Damage, type Incident, type Settlement } from "./claim.js";
export { runScenario, type Scenario, type Step, type StepResult } from "./scenario.js";
export type { Customer } from "./customer.js";
import type { Customer } from "./customer.js";
import { riskSurchargeInG } from "./item-risk.js";
export type { Item } from "./item.js";
import type { Item } from "./item.js";
import { basePremiumOf, isComponent } from "./price-list.js";
import { add, multiply, rational, roundUp, type Rational } from "./rational.js";

const PROCESSING_FEE_IN_G = 5;
const PERCENT = 100;

const PROCESSING_FEE = rational(PROCESSING_FEE_IN_G);

function countByType(items: Item[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(item.type, (counts.get(item.type) ?? 0) + 1);
  return counts;
}

function policyBasePremiumInG(items: Item[]): number {
  const mainItems = items.filter((item) => !isComponent(item.type));
  const mainTotal = mainItems.reduce((total, item) => total + basePremiumOf(item.type), 0);

  const components = items.filter((item) => isComponent(item.type));
  let componentTotal = 0;
  for (const [itemType, count] of countByType(components)) {
    componentTotal += componentGroupBasePremiumInG(count, itemType);
  }
  return mainTotal + componentTotal;
}

export function quote(
  customer: Customer,
  items: Item[],
  previousContractCount = 0,
): number {
  const basePremiumInG = policyBasePremiumInG(items);
  const riskSurcharges = items.reduce((total, item) => total + riskSurchargeInG(item), 0);
  const policyModifiers = multiply(
    rational(basePremiumInG),
    rational(policyModifierPercent(customer, previousContractCount), PERCENT),
  );
  const premium = add(rational(basePremiumInG + riskSurcharges), policyModifiers);
  return roundUp(add(premium, PROCESSING_FEE));
}
