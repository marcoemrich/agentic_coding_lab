const PROCESSING_FEE = 5;
const FIRST_INSURANCE_SURCHARGE_RATE = 0.1;
const BLOCK_SIZE = 3;
const BLOCK_BASE_PREMIUM = 60;

const COMPONENT_TYPES = new Set(["rune", "moonstone"]);

const BASE_PREMIUM: Record<string, number> = {
  sword: 100,
  amulet: 60,
  staff: 80,
  potion: 40,
  rune: 25,
  moonstone: 25,
};

const withFirstInsurance = (base: number): number =>
  base + base * FIRST_INSURANCE_SURCHARGE_RATE;

const groupBase = (type: string, count: number): number => {
  if (COMPONENT_TYPES.has(type) && count === BLOCK_SIZE) {
    return withFirstInsurance(BLOCK_BASE_PREMIUM);
  }
  return count * withFirstInsurance(BASE_PREMIUM[type]);
};

const INSURANCE_VALUE: Record<string, number> = {
  sword: 1000,
  amulet: 600,
  staff: 800,
  potion: 400,
  rune: 250,
  moonstone: 250,
};

const DEDUCTIBLE = 100;

export const runScenario = (input: any): { results: unknown[] } => {
  const results: unknown[] = [];
  const policies: { items: any[]; cap: number; remainingCap: number }[] = [];
  for (let stepIndex = 0; stepIndex < input.steps.length; stepIndex++) {
    const step = input.steps[stepIndex];
    if (step.op === "claim") {
      const policy = policies[step.policy];
      const policyCountsByType = new Map<string, number>();
      for (const it of policy.items) {
        policyCountsByType.set(it.type, (policyCountsByType.get(it.type) ?? 0) + 1);
      }
      const damageCountsByType = new Map<string, number>();
      for (const damage of step.incident.damages) {
        if (damage.amount < 0) {
          throw new Error(`Negative damage amount: ${damage.amount}`);
        }
        damageCountsByType.set(
          damage.itemType,
          (damageCountsByType.get(damage.itemType) ?? 0) + 1,
        );
      }
      for (const [type, count] of damageCountsByType) {
        const insuredCount = policyCountsByType.get(type) ?? 0;
        if (insuredCount === 0) {
          throw new Error(`Claim references item not on policy: ${type}`);
        }
        if (count > insuredCount) {
          throw new Error(`More damages of type ${type} than insured`);
        }
      }
      let totalPayout = 0;
      for (const damage of step.incident.damages) {
        const policyItem = policy.items.find((it) => it.type === damage.itemType);
        let reimbursement = damage.amount;
        if (policyItem && policyItem.enchantment >= 8) {
          reimbursement = 0.5 * damage.amount;
        }
        const payout = Math.max(0, reimbursement - DEDUCTIBLE);
        totalPayout += payout;
      }
      const cappedPayout = Math.min(totalPayout, policy.remainingCap);
      const flooredPayout = Math.floor(cappedPayout);
      policy.remainingCap -= flooredPayout;
      results.push({ payout: flooredPayout, remainingCap: policy.remainingCap });
      continue;
    }
    const items: { type: string; cursed?: boolean }[] = step.items;
    for (const item of items) {
      if (!(item.type in BASE_PREMIUM)) {
        throw new Error(`Unknown item type: ${item.type}`);
      }
    }
    const countsByType = new Map<string, number>();
    for (const item of items) {
      countsByType.set(item.type, (countsByType.get(item.type) ?? 0) + 1);
    }
    let premium = PROCESSING_FEE;
    let policyBase = 0;
    for (const [type, count] of countsByType) {
      premium += groupBase(type, count);
      policyBase += count * BASE_PREMIUM[type];
    }
    if (input.customer?.yearsWithMHPCO >= 2) {
      premium -= 0.2 * policyBase;
    }
    if (stepIndex >= 1) {
      premium -= 0.15 * policyBase;
    }
    for (const item of items) {
      if (item.cursed) {
        premium += 0.5 * BASE_PREMIUM[item.type];
      }
      if ((item as any).enchantment >= 5) {
        premium += 0.3 * BASE_PREMIUM[item.type];
      }
    }
    let insuranceSum = 0;
    for (const item of items) {
      insuranceSum += INSURANCE_VALUE[item.type];
    }
    const cap = 2 * insuranceSum;
    policies.push({ items, cap, remainingCap: cap });
    results.push({ premium: Math.ceil(premium) });
  }
  return { results };
};
