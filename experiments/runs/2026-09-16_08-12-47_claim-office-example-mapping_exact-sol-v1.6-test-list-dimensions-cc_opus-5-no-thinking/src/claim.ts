import type { Item } from "./item.js";
import { drawDownCap, type Policy } from "./policy.js";
import { add, rational, roundDown, subtract, type Rational } from "./rational.js";
import { reimbursableAmount } from "./reimbursement.js";

/** A deductible of 100 G applies per damage event. */
const DEDUCTIBLE_IN_G = 100;

export interface Damage {
  itemType: string;
  amount: number;
}

export interface Incident {
  cause: string;
  damages: Damage[];
}

export interface Settlement {
  readonly payout: number;
  readonly remainingCap: number;
}

/** Each damage entry is settled against a distinct insured item. */
function claimDamagedItem(uninjured: Item[], damage: Damage): Item {
  const index = uninjured.findIndex((insured) => insured.type === damage.itemType);
  if (index < 0) throw new Error(`Item not covered by the policy: ${damage.itemType}`);
  return uninjured.splice(index, 1)[0];
}

function payoutForDamage(item: Item, damage: Damage): Rational {
  if (damage.amount < 0) throw new Error(`Negative damage amount: ${damage.amount}`);
  return subtract(reimbursableAmount(item, damage.amount), rational(DEDUCTIBLE_IN_G));
}

export function settleClaim(policy: Policy, incident: Incident): Settlement {
  const uninjured = [...policy.items];
  const desiredPayout = incident.damages.reduce<Rational>(
    (total, damage) => add(total, payoutForDamage(claimDamagedItem(uninjured, damage), damage)),
    rational(0),
  );
  const payout = drawDownCap(policy, roundDown(desiredPayout));
  return { payout, remainingCap: policy.remainingCapInG };
}
