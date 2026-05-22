const PROCESSING_FEE = 5;
const FIRST_INSURANCE_RATE = 0.1;
const FOLLOW_UP_DISCOUNT_RATE = 0.15;
const DEDUCTIBLE = 100;

const BASE_PREMIUM_BY_TYPE: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const INSURANCE_VALUE_BY_TYPE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

interface Policy {
  items: any[];
  cap: number;
  payoutSoFar: number;
}

export function processScenario(input: any): unknown {
  const results: Array<{ premium: number } | { payout: number; remainingCap: number }> = [];
  const policies: Policy[] = [];
  let quoteCount = 0;
  for (const step of input.steps) {
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const policyCountsByType: Record<string, number> = {};
      for (const it of policy.items) {
        policyCountsByType[it.type] = (policyCountsByType[it.type] ?? 0) + 1;
      }
      for (const d of step.incident.damages) {
        if (d.amount < 0) {
          throw new Error(`Damage amount cannot be negative`);
        }
      }
      const damageCountsByType: Record<string, number> = {};
      for (const d of step.incident.damages) {
        damageCountsByType[d.itemType] = (damageCountsByType[d.itemType] ?? 0) + 1;
      }
      for (const [type, count] of Object.entries(damageCountsByType)) {
        if (count > (policyCountsByType[type] ?? 0)) {
          throw new Error(`Claim has more ${type} entries than policy covers`);
        }
      }
      let payout = 0;
      for (const damage of step.incident.damages) {
        const item = policy.items.find((it) => it.type === damage.itemType);
        let reimbursement: number;
        if (item.enchantment >= 8) {
          reimbursement = damage.amount * 0.5;
        } else if (item.material === "dragon") {
          reimbursement = damage.amount;
        } else {
          reimbursement = damage.amount;
        }
        payout += Math.floor(reimbursement - DEDUCTIBLE);
      }
      const remainingBefore = policy.cap - policy.payoutSoFar;
      if (payout > remainingBefore) payout = remainingBefore;
      policy.payoutSoFar += payout;
      results.push({ payout, remainingCap: Math.max(0, policy.cap - policy.payoutSoFar) });
      continue;
    }
    const items = step.items;
    for (const it of items) {
      if (!(it.type in BASE_PREMIUM_BY_TYPE)) {
        throw new Error(`Unknown item type: ${it.type}`);
      }
    }
    const insuranceSum = items.reduce((s: number, it: any) => s + (INSURANCE_VALUE_BY_TYPE[it.type] ?? 0), 0);
    policies.push({ items, cap: 2 * insuranceSum, payoutSoFar: 0 });
    if (items.length === 0) {
      results.push({ premium: PROCESSING_FEE });
      quoteCount++;
      continue;
    }
    const countsByType: Record<string, number> = {};
    for (const item of items) {
      countsByType[item.type] = (countsByType[item.type] ?? 0) + 1;
    }
    let basePremium = 0;
    for (const [type, count] of Object.entries(countsByType)) {
      if ((type === "rune" || type === "moonstone") && count === 3) {
        basePremium += 60;
      } else {
        basePremium += count * BASE_PREMIUM_BY_TYPE[type];
      }
    }
    let itemSurcharges = 0;
    for (const item of items) {
      if (item.cursed) {
        itemSurcharges += BASE_PREMIUM_BY_TYPE[item.type] * 0.5;
      }
      if (item.enchantment >= 5) {
        itemSurcharges += BASE_PREMIUM_BY_TYPE[item.type] * 0.3;
      }
    }
    const loyaltyDiscount = input.customer.yearsWithMHPCO >= 2 ? basePremium * 0.2 : 0;
    const followUpDiscount = quoteCount > 0 ? basePremium * FOLLOW_UP_DISCOUNT_RATE : 0;
    const premium = Math.ceil(basePremium + itemSurcharges + basePremium * FIRST_INSURANCE_RATE - loyaltyDiscount - followUpDiscount + PROCESSING_FEE);
    results.push({ premium });
    quoteCount++;
  }
  return { results };
}
